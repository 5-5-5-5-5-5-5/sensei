// SPDX-License-Identifier: MIT

export const CliComandoNamesMensagens = {
  descricao: '扫描仓库中的变量名并生成映射文件（names/ 中的分片结构）。',
  opcaoAgregado: '同时生成单一的 names/name.txt（与旧流程兼容）。',
  iniciandoVarredura: '开始扫描变量名...',
  avisoErroProcessar: '[警告] 处理 {arquivo} 时出错',
  varreduraConcluidaFragmentada: '扫描完成！{variaveis} 个变量，{arquivos} 个文件。分片映射在 {pastaFragmentada}，聚合在 {pastaAgregada}。',
  varreduraConcluidaEspelhada: '扫描完成！{variaveis} 个变量，{arquivos} 个文件。映射在 {pasta}（镜像结构）。',
} as const;
