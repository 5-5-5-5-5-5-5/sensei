// SPDX-License-Identifier: MIT

export const CliOtimizarSvgExtraMensagens = {
  titulo: '优化 SVG',
  nenhumSvgAcimaLimiar: '没有 SVG 超过优化阈值。',
  arquivoOtimizado: '{arquivo} — {original} → {otimizado}（−{economia}）',
  arquivoOtimizadoDry: '[模拟] {arquivo} — {original} → {otimizado}（−{economia}）',
  candidatosSvg: '候选：{candidatos} | 潜在节省：{economiaTotal} | 读取 SVG 总数：{total}',
  otimizacaoAplicada: '已对 {aplicados}/{candidatos} 个文件应用优化。',
  useWriteAplicar: '使用 --write 应用优化。',
  falhaOtimizarSvg: '优化 SVG 失败：{erro}',
} as const;
