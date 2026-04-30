// SPDX-License-Identifier: MIT
import type { Ocorrencia } from '@prometheus';

interface DetectorMigrationsResult {
  nome: string;
  descricao: string;
  test: (relPath: string) => boolean;
  detectar: (src: string, relPath: string) => Promise<Ocorrencia[]>;
}

export const detectorMigrations: DetectorMigrationsResult = {
  nome: 'detector-migrations',
  descricao: 'Detecta padrões específicos em arquivos de migração de banco de dados',
  test: (relPath: string): boolean => {
    const path = relPath.toLowerCase();
    return /migration|migrate|alter|schema/i.test(path) &&
           /\.(sql|ts|js|py)$/i.test(path);
  },
  detectar: async (src: string, relPath: string): Promise<Ocorrencia[]> => {
    const ocorrencias: Ocorrencia[] = [];

    if (!/(migration|migrate|alter)/i.test(relPath)) {
      return [];
    }

    const linhas = src.split('\n');

    linhas.forEach((linha, index) => {
      const numeroLinha = index + 1;

      if (/alter\s+table/i.test(linha) && /drop\s+column/i.test(linha)) {
        ocorrencias.push({
          tipo: 'alerta-migracao',
          nivel: 'aviso',
          mensagem: 'Remoção de coluna em migração detecteda',
          relPath,
          linha: numeroLinha,
          sugestao: 'Verifique se dados serão perdidos. Considere usar estratégia de soft delete.',
          origem: 'detector-migrations'
        } as Ocorrencia);
      }

      if (/rename\s+table/i.test(linha) || /rename\s+column/i.test(linha)) {
        ocorrencias.push({
          tipo: 'alerta-migracao',
          nivel: 'info',
          mensagem: 'Renomeação de objeto detectada em migração',
          relPath,
          linha: numeroLinha,
          sugestao: 'Documente a mudança para atualização de código dependente.',
          origem: 'detector-migrations'
        } as Ocorrencia);
      }

      if (/change\s+column\s+type/i.test(linha) || /alter\s+column/i.test(linha)) {
        ocorrencias.push({
          tipo: 'alerta-migracao',
          nivel: 'aviso',
          mensagem: 'Alteração de tipo de coluna detectada',
          relPath,
          linha: numeroLinha,
          sugestao: 'Verifique compatibilidade de dados e impactos em aplicações.',
          origem: 'detector-migrations'
        } as Ocorrencia);
      }

      if (/add\s+constraint/i.test(linha) && /not\s+null/i.test(linha)) {
        ocorrencias.push({
          tipo: 'alerta-migracao',
          nivel: 'info',
          mensagem: 'Adição de constraint NOT NULL pode falhar em dados existentes',
          relPath,
          linha: numeroLinha,
          sugestao: 'Considere adicionar valores padrão ou limpar dados antes.',
          origem: 'detector-migrations'
        } as Ocorrencia);
      }

      if (/create\s+index/i.test(linha) && /concurrently/i.test(linha)) {
        ocorrencias.push({
          tipo: 'boas-praticas',
          nivel: 'info',
          mensagem: 'Índice criado com CONCURRENTLY - boa prática para production',
          relPath,
          linha: numeroLinha,
          origem: 'detector-migrations'
        } as Ocorrencia);
      }
    });

    return ocorrencias;
  }
};