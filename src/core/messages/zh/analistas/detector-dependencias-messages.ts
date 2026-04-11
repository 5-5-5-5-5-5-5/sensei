// SPDX-License-Identifier: MIT

/**
 * @fileoverview 依赖检测器的诊断消息。
 * 提供文本模板，用于检测外部依赖的 import/require、
 * 过长的相对路径、不存在的文件、混用 require/import、
 * 循环导入以及其他导入不良实践。
 */

export const DetectorDependenciasMensagens = {
  importDependenciaExterna: (val: string) => `导入外部依赖：'${val}'`,
  importRelativoLongo: (val: string) => `相对导入跨越过多目录：'${val}'`,
  importJsEmTs: (val: string) => `在 TypeScript 中导入 .js 文件：'${val}'`,
  importArquivoInexistente: (val: string) => `导入不存在的文件：'${val}'`,
  requireDependenciaExterna: (val: string) => `require 外部依赖：'${val}'`,
  requireRelativoLongo: (val: string) => `相对 require 跨越过多目录：'${val}'`,
  requireJsEmTs: (val: string) => `在 TypeScript 中 require .js 文件：'${val}'`,
  requireArquivoInexistente: (val: string) => `require 不存在的文件：'${val}'`,
  importUsadoRegistroDinamico: (nome: string) => `导入 '${nome}' 通过动态注册使用（启发式）`,
  usoMistoRequireImport: '在同一文件中混用 require 和 import。请统一为单一风格。',
  importCircularSelf: '检测到循环导入：文件导入了自身。',
  dependenciaCircular: (totalArquivos: number, caminhoCompleto: string) => `检测到循环依赖（${totalArquivos} 个文件）：${caminhoCompleto}`
} as const;
