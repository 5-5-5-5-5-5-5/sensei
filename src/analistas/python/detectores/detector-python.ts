// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.python,
    tipo: messages.AnalystTipos.python
  });
}

export const analistaPythonDetectores = criarAnalista({
  nome: 'analista-python-detectores',
  categoria: 'qualidade',
  descricao: 'Advanced Python pattern detection (docstrings, comprehensions, decorators)',
  global: false,
  test: (relPath: string): boolean => /\.(py|pyx|pyi)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<Ocorrencia[] | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');
    const linesComConteudo = lines.filter(l => l.trim() && !l.trim().startsWith('#'));

    for (let i = 0; i < linesComConteudo.length; i++) {
      const line = linesComConteudo[i];
      const lineNum = i + 1;

      if (/^def\s+\w+/.test(line) && !line.includes('"""') && !line.includes("'''")) {
        const proximasLinhas = linesComConteudo.slice(i + 1, i + 5);
        const temDocstring = proximasLinhas.some(l => /^\s*["']/.test(l));
        if (!temDocstring) {
          const atual = lines.findIndex((_, idx) => idx >= i && /^\s*def/.test(lines[idx]));
          if (atual >= 0) {
            ocorrencias.push(warn(messages.PythonMensagens.funcaoSemDocstring, relPath, lineNum, 'info'));
          }
        }
      }

      if (/^\s*for\s+\w+\s+in\s+\[/.test(line) && /\s+for\s+\w+\s+in\s+/.test(line)) {
        const aninhadas = (line.match(/for/g) || []).length;
        if (aninhadas > 1) {
          ocorrencias.push(warn(messages.PythonMensagens.comprehensionAninhada, relPath, lineNum, 'aviso'));
        }
      }

      if (/@property\s*\n\s*def\s+\w+/.test(lines.slice(i, i + 2).join('\n'))) {
        const proximo = lines[i + 1] || '';
        if (!/@property/.test(proximo)) {
          ocorrencias.push(warn(messages.PythonMensagens.propertySemGetter, relPath, lineNum, 'info'));
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});