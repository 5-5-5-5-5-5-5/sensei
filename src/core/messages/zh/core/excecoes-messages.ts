// SPDX-License-Identifier: MIT

/**
 * @fileoverview Prometheus 核心的异常和错误消息。
 * 集中化与 CLI、插件、分析员、
 * 验证、安全、持久化、模式、扫描器、回滚和报告相关的错误字符串。
 */

export const ExcecoesMensagens = {
  // CLI
  exit1: 'exit:1',
  requireMutateFsAutoFix: '自动修复不可用',
  autoFixTimeout: (timeoutMs: number) => `自动修复超时，已耗时 ${timeoutMs}ms`,
  // 插件 / 安全导入
  pluginsDesabilitadosSafeMode: '在 SAFE_MODE 中已禁用插件加载。设置 PROMETHEUS_ALLOW_PLUGINS=1 以允许。',
  pluginBloqueado: (erro: string) => `插件被阻止: ${erro}`,
  caminhoPluginNaoResolvido: '插件路径未解析',
  // 插件注册表
  pluginRegistradoNaoPodeSerObtido: (name: string) => `插件 ${name} 已注册但无法获取`,
  pluginCarregandoPromiseNaoPodeSerObtida: (name: string) => `插件 ${name} 正在加载但无法获取 promise`,
  naoFoiPossivelCarregarPlugin: (name: string, errMsg: string) => `无法加载插件 '${name}': ${errMsg}`,
  pluginDeveTerNomeValido: '插件必须有有效的名称',
  pluginDeveTerVersaoValida: '插件必须有有效的版本',
  pluginDeveDefinirPeloMenosUmaExtensao: '插件必须定义至少一个扩展',
  pluginDeveImplementarMetodoParse: '插件必须实现 parse() 方法',
  // 类型/分析员
  definicaoAnalistaInvalida: '无效的分析员定义',
  analistaSemFuncaoAplicar: (nome: string) => `分析员 ${nome} 没有 apply 函数`,
  // 验证 / 安全
  caminhoForaDaCwdNaoPermitido: (p: string) => `不允许 CWD 之外的路径: ${p}`,
  persistenciaNegadaForaRaizProjeto: (caminho: string) => `拒绝持久化: 路径在项目根目录之外: ${caminho}`,
  // 持久化 (环境)
  fsWriteFileBinaryIndisponivel: '当前环境中 fs.writeFile (binary) 不可用',
  fsReadFileIndisponivel: '当前环境中 fs.readFile 不可用',
  fsWriteFileIndisponivel: '当前环境中 fs.writeFile 不可用',
  fsRenameIndisponivel: '当前环境中 fs.rename 不可用',
  fsMkdirIndisponivel: '当前环境中 fs.mkdir 不可用',
  // 模式
  versaoSchemaDesconhecida: (versao: string) => `未知的 schema 版本: ${versao}`,
  relatorioSchemaInvalido: (erros: string) => `报告具有无效的 schema: ${erros}`,
  // 文件注册表
  arquivoNaoEncontrado: (fileCaminho: string) => `文件未找到: ${fileCaminho}`,
  validacaoFalhouPara: (fileCaminho: string) => `验证失败: ${fileCaminho}`,
  erroAoLer: (fileCaminho: string, errMsg: string) => `读取 ${fileCaminho} 时出错: ${errMsg}`,
  erroAoEscrever: (fileCaminho: string, errMsg: string) => `写入 ${fileCaminho} 时出错: ${errMsg}`,
  erroAoDeletar: (fileCaminho: string, errMsg: string) => `删除 ${fileCaminho} 时出错: ${errMsg}`,
  // 扫描器
  statIndefinidoPara: (fullCaminho: string) => `${fullCaminho} 的 stat 未定义`,
  // 回滚
  mapaReversaoCorrompido: '回滚映射已损坏',
  // 报告
  semPkg: '无 pkg'
} as const;
