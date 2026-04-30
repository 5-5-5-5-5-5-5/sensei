// SPDX-License-Identifier: MIT
import type { Correcao, Ocorrencia } from '@prometheus';
import { criarCorrecao } from '@prometheus';

export const quickFixesShell = criarCorrecao({
  nome: 'quick-fixes-shell',
  categoria: 'quick-fix',
  descricao: 'Correções rápidas para padrões shell problemáticos',
  test: (relPath: string): boolean => /\.(sh|bash|zsh)$/i.test(relPath) || /^#!\/.*(?:sh|bash)/.test(relPath),
  aplicar: async (ocorrencia: Ocorrencia, src: string): Promise<Correcao | null> => {
    const { linha, mensagem } = ocorrencia;

    if (!linha) return null;

    const lines = src.split('\n');
    const line = lines[linha - 1];

    if (!src.trim().startsWith('#!')) {
      return {
        original: '',
        modificado: '#!/bin/bash\nset -e\n\n',
        descricao: 'Adicionar shebang e set -e'
      };
    }

    if (mensagem.includes('eval')) {
      return {
        original: line,
        modificado: '# Avaliação removida por segurança',
        descricao: 'Remover eval inseguro'
      };
    }

    if (mensagem.includes('/tmp/')) {
      const fixed = line.replace(/\/tmp\//g, '${TMPDIR:-/tmp}/');
      return {
        original: line,
        modificado: fixed,
        descricao: 'Usar variável TMPDIR para segurança'
      };
    }

    if (mensagem.includes('sem exit') && linha === lines.length) {
      return {
        original: line,
        modificado: `${line  }\nexit 0`,
        descricao: 'Adicionar exit explícito'
      };
    }

    return null;
  }
});