// SPDX-License-Identifier: MIT
import type { Correcao, Ocorrencia } from '@prometheus';
import { criarCorrecao } from '@prometheus';

export const quickFixesReact = criarCorrecao({
  nome: 'quick-fixes-react',
  categoria: 'quick-fix',
  descricao: 'Correções rápidas para padrões React problemáticos',
  test: (relPath: string): boolean => /\.(jsx|tsx|react\.js|react\.ts)$/i.test(relPath),
  aplicar: async (ocorrencia: Ocorrencia, src: string): Promise<Correcao | null> => {
    const { linha, mensagem } = ocorrencia;

    if (!linha) return null;

    const lines = src.split('\n');
    const line = lines[linha - 1];

    if (mensagem.includes('target="_blank"') && !mensagem.includes('rel=')) {
      const fixed = line.replace(/target=["']?_blank["']?/, 'target="_blank" rel="noopener noreferrer"');
      return {
        original: line,
        modificado: fixed,
        descricao: 'Adicionar rel="noopener noreferrer" para segurança'
      };
    }

    if (mensagem.includes('dangerouslySetInnerHTML')) {
      return {
        original: line,
        modificado: line.replace(/dangerouslySetInnerHTML/, '{__html: sanitize(html)}'),
        descricao: 'Considerar usar biblioteca de sanitização'
      };
    }

    if (mensagem.includes('index') && mensagem.includes('key')) {
      const mapMatch = line.match(/\.map\s*\(\s*\(?(\w+),\s*(\w+)\)/);
      if (mapMatch) {
        return {
          original: line,
          modificado: line.replace(/,\s*(\w+)\s*\)/, `, ${mapMatch[1]}.id ?? ${mapMatch[2]})`).replace(/key=\{(\w+)\}/, 'key={$1}'),
          descricao: 'Usar ID único em vez de índice'
        };
      }
    }

    if (mensagem.includes('onClick') && line.includes('=>')) {
      return {
        original: line,
        modificado: line.replace(/onClick=\{[^}]+\}/, 'onClick={handleClick}'),
        descricao: 'Extrair handler para função nomeada'
      };
    }

    return null;
  }
});