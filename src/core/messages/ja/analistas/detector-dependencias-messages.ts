// SPDX-License-Identifier: MIT

/**
 * @fileoverview 依存関係検出器用の診断メッセージ。
 * 外部依存関係へのimport/require、長い相対パス、存在しないファイル、
 * require/importの混合使用、循環import以及其他不好的インポート慣行を
 * 検出するためのテキストテンプレートを提供します。
 */

export const DetectorDependenciasMensagens = {
  importDependenciaExterne: (val: string) => `外部依存関係のインポート: '${val}'`,
  importRelativoLongo: (val: string) => `相対インポートが多くのディレクトリを上がっています: '${val}'`,
  importJsEmTs: (val: string) => `TypeScriptでの.jsファイルのインポート: '${val}'`,
  importArquivoInexistente: (val: string) => `存在しないファイルのインポート: '${val}'`,
  requireDependenciaExterne: (val: string) => `外部依存関係のrequire: '${val}'`,
  requireRelativoLongo: (val: string) => `相対requireが多くのディレクトリを上がっています: '${val}'`,
  requireJsEmTs: (val: string) => `TypeScriptでの.jsファイルのrequire: '${val}'`,
  requireArquivoInexistente: (val: string) => `存在しないファイルのrequire: '${val}'`,
  importUsadoRegistroDinamico: (nome: string) => `インポート'${nome}'が動的レジストリ経由で使われています（ヒューリスティック）`,
  usoMistoRequireImport: '同じファイルでrequireとimportが混合使われています。1つのスタイルに標準化してください。',
  importCircularSelf: '循環インポートが検出されました: ファイルが自分自身をインポートしています。',
  dependenciaCircular: (totalArquivos: number, caminhoCompleto: string) => `循環依存関係が検出されました（${totalArquivos}ファイル）: ${caminhoCompleto}`
} as const;
