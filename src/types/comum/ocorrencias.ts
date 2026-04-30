// SPDX-License-Identifier: MIT
import type { Correcao } from '../analistas/corrections/pontuacao.js';

export type OcorrenciaNivel = 'erro' | 'aviso' | 'info' | 'sucesso';

// Versão base (compatível com núcleo)
export interface OcorrenciaBase {
  mensagem: string;
  relPath: string;
  tipo?: string; // Opcional para compatibilidade com núcleo
  nivel?: string | OcorrenciaNivel;
  linha?: number;
  coluna?: number;
  origem?: string;
  arquivo?: string;
  sugestao?: string;
  extras?: Record<string, unknown>; // Para metadados adicionais
}

// Versão estendida para analistas (tipo obrigatório)
export interface OcorrenciaAnalista extends OcorrenciaBase {
  tipo: string; // Obrigatório para analistas
  nivel?: OcorrenciaNivel;
  sugestao?: string;
}

// Tipos específicos de ocorrências
export interface OcorrenciaErroAnalista extends OcorrenciaAnalista {
  tipo: 'ERRO_ANALISTA';
  stack?: string;
}

export interface OcorrenciaComplexidadeFuncao extends OcorrenciaAnalista {
  tipo: 'FUNCAO_COMPLEXA';
  linhas?: number;
  parametros?: number;
  aninhamento?: number;
  limites?: {
    maxLinhas?: number;
    maxParametros?: number;
    maxAninhamento?: number;
  };
}

export interface OcorrenciaParseErro extends OcorrenciaAnalista {
  tipo: 'PARSE_ERRO';
  detalhe?: string;
  trecho?: string;
}

export interface OcorrenciaGenerica extends OcorrenciaAnalista {
  [k: string]: unknown;
}

// União de todos os tipos
export type Ocorrencia =
  | OcorrenciaBase
  | OcorrenciaAnalista
  | OcorrenciaErroAnalista
  | OcorrenciaComplexidadeFuncao
  | OcorrenciaParseErro
  | OcorrenciaGenerica;

export type SeveridadeTexto = 'info' | 'aviso' | 'risco' | 'critico';

// Função para criar ocorrência (compatível com ambos os casos)

export function criarOcorrencia(
  base: Pick<OcorrenciaBase, 'mensagem' | 'relPath'> & Partial<OcorrenciaBase>,
): OcorrenciaBase {
  return {
    nivel: 'info',
    origem: 'prometheus',
    ...base,
    mensagem: base.mensagem.trim(),
  };
}

// Funções específicas

export function ocorrenciaErroAnalista(data: {
  mensagem: string;
  relPath: string;
  stack?: string;
  origem?: string;
}): OcorrenciaErroAnalista {
  return {
    tipo: 'ERRO_ANALISTA',
    nivel: 'erro',
    origem: 'prometheus',
    ...data,
    mensagem: data.mensagem.trim(),
  };
}

export function ocorrenciaFuncaoComplexa(data: {
  mensagem: string;
  relPath: string;
  linhas?: number;
  parametros?: number;
  aninhamento?: number;
  limites?: {
    maxLinhas?: number;
    maxParametros?: number;
    maxAninhamento?: number;
  };
  origem?: string;
}): OcorrenciaComplexidadeFuncao {
  return {
    tipo: 'FUNCAO_COMPLEXA',
    nivel: 'aviso',
    origem: 'prometheus',
    ...data,
    mensagem: data.mensagem.trim(),
  };
}

export function ocorrenciaParseErro(data: {
  mensagem: string;
  relPath: string;
  detalhe?: string;
  trecho?: string;
  origem?: string;
  linha?: number;
  coluna?: number;
}): OcorrenciaParseErro {
  return {
    tipo: 'PARSE_ERRO',
    nivel: 'erro',
    origem: 'prometheus',
    ...data,
    mensagem: data.mensagem.trim(),
  };
}

// Função para criar correção

export function criarCorrecao(
  def: {
    nome: string;
    categoria?: string;
    descricao: string;
    test?: (relPath: string) => boolean;
    aplicar?: (ocorrencia: OcorrenciaBase, src: string) => Promise<{ original: string; modificado: string; descricao?: string } | null>;
    original?: string;
    modificado?: string;
    tipo?: 'substituicao' | 'insercao' | 'remocao' | 'refatoracao';
    confidence?: number;
    risks?: string[];
  }
): Partial<Correcao> {
  return {
    nome: def.nome,
    categoria: def.categoria,
    descricao: def.descricao,
    tipo: def.tipo ?? 'substituicao',
    confidence: def.confidence ?? 1,
    risks: def.risks ?? [],
  };
}
