// SPDX-License-Identifier: MIT
/**
 * fix-typesコマンドメッセージ
 *
 * fix-typesコマンドに関連するすべてのメッセージ、テキスト、テンプレートを一元化
 * これはTypeScriptコードの安全でないタイプ（any/unknown）を検出して分類します。
 */

import { ICONES_ACAO, ICONES_ARQUIVO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_FEEDBACK, ICONES_RELATORIO, ICONES_STATUS, ICONES_TIPOS } from '../../shared/icons.js';

/**
 * 安全でないタイプのカテゴリ設定
 */
export const CATEGORIAS_TIPOS = {
  LEGITIMO: {
    icone: ICONES_TIPOS.legitimo,
    nome: '正当',
    descricao: 'unknownの正しい使用 - アクション不要',
    confidenciaMin: 100
  },
  MELHORAVEL: {
    icone: ICONES_TIPOS.melhoravel,
    nome: '改善可能',
    descricao: 'より具体的にできる - 手動レビューを推奨',
    confidenciaMin: 70
  },
  CORRIGIR: {
    icone: ICONES_TIPOS.corrigir,
    nome: '修正必要',
    descricao: '置き換える必要あり - 自動修正可能',
    confidenciaMin: 95
  }
} as const;

/**
 * コマンド開始/ヘッダーメッセージ
 */
export const MENSAGENS_INICIO = {
  titulo: `${ICONES_COMANDO.fixTypes} 安全でないタイプの分析を開始...`,
  analisando: (target: string) => `${ICONES_ARQUIVO.diretorio} 分析中: ${target}`,
  confianciaMin: (min: number) => `${ICONES_DIAGNOSTICO.stats} 最小信頼度: ${min}%`,
  modo: (dryRun: boolean) => `${dryRun ? ICONES_ACAO.analise : ICONES_ACAO.correcao} モード: ${dryRun ? '分析（dry-run）' : '修正を適用'}`
} as const;

/**
 * 進捗/ステータスメッセージ
 */
export const MENSAGENS_PROGRESSO = {
  processandoArquivos: (count: number) => `${ICONES_ARQUIVO.diretorio} ${count}ファイルを処理中...`,
  arquivoAtual: (arquivo: string, count: number) => `${ICONES_ARQUIVO.arquivo} ${arquivo}: ${count}件の発生`
} as const;

/**
 * 要約/統計メッセージ
 */
export const MENSAGENS_RESUMO = {
  encontrados: (count: number) => `${count}件の安全でないタイプが見つかりました:`,
  tituloCategorizacao: `${ICONES_DIAGNOSTICO.stats} 分類分析:`,
  confianciaMedia: (media: number) => `${ICONES_DIAGNOSTICO.stats} 平均信頼度: ${media}%`,
  porcentagem: (count: number, total: number) => {
    const pct = total > 0 ? Math.round(count / total * 100) : 0;
    return `${count}件 (${pct}%)`;
  }
} as const;

/**
 * ヒント/Helpメッセージ
 */
export const DICAS = {
  removerDryRun: '[ヒント] 修正を適用するには--dry-runフラグを削除',
  usarInterativo: '[ヒント] --interactiveを使用して各修正を確認',
  ajustarConfianca: (atual: number) => `${ICONES_FEEDBACK.dica} --confidence <num>を使用してしきい値を調整（現在: ${atual}%）`,
  revisar: (categoria: string) => `${ICONES_FEEDBACK.dica} ${categoria}ケースを手動でレビュー`
} as const;

/**
 * カテゴリ別の推奨アクションメッセージ
 */
export const ACOES_SUGERIDAS = {
  LEGITIMO: ['これらのケースは正しく、そのまま維持する必要があります', '追加のアクションは不要です'],
  MELHORAVEL: ['可能な場合はより具体的なタイプへの置き換えを検討', '将来のリファクタリング時にレビュー', 'unknownの使用についてのコメントを追加'],
  CORRIGIR: ['これらのケースの修正を優先', '特定のTypeScriptタイプに置き換え', '必要に応じてタイプガードを使用']
} as const;

/**
 * エラー/警告メッセージ
 */
export const MENSAGENS_ERRO = {
  correcaoNaoImplementada: '完全な自動修正はまだ実装されていません',
  sistemaDesenvolvimento: `${ICONES_FEEDBACK.foguete} 高度な自動修正システムは開発中`,
  requisitoAnalise: '安全のためにAST解析とタイプ推論が必要です',
  detectorNaoEncontrado: '安全でないタイプデtekторがアナリストレジストリで見つかりません',
  modulosNaoEncontrados: '修正モジュールが見つかりません'
} as const;

