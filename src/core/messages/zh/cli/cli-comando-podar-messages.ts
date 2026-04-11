// SPDX-License-Identifier: MIT

import { ICONES_COMANDO } from '../../shared/icons.js';

export const CliComandoPodarMensagens = {
  inicio: `\n${ICONES_COMANDO.podar} 开始清理流程...\n`,
  nenhumaSujeira: (iconeSucesso: string) => `${iconeSucesso} 未检测到垃圾。仓库是干净的！`,
  orfaosDetectados: (qtd: number) => `\n检测到 ${qtd} 个孤立文件：`,
  linhaArquivoOrfao: (arquivo: string) => `- ${arquivo}`,
  confirmarRemocao: '确定要删除这些文件吗？(y/N) ',
  erroDurantePoda: (erroMensagem: string) => `[错误] 清理过程出错：${erroMensagem}`
} as const;
