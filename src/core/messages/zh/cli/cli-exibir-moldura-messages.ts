// SPDX-License-Identifier: MIT

export const CliExibirMolduraMensagens = {
  fallbackLinha: (linha: string) => `  ${linha}`,
  planoTitulo: '重构计划',
  planoCabecalhoLinha1: '从                                → 到',
  planoCabecalhoLinha2: '----------------------------------  ----------------------------------------',
  planoOverflow: (restantes: number) => `... +${restantes} 剩余`,
  planoFallbackLinha: (de: string, para: string) => `  - ${de} → ${para}`,
  planoFallbackOverflow: (restantes: number) => `  ... +${restantes} 剩余`,
  conflitosTitulo: '目标冲突',
  conflitosCabecalhoLinha1: '目标                             原因',
  conflitosCabecalhoLinha2: '-------------------------------   ------------------------------------',
  conflitosOverflow: (restantes: number) => `... +${restantes} 剩余`,
  conflitosFallbackLinha: (alvo: string, motivo: string) => `  - ${alvo} :: ${motivo}`,
  conflitosFallbackOverflow: (restantes: number) => `  ... +${restantes} 剩余`
} as const;
