// SPDX-License-Identifier: MIT

export const CliComandoNameMensagens = {
  descricao: '管理仓库中的变量名。使用 --escrever 提取名称，使用 --replace 应用重命名。',
  opcaoEscrever: '提取变量名并在 names/ 中生成映射文件（镜像结构）。',
  opcaoReplace: '基于 names/ 中的映射文件应用变量重命名。',
  opcaoLegacy: '同时生成 names/name.txt（旧模式），与 --escrever 一起使用。',
  initiatingVarredura: '开始扫描变量名...',
  avisoErroProcessar: '[警告] 处理 {arquivo} 时出错',
  varreduraConcluidaFragmentada: '扫描完成！{variaveis} 个变量，{arquivos} 个文件。映射在 {pastaFragmentada}，聚合在 {pastaAgregada}。',
  varreduraConcluidaEspelhada: '扫描完成！{variaveis} 个变量，{arquivos} 个文件。映射在 {pasta}（镜像结构）。',
  nenhumArquivoMapeamento: '{pasta} 中没有映射文件。请先运行 {comando}。',
  pastaNaoEncontrada: '未找到映射文件夹：{pasta}。请先运行 {comando}。',
  nenhumMapeamento: '未找到翻译映射（格式：旧名称 = 新名称，每行一个）。',
 冲突映射: '"{nome}" 的映射冲突：{arquivo} 使用 "{novo}"，之前是 "{anterior}"（后者优先）。',
  initiatingRenomeacao: '开始重命名变量（{total} 个映射）...',
  arquivoAtualizado: '已更新：{arquivo}',
  renomeacaoConcluida: '重命名完成！已更新 {total} 个文件。',
  uso: '用法：name --escrever（提取名称）或 name --replace（应用重命名）。结合 --legacy 使用聚合模式。',
} as const;