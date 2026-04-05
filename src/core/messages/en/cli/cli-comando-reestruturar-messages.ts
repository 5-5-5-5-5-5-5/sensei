// SPDX-License-Identifier: MIT

import { ICONES_ACAO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_STATUS } from '../../shared/icons.js';

export const CliComandoReestruturarMessages = {
  start: `\n${ICONES_COMANDO.reestruturar} Starting restructuring process...\n`,
  spinnerCalculatingPlan: `${ICONES_DIAGNOSTICO.progresso} Calculating restructuring plan...`,
  suggestedPlanFast: (origem: string, moverLen: number) => `${ICONES_STATUS.ok} Suggested plan (${origem}) FAST: ${moverLen} move(s)`,
  dryRunFast: 'Dry-run requested (--plan-only). (FAST MODE)',
  restructuringCompletedFast: (moverLen: number) => `${ICONES_STATUS.ok} Restructuring completed: ${moverLen} moves. (FAST MODE)`,
  planCalculatedFastNotApplied: 'Plan calculated in FAST MODE (no actions applied without --auto).',
  errorDuringRestructuring: (erroMensagem: string) => `${ICONES_STATUS.falha} Error during restructuring: ${erroMensagem}`,
  spinnerEmptyPlan: 'Empty plan: no moves suggested.',
  spinnerSuggestedPlan: (origem: string, moverLen: number) => `Suggested plan (${origem}): ${moverLen} move(s)`,
  spinnerConflictsDetected: (qtd: number) => `Conflicts detected: ${qtd}`,
  spinnerNoSuggestedPlan: 'No suggested plan (no candidates or error). Using occurrences.',
  fullDryRun: 'Dry-run requested (--plan-only). No actions applied.',
  tipToApply: 'To apply the actual moves, run again with the --auto (or --apply) flag.',
  fallbackStructuralProblems: (qtd: number) => `\n${qtd} structural problems detected for correction:`,
  fallbackOccurrenceLine: (tipo: string, rel: string, mensagem: string) => `- [${tipo}] ${rel}: ${mensagem}`,
  noneNeeded: 'No structural correction needed. Repository already optimized!',
  canceledPromptError: `${ICONES_STATUS.falha} Restructuring canceled. (Prompt error)`,
  canceledUseAuto: `${ICONES_STATUS.falha} Restructuring canceled. (Use --auto to apply without prompt)`,
  spinnerApplying: `${ICONES_ACAO.correcao} Applying moves...`,
  restructuringCompleted: (qtd: number, frase: string) => `Restructuring completed: ${qtd} ${frase}.`,
  restructuringFailed: 'Restructuring failed.'
} as const;
