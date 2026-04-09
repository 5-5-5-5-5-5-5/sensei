// SPDX-License-Identifier: MIT
// @prometheus-disable tipo-literal-inline-complexo
//  justificativa: 提案システム用のインラインマルチタイプ
/**
 * 集中化された提案とヒントのシステム
 *
 * Prometheusのすべてのコンテキスト提案を一元化:
 * - コマンド使用のヒント
 * - コンテキストベースの提案
 * - クイックヘルプメッセージ
 * - さまざまなシナリオのアクション叫我
 */

import { ICONES } from '../../shared/icons.js';

/**
 * コマンドの一般的な提案
 */
export const SUGESTOES_COMANDOS = {
  usarFull: `${ICONES.feedback.dica} --fullですべての情報を含む詳細なレポートを使用`,
  usarJson: `${ICONES.feedback.dica} --jsonでJSON形式の構造化出力を使用`,
  combinerJsonExport: `${ICONES.feedback.dica} --jsonと--exportを組み合わせてレポートを保存`,
  usarExport: `${ICONES.feedback.dica} --export <パス>でファイルにレポートを保存`,
  usarInclude: `${ICONES.feedback.dica} --include <パターン>で特定のファイルにフォーカス`,
  usarExclude: `${ICONES.feedback.dica} --exclude <パターン>でファイルを無視`,
  usarDryRun: `${ICONES.feedback.dica} --dry-runでファイルを変更せずにシミュレート`,
  removerDryRun: `${ICONES.feedback.dica} --dry-runを削除して修正を適用`,
  usarInterativo: `${ICONES.feedback.dica} --interactiveで各修正を確認`,
  usarGuardian: `${ICONES.feedback.dica} --guardianで整合性を確認`,
  usarBaseline: `${ICONES.feedback.dica} --baselineで参照用のベースラインを生成`,
  usarAutoFix: `${ICONES.feedback.dica} --auto-fixで自動修正を適用`,
} as const;

/**
 * 診断の提案
 */
export const SUGESTOES_DIAGNOSTICO = {
  modoExecutivo: `${ICONES.diagnostico.executive} エグゼクティブモード: 重大な問題のみ表示`,
  primeiraVez: [
    `${ICONES.feedback.dica} 初めてですか？まずは: prometheus diagnosticar --full`,
    `${ICONES.feedback.dica} --helpで利用可能なすべてのオプションを表示`,
  ],
  projetoGrande: [
    `${ICONES.feedback.dica} 大きなプロジェクトが検出されました - インクリメンタル分析に--includeを使用`,
    `${ICONES.feedback.dica} --quickでクイック初期分析を使用`,
  ],
  poucoProblemas: `${ICONES.nivel.sucesso} プロジェクトの状態良好！小さな問題が{count}件見つかりました。`,
  muitosProblemas: [
    `${ICONES.feedback.atencao} 多くの問題が検出されました - まず重大ものを優先`,
    `${ICONES.feedback.dica} --executiveで本質的なものにフォーカス`,
  ],
  usarFiltros: `${ICONES.feedback.dica} --include/--excludeフィルタを使用して集中化された分析を`,
} as const;

/**
 * 自動修正の提案
 */
export const SUGESTOES_AUTOFIX = {
  autoFixDisponivel: `${ICONES.feedback.dica} 自動修正が利用可能です - --auto-fixを使用`,
  autoFixAtivo: `${ICONES.feedback.atencao} 自動修正アクティブ！ --dry-runでファイルを変更せずにシミュレート`,
  dryRunRecomendado: `${ICONES.feedback.dica} 推奨: まず--dry-runでテスト`,
  semMutateFS: `${ICONES.feedback.atencao} 現在自動修正は利用できません`,
  validarDepois: [
    `${ICONES.feedback.dica} 修正を確認するにはnpm run lintを実行`,
    `${ICONES.feedback.dica} コードがコンパイルされるか確認するにはnpm run buildを実行`,
    `${ICONES.feedback.dica} 機能を検証するにはnpm testを実行`,
  ],
} as const;

/**
 * Guardianの提案
 */
