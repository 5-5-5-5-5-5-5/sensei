// SPDX-License-Identifier: MIT
import type { Correcao, Ocorrencia } from '@prometheus';
import { criarCorrecao } from '@prometheus';

export const quickFixesXml = criarCorrecao({
  nome: 'quick-fixes-xml',
  categoria: 'quick-fix',
  descricao: 'Correções rápidas para padrões XML problemáticos',
  test: (relPath: string): boolean => /\.xml$/i.test(relPath),
  aplicar: async (ocorrencia: Ocorrencia, src: string): Promise<Correcao | null> => {
    const { linha, mensagem } = ocorrencia;

    if (!linha) return null;

    const lines = src.split('\n');
    const line = lines[linha - 1];

    if (mensagem.includes('<?xml')) {
      const xmlDecl = '<?xml version="1.0" encoding="UTF-8"?>';
      return {
        original: lines[0] || '',
        modificado: `${xmlDecl  }\n${  lines[0] || ''}`,
        descricao: 'Adicionar declaração XML com encoding'
      };
    }

    if (mensagem.includes('DOCTYPE') && mensagem.includes('SYSTEM')) {
      return {
        original: line,
        modificado: '<!-- DOCTYPE removido por segurança -->',
        descricao: 'Remover DOCTYPE externo potencialmente perigoso'
      };
    }

    if (mensagem.includes('ENTITY') && !mensagem.includes('%')) {
      return {
        original: line,
        modificado: '<!-- Entidade removida -->',
        descricao: 'Remover entidade não utilizada'
      };
    }

    if (mensagem.includes('namespace') && mensagem.includes('não declarado')) {
      const prefixMatch = line.match(/(\w+):/);
      if (prefixMatch) {
        const prefix = prefixMatch[1];
        const fixed = line.replace(/<(\w+)/, `<$1 xmlns:${prefix}="http://example.com/${prefix}"`);
        return {
          original: line,
          modificado: fixed,
          descricao: `Adicionar declaração de namespace xmlns:${prefix}`
        };
      }
    }

    return null;
  }
});