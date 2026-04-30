export interface AnalistaXmlConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<unknown[] | null>;
}

export interface XmlIssue {
  tipo: 'invalid-xml' | 'missing-declaration' | 'duplicate-attributes' | 'unescaped-special-chars' | 'deep-nesting' | 'mixed-content' | 'missing-namespace';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}