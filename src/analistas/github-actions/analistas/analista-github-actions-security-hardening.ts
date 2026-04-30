// SPDX-License-Identifier: MIT
/**
 * Plugin de Security Hardening para GitHub Actions
 * Implementa regras de segurança avançadas para workflows
 */

import type { ProblemaWorkflow } from '@prometheus';

import { registrarDetectorGithubActions } from './analista-github-actions.js';

interface WorkflowWithPermissions {
  permissions?: Record<string, unknown>;
  jobs?: Record<string, {
    permissions?: Record<string, unknown>;
    if?: string;
    steps?: Array<{ run?: string; uses?: string; with?: Record<string, unknown> }>;
  }>;
}

const PERMISSIONS_SEGURAS: Record<string, string[]> = {
  contents: ['read'],
  actions: ['read'],
  pull_requests: ['read'],
  issues: ['read'],
  pages: ['read'],
  deployments: ['read'],
  statuses: ['read']
};

const ACTIONS_PERIGOSAS = [
  { action: 'subossel/variable', reason: 'Variáveis de ambiente não são seguras para secrets' },
  { action: 'enthought/pipfile-install', reason: 'Pipfile-install pode expor dependências' },
  { action: 'azure/docker-login', reason: 'Login em container pode expor credenciais', better: 'docker/build-push-action' },
  { action: 'azure/login', reason: 'Login no Azure pode expor credenciais', better: 'azure/login@v1 com secrets' }
];

registradorSecurityHardening();

function registradorSecurityHardening(): void {
  registrarDetectorGithubActions({
    nome: 'security-hardening',
    descricao: 'Regras adicionais de segurança para workflows GitHub Actions',
    severidade: 'alta',
    testar: (workflow: unknown): ProblemaWorkflow[] => {
      const problemas: ProblemaWorkflow[] = [];
      const wf = workflow as WorkflowWithPermissions | null | undefined;
      if (!wf || typeof wf !== 'object') return problemas;

      verificarPermissoes(wf, problemas);
      verificarGITHUBToken(wf, problemas);
      verificarActionsPerigosas(workflow, problemas);
      verificarScriptsPerigosos(wf, problemas);
      verificarSecretsEmLogs(wf, problemas);
      verificarIfConditions(wf, problemas);

      return problemas;
    }
  });
}

function verificarPermissoes(wf: WorkflowWithPermissions, probs: ProblemaWorkflow[]): void {
  if (!wf.jobs) return;

  for (const [jobId, job] of Object.entries(wf.jobs)) {
    if (!job) continue;

    if (!job.permissions && !wf.permissions) {
      probs.push({
        tipo: 'security-permissions-missing',
        descricao: `Job '${jobId}' não define permissões explícitas (usa default GITHUB_TOKEN)`,
        severidade: 'media',
        linha: 1,
        sugestao: 'Adicionar permissions: ao job ou ao workflow para seguir princípio do menor privilégio'
      });
    }

    if (job.permissions) {
      const perms = job.permissions as Record<string, unknown>;
      for (const [perm, value] of Object.entries(perms)) {
        if (value === 'write' && !PERMISSIONS_SEGURAS[perm]?.includes('write')) {
          probs.push({
            tipo: 'security-permission-write',
            descricao: `Job '${jobId}' tem permissão '${perm}: write' - revisar necessidade`,
            severidade: 'alta',
            linha: 1,
            sugestao: `Usar ${  PERMISSIONS_SEGURAS[perm]?.[0] || 'read'  } se possível`
          });
        }
      }
    }
  }
}

function verificarGITHUBToken(wf: WorkflowWithPermissions, probs: ProblemaWorkflow[]): void {
  const wfPerms = wf.permissions as Record<string, unknown> | undefined;
  if (wfPerms && wfPerms.contents === 'write' && !wfPerms.id_token) {
    const hasSecrets = Object.keys(wf).some(k => /secret|token|key/i.test(k));
    if (!hasSecrets) {
      probs.push({
        tipo: 'security-github-token-write',
        descricao: 'GITHUB_TOKEN com contents:write sem necessidade explícita',
        severidade: 'media',
        linha: 1,
        sugestao: 'Adicionar permissions.contents: read (default) se não precisa de push'
      });
    }
  }
}

