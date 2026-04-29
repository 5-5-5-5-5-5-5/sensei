// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'erro'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.cssInJs,
    tipo: 'css-in-js-seguranca'
  });
}

export const analisarSegurancaCssInJs = criarAnalista({
  nome: 'analisar-seguranca-css-in-js',
  categoria: 'seguranca',
  descricao: 'Detecta vulnerabilidades e práticas inseguras em CSS-in-JS',
  global: false,
  test: (relPath: string): boolean => /\.(ts|tsx|js|jsx)$/i.test(relPath) && !relPath.includes('node_modules'),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    
    if (!src) return null;
    
    const lineOf = (idx: number) => src.slice(0, idx).split('\n').length;
    
    for (const m of src.matchAll(/dangerouslySetInnerHTML[\s\S]*?css\s*`[^`]*?`/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          'dangerouslySetInnerHTML com css template pode causar XSS',
          relPath,
          lineOf(m.index)
        ));
      }
    }
    
    for (const m of src.matchAll(/eval\s*\(/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          'eval() é perigoso - pode causar XSS',
          relPath,
          lineOf(m.index)
        ));
      }
    }
    
    for (const m of src.matchAll(/innerHTML\s*=/g)) {
      if (m.index !== undefined && !m[0].includes('dangerouslySetInnerHTML')) {
        ocorrencias.push(warn(
          'innerHTML pode causar XSS - use textContent ou styled-components',
          relPath,
          lineOf(m.index),
          'aviso'
        ));
      }
    }
    
    for (const m of src.matchAll(/document\.write\s*\(/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          'document.write() é perigoso e pode causar XSS',
          relPath,
          lineOf(m.index)
        ));
      }
    }
    
    for (const m of src.matchAll(/dangerouslyUseGlobalFont\s*\(/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          'dangerouslyUseGlobalFont é perigoso - use createGlobalStyle seguro',
          relPath,
          lineOf(m.index),
          'aviso'
        ));
      }
    }
    
    for (const m of src.matchAll(/style\s*=\s*\{[^}]*\$\{[^}]+user/g)) {
      if (m.index !== undefined) {
        ocorrencias.push(warn(
          'Input do usuário em style pode causar XSS',
          relPath,
          lineOf(m.index)
        ));
      }
    }
    
    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});