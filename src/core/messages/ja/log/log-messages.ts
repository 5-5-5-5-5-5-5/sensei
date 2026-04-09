// SPDX-License-Identifier: MIT
/**
 * 集中化されたログメッセージシステム
 * プロジェクトのタイプと複雑さに応じて自動的に適応
 */

import { ICONES_ACAO, ICONES_ARQUIVO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_FEEDBACK, ICONES_NIVEL, ICONES_RELATORIO, ICONES_STATUS } from '../../shared/icons.js';

export const LogMensagens = {
  sistema: {
    inicializacao: {
      sucesso: `${ICONES_FEEDBACK.foguete} Prometheusが{time}msで初期化されました`,
      falha: `${ICONES_STATUS.falha} 初期化に失敗しました: {error}`,
      configuracao: `${ICONES_ARQUIVO.config} 設定を読み込み: {source} ({fields}フィールド)`
    },
    shutdown: `${ICONES_STATUS.ok} 分析が正常に完了しました`,
    atualizacao: {
      executando: `${ICONES_ACAO.import} 実行中: {command}`,
      sucesso: `${ICONES_STATUS.ok} 更新が正常に完了しました！`,
      falha: `${ICONES_STATUS.falha} 更新が中止または失敗しました。`,
      detalhes: `${ICONES_FEEDBACK.atencao} {detail}`
    },
    performance: {
      regressao_detectada: `${ICONES_FEEDBACK.atencao} {limit}%以上の回帰が検出されました。`,
      sem_regressoes: `${ICONES_STATUS.ok} 重大な回帰はありません。`
    },
    poda: {
      cancelada: `${ICONES_STATUS.falha} 剪定がキャンセルされました。`,
      concluida: `${ICONES_STATUS.ok} 剪定が完了しました: 孤立ファイルが正常に削除されました！`
    },
    reversao: {
      nenhum_move: `${ICONES_STATUS.falha} ファイルが見つかりません: {file}`,
      revertendo: `${ICONES_COMANDO.reverter} のmoveを元に戻しています: {file}`,
      sucesso: `${ICONES_STATUS.ok} ファイルが正常に元に戻されました: {file}`,
      falha: `${ICONES_STATUS.falha} ファイルの元に戻りに失敗しました: {file}`
    },
    auto: {
      mapa_reversao: {
        erro_carregar: `${ICONES_STATUS.falha} ロールバックマップの読み込みエラー: {error}`,
        erro_salvar: `${ICONES_STATUS.falha} ロールバックマップの保存エラー: {error}`,
        move_nao_encontrado: `${ICONES_STATUS.falha} Moveが見つかりません: {id}`,
        arquivo_destino_nao_encontrado: `${ICONES_STATUS.falha} 宛先ファイルが見つかりません: {destino}`,
        arquivo_existe_origem: `${ICONES_FEEDBACK.atencao} 送信元にファイルが存在します: {origem}`,
        erro_reverter: `${ICONES_STATUS.falha} moveを元に戻すエラー: {error}`,
        nenhum_move: `${ICONES_FEEDBACK.atencao} に対してmoveが見つかりません: {file}`,
        revertendo_move: `${ICONES_COMANDO.reverter} moveを元に戻しています: {id}`,
        move_revertido: `${ICONES_STATUS.ok} moveが正常に元に戻されました: {id}`,
        falha_reverter_move: `${ICONES_STATUS.falha} moveを元に戻すことに失敗しました: {id}`,
        carregado: `${ICONES_RELATORIO.lista} ロールバックマップを読み込み: {moves}件のmoveが登録されています`,
        nenhum_encontrado: `${ICONES_RELATORIO.lista} ロールバックマップが見つかりません、新しいものを開始`
      },
      poda: {
        nenhum_arquivo: `${ICONES_STATUS.ok} このサイクルで剪定するファイルはありません。\n`,
        podando: `${ICONES_COMANDO.podar} {quantity}ファイルを剪定中...`,
        podando_simulado: `${ICONES_COMANDO.podar} {quantity}ファイルを剪定中...（シミュレート）`,
        arquivo_movido: `${ICONES_STATUS.ok} {file}が放棄されましたに移動されました。`
      },
      corretor: {
        erro_criar_diretorio: `${ICONES_STATUS.falha} {destino}のディレクトリ作成に失敗しました: {error}`,
        destino_existe: `${ICONES_FEEDBACK.atencao} 宛先は既に存在します: {file} → {destino}`,
        erro_mover: `${ICONES_STATUS.falha} renameで{move}を移動中に失敗しました: {error}`
      }
    },
    correcoes: {
      nenhuma_disponivel: `${ICONES_STATUS.ok} 利用可能な自動修正はありません`,
      aplicando: `${ICONES_ACAO.correcao} 自動修正を{mode}モードで適用中...`,
      arquivo_nao_encontrado: `${ICONES_FEEDBACK.atencao} 修正対象のファイルが見つかりません: {file}`,
      aplicada: `${ICONES_STATUS.ok} {titulo}（信頼度: {confianca}%）`,
      corrigido: `${ICONES_STATUS.ok} 修正済み: {file}`,
      falha: `${ICONES_FEEDBACK.atencao} クイックフィックス{id}の適用に失敗しました: {error}`,
      nenhuma_aplicada: `${ICONES_FEEDBACK.atencao} 修正を適用できませんでした`,
      estatisticas: `${ICONES_STATUS.ok} {statistics}`,
      eslint_harmonia: `${ICONES_STATUS.ok} ESLint検証が完了しました - 調和が維持されています`,
      eslint_ajustes: `${ICONES_STATUS.ok} ESLintが完全な調和のために追加の調整を適用しました`,
      eslint_falha: `${ICONES_STATUS.falha} ESLint検証に失敗しました: {error}`
    },
    processamento: {
      fix_detectada: `${ICONES_ACAO.correcao} --fixフラグが検出されました: 自動修正をアクティブ化`,
      eslint_output: `${ICONES_RELATORIO.lista} ESLint出力: {output}`,
      resumo_ocorrencias: `${ICONES_DIAGNOSTICO.stats} {total}件の発生の概要:`,
      dicas_contextuais: `${ICONES_FEEDBACK.dica} コンテキストヒント:`,
      detalhamento_ocorrencias: `${ICONES_DIAGNOSTICO.stats} {total}件の発生の詳細:`,
      erros_criticos: `${ICONES_RELATORIO.error} {total}件の重大なエラーが見つかりました - これらを最初に優先`,
      avisos_encontrados: `${ICONES_RELATORIO.warning} {total}件の警告が見つかりました`,
      quick_fixes_muitos: `${ICONES_ACAO.correcao} {total}件の自動修正が利用可能:`,
      quick_fixes_comando: '   → PROMETHEUS_ALLOW_MUTATE_FS=1 npm run diagnosticar --fix',
      quick_fixes_executar: '   （実行準備完了）',
      todos_muitos: `${ICONES_RELATORIO.lista} {total}件のTODOが見つかりました - 特定のエリアにフォーカスするために--の使用を検討`,
      todos_poucos: `${ICONES_RELATORIO.lista} {total}件のTODOが見つかりました - 良い管理！`,
      muitas_ocorrencias: `${ICONES_FEEDBACK.atencao} 多くの発生 - --executiveで高レベルのビューを使用`,
      filtrar_pasta: `${ICONES_ARQUIVO.diretorio} またはフォルダでフィルタ: --include "src/cli" または --include "src/analistas"`,
      usar_full: `${ICONES_DIAGNOSTICO.completo} --fullで完全な詳細を使用`,
      usar_json: `${ICONES_ARQUIVO.json} --jsonで構造化出力を使用（CI/スクリプト用）`,
      projeto_limpo: `${ICONES_STATUS.ok} プロジェクトはクリーンです！ --guardian-checkで整合性検証を使用',
      analysts_problemas: `${ICONES_DIAGNOSTICO.inicio} 問題が見つかったアナリスト: {quantity}`
    }
  },
  scanner: {
    inicio: `${ICONES_DIAGNOSTICO.inicio} スキャンを開始: {directory}`,
    progresso: `${ICONES_ARQUIVO.diretorio} スキャン中: {directory} ({files}ファイル)`,
    filtros: `${ICONES_DIAGNOSTICO.stats} 適用されたフィルタ: {include}インクルード、 {exclude}エクスク루ード`,
    completo: `${ICONES_STATUS.ok} スキャンが完了: {files}ファイルが{directories}ディレクトリ`
  },
  analysts: {
    execucao: {
      // 小規模プロジェクト用のシンプルログ
      inicio_simples: `${ICONES_DIAGNOSTICO.inicio} 分析中 {file}`,
      sucesso_simples: `${ICONES_STATUS.ok} {file}: {ocorrencias}件の問題`,
      // 複雑プロジェクト用の詳細ログ
      inicio_detalhado: `${ICONES_DIAGNOSTICO.inicio} '{analyst}'を{file}で実行中 ({size}kb)`,
      sucesso_detalhado: `${ICONES_STATUS.ok} '{analyst}'が完了: {ocorrencias}件の発生（{time}ms）`,
      timeout: `${ICONES_FEEDBACK.atencao} アナリスト'{analyst}'が{time}ms後にタイムアウト`,
      erro: `${ICONES_STATUS.falha} アナリスト'{analyst}'エラー: {error}`,
      skip: `${ICONES_STATUS.pulado} '{file}'をスキップ（設定で抑制）`
    },
    metricas: {
      performance: `${ICONES_DIAGNOSTICO.stats} パフォーマンス: {analysts}アナリスト、平均{media}ms/ファイル`,
      cache_hit: `${ICONES_DIAGNOSTICO.rapido} キャッシュヒット: {hits}/{total} ({percent}%)`,
      worker_pool: `${ICONES_STATUS.executando} ワーカープール: {ativos}/{total}件のアクティブなworker`
    }
  },
  filtros: {
    incluindo: ` ${ICONES_ACAO.criar} インクルード: {pattern} ({matches}ファイル)`,
    excluindo: ` ${ICONES_ACAO.deletar} エクスクルード: {pattern} ({matches}ファイル)`,
    supressao: `${ICONES_STATUS.pausado} {count}件の発生を抑制: {reason}`,
    cli_override: `${ICONES_DIAGNOSTICO.stats} CLIオーバーライド: {type}パターンが設定より優先`
  },
  projeto: {
    detectado: `${ICONES_RELATORIO.lista} プロジェクトを検出: {type}（{confianca}%信頼度）`,
    estrutura: `${ICONES_DIAGNOSTICO.stats} 構造: {files}ファイル、{languages}言語`,
    complexidade: `${ICONES_DIAGNOSTICO.stats} 複雑さ: {level}（{metrics}に基づく）`,
    recomendacao: `${ICONES_FEEDBACK.dica} 推奨: このプロジェクトタイプには{acao}`
  },
  contexto: {
    desenvolvedor_novo: `${ICONES_FEEDBACK.info} 単純なプロジェクトが検出されました - 簡略化されたログがアクティブ`,
    equipe_experiente: `${ICONES_FEEDBACK.info} エンタープライズプロジェクトが検出されました - 詳細なログがアクティブ`,
    ci_cd: `${ICONES_FEEDBACK.info} CI/CD環境が検出されました - 構造化ログがアクティブ`,
    debug_mode: `${ICONES_FEEDBACK.info} デバッグモードがアクティブ - 冗長なログがアクティブ`
  },
  ocorrencias: {
    critica: `${ICONES_NIVEL.critico} 重大: {mensagem} in {file}:{linha}`,
    aviso: `${ICONES_NIVEL.aviso} 警告: {mensagem}（{category}）`,
    info: `${ICONES_NIVEL.info} 情報: {mensagem}`,
    sugestao: `${ICONES_FEEDBACK.dica} 提案: {mensagem} - {acao_sugerida}`
  },
  relatorio: {
    resumo: `${ICONES_DIAGNOSTICO.stats} 要約: {total}件の問題（{criticos}件重大、{avisos}件警告）`,
    categorias: `${ICONES_RELATORIO.lista} トップ: {top_categorias}`,
    arquivo_problema: `${ICONES_FEEDBACK.atencao} 最も問題: {file}（{count}件の発生）`,
    tendencia: `${ICONES_DIAGNOSTICO.stats} 傾向: ベースラインと比較して{direcao}`,
    repositorio_impecavel: 'iréproachableリポジトリ',
    ocorrencias_encontradas: '{total}件の発生が見つかりました',
    fim_padroes_uso: `\n${ICONES_STATUS.ok} 使用パターンレポートの終わり。\n`,
    funcoes_longas: `${ICONES_FEEDBACK.atencao} 長い関数が見つかりました:`
  },
  conselheiro: {
    volume_alto: `${ICONES_FEEDBACK.info} タスクの量が多いですか？コードは逃げません；バーンアウトはあります。`,
    respira: `${ICONES_FEEDBACK.info} 嘿、快速的に: ちょっと息継ぎして。`,
    cuidado: `${ICONES_FEEDBACK.info} お気をつけて: 水を飲んで、ストレッチして、5分間目を閉じて。继续 потом.\n`,
    madrugada: `${ICONES_FEEDBACK.atencao} もう{hora}過ぎています。コードは明朝コンパイルできます；今あなたは休んでください。`
  },
  guardian: {
    integridade_ok: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.ok} Guardian: 整合性が維持されています。`,
    baseline_criado: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.info} Guardian baselineが作成されました。`,
    baseline_aceito: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} Guardian: 新しいbaselineが承認されました — 再実行してください。`,
    alteracoes_detectadas: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.erro} Guardian: 疑わしい変更が検出されました！ 'prometheus guardian --diff'の実行を検討してください。`,
    bloqueado: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.falha} Guardianがブロックしました: 疑わしい変更または致命的なエラー。`,
    modo_permissivo: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} 許可モード: リスクめて進行。`,
    scan_only: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.info} スキャン専用モード: {files}ファイルがマッピングされました。`,
    avisos_encontrados: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} 警告レベルの発生があります`,
    // Guardianコマンド
    full_scan_aviso: `${ICONES_NIVEL.aviso} --full-scanアクティブ: baselineは展開されたスコープで永続化されません。`,
    full_scan_warning_baseline: `${ICONES_NIVEL.aviso} --full-scanアクティブですが、展開されたスコープで一時的なbaselineが作成されます。`,
    aceitando_baseline: `\n${ICONES_COMANDO.atualizar} 新しい整合性baselineを受け入れています...\n`,
    baseline_aceito_sucesso: `${ICONES_STATUS.ok} 新しい整合性baselineが正常に受け入れられました！`,
    comparando_integridade: `\n${ICONES_DIAGNOSTICO.stats} Prometheusの整合性をbaselineと比較しています...\n`,
    differencas_detectadas: `${ICONES_RELATORIO.error} 差異が検出されました:`,
    diferenca_item: '  - {diferenca}',
    comando_diff_recomendado: '--diffで詳細な差異を表示するか--acceptで新しいbaselineを受け入れてください。',
    integridade_preservada: `${ICONES_STATUS.ok} 差異は検出されませんでした。整合性が維持されています。`,
    verificando_integridade: `\n${ICONES_DIAGNOSTICO.guardian} Prometheusの整合性を確認しています...\n`,
    baseline_criado_console: `${ICONES_DIAGNOSTICO.guardian} Guardian baselineが作成されました`,
    baseline_atualizado: `${ICONES_DIAGNOSTICO.guardian} Baselineが更新され受け入れられました`,
    alteracoes_suspeitas: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.erro} 疑わしい変更が検出されました！`,
    erro_guardian: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.falha} Guardianエラー: {error}`
  },
  metricas: {
    execucoes_registradas: `\n${ICONES_DIAGNOSTICO.stats} 登録された実行: {quantity}`,
    nenhum_historico: 'メトリクスの履歴がまだ見つかりません。 --metricasを有効にして診断を実行してください。'
  },
  auto: {
    plugin_ignorado: `${ICONES_NIVEL.aviso} プラグインが無視されました（{plugin}）: {error}`,
    caminho_nao_resolvido: `${ICONES_NIVEL.aviso} プラグインパスが解決できません: {plugin}`,
    plugin_falhou: `${ICONES_STATUS.falha} プラグインが失敗しました: {plugin} — {error}`,
    move_removido: `${ICONES_ACAO.deletar} moveがマップから削除されました: {id}`
  },
  core: {
    parsing: {
      erro_babel: `${ICONES_NIVEL.aviso} {file}でのBabel解析エラー: {error}`,
      erro_ts: `${ICONES_NIVEL.aviso} {file}でのTSコンパイラ解析エラー: {error}`,
      erro_xml: `${ICONES_NIVEL.aviso} {file}でのXML解析エラー: {error}`,
      erro_html: `${ICONES_NIVEL.aviso} {file}でのHTML解析エラー: {error}`,
      erro_css: `${ICONES_NIVEL.aviso} {file}でのCSS解析エラー: {error}`,
      nenhum_parser: `${ICONES_NIVEL.aviso} 拡張子{extensao}利用可能なパーサーなし`,
      timeout_parsing: `${ICONES_NIVEL.aviso} 拡張子{extensao}の解析が{timeout}ms後にタイムアウト`,
      plugin_nao_encontrado: `${ICONES_NIVEL.aviso} 拡張子{extensao}のプラグインが見つかりません、レガシーシステムを使用',
      sistema_plugins_falhou: `${ICONES_STATUS.falha} プラグインシステムが失敗しました: {error}、レガシーシステムを使用',
      plugins_registrados: `${ICONES_DIAGNOSTICO.inicio} 標準プラグインがシステムに登録されました`,
      usando_plugin: `${ICONES_DIAGNOSTICO.inicio} '{nome}'プラグインを{extensao}に使用`
    },
    plugins: {
      erro_carregar: `${ICONES_STATUS.falha} プラグイン{nome}の読み込みエラー: {error}`,
      tentando_autoload: `${ICONES_DIAGNOSTICO.inicio} 拡張子{extensao}の自動読み込みを試行中`,
      autoload_falhou: `${ICONES_STATUS.falta} {nome}の自動読み込みが失敗しました`,
      extensao_nao_suportada: `${ICONES_NIVEL.aviso} 拡張子{extensao}はコアプラグインでサポートされていません`,
      registering: `${ICONES_DIAGNOSTICO.inicio} プラグインを登録中: {nome} v{versao}`
    },
    executor: {
      reaproveitado_incremental: `${ICONES_DIAGNOSTICO.rapido} 再利用 {file}（インクリメンタル）`
    }
  }
} as const;

/**
 * 異なるプロジェクトタイプ用の適応的コンテキスト設定
 */
export const LogContextConfiguracao = {
  // シンプルプロジェクト: 少数のファイル、1人の開発者
  simples: {
    nivel_detalhamento: 'basico',
    mostrar_performance: false,
    mostrar_cache: false,
    mostrar_workers: false,
    formato_arquivo: 'nome_apenas',
    // ファイル名のみ、完全パスではない
    agrupar_ocorrencias: true
  },
  // 中規模プロジェクト: 小チーム、複数の言語
  medio: {
    nivel_detalhamento: 'moderado',
    mostrar_performance: true,
    mostrar_cache: false,
    mostrar_workers: false,
    formato_arquivo: 'relativo',
    // 相対パス
    agrupar_ocorrencias: true
  },
  // 複雑プロジェクト: 大規模チーム、CI/CD、複数のモジュール
  complexo: {
    nivel_detalhamento: 'completo',
    mostrar_performance: true,
    mostrar_cache: true,
    mostrar_workers: true,
    formato_arquivo: 'completo',
    // 完全パス + メタデータ
    agrupar_ocorrencias: false
  },
  // CI/CD環境: 構造化ログ、色なし
  ci: {
    nivel_detalhamento: 'estruturado',
    mostrar_performance: true,
    mostrar_cache: true,
    mostrar_workers: true,
    formato_arquivo: 'relativo',
    agrupar_ocorrencias: false,
    formato_saida: 'json_lines'
  }
} as const;
