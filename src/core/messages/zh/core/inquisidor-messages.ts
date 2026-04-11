// SPDX-License-Identifier: MIT

/**
 * @fileoverview Inquisitor (AST 解析器) 的诊断消息。
 * 提供用于报告解析失败、AST 错误
 * 以及聚合被抑制的解析错误的文本模板。
 */

export const InquisidorMensagens = {
  parseAstNaoGerada: '解析错误: 未生成 AST (代码可能无效)。',
  parseErro: (erro: string) => `解析错误: ${erro}`,
  parseErrosAgregados: (quantidade: number) => `聚合解析错误: 此文件中抑制了 ${quantidade} 处出现 (仅显示 1 处)。`,
  falhaGerarAst: (relPath: string, erro: string) => `无法为 ${relPath} 生成 AST: ${erro}`
} as const;
