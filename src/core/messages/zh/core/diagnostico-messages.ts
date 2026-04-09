// SPDX-License-Identifier: MIT
// @prometheus-disable tipo-literal-inline-complexo
// Justificativa: tipos inline para helpers de mensagens
/**
 * 诊断命令消息
 *
 * 集中所有与仓库诊断相关的消息
 */

import type { ModoOperacao } from '@';

/**
 * 诊断图标
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
 * 按模式划分的启动消息
 */
export const MENSAGENS_INICIO: Record<ModoOperacao, string> = {
  compact: `${ICONES_DIAGNOSTICO.inicio} 诊断(紧凑模式)`,
  full: `${ICONES_DIAGNOSTICO.inicio} 启动完整诊断`,
  executive: `${ICONES_DIAGNOSTICO.executive} 执行分析(仅严重项)`,
  quick: `${ICONES_DIAGNOSTICO.rapido} 快速分析`
};

/**
 * 进度消息
 */
export const MENSAGENS_PROGRESSO = {
  varredura: (total: number) => `${ICONES_DIAGNOSTICO.arquivos} 扫描${total}个文件...`,
  analise: (atual: number, total: number) => `${ICONES_DIAGNOSTICO.analise} 分析中: ${atual}/${total}`,
  arquetipos: `${ICONES_DIAGNOSTICO.arquetipos} 检测项目结构...`,
  guardian: `${ICONES_DIAGNOSTICO.guardian} 验证完整性...`,
  autoFix: (modo: string) => `${ICONES_DIAGNOSTICO.autoFix} 应用修复 (模式: ${modo})...`,
  export: (formato: string) => `${ICONES_DIAGNOSTICO.export} 导出报告 (${formato})...`
} as const;

/**
 * 完成消息
 */
export const MENSAGENS_CONCLUSAO = {
  sucesso: (ocorrencias: number) => `${ICONES_DIAGNOSTICO.sucesso} 诊断完成: 发现${ocorrencias}个问题`,
  semProblemas: `${ICONES_DIAGNOSTICO.sucesso} 未发现问题！代码状态良好。`,
  exportado: (caminho: string) => `${ICONES_DIAGNOSTICO.export} 报告已保存: ${caminho}`
} as const;

/**
 * 错误消息
 */
export const MENSAGENS_ERRO = {
  falhaAnalise: (erro: string) => `${ICONES_DIAGNOSTICO.erro} 分析失败: ${erro}`,
  falhaExport: (erro: string) => `${ICONES_DIAGNOSTICO.erro} 导出失败: ${erro}`,
  falhaGuardian: (erro: string) => `${ICONES_DIAGNOSTICO.erro} Guardian失败: ${erro}`,
  falhaAutoFix: (erro: string) => `${ICONES_DIAGNOSTICO.erro} 自动修复失败: ${erro}`,
  flagsInvalidas: (erros: string[]) => `${ICONES_DIAGNOSTICO.erro} 无效标志:\n${erros.map(e => `  • ${e}`).join('\n')}`
} as const;

/**
 * 警告消息
 */
export const MENSAGENS_AVISO = {
  modoFast: `${ICONES_DIAGNOSTICO.info} 快速模式已激活 (PROMETHEUS_TEST_FAST=1)`,
  semMutateFS: `${ICONES_DIAGNOSTICO.aviso} 自动修复已禁用。`,
  guardianDesabilitado: `${ICONES_DIAGNOSTICO.info} Guardian未执行`,
  arquetiposTimeout: `${ICONES_DIAGNOSTICO.aviso} 原型检测超时`
} as const;

/**
 * 过滤器消息
 */
export const MENSAGENS_FILTROS = {
  titulo: '活动过滤器',
  include: (patterns: string[]) => `包含: ${patterns.length > 0 ? patterns.join(', ') : '无'}`,
  exclude: (patterns: string[]) => `排除: ${patterns.length > 0 ? patterns.join(', ') : '默认模式'}`,
  nodeModules: (incluido: boolean) => `node_modules: ${incluido ? `${ICONES_DIAGNOSTICO.sucesso} 已包含` : `${ICONES_DIAGNOSTICO.aviso} 已忽略(默认)`}`
} as const;

/**
 * 统计消息
 */
export const MENSAGENS_ESTATISTICAS = {
  titulo: '分析统计',
  arquivos: (total: number) => `已分析文件: ${total}`,
  ocorrencias: (total: number) => `发现的问题: ${total}`,
  porTipo: (tipo: string, count: number) => `  • ${tipo}: ${count}`,
  duracao: (ms: number) => {
    if (ms < 1000) return `耗时: ${ms}ms`;
    if (ms < 60000) return `耗时: ${(ms / 1000).toFixed(1)}s`;
    const min = Math.floor(ms / 60000);
    const seg = Math.floor(ms % 60000 / 1000);
    return `耗时: ${min}m ${seg}s`;
  }
} as const;

/**
 * Guardian消息
 */
