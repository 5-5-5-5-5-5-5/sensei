// SPDX-License-Identifier: MIT

export const CliComandoNameMensagens = {
  descricao: 'リポジトリ内の変数名を管理します。--escreverで名前を抽出して--replaceでリネームを適用します。',
  opcaoEscrever: '変数名を抽出し、names/にマッピングファイルを生成します（ミラー構造）。',
  opcaoReplace: 'names/内のマッピングファイルに基づいて変数のリネームを適用します。',
  opcaoLegacy: 'names/name.txtも生成します（レガシーモード）、--escreverと共に使用します。',
  initiatingVarredura: '変数名のスキャンを開始...',
  avisoErroProcessar: '[警告] {arquivo}の処理エラー',
  varreduraConcluidaFragmentada: 'スキャン完了！{variaveis}個の変数、{arquivos}個のファイル。{pastaFragmentada}にマッピング、{pastaAgregada}に集約。',
  varreduraConcluidaEspelhada: 'スキャン完了！{variaveis}個の変数、{arquivos}個のファイル。{pasta}にマッピング（ミラー構造）。',
  nenhumArquivoMapeamento: '{pasta}にマッピングファイルがありません。先に{comando}を実行してください。',
  pastaNaoEncontrada: 'マッピングフォルダが見つかりません: {pasta}。先に{comando}を実行してください。',
  nenhumMapeamento: '翻訳マッピングが見つかりません（形式: oldName = newName）。',
  conflitoMapeamento: '"{nome}"のマッピング競合: {arquivo}は"{novo}"を使用、以前は"{anterior}"（last wins）。',
  iniciandoRenomeacao: '変数のリネームを開始（{total}個のマッピング）...',
  arquivoAtualizado: '更新: {arquivo}',
  renomeacaoConcluida: 'リネーム完了！{total}個のファイルを更新。',
  uso: '使用方法: name --escrever（名前を抽出）または name --replace（リネームを適用）。--legacyと組み合わせると集約モードになります。',
} as const;