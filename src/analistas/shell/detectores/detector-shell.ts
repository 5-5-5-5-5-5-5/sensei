// SPDX-License-Identifier: MIT

export function detectarShellEmSrc(src: string): boolean {
  const shellPatterns = [
    /\b#!/,
    /\bshebang\b/i,
    /\bbash\b/,
    /\bsh\b\s+[-xe]/,
    /\bzsh\b/,
    /\bfish\b/,
    /\bchmod\b/,
    /\bchown\b/,
    /\becho\s+\$/,
    /\bexport\s+\w+=/,
    /\bsource\s+\./,
    /\b\$\(\w+\)/,
    /\bset\s+-[eo]/,
    /\bif\s+\[\s/,
    /\bfor\s+\w+\s+in\b/,
    /\bwhile\s+read\b/,
    /\bawk\s+/,
    /\bsed\s+/,
    /\bgrep\s+/,
    /\bxargs\b/,
    /\bunset\s+\w+/,
    /\balias\s+\w+=/,
    /\beval\s+/
  ];

  return shellPatterns.some(p => p.test(src));
}

export function detectarShellEmArquivos(nomeArquivo: string): boolean {
  return /\.(sh|bash|zsh|fish|ksh|csh|tcsh)$/i.test(nomeArquivo);
}

export const detectorShell = {
  nome: 'detector-shell',
  descricao: 'Detecta scripts Shell e analiza configuracoes',
  detectar: (src: string): { detectado: boolean; linguagem: string; meta?: Record<string, unknown> } | null => {
    if (!detectarShellEmSrc(src)) return null;

    const configuracoes: string[] = [];
    if (/#!/.test(src)) configuracoes.push('shebang');
    if (/set\s+-e/.test(src)) configuracoes.push('set -e');
    if (/set\s+-o\s+pipefail/.test(src)) configuracoes.push('pipefail');
    if (/bash/.test(src)) configuracoes.push('bash');
    if (/zsh/.test(src)) configuracoes.push('zsh');
    if (/fish/.test(src)) configuracoes.push('fish');

    return {
      detectado: true,
      linguagem: 'shell',
      meta: {
        tipo: 'script',
        nome: 'Shell Script',
        configuracoes
      }
    };
  }
};