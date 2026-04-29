// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Analista, Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarOcorrencia } from '@prometheus';


const quickFixesCss: Array<{
  pattern: RegExp;
  type: string;
  fix: (match: RegExpMatchArray) => string;
  description: string;
}> = [
  {
    pattern: /!important/g,
    type: 'important',
    fix: (m) => m[0].replace('!important', ''),
    description: 'Remover !important e usar especificidade adequada'
  },
  {
    pattern: /\*\s+html\s+/g,
    type: 'css-hack',
    fix: () => '/* Remover CSS hack_star-html */',
    description: 'Remover hack * html - use classes modernas'
  },
  {
    pattern: /\*\+html\s+/g,
    type: 'css-hack',
    fix: () => '/* Remover CSS hack_star-plus-html */',
    description: 'Remover hack *+html'
  },
  {
    pattern: /:first-child\s*\+\s*html/g,
    type: 'css-hack',
    fix: () => '/* Remover hack first-child+html */',
    description: 'Remover hack :first-child+html'
  },
  {
    pattern: /\bdisplay\s*:\s*inline-block\s*;/gi,
    type: 'display-fix',
    fix: (m) => m[0].replace('inline-block', 'flow'),
    description: 'Considere usar display:flow ou flexbox'
  },
  {
    pattern: /\bzoom\s*:\s*[^;]+;/gi,
    type: 'zoom-fix',
    fix: (m) => m[0].replace(/\bzoom\s*:\s*[^;]+;/gi, ''),
    description: 'Remover zoom - use transform:scale() moderno'
  },
  {
    pattern: /\bfilter\s*:[^;]+alpha[^;]*;/gi,
    type: 'filter-fix',
    fix: (m) => m[0].replace(/\bfilter\s*:[^;]+alpha[^;]*;/gi, 'opacity:0.5;'),
    description: 'Substituir filtro alpha por opacity'
  },
  {
    pattern: /\#([a-zA-Z0-9_-]+)\s*\{/g,
    type: 'id-selector',
    fix: (m) => m[0].replace('#', '.'),
    description: 'Converter ID em classe para melhor reuso'
  }
];

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.css,
    tipo: 'auto-fix-css'
  });
}

export const analisadorQuickFixesCss: Analista = {
  nome: 'analisador-quick-fixes-css',
  categoria: 'melhorias',
  descricao: 'Detecta problemas CSS e oferece correções automáticas',
  global: false,
  test: (relPath: string): boolean => /\.css$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    if (!src) return null;
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');

    for (const qf of quickFixesCss) {
      const regex = new RegExp(qf.pattern.source, qf.pattern.flags);
      for (const m of src.matchAll(regex)) {
        if (typeof m.index === 'number') {
          const linha = lines.slice(0, m.index).filter(l => l.includes('\n')).length + 1;
          ocorrencias.push(warn(
            `${qf.description} (${qf.type})`,
            relPath,
            linha,
            qf.type === 'important' ? 'aviso' : 'info'
          ));
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
};