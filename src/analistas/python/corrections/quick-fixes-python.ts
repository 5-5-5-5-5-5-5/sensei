// SPDX-License-Identifier: MIT
import type { Correcao, Ocorrencia } from '@prometheus';
import { criarCorrecao } from '@prometheus';

export const quickFixesPython = criarCorrecao({
  nome: 'quick-fixes-python',
  categoria: 'quick-fix',
  descricao: 'Correções rápidas para padrões Python problemáticos',
  test: (relPath: string): boolean => /\.py$/i.test(relPath),
  aplicar: async (ocorrencia: Ocorrencia, src: string): Promise<Correcao | null> => {
    const { linha, mensagem } = ocorrencia;

    if (!linha) return null;

    const lines = src.split('\n');
    const line = lines[linha - 1];

    if (mensagem.includes('except:')) {
      const fixed = line.replace(/except\s*:/, 'except Exception as e:');
      return {
        original: line,
        modificado: fixed,
        descricao: 'Adicionar exceção específica em vez de except:'
      };
    }

    if (mensagem.includes('pass') && mensagem.includes('except')) {
      const nextLine = lines[linha]?.trim();
      if (nextLine === 'pass') {
        return {
          original: `${lines[linha - 1]  }\n${  lines[linha]}`,
          modificado: `${lines[linha - 1]  }\n    logger.error(f"Erro: {e}")\n    raise`,
          descricao: 'Substituir pass por tratamento de erro adequado'
        };
      }
    }

    if (mensagem.includes('print(') && !mensagem.includes('logging')) {
      const fixed = line.replace(/print\(/, 'logger.info(');
      return {
        original: line,
        modificado: fixed.replace(/^(\s*)/, '$1import logging\n$1logger = logging.getLogger(__name__)\n$1'),
        descricao: 'Substituir print por logging'
      };
    }

    if (mensagem.includes('eval') || mensagem.includes('exec')) {
      return {
        original: line,
        modificado: '# Removido código inseguro - usar função segura',
        descricao: 'Remover eval/exec inseguro'
      };
    }

    return null;
  }
});