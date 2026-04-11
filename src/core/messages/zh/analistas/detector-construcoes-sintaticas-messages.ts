// SPDX-License-Identifier: MIT

/**
 * @fileoverview 语法结构检测器的诊断消息。
 * 提供文本模板，用于报告已识别的语法结构
 * 和分析期间的错误。
 */

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : '未知错误';
}
export const DetectorConstrucoesSintaticasMensagens = {
  identificadas: (mensagemFinal: string) => `已识别语法结构：${mensagemFinal}`,
  erroAnalisar: (erro: ErroUnknown) => `分析语法结构时出错：${erroToMessage(erro)}`
} as const;
