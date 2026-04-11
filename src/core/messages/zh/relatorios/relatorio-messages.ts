// SPDX-License-Identifier: MIT
/**
 * 报告集中化消息 (Markdown 和 JSON)
 * 所有标题、头部、描述和解释性文本
 * 必须在此定义以便于维护和未来国际化。
 */

import { ICONES_ACAO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_RELATORIO } from '../../shared/icons.js';

export const RelatorioMensagens = {
  /* -------------------------- 主报告 (gerador-relatorio.ts) -------------------------- */
  principal: {
    titulo: `${ICONES_RELATORIO.resumo} Prometheus 报告`,
    secoes: {
      metadados: {
        data: '日期',
        duracao: '耗时',
        arquivos: '已扫描文件',
        ocorrencias: '发现的问题',
        arquivoManifest: '清单文件',
        noteManifest: '要查看完整报告，请下载/解压清单中列出的分片。'
      },
      guardian: {
        titulo: `${ICONES_DIAGNOSTICO.guardian} 完整性验证 (guardian)`,
        status: '状态',
        timestamp: '时间戳',
        totalArquivos: '受保护文件总数'
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
        linhasAnalisadas: '已分析行数',
        padroesProgramacao: '编程模式',
        analiseInteligente: '智能代码分析'
      }
    }
  },
  /* -------------------------- 摘要报告 / 智能过滤 -------------------------- */
  resumo: {
    titulo: `${ICONES_RELATORIO.resumo} 摘要报告 - 优先问题`,
    introducao: '本报告将相似问题分组并按影响优先级排序，以方便分析。',
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
        totalOcorrencias: '出现项总计',
        arquivosAfetados: '受影响文件',
        problemasPrioritarios: '优先问题',
        problemasAgrupados: '已分组问题'
      }
    },
    labels: {
      quantidade: '数量',
      arquivosAfetados: '受影响文件',
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
        titulo: '每个文件的过长函数详情',
        vazio: '没有超过限制的函数。',
        colunas: {
          tipo: '类型',
          quantidade: '数量'
        }
      },
      constantesDuplicadas: {
        titulo: `${ICONES_RELATORIO.detalhado} 被定义超过 3 次的常量`
      },
      modulosRequire: {
        titulo: `${ICONES_RELATORIO.detalhado} 被使用超过 3 次的 Require 模块`
      },
      fim: {
        titulo: '管理员报告结束'
      }
    },
    instrucoes: {
      diagnosticoDetalhado: '要获取详细诊断，请运行: prometheus diagnosticar --export',
      tabelasVerbosas: '要在终端查看框线表格 (非常详细)，请使用: --debug'
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
        titulo: '已识别的候选',
        nome: '名称',
        score: '得分',
        confianca: '置信度',
        descricao: '描述'
      },
      baseline: {
        titulo: '已保存的基线',
        snapshot: '快照',
        arquivos: '文件'
      },
      drift: {
        titulo: '检测到的偏移',
        alterouArquetipo: '原型已更改',
        deltaConfianca: '置信度变化',
        arquivosNovos: '新文件',
        arquivosRemovidos: '已移除文件'
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
        real: '实际',
        arquivosPodados: '已修剪文件',
        arquivosMantidos: '已保留文件'
      },
      podados: {
        titulo: '已修剪文件',
        vazio: '本轮没有文件被修剪。',
        colunas: {
          arquivo: '文件',
          motivo: '原因',
          diasInativo: '未活跃天数',
          detectadoEm: '检测于'
        }
      },
      mantidos: {
        titulo: '已保留文件',
        vazio: '本轮没有文件被保留。',
        colunas: {
          arquivo: '文件',
          motivo: '原因'
        }
      },
      pendencias: {
        titulo: '待删除项目',
        total: '待处理项目总计',
        tipoArquivo: '类型: 文件',
        tipoDiretorio: '类型: 目录',
        tamanhoTotal: '近似总大小'
      },
      reativacao: {
        titulo: '待重新激活列表',
        total: '待重新激活总计'
      },
      historico: {
        titulo: '操作历史',
        total: '操作总计',
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
        real: '实际',
        origemPlano: '计划来源',
        preset: '预设'
      },
      movimentos: {
        titulo: '移动',
        total: '移动总计',
        vazio: '本轮没有建议的移动。',
        status: {
          zonVerde: '绿区 (安全)',
          bloqueados: '已阻止'
        },
        colunas: {
          origem: '来源',
          destino: '目标',
          razao: '原因',
          status: '状态'
        }
      },
      conflitos: {
        titulo: '检测到的冲突',
        total: '检测到的冲突',
        tipo: '类型',
        descricao: '描述'
      },
      preview: {
        titulo: '更改预览',
        nota: `在通过 --apply 执行之前，不会移动任何文件`
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
      nenhumaOcorrencia: '未检测到出现项。',
      semDados: '无可用数据。'
    },
    acoes: {
      verDetalhes: '查看完整详情',
      executarComando: '运行命令',
      aplicarMudancas: '应用更改',
      cancelar: '取消'
    }
  }
};

/**
 * 格式化带变量的消息
 * @example
 * formatMessage(RelatorioMessages.principal.secoes.metadados.arquivos, { count: 42 })
 * // => "已扫描文件: 42"
 */
export function formatMessage(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(`{${key}}`, String(value));
  }
  return result;
}

/**
 * 简单复数化辅助函数
 */
export function pluralize(count: number, singular: string, plural: string, showCount = true): string {
  const word = count === 1 ? singular : plural;
  return showCount ? `${count} ${word}` : word;
}

/**
 * 创建分隔行
 */
export function separator(char = '-', length = 80): string {
  return char.repeat(length);
}
