// SPDX-License-Identifier: MIT
// @prometheus-disable tipo-literal-inline-complexo
// Justification: inline types for suggestion system
/**
 * 集中化建议与提示系统
 *
 * 集中化 Prometheus 的所有上下文建议:
 * - 命令使用提示
 * - 基于上下文的建议
 * - 快速帮助消息
 * - 不同场景的号召性用语
 */

import { ICONES } from '../../shared/icons.js';

/**
 * 通用命令建议
 */
export const SUGESTOES_COMANDOS = {
  usarFull: `${ICONES.feedback.dica} 使用 --full 获取包含所有信息的详细报告`,
  usarJson: `${ICONES.feedback.dica} 使用 --json 获取结构化 JSON 输出`,
  combinarJsonExport: `${ICONES.feedback.dica} 将 --json 与 --export 结合以保存报告`,
  usarExport: `${ICONES.feedback.dica} 使用 --export <path> 将报告保存到文件`,
  usarInclude: `${ICONES.feedback.dica} 使用 --include <模式> 聚焦特定文件`,
  usarExclude: `${ICONES.feedback.dica} 使用 --exclude <模式> 忽略文件`,
  usarDryRun: `${ICONES.feedback.dica} 使用 --dry-run 进行模拟而不修改文件`,
  removerDryRun: `${ICONES.feedback.dica} 移除 --dry-run 以应用修复`,
  usarInterativo: `${ICONES.feedback.dica} 使用 --interactive 确认每个修复`,
  usarGuardian: `${ICONES.feedback.dica} 使用 --guardian 验证完整性`,
  usarBaseline: `${ICONES.feedback.dica} 使用 --baseline 生成参考基线`,
  usarAutoFix: `${ICONES.feedback.dica} 使用 --auto-fix 应用自动修复`,
} as const;

/**
 * 诊断建议
 */
export const SUGESTOES_DIAGNOSTICO = {
  modoExecutivo: `${ICONES.diagnostico.executive} 执行模式: 仅显示严重问题`,
  primeiraVez: [
    `${ICONES.feedback.dica} 第一次使用？从以下开始: prometheus diagnosticar --full`,
    `${ICONES.feedback.dica} 使用 --help 查看所有可用选项`,
  ],
  projetoGrande: [
    `${ICONES.feedback.dica} 检测到大型项目 - 使用 --include 进行增量分析`,
    `${ICONES.feedback.dica} 使用 --quick 进行快速初始分析`,
  ],
  poucoProblemas: `${ICONES.nivel.sucesso} 项目状况良好！仅发现 {count} 个小问题。`,
  muitosProblemas: [
    `${ICONES.feedback.atencao} 发现许多问题 - 请优先处理严重问题`,
    `${ICONES.feedback.dica} 使用 --executive 仅关注必要内容`,
  ],
  usarFiltros: `${ICONES.feedback.dica} 使用 --include/--exclude 过滤器进行聚焦分析`,
} as const;

/**
 * 自动修复建议
 */
export const SUGESTOES_AUTOFIX = {
  autoFixDisponivel: `${ICONES.feedback.dica} 有自动修复可用 - 使用 --auto-fix`,
  autoFixAtivo: `${ICONES.feedback.atencao} 自动修复已激活！使用 --dry-run 进行模拟而不修改文件`,
  dryRunRecomendado: `${ICONES.feedback.dica} 建议: 先用 --dry-run 测试`,
  semMutateFS: `${ICONES.feedback.atencao} 自动修复当前不可用`,
  validarDepois: [
    `${ICONES.feedback.dica} 运行 npm run lint 验证修复`,
    `${ICONES.feedback.dica} 运行 npm run build 检查代码是否可编译`,
    `${ICONES.feedback.dica} 运行 npm test 验证功能`,
  ],
} as const;

/**
 * Guardian 建议
 */