/**
 * 成功メッセージ
 */
export const MENSAGENS_SUCESSO = {
  nenhumTipoInseguro: `${ICONES_STATUS.ok} 安全でないタイプが検出されませんでした！コードは良好なタイプ安全性を 가지고 있습니다.`,
  nenhumAltaConfianca: `${ICONES_STATUS.ok} 高信頼度の修正が見つかりませんでした`,
  nenhumaCorrecao: '修正が適用されませんでした（--confidenceでしきい値を調整）'
} as const;

/**
 * CLIフロー固有のメッセージ（行とヘッダー）src/cli/**
 */
export const MENSAGENS_CLI_CORRECAO_TIPOS = {
  linhaEmBranco: '',
  erroExecutar: (mensagem: string) => `fix-typesの実行エラー: ${mensagem}`,
  linhaResumoTipo: (texto: string) => `  ${texto}`,
  exemplosDryRunTitulo: `${ICONES_RELATORIO.lista} 見つかった例（dry-run）:`,
  exemploLinha: (icone: string, relPath: string | undefined, linha: string) => `  ${icone} ${relPath}:${linha}`,
  exemploMensagem: (mensagem: string) => `     └─ ${mensagem}`,
  debugVariavel: (nome: string) => `     └─ 変数: ${nome}`,
  maisOcorrencias: (qtd: number) => `  ...他${qtd}件の発生`,
  aplicandoCorrecoesAuto: `${ICONES_ACAO.correcao} 自動修正を適用中...`,
  exportandoRelatorios: `${ICONES_ACAO.export} レポートをエクスポート中...`,
  // Verbose / 詳細なログ
  verboseAnyDetectado: (arquivo: string, linha: string) => `  ${ICONES_TIPOS.any} ${arquivo}:${linha} - anyが検出されました（推奨修正）`,
  verboseAsAnyCritico: (arquivo: string, linha: string) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - "as any"が検出されました（重要 - 必須修正）`,
  verboseAngleAnyCritico: (arquivo: string, linha: string) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - "<any>"が検出されました（重要 - レガシー構文）`,
  verboseUnknownCategoria: (icone: string, arquivo: string, linha: string, categoria: string, confianca: number) => `  ${icone} ${arquivo}:${linha} - ${categoria} (${confianca}%)`,
  verboseMotivo: (motivo: string) => `     └─ ${motivo}`,
  verboseSugestao: (sugestao: string) => `     └─ ${ICONES_FEEDBACK.dica} ${sugestao}`,
  verboseVariantesTitulo: `     └─ ${ICONES_DIAGNOSTICO.stats} 代替の可能性:`,
  verboseVarianteItem: (idxBase1: number, variante: string) => `        ${idxBase1}. ${variante}`,
  analiseDetalhadaSalva: `${ICONES_ARQUIVO.arquivo} 詳細な分析を保存: .prometheus/fix-types-analise.json`,
  altaConfiancaTitulo: (qtd: number) => `${ICONES_DIAGNOSTICO.stats} ${qtd}件の信頼度修正 (≥85%):`,
  altaConfiancaLinha: (relPath: string | undefined, linha: string, confianca: number) => `  ${ICONES_TIPOS.corrigir} ${relPath}:${linha} (${confianca}%)`,
  altaConfiancaDetalhe: (texto: string) => `     └─ ${texto}`,
  altaConfiancaMais: (qtd: number) => `  ...他${qtd}件の修正`,
  incertosTitulo: (qtd: number) => `${ICONES_FEEDBACK.pergunta} ${qtd}件の不確定な分析 (<70%信頼度):`,
  incertosIntro: '   これらのケースは複数の可能性があるため慎重な手動レビューが必要です',
  incertosLinha: (relPath: string | undefined, linha: string, confianca: number) => `  ${ICONES_TIPOS.melhoravel} ${relPath}:${linha} (${confianca}%)`,
  incertosMais: (qtd: number) => `  ...他${qtd}件の不確定なケース（.prometheus/fix-types-analise.jsonを参照）`,
  correcoesResumoSucesso: (qtd: number) => `${ICONES_STATUS.ok} ${qtd}ファイルが修正されました`,
  correcoesResumoLinhaOk: (arquivo: string, linhas: number) => `   ログ記録  ${arquivo}: ${linhas}行が変更されました`,
  correcoesResumoLinhaErro: (arquivo: string, erro: string | undefined) => `   ${ICONES_STATUS.falha} ${arquivo}: ${erro}`,
  correcoesResumoFalhas: (qtd: number) => `${ICONES_STATUS.falha} ${qtd}ファイルでエラー`,
  dryRunAviso: (iconeInicio: string) => `${iconeInicio} dry-runモードがアクティブ - 変更は適用されません`,
  templatePasso: (passo: string) => `  ${passo}`
} as const;

