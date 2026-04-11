// SPDX-License-Identifier: MIT

export const CliComandoRenameMensagens = {
  descricao: '基于 names/ 中的映射文件应用变量重命名。',
  nenhumArquivoMapeamento: '{pasta} 中没有映射文件。请先运行 {comando} 命令。',
  pastaNaoEncontrada: '未找到映射目录：{pasta}。请先运行 {comando} 命令。',
  nenhumMapeamento: '未找到翻译映射（格式：每行 oldName = newName）。',
  conflitoMapeamento: '"{nome}" 的映射冲突：{arquivo} 使用 "{novo}"，之前是 "{anterior}"（以最后为准）。',
  iniciandoRenomeacao: '开始变量重命名（{total} 个映射）...',
  arquivoAtualizado: '已更新：{arquivo}',
  renomeacaoConcluida: '重命名完成！{total} 个文件已更新。',
} as const;
