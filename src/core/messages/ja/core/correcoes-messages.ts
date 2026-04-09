// SPDX-License-Identifier: MIT
/**
 * 自動修正メッセージ
 *
 * 次に関連するすべてのメッセージを一元化:
 * - クイックフィックス（fix-any-to-proper-type、fix-unknownなど）
 * - ゼラドール（インポート、構造、タイプ）
 * - 一般的な自動修正
 */

import { buildTypesRelPathPosix, getTypesDirectoryDisplay } from '../../../config/conventions.js';
import { ICONES } from '../../shared/icons.js';

/**
 * クイックフィックス - Any/Unknownメッセージ
 */
export const MENSAGENS_CORRECAO_TIPOS = {
  // クイックフィックスのタイトルと説明
  fixAny: {
    title: 'anyを安全なタイプに置き換え',
    get description() { return `${getTypesDirectoryDisplay()}でanyの使用を分析して正しいタイプを推論/作成します` }
  },
  fixUnknown: {
    title: 'unknownを具体的なタイプに置き換え',
    description: 'タイプガードパターンを検出し専用のタイプを作成'
  },
  // 検証メッセージ
  validacao: {
    falha: (erros: string[]) => `検証が失敗しました: ${erros.join(', ')}`,
    revisar: '手動でレビュー'
  },
  // 警告と提案
  warnings: {
    confiancaBaixa: (confianca: number) => `安全でないタイプ（any）が自動修正するには信頼度が低すぎます（${confianca}%）`,
    confiancaMedia: (confianca: number, tipoSugerido: string) => `安全でないタイプが検出されました。提案: ${tipoSugerido}（信頼度: ${confianca}%）`,
    unknownApropriado: 'unknownはここでは適切です（ジェネリック入力または低信頼度）',
    useTiposCentralizados: () => `専用ディレクトリに集中化されたタイプを使用（${getTypesDirectoryDisplay()}）`,
    criarTipoDedicado: (caminho: string) => `${buildTypesRelPathPosix(caminho)}に専用のタイプを作成することを検討`,
    adicioneTypeGuards: () => ` возможноの場合、タイプガードを追加または${getTypesDirectoryDisplay()}に専用のタイプを作成`
  },
  // エラーメッセージ
  erros: {
    extrairNome: '変数名を抽出できませんでした',
    variavelNaoUsada: '変数が使用されていません - タイプを推論できません',
    analise: (erro: string) => `分析エラー: ${erro}`
  }
} as const;

/**
 * 自動修正メッセージ
 */
export const MENSAGENS_AUTOFIX = {
  // ステータスメッセージ
  initiating: (modo: string) => `${ICONES.acao.correcao} 自動修正を開始（モード: ${modo}）`,
  dryRun: `${ICONES.feedback.info} Dry-run: 修正をシミュレート（変更は適用されません）`,
  applying: (count: number) => `${count}件の修正を適用中...`,
  concluded: (aplicadas: number, falhas: number) => `${ICONES.nivel.sucesso} 自動修正完了: ${aplicadas}件適用、${falhas}件失敗`,
  naoDisponivel: `${ICONES.feedback.info} 利用可能な自動修正はありません`,
  // フラグとモード
  flags: {
    fixSafe: `${ICONES.comando.guardian} --fix-safeフラグを検出: コンサervativeモードをアクティブ化`,
    requireMutateFS: `${ICONES.status.falha} 現在自動修正は利用できません。`
  },
  // 進捗ログ
  logs: {
    modoConservador: `${ICONES.comando.guardian} コンサervativeモードがアクティブ - 高信頼度の修正のみ適用`,
    validacaoEslint: `${ICONES.acao.analise} 自動修正後にESLint検証を実行中...`,
    arquivoMovido: (origem: string, destino: string) => `${ICONES.status.ok} 移動: ${origem} → ${destino}`,
    arquivoRevertido: (origem: string, destino: string) => `↩️ ファイルが元に戻されました: ${destino} → ${origem}`,
    arquivoRevertidoConteudo: (origem: string, destino: string) => `↩️ 元のコンテンツでファイルが元に戻されました: ${destino} → ${origem}`
  },
  // 結果
  resultados: {
    sucesso: (count: number) => `${ICONES.status.ok} ${count}ファイルが修正されました`,
    falhas: (count: number) => `${ICONES.status.falha} ${count}ファイルでエラー`,
    erroArquivo: (arquivo: string, erro: string) => `${ICONES.status.falha} ${arquivo}: ${erro}`
  },
  // 修正後のヒント
  dicas: {
    executarLint: `${ICONES.feedback.dica} 修正を確認するには\`npm run lint\`を実行`,
    executarBuild: `${ICONES.feedback.dica} コードがコンパイルされるか確認するには\`npm run build\`を実行`,
    removerDryRun: `${ICONES.feedback.dica} 修正を自動的に適用するには--dry-runを削除`,
    ajustarConfianca: `${ICONES.feedback.dica} --confidence <num>でしきい値を調整（現在: 85%）`
  }
} as const;