export const MENSAGENS_GUARDIAN = {
  iniciando: `${ICONES_DIAGNOSTICO.guardian} 启动Guardian验证...`,
  baseline: '使用现有baseline',
  fullScan: '完整扫描已激活(忽略忽略项)',
  saveBaseline: '保存新baseline...',
  status: {
    verde: `${ICONES_DIAGNOSTICO.sucesso} Guardian: 状态绿色(完整性OK)`,
    amarelo: `${ICONES_DIAGNOSTICO.aviso} Guardian: 状态黄色(需要关注)`,
    vermelho: `${ICONES_DIAGNOSTICO.erro} Guardian: 状态红色(严重问题)`
  },
  drift: (count: number) => `检测到偏差: 相对于baseline有${count}个变更`
} as const;

// MENSAGENS_AUTOFIX foi movido para correcoes-messages.ts para consolidação

/**
 * 原型消息
 */
export const MENSAGENS_ARQUETIPOS = {
  detectando: `${ICONES_DIAGNOSTICO.arquetipos} 检测项目结构...`,
  identificado: (tipo: string, confianca: number) => `已识别原型: ${tipo} (${confianca}%置信度)`,
  multiplos: (count: number) => `发现${count}个候选原型`,
  salvando: '保存自定义原型...',
  salvo: (caminho: string) => `${ICONES_DIAGNOSTICO.sucesso} 原型已保存: ${caminho}`
} as const;

/**
 * 块模板
 */
export const MODELOS_BLOCO = {
  sugestoes: {
    titulo: '快速建议',
    formatarFlag: (flag: string, descricao: string) => `${flag}: ${descricao}`,
    formatarDica: (dica: string) => `${ICONES_DIAGNOSTICO.dica} ${dica}`
  },
  resumo: {
    titulo: '诊断摘要',
    secoes: {
      filtros: '应用的过滤器',
      estatisticas: '统计',
      arquetipos: '项目结构',
      guardian: '完整性(Guardian)',
      autoFix: '自动修复'
    }
  }
} as const;

/**
 * 格式化标志建议块
 */
export function formatarBlocoSugestoes(flagsAtivas: string[], dicas: string[]): string[] {
  const linhas: string[] = [];
  linhas.push('');
  linhas.push(`┌── ${MODELOS_BLOCO.sugestoes.titulo} ─────────────────────────────────────────`);
  if (flagsAtivas.length > 0) {
    linhas.push(`活动标志: ${flagsAtivas.join(' ')}`);
  } else {
    linhas.push('未检测到特殊标志');
  }
  if (dicas.length > 0) {
    linhas.push('');
    linhas.push('有用信息:');
    for (const dica of dicas) {
      linhas.push(`  ${dica}`);
    }
  }
  linhas.push('└───────────────────────────────────────────────────────────────');
  linhas.push('');

  return linhas;
}

/**
 * 格式化统计摘要
 */
export function formatarResumoStats(stats: {
  arquivos: number;
  ocorrencias: number;
  duracao: number;
  porTipo?: Record<string, number>;
}): string[] {
  const linhas: string[] = [];
  linhas.push('');
  linhas.push(`┌── ${MODELOS_BLOCO.resumo.secoes.estatisticas} ─────────────────────────────────────────`);
  linhas.push(`  ${MENSAGENS_ESTATISTICAS.arquivos(stats.arquivos)}`);
  linhas.push(`  ${MENSAGENS_ESTATISTICAS.ocorrencias(stats.ocorrencias)}`);
  if (stats.porTipo && Object.keys(stats.porTipo).length > 0) {
    linhas.push('');
    linhas.push('  按类型:');
    for (const [tipo, count] of Object.entries(stats.porTipo)) {
      linhas.push(`    ${MENSAGENS_ESTATISTICAS.porTipo(tipo, count)}`);
    }
  }
  linhas.push('');
  linhas.push(`  ${MENSAGENS_ESTATISTICAS.duracao(stats.duracao)}`);
  linhas.push('└────────���─��────────────────────────────────────────────────────');
  linhas.push('');

  return linhas;
}

/**
 * 格式化JSON模式消息
 */
export function formatarModoJson(ascii: boolean): string {
  return `${ICONES_DIAGNOSTICO.info} 结构化JSON输出${ascii ? ' (ASCII转义)' : ''}已激活`;
}

/**
 * 命令的标准标题和文本
 */
export const CABECALHOS = {
 分析师: {
    tituloFast: `${ICONES_DIAGNOSTICO.info} 注册的分析器(快速模式)`,
    titulo: `${ICONES_DIAGNOSTICO.info} 注册的分析器`,
    mdTitulo: '# 注册的分析器'
  },
  diagnostico: {
    flagsAtivas: '活动标志:',
    informacoesUteis: '有用信息:'
  },
  reestruturar: {
    prioridadeDomainsFlat: `${ICONES_DIAGNOSTICO.aviso} 指定了--domains和--flat。优先使用--domains。`,
    planoVazioFast: `${ICONES_DIAGNOSTICO.info} 空计划: 无建议移动。(快速模式)`,
    nenhumNecessarioFast: `${ICONES_DIAGNOSTICO.sucesso} 不需要结构修复。(快速模式)`,
    conflitosDetectadosFast: (count: number) => `${ICONES_DIAGNOSTICO.aviso} 检测到冲突: ${count} (快速模式)`
  }
} as const;