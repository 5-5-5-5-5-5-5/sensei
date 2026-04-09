// SPDX-License-Identifier: MIT

import { ICONES_ACAO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_STATUS } from '../../shared/icons.js';

export const CliComandoReestruturarMensagens = {
  inicio: `\n${ICONES_COMANDO.reestruturar} 再構成プロセスを開始しています...\n`,
  spinnerCalculandoPlano: `${ICONES_DIAGNOSTICO.progresso} 再構成プランを計算中...`,
  planoSugeridoFast: (origem: string, moverLen: number) => `${ICONES_STATUS.ok} 提案されたプラン（${origem}） FAST: ${moverLen}件の移動`,
  dryRunFast: 'Dry-runが要求されました（--somente-plano）。（FAST MODE）',
  reestruturacaoConcluidaFast: (moverLen: number) => `${ICONES_STATUS.ok} 再構成が完了: ${moverLen}件の移動。（FAST MODE）`,
  planoCalculadoFastSemAplicar: 'FAST MODEでプランが計算されました（--autoなしでアクションは適用されませんでした）。',
  erroDuranteReestruturacao: (erroMensagem: string) => `${ICONES_STATUS.falha} 再構成中のエラー: ${erroMensagem}`,
  spinnerPlanoVazio: '空のプラン: 移動の提案なし。',
  spinnerPlanoSugerido: (origem: string, moverLen: number) => `提案されたプラン（${origem}）: ${moverLen}件の移動`,
  spinnerConflitosDetectados: (qtd: number) => `検出された競合: ${qtd}`,
  spinnerSemPlanoSugestao: 'プランの提案なし（候補なしまたはエラー）。発生を使用。',
  dryRunCompleto: 'Dry-runが要求されました（--somente-plano）。アクションは適用されませんでした。',
  dicaParaAplicar: '実際の移動を適用するには、フラグ--auto（または--aplicar）で再度実行してください。',
  fallbackProblemasEstruturais: (qtd: number) => `\n${qtd}件の構造問題が検出され、修正が必要です:`,
  fallbackLinhaOcorrencia: (tipo: string, rel: string, mensagem: string) => `- [${tipo}] ${rel}: ${mensagem}`,
  nenhumNecessario: '構造修正は不要です。Repositoryは既に最適化されています！',
  canceladoErroPrompt: `${ICONES_STATUS.falha} 再構成がキャンセルされました。（プロンプトエラー）`,
  canceladoUseAuto: `${ICONES_STATUS.falha} 再構成がキャンセルされました。（--autoでプロンプトなしで適用）`,
  spinnerAplicando: `${ICONES_ACAO.correcao} 移動を適用中...`,
  reestruturacaoConcluida: (qtd: number, frase: string) => `再構成が完了: ${qtd} ${frase}.`,
  falhaReestruturacao: '再構成に失敗しました。'
} as const;
