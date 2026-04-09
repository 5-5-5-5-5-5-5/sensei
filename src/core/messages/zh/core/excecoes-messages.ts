// SPDX-License-Identifier: MIT

/**
 * @fileoverview Prometheus核心异常和错误消息。
 * 集中CLI、插件、分析器相关的错误字符串，
 * 验证、安全、持久化、schema、扫描器、还原和报告。
 */

export const ExcecoesMensagens = {
  // CLI
  exit1: 'exit:1',
  requireMutateFsAutoFix: '自动修复不可用',
  autoFixTimeout: (timeoutMs: number) => `自动修复超时: ${timeoutMs}ms后`,
  // 插件 / 安全导入
  pluginsDesabilitadosSafeMode: 'SAFE_MODE中禁用插件加载。请设置PROMETHEUS_ALLOW_PLUGINS=1以允许。',
  pluginBloqueado: (erro: string) => `插件被阻止: ${erro}`,
  caminhoPluginNaoResolvido: '插件路径未解析',
  // 插件注册表
  pluginRegistradoNaoPodeSerObtido: (name: string) => `插件${name}已注册但无法获取`,
  pluginCarregandoPromiseNaoPodeSerObtida: (name: string) => `插件${name}正在加载但无法获取promise`,
  naoFoiPossivelCarregarPlugin: (name: string, errMsg: string) => `无法加载插件'${name}': ${errMsg}`,
  pluginDeveTerNomeValido: '插件必须有有效的名称',
  pluginDeveTerVersaoValida: '插件必须有有效的版本',
  pluginDeveDefinirPeloMenosUmaExtensao: '插件必须至少定义一个扩展名',
  pluginDeveImplementarMetodoParse: '插件必须实现parse()方法',
  // 类型/分析器
  definicaoAnalistaInvalida: '分析器定义无效',
 分析师SemFuncaoAplicar: (nome: string) => `分析器${nome}没有apply函数`,
  // 验证 / 安全
  caminhoForaDaCwdNaoPermitido: (p: string) => `不允许超出CWD的路径: ${p}`,
  persistenciaNegadaForaRaizProjeto: (caminho: string) => `持久化被拒绝: 路径超出项目根目录: ${caminho}`,
  // 持久化（环境）
  fsWriteFileBinaryIndisponivel: '当前环境中fs.writeFile（二进制）不可用',
  fsReadFileIndisponivel: 'fs.readFile在当前环境中不可用',
  fsWriteFileIndisponivel: 'fs.writeFile在当前环境中不可用',
  fsRenameIndisponivel: 'fs.rename在当前环境中不可用',
  fsMkdirIndisponivel: 'fs.mkdir在当前环境中不可用',
  // Schema
  versaoSchemaDesconhecida: (versao: string) => `未知的schema版本: ${versao}`,
  relatorioSchemaInvalido: (erros: string) => `报告schema无效: ${erros}`,
  // 文件注册表
  arquivoNaoEncontrado: (fileCaminho: string) => `文件未找到: ${fileCaminho}`,
  validacaoFalhouPara: (fileCaminho: string) => `验证失败: ${fileCaminho}`,
  erroAoLer: (fileCaminho: string, errMsg: string) => `读取${fileCaminho}时出错: ${errMsg}`,
  erroAoEscrever: (fileCaminho: string, errMsg: string) => `写入${fileCaminho}时出错: ${errMsg}`,
  erroAoDeletar: (fileCaminho: string, errMsg: string) => `删除${fileCaminho}时出错: ${errMsg}`,
  // 扫描器
  statIndefinidoPara: (fullCaminho: string) => `${fullCaminho}的stat未定义`,
  // 还原
  mapaReversaoCorrompido: '还原映射损坏',
  // 报告
  semPkg: '无pkg'
} as const;