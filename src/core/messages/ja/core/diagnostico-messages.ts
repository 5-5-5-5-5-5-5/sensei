// SPDX-License-Identifier: MIT
// @prometheus-disable tipo-literal-inline-complexo
//  justificativa: メッセージヘルパー用のインラインタイプ
/**
 * 診断コマンドメッセージ
 *
 * リポジトリの診断に関連するすべてのメッセージを集中化管理
 */

import type { ModoOperacao } from '@';

/**
 * 診断アイコン
 */
export const ICONES_DIAGNOSTICO = {
  inicio: '[SCAN]',
  progresso: '[...]',
  arquivos: '[DIR]',
  analise: '[SCAN]',
  arquetipos: '[ARQ]',
  guardian: '[GUARD]',
  autoFix: '[FIX]',
  export: '[EXP]',
  sucesso: '[OK]',
  aviso: '[AVISO]',
  erro: '[ERRO]',
  info: '[i]',
  dica: '[DICA]',
  executive: '[STATS]',
  rapido: '[FAST]'
} as const;

/**
 * モード別の開始メッセージ
 */
export const MENSAGENS_INICIO: Record<ModoOperacao, string> = {
  compact: `${ICONES_DIAGNOSTICO.inicio} 診断（コンパクトモード）`,
  full: `${ICONES_DIAGNOSTICO.inicio} 完全診断を開始`,
  executive: `${ICONES_DIAGNOSTICO.executive} エグゼクティブ分析（重大のみ）`,
  quick: `${ICONES_DIAGNOSTICO.rapido} クイック分析`
};

/**
 * 進捗メッセージ
 */
export const MENSAGENS_PROGRESSO = {
  varredura: (total: number) => `${ICONES_DIAGNOSTICO.arquivos} ${total}ファイルをスキャン中...`,
  analise: (atual: number, total: number) => `${ICONES_DIAGNOSTICO.analise} 分析中: ${atual}/${total}`,
  arquetipos: `${ICONES_DIAGNOSTICO.arquetipos} プロジェクト構造を検出中...`,
  guardian: `${ICONES_DIAGNOSTICO.guardian} 整合性を確認中...`,
  autoFix: (modo: string) => `${ICONES_DIAGNOSTICO.autoFix} 修正を適用（モード: ${modo}）...`,
  export: (formato: string) => `${ICONES_DIAGNOSTICO.export} レポートをエクスポート（${formato}）...`
} as const;

/**
 * 完了メッセージ
 */
export const MENSAGENS_CONCLUSAO = {
  sucesso: (ocorrencias: number) => `${ICONES_DIAGNOSTICO.sucesso} 診断が完了しました: ${ocorrencias}件の発見`,
  semProblemas: `${ICONES_DIAGNOSTICO.sucesso} 問題が見つかりませんでした！コードは最適な状態です。`,
  exportado: (caminho: string) => `${ICONES_DIAGNOSTICO.export} レポートを保存: ${caminho}`
} as const;

/**
 * エラーメッセージ
 */
export const MENSAGENS_ERRO = {
  falhaAnalise: (erro: string) => `${ICONES_DIAGNOSTICO.erro} 分析に失敗しました: ${erro}`,
  falhaExport: (erro: string) => `${ICONES_DIAGNOSTICO.erro} エクスポートに失敗しました: ${erro}`,
  falhaGuardian: (erro: string) => `${ICONES_DIAGNOSTICO.erro} Guardianが失敗しました: ${erro}`,
  falhaAutoFix: (erro: string) => `${ICONES_DIAGNOSTICO.erro} 自動修正が失敗しました: ${erro}`,
  flagsInvalidas: (erros: string[]) => `${ICONES_DIAGNOSTICO.erro} 無効なフラグ:\n${erros.map(e => `  • ${e}`).join('\n')}`
} as const;

/**
 * 警告メッセージ
 */
