// SPDX-License-Identifier: MIT

import { ICONES_FEEDBACK } from '../../shared/icons.js';

export const CliArquetipoHandlerMensagens = {
  timeoutDeteccao: `${ICONES_FEEDBACK.atencao} 原型检测超时`,
  erroDeteccao: (mensagem: string) => `原型检测错误：${mensagem}`,
  devErroPrefixo: '[原型处理程序] 错误：',
  falhaSalvar: (mensagem: string) => `保存原型失败：${mensagem}`
} as const;
