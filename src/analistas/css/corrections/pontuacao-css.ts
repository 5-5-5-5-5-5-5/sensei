// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Analista, Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarOcorrencia } from '@prometheus';
import postcss from 'postcss';

interface ProblemaPontuacaoCss {
  tipo: string;
  peso: number;
  descricao: string;
}

const tabelasPontuacaoCss: ProblemaPontuacaoCss[] = [
  { tipo: 'id-como-seletor', peso: 5, descricao: 'Seletor de ID usado' },
  { tipo: 'important', peso: 8, descricao: 'Uso de !important' },
  { tipo: 'css-hack', peso: 10, descricao: 'CSS hack detectado' },
  { tipo: 'filtro-ie', peso: 8, descricao: 'Filtro IE legado' },
  { tipo: 'zoom-hack', peso: 6, descricao: 'Uso de zoom (hack)' },
  { tipo: 'display-inline-block', peso: 3, descricao: 'display:inline-block usado' },
  { tipo: 'position-fixed', peso: 3, descricao: 'position:fixed sem z-index' },
  { tipo: 'import-externo', peso: 10, descricao: '@import com URL externa' },
  { tipo: 'muitas-regras', peso: 5, descricao: 'Muitas regras no arquivo' },
  { tipo: 'seletor-longo', peso: 3, descricao: 'Seletor muito longo' },
  { tipo: 'propriedade-insegura', peso: 8, descricao: 'Propriedade CSS insegura' },
  { tipo: 'animacao-longa', peso: 3, descricao: 'Animação muito longa (>5s)' }
];

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.css,
    tipo: 'pontuacao-css'
  });
}

function detectarProblemasCss(src: string, relPath: string): { tipo: string; linha: number }[] {
  const problemas: { tipo: string; linha: number }[] = [];
  
  try {
    const root = postcss.parse(src);
    
    root.walkRules((rule) => {
      const selector = rule.selector || '';
      
      if (/^#[a-zA-Z0-9_-]+$/i.test(selector) && !selector.includes(':')) {
        problemas.push({ tipo: 'id-como-seletor', linha: rule.source?.start?.line || 1 });
      }
      
      if (selector.includes('!important')) {
        problemas.push({ tipo: 'important', linha: rule.source?.start?.line || 1 });
      }
      
      const hacks = ['* html', '*+html', '>:first-child+html', 'html>body'];
      for (const hack of hacks) {
        if (selector.toLowerCase().includes(hack.toLowerCase())) {
          problemas.push({ tipo: 'css-hack', linha: rule.source?.start?.line || 1 });
        }
      }
    });
    
    root.walkDecls((decl) => {
      const prop = decl.prop?.toLowerCase() || '';
      const value = decl.value?.toLowerCase() || '';
      const line = decl.source?.start?.line || 1;
      
      if (prop.includes('filter') && value.includes('alpha(')) {
        problemas.push({ tipo: 'filtro-ie', linha: line });
      }
      
      if (prop === 'zoom') {
        problemas.push({ tipo: 'zoom-hack', linha: line });
      }
      
      if (prop === 'display' && value === 'inline-block') {
        problemas.push({ tipo: 'display-inline-block', linha: line });
      }
      
      if (prop === 'position' && value === 'fixed') {
        problemas.push({ tipo: 'position-fixed', linha: line });
      }
      
      if (prop === 'behavior' || prop === '-ms-behavior') {
        problemas.push({ tipo: 'propriedade-insegura', linha: line });
      }
      
      if ((prop.includes('transition') || prop.includes('animation')) && parseFloat(value) > 5) {
        problemas.push({ tipo: 'animacao-longa', linha: line });
      }
    });
    
    root.walkAtRules((atRule) => {
      const name = atRule.name?.toLowerCase() || '';
      const params = atRule.params || '';
      
      if (name === 'import' && (params.includes('http://') || params.includes('https://') || params.startsWith('//'))) {
        problemas.push({ tipo: 'import-externo', linha: atRule.source?.start?.line || 1 });
      }
    });
    
    const regraCount = (root.nodes || []).filter(n => n.type === 'rule').length;
    if (regraCount > 50) {
      problemas.push({ tipo: 'muitas-regras', linha: 1 });
    }
    
  } catch {}
  
  return problemas;
}

export const analisadorPontuacaoCss: Analista = {
  nome: 'pontuacao-css',
  categoria: 'formatacao',
  descricao: 'Sistema de pontuação para problemas CSS',
  global: false,
  test: (relPath: string): boolean => /\.css$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    if (!src) return null;
    
    const problemas = detectarProblemasCss(src, relPath);
    if (problemas.length === 0) return null;
    
    let pontuacaoTotal = 0;
    for (const p of problemas) {
      const entry = tabelasPontuacaoCss.find(t => t.tipo === p.tipo);
      if (entry) pontuacaoTotal += entry.peso;
    }
    
    const nivel: Ocorrencia['nivel'] = pontuacaoTotal > 50 ? 'erro' : pontuacaoTotal > 20 ? 'aviso' : 'info';
    
    return [warn(
      `Pontuação CSS: ${pontuacaoTotal} pontos em ${problemas.length} problemas`,
      relPath,
      1,
      nivel
    )];
  }
};