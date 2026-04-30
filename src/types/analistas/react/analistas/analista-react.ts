export interface AnalistaReactConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<any[] | null>;
}

export interface ReactIssue {
  tipo: 'missing-key-prop' | 'unsafe-inner-html' | 'missing-dependency' | 'use-effect-missing' | 'state-mutation' | 'missing-return' | 'inline-styles' | 'unused-state';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}