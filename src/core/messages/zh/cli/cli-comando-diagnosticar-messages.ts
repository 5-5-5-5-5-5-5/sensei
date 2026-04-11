// SPDX-License-Identifier: MIT

export const CliComandoDiagnosticarMensagens = {
  linhaEmBranco: '',
  fastModeTipo: 'diagnostico',
  sugestoesHeader: '┌── 快速建议 ────────────────────────────────────────────────',
  sugestoesFooter: '└───────────────────────────────────────────────────────────────',
  nenhumaFlagRelevante: '未检测到相关标志 — 使用 --help 查看全部。',
  detalheLinha: (texto: string) => `  ${texto}`,
  detalheSaidaEstruturada: '结构化输出：打印 JSON（适用于 CI）。结合 --export 保存文件。',
  detalheGuardian: 'Guardian：执行完整性检查（推荐用于部署）。',
  detalheExecutive: 'Executive：仅显示严重问题（适合高层会议）。',
  detalheFull: 'Full：本地生成详细报告（可能较冗长）。',
  detalheFast: 'Fast：使用 Worker 并行处理（适合大型项目和 CI）。',
  detalheCompact: 'Compact：合并进度信息，仅显示关键内容。',
  detalheAutoFix: 'Auto-fix：应用快速修复。请谨慎使用。',
  detalheAutoFixConservative: '快捷方式：等同于 --auto-fix --auto-fix-mode conservative',
  detalheIncludePatterns: (count: number, joined: string) => `包含模式：${count} 个（${joined}）`,
  detalheExcludePatterns: (count: number, joined: string) => `排除模式：${count} 个（${joined}）`,
  detalheExport: (relDir: string) => `Export：摘要已保存到 ./${relDir}（默认）。`,
  detalheExportFull: 'Export-full：生成 gzip 分片和清单（可能很大）。仅在需要完整转储时使用。',
  detalheLogLevel: (logNivel: string) => `log-level：${String(logNivel)}（使用 --log-level debug 获取更多详细信息）`,
  dicaPrefiraLogLevelDebug: '提示：优先使用 --log-level debug 而非旧版 --debug/--dev。',
  dicaAutoFixConservative: '提示：--auto-fix-conservative 是快捷方式；为清晰起见，建议显式使用 --auto-fix --auto-fix-mode conservative。',
  spinnerExecutando: '[扫描] 诊断正在执行...',
  spinnerFase: (titulo: string) => `[扫描] ${titulo}...`,
  spinnerConcluido: '诊断完成。',
  spinnerFalhou: '诊断失败。'
} as const;
