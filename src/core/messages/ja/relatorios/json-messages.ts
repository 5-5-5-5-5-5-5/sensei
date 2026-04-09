// SPDX-License-Identifier: MIT
/**
 * JSONエクスポート用の集中化管理メッセージと説明
 * JSONフィールドの説明的なテキスト、ラベル、メタデータを定義
 */

import type { JsonComMetadados } from '@';

export const JsonMensagens = {
  /* -------------------------- 共通フィールド -------------------------- */
  comum: {
    timestamp: {
      label: 'timestamp',
      descricao: 'レポート生成日時（ISO 8601）'
    },
    versao: {
      label: 'versao',
      descricao: 'このレポートを生成したPrometheusのバージョン'
    },
    schemaVersion: {
      label: 'schemaVersion',
      descricao: 'JSONスキーマバージョン（下位互換性用）'
    },
    duracao: {
      label: 'duracaoMs',
      descricao: 'ミリ秒単位の合計実行時間'
    }
  },
  /* -------------------------- 診断 -------------------------- */
  diagnostico: {
    root: {
      label: 'diagnostico',
      descricao: 'プロジェクトの完全な診断結果'
    },
    totalArquivos: {
      label: 'totalArquivos',
      descricao: 'スキャンされたファイルの合計数'
    },
    ocorrencias: {
      label: 'ocorrencias',
      descricao: 'アナリストによって検出されたすべての発生のリスト',
      campos: {
        tipo: '発生するタイプ/カテゴリ',
        nivel: '重大度レベル（info、aviso、erro）',
        mensagem: '問題の詳しい説明',
        relPath: 'ファイルの相対パス',
        linha: '問題が発生する行',
        coluna: '問題が発生する列',
        contexto: '追加のコンテキスト（コードスニペット）'
      }
    },
    metricas: {
      label: 'metricas',
      descricao: 'プロジェクトの集約されたメトリクス',
      campos: {
        totalLinhas: '分析されたコードの合計行数',
        totalArquivos: '処理されたファイルの合計',
        arquivosComErro: '解析に失敗したファイル',
        tempoTotal: '合計処理時間'
      }
    },
    linguagens: {
      label: 'linguagens',
      descricao: 'プロジェクトでの言語使用統計',
      campos: {
        total: 'コードファイルの合計',
        extensions: '拡張子 -> 数量のマップ'
      }
    },
    parseErros: {
      label: 'parseErros',
      descricao: '集約された解析エラー',
      campos: {
        total: '解析エラーの合計',
        porArquivo: 'ファイル -> エラーリストのマップ',
        agregado: 'エラーが集約されたかどうか'
      }
    }
  },
  /* -------------------------- 構造/アーキタイプ -------------------------- */
  estrutura: {
    root: {
      label: 'estruturaIdentificada',
      descricao: 'プロジェクトの構造とアーキタイプの特定'
    },
    melhores: {
      label: 'melhores',
      descricao: 'アーキタイプ候補の順序付きリスト',
      campos: {
        nome: 'アーキタイプ名',
        score: '計算されたスコア',
        confidence: '信頼度（%）',
        descricao: 'アーキタイプの説明',
        matchedRequired: '見つかった必須ファイル',
        missingRequired: '欠けている必須ファイル',
        matchedOptional: '見つかったオプショナルファイル'
      }
    },
    baseline: {
      label: 'baseline',
      descricao: 'ドリフト検出のために保存された構造のスナップショット',
      campos: {
        arquetipo: '特定されたアーキタイプ',
        confidence: '保存時の信頼度',
        timestamp: 'スナップショットの日付',
        arquivosRaiz: 'ルートにあるファイルのリスト'
      }
    },
    drift: {
      label: 'drift',
      descricao: 'ベースラインに対して検出された変更',
      campos: {
        alterouArquetipo: 'アーキタイプが変わったかどうか',
        deltaConfidence: '信頼度のパーセンテージ変化',
        arquivosRaizNovos: 'ルートにある新しいファイル',
        arquivosRaizRemovidos: 'ルートから削除されたファイル'
      }
    }
  },
  /* -------------------------- GUARDIAN -------------------------- */
  guardian: {
    root: {
      label: 'guardian',
      descricao: 'コードの整合性確認と保護'
    },
    status: {
      label: 'status',
      opcoes: {
        sucesso: '確認成功、変更なし',
        alteracoes: '保護されたファイルで変更が検出',
        baseline: 'ベースライン作成（初回実行）',
        erro: '確認中のエラー',
        naoExecutada: 'Guardianが実行されませんでした'
      }
    },
    totalArquivos: {
      label: 'totalArquivos',
      descricao: '保護されたファイルの番号'
    },
    alteracoes: {
      label: 'alteracoes',
      descricao: '検出された変更のリスト',
      campos: {
        arquivo: '変更されたファイルのパス',
        hashAnterior: '以前のSHA-256ハッシュ',
        hashAtual: '現在のSHA-256ハッシュ',
        acao: 'アクションタイプ（変更、追加、削除）'
      }
    }
  },
  /* -------------------------- 剪定 -------------------------- */
  poda: {
    root: {
      label: 'poda',
      descricao: '削除のためにマークされたファイル/ディレクトリのレポート'
    },
    pendencias: {
      label: 'pendencias',
      descricao: '削除保留のアイテムのリスト',
      campos: {
        caminho: '完全パス',
        tipo: 'ファイルまたはディレクトリ',
        motivoOriginal: 'マークされた理由',
        timestamp: 'マークされた日付'
      }
    },
    reativar: {
      label: 'listaReativar',
      descricao: '再活性化のためにマークされたアイテムのリスト'
    },
    historico: {
      label: 'historico',
      descricao: '実行された剪定アクションの履歴',
      campos: {
        acao: 'アクションタイプ（削除、再活性、保留）',
        caminho: '影響を受けたパス',
        timestamp: 'アクションの日付',
        usuario: '実行したユーザー'
      }
    }
  },
  /* -------------------------- 再構成 -------------------------- */
  reestruturar: {
    root: {
      label: 'reestruturacao',
      descricao: 'プロジェクトの再構成プラン'
    },
    movimentos: {
      label: 'movimentos',
      descricao: '計画されたファイルの移動のリスト',
      campos: {
        id: '移動の一意のID',
        origem: '出発パス',
        destino: '宛先パス',
        razao: '移動の理由',
        status: 'ステータス（green-zone、ブロック、保留）',
        dependencias: '影響を受ける依存ファイル'
      }
    },
    conflitos: {
      label: 'conflitos',
      descricao: '移動を妨げる検出された競合',
      campos: {
        tipo: '競合タイプ',
        arquivos: '関わるファイル',
        descricao: '競合の説明',
        resolucaoSugerida: '解決方法'
      }
    },
    resumo: {
      label: 'resumo',
      descricao: 'プランの統計的要約',
      campos: {
        total: '移動合計',
        zonaVerde: '安全な移動',
        bloqueados: 'ブロックされた移動',
        impactoEstimado: '影響を受けるファイルの番号'
      }
    }
  },
  /* -------------------------- インテリジェントフィルタ -------------------------- */
  filtroInteligente: {
    root: {
      label: 'relatorioResumo',
      descricao: '優先問題がフィルタリングされたレポート'
    },
    problemasCriticos: {
      label: 'problemasCriticos',
      descricao: '重大度の重大な問題（セキュリティ、データ）'
    },
    problemasAltos: {
      label: 'problemasAltos',
      descricao: '高優先度の問題（バグ、脆弱コード）'
    },
    problemasOutros: {
      label: 'problemasOutros',
      descricao: 'その他の問題（低/中優先度）'
    },
    estatisticas: {
      label: 'estatisticas',
      descricao: 'インテリジェントグループ化の統計',
      campos: {
        totalOcorrencias: '処理された発生の合計',
        arquivosAfetados: '影響を受けるUniqueファイルの番号',
        problemasPrioritarios: '重大 + 高い問題',
        problemasAgrupados: '作成されたグループの番号'
      }
    }
  }
};

/**
 * 説明的なメタデータでJSONデータをラップ
 */
export function wrapComMetadados<T>(data: T, schema: string, versao: string, descricao: string): JsonComMetadados<T> {
  return {
    _metadata: {
      schema,
      versao,
      geradoEm: new Date().toISOString(),
      descricao
    },
    dados: data
  };
};

/**
 * タイプセーフなJSONフィールドの説明を生成するヘルパー
 */
export function getDescricaoCampo(caminho: string): string {
  const parts = caminho.split('.');
  // タイプセーフなメッセージオブジェクトナビゲーション
  let current: unknown = JsonMensagens;
  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return `フィールド: ${caminho}`;
    }
  }

  // 説明があるかどうかを確認するためのタイプガード
  if (typeof current === 'object' && current !== null && 'descricao' in current && typeof (current as {
    descricao: unknown;
  }).descricao === 'string') {
    return (current as {
      descricao: string;
    }).descricao;
  }
  return `フィールド: ${caminho}`;
}
