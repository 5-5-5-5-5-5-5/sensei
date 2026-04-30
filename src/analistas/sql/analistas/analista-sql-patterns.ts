// SPDX-License-Identifier: MIT
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

const SqlMensagens = {
  selectStar: 'Uso de SELECT * - preferir explicitamente as colunas necessárias.',
  noWhereClause: 'SELECT sem cláusula WHERE - pode retornar dados demais.',
  missingPrimaryKey: 'Tabela sem chave primária definida.',
  noIndexOnForeignKey: 'Coluna de chave estrangeira sem índice - pode causar performance ruim.',
  nestedSubqueries: 'Subconsultas aninhadas detectadas - considerar JOIN ou CTE.',
  selectIntoVariable: 'SELECT INTO sem verificação de resultado nulo.',
  hardcodedValues: 'Valores hardcoded detectados - considere parametrização.',
  vulnerableLike: 'LIKE sem escape - vulnerável a SQL injection.',
  missingLimit: 'SELECT sem LIMIT - pode causar retorno excessivo de dados.',
  autoCommitEnabled: 'Transações com auto-commit habilitado - considerar explícito.',
  numericAsString: 'Comparação de números como strings detectado.',
  cascadeDelete: 'DELETE com CASCADE - ensure que é intencional.',
  noAlias: 'Tabelas sem alias em consultas com múltiplos JOINs.',
  inconsistentNaming: 'Naming inconsistency detectado nas colunas.'
} as const;

function warn(message: string, relPath: string, line?: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: 'analista-sql',
    tipo: 'sql'
  });
}

export const analistaSqlPatterns = criarAnalista({
  nome: 'analista-sql-patterns',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em código SQL',
  global: false,
  test: (relPath: string): boolean => /\.(sql|ddl|dml)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      if (upperLine.includes('SELECT *')) {
        ocorrencias.push(warn(SqlMensagens.selectStar, relPath, i + 1, 'aviso'));
      }

      if (upperLine.includes('SELECT') && !upperLine.includes('WHERE') && !upperLine.includes('LIMIT')) {
        if (!upperLine.includes('INSERT') && !upperLine.includes('CREATE') && !upperLine.includes('UPDATE')) {
          ocorrencias.push(warn(SqlMensagens.noWhereClause, relPath, i + 1, 'info'));
        }
      }

      if (upperLine.includes('DELETE') && !upperLine.includes('WHERE') && !upperLine.includes('TRUNCATE')) {
        ocorrencias.push(warn(SqlMensagens.noWhereClause, relPath, i + 1, 'erro'));
      }

      if (upperLine.includes('LIKE') && !/%ESCAPE/.test(line) && /['"]%/.test(line)) {
        ocorrencias.push(warn(SqlMensagens.vulnerableLike, relPath, i + 1, 'aviso'));
      }

      if (upperLine.includes('LIMIT') && /LIMIT\s+[^\d]/.test(line)) {
        const limitVal = line.match(/LIMIT\s+(\d+)/i)?.[1];
        if (limitVal && parseInt(limitVal) > 10000) {
          ocorrencias.push(warn(SqlMensagens.missingLimit, relPath, i + 1, 'info'));
        }
      }

      if (upperLine.includes('WHERE') && /'\d+'/.test(line) && /\d+\s*[=<>]/.test(line)) {
        ocorrencias.push(warn(SqlMensagens.numericAsString, relPath, i + 1, 'aviso'));
      }

      if (upperLine.includes('SELECT') && upperLine.includes('FROM') && !/\bAS\b/i.test(line) && line.toLowerCase().includes(' join ')) {
        const hasAlias = line.match(/\b\w+\s+AS\s+\w+/i);
        if (!hasAlias) {
          ocorrencias.push(warn(SqlMensagens.noAlias, relPath, i + 1, 'info'));
        }
      }
    }

    const createTableMatches = src.match(/CREATE\s+TABLE\s+(\w+)/gi);
    if (createTableMatches) {
      for (const match of createTableMatches) {
        const tableBlock = src.substring(src.indexOf(match), src.indexOf(';', src.indexOf(match)) || src.length);
        if (!/PRIMARY\s+KEY/i.test(tableBlock)) {
          const tableName = match.match(/TABLE\s+(\w+)/i)?.[1];
          if (tableName) {
            ocorrencias.push(warn(SqlMensagens.missingPrimaryKey, relPath, 1, 'aviso'));
          }
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});