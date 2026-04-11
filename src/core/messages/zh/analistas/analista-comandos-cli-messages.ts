// SPDX-License-Identifier: MIT

/**
 * @fileoverview CLI 命令分析器的诊断消息。
 * 提供文本模板，用于检测重复命令、匿名处理程序、
 * 缺少错误处理以及 CLI 命令文件中的其他不良实践。
 */

function comandoLabel(comandoNome?: string): string {
  return comandoNome ? ` "${comandoNome}"` : "";
}
export const ComandosCliMensagens = {
  padraoAusente: '可能检测到未注册的命令文件。如果此文件应包含命令，请考虑使用 "onCommand"、"registerCommand" 或框架特定方法（如 Discord.js 的 SlashCommandBuilder）。',
  comandosDuplicados: (duplicados: string[]) => `检测到重复命令：${[...new Set(duplicados)].join(", ")}`,
  handlerAnonimo: (comandoNome: string) => `命令 "${comandoNome}" 的处理程序是匿名函数。建议使用命名函数以便于调试和追踪。`,
  handlerMuitosParametros: (comandoNome: string | undefined, paramContagem: number) => `命令${comandoLabel(comandoNome)} 的处理程序参数过多（${paramContagem}个）。请考虑简化接口。`,
  handlerMuitoLongo: (comandoNome: string | undefined, statements: number) => `命令${comandoLabel(comandoNome)} 的处理程序过长（${statements} 条语句）。请考虑提取辅助函数。`,
  handlerSemTryCatch: (comandoNome: string | undefined) => `命令${comandoLabel(comandoNome)} 的处理程序缺少 try/catch 块。建议显式处理错误。`,
  handlerSemFeedback: (comandoNome: string | undefined) => `命令${comandoLabel(comandoNome)} 的处理程序既没有日志记录也没有响应用户。请考虑添加反馈/日志。`,
  multiplosComandos: (count: number) => `此文件中注册了多个命令（${count}个）。请考虑将每个命令拆分到独立模块中以便于维护。`
} as const;