export const SUGESTOES_GUARDIAN = {
  guardianDesabilitado: `${ICONES.comando.guardian} guardian 已禁用。使用 --guardian 验证完整性`,
  primeiroBaseline: [
    `${ICONES.feedback.dica} 首次运行: 使用 --baseline 生成基线`,
    `${ICONES.feedback.dica} 基线可作为未来更改的参考`,
  ],
  driftDetectado: [
    `${ICONES.feedback.atencao} 检测到与基线相比有更改`,
    `${ICONES.feedback.dica} 在更新基线之前请审查这些更改`,
    `${ICONES.feedback.dica} 使用 --baseline 更新参考`,
  ],
  integridadeOK: `${ICONES.nivel.sucesso} 完整性已验证 - 未检测到未经授权的更改`,
} as const;

/**
 * 类型建议 (fix-types)
 */
export const SUGESTOES_TIPOS = {
  ajustarConfianca: (atual: number) =>
    `${ICONES.feedback.dica} 使用 --confidence <num> 调整阈值 (当前: ${atual}%)`,
  revisar: (categoria: string) =>
    `${ICONES.feedback.dica} 手动审查 ${categoria} 案例`,
  anyEncontrado: [
    `${ICONES.feedback.atencao} 检测到 'any' 类型 - 它们会降低代码安全性`,
    `${ICONES.feedback.dica} 优先替换 'as any' 和显式转换`,
  ],
  unknownLegitimo: `${ICONES.nivel.sucesso} 已识别 'unknown' 的合法用法`,
  melhoravelDisponivel: `${ICONES.feedback.dica} 发现可改进案例 - 请在未来重构期间审查`,
} as const;

/**
 * 原型建议
 */
export const SUGESTOES_ARQUETIPOS = {
  monorepo: [
    `${ICONES.feedback.dica} 检测到 Monorepo: 考虑使用工作区过滤器`,
    `${ICONES.feedback.dica} 使用 --include packages/* 分析特定工作区`,
  ],
  biblioteca: [
    `${ICONES.feedback.dica} 检测到库: 聚焦公共导出和文档`,
    `${ICONES.feedback.dica} 使用 --guardian 验证公共 API`,
  ],
  cli: [
    `${ICONES.feedback.dica} 检测到 CLI: 优先测试命令和标志`,
    `${ICONES.feedback.dica} 验证命令中的错误处理`,
  ],
  api: [
    `${ICONES.feedback.dica} 检测到 API: 聚焦端点和契约`,
    `${ICONES.feedback.dica} 考虑为路由集成测试`,
    `${ICONES.feedback.dica} 验证 API 文档 (OpenAPI/Swagger)`,
  ],
  frontend: [
    `${ICONES.feedback.dica} 检测到前端: 优先组件和状态管理`,
    `${ICONES.feedback.dica} 验证可访问性和性能`,
  ],
  confiancaBaixa: [
    `${ICONES.feedback.atencao} 检测置信度较低: 结构可能是混合的`,
    `${ICONES.feedback.dica} 使用 --criar-arquetipo --salvar-arquetipo 进行自定义`,
  ],
} as const;

/**
 * 重构建议
 */
export const SUGESTOES_REESTRUTURAR = {
  backupRecomendado: [
    `${ICONES.feedback.importante} 重要: 在重构之前请备份！`,
    `${ICONES.feedback.dica} 使用 git 在结构更改之前进行版本控制`,
  ],
  validarDepois: [
    `${ICONES.feedback.dica} 重构后运行测试`,
    `${ICONES.feedback.dica} 验证导入和引用`,
  ],
  usarDryRun: `${ICONES.feedback.dica} 第一次使用？使用 --dry-run 查看建议的更改`,
} as const;

/**
 * 修剪建议
 */
export const SUGESTOES_PODAR = {
  cuidado: [
    `${ICONES.feedback.atencao} 修剪会永久删除文件！`,
    `${ICONES.feedback.importante} 请确保有备份或版本控制`,
  ],
  revisar: `${ICONES.feedback.dica} 在确认之前请审查文件列表`,
  usarDryRun: `${ICONES.feedback.dica} 使用 --dry-run 模拟修剪而不删除`,
} as const;

/**
 * 指标建议
 */
export const SUGESTOES_METRICAS = {
  baseline: [
    `${ICONES.feedback.dica} 生成基线以用于未来比较`,
    `${ICONES.feedback.dica} 使用 --json 集成 CI/CD`,
  ],
  tendencias: `${ICONES.feedback.dica} 定期运行以跟踪趋势`,
  comparacao: `${ICONES.feedback.dica} 与之前的运行进行比较`,
} as const;

