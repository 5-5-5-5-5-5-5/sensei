export interface AnalistaHtmlConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<unknown[] | null>;
}

export interface HtmlIssue {
  tipo: 'missing-doctype' | 'missing-title' | 'missing-viewport' | 'missing-charset' | 'missing-lang' | 'heading-levels' | 'multiple-h1' | 'inline-events' | 'unsafe-scripts' | 'deprecated-tags' | 'missing-alt' | 'empty-link';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}