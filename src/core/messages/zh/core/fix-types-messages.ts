// SPDX-License-Identifier: MIT
/**
 * fix-types命令消息
 *
 * 集中所有与fix-types命令相关的消息、文本和模板
 * 该命令检测和分类TypeScript代码中的不安全类型(any/unknown)。
 */

import { ICONES_ACAO, ICONES_ARQUIVO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_FEEDBACK, ICONES_RELATORIO, ICONES_STATUS, ICONES_TIPOS } from '../../shared/icons.js';

/**
 * 不安全类型分类配置
 */
export const CATEGORIAS_TIPOS = {
  LEGITIMO: {
    icone: ICONES_TIPOS.legitimo,
    nome: '合法',
    descricao: '正确使用unknown - 无需操作',
    confidenciaMin: 100
  },
  MELHORAVEL: {
    icone: ICONES_TIPOS.melhoravel,
    nome: '可改进',
    descricao: '可以更具体 - 建议手动审查',
    confidenciaMin: 70
  },
  CORRIGIR: {
    icone: ICONES_TIPOS.corrigir,
    nome: '需修复',
    descricao: '必须替换 - 可自动修复',
    confidenciaMin: 95
  }
} as const;

/**
 * 命令启动/头部消息
 */
export const MENSAGENS_INICIO = {
  titulo: `${ICONES_COMANDO.fixTypes} 启动不安全类型分析...`,
  analisando: (target: string) => `${ICONES_ARQUIVO.diretorio} 分析中: ${target}`,
  confianciaMin: (min: number) => `${ICONES_DIAGNOSTICO.stats} 最低置信度: ${min}%`,
  modo: (dryRun: boolean) => `${dryRun ? ICONES_ACAO.analise : ICONES_ACAO.correcao} 模式: ${dryRun ? '分析(试运行)' : '应用修复'}`
} as const;

/**
 * 进度/状态消息
 */
export const MENSAGENS_PROGRESSO = {
  processandoArquivos: (count: number) => `${ICONES_ARQUIVO.diretorio} 处理${count}个文件...`,
  arquivoAtual: (arquivo: string, count: number) => `${ICONES_ARQUIVO.arquivo} ${arquivo}: ${count}个问题`
} as const;

/**
 * 摘要/统计消息
 */
export const MENSAGENS_RESUMO = {
  encontrados: (count: number) => `发现${count}个不安全类型:`,
  tituloCategorizacao: `${ICONES_DIAGNOSTICO.stats} 分类分析:`,
  confianciaMedia: (media: number) => `${ICONES_DIAGNOSTICO.stats} 平均置信度: ${media}%`,
  porcentagem: (count: number, total: number) => {
    const pct = total > 0 ? Math.round(count / total * 100) : 0;
    return `${count}个案例 (${pct}%)`;
  }
} as const;

/**
 * 提示/帮助消息
 */
export const DICAS = {
  removerDryRun: '[提示] 要应用修复,请删除--dry-run标志',
  usarInterativo: '[提示] 使用--interactive确认每个修复',
  ajustarConfianca: (atual: number) => `${ICONES_FEEDBACK.dica} 使用--confidence <num>调整阈值(当前: ${atual}%)`,
  revisar: (categoria: string) => `${ICONES_FEEDBACK.dica} 手动审查${categoria}案例`
} as const;

/**
 * 按分类的建议操作
 */
export const ACOES_SUGERIDAS = {
  LEGITIMO: ['这些案例正确,应保持原样', '不需要额外操作'],
  MELHORAVEL: ['考虑在可能时替换为更具体的类型', '在未来重构时审查', '添加解释unknown使用的注释'],
  CORRIGIR: ['优先修复这些案例', '替换为特定的TypeScript类型', '必要时使用type guards']
} as const;

/**
 * 错误/警告消息
 */
export const MENSAGENS_ERRO = {
  correcaoNaoImplementada: '完整的自动修复尚未实现',
  sistemaDesenvolvimento: `${ICONES_FEEDBACK.foguete} 高级自动修复系统正在开发中`,
  requisitoAnalise: '需要AST分析和类型推断才能安全修复',
  detectorNaoEncontrado: '在分析器注册表中未找到不安全类型检测器',
  modulosNaoEncontrados: '未找到修复模块'
} as const;