export const MENSAGENS_AVISO = {
  modoFast: `${ICONES_DIAGNOSTICO.info} ファストモードアクティブ（PROMETHEUS_TEST_FAST=1）`,
  semMutateFS: `${ICONES_DIAGNOSTICO.aviso} 自動修正が無効です。`,
  guardianDesabilitado: `${ICONES_DIAGNOSTICO.info} Guardianが実行されませんでした`,
  arquetiposTimeout: `${ICONES_DIAGNOSTICO.aviso} アーキタイプ検出がタイムアウトしました`
} as const;

/**
 * フィルタメッセージ
 */
export const MENSAGENS_FILTROS = {
  titulo: '有効なフィルタ',
  include: (patterns: string[]) => `含める: ${patterns.length > 0 ? patterns.join(', ') : 'なし'}`,
  exclude: (patterns: string[]) => `除外: ${patterns.length > 0 ? patterns.join(', ') : 'デフォルトパターン'}`,
  nodeModules: (incluido: boolean) => `node_modules: ${incluido ? `${ICONES_DIAGNOSTICO.sucesso} 含める` : `${ICONES_DIAGNOSTICO.aviso} 無視（デフォルト）`}`
} as const;

/**
 * 統計メッセージ
 */
export const MENSAGENS_ESTATISTICAS = {
  titulo: '分析統計',
  arquivos: (total: number) => `分析されたファイル: ${total}`,
  ocorrencias: (total: number) => `発見された発生数: ${total}`,
  porTipo: (tipo: string, count: number) => `  • ${tipo}: ${count}`,
  duracao: (ms: number) => {
    if (ms < 1000) return `所要時間: ${ms}ms`;
    if (ms < 60000) return `所要時間: ${(ms / 1000).toFixed(1)}s`;
    const min = Math.floor(ms / 60000);
    const seg = Math.floor(ms % 60000 / 1000);
    return `所要時間: ${min}分 ${seg}秒`;
  }
} as const;

/**
 * Guardianメッセージ
 */
export const MENSAGENS_GUARDIAN = {
  initiating: `${ICONES_DIAGNOSTICO.guardian} Guardian確認を開始...`,
  baseline: '既存のベースラインを使用',
  fullScan: 'フルスキャンアクティブ（ignoreを無視）',
  saveBaseline: '新しいベースラインを保存中...',
  status: {
    verde: `${ICONES_DIAGNOSTICO.sucesso} Guardian: ステータス GREEN（整合性OK）`,
    amarelo: `${ICONES_DIAGNOSTICO.aviso} ステータス YELLOW（注意が必要）`,
    vermelho: `${ICONES_DIAGNOSTICO.erro} ステータス RED（重大問題）`
  },
  drift: (count: number) => `ドリフトを検出: ベースラインからの${count}件の変更`
} as const;

// MENSAGENS_AUTOFIXは統合のためcorrecoes-messages.tsに移動しました

/**
 * アーキタイプメッセージ
 */
export const MENSAGENS_ARQUETIPOS = {
  detectando: `${ICONES_DIAGNOSTICO.arquetipos} プロジェクト構造を検出中...`,
  identificado: (tipo: string, confianca: number) => `特定されたアーキタイプ: ${tipo}（${confianca}%信頼度）`,
  multiplos: (count: number) => `${count}件のアーキタイプ候補が見つかりました`,
  salvando: 'カスタムアーキタイプを保存中...',
  salvo: (caminho: string) => `${ICONES_DIAGNOSTICO.sucesso} アーキタイプを保存: ${caminho}`
} as const;

/**
 * ブロックテンプレート
 */
export const MODELOS_BLOCO = {
  sugestoes: {
    titulo: 'クイック提案',
    formatarFlag: (flag: string, descricao: string) => `${flag}: ${descricao}`,
    formatarDica: (dica: string) => `${ICONES_DIAGNOSTICO.dica} ${dica}`
  },
  resumo: {
    titulo: '診断サマリー',
    secoes: {
      filtros: '適用されたフィルタ',
      estatisticas: '統計',
      arquetipos: 'プロジェクト構造',
      guardian: '整合性（Guardian）',
      autoFix: '自動修正'
    }
  }
} as const;

