// SPDX-License-Identifier: MIT

export const CliComandoReverterMensagens = {
  mapaLimpoComSucesso: (iconeSucesso: string) => `${iconeSucesso} ロールバックマップが正常にクリアされました`,
  ultimoMove: (dataPtBr: string) => `最後のmove: ${dataPtBr}`
} as const;
