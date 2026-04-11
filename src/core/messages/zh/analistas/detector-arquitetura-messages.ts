// SPDX-License-Identifier: MIT

/**
 * @fileoverview 架构检测器的诊断消息。
 * 提供文本模板，用于报告已识别的架构模式、
 * 违规、耦合/内聚度量和分析错误。
 */

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : '未知错误';
}
export const DetectorArquiteturaMensagens = {
  padraoArquitetural: (padraoIdentificado: string | undefined, confianca: number) => `架构模式：${padraoIdentificado}（${confianca}% 置信度）`,
  caracteristicas: (caracteristicas: string[]) => `特征：${caracteristicas.slice(0, 3).join(', ')}`,
  violacao: (violacao: string) => `架构违规：${violacao}`,
  metricas: (acoplamento: number, coesao: number) => `度量：耦合度=${(acoplamento * 100).toFixed(0)}%，内聚度=${(coesao * 100).toFixed(0)}%`,
  erroAnalisarArquitetura: (erro: ErroUnknown) => `分析架构时出错：${erroToMessage(erro)}`
} as const;
