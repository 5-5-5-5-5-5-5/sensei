// SPDX-License-Identifier: MIT

/**
 * @fileoverview プロジェクト構造検出器用の診断メッセージ。
 * monorepo、fullstack構造、バックエンド/フロントエンドのシグナル、
 * 複数のエントリポイント、設定ファイル、ディレクトリ命名規則を検出するための
 * テキストテンプレートを提供します。
 */

type EntrypointsAgrupadosArgs = {
  previewGrupos: string;
  sufixoOcultos?: string;
};
export const DetectorEstruturaMensagens = {
  monorepoDetectado: 'Monorepo構造が検出されました。',
  monorepoSemPackages: 'packages/フォルダのないMonorepo。',
  fullstackDetectado: 'Fullstack構造が検出されました。',
  pagesSemApi: 'プロジェクトはpages/がありますがapi/がありません。',
  estruturaMista: 'プロジェクトは同時にsrc/とpackages/を持っています（monorepo）。組織を評価してください。',
  muitosArquivosRaiz: 'ルートに多くのファイルがあります。フォルダに整理することを検討してください。',
  sinaisBackend: 'バックエンドのシグナルが検出されました（controllers/、prisma/、api/）。',
  sinaisFrontend: 'フロントエンドのシグナルが検出されました（components/、pages/）。',
  projetoGrandeSemSrc: 'src/フォルダのない大きなプロジェクト。ソースコードを整理することを検討してください。',
  arquivosConfigDetectados: (detectados: string[]) => `検出された設定ファイル: ${detectados.join(', ')}`,
  multiplosEntrypointsAgrupados: ({
    previewGrupos,
    sufixoOcultos
  }: EntrypointsAgrupadosArgs) => sufixoOcultos && sufixoOcultos.length > 0 ? `プロジェクトは複数のエントリポイントを持っています（ディレクトリ別）: ${previewGrupos} … (${sufixoOcultos}非表示)` : `プロジェクトは複数のエントリポイントを持っています（ディレクトリ別）: ${previewGrupos}`,
  multiplosEntrypointsLista: (preview: string[], resto: number) => resto > 0 ? `プロジェクトは複数のエントリポイントを持っています: ${preview.join(', ')} … (+${resto}非表示)` : `プロジェクトは複数のエントリポイントを持っています: ${preview.join(', ')}`,
  nomeDiretorioNaoConforme: (atual: string, esperado: string) => `ディレクトリ'${atual}'は命名規則に従いません。期待される名前: '${esperado}'.`
} as const;
