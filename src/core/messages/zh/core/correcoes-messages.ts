// SPDX-License-Identifier: MIT
/**
 * 自动修复消息
 *
 * 集中所有与以下相关的消息：
 * - 快速修复 (fix-any-to-proper-type, fix-unknown, etc)
 * - 守护者 (imports, 结构, 类型)
 * - 自动修复
 */

import { buildTypesRelPathPosix, getTypesDirectoryDisplay } from '../../../config/conventions.js';
import { ICONES } from '../../shared/icons.js';

/**
 * 快速修复消息 - Any/Unknown
 */
export const MENSAGENS_CORRECAO_TIPOS = {
  fixAny: {
    title: '用安全类型替换any',
    get description() { return `分析any的使用并在${getTypesDirectoryDisplay()}中推断/创建正确类型` }
  },
  fixUnknown: {
    title: '用特定类型替换unknown',
    description: '检测type guards模式并创建专用类型'
  },
  validacao: {
    falha: (erros: string[]) => `验证失败: ${erros.join(', ')}`,
    reviewer: '请手动检查'
  },
  warnings: {
    confiancaBaixa: (confianca: number) => `不安全类型(any)置信度过低(${confianca}%)，无法自动修复`,
    confiancaMedia: (confianca: number, tipoSugerido: string) => `检测到不安全类型。建议: ${tipoSugerido} (置信度: ${confianca}%)`,
    unknownApropriado: 'unknown适用于此处(泛型输入或低置信度)',
    useTiposCentralizados: () => `使用专用目录中的集中类型 (${getTypesDirectoryDisplay()})`,
    criarTipoDedicado: (caminho: string) => `考虑在${buildTypesRelPathPosix(caminho)}中创建专用类型`,
    adicioneTypeGuards: () => `如可能，在${getTypesDirectoryDisplay()}中添加type guards或创建专用类型`
  },
  erros: {
    extrairNome: '无法提取变量名',
    variavelNaoUsada: '变量未使用 - 无法推断类型',
    analise: (erro: string) => `分析错误: ${erro}`
  }
} as const;

/**
 * 自动修复消息
 */
export const MENSAGENS_AUTOFIX = {
  iniciando: (modo: string) => `${ICONES.acao.correcao} 启动自动修复 (模式: ${modo})`,
  dryRun: `${ICONES.feedback.info} 试运行: 模拟修复(不会应用任何更改)`,
  applying: (count: number) => `应用${count}个修复...`,
  concluido: (aplicadas: number, falhas: number) => `${ICONES.nivel.sucesso} 自动修复完成: ${aplicadas}个已应用, ${falhas}个失败`,
  naoDisponivel: `${ICONES.feedback.info} 没有可用的自动修复`,
  flags: {
    fixSafe: `${ICONES.comando.guardian} 检测到--fix-safe标志: 启用保守模式`,
    requireMutateFS: `${ICONES.status.falha} 自动修复目前不可用`
  },
  logs: {
    modoConservador: `${ICONES.comando.guardian} 保守模式已激活 - 仅应用高置信度修复`,
    validacaoEslint: `${ICONES.acao.analise} 执行自动修复后的ESLint验证...`,
    arquivoMovido: (origem: string, destino: string) => `${ICONES.status.ok} 已移动: ${origem} → ${destino}`,
    arquivoRevertido: (origem: string, destino: string) => `↩️ 文件已还原: ${destino} → ${origem}`,
    arquivoRevertidoConteudo: (origem: string, destino: string) => `↩️ 文件已还原原始内容: ${destino} → ${origem}`
  },
  resultados: {
    sucesso: (count: number) => `${ICONES.status.ok} ${count}个文件已修复`,
    falhas: (count: number) => `${ICONES.status.falha} ${count}个文件出错`,
    erroArquivo: (arquivo: string, erro: string) => `${ICONES.status.falha} ${arquivo}: ${erro}`
  },
  dicas: {
    executarLint: `${ICONES.feedback.dica} 运行\`npm run lint\`验证修复`,
    executarBuild: `${ICONES.feedback.dica} 运行\`npm run build\`验证代码编译`,
    removerDryRun: `${ICONES.feedback.dica} 删除--dry-run以自动应用修复`,
    ajustarConfianca: `${ICONES.feedback.dica} 使用--confidence <num>���整阈值(当前: 85%)`
  }
} as const;

/**
 * 分析报告消息
 */
export const MENSAGENS_RELATORIOS_ANALISE = {
  asyncPatterns: {
    titulo: `${ICONES.relatorio.resumo} Async/Await模式分析`,
    padroes: `\n${ICONES.relatorio.resumo} 代码使用模式:`,
    recomendacoes: `\n${ICONES.feedback.dica} 修复建议:\n`,
    critico: `${ICONES.nivel.erro} 严重(立即审查):`,
    alto: `\n${ICONES.feedback.atencao} 高(在当前Sprint中审查):`,
    salvo: (caminho: string) => `${ICONES.nivel.sucesso} Async报告已保存: ${caminho}`
  },
  fixTypes: {
    analiseSalva: `${ICONES.arquivo.json} 详细分析已保存: .prometheus/fix-types-analise.json`,
    possibilidades: `└─ ${ICONES.acao.analise} 替代可能性:`,
    sugestao: (texto: string) => `└─ ${ICONES.feedback.dica} ${texto}`,
    exportado: `${ICONES.arquivo.doc} fix-types报告已导出:`
  },
  guardian: {
    baselineAceito: `${ICONES.status.ok} Guardian: 手动接受baseline (--accept)`,
    exportado: `${ICONES.arquivo.doc} Guardian报告已导出:`
  }
} as const;

/**
 * 原型消息
 */
export const MENSAGENS_ARQUETIPOS_HANDLER = {
  timeout: `${ICONES.feedback.atencao} 原型检测超时`,
  salvo: (caminho: string) => `${ICONES.status.ok} 自定义原型已保存${caminho}`,
  falha: `${ICONES.feedback.atencao} 通过原型生成计划失败`,
  falhaEstrategista: `${ICONES.feedback.atencao} 战略家建议计划失败`,
  falhaGeral: `${ICONES.feedback.atencao} 规划总体失败`
} as const;

/**
 * 插件消息
 */
export const MENSAGENS_PLUGINS = {
  registrado: (nome: string, extensoes: string[]) => `${ICONES.status.ok} 插件${nome}已注册，扩展名: ${extensoes.join(', ')}`,
  configAtualizada: `${ICONES.acao.correcao} 注册表配置已更新`,
  erroParsear: (linguagem: string, erro: string) => `${ICONES.feedback.atencao} 解析${linguagem}出错: ${erro}`
} as const;

/**
 * 执行器消息
 */
export const MENSAGENS_EXECUTOR = {
  analiseCompleta: (tecnica: string, arquivo: string, duracao: string) => `${ICONES.arquivo.arquivo} '${tecnica}' 分析了${arquivo}，耗时${duracao}`
} as const;

/**
 * 合并导出
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