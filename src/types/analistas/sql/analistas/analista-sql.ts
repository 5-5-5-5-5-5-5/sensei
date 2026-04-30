export interface AnalistaSqlConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<any[] | null>;
}

export interface SqlIssue {
  tipo: 'select-star' | 'no-where' | 'sql-injection-risk' | 'nested-queries' | 'missing-index' | 'n-plus-one' | 'transaction-without-commit' | 'camel-case';
  mensagem: string;
  linha: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}