// SPDX-License-Identifier: MIT
/**
 * レポート用メッセージ集中化管理（MarkdownとJSON）
 * タイトル、ヘッダー、説明、説明テキストのすべての文字列は、
 * メンテナンスと将来の国際化を容易にするためにここに定義する必要があります。
 */

import { ICONES_ACAO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_RELATORIO } from '../../shared/icons.js';

export const RelatorioMensagens = {
  /* -------------------------- メインレポート（gerador-relatorio.ts） -------------------------- */
  principal: {
    titulo: `${ICONES_RELATORIO.resumo} Prometheusレポート`,
    secoes: {
      metadados: {
        data: '日付',
        duracao: '所要時間',
        arquivos: 'スキャンされたファイル',
        ocorrencias: '発見された発生',
        arquivoManifest: 'マニフェストファイル',
        notaManifest: '完全なレポートを探索するには、マニフェストにリストされたシャードをダウンロード/展開してください。'
      },
      guardian: {
        titulo: `${ICONES_DIAGNOSTICO.guardian} 整合性確認（Guardian）`,
        status: 'ステータス',
        timestamp: 'タイムスタンプ',
        totalArquivos: '保護されたファイルの合計'
      },
      resumoTipos: {
        titulo: `${ICONES_DIAGNOSTICO.stats} 問題タイプの要約`,
        tipo: 'タイプ',
        quantidade: '数量'
      },
      ocorrencias: {
        titulo: `${ICONES_RELATORIO.lista} 発見された発生`,
        colunas: {
          arquivo: 'ファイル',
          linha: '行',
          nivel: 'レベル',
          mensagem: 'メッセージ'
        }
      },
      estatisticas: {
        titulo: `${ICONES_RELATORIO.grafico} 全体統計`,
        linhasAnalisadas: '分析された行',
        padroesProgramacao: 'プログラミングパターン',
        analiseInteligente: 'コードのインテリジェント分析'
      }
    }
  },
  /* -------------------------- 要約レポート/インテリジェントフィルタ -------------------------- */
  resumo: {
    titulo: `${ICONES_RELATORIO.resumo} 要約レポート - 優先問題`,
    introducao: 'このレポートは類似の問題をグループ化し、影響度順に優先度を付けて分析を容易にします。',
    secoes: {
      criticos: {
        titulo: `${ICONES_RELATORIO.error} 重大な問題`,
        vazio: '重大な問題は検出されませんでした。'
      },
      altos: {
        titulo: `${ICONES_RELATORIO.warning} 高優先度問題`,
        vazio: '高優先度の問題は検出されませんでした。'
      },
      outros: {
        titulo: `${ICONES_RELATORIO.lista} その他の問題`,
        vazio: 'その他の問題は検出されませんでした。'
      },
      estatisticas: {
        titulo: `${ICONES_DIAGNOSTICO.stats} レポート統計`,
        totalOcorrencias: '発生総数',
        arquivosAfetados: '影響されたファイル',
        problemasPrioritarios: '優先問題',
        problemasAgrupados: 'グループ化された問題'
      }
    },
    labels: {
      quantidade: '数量',
      arquivosAfetados: '影響されたファイル',
      acaoSugerida: '提案されるアクション',
      exemplos: '例'
    }
  },
  /* -------------------------- コード健康レポート（zelador-saude.ts） -------------------------- */
  saude: {
    titulo: `${ICONES_ACAO.limpeza} コード健康レポート`,
    introducao: `${ICONES_DIAGNOSTICO.stats} コード使用パターン`,
    secoes: {
      funcoesLongas: {
        titulo: 'ファイルごとの長い関数の詳細',
        vazio: '制限を超えた関数はありません。',
        colunas: {
          tipo: 'タイプ',
          quantidade: '数量'
        }
      },
      constantesDuplicadas: {
        titulo: `${ICONES_RELATORIO.detalhado} 3回以上定義された定数`
      },
      modulosRequire: {
        titulo: `${ICONES_RELATORIO.detalhado} 3回以上使用されたrequireモジュール`
      },
      fim: {
        titulo: 'ゼラドールレポートの終わり'
      }
    },
    instrucoes: {
      diagnosticoDetalhado: '詳細な診断については、次を実行: prometheus diagnosticar --export',
      tabelasVerbosas: 'ターミナルでフレーム付きテーブルを表示するには（非常に冗長）、--debugを使用'
    }
  },
  /* -------------------------- 使用パターンレポート -------------------------- */
  padroesUso: {
    titulo: `${ICONES_DIAGNOSTICO.stats} コード使用パターン`
  },
  /* -------------------------- アーキタイプレポート -------------------------- */
  arquetipos: {
    titulo: `${ICONES_DIAGNOSTICO.arquetipos} アーキタイプレポート`,
    secoes: {
      candidatos: {
        titulo: '特定された候補',
        nome: '名前',
        score: 'スコア',
        confianca: '信頼度',
        descricao: '説明'
      },
      baseline: {
        titulo: '保存されたベースライン',
        snapshot: 'スナップショット',
        arquivos: 'ファイル'
      },
      drift: {
        titulo: '検出されたドリフト',
        alterouArquetipo: 'アーキタイプを変更',
        deltaConfianca: '信頼度の変化',
        arquivosNovos: '新しいファイル',
        arquivosRemovidos: '削除されたファイル'
      }
    }
  },
  /* -------------------------- 剪定レポート -------------------------- */
  poda: {
    titulo: `${ICONES_COMANDO.podar} Prometheus剪定レポート`,
    secoes: {
      metadados: {
        data: '日付',
        execucao: '実行',
        simulacao: 'シミュレーション',
        real: ' реаль',
        arquivosPodados: '剪定されたファイル',
        arquivosMantidos: '維持されたファイル'
      },
      podados: {
        titulo: '剪定されたファイル',
        vazio: 'このサイクルで剪定されたファイルはありません。',
        colunas: {
          arquivo: 'ファイル',
          motivo: '理由',
          diasInativo: '非アクティブ日数',
          detectadoEm: '検出場所'
        }
      },
      mantidos: {
        titulo: '維持されたファイル',
        vazio: 'このサイクルで維持されたファイルはありません。',
        colunas: {
          arquivo: 'ファイル',
          motivo: '理由'
        }
      },
      pendencias: {
        titulo: '削除保留',
        total: '保留合計',
        tipoArquivo: 'タイプ: ファイル',
        tipoDiretorio: 'タイプ: ディレクトリ',
        tamanhoTotal: '約合計サイズ'
      },
      reativacao: {
        titulo: '再活性化リスト',
        total: '再活性化合計'
      },
      historico: {
        titulo: 'アクション履歴',
        total: 'アクション合計',
        colunas: {
          acao: 'アクション',
          caminho: 'パス',
          timestamp: 'タイムスタンプ'
        }
      }
    }
  },
  /* -------------------------- 再構成レポート -------------------------- */
  reestruturar: {
    titulo: `${ICONES_COMANDO.reestruturar} Prometheus再構成レポート`,
    secoes: {
      metadados: {
        data: '日付',
        execucao: '実行',
        simulacao: 'シミュレーション',
        real: ' реаль',
        origemPlano: 'プランの起源',
        preset: 'プリセット'
      },
      movimentos: {
        titulo: '移動',
        total: '移動合計',
        vazio: 'このサイクルで提案された移動はありません。',
        status: {
          zonVerde: 'グリーンゾーン（安全）',
          bloqueados: 'ブロック済み'
        },
        colunas: {
          origem: '元',
          destino: '先',
          razao: '理由',
          status: 'ステータス'
        }
      },
      conflitos: {
        titulo: '検出された競合',
        total: '検出された競合',
        tipo: 'タイプ',
        descricao: '説明'
      },
      preview: {
        titulo: '変更のプレビュー',
        nota: `--applyで実行するまでファイルは移動しません`
      }
    }
  },
  /* -------------------------- 共通メッセージ -------------------------- */
  comum: {
    separadores: {
      secao: '---',
      subsecao: '~~~'
    },
    vazios: {
      nenhumResultado: '結果が見つかりません。',
      nenhumaOcorrencia: '発生は検出されませんでした。',
      semDatos: '数据がありません。'
    },
    acoes: {
      verDetalhes: '詳細を見る',
      executarComando: 'コマンドを実行',
      aplicarMudancas: '変更を適用',
      cancelar: 'キャンセル'
    }
  }
};

/**
 * 変数でメッセージをフォーマットするヘルパー
 * @example
 * formatMessage(RelatorioMessages.principal.secoes.metadados.arquivos, { count: 42 })
 * // => "スキャンされたファイル: 42"
 */
export function formatMessage(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(`{${key}}`, String(value));
  }
  return result;
}

/**
 * 単純な複数形化のヘルパー
 */
export function pluralize(count: number, singular: string, plural: string, showCount = true): string {
  const word = count === 1 ? singular : plural;
  return showCount ? `${count} ${word}` : word;
}

/**
 * 区切り文字の行を作成するヘルパー
 */
export function separator(char = '-', length = 80): string {
  return char.repeat(length);
}
