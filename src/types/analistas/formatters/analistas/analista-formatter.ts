export interface AnalistaFormatterConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<any[] | null>;
}

export interface FormatterIssue {
  tipo: 'json-invalid' | 'yaml-invalid' | 'markdown-missing-toc' | 'indentation' | 'line-length' | 'trailing-spaces';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}