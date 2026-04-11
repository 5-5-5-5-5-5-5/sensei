// SPDX-License-Identifier: MIT

import { ICONES_ACAO, ICONES_RELATORIO } from '../../shared/icons.js';

export const CliExportersMensagens = {
  poda: {
    relatoriosExportados: (dir: string) => `清理报告已导出到：${dir}`,
    falhaExportar: (erroMensagem: string) => `导出清理报告失败：${erroMensagem}`
  },
  guardian: {
    relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} Guardian 报告已导出：`,
    caminhoMarkdown: (caminhoMd: string) => `   Markdown：${caminhoMd}`,
    caminhoJson: (caminhoJson: string) => `   JSON：${caminhoJson}`,
    falhaExportar: (erroMensagem: string) => `导出 Guardian 报告失败：${erroMensagem}`
  },
  fixTypes: {
    relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} fix-types 报告已导出：`,
    caminhoMarkdown: (caminhoMd: string) => `   Markdown：${caminhoMd}`,
    caminhoJson: (caminhoJson: string) => `   JSON：${caminhoJson}`,
    falhaExportar: (erroMensagem: string) => `导出 fix-types 报告失败：${erroMensagem}`
  },
  reestruturacao: {
    relatoriosExportados: (modoPrefixo: string, dir: string) => `重构报告${modoPrefixo}已导出到：${dir}`,
    falhaExportar: (modoPrefixo: string, erroMensagem: string) => `导出${modoPrefixo}重构报告失败：${erroMensagem}`
  }
} as const;
