// SPDX-License-Identifier: MIT

/**
 * @fileoverview 询问者(AST解析器)的诊断消息。
 * 提供用于报告解析失败、AST错误和聚合的隐藏解析错误的文本模板。
 */

export const InquisidorMensagens = {
  parseAstNaoGerada: '解析错误: AST未生成(代码可能无效)。',
  parseErro: (erro: string) => `解析错误: ${erro}`,
  parseErrosAgregados: (quantidade: number) => `聚合解析错误: ${quantidade}个隐藏问题(显示1个)`,
  falhaGerarAst: (relPath: string, erro: string) => `为${relPath}生成AST失败: ${erro}`
} as const;