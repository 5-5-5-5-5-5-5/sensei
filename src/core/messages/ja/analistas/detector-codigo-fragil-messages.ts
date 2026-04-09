// SPDX-License-Identifier: MIT

/**
 * @fileoverview 脆弱コード検出器用の診断メッセージ。
 * 重大度の要約と構造化された詳細で
 * コードの脆弱性を報告するためのテキストテンプレートを提供します。
 */

import type { FragilidadesDetalhesArgs } from '../../../../types/core/config/config.js';

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : '不明なエラー';
}
export const DetectorCodigoFragilMensagens = {
  fragilidadesResumo: (severidade: string, resumo: string, detalhes: FragilidadesDetalhesArgs) => `脆弱性 ${severidade}: ${resumo} | 詳細: ${JSON.stringify(detalhes)}`,
  erroAnalisarCodigoFragil: (erro: ErroUnknown) => `脆弱コード分析エラー: ${erroToMessage(erro)}`
} as const;
