export const ExecutorExtraMensagens = {
  tecnicaGlobal: 'グローバル"{nome}"テクニック',
  erroTecnicaGlobal: '{prefixo} グローバル'{nome}'テクニックエラー: {erro}',
  stackTrace: 'スタックトレース:',
  modoRapido: '🚀 クイックモードアクティブ: Workersによる並列処理',
  analiseRapidaConcluida: '✅ クイック分析完了: {arquivo}ファイルを{duracao}で分析',
  arquivosAnalisados: '分析されたファイル: {total}',
  arquivoAtual: '{seta} ファイル {atual}/{total}: {arquivo}',
  progresso: '分析されたファイル: {atual}/{total}',
  timeoutGlobal: 'タイムアウト: グローバルアナリスト'{nome}'が{timeout}msを超えました',
  timeoutAnalista: 'タイムアウト: アナリスト'{nome}'が{arquivo}で{timeout}msを超えました',
} as const;
