// SPDX-License-Identifier: MIT

export const CliFormatarExtraMensagens = {
  titulo: '🧽 格式化',
  scanOnlyAtivo: 'SCAN_ONLY 激活; format 命令需要读取内容。',
  falhaFormatar: '格式化失败 {arquivo}: {erro}',
  errosEncontrados: '错误: {total}',
  precisaFormatacao: '发现 {total} 个文件需要格式化。使用 --write 应用。',
  tudoFormatado: '全部格式化完成。',
  arquivosFormatados: '已格式化 {total} 个文件。',
  nenhumaMudanca: '无需更改。',
} as const;
