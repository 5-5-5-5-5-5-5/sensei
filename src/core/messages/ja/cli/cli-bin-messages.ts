// SPDX-License-Identifier: MIT

export const CliBinMensagens = {
  flagsInvalidas: '無効なフラグ: {error}',
  unhandledRejection: 'Prometheus: 処理されていないリジェクション',
  excecaoNaoCapturada: 'キャッチされていない例外: {mensagem}',
  erroInicializacao: 'prometheusの初期化エラー:',
  resumoConversa: {
    titulo: '\n📊 会話の概要',
    total: '合計: {total}',
    usuario: 'ユーザー: {total}',
    prometheus: 'Prometheus: {total}',
    primeira: '最初: {mensagem}',
    ultima: '最後: {mensagem}',
  },
  historicoIndisponivel: '履歴が利用できません。',
  historicoLimpo: '履歴がクリアされました。',
} as const;