export const SUGESTOES_GUARDIAN = {
  guardianDesabilitado: `${ICONES.comando.guardian} Guardianが無効です。 --guardianで整合性を確認`,
  primeiroBaseline: [
    `${ICONES.feedback.dica} 最初の実行: --baselineでベースラインを生成`,
    `${ICONES.feedback.dica} ベースラインは将来の変更の参照として機能します`,
  ],
  driftDetectado: [
    `${ICONES.feedback.atencao} ベースラインに対して変更が検出されました`,
    `${ICONES.feedback.dica} ベースラインを更新する前に変更をレビュー`,
    `${ICONES.feedback.dica} --baselineで参照を更新`,
  ],
  integridadeOK: `${ICONES.nivel.sucesso} 整合性確認済み - 未承認の変更はありません`,
} as const;

/**
 * タイプ（fix-types）の提案
 */
export const SUGESTOES_TIPOS = {
  ajustarConfianca: (atual: number) =>
    `${ICONES.feedback.dica} --confidence <num>でしきい値を調整（現在: ${atual}%）`,
  revisar: (categoria: string) =>
    `${ICONES.feedback.dica} ${カテゴリ}ケースを手動でレビュー`,
  anyEncontrado: [
    `${ICONES.feedback.atencao} 'any'タイプが検出されました - コードの安全性を低下させます`,
    `${ICONES.feedback.dica} 'as any'と明示的なキャストの置き換えを優先`,
  ],
  unknownLegitimo: `${ICONES.nivel.sucesso} 'unknown'の正当な使用を特定`,
  melhoravelDisponivel: `${ICONES.feedback.dica} 改善可能なケースが見つかりました - 将来のリファクタリングでレビュー`,
} as const;

/**
 * アーキタイプの提案
 */
export const SUGESTOES_ARQUETIPOS = {
  monorepo: [
    `${ICONES.feedback.dica} Monorepoが検出されました: ワークスペースごとにフィルタの使用を検討`,
    `${ICONES.feedback.dica} --include packages/*で特定のワークスペースを分析`,
  ],
  biblioteca: [
    `${ICONES.feedback.dica} ライブラリが検出されました: パブリックスAPIとドキュメントにフォーカス`,
    `${ICONES.feedback.dica} --guardianでパブリックAPIを確認`,
  ],
  cli: [
    `${ICONES.feedback.dica} CLIが検出されました: コマンドとフラグのテストを優先`,
    `${ICONES.feedback.dica} コマンドのエラー処理を検証`,
  ],
  api: [
    `${ICONES.feedback.dica} APIが検出されました: エンドポイントとコントラクトにフォーカス`,
    `${ICONES.feedback.dica} ルートに対して統合テストを検討`,
    `${ICONES.feedback.dica} APIドキュメントを検証（OpenAPI/Swagger）`,
  ],
  frontend: [
    `${ICONES.feedback.dica} Frontendが検出されました: コンポーネントと状態管理を優先`,
    `${ICONES.feedback.dica} アクセシビリティとパフォーマンスを検証`,
  ],
  confiancaBaixa: [
    `${ICONES.feedback.atencao} 検出の信頼度が低い: 構造はハイブリッドである可能性があります`,
    `${ICONES.feedback.dica} --criar-arquetipo --salvar-arquetipoでカスタマイズ`,
  ],
} as const;

/**
 * 再構成の提案
 */
export const SUGESTOES_REESTRUTURAR = {
  backupRecomendado: [
    `${ICONES.feedback.importante} 重要: 再構成前にバックアップを作成！`,
    `${ICONES.feedback.dica} 構造変更前にgitでバージョン管理`,
  ],
  validarDepois: [
    `${ICONES.feedback.dica} 再構成後にテストを実行`,
    `${ICONES.feedback.dica} インポートと参照を検証`,
  ],
  usarDryRun: `${ICONES.feedback.dica} 初めてですか？ --dry-runで提案された変更を表示`,
} as const;

/**
 * 剪定の提案
 */
export const SUGESTOES_PODAR = {
  cuidado: [
    `${ICONES.feedback.atencao} 剪定はファイルを完全に削除します！`,
    `${ICONES.feedback.importante} バックアップまたはバージョン管理があるか確認`,
  ],
  revisar: `${ICONES.feedback.dica} 確認する前にファイルのリストをレビュー`,
  usarDryRun: `${ICONES.feedback.dica} --dry-runで削除せずに剪定をシミュレート`,
} as const;

/**
 * メトリクスの提案
 */
export const SUGESTOES_METRICAS = {
  baseline: [
    `${ICONES.feedback.dica} 将来の比較のためにベースラインを生成`,
    `${ICONES.feedback.dica} --jsonでCI/CDとの統合に使用`,
  ],
  tendencias: `${ICONES.feedback.dica} 傾向を追跡するために定期的に実行`,
  comparacao: `${ICONES.feedback.dica} 以前的実行と比較`,
} as const;

