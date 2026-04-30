// SPDX-License-Identifier: MIT
/**
 * Auto-fixers para problemas comuns em GitHub Actions Workflows
 */

import type { DeteccaoCustom } from './analista-github-actions.js';

export interface AutoFixResult {
  conteudo: string;
  descricao: string;
  applied: boolean;
}

const ACOES_ATUALIZACOES: Record<string, string> = {
  'actions/checkout@v2': 'actions/checkout@v4',
  'actions/checkout@v3': 'actions/checkout@v4',
  'actions/checkout@v4': 'actions/checkout@v4',
  'actions/setup-node@v2': 'actions/setup-node@v4',
  'actions/setup-node@v3': 'actions/setup-node@v4',
  'actions/setup-python@v1': 'actions/setup-python@v5',
  'actions/setup-python@v4': 'actions/setup-python@v5',
  'actions/setup-python@v3': 'actions/setup-python@v5',
  'actions/cache@v2': 'actions/cache@v4',
  'actions/cache@v3': 'actions/cache@v4',
  'actions/upload-artifact@v2': 'actions/upload-artifact@v4',
  'actions/upload-artifact@v3': 'actions/upload-artifact@v4',
  'actions/download-artifact@v2': 'actions/download-artifact@v4',
  'actions/download-artifact@v3': 'actions/download-artifact@v4',
  'actions/create-release@v1': 'softprops/action-gh-release@v1',
  'actions/github-script@v3': 'actions/github-script@v7',
  'azure/login@v1': 'azure/login@v2'
};

export const autofixActionDesatualizada: DeteccaoCustom = {
  nome: 'autofix-action-desatualizada',
  descricao: 'Atualiza actions para versão mais recente',
  severidade: 'media',
  testar: (workflow) => {
    const probs: Array<{ tipo: string; descricao: string; linha: number; sugestao: string; severidade: 'baixa' | 'media' | 'alta' | 'critica' }> = [];
    if (!workflow || typeof workflow !== 'object') return probs;

    const wfJson = JSON.stringify(workflow);
    for (const [antiga, nova] of Object.entries(ACOES_ATUALIZACOES)) {
      if (wfJson.includes(antiga) && antiga !== nova) {
        probs.push({ tipo: 'action-desatualizada', descricao: `Atualizar ${antiga} para ${nova}`, linha: 1, sugestao: nova, severidade: 'media' });
      }
    }
    return probs;
  },
  corrigir: (conteudo) => {
    let novoConteudo = conteudo;
    let applied = false;
    for (const [antiga, nova] of Object.entries(ACOES_ATUALIZACOES)) {
      if (novoConteudo.includes(antiga) && antiga !== nova) {
        novoConteudo = novoConteudo.replace(antiga, nova);
        applied = true;
      }
    }
    return applied ? { conteudo: novoConteudo, descricao: 'Actions atualizadas para versão mais recente' } : null;
  }
};

export const autofixTimeout: DeteccaoCustom = {
  nome: 'autofix-timeout',
  descricao: 'Adiciona timeout em jobs',
  severidade: 'media',
  testar: (workflow) => {
    const probs: Array<{ tipo: string; descricao: string; linha: number; sugestao: string; severidade: 'baixa' | 'media' | 'alta' | 'critica' }> = [];
    if (!workflow || typeof workflow !== 'object') return probs;
    if (Object.keys(workflow).includes('jobs')) {
      probs.push({ tipo: 'job-sem-timeout', descricao: 'Job sem timeout', linha: 1, sugestao: 'Adicionar timeout-minutes: 30', severidade: 'media' });
    }
    return probs;
  },
  corrigir: (conteudo) => {
    if (conteudo.includes('timeout-minutes:')) return null;
    const lines = conteudo.split('\n');
    const newLines: string[] = [];
    for (const line of lines) {
      newLines.push(line);
      if (line.includes('runs-on:') && !line.includes('timeout-minutes:')) {
        newLines.splice(newLines.length - 1, 0, '      timeout-minutes: 30');
      }
    }
    return { descricao: 'timeout-minutes: 30 adicionado', conteudo: newLines.join('\n') };
  }
};

export const autofixPermissions: DeteccaoCustom = {
  nome: 'autofix-permissions',
  descricao: 'Adiciona permissions mínimas ao workflow',
  severidade: 'media',
  testar: (workflow) => {
    const probs: Array<{ tipo: string; descricao: string; linha: number; sugestao: string; severidade: 'baixa' | 'media' | 'alta' | 'critica' }> = [];
    if (!workflow || typeof workflow !== 'object') return probs;
    if (!Object.keys(workflow).includes('permissions')) {
      probs.push({ tipo: 'workflow-sem-permissions', descricao: 'Workflow sem permissions explícitas', linha: 1, sugestao: 'Adicionar permissions mínimas', severidade: 'media' });
    }
    return probs;
  },
  corrigir: (conteudo) => {
    if (conteudo.includes('permissions:')) return null;
    const permissionsBlock = `permissions:
  contents: read
  actions: read
  pull-requests: read
`;
    if (conteudo.startsWith('name:')) {
      return { descricao: 'Permissions mínimas adicionadas', conteudo: permissionsBlock + conteudo };
    }
    return null;
  }
};

