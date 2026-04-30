export interface AnalistaShellConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<unknown[] | null>;
}

export interface ShellIssue {
  tipo: 'missing-shebang' | 'no-error-handling' | 'eval-usage' | 'unsafe-commands' | 'missing-quotes' | 'hardcoded-paths' | 'umask-usage' | 'pipefail-missing';
  mensagem: string;
  linha: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}