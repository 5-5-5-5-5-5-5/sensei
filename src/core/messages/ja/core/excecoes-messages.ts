// SPDX-License-Identifier: MIT

/**
 * @fileoverview コアの例外とエラーメッセージ。
 * CLI、プラグイン、アナリスト、検証、セキュリティ、永続化、
 * スキーマ、スキャナー、ロールバックに関連するエラーメッセージを一元化。
 */

export const ExcecoesMensagens = {
  // CLI
  exit1: 'exit:1',
  requireMutateFsAutoFix: '自動修正は利用できません',
  autoFixTimeout: (timeoutMs: number) => `自動修正が${timeoutMs}ms後にタイムアウトしました`,
  // プラグイン/安全なインポート
  pluginsDesabilitadosSafeMode: 'SAFE_MODEでプラグインの読み込みが無効です。PROMETHEUS_ALLOW_PLUGINS=1を設定して許可してください。',
  pluginBloqueado: (erro: string) => `プラグインがブロックされました: ${erro}`,
  caminhoPluginNaoResolvido: 'プラグインのパスが解決できません',
  // プラグインレジストリ
  pluginRegistradoNaoPodeSerObtido: (name: string) => `プラグイン${name}は登録されていますが取得できません`,
  pluginCarregandoPromiseNaoPodeSerObtida: (name: string) => `プラグイン${name}は読み込み中ですがpromiseを取得できません`,
  naoFoiPossivelCarregarPlugin: (name: string, errMsg: string) => `プラグイン'${name}'を読み込めませんでした: ${errMsg}`,
  pluginDeveTerNomeValido: 'プラグインは有効な名前を持つ必要があります',
  pluginDeveTerVersaoValida: 'プラグインは有効なバージョンを持つ必要があります',
  pluginDeveDefinirPeloMenosUmaExtensao: 'プラグインは少なくとも1つの拡張子を定義する必要があります',
  pluginDeveImplementarMetodoParse: 'プラグインはparse()メソッドを実装する必要があります',
  // タイプ/アナリスト
  definicaoAnalistaInvalida: 'アナリスト定義が無効です',
  analistaSemFuncaoAplicar: (nome: string) => `アナリスト${nome}が適用関数を持っていません`,
  // 検証/セキュリティ
  caminhoForaDaCwdNaoPermitido: (p: string) => `CWD外のパスは許可されていません: ${p}`,
  persistenciaNegadaForaRaizProjeto: (caminho: string) => `永続化が拒否されました: プロジェクトルート外のパス: ${caminho}`,
  // 永続化（環境）
  fsWriteFileBinaryIndisponivel: '現在の環境ではfs.writeFile (binary)が利用できません',
  fsReadFileIndisponivel: 'fs.readFileが現在の環境で利用できません',
  fsWriteFileIndisponivel: 'fs.writeFileが現在の環境で利用できません',
  fsRenameIndisponivel: 'fs.renameが現在の環境で利用できません',
  fsMkdirIndisponivel: 'fs.mkdirが現在の環境で利用できません',
  // スキーマ
  versaoSchemaDesconhecida: (versao: string) => `不明なスキーマバージョン: ${versao}`,
  relatorioSchemaInvalido: (erros: string) => `無効なスキーマを持つレポート: ${erros}`,
  // ファイルレジストリ
  arquivoNaoEncontrado: (fileCaminho: string) => `ファイルが見つかりません: ${fileCaminho}`,
  validacaoFalhouPara: (fileCaminho: string) => `検証が失敗しました: ${fileCaminho}`,
  erroAoLer: (fileCaminho: string, errMsg: string) => `${fileCaminho}の読み取りエラー: ${errMsg}`,
  erroAoEscrever: (fileCaminho: string, errMsg: string) => `${fileCaminho}の書き込みエラー: ${errMsg}`,
  erroAoDeletar: (fileCaminho: string, errMsg: string) => `${fileCaminho}の削除エラー: ${errMsg}`,
  // スキャナー
  statIndefinidoPara: (fullCaminho: string) => `${fullCaminho}のStatが未定義です`,
  // ロールバック
  mapaReversaoCorrompido: 'ロールバックマップが破損しています',
  // レポート
  semPkg: 'pkgなし'
} as const;
