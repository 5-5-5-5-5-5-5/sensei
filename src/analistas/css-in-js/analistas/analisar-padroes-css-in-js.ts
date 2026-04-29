// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.cssInJs,
    tipo: 'css-in-js'
  });
}

export const analisarPadroesCssInJs = criarAnalista({
  nome: 'analisar-padroes-css-in-js',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em CSS-in-JS (styled-components, emotion, etc)',
  global: false,
  test: (relPath: string): boolean => /\.(ts|tsx|js|jsx)$/i.test(relPath) && !relPath.includes('node_modules'),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];

    if (!src) return null;

    const lineOf = (idx: number) => src.slice(0, idx).split('\n').length;

    for (const m of src.matchAll(/withConfig\s*\(/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          'styled.div.withConfig() detected - verifique necessidade',
          relPath,
          lineOf(m.index),
          'info'
        ));
      }
    }

    for (const m of src.matchAll(/injectGlobal\s*\(/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          'injectGlobal pode causar problemas de SSR - use createGlobalStyle',
          relPath,
          lineOf(m.index),
          'aviso'
        ));
      }
    }

    for (const m of src.matchAll(/\$\{[^}]+props[^}]+\}/g)) {
      if (m.index !== undefined && m[0].length > 50) {
        ocorrencias.push(warn(
          'Expressão de props complexa pode afetar performance',
          relPath,
          lineOf(m.index),
          'aviso'
        ));
      }
    }

    for (const m of src.matchAll(/attrs\s*\(\s*\(\s*\)/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          'attrs() sem argumentos pode ser simplificado',
          relPath,
          lineOf(m.index),
          'info'
        ));
      }
    }

    for (const m of src.matchAll(/css\s*`[^`]*@import[^`]*`/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          '@import em css template pode causar duplicação em SSR',
          relPath,
          lineOf(m.index),
          'aviso'
        ));
      }
    }

    for (const m of src.matchAll(/\.attrs\s*\(\s*\{[^}]*\}\s*\)/g)) {
      if (m.index !== undefined) {
        const hasFunction = /attrs\s*\(\s*\(\s*[^)]*=>|\s*function/.test(m[0]);
        if (!hasFunction) {
          ocorrencias.push(warn(
            'attrs() estático - considere mover para fora do componente',
            relPath,
            lineOf(m.index),
            'info'
          ));
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});
