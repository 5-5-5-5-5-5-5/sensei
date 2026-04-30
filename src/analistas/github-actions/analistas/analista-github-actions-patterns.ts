// SPDX-License-Identifier: MIT
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

function warn(message: string, relPath: string, line?: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: 'analista-github-actions',
    tipo: 'github-actions'
  });
}

export const analistaGithubActionsPatterns = criarAnalista({
  nome: 'analista-github-actions-patterns',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em GitHub Actions workflows',
  global: false,
  test: (relPath: string): boolean => /\.ya?ml$/i.test(relPath) && /workflows?/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');

    const isWorkflowFile = /on\s*:/.test(src) || /name\s*:/.test(src);
    if (!isWorkflowFile) return null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      if (/\${{\s*secrets\.\w+/.test(line) && !/secrets\.\w+\s*\|\|\s*["']/.test(line)) {
        warn('Segredo usado diretamente sem valor padrão - considerar fallback seguro', relPath, lineNum, 'aviso');
      }

      if (/shell:\s*bash/i.test(line) && !/-e\b/.test(line)) {
        if (i + 1 < lines.length && !/-e\b/.test(lines[i + 1])) {
          warn('Script bash sem set -e - erros podem passar despercebidos', relPath, lineNum, 'info');
        }
      }

      if (/run:\s*npm\s+publish/i.test(line) || /run:\s*yarn\s+publish/i.test(line) || /run:\s*pnpm\s+publish/i.test(line)) {
        if (!/npm_token|secrets\.NPM/.test(src)) {
          warn('Publish commands sem token de npm configurado', relPath, lineNum, 'aviso');
        }
      }

      if (/continue-on-error:\s*true/i.test(line)) {
        warn('Passo com continue-on-error:true - falhas serão silenciadas', relPath, lineNum, 'info');
      }

      if (/timeout-minutes:\s*(\d+)/.test(line)) {
        const timeout = parseInt(line.match(/timeout-minutes:\s*(\d+)/i)?.[1] || '0');
        if (timeout === 0) {
          warn('Timeout definido como 0 - step pode nunca expirar', relPath, lineNum, 'aviso');
        }
      }

      if (/if:\s*success\(\)/.test(line)) {
        const runIndex = lines.slice(i + 1).findIndex(l => /run:/.test(l));
        if (runIndex >= 0) {
          const actualStep = lines[i + 1 + runIndex];
          if (/rm\s+-rf|delete|del\s+\//i.test(actualStep)) {
            warn('Step condicional que pode apagar arquivos sem verificação', relPath, lineNum, 'aviso');
          }
        }
      }

      if (/uses:\s*actions\/checkout@v\d+/.test(line)) {
        warn('actions/checkout com version específica - considere @v4', relPath, lineNum, 'info');
      }

      if (/password:\s*\${{\s*secrets\.\w+/.test(line) && !/GITHUB_TOKEN/.test(line)) {
        warn('Credenciais em textoplain em actions - usar GITHUB_TOKEN quando possível', relPath, lineNum, 'aviso');
      }
    }

    if (/on:\s*push/i.test(src) && !/branches:/.test(src)) {
      ocorrencias.push(warn('Workflow executa em todos os branches - considerar limitar', relPath, 1, 'info'));
    }

    if (!/permissions:/.test(src)) {
      ocorrencias.push(warn('Workflow sem permissões explícitas - adicionar permissões mínimas', relPath, 1, 'aviso'));
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});