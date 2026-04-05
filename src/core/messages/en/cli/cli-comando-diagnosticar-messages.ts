// SPDX-License-Identifier: MIT

export const CliComandoDiagnosticarMessages = {
  blankLine: '',
  fastModeType: 'diagnostico',
  suggestionsHeader: '┌── Quick suggestions ─────────────────────────────────────────',
  suggestionsFooter: '└───────────────────────────────────────────────────────────────',
  noRelevantFlag: 'No relevant flag detected — run with --help to see all.',
  detailLine: (texto: string) => `  ${texto}`,
  detailStructuredOutput: 'Structured output: prints JSON (useful for CI). Combine with --export to save file.',
  detailGuardian: 'Guardian: runs integrity check (recommended for deploys).',
  detailExecutive: 'Executive: shows only critical issues (ideal for executive meetings).',
  detailFull: 'Full: generates detailed report locally (can be verbose).',
  detailFast: 'Fast: parallel processing with Workers (ideal for large projects and CI).',
  detailCompact: 'Compact: consolidates progress and shows only the essentials.',
  detailAutoFix: 'Auto-fix: applies quick fixes. Use with caution.',
  detailAutoFixConservative: 'Shortcut: equivalent to --auto-fix --auto-fix-mode conservative',
  detailIncludePatterns: (count: number, joined: string) => `Include patterns: ${count} (${joined})`,
  detailExcludePatterns: (count: number, joined: string) => `Exclude patterns: ${count} (${joined})`,
  detailExport: (relDir: string) => `Export: summary saved in ./${relDir} (default).`,
  detailExportFull: 'Export-full: generates gzip shards and a manifest (can be large). Use only when you need the full dump.',
  detailLogLevel: (logNivel: string) => `log-level: ${String(logNivel)} (use --log-level debug for more verbosity)`,
  tipPreferLogLevelDebug: 'Tip: prefer --log-level debug instead of legacy --debug/--dev.',
  tipAutoFixConservative: 'Tip: --auto-fix-conservative is a shortcut; prefer using explicitly --auto-fix --auto-fix-mode conservative for clarity.',
  spinnerRunning: '[SCAN] Diagnosis in progress...',
  spinnerPhase: (titulo: string) => `[SCAN] ${titulo}...`,
  spinnerCompleted: 'Diagnosis completed.',
  spinnerFailed: 'Diagnosis failed.'
} as const;
