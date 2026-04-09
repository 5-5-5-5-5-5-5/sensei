// SPDX-License-Identifier: MIT

export const CliComandoGuardianMensagens = {
  baselineNaoPermitidoFullScan: '--full-scanモードではbaselineを受け入れることは許可されていません。フラグを削除して再試行してください。',
  diffMudancasDetectadas: (drift: number) => `ベースライン以降で${drift}件の変更が検出されました。`,
  diffComoAceitarMudancas: '`prometheus guardian --accept-baseline`を実行してこれらの変更を受け入れてください。',
  baselineCriadoComoAceitar: '`prometheus guardian --accept-baseline`を実行して受け入れるか、`prometheus diagnosticar`を再度実行してください。'
} as const;
