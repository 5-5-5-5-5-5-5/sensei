// SPDX-License-Identifier: MIT

export const CliComandoReverterMensagens = {
  mapaLimpoComSucesso: (iconeSucesso: string) => `${iconeSucesso} 回滚映射已成功清除`,
  ultimoMove: (dataPtBr: string) => `最后一次移动：${dataPtBr}`
} as const;