export const autofixConcurrency: DeteccaoCustom = {
  nome: 'autofix-concurrency',
  descricao: 'Adiciona grupo de concurrency ao workflow',
  severidade: 'baixa',
  testar: (workflow) => {
    const probs: Array<{ tipo: string; descricao: string; linha: number; sugestao: string; severidade: 'baixa' | 'media' | 'alta' | 'critica' }> = [];
    if (!workflow || typeof workflow !== 'object') return probs;
    const hasJobs = Object.keys(workflow).includes('jobs');
    const jobs = (workflow as { jobs?: Record<string, unknown> }).jobs;
    const jobCount = jobs ? Object.keys(jobs).length : 0;
    if (hasJobs && jobCount > 1 && !Object.keys(workflow).includes('concurrency')) {
      probs.push({ tipo: 'workflow-sem-concurrency', descricao: 'Workflow com múltiplos jobs sem concurrency', linha: 1, sugestao: 'Adicionar concurrency group', severidade: 'baixa' });
    }
    return probs;
  },
  corrigir: (conteudo) => {
    if (conteudo.includes('concurrency:')) return null;
    const concurrencyBlock = `concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true
`;
    if (conteudo.startsWith('name:')) {
      return { descricao: 'Concurrency group adicionado', conteudo: concurrencyBlock + '\n' + conteudo };
    }
    return null;
  }
};

export const autofixBranchFilter: DeteccaoCustom = {
  nome: 'autofix-branch-filter',
  descricao: 'Adiciona filtro de branches ao trigger push',
  severidade: 'media',
  testar: (workflow) => {
    const probs: Array<{ tipo: string; descricao: string; linha: number; sugestao: string; severidade: 'baixa' | 'media' | 'alta' | 'critica' }> = [];
    if (!workflow || typeof workflow !== 'object') return probs;
    const on = (workflow as { on?: unknown }).on;
    if (!on) return probs;
    const onObj = typeof on === 'string' ? { [on]: {} } : (on as Record<string, unknown>);
    if (onObj.push && !onObj.push.branches) {
      probs.push({ tipo: 'push-sem-branches-filter', descricao: 'Trigger push sem filtro de branches', linha: 1, sugestao: 'Adicionar branches: [main, develop]', severidade: 'media' });
    }
    return probs;
  },
  corrigir: (conteudo) => {
    if (conteudo.includes('branches:')) return null;
    const fixed = conteudo.replace(/(on:\s*push\s*\n)/, '$1    branches: [main, develop]\n');
    return fixed !== conteudo ? { descricao: 'Branches filter adicionado', conteudo: fixed } : null;
  }
};

export const autofixFailFast: DeteccaoCustom = {
  nome: 'autofix-fail-fast',
  descricao: 'Adiciona fail-fast explícito em matrix',
  severidade: 'baixa',
  testar: (workflow) => {
    const probs: Array<{ tipo: string; descricao: string; linha: number; sugestao: string; severidade: 'baixa' | 'media' | 'alta' | 'critica' }> = [];
    if (!workflow || typeof workflow !== 'object') return probs;
    const wf = workflow as { jobs?: Record<string, { strategy?: { matrix?: unknown; 'fail-fast'?: unknown } }> };
    if (!wf.jobs) return probs;
    for (const [jobId, job] of Object.entries(wf.jobs)) {
      if (job?.strategy?.matrix && job.strategy['fail-fast'] === undefined) {
        probs.push({ tipo: 'matrix-sem-fail-fast', descricao: `Job ${jobId} com matrix sem fail-fast explícito`, linha: 1, sugestao: 'Adicionar fail-fast: false', severidade: 'baixa' });
      }
    }
    return probs;
  },
  corrigir: (conteudo) => {
    if (conteudo.includes('fail-fast:')) return null;
    const fixed = conteudo.replace(/(strategy:\s*\n\s*matrix:)/, '$1\n        fail-fast: false');
    return fixed !== conteudo ? { descricao: 'fail-fast: false adicionado', conteudo: fixed } : null;
  }
};

export function aplicarAutoFixes(conteudo: string): { conteudo: string; correcoes: string[] } {
  const correcoes: string[] = [];
  let novoConteudo = conteudo;
  const fixers = [
    autofixActionDesatualizada,
    autofixPermissions,
    autofixConcurrency,
    autofixBranchFilter,
    autofixTimeout,
    autofixFailFast
  ];

  for (const fixer of fixers) {
    if (fixer.corrigir) {
      const resultado = fixer.corrigir(novoConteudo);
      if (resultado) {
        novoConteudo = resultado.conteudo;
        correcoes.push(resultado.descricao);
      }
    }
  }
  return { conteudo: novoConteudo, correcoes };
}