/**
 * 成功消息
 */
export const MENSAGENS_SUCESSO = {
  nenhumTipoInseguro: `${ICONES_STATUS.ok} 未检测到不安全类型!代码类型安全良好。`,
  nenhumAltaConfianca: `${ICONES_STATUS.ok} 未找到高置信度修复`,
  nenhumaCorrecao: '未应用修复(使用--confidence调整阈值)'
} as const;

/**
 * CLI流程特定消息(行和头部)用于src/cli/**
 */
export const MENSAGENS_CLI_CORRECAO_TIPOS = {
  linhaEmBranco: '',
  erroExecutar: (mensagem: string) => `执行fix-types出错: ${mensagem}`,
  linhaResumoTipo: (texto: string) => `  ${texto}`,
  exemplosDryRunTitulo: `${ICONES_RELATORIO.lista} 发现的示例(试运行):`,
  exemploLinha: (icone: string, relPath: string | undefined, linha: string) => `  ${icone} ${relPath}:${linha}`,
  exemploMensagem: (mensagem: string) => `     └─ ${mensagem}`,
  debugVariavel: (nome: string) => `     └─ 变量: ${nome}`,
  maisOcorrencias: (qtd: number) => `  ... 还有${qtd}个问题`,
  aplicandoCorrecoesAuto: `${ICONES_ACAO.correcao} 应用自动修复...`,
  exportandoRelatorios: `${ICONES_ACAO.export} 导出报告...`,
  // 详细日志
  verboseAnyDetectado: (arquivo: string, linha: string) => `  ${ICONES_TIPOS.any} ${arquivo}:${linha} - 检测到any(建议修复)`,
  verboseAsAnyCritico: (arquivo: string, linha: string) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - 检测到"as any"(严重-必须修复)`,
  verboseAngleAnyCritico: (arquivo: string, linha: string) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - 检测到"<any>"(严重-遗留语法)`,
  verboseUnknownCategoria: (icone: string, arquivo: string, linha: string, categoria: string, confianca: number) => `  ${icone} ${arquivo}:${linha} - ${categoria} (${confianca}%)`,
  verboseMotivo: (motivo: string) => `     └─ ${motivo}`,
  verboseSugestao: (sugestao: string) => `     └─ ${ICONES_FEEDBACK.dica} ${sugestao}`,
  verboseVariantesTitulo: `     └─ ${ICONES_DIAGNOSTICO.stats} 替代可能性:`,
  verboseVarianteItem: (idxBase1: number, variante: string) => `        ${idxBase1}. ${variante}`,
  analiseDetalhadaSalva: `${ICONES_ARQUIVO.arquivo} 详细分析已保存: .prometheus/fix-types-analise.json`,
  altaConfiancaTitulo: (qtd: number) => `${ICONES_DIAGNOSTICO.stats} ${qtd}个高置信度修复(≥85%):`,
  altaConfiancaLinha: (relPath: string | undefined, linha: string, confianca: number) => `  ${ICONES_TIPOS.corrigir} ${relPath}:${linha} (${confianca}%)`,
  altaConfiancaDetalhe: (texto: string) => `     └─ ${texto}`,
  altaConfiancaMais: (qtd: number) => `  ... 还有${qtd}个修复`,
  incertosTitulo: (qtd: number) => `${ICONES_FEEDBACK.pergunta} ${qtd}个分析不确定的案例(<70%置信度):`,
  incertosIntro: '   这些案例需要仔细手动审查 - 检测到多种可能性',
  incertosLinha: (relPath: string | undefined, linha: string, confianca: number) => `  ${ICONES_TIPOS.melhoravel} ${relPath}:${linha} (${confianca}%)`,
  incertosMais: (qtd: number) => `  ... 还有${qtd}个不确定案例(见.prometheus/fix-types-analise.json)`,
  correcoesResumoSucesso: (qtd: number) => `${ICONES_STATUS.ok} ${qtd}个文件已修复`,
  correcoesResumoLinhaOk: (arquivo: string, linhas: number) => `   记录  ${arquivo}: ${linhas}行已修改`,
  correcoesResumoLinhaErro: (arquivo: string, erro: string | undefined) => `   ${ICONES_STATUS.falha} ${arquivo}: ${erro}`,
  correcoesResumoFalhas: (qtd: number) => `${ICONES_STATUS.falha} ${qtd}个文件出错`,
  dryRunAviso: (iconeInicio: string) => `${iconeInicio} 试运行模式已激活 - 不会进行任何更改`,
  templatePasso: (passo: string) => `  ${passo}`
} as const;

