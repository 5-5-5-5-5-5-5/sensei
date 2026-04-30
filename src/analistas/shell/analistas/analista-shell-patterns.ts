// SPDX-License-Identifier: MIT
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

const ShellMensagens = {
  evalUsage: 'Detectado eval em script shell - Vulnerabilidade de segurança.',
  shellInjection: 'Possível injeção de shell detected - evitar interpolação não sanitizada.',
  sudoRedirect: 'Redirecionamento sudo detectado - garantir que não exponha dados sensíveis.',
  hardcodedPath: 'Caminhohardcoded detectado - considere usar variáveis de ambiente.',
  missingExit: 'Script sem verificação explícita de saída (exit).',
  crlfLineEndings: 'Script contém finais de linha CRLF - pode causar problemas em Linux.',
  missingShebang: 'Script shell sem shebang - adicione #!/bin/bash ou #!/bin/sh.',
  insecureTmp: 'Uso de /tmp sem verificações de segurança - vulnerabilidade de symlink attack.',
  commandsWithoutQuotes: 'Comandos sem aspas em variáveis - pode causar word splitting.',
  verboseFlagMissing: 'Comando sem flag de erro (-e) - erros podem passar despercebidos.'
} as const;

function warn(message: string, relPath: string, line?: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: 'analista-shell',
    tipo: 'shell'
  });
}

export const analistaShellPatterns = criarAnalista({
  nome: 'analista-shell-patterns',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em scripts shell',
  global: false,
  test: (relPath: string): boolean => /\.(sh|bash|zsh)$/i.test(relPath) || /^#!\/.*(?:sh|bash|zsh)/.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');

    const hasShebang = lines.some(l => /^#!/.test(l.trim()));
    if (!hasShebang && src.trim().length > 0) {
      ocorrencias.push(warn(ShellMensagens.missingShebang, relPath, 1, 'aviso'));
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/\beval\s+/.test(line)) {
        ocorrencias.push(warn(ShellMensagens.evalUsage, relPath, i + 1, 'erro'));
      }

      if (/\$\(.*\$\{?/.test(line) || /`.*`/.test(line)) {
        if (/\$\{[^}]*[$"`]/.test(line)) {
          ocorrencias.push(warn(ShellMensagens.shellInjection, relPath, i + 1, 'aviso'));
        }
      }

      if (/sudo\s+\S+.*>/.test(line) || /sudo.*>>/.test(line)) {
        ocorrencias.push(warn(ShellMensagens.sudoRedirect, relPath, i + 1, 'aviso'));
      }

      if (/\/tmp\//.test(line) && !/-[Lf]/.test(line)) {
        ocorrencias.push(warn(ShellMensagens.insecureTmp, relPath, i + 1, 'aviso'));
      }

      if (/\$[a-zA-Z_][a-zA-Z0-9_]*[^\s"'}]/.test(line)) {
        ocorrencias.push(warn(ShellMensagens.commandsWithoutQuotes, relPath, i + 1, 'info'));
      }

      if (/\r\n|\r/.test(line)) {
        const crlfIndex = lines.findIndex(l => /\r\n|\r/.test(l));
        if (crlfIndex >= 0) {
          ocorrencias.push(warn(ShellMensagens.crlfLineEndings, relPath, crlfIndex + 1, 'info'));
          break;
        }
      }
    }

    const lastNonEmptyLine = lines.reverse().find(l => l.trim().length > 0 && !l.trim().startsWith('#'));
    if (lastNonEmptyLine && !/(exit|return)\b/.test(lastNonEmptyLine)) {
      ocorrencias.push(warn(ShellMensagens.missingExit, relPath, lines.length, 'info'));
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});