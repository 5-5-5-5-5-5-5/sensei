// SPDX-License-Identifier: MIT

/**
 * @fileoverview 診断用アナリストメッセージ（ASTパーサー）。
 * 解析失敗、ASTエラー、抑制された解析エラーの集約のテキストテンプレートを提供
 */

export const InquisidorMensagens = {
  parseAstNaoGerada: '解析エラー: ASTが生成されませんでした（コードが無効な可能性があります）。',
  parseErro: (erro: string) => `解析エラー: ${erro}`,
  parseErrosAgregados: (quantidade: number) => `集約解析エラー: このファイルで${quantidade}件の発生が抑制されました（1つを表示）。`,
  falhaGerarAst: (relPath: string, erro: string) => `${relPath}のAST生成に失敗しました: ${erro}`
} as const;
