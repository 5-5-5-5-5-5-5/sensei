// SPDX-License-Identifier: MIT

/**
 * @fileoverview 脆弱代码检测器的诊断消息。
 * 提供文本模板，用于报告代码脆弱性，包含
 * 严重性摘要和结构化详情。
 */

import type { FragilidadesDetalhesArgs } from '../../../../types/core/config/config.js';

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : '未知错误';
}
export const DetectorCodigoFragilMensagens = {
  fragilidadesResumo: (severidade: string, resumo: string, detalhes: FragilidadesDetalhesArgs) => `脆弱性（${severidade}）：${resumo} | 详情：${JSON.stringify(detalhes)}`,
  erroAnalisarCodigoFragil: (erro: ErroUnknown) => `分析脆弱代码时出错：${erroToMessage(erro)}`
} as const;
