// SPDX-License-Identifier: MIT

import { ICONES_ACAO } from '../../shared/icons.js';

export const CliComandoMetricasMensagens = {
  linhaEmBranco: '',
  historicoExportado: (destino: string) => `${ICONES_ACAO.export} 指标历史数据已导出到 ${destino}`,
  linhaExecucao: (timestampISO: string, totalArquivos: number, duracaoAnalise: string, duracaoParsing: string, cacheHits: number, cacheMiss: number) => `- ${timestampISO} | 文件=${totalArquivos} 分析=${duracaoAnalise} 解析=${duracaoParsing} 缓存(命中/未命中)=${cacheHits}/${cacheMiss}`,
  tituloTopAnalistas: (iconeInfo: string) => `${iconeInfo} 顶级分析器（按累计时间）：`,
  linhaTopAnalista: (nome: string, total: string, media: string, execucoes: number, ocorrencias: number) => `  • ${nome} 总计=${total} 平均=${media} 执行=${execucoes} 出现=${ocorrencias}`,
  medias: (mediaAnalise: string, mediaParsing: string) => `\n平均值：分析=${mediaAnalise} 解析=${mediaParsing}`
} as const;
