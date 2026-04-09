// SPDX-License-Identifier: MIT
/**
 * 集中式报告消息 (Markdown 和 JSON)
 * 所有标题、标题、描述和解释性文本的字符串
 * 应在此处定义，以便于未来维护和国际化。
 */

import { ICONES_ACAO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_RELATORIO } from '../../shared/icons.js';

export const RelatorioMensagens = {
  /* -------------------------- 主报告 (gerador-relatorio.ts) -------------------------- */
  principal: {
    titulo: `${ICONES_RELATORIO.resumo} Prometheus 报告`,
    secoes: {
      metadados: {
        data: '日期',
        duracao: '持续时间',
        arquivos: '扫描的文件',
        ocorrencias: '发现的问题',
        arquivoManifest: '清单文件',
        notaManifest: '要探索完整报告，请下载/解压清单中列出的分片。'
      },
      guardian: {
        titulo: `${ICONES_DIAGNOSTICO.guardian} 完整性检查 (Guardian)`,
        status: '状态',
        timestamp: '时间戳',
        totalArquivos: '受保护的文件总数'
      },
      resumoTipos: {
        titulo: `${ICONES_DIAGNOSTICO.stats} 问题类型摘要`,
        tipo: '类型',
        quantidade: '数量'
      },
      ocorrencias: {
        titulo: `${ICONES_RELATORIO.lista} 发现的问题`,
        colunas: {
          arquivo: '文件',
          linha: '行',
          nivel: '级别',
          mensagem: '消息'
        }
      },
      estatisticas: {
        titulo: `${ICONES_RELATORIO.grafico} 总体统计`,
        linhasAnalisadas: '分析的代码行',
        padroesProgramacao: '编程模式',
        analiseInteligente: '智能代码分析'
      }
    }
  },
  /* -------------------------- 摘要报告 / 智能过滤器 -------------------------- */
  resumo: {
    titulo: `${ICONES_RELATORIO.resumo} 摘要报告 - 优先问题`,
    introducao: '此报告将类似问题分组并按影响程度排序，以便于分析。',
    secoes: {
      criticos: {
        titulo: `${ICONES_RELATORIO.error} 严重问题`,
        vazio: '未检测到严重问题。'
      },
      altos: {
        titulo: `${ICONES_RELATORIO.warning} 高优先级问题`,
        vazio: '未检测到高优先级问题。'
      },
      outros: {
        titulo: `${ICONES_RELATORIO.lista} 其他问题`,
        vazio: '未检测到其他问题。'
      },
      estatisticas: {
        titulo: `${ICONES_DIAGNOSTICO.stats} 报告统计`,
        totalOcorrencias: '总问题数',
        arquivosAfetados: '受影响的文件',
        problemasPrioritarios: '优先问题',
        problemasAgrupados: '分组问题'
      }
    },
    labels: {
      quantidade: '数量',
      arquivosAfetados: '受影响的文件',
      acaoSugerida: '建议操作',
      exemplos: '示例'
    }
  },
  /* -------------------------- 代码健康报告 (zelador-saude.ts) -------------------------- */
  saude: {
    titulo: `${ICONES_ACAO.limpeza} 代码健康报告`,
    introducao: `${ICONES_DIAGNOSTICO.stats} 代码使用模式`,
    secoes: {
      funcoesLongas: {
        titulo: '每个文件的长函数详情',
        vazio: '没有超过限制的函数。',
        colunas: {
          tipo: '类型',
          quantidade: '数量'
        }
      },
      constantesDuplicadas: {
        titulo: `${ICONES_RELATORIO.detalhado} 定义超过3次的常量`
      },
      modulosRequire: {
        titulo: `${ICONES_RELATORIO.detalhado} 使用超过3次的 require 模块`
      },
      fim: {
        titulo: '守护者报告结束'
      }
    },
    instrucoes: {
      diagnosticoDetalhado: '要获取详细诊断，请执行: prometheus diagnosticar --export',
      tabelasVerbosas: '要查看带边框的表格(非常详细)，请使用: --debug'
    }
  },
  /* -------------------------- 使用模式报告 -------------------------- */
  padroesUso: {
    titulo: `${ICONES_DIAGNOSTICO.stats} 代码使用模式`
  },
  /* -------------------------- 原型报告 -------------------------- */
  arquetipos: {
    titulo: `${ICONES_DIAGNOSTICO.arquetipos} 原型报告`,
    secoes: {
      candidatos: {
        titulo: '识别的候选人',
        nome: '名称',
        score: '评分',
        confianca: '置信度',
        descricao: '描述'
      },
      baseline: {
        titulo: '保存的基线',
        snapshot: '快照',
        arquivos: '文件'
      },
      drift: {
        titulo: '检测到的偏差',
        alterouArquetipo: '更改了原型',
        deltaConfianca: '置信度变化',
        arquivosNovos: '新文件',
        arquivosRemovidos: '删除的文件'
      }
    }
  },
  /* -------------------------- 修剪报告 -------------------------- */
  poda: {
    titulo: `${ICONES_COMANDO.podar} Prometheus 修剪报告`,
    secoes: {
      metadados: {
        data: '日期',
        execucao: '执行',
        simulacao: '模拟',
        real: '真实',
        arquivosPodados: '修剪的文件',
        arquivosMantidos: '保留的文件'
      },
      podados: {
        titulo: '修剪的文件',
        vazio: '本次周期没有文件被修剪。',
        colunas: {
          arquivo: '文件',
          motivo: '原因',
          diasInativo: '不活跃天数',
          detectadoEm: '检测于'
        }
      },
      mantidos: {
        titulo: '保留的文件',
        vazio: '本次周期没有保留的文件。',
        colunas: {
          arquivo: '文件',
          motivo: '原因'
        }
      },
      pendencias: {
        titulo: '待删除项目',
        total: '待删除总数',
        tipoArquivo: '类型: 文件',
        tipoDiretorio: '类型: 目录',
        tamanhoTotal: '大概总大小'
      },
      reativacao: {
        titulo: '重新激活列表',
        total: '需要重新激活的总数'
      },
      historico: {
        titulo: '操作历史',
        total: '操作总数',
        colunas: {
          acao: '操作',
          caminho: '路径',
          timestamp: '时间戳'
        }
      }
    }
  },
  /* -------------------------- 重构报告 -------------------------- */
  reestruturar: {
    titulo: `${ICONES_COMANDO.reestruturar} Prometheus 重构报告`,
    secoes: {
      metadados: {
        data: '日期',
        execucao: '执行',
        simulacao: '模拟',
        real: '真实',
        origemPlano: '计划来源',
        preset: '预设'
      },
      movimentos: {
        titulo: '移动',
        total: '移动总数',
        vazio: '本次周期没有建议的移动。',
        status: {
          zonVerde: '绿色区域 (安全)',
          bloqueados: '已阻止'
        },
        colunas: {
          origem: '从',
          destino: '到',
          razao: '原因',
          status: '状态'
        }
      },
      conflitos: {
        titulo: '检测到的冲突',
        total: '冲突数量',
        tipo: '类型',
        descricao: '描述'
      },
      preview: {
        titulo: '更改预览',
        nota: `执行 --apply 之前不会移动任何文件`
      }
    }
  },
  /* -------------------------- 通用消息 -------------------------- */
  comum: {
    separadores: {
      secao: '---',
      subsecao: '~~~'
    },
    vazios: {
      nenhumResultado: '未找到结果。',
      nenhumaOcorrencia: '未检测到问题。',
      semDados: '没有可用数据。'
    },
    acoes: {
      verDetalhes: '查看完整详情',
      executarComando: '执行命令',
      aplicarMudancas: '应用更改',
      cancelar: '取消'
    }
  }
};

/**
 * 格式化带变量消息的辅助函数
 * @example
 * formatMessage(RelatorioMessages.principal.secoes.metadados.arquivos, { count: 42 })
 * // => "扫描的文件: 42"
 */
export function formatMessage(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(`{${key}}`, String(value));
  }
  return result;
}

/**
 * 简单复数辅助函数
 */
export function pluralize(count: number, singular: string, plural: string, showCount = true): string {
  const word = count === 1 ? singular : plural;
  return showCount ? `${count} ${word}` : word;
}

/**
 * 创建分隔线的辅助函数
 */
export function separator(char = '-', length = 80): string {
  return char.repeat(length);
}