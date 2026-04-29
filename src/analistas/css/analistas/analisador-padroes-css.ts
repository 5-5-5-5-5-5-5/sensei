// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import postcss from 'postcss';

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.css,
    tipo: 'css'
  });
}

export const analisadorPadroesCss = criarAnalista({
  nome: 'analisador-padroes-css',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em CSS (IDs como seletores, !important, hacks conhecidas)',
  global: false,
  test: (relPath: string): boolean => /\.css$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];

    try {
      const root = postcss.parse(src);

      root.walkRules((rule) => {
        const selector = rule.selector || '';
        const line = rule.source?.start?.line || 1;

        if (/^#[a-zA-Z0-9_-]+$/i.test(selector) && !selector.includes(':')) {
          ocorrencias.push(warn(
            'Seletor de ID deve ser evitado em CSS (uso específico via JS é melhor)',
            relPath,
            line,
            'info'
          ));
        }

        if (selector.includes('!important')) {
          ocorrencias.push(warn(
            'Uso de !important deve ser evitado',
            relPath,
            line,
            'aviso'
          ));
        }

        const hacks = [
          '* html', '*+html', '*:first-child+html',
          'html>body', 'x:-moz-placeholder',
          'input[type=email]::-webkit-input-placeholder'
        ];
        for (const hack of hacks) {
          if (selector.toLowerCase().includes(hack.toLowerCase())) {
            ocorrencias.push(warn(
              `CSS hack detectado: "${hack}"`,
              relPath,
              line,
              'aviso'
            ));
          }
        }
      });

      root.walkDecls((decl) => {
        const prop = decl.prop?.toLowerCase() || '';
        const value = decl.value?.toLowerCase() || '';
        const line = decl.source?.start?.line || 1;

        if (prop.includes('filter') || prop.includes('ms-filter')) {
          if (value.includes('alpha(') || value.includes('opacity=')) {
            ocorrencias.push(warn(
              'Filtro IE legado deve ser evitado',
              relPath,
              line,
              'aviso'
            ));
          }
        }

        if (prop === 'display' && value === 'inline-block') {
          const parentNode = decl.parent as unknown as { nodes?: Array<{ prop?: string }> };
          const hasZoom = parentNode?.nodes?.some((n) =>
            n.prop?.toLowerCase() === 'zoom' || n.prop === '*zoom'
          );
          if (hasZoom) {
            ocorrencias.push(warn(
              'display:inline-block + zoom é um hack - use flexbox/grid',
              relPath,
              line,
              'aviso'
            ));
          }
        }

        if (prop === 'position' && value === 'fixed') {
          const parentNode = decl.parent as unknown as { nodes?: Array<{ prop?: string }> };
          const hasZIndex = parentNode?.nodes?.some((n) =>
            n.prop?.toLowerCase() === 'z-index'
          );
          if (!hasZIndex) {
            ocorrencias.push(warn(
              'position:fixed sem z-index pode causar problemas de layering',
              relPath,
              line,
              'info'
            ));
          }
        }
      });

      return ocorrencias.length > 0 ? ocorrencias : null;
    } catch {
      return null;
    }
  }
});
