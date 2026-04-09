export const RelatorioAsyncPatternsMensagens = {
  totalOcorrencias: 'Unhandled-asyncの合計発生: {total}',
  topArquivos: '\n🔴 処理されていないPromiseが最も多いトップ{total}ファイル:\n',
  promiseSemTratamento: '   └─ {total}件の処理されていないpromise',
  prioridade: '   └─ 優先度: {nivel}\n',
  distribuicaoCategoria: '\n📂 カテゴリ別分布:\n',
  categoriaStats: '  {categoria}: {arquivos}ファイル、{promises}promise',
  proximosPassos: '\n📋 次のステップ:\n',
  passo1: '1. CRITICALファイルをレビューし、.catch()またはtry/catchを追加',
  passo2: '2. 多くの発生があるファイルのリファクタリングを検討',
  上位の promise が処理されているかどうかを検証し、堅牢性を確保するためのテストを追加',
  recomendacoes: {
    proximosPassos: [
      'CRITICALファイルをレビューし、.catch()またはtry/catchを追加',
      '多くの発生があるファイルのリファクタリングを検討',
      '上位レベルでpromiseが処理されているかどうかを検証',
      '堅牢性を確保するためのテストを追加',
    ],
  },
} as const;
