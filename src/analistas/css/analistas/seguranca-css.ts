// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import postcss, { type Root } from 'postcss';

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'erro'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.css,
    tipo: 'css-seguranca'
  });
}

export const analisadorSegurancaCss = criarAnalista({
  nome: 'analisador-seguranca-css',
  categoria: 'seguranca',
  descricao: 'Detecta vulnerabilidades e práticas inseguras em CSS',
  global: false,
  test: (relPath: string): boolean => /\.css$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    
    try {
      const root = postcss.parse(src);
      
      for (const atRule of root.nodes || []) {
        if (atRule.type !== 'atrule') continue;
        const atRuleNode = atRule as any;
        const name = atRuleNode.name?.toLowerCase() || '';
        const params = atRuleNode.params || '';
        const line = atRuleNode.source?.start?.line || 1;
        
        if (name === 'import') {
          if (params.includes('http://') || params.includes('https://')) {
            ocorrencias.push(warn(
              '@import com URL externa pode causar vazamento de referenciador',
              relPath,
              line
            ));
          }
          
          const fullUrl = params.match(/url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/i)?.[1];
          if (!fullUrl) {
            if (params.startsWith('"') || params.startsWith("'")) {
              const url = params.slice(1, -1);
              if (url.includes('://') || url.startsWith('//')) {
                ocorrencias.push(warn(
                  '@import com URL externa pode causar vazamento de referenciador',
                  relPath,
                  line
                ));
              }
            }
          }
        }
        
        if (name === 'keyframes') {
          const animName = params;
          if (/^0rotation$/i.test(animName) || /^pinwheel$/i.test(animName)) {
            ocorrencias.push(warn(
              `Nome de animação "${animName}" pode conflitar com bibliotecas comuns`,
              relPath,
              line,
              'aviso'
            ));
          }
        }
      }
      
      root.walkDecls((decl) => {
        const prop = decl.prop?.toLowerCase() || '';
        const value = decl.value || '';
        const line = decl.source?.start?.line || 1;
        
        if (prop === 'behavior' || prop === '-ms-behavior') {
          ocorrencias.push(warn(
            'CSS behavior (IE) é obsoleto e inseguro',
            relPath,
            line,
            'aviso'
          ));
        }
        
        if (prop.includes('transition') || prop.includes('animation')) {
          if (value.includes('cubic-bezier') || value.includes('steps(')) {
            const hasDuration = (decl.parent as any)?.nodes?.some((n: any) => 
              (n.prop === 'transition-duration' || n.prop === 'animation-duration') &&
              parseFloat(n.value) > 5
            );
            if (hasDuration) {
              ocorrencias.push(warn(
                'Transição/animação muito longa pode causar problemas de acessibilidade',
                relPath,
                line,
                'info'
              ));
            }
          }
        }
      });
      
      return ocorrencias.length > 0 ? ocorrencias : null;
    } catch {
      return null;
    }
  }
});