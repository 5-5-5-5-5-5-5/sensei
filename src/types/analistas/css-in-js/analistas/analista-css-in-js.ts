export interface AnalistaCssInJsConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<any[] | null>;
}

export interface CssInJsIssue {
  tipo: 'styled-components-issue' | 'emotion-issue' | 'css-modules-issue' | 'inline-styles' | 'dynamic-classes' | 'unsafe-eval';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}