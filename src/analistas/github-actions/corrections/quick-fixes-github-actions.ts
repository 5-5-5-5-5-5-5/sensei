// SPDX-License-Identifier: MIT
import type { Correcao, Ocorrencia } from '@prometheus';
import { criarCorrecao } from '@prometheus';

export const quickFixesGithubActions = criarCorrecao({
  nome: 'quick-fixes-github-actions',
  categoria: 'quick-fix',
  descricao: 'Correções rápidas para padrões GitHub Actions problemáticos',
  test: (relPath: string): boolean => /\.ya?ml$/i.test(relPath) && /workflows?/i.test(relPath),
  aplicar: async (ocorrencia: Ocorrencia, src: string): Promise<Correcao | null> => {
    const { linha, mensagem } = ocorrencia;

    if (!linha) return null;

    const lines = src.split('\n');
    const line = lines[linha - 1];

    if (mensagem.includes('permissions')) {
      const permsBlock = `permissions:
  contents: read
  actions: read
  pull-requests: read`;
      return {
        original: line,
        modificado: `${permsBlock  }\n${  line}`,
        descricao: 'Adicionar permissions mínimas explícitas'
      };
    }

    if (mensagem.includes('secrets') && !/\|\|\s*["']/.test(line)) {
      const fixed = line.replace(/secrets\.(\w+)/, 'secrets.$1 || ""');
      return {
        original: line,
        modificado: fixed,
        descricao: 'Adicionar fallback para secrets'
      };
    }

    if (mensagem.includes('continue-on-error')) {
      return {
        original: line,
        modificado: line.replace(/continue-on-error:\s*true/, 'continue-on-error: false'),
        descricao: 'Desativar continue-on-error para falhas visíveis'
      };
    }

    if (mensagem.includes('checkout@v') && !/@v\d+/.test(line)) {
      const fixed = line.replace(/actions\/checkout@v\d+/, 'actions/checkout@v4');
      return {
        original: line,
        modificado: fixed,
        descricao: 'Usar versão estável do action'
      };
    }

    if (mensagem.includes('todos os branches') || mensagem.includes('todos os branch')) {
      return {
        original: line,
        modificado: line.replace(/on:\s*push/, 'on:\n  push:\n    branches: [main, develop]'),
        descricao: 'Limitar branches para push'
      };
    }

    return null;
  }
});