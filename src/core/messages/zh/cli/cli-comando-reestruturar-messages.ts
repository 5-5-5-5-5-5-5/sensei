// SPDX-License-Identifier: MIT

import { ICONES_ACAO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_STATUS } from '../../shared/icons.js';

export const CliComandoReestruturarMensagens = {
  inicio: `\n${ICONES_COMANDO.reestruturar} 开始重构流程...\n`,
  spinnerCalculandoPlano: `${ICONES_DIAGNOSTICO.progresso} 计算重构计划...`,
  planoSugeridoFast: (origem: string, moverLen: number) => `${ICONES_STATUS.ok} 建议的计划（${origem}）快速模式：${moverLen} 次移动`,
  dryRunFast: '已请求模拟运行（--somente-plano）。（快速模式）',
  reestruturacaoConcluidaFast: (moverLen: number) => `${ICONES_STATUS.ok} 重构完成：${moverLen} 次移动。（快速模式）`,
  planoCalculadoFastSemAplicar: '快速模式下计算的计划（未使用 --auto 不会应用任何操作）。',
  erroDuranteReestruturacao: (erroMensagem: string) => `${ICONES_STATUS.falha} 重构过程出错：${erroMensagem}`,
  spinnerPlanoVazio: '空计划：未建议任何移动。',
  spinnerPlanoSugerido: (origem: string, moverLen: number) => `建议的计划（${origem}）：${moverLen} 次移动`,
  spinnerConflitosDetectados: (qtd: number) => `检测到冲突：${qtd}`,
  spinnerSemPlanoSugestao: '没有建议的计划（没有候选项或出错）。使用出现的情况。',
  dryRunCompleto: '已请求模拟运行（--somente-plano）。未应用任何操作。',
  dicaParaAplicar: '要应用实际的移动，请使用 --auto（或 --aplicar）标志重新运行。',
  fallbackProblemasEstruturais: (qtd: number) => `\n检测到 ${qtd} 个需要修复的结构问题：`,
  fallbackLinhaOcorrencia: (tipo: string, rel: string, mensagem: string) => `- [${tipo}] ${rel}：${mensagem}`,
  nenhumNecessario: '无需结构修复。仓库已经优化！',
  canceladoErroPrompt: `${ICONES_STATUS.falha} 重构已取消。（提示出错）`,
  canceladoUseAuto: `${ICONES_STATUS.falha} 重构已取消。（使用 --auto 可在无提示的情况下应用）`,
  spinnerAplicando: `${ICONES_ACAO.correcao} 应用移动...`,
  reestruturacaoConcluida: (qtd: number, frase: string) => `重构完成：${qtd} ${frase}。`,
  falhaReestruturacao: '重构失败。'
} as const;
