export interface AnalistaPythonConfig {
  nome: string;
  categoria: string;
  descricao: string;
  global: boolean;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<any[] | null>;
}

export interface PythonIssue {
  tipo: 'missing-type-hints' | 'print-instead-of-log' | 'eval-usage' | 'exec-usage' | 'subprocess-shell-true' | 'pickle-usage' | 'yaml-unsafe-load' | 'http-without-verify' | 'sql-injection' | 'broad-except' | 'pass-in-except' | 'bare-raise' | 'global-keyword' | 'mutable-default' | 'list-comprehension' | 'looping-over-dict' | 'context-manager-without-as' | 'decorator-without-wraps' | 'generator-instead-of-list' | 'magic-number-arg';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info' | 'sugestao';
  sugestao?: string;
}