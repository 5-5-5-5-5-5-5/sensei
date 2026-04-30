export interface AnalistaCssConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<any[] | null>;
}

export interface CssIssue {
  tipo: 'duplicate-selectors' | 'unsafe-pseudo' | 'missing-prefix' | 'deep-nesting' | 'universal-selector' | 'important-override' | 'missing-responsive' | 'unused-selectors';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}