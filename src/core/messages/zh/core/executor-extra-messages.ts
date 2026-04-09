export const ExecutorExtraMensagens = {
  tecnicaGlobal: '全局技术 "{nome}"',
  erroTecnicaGlobal: '{prefixo} 全局技术错误 \'{nome}\': {erro}',
  stackTrace: '堆栈跟踪:',
  modoRapido: '🚀 快速模式已激活: 使用Workers并行处理',
  analiseRapidaConcluida: '✅ 快速分析完成: {arquivos} 个文件 in {duracao}',
  arquivosAnalisados: '已分析文件: {total}',
  arquivoAtual: '{seta} 文件 {atual}/{total}: {arquivo}',
  progresso: '已分析文件: {atual}/{total}',
  timeoutGlobal: '超时: 全局分析器 \'{nome}\' 超过 {timeout}ms',
  timeoutAnalista: '超时: 分析器 \'{nome}\' 超过 {timeout}ms for {arquivo}',
} as const;