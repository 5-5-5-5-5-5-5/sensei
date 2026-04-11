// SPDX-License-Identifier: MIT

export const CliComandoGuardianMensagens = {
  baselineNaoPermitidoFullScan: '在 --full-scan 模式下不允许接受基线。请移除该标志后重试。',
  diffMudancasDetectadas: (drift: number) => `自基线以来检测到 ${drift} 处更改。`,
  diffComoAceitarMudancas: '运行 `prometheus guardian --accept-baseline` 以接受这些更改。',
  baselineCriadoComoAceitar: '运行 `prometheus guardian --accept-baseline` 以接受，或再次运行 `prometheus diagnosticar`。'
} as const;
