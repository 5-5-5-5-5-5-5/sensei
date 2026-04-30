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
    origem: messages.AnalystOrigens.svg,
    tipo: 'svg'
  });
}

export const analistaSvgPatterns = criarAnalista({
  nome: 'analista-svg-patterns',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em arquivos SVG',
  global: false,
  test: (relPath: string): boolean => /\.svg$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');

    if (!/<svg[^>]*>/i.test(src)) {
      ocorrencias.push(warn(messages.SvgMensagens.naoPareceSvg, relPath, 1, 'erro'));
      return ocorrencias;
    }

    const svgOpenMatch = src.match(/<svg[^>]*>/i);
    if (svgOpenMatch) {
      if (!/viewBox=/i.test(svgOpenMatch[0])) {
        ocorrencias.push(warn(messages.SvgMensagens.semViewBox, relPath, 1, 'aviso'));
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/<script/i.test(line)) {
        ocorrencias.push(warn(messages.SvgMensagens.scriptInline, relPath, i + 1, 'erro'));
      }

      if (/\bon\w+\s*=/i.test(line)) {
        ocorrencias.push(warn(messages.SvgMensagens.eventoInline, relPath, i + 1, 'aviso'));
      }

      if (/href\s*=\s*["']?javascript:/i.test(line) || /xlink:href\s*=\s*["']?javascript:/i.test(line)) {
        ocorrencias.push(warn(messages.SvgMensagens.javascriptUrl, relPath, i + 1, 'erro'));
      }
    }

    const styleElements = src.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
    if (styleElements && styleElements.length > 0) {
      for (const style of styleElements) {
        if (style.length > 500) {
          ocorrencias.push(warn('SVG contém CSS inline grande - considere usar classes externas', relPath, 1, 'info'));
          break;
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});