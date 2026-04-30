// SPDX-License-Identifier: MIT
import type { Correcao, Ocorrencia } from '@prometheus';
import { criarCorrecao } from '@prometheus';

export const quickFixesSvg = criarCorrecao({
  nome: 'quick-fixes-svg',
  categoria: 'quick-fix',
  descricao: 'Correções rápidas para padrões SVG problemáticos',
  test: (relPath: string): boolean => /\.svg$/i.test(relPath),
  aplicar: async (ocorrencia: Ocorrencia, src: string): Promise<Correcao | null> => {
    const { linha, mensagem } = ocorrencia;

    if (!linha) return null;

    const lines = src.split('\n');
    const line = lines[linha - 1];

    if (mensagem.includes('viewBox')) {
      const svgLine = lines.findIndex(l => /<svg/i.test(l));
      if (svgLine >= 0) {
        const svgOpen = lines[svgLine];
        if (!svgOpen.includes('viewBox')) {
          const fixed = svgOpen.replace(/<svg/, '<svg viewBox="0 0 100 100"');
          return {
            original: svgOpen,
            modificado: fixed,
            descricao: 'Adicionar viewBox para responsividade'
          };
        }
      }
    }

    if (mensagem.includes('<script>')) {
      return {
        original: line,
        modificado: '<!-- script removido por segurança -->',
        descricao: 'Remover script inline de SVG'
      };
    }

    if (mensagem.includes('on') && /on\w+\s*=/.test(line)) {
      const fixed = line.replace(/\s+on\w+\s*=\s*["'][^"']*["']/g, '');
      return {
        original: line,
        modificado: fixed,
        descricao: 'Remover handlers de eventos inline'
      };
    }

    if (mensagem.includes('javascript:')) {
      const fixed = line.replace(/href\s*=\s*["']?javascript:[^"'>\s]+["']?/i, 'href="#"');
      return {
        original: line,
        modificado: fixed,
        descricao: 'Remover javascript: URL'
      };
    }

    return null;
  }
});