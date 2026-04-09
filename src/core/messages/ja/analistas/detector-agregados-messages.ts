// SPDX-License-Identifier: MIT

/**
 * @fileoverview 集約検出器用の診断メッセージ。
 * セキュリティ、パフォーマンス、ドキュメント、重複、
 * テスト品質の問題の簡潔なテキストテンプレートを提供し、
 * 結果のページネーションをサポートします。
 */

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : '不明なエラー';
}
export const DetectorAgregadosMensagens = {
  problemasSegurancaResumo: (severidade: string, resumo: string, total: number) => `セキュリティ問題（${severidade}）: ${resumo}${total > 3 ? ` (+${total - 3}件以上)` : ''}`,
  erroAnalisarSeguranca: (erro: ErroUnknown) => `セキュリティ分析エラー: ${erroToMessage(erro)}`,
  problemasPerformanceResumo: (impacto: string, resumo: string, total: number) => `パフォーマンス問題（${impacto}）: ${resumo}${total > 3 ? ` (+${total - 3}件以上)` : ''}`,
  erroAnalisarPerformance: (erro: ErroUnknown) => `パフォーマンス分析エラー: ${erroToMessage(erro)}`,
  problemasDocumentacaoResumo: (prioridade: string, resumo: string, total: number) => `ドキュメント問題（${prioridade}）: ${resumo}${total > 3 ? ` (+${total - 3}件以上)` : ''}`,
  erroAnalisarDocumentacao: (erro: ErroUnknown) => `ドキュメント分析エラー: ${erroToMessage(erro)}`,
  duplicacoesResumo: (tipo: string, resumo: string, total: number) => `重複 ${tipo}: ${resumo}${total > 3 ? ` (+${total - 3}件以上)` : ''}`,
  erroAnalisarDuplicacoes: (erro: ErroUnknown) => `重複分析エラー: ${erroToMessage(erro)}`,
  problemasTesteResumo: (severidade: string, resumo: string, total: number) => `テスト問題（${severidade}）: ${resumo}${total > 3 ? ` (+${total - 3}件以上)` : ''}`,
  erroAnalisarQualidadeTestes: (erro: ErroUnknown) => `テスト品質分析エラー: ${erroToMessage(erro)}`
} as const;