/**
 * 管理员建议
 */
export const SUGESTOES_ZELADOR = {
  imports: [
    `${ICONES.feedback.dica} 导入管理员自动修复路径`,
    `${ICONES.feedback.dica} 使用 --dry-run 查看建议修复`,
  ],
  estrutura: [
    `${ICONES.feedback.dica} 结构管理员按模式组织文件`,
    `${ICONES.feedback.dica} 在 prometheus.config.json 中配置模式`,
  ],
} as const;

/**
 * 上下文建议 - 辅助函数
 */
export function gerarSugestoesContextuais(contexto: {
  comando: string;
  temProblemas: boolean;
  countProblemas?: number;
  autoFixDisponivel?: boolean;
  guardianAtivo?: boolean;
  arquetipo?: string;
  flags?: string[];
}): string[] {
  const sugestoes: string[] = [];

  // 按命令的建议
  switch (contexto.comando) {
    case 'diagnosticar':
      if (!contexto.temProblemas) {
        if (contexto.countProblemas !== undefined) {
          sugestoes.push(
            SUGESTOES_DIAGNOSTICO.poucoProblemas.replace(
              '{count}',
              String(contexto.countProblemas),
            ),
          );
        }
      } else if (contexto.countProblemas && contexto.countProblemas > 50) {
        sugestoes.push(...SUGESTOES_DIAGNOSTICO.muitosProblemas);
      }

      if (
        contexto.autoFixDisponivel &&
        !contexto.flags?.includes('--auto-fix')
      ) {
        sugestoes.push(SUGESTOES_AUTOFIX.autoFixDisponivel);
      }

      if (!contexto.guardianAtivo && !contexto.flags?.includes('--guardian')) {
        sugestoes.push(SUGESTOES_GUARDIAN.guardianDesabilitado);
      }

      if (!contexto.flags?.includes('--full') && contexto.temProblemas) {
        sugestoes.push(SUGESTOES_COMANDOS.usarFull);
      }
      break;

    case 'fix-types':
      if (contexto.autoFixDisponivel) {
        sugestoes.push(...SUGESTOES_AUTOFIX.validarDepois);
      }
      break;

    case 'reestruturar':
      sugestoes.push(...SUGESTOES_REESTRUTURAR.backupRecomendado);
      if (!contexto.flags?.includes('--dry-run')) {
        sugestoes.push(SUGESTOES_REESTRUTURAR.usarDryRun);
      }
      break;

    case 'podar':
      sugestoes.push(...SUGESTOES_PODAR.cuidado);
      break;
  }

  // 按原型的建议
  if (contexto.arquetipo) {
    switch (contexto.arquetipo) {
      case 'monorepo':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.monorepo);
        break;
      case 'biblioteca':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.biblioteca);
        break;
      case 'cli':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.cli);
        break;
      case 'api':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.api);
        break;
      case 'frontend':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.frontend);
        break;
    }
  }

  return sugestoes;
}

/**
 * 格式化建议以显示
 */
export function formatarSugestoes(
  sugestoes: string[],
  titulo = '建议',
): string[] {
  if (sugestoes.length === 0) return [];

  const linhas: string[] = ['', `┌── ${titulo} ${'─'.repeat(50)}`.slice(0, 70)];

  for (const sugestao of sugestoes) {
    linhas.push(`  ${sugestao}`);
  }

  linhas.push(`└${'─'.repeat(68)}`);
  linhas.push('');

  return linhas;
}

/**
 * 集中化导出
 */
export const SUGESTOES = {
  comandos: SUGESTOES_COMANDOS,
  diagnostico: SUGESTOES_DIAGNOSTICO,
  autofix: SUGESTOES_AUTOFIX,
  guardian: SUGESTOES_GUARDIAN,
  tipos: SUGESTOES_TIPOS,
  arquetipos: SUGESTOES_ARQUETIPOS,
  reestruturar: SUGESTOES_REESTRUTURAR,
  podar: SUGESTOES_PODAR,
  metricas: SUGESTOES_METRICAS,
  zelador: SUGESTOES_ZELADOR,
} as const;
