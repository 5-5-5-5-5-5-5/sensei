// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Analista, Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarOcorrencia } from '@prometheus';

const quickFixesCssInJs: Array<{
  pattern: RegExp;
  type: string;
  description: string;
}> = [
  {
    pattern: /\.extend\s*\(/g,
    type: 'extend-obsoleto',
    description: '.extend é obsoleto - use styled() com props'
  },
  {
    pattern: /attrs\s*\(\s*\(\s*\)/g,
    type: 'attrs-vazio',
    description: 'attrs() vazio pode ser removido'
  },
  {
    pattern: /injectGlobal\s*\(/g,
    type: 'inject-global',
    description: 'Use createGlobalStyle para SSR seguro'
  },
  {
    pattern: /\$\{[^}]+props[^}]+=>[^}]+props[^}]+\}/g,
    type: 'props-duplicadas',
    description: 'Props passadas duas vezes - simplifique'
  },
  {
    pattern: /css\s*`[^`]*!important[^`]*`/g,
    type: 'important',
    description: 'Use props para dinâmicas ao invés de !important'
  }
];

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.cssInJs,
    tipo: 'auto-fix-css-in-js'
  });
}

export const analisarQuickFixesCssInJs: Analista = {
  nome: 'analisar-quick-fixes-css-in-js',
  categoria: 'melhorias',
  descricao: 'Detecta problemas CSS-in-JS e oferece correções',
  global: false,
  test: (relPath: string): boolean => /\.(ts|tsx|js|jsx)$/i.test(relPath) && !relPath.includes('node_modules'),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    if (!src) return null;
    const ocorrencias: Ocorrencia[] = [];
    const lineOf = (idx: number) => src.slice(0, idx).split('\n').length;

    for (const qf of quickFixesCssInJs) {
      for (const m of src.matchAll(qf.pattern)) {
        if (m.index !== undefined) {
          ocorrencias.push(warn(
            `${qf.description} (${qf.type})`,
            relPath,
            lineOf(m.index),
            qf.type === 'extend-obsoleto' || qf.type === 'inject-global' ? 'aviso' : 'info'
          ));
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
};