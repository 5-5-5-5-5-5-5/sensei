// SPDX-License-Identifier: MIT

import { ICONES_COMANDO } from '../../shared/icons.js';

export const CliComandoPodarMensagens = {
  inicio: `\n${ICONES_COMANDO.podar} 剪定プロセスを開始しています...\n`,
  nenhumaSujeira: (iconeSucesso: string) => `${iconeSucesso} ごみが見つかりませんでした。Repositoryはクリーンです！`,
  orfaosDetectados: (qtd: number) => `\n${qtd}件の孤立ファイルが検出されました:`,
  linhaArquivoOrfao: (arquivo: string) => `- ${arquivo}`,
  confirmarRemocao: 'これらのファイルを削除してもよろしいですか？ (s/N) ',
  erroDurantePoda: (erroMensagem: string) => `[ERRO] 剪定中のエラー: ${erroMensagem}`
} as const;
