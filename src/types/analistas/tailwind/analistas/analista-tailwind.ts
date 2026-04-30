export interface AnalistaTailwindConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<unknown[] | null>;
}

export interface TailwindIssue {
  tipo: 'arbitrary-values' | 'duplicate-classes' | 'hardcoded-colors' | 'unused-classes' | 'complex-classes' | 'missing-responsive' | 'missing-dark-mode' | 'custom-classes';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}