// SPDX-License-Identifier: MIT
/**
 * 集中化上下文日志消息系统
 * 自动适应项目类型和复杂度
 */

import { ICONES_ACAO, ICONES_ARQUIVO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_FEEDBACK, ICONES_NIVEL, ICONES_RELATORIO, ICONES_STATUS } from '../../shared/icons.js';

export const LogMensagens = {
  sistema: {
    inicializacao: {
      sucesso: `${ICONES_FEEDBACK.foguete} Prometheus 初始化完成，耗时 {tempo}ms`,
      falha: `${ICONES_STATUS.falha} 初始化失败: {erro}`,
      configuracao: `${ICONES_ARQUIVO.config} 已加载配置: {fonte} ({campos} 个字段)`
    },
    shutdown: `${ICONES_STATUS.ok} 分析已正常完成`,
    atualizacao: {
      executando: `${ICONES_ACAO.import} 正在运行: {comando}`,
      sucesso: `${ICONES_STATUS.ok} 更新已成功完成！`,
      falha: `${ICONES_STATUS.falha} 更新已中止或失败。`,
      detalhes: `${ICONES_FEEDBACK.atencao} {detalhe}`
    },
    performance: {
      regressao_detectada: `${ICONES_FEEDBACK.atencao} 检测到回归超过 {limite}%。`,
      sem_regressoes: `${ICONES_STATUS.ok} 无显著回归。`
    },
    poda: {
      cancelada: `${ICONES_STATUS.falha} 已取消修剪。`,
      concluida: `${ICONES_STATUS.ok} 修剪已完成: 孤儿文件已成功移除！`
    },
    reversao: {
      nenhum_move: `${ICONES_STATUS.falha} 未找到文件的移动: {arquivo}`,
      revertendo: `${ICONES_COMANDO.reverter} 正在回退移动: {arquivo}`,
      sucesso: `${ICONES_STATUS.ok} 文件已成功回退: {arquivo}`,
      falha: `${ICONES_STATUS.falha} 回退文件失败: {arquivo}`
    },
    auto: {
      mapa_reversao: {
        erro_carregar: `${ICONES_STATUS.falha} 加载回退映射时出错: {erro}`,
        erro_salvar: `${ICONES_STATUS.falha} 保存回退映射时出错: {erro}`,
        move_nao_encontrado: `${ICONES_STATUS.falha} 未找到移动: {id}`,
        arquivo_destino_nao_encontrado: `${ICONES_STATUS.falha} 未找到目标文件: {destino}`,
        arquivo_existe_origem: `${ICONES_FEEDBACK.atencao} 文件在源位置已存在: {origem}`,
        erro_reverter: `${ICONES_STATUS.falha} 回退移动时出错: {erro}`,
        nenhum_move: `${ICONES_FEEDBACK.atencao} 未找到移动: {arquivo}`,
        revertendo_move: `${ICONES_COMANDO.reverter} 正在回退移动: {id}`,
        move_revertido: `${ICONES_STATUS.ok} 移动已成功回退: {id}`,
        falha_reverter_move: `${ICONES_STATUS.falha} 回退移动失败: {id}`,
        carregado: `${ICONES_RELATORIO.lista} 回退映射已加载: 已注册 {moves} 个移动`,
        nenhum_encontrado: `${ICONES_RELATORIO.lista} 未找到回退映射，正在创建新的`
      },
      poda: {
        nenhum_arquivo: `${ICONES_STATUS.ok} 本轮没有文件需要修剪。\n`,
        podando: `${ICONES_COMANDO.podar} 正在修剪 {quantidade} 个文件...`,
        podando_simulado: `${ICONES_COMANDO.podar} 正在修剪 {quantidade} 个文件... (模拟)`,
        arquivo_movido: `${ICONES_STATUS.ok} {arquivo} 已移至废弃目录。`
      },
      corretor: {
        erro_criar_diretorio: `${ICONES_STATUS.falha} 无法为 {destino} 创建目录: {erro}`,
        destino_existe: `${ICONES_FEEDBACK.atencao} 目标已存在: {arquivo} → {destino}`,
        erro_mover: `${ICONES_STATUS.falha} 通过重命名移动 {arquivo} 失败: {erro}`
      }
    },
    correcoes: {
      nenhuma_disponivel: `${ICONES_STATUS.ok} 没有可用的自动修正`,
      aplicando: `${ICONES_ACAO.correcao} 正在以 {modo} 模式应用自动修正...`,
      arquivo_nao_encontrado: `${ICONES_FEEDBACK.atencao} 未找到要修正的文件: {arquivo}`,
      aplicada: `${ICONES_STATUS.ok} {titulo} (置信度: {confianca}%)`,
      corrigido: `${ICONES_STATUS.ok} 已修复: {arquivo}`,
      falha: `${ICONES_FEEDBACK.atencao} 应用快速修复 {id} 失败: {erro}`,
      nenhuma_aplicada: `${ICONES_FEEDBACK.atencao} 无法应用任何修正`,
      estatisticas: `${ICONES_STATUS.ok} {estatisticas}`,
      eslint_harmonia: `${ICONES_STATUS.ok} ESLint 验证完成 - 保持一致`,
      eslint_ajustes: `${ICONES_STATUS.ok} ESLint 已应用额外调整以完全保持一致`,
      eslint_falha: `${ICONES_STATUS.falha} ESLint 验证失败: {erro}`
    },
    processamento: {
      fix_detectada: `${ICONES_ACAO.correcao} 检测到 --fix 标志: 正在启用自动修正`,
      eslint_output: `${ICONES_RELATORIO.lista} ESLint 输出: {output}`,
      resumo_ocorrencias: `${ICONES_DIAGNOSTICO.stats} {total} 个出现项摘要:`,
      dicas_contextuais: `${ICONES_FEEDBACK.dica} 上下文提示:`,
      detalhamento_ocorrencias: `${ICONES_DIAGNOSTICO.stats} {total} 个出现项详情:`,
      erros_criticos: `${ICONES_RELATORIO.error} 发现 {total} 个严重错误 - 请优先处理`,
      avisos_encontrados: `${ICONES_RELATORIO.warning} 发现 {total} 个警告`,
      quick_fixes_muitos: `${ICONES_ACAO.correcao} 有 {total} 个自动修正可用:`,
      quick_fixes_comando: '   → PROMETHEUS_ALLOW_MUTATE_FS=1 npm run diagnosticar --fix',
      quick_fixes_executar: '   (命令已就绪可运行)',
      todos_muitos: `${ICONES_RELATORIO.lista} 发现 {total} 个 TODO - 建议使用 --include 聚焦特定区域`,
      todos_poucos: `${ICONES_RELATORIO.lista} 发现 {total} 个 TODO - 控制良好！`,
      muitas_ocorrencias: `${ICONES_FEEDBACK.atencao} 出现项过多 - 建议使用 --executive 获取高级视图`,
      filtrar_pasta: `${ICONES_ARQUIVO.diretorio} 或按文件夹过滤: --include "src/cli" 或 --include "src/analistas"`,
      usar_full: `${ICONES_DIAGNOSTICO.completo} 使用 --full 获取完整详情`,
      usar_json: `${ICONES_ARQUIVO.json} 使用 --json 获取结构化输出 (CI/脚本)`,
      projeto_limpo: `${ICONES_STATUS.ok} 项目干净！使用 --guardian-check 进行完整性验证`,
      analistas_problemas: `${ICONES_DIAGNOSTICO.inicio} 发现问题的分析员: {quantidade}`
    }
  },
  scanner: {
    inicio: `${ICONES_DIAGNOSTICO.inicio} 开始扫描: {diretorio}`,
    progresso: `${ICONES_ARQUIVO.diretorio} 正在扫描: {diretorio} ({arquivos} 个文件)`,
    filtros: `${ICONES_DIAGNOSTICO.stats} 已应用过滤器: {include} 个包含, {exclude} 个排除`,
    completo: `${ICONES_STATUS.ok} 扫描完成: {diretorios} 个目录中的 {arquivos} 个文件`
  },
  analistas: {
    execucao: {
      // 小型项目的简单日志
      inicio_simples: `${ICONES_DIAGNOSTICO.inicio} 正在分析 {arquivo}`,
      sucesso_simples: `${ICONES_STATUS.ok} {arquivo}: {ocorrencias} 个问题`,
      // 大型项目的详细日志
      inicio_detalhado: `${ICONES_DIAGNOSTICO.inicio} 在 {arquivo} ({tamanho}kb) 上运行 '{analista}'`,
      sucesso_detalhado: `${ICONES_STATUS.ok} '{analista}' 完成: {ocorrencias} 个出现项 (${tempo}ms)`,
      timeout: `${ICONES_FEEDBACK.atencao} 分析员 '{analista}' 超时，已耗时 {tempo}ms`,
      erro: `${ICONES_STATUS.falha} 分析员 '{analista}' 出错: {erro}`,
      skip: `${ICONES_STATUS.pulado} 跳过 '{arquivo}' (被配置抑制)`
    },
    metricas: {
      performance: `${ICONES_DIAGNOSTICO.stats} 性能: {analistas} 个分析员，平均 {media}ms/文件`,
      cache_hit: `${ICONES_DIAGNOSTICO.rapido} 缓存命中: {hits}/{total} ({percentual}%)`,
      worker_pool: `${ICONES_STATUS.executando} Worker 池: {ativos}/{total} 个活跃 worker`
    }
  },
  filtros: {
    incluindo: ` ${ICONES_ACAO.criar} 正在包含: {模式} ({matches} 个文件)`,
    excluindo: ` ${ICONES_ACAO.deletar} 正在排除: {模式} ({matches} 个文件)`,
    supressao: `${ICONES_STATUS.pausado} 已抑制 {count} 个出现项: {motivo}`,
    cli_override: `${ICONES_DIAGNOSTICO.stats} CLI 覆盖: {tipo} 个模式覆盖配置`
  },
  projeto: {
    detectado: `${ICONES_RELATORIO.lista} 检测到项目: {tipo} (置信度 {confianca}%)`,
    estrutura: `${ICONES_DIAGNOSTICO.stats} 结构: {arquivos} 个文件, {linguagens} 种语言`,
    complexidade: `${ICONES_DIAGNOSTICO.stats} 复杂度: {nivel} (基于 {metricas})`,
    recomendacao: `${ICONES_FEEDBACK.dica} 建议: 对此类项目建议 {acao}`
  },
  contexto: {
    desenvolvedor_novo: `${ICONES_FEEDBACK.info} 检测到简单项目 - 已启用简化日志`,
    equipe_experiente: `${ICONES_FEEDBACK.info} 检测到企业项目 - 已启用详细日志`,
    ci_cd: `${ICONES_FEEDBACK.info} 检测到 CI/CD 环境 - 已启用结构化日志`,
    debug_mode: `${ICONES_FEEDBACK.info} 调试模式已激活 - 已启用详细日志`
  },
  ocorrencias: {
    critica: `${ICONES_NIVEL.critico} 严重: {mensagem} 位于 {arquivo}:{linha}`,
    aviso: `${ICONES_NIVEL.aviso} 警告: {mensagem} ({categoria})`,
    info: `${ICONES_NIVEL.info} 信息: {mensagem}`,
    sugestao: `${ICONES_FEEDBACK.dica} 建议: {mensagem} - {acao_sugerida}`
  },
  relatorio: {
    resumo: `${ICONES_DIAGNOSTICO.stats} 摘要: {total} 个问题 ({criticos} 个严重, {avisos} 个警告)`,
    categorias: `${ICONES_RELATORIO.lista} 前列: {top_categorias}`,
    arquivo_problema: `${ICONES_FEEDBACK.atencao} 问题最多: {arquivo} ({count} 个出现项)`,
    tendencia: `${ICONES_DIAGNOSTICO.stats} 趋势: 与基线相比 {direcao}`,
    repositorio_impecavel: '无可挑剔的仓库',
    ocorrencias_encontradas: '发现 {total} 个出现项',
    fim_padroes_uso: `\n${ICONES_STATUS.ok} 使用模式报告结束。\n`,
    funcoes_longas: `${ICONES_FEEDBACK.atencao} 发现过长的函数:`
  },
  conselheiro: {
    volume_alto: `${ICONES_FEEDBACK.info} 任务量很大？代码不会跑，但人会累垮。`,
    respira: `${ICONES_FEEDBACK.info} 嘿，简单说一下: 深呼吸一下。`,
    cuidado: `${ICONES_FEEDBACK.info} 照顾好自己: 喝点水，伸个懒腰，闭眼 5 分钟。我们稍后继续。\n`,
    madrugada: `${ICONES_FEEDBACK.atencao} 已经过了 {hora} 了。代码明天再编译也行；你现在先休息。`
  },
  guardian: {
    integridade_ok: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.ok} guardian: 完整性保持。`,
    baseline_criado: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.info} guardian 基线已创建。`,
    baseline_aceito: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} guardian: 新基线已接受 — 请重新运行。`,
    alteracoes_detectadas: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.erro} guardian: 检测到可疑更改！建议运行 'prometheus guardian --diff'。`,
    bloqueado: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.falha} guardian 已阻止: 可疑更改或致命错误。`,
    modo_permissivo: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} 宽松模式: 继续操作，风险自负。`,
    scan_only: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.info} 仅扫描模式: 已映射 {arquivos} 个文件。`,
    avisos_encontrados: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} 存在警告级别的出现项`,
    // Guardian 命令
    full_scan_aviso: `${ICONES_NIVEL.aviso} --full-scan 已激活: 扩展范围的基线将不会持久化。`,
    full_scan_warning_baseline: `${ICONES_NIVEL.aviso} --full-scan 已激活，但将创建临时扩展范围的基线。`,
    aceitando_baseline: `\n${ICONES_COMANDO.atualizar} 正在接受新的完整性基线...\n`,
    baseline_aceito_sucesso: `${ICONES_STATUS.ok} 新完整性基线已成功接受！`,
    comparando_integridade: `\n${ICONES_DIAGNOSTICO.stats} 正在将 Prometheus 完整性与基线进行比较...\n`,
    diferencas_detectadas: `${ICONES_RELATORIO.error} 检测到差异:`,
    diferenca_item: '  - {diferenca}',
    comando_diff_recomendado: '使用 --diff 运行以显示详细差异，或使用 --accept 接受新基线。',
    integridade_preservada: `${ICONES_STATUS.ok} 未检测到差异。完整性保持。`,
    verificando_integridade: `\n${ICONES_DIAGNOSTICO.guardian} 正在检查 Prometheus 完整性...\n`,
    baseline_criado_console: `${ICONES_DIAGNOSTICO.guardian} guardian 基线已创建`,
    baseline_atualizado: `${ICONES_DIAGNOSTICO.guardian} 基线已更新并接受`,
    alteracoes_suspeitas: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.erro} 检测到可疑更改！`,
    erro_guardian: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.falha} guardian 错误: {erro}`
  },
  metricas: {
    execucoes_registradas: `\n${ICONES_DIAGNOSTICO.stats} 已记录的执行次数: {quantidade}`,
    nenhum_historico: '尚未找到指标历史数据。请使用 --metricas 运行诊断。'
  },
  auto: {
    plugin_ignorado: `${ICONES_NIVEL.aviso} 插件已忽略 ({plugin}): {erro}`,
    caminho_nao_resolvido: `${ICONES_NIVEL.aviso} 插件路径未解析: {plugin}`,
    plugin_falhou: `${ICONES_STATUS.falha} 插件失败: {plugin} — {erro}`,
    move_removido: `${ICONES_ACAO.deletar} 已从映射中移除移动: {id}`
  },
  core: {
    parsing: {
      erro_babel: `${ICONES_NIVEL.aviso} Babel 解析错误，文件 {arquivo}: {erro}`,
      erro_ts: `${ICONES_NIVEL.aviso} TS 编译器解析错误，文件 {arquivo}: {erro}`,
      erro_xml: `${ICONES_NIVEL.aviso} XML 解析错误，文件 {arquivo}: {erro}`,
      erro_html: `${ICONES_NIVEL.aviso} HTML 解析错误，文件 {arquivo}: {erro}`,
      erro_css: `${ICONES_NIVEL.aviso} CSS 解析错误，文件 {arquivo}: {erro}`,
      nenhum_parser: `${ICONES_NIVEL.aviso} 扩展 {extensao} 没有可用的解析器`,
      timeout_parsing: `${ICONES_NIVEL.aviso} 扩展 {extensao} 解析超时，已超过 {timeout}ms`,
      plugin_nao_encontrado: `${ICONES_NIVEL.aviso} 未找到 {extensao} 的插件，使用遗留系统`,
      sistema_plugins_falhou: `${ICONES_STATUS.falha} 插件系统失败: {erro}，使用遗留系统`,
      plugins_registrados: `${ICONES_DIAGNOSTICO.inicio} 系统中已注册的默认插件`,
      usando_plugin: `${ICONES_DIAGNOSTICO.inicio} 正在为 {extensao} 使用插件 '{nome}'`
    },
    plugins: {
      erro_carregar: `${ICONES_STATUS.falha} 加载插件 {nome} 时出错: {erro}`,
      tentando_autoload: `${ICONES_DIAGNOSTICO.inicio} 正在尝试自动加载扩展 {extensao}`,
      autoload_falhou: `${ICONES_STATUS.falha} {nome} 自动加载失败`,
      extensao_nao_suportada: `${ICONES_NIVEL.aviso} 核心插件不支持扩展 {extensao}`,
      registrando: `${ICONES_DIAGNOSTICO.inicio} 正在注册插件: {nome} v{versao}`
    },
    executor: {
      reaproveitado_incremental: `${ICONES_DIAGNOSTICO.rapido} 已复用 {arquivo} (增量)`
    }
  }
} as const;

