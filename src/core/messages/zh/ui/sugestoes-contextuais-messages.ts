// SPDX-License-Identifier: MIT

/**
 * @fileoverview 用户界面上下文提示消息。
 * 提供带图标的文本模板，用于项目识别反馈、
 * 依赖证据、导入、代码模式、
 * 目录结构和替代技术。
 */

import { ICONES_ACAO, ICONES_ARQUIVO, ICONES_FEEDBACK } from '../../shared/icons.js';

export const SugestoesContextuaisMensagens = {
  arquetipoNaoIdentificado: '无法识别特定的原型。考虑为项目添加更多结构。',
  projetoIdentificado: (tecnologia: string | undefined, confiancaPercent: number) => `${ICONES_FEEDBACK.info} 项目识别为: ${tecnologia} (置信度: ${confiancaPercent}%)`,
  evidenciaDependencia: (dependencia: string, tecnologia: string | undefined) => `${ICONES_ARQUIVO.package} 依赖 ${dependencia} 确认项目 ${tecnologia}`,
  evidenciaImport: (valor: string, localizacao: string | undefined) => `${ICONES_ACAO.import} 在 ${localizacao} 检测到导入 ${valor}`,
  evidenciaCodigo: (localizacao: string | undefined) => `${ICONES_ARQUIVO.codigo} 在 ${localizacao} 检测到特定代码模式`,
  evidenciaEstrutura: (valor: string, tecnologia: string | undefined) => `${ICONES_ARQUIVO.diretorio} 结构 ${valor} 是 ${tecnologia} 的典型特征`,
  tecnologiasAlternativas: (alternativas: string) => `${ICONES_ACAO.analise} 检测到其他技术: ${alternativas}`,
  erroAnaliseContextual: (erro: string) => `上下文分析出错: ${erro}`,
  erroDuranteAnalise: '智能上下文分析期间发生错误'
} as const;
