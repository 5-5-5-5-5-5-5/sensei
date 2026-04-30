// SPDX-License-Identifier: MIT
import type { Correcao, Ocorrencia } from '@prometheus';
import { criarCorrecao } from '@prometheus';

export const quickFixesSql = criarCorrecao({
  nome: 'quick-fixes-sql',
  categoria: 'quick-fix',
  descricao: 'Correções rápidas para padrões SQL problemáticos',
  test: (relPath: string): boolean => /\.(sql|ddl|dml)$/i.test(relPath),
  aplicar: async (ocorrencia: Ocorrencia, src: string): Promise<Correcao | null> => {
    const { linha, mensagem } = ocorrencia;

    if (!linha) return null;

    const lines = src.split('\n');
    const line = lines[linha - 1];

    if (mensagem.includes('SELECT *')) {
      const fixed = line.replace(/SELECT\s+\*/, 'SELECT column1, column2');
      return {
        original: line,
        modificado: fixed,
        descricao: 'Especificar colunas explicitamente'
      };
    }

    if (mensagem.includes('sem LIMIT')) {
      const fixed = `${line.trimEnd()  } LIMIT 100`;
      return {
        original: line,
        modificado: fixed,
        descricao: 'Adicionar LIMIT para evitar retorno excessivo'
      };
    }

    if (mensagem.includes('LIKE') && mensagem.includes('injection')) {
      return {
        original: line,
        modificado: line.replace(/LIKE\s+['"]?%?([^'"]+)%?['"]?/i, 'LIKE $1 ESCAPE \'\\\\\''),
        descricao: 'Adicionar escape para evitar SQL injection'
      };
    }

    if (mensagem.includes('DELETE') && !line.includes('WHERE')) {
      return {
        original: line,
        modificado: line.replace(/;$/, ' -- Verificar WHERE antes de executar;'),
        descricao: 'Adicionar comentário de alerta'
      };
    }

    return null;
  }
});