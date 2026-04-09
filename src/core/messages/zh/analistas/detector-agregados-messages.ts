// SPDX-License-Identifier: MIT

/**
 * @fileoverview Mensagens de diagnóstico para o detector de achados agregados.
 * Fornece templates de texto resumidos para problemas de segurança, performance,
 * documentação, duplicações e qualidade de testes, com suporte a paginação
 * de resultados.
 */

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : '未知错误';
}
export const DetectorAgregadosMensagens = {
  problemasSegurancaResumo: (severidade: string, resumo: string, total: number) => `安全问题 (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} 更多)` : ''}`,
  erroAnalisarSeguranca: (erro: ErroUnknown) => `分析安全问题出错: ${erroToMessage(erro)}`,
  problemasPerformanceResumo: (impacto: string, resumo: string, total: number) => `性能问题 (${impacto}): ${resumo}${total > 3 ? ` (+${total - 3} 更多)` : ''}`,
  erroAnalisarPerformance: (erro: ErroUnknown) => `分析性能问题出错: ${erroToMessage(erro)}`,
  problemasDocumentacaoResumo: (prioridade: string, resumo: string, total: number) => `文档问题 (${prioridade}): ${resumo}${total > 3 ? ` (+${total - 3} 更多)` : ''}`,
  erroAnalisarDocumentacao: (erro: ErroUnknown) => `分析文档问题出错: ${erroToMessage(erro)}`,
  duplicacoesResumo: (tipo: string, resumo: string, total: number) => `重复代码 ${tipo}: ${resumo}${total > 3 ? ` (+${total - 3} 更多)` : ''}`,
  erroAnalisarDuplicacoes: (erro: ErroUnknown) => `分析重复代码出错: ${erroToMessage(erro)}`,
  problemasTesteResumo: (severidade: string, resumo: string, total: number) => `测试问题 (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} 更多)` : ''}`,
  erroAnalisarQualidadeTestes: (erro: ErroUnknown) => `分析测试质量问题出错: ${erroToMessage(erro)}`
} as const;