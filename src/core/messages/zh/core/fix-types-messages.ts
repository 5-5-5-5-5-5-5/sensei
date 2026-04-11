// SPDX-License-Identifier: MIT
/**
 * Fix-Types 命令消息
 *
 * 集中化所有与 fix-types 命令相关的消息、文本和模板
 * 该命令用于检测和分类 TypeScript 代码中的不安全类型 (any/unknown)。
 */

import { ICONES_ACAO, ICONES_ARQUIVO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_FEEDBACK, ICONES_RELATORIO, ICONES_STATUS, ICONES_TIPOS } from '../../shared/icons.js';

/**
 * 不安全类型类别配置
 */
export const CATEGORIAS_TIPOS = {
  LEGITIMO: {
    icone: ICONES_TIPOS.legitimo,
    nome: '合法',
    descricao: '正确使用 unknown - 无需操作',
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
 * 命令开始/头部消息
 */
const MENSAGENS_INICIO = {
  titulo: `${ICONES_COMANDO.fixTypes} 开始分析不安全类型...`,
  analisando: (target: string) => `${ICONES_ARQUIVO.diretorio} 正在分析: ${target}`,
  confianciaMin: (min: number) => `${ICONES_DIAGNOSTICO.stats} 最低置信度: ${min}%`,
  modo: (dryRun: boolean) => `${dryRun ? ICONES_ACAO.analise : ICONES_ACAO.correcao} 模式: ${dryRun ? '分析 (dry-run)' : '应用修复'}`
} as const;

/**
 * 进度/状态消息
 */
const MENSAGENS_PROGRESSO = {
  processandoArquivos: (count: number) => `${ICONES_ARQUIVO.diretorio} 正在处理 ${count} 个文件...`,
  arquivoAtual: (arquivo: string, count: number) => `${ICONES_ARQUIVO.arquivo} ${arquivo}: ${count} 处出现`
} as const;

/**
 * 摘要/统计消息
 */
export const MENSAGENS_RESUMO = {
  encontrados: (count: number) => `发现 ${count} 个不安全类型:`,
  tituloCategorizacao: `${ICONES_DIAGNOSTICO.stats} 分类分析:`,
  confianciaMedia: (media: number) => `${ICONES_DIAGNOSTICO.stats} 平均置信度: ${media}%`,
  porcentagem: (count: number, total: number) => {
    const pct = total > 0 ? Math.round(count / total * 100) : 0;
    return `${count} 个案例 (${pct}%)`;
  }
} as const;

/**
 * 提示/帮助消息
 */
export const DICAS = {
  removerDryRun: '[提示] 要应用修复，请移除 --dry-run 标志',
  usarInterativo: '[提示] 使用 --interactive 确认每个修复',
  ajustarConfianca: (atual: number) => `${ICONES_FEEDBACK.dica} 使用 --confidence <num> 调整阈值 (当前: ${atual}%)`,
  revisar: (categoria: string) => `${ICONES_FEEDBACK.dica} 手动审查 ${categoria} 案例`
} as const;

/**
 * 每个类别的建议操作
 */
export const ACOES_SUGERIDAS = {
  LEGITIMO: ['这些情况正确，应保持原样', '不需要任何额外操作'],
  MELHORAVEL: ['考虑在可能时替换为更具体的类型', '在未来重构期间审查', '添加注释说明使用 unknown 的原因'],
  CORRIGIR: ['优先修复这些情况', '替换为具体的 TypeScript 类型', '必要时使用类型守卫']
} as const;

/**
 * 错误/警告消息
 */
const MENSAGENS_ERRO = {
  correcaoNaoImplementada: '完整的自动修复尚未实现',
  sistemaDesenvolvimento: `${ICONES_FEEDBACK.foguete} 高级自动修复系统正在开发中`,
  requisitoAnalise: '需要 AST 分析和类型推断以确保安全',
  detectorNaoEncontrado: '在分析器注册表中未找到不安全类型检测器',
  modulosNaoEncontrados: '未找到修复模块'
} as const;

/**
 * 成功消息
 */
export const MENSAGENS_SUCESSO = {
  nenhumTipoInseguro: `${ICONES_STATUS.ok} 未检测到不安全类型！代码具有良好的类型安全性。`,
  nenhumAltaConfianca: `${ICONES_STATUS.ok} 未找到高置信度修复`,
  nenhumaCorrecao: '未应用任何修复 (使用 --confidence 调整阈值)'
} as const;

/**
 * CLI 流程专用消息（行和标题），用于 src/cli/**
 */
export const MENSAGENS_CLI_CORRECAO_TIPOS = {
  linhaEmBranco: '',
  erroExecutar: (mensagem: string) => `运行 fix-types 时出错: ${mensagem}`,
  linhaResumoTipo: (texto: string) => `  ${texto}`,
  exemplosDryRunTitulo: `${ICONES_RELATORIO.lista} 找到的示例 (dry-run):`,
  exemploLinha: (icone: string, relPath: string | undefined, linha: string) => `  ${icone} ${relPath}:${linha}`,
  exemploMensagem: (mensagem: string) => `     └─ ${mensagem}`,
  debugVariavel: (nome: string) => `     └─ 变量: ${nome}`,
  maisOcorrencias: (qtd: number) => `  ... 还有 ${qtd} 处出现`,
  aplicandoCorrecoesAuto: `${ICONES_ACAO.correcao} 正在应用自动修复...`,
  exportandoRelatorios: `${ICONES_ACAO.export} 导出报告中...`,
  // 详细日志
  verboseAnyDetectado: (arquivo: string, linha: string) => `  ${ICONES_TIPOS.any} ${arquivo}:${linha} - 检测到 any (建议修复)`,
  verboseAsAnyCritico: (arquivo: string, linha: string) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - 检测到 "as any" (严重 - 必须修复)`,
  verboseAngleAnyCritico: (arquivo: string, linha: string) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - 检测到 "<any>" (严重 - 遗留语法)`,
  verboseUnknownCategoria: (icone: string, arquivo: string, linha: string, categoria: string, confianca: number) => `  ${icone} ${arquivo}:${linha} - ${categoria} (${confianca}%)`,
  verboseMotivo: (motivo: string) => `     └─ ${motivo}`,
  verboseSugestao: (sugestao: string) => `     └─ ${ICONES_FEEDBACK.dica} ${sugestao}`,
  verboseVariantesTitulo: `     └─ ${ICONES_DIAGNOSTICO.stats} 替代可能性:`,
  verboseVarianteItem: (idxBase1: number, variante: string) => `        ${idxBase1}. ${variante}`,
  analiseDetalhadaSalva: `${ICONES_ARQUIVO.arquivo} 详细分析已保存至: .prometheus/fix-types-analise.json`,
  altaConfiancaTitulo: (qtd: number) => `${ICONES_DIAGNOSTICO.stats} ${qtd} 个高置信度修复 (≥85%):`,
  altaConfiancaLinha: (relPath: string | undefined, linha: string, confianca: number) => `  ${ICONES_TIPOS.corrigir} ${relPath}:${linha} (${confianca}%)`,
  altaConfiancaDetalhe: (texto: string) => `     └─ ${texto}`,
  altaConfiancaMais: (qtd: number) => `  ... 还有 ${qtd} 个修复`,
  incertosTitulo: (qtd: number) => `${ICONES_FEEDBACK.pergunta} ${qtd} 个分析不确定的案例 (<70% 置信度):`,
  incertosIntro: '   这些案例需要仔细手动审查 - 检测到多种可能性',
  incertosLinha: (relPath: string | undefined, linha: string, confianca: number) => `  ${ICONES_TIPOS.melhoravel} ${relPath}:${linha} (${confianca}%)`,
  incertosMais: (qtd: number) => `  ... 还有 ${qtd} 个不确定案例 (参见 .prometheus/fix-types-analise.json)`,
  correcoesResumoSucesso: (qtd: number) => `${ICONES_STATUS.ok} 已修复 ${qtd} 个文件`,
  correcoesResumoLinhaOk: (arquivo: string, linhas: number) => `   日志  ${arquivo}: 修改了 ${linhas} 行`,
  correcoesResumoLinhaErro: (arquivo: string, erro: string | undefined) => `   ${ICONES_STATUS.falha} ${arquivo}: ${erro}`,
  correcoesResumoFalhas: (qtd: number) => `${ICONES_STATUS.falha} ${qtd} 个文件出错`,
  dryRunAviso: (iconeInicio: string) => `${iconeInicio} Dry-run 模式激活 - 不会进行任何更改`,
  templatePasso: (passo: string) => `  ${passo}`
} as const;

/**
 * 分类文本（原因/建议），出现在日志和导出中。
 */
export const TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS = {
  anyMotivo: 'any 不安全 - 替换为具体类型',
  anySugestao: '分析变量用法以推断正确类型',
  asAnyMotivo: '类型断言 "as any" 完全禁用类型安全',
  asAnySugestao: '严重: 替换为具体类型或使用 unknown 配合运行时验证',
  angleAnyMotivo: '遗留类型转换 <any> 禁用类型安全',
  angleAnySugestao: '严重: 迁移到现代 "as" 语法并使用具体类型',
  semContextoMotivo: '无法分析上下文',
  semContextoSugestao: '手动审查'
} as const;

/**
 * 最终摘要模板
 */
export const TEMPLATE_RESUMO_FINAL = {
  titulo: `${ICONES_RELATORIO.detalhado} 手动应用修复:`,
  passos: ['审查上面分类的案例', `合法 (${ICONES_TIPOS.legitimo}): 保持原样`, `可改进 (${ICONES_TIPOS.melhoravel}): 考虑更具体的类型`, `需修复 (${ICONES_TIPOS.corrigir}): 替换为具体类型`, '修复后运行 `npm run lint`']
} as const;

/**
 * 命令中使用的表情和图标
 */
const ICONES = {
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
export const ICONES_FIX_TYPES = ICONES;
export const MENSAGENS_ERRO_FIX_TYPES = MENSAGENS_ERRO;
export const MENSAGENS_INICIO_FIX_TYPES = MENSAGENS_INICIO;
export const MENSAGENS_PROGRESSO_FIX_TYPES = MENSAGENS_PROGRESSO;
export const MENSAGENS_SUCESSO_FIX_TYPES = MENSAGENS_SUCESSO;

/**
 * 格式化不安全类型消息，包含图标和计数器
 */
export function formatarTipoInseguro(tipo: string, count: number): string {
  const icone = tipo.includes('any') ? ICONES_TIPOS.any : ICONES_TIPOS.unknown;
  const plural = count !== 1 ? 's' : '';
  return `${icone} ${tipo}: ${count} 处出现${plural}`;
}

/**
 * 格式化单个出现行
 */
export function formatarOcorrencia(relPath: string, linha: number | undefined): string {
  return `  ${ICONES.setinha} ${relPath}:${linha || '?'}`;
}

/**
 * 格式化带上下文的消息
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
 * 生成类别摘要文本
 */
export function gerarResumoCategoria(categoria: keyof typeof CATEGORIAS_TIPOS, count: number, total: number): string[] {
  const config = CATEGORIAS_TIPOS[categoria];
  const porcentagem = MENSAGENS_RESUMO.porcentagem(count, total);
  return [categoria === 'CORRIGIR' ? `${config.icone} ${config.nome}: ${porcentagem}` : categoria === 'MELHORAVEL' ? `${config.icone} ${config.nome}: ${porcentagem}` : `${config.icone} ${config.nome}: ${porcentagem}`, `   ${ICONES.setinha} ${config.descricao}`];
}

/**
 * 调试消息（仅在 DEV_MODE 中）
 */
export const DEPURACAO = {
  categorizacao: (arquivo: string, tipo: string, categoria: string) => `[DEBUG] ${arquivo} - ${tipo} → ${categoria}`,
  confianca: (tipo: string, valor: number) => `[DEBUG] ${tipo} 的置信度: ${valor}%`
} as const;
