export interface AnalistaGithubActionsConfig {
  nome: string;
  categoria: string;
  descricao: string;
  test: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string) => Promise<unknown[] | null>;
}

export interface GithubActionsIssue {
  tipo: 'action-outdated' | 'excessive-permissions' | 'hardcoded-secret' | 'missing-timeout' | 'unsafe-run' | 'insecure-checkout' | 'unstable-branch' | 'missing-cache';
  mensagem: string;
  linha?: number;
  severidade?: 'erro' | 'aviso' | 'info';
  sugestao?: string;
}