/**
 * ゼラドールの提案
 */
export const SUGESTOES_ZELADOR = {
  imports: [
    `${ICONES.feedback.dica} インポートゼラドールがパスを自動的に修正`,
    `${ICONES.feedback.dica} --dry-runで提案された修正を表示`,
  ],
  estrutura: [
    `${ICONES.feedback.dica} 構造ゼラドールがパターンごとにファイルを整理`,
    `${ICONES.feedback.dica} prometheus.config.jsonでパターンを構成`,
  ],
} as const;

/**
 * コンテキスト提案 - ヘルパー関数
 */
export function gerarSugestoesContextuais(contexto: {
  comando: string;
  temProblemas: boolean;
  countProblemas?: number;
  autoFixDisponivel?: boolean;
  guardianAtivo?: boolean;
  arquetipo?: string;
  flags?: string[];
}): string[] {
  const sugestoes: string[] = [];

  // コマンドごとの提案
  switch (contexto.comando) {
    case 'diagnosticar':
      if (!contexto.temProblemas) {
        if (contexto.countProblemas !== undefined) {
          sugestoes.push(
            SUGESTOES_DIAGNOSTICO.poucoProblemas.replace(
              '{count}',
              String(contexto.countProblemas),
            ),
          );
        }
      } else if (contexto.countProblemas && contexto.countProblemas > 50) {
        sugestoes.push(...SUGESTOES_DIAGNOSTICO.muitosProblemas);
      }

      if (
        contexto.autoFixDisponivel &&
        !contexto.flags?.includes('--auto-fix')
      ) {
        sugestoes.push(SUGESTOES_AUTOFIX.autoFixDisponivel);
      }

      if (!contexto.guardianAtivo && !contexto.flags?.includes('--guardian')) {
        sugestoes.push(SUGESTOES_GUARDIAN.guardianDesabilitado);
      }

      if (!contexto.flags?.includes('--full') && contexto.temProblemas) {
        sugestoes.push(SUGESTOES_COMANDOS.usarFull);
      }
      break;

    case 'fix-types':
      if (contexto.autoFixDisponivel) {
        sugestoes.push(...SUGESTOES_AUTOFIX.validarDepois);
      }
      break;

    case 'reestruturar':
      sugestoes.push(...SUGESTOES_REESTRUTURAR.backupRecomendado);
      if (!contexto.flags?.includes('--dry-run')) {
        sugestoes.push(SUGESTOES_REESTRUTURAR.usarDryRun);
      }
      break;

    case 'podar':
      sugestoes.push(...SUGESTOES_PODAR.cuidado);
      break;
  }

  // アーキタイプごとの提案
  if (contexto.arquetipo) {
    switch (contexto.arquetipo) {
      case 'monorepo':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.monorepo);
        break;
      case 'biblioteca':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.biblioteca);
        break;
      case 'cli':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.cli);
        break;
      case 'api':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.api);
        break;
      case 'frontend':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.frontend);
        break;
    }
  }

  return sugestoes;
}

/**
 * 表示用に提案をフォーマット
 */
export function formatarSugestoes(
  sugestoes: string[],
  titulo = '提案',
): string[] {
  if (sugestoes.length === 0) return [];

  const linhas: string[] = ['', `┌── ${titulo} ${'─'.repeat(50)}`.slice(0, 70)];

  for (const sugestao of sugestoes) {
    linhas.push(`  ${sugestao}`);
  }

  linhas.push(`└${'─'.repeat(68)}`);
  linhas.push('');

  return linhas;
}

/**
 * エクスポート集中化
 */
export const SUGESTOES = {
  comandos: SUGESTOES_COMANDOS,
  diagnostico: SUGESTOES_DIAGNOSTICO,
  autofix: SUGESTOES_AUTOFIX,
  guardian: SUGESTOES_GUARDIAN,
  tipos: SUGESTOES_TIPOS,
  arquetipos: SUGESTOES_ARQUETIPOS,
  reestruturar: SUGESTOES_REESTRUTURAR,
  podar: SUGESTOES_PODAR,
  metricas: SUGESTOES_METRICAS,
  zelador: SUGESTOES_ZELADOR,
} as const;

export default SUGESTOES;