function verificarActionsPerigosas(workflow: unknown, probs: ProblemaWorkflow[]): void {
  if (!workflow || typeof workflow !== 'object') return;

  const wfStr = JSON.stringify(workflow);
  for (const { action, reason, better } of ACTIONS_PERIGOSAS) {
    if (wfStr.includes(action)) {
      probs.push({
        tipo: 'security-action-perigosa',
        descricao: `Action '${action}' potencialmente perigosa: ${reason}`,
        severidade: 'alta',
        linha: 1,
        sugestao: better ? `Usar '${better}' como alternativa mais segura` : 'Revisar necessidade desta action'
      });
    }
  }
}

function verificarScriptsPerigosos(wf: WorkflowWithPermissions, probs: ProblemaWorkflow[]): void {
  if (!wf.jobs) return;

  for (const [jobId, job] of Object.entries(wf.jobs)) {
    if (!job?.steps) continue;

    for (const step of job.steps) {
      if (!step.run) continue;

      const scriptsPerigosos = [
        { pattern: /eval\s+\$/, descricao: 'Uso de eval com variável - possível injection' },
        { pattern: /\|\s*sh\s+-c/, descricao: 'Piping para shell pode绕过 validação' },
        { pattern: /\$\(\s*.*\s*\)/, descricao: 'Command substitution pode executar código arbitrário' },
        { pattern: /\bcurl\s+.*\|\s*(sh|bash)/, descricao: 'Curl piping para shell - script remoto não verificado', severity: 'alta' as const },
        { pattern: /wget\s+.*\|\s*(sh|bash)/, descricao: 'Wget piping para shell - script remoto não verificado', severity: 'alta' as const },
        { pattern: /chmod\s+777/, descricao: 'Permissão 777 descoberta - risco de segurança', severity: 'alta' as const },
        { pattern: /password\s*=\s*["']/i, descricao: 'Senha em texto plano no script', severity: 'critica' as const }
      ];

      for (const { pattern, descricao, severity = 'media' as const } of scriptsPerigosos) {
        if (pattern.test(step.run)) {
          probs.push({
            tipo: 'security-script-perigoso',
            descricao: `Job '${jobId}': ${descricao}`,
            severidade: severity,
            linha: 1,
            sugestao: 'Sanitizar entrada ou usar abordagem alternativa'
          });
        }
      }
    }
  }
}

function verificarSecretsEmLogs(wf: WorkflowWithPermissions, probs: ProblemaWorkflow[]): void {
  if (!wf.jobs) return;

  for (const [jobId, job] of Object.entries(wf.jobs)) {
    if (!job?.steps) continue;

    for (const step of job.steps) {
      if (!step.run) continue;

      const secretsEmLogs = [
        { pattern: /echo\s+.*\${{\s*secrets\.\w+/, descricao: 'Echo de secrets pode vazar em logs' },
        { pattern: /print\s+.*\${{\s*secrets\.\w+/, descricao: 'Print de secrets pode vazar em logs' },
        { pattern: /printf\s+.*\${{\s*secrets\.\w+/, descricao: 'Printf de secrets pode vazar em logs' },
        { pattern: /::add-mask::/, descricao: 'Máscara de secrets aplicada - verificar se todos estão cobertos' }
      ];

      for (const { pattern, descricao } of secretsEmLogs) {
        if (pattern.test(step.run)) {
          probs.push({
            tipo: 'security-secret-em-log',
            descricao: `Job '${jobId}': ${descricao}`,
            severidade: 'alta',
            linha: 1,
            sugestao: 'Usar ::add-mask:: para ocultar secrets nos logs'
          });
        }
      }
    }
  }
}

function verificarIfConditions(wf: WorkflowWithCredentials, probs: ProblemaWorkflow[]): void {
  if (!wf.jobs) return;

  for (const [jobId, job] of Object.entries(wf.jobs)) {
    if (!job?.if) continue;

    const ifConditions = job.if;
    if (ifConditions.includes('github.event.pull_request.head.repo.owner.login') &&
      !ifConditions.includes('!= github.event.pull_request.base.repo.owner.login')) {
      probs.push({
        tipo: 'security-fork-pr-detection',
        descricao: `Job '${jobId}' pode executar código de forks sem validação`,
        severidade: 'alta',
        linha: 1,
        sugestao: 'Adicionar verificação: github.event.pull_request.head.repo.owner.login != github.event.pull_request.base.repo.owner.login'
      });
    }
  }
}

interface WorkflowWithCredentials {
  jobs?: Record<string, { if?: string }>;
}