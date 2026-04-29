// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

const LIMITE_REGRAS = 30;

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

export const analisarElementosCssInJs = criarAnalista({
  nome: 'analisar-elementos-css-in-js',
  categoria: 'complexidade',
  descricao: 'Detecta regras CSS-in-JS muito longas ou complexas',
  global: false,
  test: (relPath: string): boolean => /\.(ts|tsx|js|jsx)$/i.test(relPath) && !relPath.includes('node_modules'),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];

    if (!src) return null;

    const lineOf = (idx: number) => src.slice(0, idx).split('\n').length;

    const styledMatches = [...src.matchAll(/styled\.[`'(]/g)];
    if (styledMatches.length > LIMITE_REGRAS) {
      ocorrencias.push(warn(
        `Muitas definições styled (${styledMatches.length}, máx: ${LIMITE_REGRAS})`,
        relPath,
        1,
        'aviso'
      ));
    }

    for (const m of src.matchAll(/css\`[\s\S]*?\`/g)) {
      if (m.index !== undefined && m[0].length > 500) {
        ocorrencias.push(warn(
          `Template literal css muito longo (${m[0].length} chars)`,
          relPath,
          lineOf(m.index),
          'aviso'
        ));
      }
    }

    for (const m of src.matchAll(/createGlobalStyle\`[\s\S]*?\`/g)) {
      if (m.index !== undefined && m[0].length > 1000) {
        ocorrencias.push(warn(
          `createGlobalStyle muito longo (${m[0].length} chars)`,
          relPath,
          lineOf(m.index),
          'aviso'
        ));
      }
    }

    for (const m of src.matchAll(/\.extend\`[\s\S]*?\`/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          'Uso de .extend é obsoleto - use styled() com props',
          relPath,
          lineOf(m.index),
          'info'
        ));
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});
