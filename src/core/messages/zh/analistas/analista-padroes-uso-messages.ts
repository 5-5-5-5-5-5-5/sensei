// SPDX-License-Identifier: MIT

/**
 * @fileoverview 代码使用模式分析器的诊断消息。
 * 提供文本模板，用于检测 TypeScript 中 `var`、`eval`、`require` 的使用、
 * 匿名函数以及其他不推荐的构造。
 */

export const PadroesUsoMensagens = {
  varUsage: "检测到使用 'var'。请优先使用 'let' 或 'const'。",
  letUsage: "检测到使用 'let'。如果没有重新赋值，请考虑使用 'const'。",
  requireInTs: "在 TypeScript 文件中使用 'require'。请优先使用 'import'。",
  evalUsage: "检测到使用 'eval'。出于安全和性能考虑请避免使用。",
  moduleExportsInTs: "在 TypeScript 文件中使用 'module.exports' 或 'exports'。请优先使用 'export'。",
  withUsage: "检测到使用 'with'。出于可读性和作用域考虑请避免使用。",
  anonymousFunction: '检测到匿名函数。请考虑为函数命名以提高可追溯性。',
  arrowAsClassMethod: '箭头函数被用作类方法。请优先使用传统方法以获得更好的继承。',
  erroAnalise: (relPath: string, erro: string) => `分析 ${relPath} 中的使用模式失败：${erro}`
} as const;