/**
 * 分类文本(原因/建议)出现在日志和导出中。
 */
export const TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS = {
  anyMotivo: 'any不安全 - 替换为特定类型',
  anySugestao: '分析变量使用以推断正确类型',
  asAnyMotivo: '类型断言"as any"完全禁用类型安全',
  asAnySugestao: '严重:替换为特定类型或使用unknown并进行运行时验证',
  angleAnyMotivo: '遗留的类型转换<any>禁用类型安全',
  angleAnySugestao: '严重:迁移到现代"as"语法并使用特定类型',
  semContextoMotivo: '无法分析上下文',
  semContextoSugestao: '手动审查'
} as const;

/**
 * 最终摘要模板
 */
export const TEMPLATE_RESUMO_FINAL = {
  titulo: `${ICONES_RELATORIO.detalhado} 手动应用修复:`,
  passos: ['审查上述分类案例', `合法 (${ICONES_TIPOS.legitimo}): 保持原样`, `可改进 (${ICONES_TIPOS.melhoravel}): 考虑更具体的类型`, `需修复 (${ICONES_TIPOS.corrigir}): 替换为特定类型`, '修复后运行`npm run lint`']
} as const;

/**
 * 命令中使用的图标
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
  lampada: '[提示]',
  foguete: '[>>]',
  nota: '[NOTE]',
  checkbox: '[OK]',
  setinha: '└─',
  ...CATEGORIAS_TIPOS
} as const;

/**
 * 格式化不安全类型消息(带图标和计数器)
 */
export function formatarTipoInseguro(tipo: string, count: number): string {
  const icone = tipo.includes('any') ? ICONES_TIPOS.any : ICONES_TIPOS.unknown;
  const plural = count !== 1 ? 's' : '';
  return `${icone} ${tipo}: ${count}个问题${plural}`;
}

/**
 * 格式化单个问题行
 */
export function formatarOcorrencia(relPath: string, linha: number | undefined): string {
  return `  ${ICONES.setinha} ${relPath}:${linha || '?'}`;
}

/**
 * 带上下文格式化消息
 */
export function formatarComContexto(mensagem: string, indentLevel: number = 1): string {
  const indent = '  '.repeat(indentLevel);
  return `${indent}${ICONES.setinha} ${mensagem}`;
}

/**
 * 格式化修复建议
 */
export function formatarSugestao(sugestao: string): string {
  return `     ${ICONES.setinha} ${ICONES.lampada} ${sugestao}`;
}

/**
 * 生成分类摘要文本
 */
export function gerarResumoCategoria(categoria: keyof typeof CATEGORIAS_TIPOS, count: number, total: number): string[] {
  const config = CATEGORIAS_TIPOS[categoria];
  const porcentagem = MENSAGENS_RESUMO.porcentagem(count, total);
  return [categoria === 'CORRIGIR' ? `${config.icone} ${config.nome}: ${porcentagem}` : categoria === 'MELHORAVEL' ? `${config.icone} ${config.nome}: ${porcentagem}` : `${config.icone} ${config.nome}: ${porcentagem}`, `   ${ICONES.setinha} ${config.descricao}`];
}

/**
 * 调试消息(仅在DEV_MODE)
 */
export const DEPURACAO = {
  categorizacao: (arquivo: string, tipo: string, categoria: string) => `[调试] ${arquivo} - ${tipo} → ${categoria}`,
  confianca: (tipo: string, valor: number) => `[调试] ${tipo}的置信度: ${valor}%`
} as const;