/**
 * 分析レポートメッセージ
 */
export const MENSAGENS_RELATORIOS_ANALISE = {
  asyncPatterns: {
    titulo: `${ICONES.relatorio.resumo} Async/Awaitパターン分析`,
    padroes: `\n${ICONES.relatorio.resumo} コード使用パターン:`,
    recomendacoes: `\n${ICONES.feedback.dica} 修正推奨:\n`,
    critico: `${ICONES.nivel.erro} 重要（即座にレビュー）:`,
    alto: `\n${ICONES.feedback.atencao} 高（現在のスプリントでレビュー）:`,
    salvo: (caminho: string) => `${ICONES.nivel.sucesso} 非同期レポートを保存: ${caminho}`
  },
  fixTypes: {
    analiseSalva: `${ICONES.arquivo.json} 詳細な分析を保存: .prometheus/fix-types-analise.json`,
    possibilidades: `└─ ${ICONES.acao.analise} 代替の可能性:`,
    sugestao: (texto: string) => `└─ ${ICONES.feedback.dica} ${texto}`,
    exportado: `${ICONES.arquivo.doc} fix-typesレポートをエクスポート:`
  },
  guardian: {
    baselineAceito: `${ICONES.status.ok} Guardian: ベースラインが手動で承認されました（--aceitar）。`,
    exportado: `${ICONES.arquivo.doc} Guardianレポートをエクスポート:`
  }
} as const;

/**
 * アーキタイプメッセージ
 */
export const MENSAGENS_ARQUETIPOS_HANDLER = {
  timeout: `${ICONES.feedback.atencao} アーキタイプ検出がタイムアウトしました`,
  salvo: (caminho: string) => `${ICONES.status.ok} カスタムアーキタイプを保存 ${caminho}`,
  falha: `${ICONES.feedback.atencao} アーキタイプ経由でプランの生成に失敗しました。`,
  falhaEstrategista: `${ICONES.feedback.atencao} ストラテジストがプランの提案に失敗しました。`,
  falhaGeral: `${ICONES.feedback.atencao} 計画全体の失敗。`
} as const;

/**
 * プラグイン消息
 */
export const MENSAGENS_PLUGINS = {
  registrado: (nome: string, extensoes: string[]) => `${ICONES.status.ok} プラグイン${nome}が拡張子で登録されました: ${extensoes.join(', ')}`,
  configAtualizada: `${ICONES.acao.correcao} レジストリ設定が更新されました`,
  erroParsear: (linguagem: string, erro: string) => `${ICONES.feedback.atencao} ${linguagem}の解析エラー: ${erro}`
} as const;

/**
 *  Executorメッセージ
 */
export const MENSAGENS_EXECUTOR = {
  analiseCompleta: (tecnica: string, arquivo: string, duracao: string) => `${ICONES.arquivo.arquivo} '${tecnica}'が${arquivo}を${duracao}で分析しました`
} as const;

/**
 * エクスポート統合
 */
export const MENSAGENS_CORRECOES = {
  fixTypes: MENSAGENS_CORRECAO_TIPOS,
  autofix: MENSAGENS_AUTOFIX,
  relatorios: MENSAGENS_RELATORIOS_ANALISE,
  arquetipos: MENSAGENS_ARQUETIPOS_HANDLER,
  plugins: MENSAGENS_PLUGINS,
  executor: MENSAGENS_EXECUTOR
} as const;
export default MENSAGENS_CORRECOES;
