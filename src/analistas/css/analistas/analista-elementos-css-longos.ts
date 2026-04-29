// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import postcss from 'postcss';

const LIMITE_PROFUNDIDADE = 6;
const LIMITE_REGRAS = 50;

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

export const analistaElementosCssLongos = criarAnalista({
  nome: 'analista-elementos-css-longos',
  categoria: 'complexidade',
  descricao: 'Detecta regras CSS muito longas, aninhamento excessivo ou complexidade alta',
  global: false,
  test: (relPath: string): boolean => /\.css$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];

    try {
      const root = postcss.parse(src);
      let regraContagem = 0;
      let profundidadeMax = 0;

      const calculateDepth = (selector: string): number => {
        return (selector.match(/>/g) || []).length +
               (selector.match(/ /g) || []).length +
               (selector.match(/~/g) || []).length +
               (selector.match(/\+/g) || []).length;
      };

      root.walkRules((rule) => {
        regraContagem++;
        const depth = calculateDepth(rule.selector);
        if (depth > profundidadeMax) profundidadeMax = depth;

        const props = rule.nodes?.filter(n => n.type === 'decl') || [];
        if (props.length > 30) {
          const line = rule.source?.start?.line || 1;
          ocorrencias.push(warn(
            `Regra CSS com muitas propriedades (${props.length}, máx: 30)`,
            relPath,
            line,
            'aviso'
          ));
        }

        const selectorContent = rule.selector || '';
        if (selectorContent.length > 100) {
          const line = rule.source?.start?.line || 1;
          ocorrencias.push(warn(
            `Seletor muito longo (${selectorContent.length} chars)`,
            relPath,
            line,
            'info'
          ));
        }
      });

      if (regraContagem > LIMITE_REGRAS) {
        ocorrencias.push(warn(
          `Arquivo CSS com muitas regras (${regraContagem}, máx: ${LIMITE_REGRAS})`,
          relPath,
          1,
          'aviso'
        ));
      }

      if (profundidadeMax > LIMITE_PROFUNDIDADE) {
        ocorrencias.push(warn(
          `Seletores com aninhamento profundo (nível ${profundidadeMax}, máx: ${LIMITE_PROFUNDIDADE})`,
          relPath,
          1,
          'aviso'
        ));
      }

      return ocorrencias.length > 0 ? ocorrencias : null;
    } catch {
      return null;
    }
  }
});
