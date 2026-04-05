// SPDX-License-Identifier: MIT

export const CliBinMensagens = {
  flagsInvalidas: 'Invalid flags: {erro}',
  unhandledRejection: 'Sensei: unhandled rejection',
  excecaoNaoCapturada: 'Uncaught exception: {mensagem}',
  resumoConversa: {
    titulo: '\n📊 CONVERSATION SUMMARY',
    total: 'Total: {total}',
    usuario: 'User: {total}',
    sensei: 'Sensei: {total}',
    primeira: 'First: {mensagem}',
    ultima: 'Last: {mensagem}',
  },
  historicoIndisponivel: 'History unavailable.',
  historicoLimpo: 'History cleared.',
} as const;
