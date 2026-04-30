export interface AnalistaSvgConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<any[] | null>;
}

export interface SvgIssue {
  tipo: 'missing-viewbox' | 'missing-width-height' | 'unsafe-embed' | 'deprecated-elements' | 'style-inline' | 'script-in-svg' | 'missing-title' | 'accessibility-issue';
  mensagem: string;
  linha: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}