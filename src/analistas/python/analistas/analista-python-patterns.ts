// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

function warn(message: string, relPath: string, line?: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.python,
    tipo: 'python'
  });
}

export const analistaPythonPatterns = criarAnalista({
  nome: 'analista-python-patterns',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em código Python',
  global: false,
  test: (relPath: string): boolean => /\.py$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/^\s*except\s*:/i.test(line)) {
        ocorrencias.push(warn(messages.PythonMensagens.broadExcept, relPath, i + 1, 'aviso'));
      }

      if (/^\s*raise\s*$/i.test(line) && i < lines.length - 1 && !lines[i + 1].trim()) {
        ocorrencias.push(warn(messages.PythonMensagens.bareRaise, relPath, i + 1, 'aviso'));
      }

      if (/^\s*except.*:\s*$/i.test(line) && i < lines.length - 1 && /^\s*pass\s*$/.test(lines[i + 1])) {
        ocorrencias.push(warn(messages.PythonMensagens.passInExcept, relPath, i + 2, 'aviso'));
      }

      if (/^\s*print\s*\(/.test(line) && !/from\s+__future__\s+import.*print_function/i.test(src)) {
        ocorrencias.push(warn(messages.PythonMensagens.printInsteadOfLog, relPath, i + 1, 'info'));
      }

      if (/\beval\s*\(/.test(line)) {
        ocorrencias.push(warn(messages.PythonMensagens.evalUsage, relPath, i + 1, 'erro'));
      }

      if (/\bexec\s*\(/.test(line)) {
        ocorrencias.push(warn(messages.PythonMensagens.execUsage, relPath, i + 1, 'erro'));
      }

      if (/subprocess\..*shell\s*=\s*True/i.test(line)) {
        ocorrencias.push(warn(messages.PythonMensagens.subprocessShellTrue, relPath, i + 1, 'erro'));
      }

      if (/pickle\.load\s*\(|pickle\.loads\s*\(/.test(line)) {
        ocorrencias.push(warn(messages.PythonMensagens.pickleUsage, relPath, i + 1, 'erro'));
      }

      if (/yaml\.load\s*\([^)]*\)(?!\s*,\s*Loader)/i.test(line)) {
        ocorrencias.push(warn(messages.PythonMensagens.yamlUnsafeLoad, relPath, i + 1, 'erro'));
      }

      if (/\bglobal\s+\w+/.test(line)) {
        ocorrencias.push(warn(messages.PythonMensagens.globalKeyword, relPath, i + 1, 'aviso'));
      }

      const mutableDefaultMatch = line.match(/def\s+\w+\s*\(\s*(\w+)\s*=\s*(\[\]|\{\})/);
      if (mutableDefaultMatch) {
        ocorrencias.push(warn(messages.PythonMensagens.mutableDefault, relPath, i + 1, 'aviso'));
      }

      const funcDefMatch = line.match(/^(\s*)def\s+(\w+)\s*\([^)]*\)\s*:/);
      if (funcDefMatch && !line.includes('->')) {
        const hasTypeHintLater = i + 1 < lines.length && lines.slice(i + 1, i + 5).some(l => l.includes(':') && !l.trim().startsWith('#'));
        if (!hasTypeHintLater) {
          ocorrencias.push(warn(messages.PythonMensagens.missingTypeHints, relPath, i + 1, 'info'));
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});