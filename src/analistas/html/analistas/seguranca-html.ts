// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import { createLineLookup } from '@shared/helpers';

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'erro'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.html,
    tipo: 'seguranca-html'
  });
}

export const analistaSegurancaHtml = criarAnalista({
  nome: 'analista-seguranca-html',
  categoria: 'seguranca',
  descricao: 'Detecta vulnerabilidades XSS em HTML (innerHTML, outerHTML, document.write)',
  global: false,
  test: (relPath: string): boolean => /\.(html|htm)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lineOf = createLineLookup(src).lineAt;

    for (const m of src.matchAll(/\.(innerHTML|outerHTML)\s*=\s*[^"']/gi)) {
      if (m.index !== undefined) {
        const linha = lineOf(m.index);
        const prop = m[0].includes('outerHTML') ? 'outerHTML' : 'innerHTML';
        ocorrencias.push(warn(
          `${prop} com variáveis pode causar XSS - use textContent ou sanitize o HTML antes de inserir`,
          relPath,
          linha
        ));
      }
    }

    for (const m of src.matchAll(/\bdocument\.write\(/gi)) {
      if (m.index !== undefined) {
        const linha = lineOf(m.index);
        ocorrencias.push(warn(
          'document.write() é perigoso e pode causar XSS - use manipulação de DOM segura (createElement, appendChild)',
          relPath,
          linha
        ));
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});