/**
 * 分類テキスト（理由/提案）ログとエクスポートに表示。
 */
export const TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS = {
  anyMotivo: 'anyは安全でない - 具体的なタイプに置き換え',
  anySugestao: '変数の使用を分析して正しいタイプを推論',
  asAnyMotivo: 'タイプアサーション"as any"はタイプ安全性を完全に無効にします',
  asAnySugestao: '重要: 具体的なタイプに置き換えまたはランタイム検証でunknownを使用',
  angleAnyMotivo: 'レガシータイプキャスト <any>はタイプ安全性を無効にします',
  angleAnySugestao: '重要: モダンな"as"構文に移行し、具体的なタイプを使用',
  semContextoMotivo: 'コンテキストを分析できませんでした',
  semContextoSugestao: '手動でレビュー'
} as const;

/**
 * 最終要約テンプレート
 */
export const TEMPLATE_RESUMO_FINAL = {
  titulo: `${ICONES_RELATORIO.detalhado} 手動で修正を適用するには:`,
  passos: ['上記の分類ケースをレビュー', `正当 (${ICONES_TIPOS.legitimo}): そのまま維持`, `改善可能 (${ICONES_TIPOS.melhoravel}): より具体的なタイプを検討`, `修正必要 (${ICONES_TIPOS.corrigir})を具体的なタイプに置き換え`, '修正後 `npm run lint`を実行']
} as const;

/**
 * コマンドで使用される絵文字とアイコン
 */
export const ICONES = {
  inicio: ICONES_COMANDO.fixTypes,
  aplicando: '[>]',
  analise: '[>]',
  pasta: '[DIR]',
  arquivo: '[FILE]',
  alvo: '[>]',
  edicao: '[EDIT]',
  grafico: '[GRAPH]',
  lampada: '[ヒント]',
  foguete: '[>>]',
  nota: '[NOTE]',
  checkbox: '[OK]',
  setinha: '└─',
  ...CATEGORIAS_TIPOS
} as const;

/**
 * 安全でないタイプメッセージをアイコンとカウンターでフォーマット
 */
export function formatarTipoInseguro(tipo: string, count: number): string {
  const icone = tipo.includes('any') ? ICONES_TIPOS.any : ICONES_TIPOS.unknown;
  const plural = count !== 1 ? 's' : '';
  return `${icone} ${tipo}: ${count}件の発生`;
}

/**
 * individual発生行をフォーマット
 */
export function formatarOcorrencia(relPath: string, linha: number | undefined): string {
  return `  ${ICONES.setinha} ${relPath}:${linha || '?'}`;
}

/**
 * コンテキストメッセージをフォーマット
 */
export function formatarComContexto(mensagem: string, indentLevel: number = 1): string {
  const indent = '  '.repeat(indentLevel);
  return `${indent}${ICONES.setinha} ${mensagem}`;
}

/**
 * 修正提案をフォーマット
 */
export function formatarSugestao(sugestao: string): string {
  return `     ${ICONES.setinha} ${ICONES.lampada} ${sugestao}`;
}

/**
 * カテゴリ要約テキストを生成
 */
export function gerarResumoCategoria(categoria: keyof typeof CATEGORIAS_TIPOS, count: number, total: number): string[] {
  const config = CATEGORIAS_TIPOS[categoria];
  const porcentagem = MENSAGENS_RESUMO.porcentagem(count, total);
  return [categoria === 'CORRIGIR' ? `${config.icone} ${config.nome}: ${porcentagem}` : categoria === 'MELHORAVEL' ? `${config.icone} ${config.nome}: ${porcentagem}` : `${config.icone} ${config.nome}: ${porcentagem}`, `   ${ICONES.setinha} ${config.descricao}`];
}

/**
 * デバッグメッセージ（DEV_MODEのみ）
 */
export const DEPURACAO = {
  categorizacao: (arquivo: string, tipo: string, categoria: string) => `[DEBUG] ${arquivo} - ${tipo} → ${categoria}`,
  confianca: (tipo: string, valor: number) => `[DEBUG] ${tipo}の信頼度: ${valor}%`
} as const;
