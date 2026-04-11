// SPDX-License-Identifier: MIT
// @prometheus-disable tipo-literal-inline-complexo
// Justification: inline types for caretaker messages

import { ICONES_ACAO, ICONES_STATUS, ICONES_ZELADOR as ICONES_ZELADOR_CENTRAL } from '../../shared/icons.js';
/**
 * 管理员消息
 *
 * 集中化所有与管理员 (自动修复) 相关的消息
 * 包括: 导入、类型、结构等。
 */

/**
 * 管理员使用的图标和表情
 */
const ICONES_ZELADOR = {
  ...ICONES_ZELADOR_CENTRAL
} as const;

/**
 * 导入管理员消息
 */
export const MENSAGENS_IMPORTS = {
  titulo: `${ICONES_ACAO.correcao} 导入管理员 - 开始修复...`,
  resumo: `${ICONES_ZELADOR.resumo} 摘要:`,
  dryRunAviso: `${ICONES_ZELADOR.dryRun} Dry-run 模式: 未修改任何文件`,
  sucessoFinal: `${ICONES_STATUS.ok} 修复已成功应用！`
} as const;

/**
 * 导入管理员进度消息
 */
export const PROGRESSO_IMPORTS = {
  diretorioNaoEncontrado: (dir: string) => `${ICONES_ZELADOR.aviso} 未找到目录: ${dir}`,
  arquivoProcessado: (arquivo: string, count: number) => `${ICONES_ZELADOR.sucesso} ${arquivo} (${count} 个修复)`,
  arquivoErro: (arquivo: string, erro: string) => `${ICONES_ZELADOR.erro} ${arquivo}: ${erro}`,
  lendoDiretorio: `正在读取目录: `
} as const;

/**
 * 导入管理员错误消息
 */
export const ERROS_IMPORTS = {
  lerDiretorio: (dir: string, error: unknown) => {
    const mensagem = error instanceof Error ? error.message : String(error);
    return `读取目录 ${dir} 时出错: ${mensagem}`;
  },
  processar: (arquivo: string, error: unknown) => {
    const mensagem = error instanceof Error ? error.message : String(error);
    return `处理 ${arquivo} 时出错: ${mensagem}`;
  }
} as const;

/**
 * 格式化统计行
 */
export function formatarEstatistica(label: string, valor: number | string, icone?: string): string {
  const prefixo = icone ? `${icone} ` : '   ';
  return `${prefixo}${label}: ${valor}`;
}

/**
 * 生成导入修复摘要
 */
export function gerarResumoImports(stats: {
  processados: number;
  modificados: number;
  totalCorrecoes: number;
  erros: number;
  dryRun: boolean;
}): string[] {
  const linhas: string[] = ['', MENSAGENS_IMPORTS.resumo, formatarEstatistica('已处理文件', stats.processados), formatarEstatistica('已修改文件', stats.modificados), formatarEstatistica('修复总计', stats.totalCorrecoes)];
  if (stats.erros > 0) {
    linhas.push(formatarEstatistica('错误', stats.erros, ICONES_ZELADOR.aviso));
  }
  linhas.push('');
  if (stats.dryRun) {
    linhas.push(MENSAGENS_IMPORTS.dryRunAviso);
  } else {
    linhas.push(MENSAGENS_IMPORTS.sucessoFinal);
  }
  return linhas;
}

/**
 * 类型管理员消息 (未来)
 */
export const MENSAGENS_TIPOS = {
  titulo: `${ICONES_ACAO.correcao} 类型管理员 - 开始修复...`,
  analisandoTipo: (tipo: string) => `正在分析类型: ${tipo}`,
  tipoCorrigido: (antes: string, depois: string) => `已修复: ${antes} → ${depois}`
} as const;

/**
 * 结构管理员消息 (未来)
 */
export const MENSAGENS_ESTRUTURA = {
  titulo: `${ICONES_ACAO.organizacao} 结构管理员 - 正在重新组织文件...`,
  movendo: (origem: string, destino: string) => `正在移动: ${origem} → ${destino}`,
  criandoDiretorio: (dir: string) => `正在创建目录: ${dir}`
} as const;

/**
 * 通用管理员消息
 */
export const MENSAGENS_ZELADOR_GERAL = {
  iniciando: (zelador: string) => `${ICONES_ZELADOR.inicio} ${zelador} - 正在启动...`,
  concluido: (zelador: string) => `${ICONES_ZELADOR.sucesso} ${zelador} - 已完成！`,
  erro: (zelador: string, mensagem: string) => `${ICONES_ZELADOR.erro} ${zelador} - 错误: ${mensagem}`
} as const;

/**
 * 不同模式的输出模板
 */
export const MODELOS_SAIDA = {
  compacto: {
    inicio: (nome: string) => `${ICONES_ZELADOR.inicio} ${nome}`,
    progresso: (atual: number, total: number) => `[${atual}/${total}]`,
    fim: (sucesso: boolean) => sucesso ? ICONES_ZELADOR.sucesso : ICONES_ZELADOR.erro
  },
  detalhado: {
    inicio: (nome: string, descricao: string) => `${ICONES_ZELADOR.inicio} ${nome}\n   ${descricao}`,
    progresso: (arquivo: string, atual: number, total: number) => `   [${atual}/${total}] ${arquivo}`,
    fim: (stats: {
      sucesso: number;
      falha: number;
    }) => `\n${ICONES_ZELADOR.resumo} 成功: ${stats.sucesso}, 失败: ${stats.falha}`
  }
} as const;

/**
 * 管理员退出码
 */
export const SAIDA_CODIGOS = {
  SUCESSO: 0,
  ERRO_GERAL: 1,
  ERRO_ARQUIVO: 2,
  ERRO_PERMISSAO: 3,
  CANCELADO_USUARIO: 4
} as const;

/**
 * 格式化修改文件列表
 */
export function formatarListaArquivos(arquivos: string[], maxExibir: number = 10): string[] {
  const linhas: string[] = [];
  const mostrar = arquivos.slice(0, maxExibir);
  for (const arquivo of mostrar) {
    linhas.push(`   ${ICONES_ZELADOR.arquivo} ${arquivo}`);
  }
  const restantes = arquivos.length - maxExibir;
  if (restantes > 0) {
    linhas.push(`   ... 还有 ${restantes} 个文件`);
  }
  return linhas;
}

/**
 * 格式化执行耗时
 */
export function formatarDuracao(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  const minutos = Math.floor(ms / 60000);
  const segundos = Math.floor(ms % 60000 / 1000);
  return `${minutos}分 ${segundos}秒`;
}

/**
 * 格式化带时间戳的消息
 */
export function formatarComTimestamp(mensagem: string): string {
  const timestamp = new Date().toISOString().substring(11, 19); // HH:MM:SS
  return `[${timestamp}] ${mensagem}`;
}