/**
 * フラグ提案ブロックをフォーマット
 */
export function formatarBlocoSugestoes(flagsAtivas: string[], dicas: string[]): string[] {
  const linhas: string[] = [];
  linhas.push(''); // 空行
  linhas.push(`┌── ${MODELOS_BLOCO.sugestoes.titulo} ─────────────────────────────────────────`);
  if (flagsAtivas.length > 0) {
    linhas.push(`アクティブなフラグ: ${flagsAtivas.join(' ')}`);
  } else {
    linhas.push('特別なフラグは検出されませんでした');
  }
  if (dicas.length > 0) {
    linhas.push('');
    linhas.push('有用的情報:');
    for (const dica of dicas) {
      linhas.push(`  ${dica}`);
    }
  }
  linhas.push('└───────────────────────────────────────────────────────────────');
  linhas.push(''); // 空行

  return linhas;
}

/**
 * 統計サマリーをフォーマット
 */
export function formatarResumoStats(stats: {
  arquivos: number;
  ocorrencias: number;
  duracao: number;
  porTipo?: Record<string, number>;
}): string[] {
  const linhas: string[] = [];
  linhas.push(''); // 空行
  linhas.push(`┌── ${MODELOS_BLOCO.resumo.secoes.estatisticas} ─────────────────────────────────────────`);
  linhas.push(`  ${MENSAGENS_ESTATISTICAS.arquivos(stats.arquivos)}`);
  linhas.push(`  ${MENSAGENS_ESTATISTICAS.ocorrencias(stats.ocorrencias)}`);
  if (stats.porTipo && Object.keys(stats.porTipo).length > 0) {
    linhas.push('');
    linhas.push('  タイプ別:');
    for (const [tipo, count] of Object.entries(stats.porTipo)) {
      linhas.push(`    ${MENSAGENS_ESTATISTICAS.porTipo(tipo, count)}`);
    }
  }
  linhas.push('');
  linhas.push(`  ${MENSAGENS_ESTATISTICAS.duracao(stats.duracao)}`);
  linhas.push('└───────────────────────────────────────────────────────────────');
  linhas.push(''); // 空行

  return linhas;
}

/**
 * JSONモードメッセージをフォーマット
 */
export function formatarModoJson(ascii: boolean): string {
  return `${ICONES_DIAGNOSTICO.info} 構造化JSON出力${ascii ? ' (ASCIIエスケープ)' : ''} アクティブ`;
}

/**
 * コマンド用のヘッダーと標準テキスト
 */
export const CABECALHOS = {
  analistas: {
    tituloFast: `${ICONES_DIAGNOSTICO.info} 登録されたアナリスト（FAST MODE）`,
    titulo: `${ICONES_DIAGNOSTICO.info} 登録されたアナリスト`,
    mdTitulo: '# 登録されたアナリスト'
  },
  diagnostico: {
    flagsAtivas: 'アクティブなフラグ:',
    informacoesUteis: '有益な情報:'
  },
  reestruturar: {
    prioridadeDomainsFlat: `${ICONES_DIAGNOSTICO.aviso} --domainsと--flatの両方が指定されました。--domainsを優先します。`,
    planoVazioFast: `${ICONES_DIAGNOSTICO.info} 空のプラン: 移動の提案なし。（FAST MODE）`,
    nenhumNecessarioFast: `${ICONES_DIAGNOSTICO.sucesso} 構造修正は不要です。（FAST MODE）`,
    conflitosDetectadosFast: (count: number) => `${ICONES_DIAGNOSTICO.aviso} 検出された競合: ${count} （FAST MODE）`
  }
} as const;
