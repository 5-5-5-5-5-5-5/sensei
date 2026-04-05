// SPDX-License-Identifier: MIT

export const CliComandoGuardianMessages = {
  baselineNotAllowedFullScan: 'Accepting baseline is not allowed in --full-scan mode. Remove the flag and retry.',
  diffChangesDetected: (drift: number) => `Detected ${drift} change(s) since baseline.`,
  diffHowToAcceptChanges: 'Run `sensei guardian --accept-baseline` to accept these changes.',
  baselineCreatedHowToAccept: 'Run `sensei guardian --accept-baseline` to accept it or `sensei diagnosticar` again.'
} as const;
