export interface AnalistaJsTsConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<unknown[] | null>;
}

export interface JsTsIssue {
  tipo: 'unused-variable' | 'any-type' | 'missing-return' | 'no-explicit-any' | 'unsafe-inner-html' | 'console-log' | 'debugger' | 'todo-comment' | 'long-function' | 'complexity';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}