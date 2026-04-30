// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import { otimizarSvgLikeSvgo, shouldSugerirOtimizacaoSvg } from '@shared/impar';

const disableEnv = process.env.PROMETHEUS_DISABLE_PLUGIN_SVG === '1';
type Msg = ReturnType<typeof criarOcorrencia>;
function findLine(src: string, index = 0): number {
  const safeIndex = Math.max(0, index);
  let line = 1;
  for (let i = 0; i < safeIndex && i < src.length; i++) {
    if (src.charCodeAt(i) === 10) line++;
  }
  return line;
}
function findFirstMatchLine(src: string, re: RegExp, fallbackLine = 1): number {
  const idx = src.search(re);
  if (idx < 0) return fallbackLine;
  return findLine(src, idx);
}
function msg(message: string, relPath: string, nivel: (typeof messages.SeverityNiveis)[keyof typeof messages.SeverityNiveis] = messages.SeverityNiveis.warning, line = 1): Msg {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.svg,
    tipo: messages.AnalystTipos.svg
  });
}
function parseDimensions(src: string): { width?: string; height?: string } {
  const widthMatch = src.match(/\bwidth\s*=\s*["']?([^"'>\s]+)["']?/i);
  const heightMatch = src.match(/\bheight\s*=\s*["']?([^"'>\s]+)["']?/i);
  return {
    width: widthMatch?.[1],
    height: heightMatch?.[1]
  };
}
export const analistaSvg = criarAnalista({
  nome: 'analista-svg',
  categoria: 'assets',
  descricao: 'Heurísticas completas para SVG + segurança + acessibilidade + otimização.',
  global: false,
  test: (relPath: string): boolean => /\.svg$/i.test(relPath),
  aplicar: async (src, relPath): Promise<Ocorrencia[] | null> => {
    if (disableEnv) return null;
    const ocorrencias: Ocorrencia[] = [];
    if (!/<svg\b/i.test(src)) {
      ocorrencias.push(msg(messages.SvgMensagens.naoPareceSvg, relPath, messages.SeverityNiveis.warning, 1));
      return ocorrencias;
    }
    const idxSvg = src.search(/<svg\b/i);
    const linhaSvg = idxSvg >= 0 ? findLine(src, idxSvg) : 1;
    const opt = otimizarSvgLikeSvgo({
      svg: src
    });
    // Segurança
    for (const w of opt.warnings) {
      if (w === 'script-inline') {
        const line = findFirstMatchLine(src, /<script\b/i, linhaSvg);
        ocorrencias.push(msg(messages.SvgMensagens.scriptInline, relPath, messages.SeverityNiveis.error, line));
      } else if (w === 'evento-inline') {
        const line = findFirstMatchLine(src, /\son\w+\s*=\s*['"]/i, linhaSvg);
        ocorrencias.push(msg(messages.SvgMensagens.eventoInline, relPath, messages.SeverityNiveis.warning, line));
      } else if (w === 'javascript-url') {
        const line = findFirstMatchLine(src, /javascript:\s*/i, linhaSvg);
        ocorrencias.push(msg(messages.SvgMensagens.javascriptUrl, relPath, messages.SeverityNiveis.error, line));
      }
    }
    // Boas práticas - viewBox
    if (!/\bviewBox\s*=\s*['"][^'"]+['"]/i.test(src)) {
      ocorrencias.push(msg(messages.SvgMensagens.semViewBox, relPath, messages.SeverityNiveis.info, linhaSvg));
    }
    // Dimensões
    const dims = parseDimensions(src);
    if (!dims.width || !dims.height) {
      const dimLine = findFirstMatchLine(src, /<svg\b/i, linhaSvg);
      ocorrencias.push(msg(messages.SvgMensagens.semDimensoes, relPath, messages.SeverityNiveis.info, dimLine));
    }
    // Acessibilidade - title
    if (!/<title[^>]*>/i.test(src)) {
      ocorrencias.push(msg(messages.SvgMensagens.semTitulo, relPath, messages.SeverityNiveis.suggestion, linhaSvg));
    }
    // Acessibilidade - desc
    if (!/<desc[^>]*>/i.test(src)) {
      ocorrencias.push(msg(messages.SvgMensagens.semDescricao, relPath, messages.SeverityNiveis.suggestion, linhaSvg));
    }
    // Acessibilidade - role
    if (!/\brole\s*=/i.test(src) && !/\baria-/i.test(src)) {
      const roleLine = findFirstMatchLine(src, /<svg\b/i, linhaSvg);
      ocorrencias.push(msg(messages.SvgMensagens.semRole, relPath, messages.SeverityNiveis.suggestion, roleLine));
    }
    // Estrutura válida
    if (!/<svg[^>]*>[\s\S]*<\/(?:svg)>/i.test(src)) {
      ocorrencias.push(msg(messages.SvgMensagens.fechamentoInvalido, relPath, messages.SeverityNiveis.warning, linhaSvg));
    }
    // Otimização (diferença de bytes)
    if (opt.changed && opt.originalBytes > opt.optimizedBytes && shouldSugerirOtimizacaoSvg(opt.originalBytes, opt.optimizedBytes)) {
      ocorrencias.push(msg(messages.SvgMensagens.podeOtimizar(opt.originalBytes, opt.optimizedBytes, opt.mudancas), relPath, messages.SeverityNiveis.info, linhaSvg));
    }
    return ocorrencias.length ? ocorrencias : null;
  }
});