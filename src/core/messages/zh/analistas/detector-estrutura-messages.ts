// SPDX-License-Identifier: MIT

/**
 * @fileoverview 项目结构检测器的诊断消息。
 * 提供文本模板，用于检测 monorepo、全栈结构、
 * 后端/前端信号、多入口点、配置文件
 * 以及目录命名约定。
 */

type EntrypointsAgrupadosArgs = {
  previewGrupos: string;
  sufixoOcultos?: string;
};
export const DetectorEstruturaMensagens = {
  monorepoDetectado: '检测到 Monorepo 结构。',
  monorepoSemPackages: 'Monorepo 缺少 packages/ 目录。',
  fullstackDetectado: '检测到全栈结构。',
  pagesSemApi: '项目包含 pages/ 但没有 api/。',
  estruturaMista: '项目同时包含 src/ 和 packages/（monorepo）。请审查组织结构。',
  muitosArquivosRaiz: '项目根目录文件过多。请考虑使用文件夹进行组织。',
  sinaisBackend: '检测到后端信号（controllers/、prisma/、api/）。',
  sinaisFrontend: '检测到前端信号（components/、pages/）。',
  projetoGrandeSemSrc: '大型项目缺少 src/ 目录。请考虑组织源代码。',
  arquivosConfigDetectados: (detectados: string[]) => `检测到配置文件：${detectados.join(', ')}`,
  multiplosEntrypointsAgrupados: ({
    previewGrupos,
    sufixoOcultos
  }: EntrypointsAgrupadosArgs) => sufixoOcultos && sufixoOcultos.length > 0 ? `项目有多个入口点（按目录分组）：${previewGrupos} …（${sufixoOcultos} 个已隐藏）` : `项目有多个入口点（按目录分组）：${previewGrupos}`,
  multiplosEntrypointsLista: (preview: string[], resto: number) => resto > 0 ? `项目有多个入口点：${preview.join(', ')} …（+${resto} 个已隐藏）` : `项目有多个入口点：${preview.join(', ')}`,
  nomeDiretorioNaoConforme: (atual: string, esperado: string) => `目录 '${atual}' 不符合命名约定。期望名称：'${esperado}'。`
} as const;
