// SPDX-License-Identifier: MIT

/**
 * Interface para correção de código
 */
export interface Correcao {
  nome?: string;
  categoria?: string;
  descricao: string;
  original: string;
  modificado: string;
  tipo?: 'substituicao' | 'insercao' | 'remocao' | 'refatoracao';
  confidence?: number;
  risks?: string[];
}

/**
 * Configuração de pontuação para análise de qualidade de código
 * (Diferente de ConfiguracaoPontuacao em core/config que é para arquétipos)
 */
export interface ConfiguracaoPontuacaoAnalista {
  pesoBase: number;
  multiplicadores: {
    complexidade?: number;
    cobertura?: number;
    documentacao?: number;
    performance?: number;
    seguranca?: number;
  };
  limiares: {
    minimo: number;
    maximo: number;
    critico: number;
  };
  ajustes?: Record<string, number>;
}