/**
 * 适应不同项目类型的上下文配置
 */
export const LogContextConfiguracao = {
  // 简单项目: 文件少，一个开发者
  simples: {
    nivel_detalhamento: 'basico',
    mostrar_performance: false,
    mostrar_cache: false,
    mostrar_workers: false,
    formato_arquivo: 'nome_apenas',
    // 仅文件名，不含完整路径
    agrupar_ocorrencias: true
  },
  // 中等项目: 小团队，多种语言
  medio: {
    nivel_detalhamento: 'moderado',
    mostrar_performance: true,
    mostrar_cache: false,
    mostrar_workers: false,
    formato_arquivo: 'relativo',
    // 相对路径
    agrupar_ocorrencias: true
  },
  // 复杂项目: 大团队，CI/CD，多模块
  complexo: {
    nivel_detalhamento: 'completo',
    mostrar_performance: true,
    mostrar_cache: true,
    mostrar_workers: true,
    formato_arquivo: 'completo',
    // 完整路径 + 元数据
    agrupar_ocorrencias: false
  },
  // CI/CD 环境: 结构化日志，无颜色
  ci: {
    nivel_detalhamento: 'estruturado',
    mostrar_performance: true,
    mostrar_cache: true,
    mostrar_workers: true,
    formato_arquivo: 'relativo',
    agrupar_ocorrencias: false,
    formato_saida: 'json_lines'
  }
} as const;
