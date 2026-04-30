// SPDX-License-Identifier: MIT
import type { ResultadoDeteccaoArquetipo } from '@prometheus';

export function detectarArquetipoSVG(arquivos: string[]): ResultadoDeteccaoArquetipo[] {
  const svgArquivos = arquivos.filter(f => f.endsWith('.svg'));
  if (svgArquivos.length === 0) {
    return [];
  }

  const hasInline = svgArquivos.some(f => f.includes('inline') || f.includes('icon'));

  if (svgArquivos.length >= 5) {
    return [{
      nome: 'svg-assets-project',
      score: 70,
      confidence: 80,
      matchedRequired: ['svg-files'],
      missingRequired: [],
      matchedOptional: svgArquivos,
      dependencyMatches: [],
      filePadraoMatches: svgArquivos,
      forbiddenPresent: [],
      anomalias: [],
      sugestaoPadronizacao: 'Projeto com ativos SVG detectado',
      explicacaoSimilaridade: `Encontrados ${svgArquivos.length} arquivos SVG`,
      descricao: `Projeto usando ${svgArquivos.length} gráficos vetoriais SVG`,
      planoSugestao: {
        mover: [],
        conflitos: [],
        resumo: {
          total: svgArquivos.length,
          zonaVerde: svgArquivos.length,
          bloqueados: 0
        }
      }
    }];
  }

  if (svgArquivos.length >= 1) {
    return [{
      nome: hasInline ? 'svg-icons-project' : 'svg-graphics-minimal',
      score: 50,
      confidence: 65,
      matchedRequired: ['svg-files'],
      missingRequired: [],
      matchedOptional: svgArquivos,
      dependencyMatches: [],
      filePadraoMatches: svgArquivos,
      forbiddenPresent: [],
      anomalias: [],
      sugestaoPadronizacao: hasInline ? 'Projeto com ícones SVG detectado' : 'Gráficos SVG detectados',
      explicacaoSimilaridade: `${svgArquivos.length} arquivo(s) SVG`,
      descricao: `Projeto com ${svgArquivos.length} arquivo(s) SVG`,
      planoSugestao: {
        mover: [],
        conflitos: [],
        resumo: {
          total: svgArquivos.length,
          zonaVerde: svgArquivos.length,
          bloqueados: 0
        }
      }
    }];
  }

  return [];
}