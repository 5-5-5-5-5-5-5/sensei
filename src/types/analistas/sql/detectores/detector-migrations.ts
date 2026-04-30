export interface DetectorMigrationsResult {
  nome: string;
  descricao: string;
  test: (relPath: string) => boolean;
  detectar: (src: string, relPath: string) => Promise<import('../../../comum/ocorrencias.js').Ocorrencia[]>;
}