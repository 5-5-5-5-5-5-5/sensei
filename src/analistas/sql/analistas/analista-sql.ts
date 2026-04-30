// SPDX-License-Identifier: MIT
import type { Ocorrencia } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

/**
 * Analista de SQL
 * Detecta práticas inseguras, problemas de performance, transações e comandos perigosos em arquivos SQL.
 */
export const analistaSql = criarAnalista({
  nome: 'analista-sql',
  categoria: 'database',
  descricao: 'Analisa arquivos SQL em busca de injeções, performance ruim, transações e comandos perigosos.',
  test: (relPath: string) => /\.(sql|pgsql|mysql|sqlite|ddl|dml)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<Ocorrencia[]> => {
    const ocorrencias: Ocorrencia[] = [];
    const linhas = src.split('\n');
    const isMigrationFile = /migration|alter|create\s+table/i.test(relPath);

    linhas.forEach((linha, index) => {
      const numeroLinha = index + 1;
      const linhaTrim = linha.trim().toLowerCase();
      const linhasResto = linhas.slice(index).join(' ').toLowerCase();

      // 1. DELETE/UPDATE sem WHERE (Crítico)
      if ((linhaTrim.startsWith('delete ') || linhaTrim.startsWith('update ')) &&
          !linhaTrim.includes('where') &&
          !linha.includes('--') && !linha.includes('/*')) {
        const proximaLinha = linhas[index + 1]?.trim().toLowerCase() || '';
        if (!proximaLinha.includes('where')) {
          ocorrencias.push(criarOcorrencia({
            tipo: 'vulnerabilidade-seguranca',
            nivel: 'erro',
            mensagem: 'Comando DELETE/UPDATE sem cláusula WHERE detectado. Isso pode apagar ou alterar todos os dados da tabela.',
            relPath,
            linha: numeroLinha,
            sugestao: 'Sempre utilize a cláusula WHERE para restringir o impacto do comando.'
          }));
        }
      }

      // 2. SELECT * (Performance/Manutenibilidade)
      if (/\bselect\s+\*\s+from\b/i.test(linha)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'problema-performance',
          nivel: 'aviso',
          mensagem: 'Uso de "SELECT *" detectado. Isso aumenta o tráfego de rede e pode quebrar se a estrutura da tabela mudar.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Liste explicitamente as colunas necessárias.'
        }));
      }

      // 3. Senhas ou segredos em scripts (Segurança)
      if (/\b(password|senha|secret|key|token|credential)\b\s*[:=]\s*['"].*['"]/i.test(linha) ||
          /identified\s+by\s+['"].*['"]/i.test(linha)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'vulnerabilidade-seguranca',
          nivel: 'erro',
          mensagem: 'Possível credencial ou segredo hardcoded em script SQL.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Utilize variáveis de ambiente ou sistemas de gerenciamento de segredos.'
        }));
      }

      // 4. Injeção de SQL via strings concatenadas
      if (/\s\+\s*['"`].*['"`]/.test(linha) && /select|insert|update|delete/i.test(linha)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'sql-injection',
          nivel: 'erro',
          mensagem: 'Possível injeção de SQL detectada via concatenação de strings.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Utilize consultas parametrizadas ou placeholders.'
        }));
      }

      // 5. Tabelas/objetos sem IF NOT EXISTS
      if (/create\s+(table|procedure|view|function|index)\s+\w+/i.test(linha) && !/if\s+not\s+exists/i.test(linha)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'codigo-fragil',
          nivel: 'info',
          mensagem: 'Criação de objeto sem "IF NOT EXISTS". Pode causar erro se o script for reexecutado.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Utilize "CREATE TABLE IF NOT EXISTS ..." para maior idempotência.'
        }));
      }

      // 6. TRUNCATE TABLE (Risco)
      if (/\btruncat(?:e|ing)\s+table\b/i.test(linha)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'vulnerabilidade-seguranca',
          nivel: 'aviso',
          mensagem: 'Uso de TRUNCATE TABLE detectado. Este comando não pode ser revertido por ROLLBACK em alguns bancos e limpa toda a tabela.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Certifique-se de que a limpeza total é intencional e prefira DELETE com WHERE se precisar de reversibilidade.'
        }));
      }

      // 7. VARCHAR sem tamanho especificado
      if (/\bvarchar\b\s*(\(|\s|$)/i.test(linha) && !/\bvarchar\(\d+\)/i.test(linha)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'codigo-fragil',
          nivel: 'info',
          mensagem: 'VARCHAR sem especificação de tamanho máximo.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Defina um tamanho máximo apropriado para otimizar o armazenamento.'
        }));
      }

      // 8. TRANSACTION sem COMMIT/ROLLBACK explícito
      if (/\bbegin\s+transaction\b/i.test(linha) || /\bstart\s+transaction\b/i.test(linha)) {
        let hasCommitOrRollback = false;
        for (let j = index + 1; j < linhas.length; j++) {
          if (/\b(commit|rollback)\b/i.test(linhas[j])) {
            hasCommitOrRollback = true;
            break;
          }
        }
        if (!hasCommitOrRollback) {
          ocorrencias.push(criarOcorrencia({
            tipo: 'vulnerabilidade-dados',
            nivel: 'aviso',
            mensagem: 'Transação BEGIN sem COMMIT ou ROLLBACK explícito detectado.',
            relPath,
            linha: numeroLinha,
            sugestao: 'Sempre finalize transações explicitamente com COMMIT ou ROLLBACK.'
          }));
        }
      }

      // 9. COMMIT/ROLLBACK sem BEGIN
      if (/\bcommit\b/i.test(linhaTrim) || /\brollback\b/i.test(linhaTrim)) {
        let hasBegin = false;
        for (let j = 0; j < index; j++) {
          if (/\b(begin|start\s+transaction)\b/i.test(linhas[j])) {
            hasBegin = true;
            break;
          }
        }
        if (!hasBegin) {
          ocorrencias.push(criarOcorrencia({
            tipo: 'codigo-fragil',
            nivel: 'info',
            mensagem: 'COMMIT ou ROLLBACK sem BEGIN TRANSACTION explícito.',
            relPath,
            linha: numeroLinha,
            sugestao: 'Use BEGIN TRANSACTION para transações explícitas.'
          }));
        }
      }

      // 10. LOCK sem TRANSACTION
      if (/\bfor\s+update\b/i.test(linhaTrim) || /\block\s+in\s+share\s+mode\b/i.test(linhaTrim)) {
        let hasTransaction = false;
        for (let j = 0; j < index; j++) {
          if (/\b(begin|start\s+transaction)\b/i.test(linhas[j])) {
            hasTransaction = true;
            break;
          }
        }
        if (!hasTransaction) {
          ocorrencias.push(criarOcorrencia({
            tipo: 'codigo-fragil',
            nivel: 'aviso',
            mensagem: 'Cláusula de locking (FOR UPDATE/LOCK) usada fora de uma transação explícita.',
            relPath,
            linha: numeroLinha,
            sugestao: 'Use BEGIN TRANSACTION antes de operações com locking.'
          }));
        }
      }

      // 11. LIKE sem escape (vulnerável a SQL injection)
      if (/\blike\s+['"]%/i.test(linhaTrim) && !/%ESCAPE/i.test(linhaTrim) && !linha.includes('--')) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'sql-injection',
          nivel: 'aviso',
          mensagem: 'Padrão LIKE sem escape - vulnerável a SQL injection.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Use ESCAPE para escapar caracteres especiais: LIKE \'%test%\' ESCAPE \'\\\'.'
        }));
      }

      // 12. Comparação de números como strings
      if (/where\s+\w+\s*=\s*['"]\d+['"]/i.test(linhaTrim) || /where\s+['"]\d+['"]\s*=\s*\w+/i.test(linhaTrim)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'problema-performance',
          nivel: 'aviso',
          mensagem: 'Comparação de número como string detectado.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Compare números diretamente sem aspas para evitar conversão implícita.'
        }));
      }

      // 13. LEFT/RIGHT JOIN sem condição de JOIN
      if (/\b(left|right|inner|cross)\s+join\b/i.test(linhaTrim) && !/on\s+\w+/i.test(linhaTrim)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'codigo-fragil',
          nivel: 'erro',
          mensagem: 'JOIN sem cláusula ON detectado.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Sempre especifique a condição de JOIN com ON.'
        }));
      }

      // 14. SELECT INTO sem LIMIT
      if (/\bselect\s+.*\s+into\b/i.test(linhaTrim) && !/\blimit\b/i.test(linhasResto)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'problema-performance',
          nivel: 'aviso',
          mensagem: 'SELECT INTO sem LIMIT pode retornar múltiplas linhas causando erro.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Adicione LIMIT 1 ou use TOP/DISTINCT para garantir uma linha.'
        }));
      }

      // 15. Subconsultas aninhadas profundas (N+1 problem)
      const nestedSelectCount = (linha.match(/select\s+/gi) || []).length;
      if (nestedSelectCount > 2) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'problema-performance',
          nivel: 'aviso',
          mensagem: 'Múltiplas subconsultas aninhadas detectadas. Considere usar JOIN ou CTE.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Subconsultas aninhadas podem causar problemas de performance.'
        }));
      }

      // 16. DROP sem IF EXISTS
      if (/\bdrop\s+(table|view|procedure|function)\b/i.test(linhaTrim) && !/if\s+exists/i.test(linhaTrim)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'vulnerabilidade-dados',
          nivel: 'erro',
          mensagem: 'DROP sem verificação IF EXISTS pode causar erro em reexecução.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Use DROP TABLE IF EXISTS para evitar erros em migrações.'
        }));
      }

      // 17. Foreign key sem índice (em CREATE TABLE)
      if (/create\s+table\b/i.test(linhaTrim)) {
        const tableBlock = linhas.slice(index, index + 50).join('\n');
        if (/foreign\s+key/i.test(tableBlock)) {
          const hasIndex = /index|key\s*\(/i.test(tableBlock);
          if (!hasIndex && index > 0) {
            ocorrencias.push(criarOcorrencia({
              tipo: 'problema-performance',
              nivel: 'info',
              mensagem: 'Tabela com FOREIGN KEY pode precisar de índice explícito para performance.',
              relPath,
              linha: numeroLinha,
              sugestao: 'Considere adicionar índices nas colunas de chave estrangeira.'
            }));
          }
        }
      }

      // 18. Coluna sem tipo definido corretamente
      if (/create\s+table\b/i.test(linhaTrim)) {
        if (/\b\d+\b(?!\s*[,)])/.test(linhaTrim) && !/varchar|int|decimal|text|timestamp/i.test(linhaTrim)) {
          const colMatch = linha.match(/(\w+)\s+(\d+)/);
          if (colMatch && !/primary\s+key/i.test(linhaTrim)) {
            ocorrencias.push(criarOcorrencia({
              tipo: 'codigo-fragil',
              nivel: 'aviso',
              mensagem: `Coluna "${colMatch[1]}" parece não ter tipo definido corretamente.`,
              relPath,
              linha: numeroLinha,
              sugestao: 'Defina o tipo da coluna explicitamente.'
            }));
          }
        }
      }

      // 19. AUTO_INCREMENT/SERIAL sem PRIMARY KEY
      if (/\b(auto_increment|serial|autoincrement)\b/i.test(linhaTrim)) {
        const contextStart = Math.max(0, index - 20);
        const contextEnd = Math.min(linhas.length, index + 5);
        const context = linhas.slice(contextStart, contextEnd).join('\n');
        if (!/primary\s+key/i.test(context)) {
          ocorrencias.push(criarOcorrencia({
            tipo: 'codigo-fragil',
            nivel: 'aviso',
            mensagem: 'Coluna com AUTO_INCREMENT/SERIAL sem PRIMARY KEY definido.',
            relPath,
            linha: numeroLinha,
            sugestao: 'Adicione PRIMARY KEY na coluna com auto-incremento.'
          }));
        }
      }

      // 20. ORDER BY sem LIMIT em query grande
      if (/\border\s+by\b/i.test(linhaTrim) && !/\blimit\b/i.test(linhasResto) && /select\b/i.test(linhasResto)) {
        const hasGroupBy = /\bgroup\s+by\b/i.test(linhasResto);
        if (!hasGroupBy) {
          ocorrencias.push(criarOcorrencia({
            tipo: 'problema-performance',
            nivel: 'info',
            mensagem: 'ORDER BY sem LIMIT pode causar processamento desnecessário de grandes volumes.',
            relPath,
            linha: numeroLinha,
            sugestao: 'Considere adicionar LIMIT para otimizar a ordenação.'
          }));
        }
      }

      // 21. SET NOCOUNT OFF em procedures (performance)
      if (/create\s+procedure\b/i.test(linhaTrim)) {
        const procBlock = linhas.slice(index, index + 100).join('\n');
        if (/set\s+nocount\s+off/i.test(procBlock) && !/set\s+nocount\s+on/i.test(procBlock)) {
          ocorrencias.push(criarOcorrencia({
            tipo: 'problema-performance',
            nivel: 'info',
            mensagem: 'Procedure sem SET NOCOUNT ON pode ter performance reduzida.',
            relPath,
            linha: numeroLinha,
            sugestao: 'Adicione SET NOCOUNT ON no início da procedure.'
          }));
        }
      }

      // 22. INSERT sem especificar colunas
      if (/\binsert\s+into\s+\w+\s+values\b/i.test(linhaTrim) && !/\(\w+/i.test(linhaTrim)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'codigo-fragil',
          nivel: 'aviso',
          mensagem: 'INSERT sem especificar colunas - dependente da ordem da tabela.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Especifique as colunas explicitamente: INSERT INTO table (col1, col2) VALUES (...).'
        }));
      }

      // 23. Wildcard em JOIN (CARTESIAN PRODUCT)
      if (/\bcross\s+join\b/i.test(linhaTrim) && !/where/i.test(linhasResto)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'problema-performance',
          nivel: 'erro',
          mensagem: 'CROSS JOIN sem WHERE pode criar produto cartesiano de todas as linhas.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Evite CROSS JOIN sem condição ou use INNER JOIN com ON.'
        }));
      }

      // 24. CTE sem referência
      if (/\bwith\s+\w+\s+as\s*\(/i.test(linhaTrim)) {
        const cteName = linhaTrim.match(/with\s+(\w+)/i)?.[1];
        if (cteName && !new RegExp(`\\b${cteName}\\b`, 'i').test(linhasResto.substring(linhasResto.indexOf(linhaTrim) + linhaTrim.length))) {
          ocorrencias.push(criarOcorrencia({
            tipo: 'codigo-fragil',
            nivel: 'info',
            mensagem: `CTE "${cteName}" definida mas não utilizada.`,
            relPath,
            linha: numeroLinha,
            sugestao: 'Remova a CTE não utilizada ou use-a na consulta principal.'
          }));
        }
      }

      // 25. IF EXISTS sem ELSE em migrações críticas
      if (isMigrationFile && /drop\s+(table|column)\b/i.test(linhaTrim) && !/if\s+exists/i.test(linhaTrim)) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'vulnerabilidade-dados',
          nivel: 'erro',
          mensagem: 'DROP em arquivo de migração sem verificação IF EXISTS.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Use IF EXISTS para evitar falha em migrações repetidas.'
        }));
      }

      // 26. GRANT/REVOKE sem comentário de justificativa em produção
      if (/\b(grant|revoke)\b/i.test(linhaTrim) && !linha.includes('--') && !linha.includes('/*')) {
        ocorrencias.push(criarOcorrencia({
          tipo: 'vulnerabilidade-seguranca',
          nivel: 'aviso',
          mensagem: 'Comando GRANT/REVOKE detectado sem comentário de justificativa.',
          relPath,
          linha: numeroLinha,
          sugestao: 'Adicione um comentário explicando o propósito da permissão.'
        }));
      }
    });

    return ocorrencias;
  },
  global: false
});