// SPDX-License-Identifier: MIT

/**
 * @fileoverview Analista de qualidade para workflows do GitHub Actions (v0.7.0)
 *
 * @module @prometheus/analista-github-actions
 */

import type { Analista, ContextoExecucao, Ocorrencia, ProblemaWorkflow } from '@prometheus';
import { criarOcorrencia } from '@prometheus';
import { parseDocument } from 'yaml';

export interface DeteccaoCustom {
  nome: string;
  descricao: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  testar: (workflow: unknown, context: { conteudo: string, caminhos: string[] }) => ProblemaWorkflow[] | Promise<ProblemaWorkflow[]>;
  corrigir?: (workflow: string) => { conteudo: string; descricao: string } | null;
}

interface WorkflowStep {
  name?: string;
  uses?: string;
  with?: {
    path?: string;
    'fetch-depth'?: number | string;
    'cache-from'?: string;
    'cache-to'?: string;
    [k: string]: unknown;
  };
  env?: Record<string, unknown>;
  run?: string;
}

interface WorkflowJob {
  name?: string;
  needs?: string | string[];
  strategy?: { matrix?: unknown; 'fail-fast'?: unknown };
  container?: unknown;
  'runs-on'?: string | string[];
  'timeout-minutes'?: number;
  if?: string;
  steps?: WorkflowStep[];
  permissions?: Record<string, unknown>;
}

interface WorkflowNode extends Record<string, unknown> {
  name?: string;
  on?: unknown;
  env?: Record<string, unknown>;
  concurrency?: unknown;
  permissions?: Record<string, unknown>;
  container?: unknown;
  strategy?: { matrix?: unknown; 'fail-fast'?: unknown };
  jobs?: Record<string, WorkflowJob>;
  steps?: WorkflowStep[];
  uses?: string;
  run?: string;
}

const detectoresRegistrados: DeteccaoCustom[] = [];

export function registrarDetectorGithubActions(detector: DeteccaoCustom): void {
  detectoresRegistrados.push(detector);
}

const TRIGGERS_VALIDOS = [
  'push', 'pull_request', 'schedule', 'workflow_dispatch', 'workflow_call',
  'release', 'tag', 'issue_comment', 'issues', 'pull_request_review',
  'pull_request_target', 'repository_dispatch', 'create', 'delete'
];

const RUNNERS_SEGUROS = ['ubuntu-latest', 'windows-latest', 'macos-latest', 'ubuntu-22.04', 'ubuntu-20.04'];

export const analistaGithubActions: Analista = {
  nome: 'github-actions',
  categoria: 'workflows',
  descricao: 'Analista avançado de workflows do GitHub Actions com suporte a plugins',
  test: (relPath: string) => relPath.startsWith('.github/workflows/') || relPath.endsWith('.yml') || relPath.endsWith('.yaml'),

  async aplicar(conteudo: string, relPath: string, _ast: unknown = null, _fc?: string, contexto?: ContextoExecucao): Promise<Ocorrencia[]> {
    const ocorrencias: Ocorrencia[] = [];
    try {
      const doc = parseDocument(conteudo);
      const workflow = doc.toJS();
      const problemas = await executarDetectoresNativos(workflow, conteudo);

      const caminhos = contexto?.arquivos.map(f => f.relPath) || [];
      const plugResults = await Promise.all(detectoresRegistrados.map(d => Promise.resolve(d.testar(workflow, { conteudo, caminhos })).catch(() => [])));

      const todos = [...problemas, ...plugResults.flat()];

      for (const p of todos) {
        ocorrencias.push(criarOcorrencia({
          relPath,
          tipo: `GITHUB_ACTIONS_${p.tipo.toUpperCase().replace(/-/g, '_')}`,
          mensagem: p.descricao,
          linha: p.linha || 1,
          coluna: 1,
          sugestao: p.sugestao || '',
          nivel: p.severidade === 'critica' || p.severidade === 'alta' ? 'erro' : (p.severidade === 'media' ? 'aviso' : 'info'),
          origem: 'analista-github-actions'
        }));
      }

      const triggerIssues = analisarTriggers(workflow, conteudo);
      ocorrencias.push(...triggerIssues.map(p => criarOcorrencia({
        relPath,
        tipo: `GITHUB_ACTIONS_${p.tipo.toUpperCase().replace(/-/g, '_')}`,
        mensagem: p.descricao,
        linha: p.linha || 1,
        nivel: p.severidade === 'critica' || p.severidade === 'alta' ? 'erro' : (p.severidade === 'media' ? 'aviso' : 'info'),
        origem: 'analista-github-actions',
        sugestao: p.sugestao
      })));

      const envIssues = analisarEnvironmentVariables(workflow, conteudo);
      ocorrencias.push(...envIssues.map(p => criarOcorrencia({
        relPath,
        tipo: `GITHUB_ACTIONS_${p.tipo.toUpperCase().replace(/-/g, '_')}`,
        mensagem: p.descricao,
        linha: p.linha || 1,
        nivel: p.severidade === 'critica' || p.severidade === 'alta' ? 'erro' : (p.severidade === 'media' ? 'aviso' : 'info'),
        origem: 'analista-github-actions',
        sugestao: p.sugestao
      })));

      const runnerIssues = analisarRunners(workflow, conteudo);
      ocorrencias.push(...runnerIssues.map(p => criarOcorrencia({
        relPath,
        tipo: `GITHUB_ACTIONS_${p.tipo.toUpperCase().replace(/-/g, '_')}`,
        mensagem: p.descricao,
        linha: p.linha || 1,
        nivel: p.severidade === 'critica' || p.severidade === 'alta' ? 'erro' : (p.severidade === 'media' ? 'aviso' : 'info'),
        origem: 'analista-github-actions',
        sugestao: p.sugestao
      })));

      const concurrencyIssues = analisarConcurrency(workflow, conteudo);
      ocorrencias.push(...concurrencyIssues.map(p => criarOcorrencia({
        relPath,
        tipo: `GITHUB_ACTIONS_${p.tipo.toUpperCase().replace(/-/g, '_')}`,
        mensagem: p.descricao,
        linha: p.linha || 1,
        nivel: p.severidade === 'critica' || p.severidade === 'alta' ? 'erro' : (p.severidade === 'media' ? 'aviso' : 'info'),
        origem: 'analista-github-actions',
        sugestao: p.sugestao
      })));

    } catch {
      // Basic regex fallback if YAML fails
    }
    return ocorrencias;
  },
};

export const analistaGithubActionsGlobal: Analista = {
  nome: 'github-actions-global',
  categoria: 'workflows',
  descricao: 'Governança Global do GitHub',
  test: () => false,
  async aplicar(_c, _p, _a, _f, ctx?: ContextoExecucao): Promise<Ocorrencia[]> {
    if (!ctx) return [];
    const ores: Ocorrencia[] = [];
    const paths = ctx.arquivos.map(f => f.relPath);

    if (!paths.some(p => /CODEOWNERS/i.test(p))) {
      ores.push(criarOcorrencia({ tipo: 'GITHUB_ACTIONS_CODEOWNERS_MISSING', mensagem: 'CODEOWNERS faltando', relPath: '.github/', linha: 0, coluna: 0, nivel: 'info', origem: 'analista-github-actions-global' }));
    }

    const readme = ctx.arquivos.find(f => /README\.md/i.test(f.relPath));
    const content = readme ? (readme.content as string | null) || '' : '';
    if (readme && !/Code of Conduct|Código de Conduta/i.test(content)) {
      ores.push(criarOcorrencia({ tipo: 'GITHUB_ACTIONS_DOC_GOVERNANCE_MISSING', mensagem: 'README sem Código de Conduta', relPath: readme.relPath, linha: 1, coluna: 0, nivel: 'info', origem: 'analista-github-actions-global' }));
    }

    if (!paths.some(p => /stale/i.test(p))) {
      ores.push(criarOcorrencia({ tipo: 'GITHUB_ACTIONS_STALE_BOT_MISSING', mensagem: 'Stale bot faltando', relPath: '.github/workflows/', linha: 0, coluna: 0, nivel: 'info', origem: 'analista-github-actions-global' }));
    }

    if (!paths.some(p => /release|deploy/i.test(p))) {
      ores.push(criarOcorrencia({ tipo: 'GITHUB_ACTIONS_RELEASE_AUTOMATION_MISSING', mensagem: 'Release automation faltando', relPath: '.github/workflows/', linha: 0, coluna: 0, nivel: 'info', origem: 'analista-github-actions-global' }));
    }

    return ores;
  }
};

async function executarDetectoresNativos(wf: unknown, raw: string): Promise<ProblemaWorkflow[]> {
  const probs: ProblemaWorkflow[] = [];
  if (!wf) return probs;

  const candidates = Array.isArray(wf) ? wf : [wf];

  for (const item of candidates) {
    if (typeof item === 'object' && item !== null) {
      analisarEstrutura(item as WorkflowNode, probs);
    }
  }

  if (/sudo\s+/.test(raw)) {
    probs.push({ tipo: 'uso-sudo', descricao: 'Uso de sudo detectado', severidade: 'alta' });
  }
  if (raw.includes('pull_request_target:')) {
    probs.push({ tipo: 'estrutura-workflow', descricao: 'Uso de pull_request_target - pode ser perigoso', severidade: 'alta', sugestao: 'Usar pull_request se possível' });
  }

  return probs;
}

function analisarTriggers(wf: unknown, raw: string): ProblemaWorkflow[] {
  const probs: ProblemaWorkflow[] = [];
  if (!wf || typeof wf !== 'object') return probs;

  const on = (wf as WorkflowNode).on;
  if (!on) {
    probs.push({ tipo: 'workflow-sem-trigger', descricao: 'Workflow sem trigger definido', severidade: 'alta' });
    return probs;
  }

  const onObj = typeof on === 'string' ? { [on]: {} } : (on as Record<string, unknown>);

  for (const trigger of Object.keys(onObj)) {
    const triggerLower = trigger.toLowerCase();
    if (!TRIGGERS_VALIDOS.includes(triggerLower)) {
      probs.push({ tipo: 'trigger-desconhecido', descricao: `Trigger '${trigger}' não reconhecido`, severidade: 'media' });
    }

    if (triggerLower === 'push') {
      const pushConfig = onObj[trigger] as Record<string, unknown> | undefined;
      if (!pushConfig || !pushConfig.branches) {
        probs.push({ tipo: 'push-sem-branch-filter', descricao: 'Trigger push sem filtro de branches - executa em todos', severidade: 'media', sugestao: 'Adicionar branches: [main, develop] para evitar execuções desnecessárias' });
      }
    }

    if (triggerLower === 'pull_request') {
      const prConfig = onObj[trigger] as Record<string, unknown> | undefined;
      if (prConfig && Array.isArray(prConfig.branches) && prConfig.branches.includes('*')) {
        probs.push({ tipo: 'pr-com-wildcard-branches', descricao: 'Pull request com wildcard em branches', severidade: 'baixa' });
      }
    }

    if (triggerLower === 'schedule') {
      if (!raw.includes('cron:')) {
        probs.push({ tipo: 'schedule-sem-cron', descricao: 'Schedule trigger sem cron definido', severidade: 'media' });
      }
    }
  }

  return probs;
}

function analisarEnvironmentVariables(wf: unknown, raw: string): ProblemaWorkflow[] {
  const probs: ProblemaWorkflow[] = [];
  if (!wf || typeof wf !== 'object') return probs;

  const wfObj = wf as WorkflowNode;

  if (wfObj.env) {
    for (const [k, v] of Object.entries(wfObj.env)) {
      if (/(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL)/i.test(k)) {
        if (typeof v === 'string' && !v.includes('${{') && !v.includes('secrets.')) {
          probs.push({ tipo: 'env-hardcoded-secret', descricao: `Variável de ambiente '${k}' contém segredo hardcoded`, severidade: 'critica', sugestao: 'Usar ${{ secrets.NOME_DO_SECRET }}' });
        }
      }
    }
  }

  const envMatches = raw.match(/\${{\s*secrets\.\w+/g);
  if (envMatches) {
    for (const match of envMatches) {
      const secretName = match.match(/secrets\.(\w+)/)?.[1];
      if (secretName && !raw.includes(`env:`) && !raw.includes('secret:')) {
        probs.push({ tipo: 'secret-sem-env', descricao: `Secret '${secretName}' usado sem variável de ambiente`, severidade: 'baixa' });
      }
    }
  }

  return probs;
}

function analisarRunners(wf: unknown, _raw: string): ProblemaWorkflow[] {
  const probs: ProblemaWorkflow[] = [];
  if (!wf || typeof wf !== 'object') return probs;

  const wfObj = wf as WorkflowNode;

  if (wfObj.jobs) {
    for (const [jobId, job] of Object.entries(wfObj.jobs)) {
      if (!job) continue;
      const runsOn = job['runs-on'];
      if (!runsOn) {
        probs.push({ tipo: 'job-sem-runs-on', descricao: `Job '${jobId}' sem runs-on definido`, severidade: 'critica' });
      } else {
        const runnerStr = Array.isArray(runsOn) ? runsOn.join(',') : String(runsOn);
        if (!RUNNERS_SEGUROS.some(r => runnerStr.includes(r)) && !runnerStr.includes('ubuntu-') && !runnerStr.includes('windows-') && !runnerStr.includes('macos-')) {
          const isSelfHosted = runnerStr.includes('self-hosted') || runnerStr.includes('ubuntu-18.04');
          if (isSelfHosted) {
            probs.push({ tipo: 'runner-desatualizado', descricao: `Runner '${runnerStr}' pode estar desatualizado`, severidade: 'media', sugestao: 'Usar ubuntu-latest ou ubuntu-22.04' });
          }
        }
      }

      if (job['timeout-minutes'] === 0) {
        probs.push({ tipo: 'job-timeout-zero', descricao: `Job '${jobId}' com timeout-minutes: 0`, severidade: 'alta', sugestao: 'Definir timeout razoável (ex: 30 ou 60 minutos)' });
      }
    }
  }

  return probs;
}

function analisarConcurrency(wf: unknown, _raw: string): ProblemaWorkflow[] {
  const probs: ProblemaWorkflow[] = [];
  if (!wf || typeof wf !== 'object') return probs;

  const wfObj = wf as WorkflowNode;

  if (!wfObj.concurrency && wfObj.jobs) {
    const jobCount = Object.keys(wfObj.jobs).length;
    if (jobCount > 1) {
      probs.push({ tipo: 'workflow-sem-concurrency', descricao: 'Workflow com múltiplos jobs sem grupo de concurrency', severidade: 'baixa', sugestao: 'Adicionar concurrency para cancelar workflows anteriores em pushes subsequentes' });
    }
  }

  if (wfObj.concurrency) {
    const concurrency = wfObj.concurrency;
    if (typeof concurrency === 'string' && !concurrency.includes('${{')) {
      probs.push({ tipo: 'concurrency-hardcoded', descricao: 'Concurrency group hardcoded - pode causar conflitos', severidade: 'media', sugestao: 'Usar ${{ github.workflow }}-${{ github.ref }} para groups únicos por branch' });
    }
  }

  return probs;
}

function analisarEstrutura(wf: WorkflowNode, probs: ProblemaWorkflow[]) {
  if (wf.container && typeof wf.container === 'string') {
    probs.push({ tipo: 'container-sem-user', descricao: 'Container sem user - executa como root', severidade: 'media' });
  }

  if (wf.strategy?.matrix && wf.strategy['fail-fast'] === undefined) {
    probs.push({ tipo: 'matrix-sem-fail-fast', descricao: 'Matrix sem fail-fast - falha pode parar todos os jobs', severidade: 'baixa', sugestao: 'Adicionar fail-fast: true (padrão) ou false para continuar em falha' });
  }

  for (const [k, v] of Object.entries(wf)) {
    if (/(KEY|TOKEN|SECRET|PASSWORD)/i.test(k) && v && typeof v !== 'object' && !String(v).includes('${{')) {
      probs.push({ tipo: 'env-sensivel', descricao: `Secret hardcoded em ${k}`, severidade: 'critica' });
    }
  }

  if (wf.jobs) {
    const jobEntries = Object.entries(wf.jobs);

    for (const [id, job] of jobEntries) {
      if (job?.strategy?.matrix && job.strategy['fail-fast'] === undefined) {
        probs.push({ tipo: 'matrix-sem-fail-fast', descricao: `Job ${id} sem fail-fast`, severidade: 'baixa' });
      }
      if (job?.container && typeof job.container === 'string') {
        probs.push({ tipo: 'container-sem-user', descricao: 'Container rodando como root', severidade: 'media' });
      }

      if (/^(job\d+|step\d+|build\d*|test\d*|j\d+)$/i.test(id) && !job?.name) {
        probs.push({ tipo: 'job-sem-nome', descricao: `Job '${id}' usa ID genérico sem campo 'name'`, severidade: 'baixa', sugestao: 'Usar nomes semânticos como build-backend, test-integration' });
      }

      if (job?.steps) {
        for (const s of job.steps) analisarStep(s, probs);
        analisarStepsSemNome(job.steps, probs);
      }
    }

    analisarParalelismo(jobEntries, probs);
    analisarDownloadArtifacts(jobEntries, probs);
    analisarMultiplasInstalacoesDeps(jobEntries, probs);
  }

  if (wf.steps && Array.isArray(wf.steps)) {
    for (const s of wf.steps) analisarStep(s, probs);
    analisarStepsSemNome(wf.steps, probs);
  }

  if (wf.uses || wf.run) analisarStep(wf as WorkflowStep, probs);
}

function analisarStep(s: WorkflowStep, probs: ProblemaWorkflow[]) {
  if (!s) return;

  if (s.uses && /@v\d+/.test(s.uses) && !s.uses.startsWith('actions/') && !s.uses.startsWith('docker/')) {
    probs.push({ tipo: 'action-sem-sha-pinning', descricao: `Action '${s.uses}' usa versão tag sem SHA pinning`, severidade: 'media', sugestao: 'Usar SHA completo para segurança: actions/checkout@sha256... ' });
  }

  if (s.uses?.includes('upload-artifact') && s.with?.path?.includes('.env')) {
    probs.push({ tipo: 'upload-sensivel', descricao: 'Upload de arquivo .env detectado', severidade: 'critica', sugestao: 'Remover .env do path de upload ou usar .gitignore' });
  }

  if (s.env) {
    for (const [k, v] of Object.entries(s.env)) {
      if (/(KEY|TOKEN|SECRET|PASSWORD)/i.test(k) && v && typeof v !== 'object' && !String(v).includes('${{')) {
        probs.push({ tipo: 'env-sensivel-step', descricao: `Env ${k} hardcoded no step`, severidade: 'critica' });
      }
    }
  }

  if (s.run && /\$\{\{\s*github\.event\./.test(s.run)) {
    probs.push({ tipo: 'script-injection', descricao: 'Uso de github.event sem sanitização - possível injection', severidade: 'alta', sugestao: 'Validar entrada antes de usar em comandos shell' });
  }

  if (s.uses && /docker\/build-push-action/.test(s.uses)) {
    const hasCacheFrom = s.with?.['cache-from'] !== undefined;
    const hasCacheTo = s.with?.['cache-to'] !== undefined;
    if (!hasCacheFrom && !hasCacheTo) {
      probs.push({ tipo: 'docker-sem-layer-cache', descricao: 'Docker build sem cache de layers configurado', severidade: 'media', sugestao: 'Adicionar cache-from e cache-to para otimizar builds Docker' });
    }
  }

  if (s.uses && /actions\/checkout/.test(s.uses) && s.with) {
    const fd = s.with['fetch-depth'];
    if (fd === 0 || fd === '0') {
      probs.push({ tipo: 'fetch-depth-desnecessario', descricao: 'checkout com fetch-depth: 0 baixa todo o histórico', severidade: 'baixa', sugestao: 'Usar fetch-depth: 1 (default) a menos que precise do histórico completo' });
    }
  }

  if (s['if'] && s['if'].includes('always()')) {
    probs.push({ tipo: 'step-always-execute', descricao: 'Step com if: always() executa mesmo em falha', severidade: 'baixa', sugestao: 'Usar if: ${{ !cancelled() }} ou if: ${{ failure() }} conforme necessidade' });
  }
}

function analisarStepsSemNome(steps: WorkflowStep[], probs: ProblemaWorkflow[]) {
  for (const s of steps) {
    if (!s || s.name) continue;
    if (s.uses || s.run) {
      const ident = s.uses ? `uses: ${s.uses}` : 'run command';
      probs.push({ tipo: 'step-sem-nome', descricao: `Step sem campo 'name' (${ident})`, severidade: 'baixa', sugestao: 'Adicionar campo name: para melhor legibilidade nos logs do Actions' });
    }
  }
}

function analisarParalelismo(jobEntries: [string, WorkflowJob][], probs: ProblemaWorkflow[]) {
  if (jobEntries.length < 3) return;

  let totalWithNeeds = 0;
  for (const [, job] of jobEntries) {
    if (job?.needs) totalWithNeeds++;
  }

  if (totalWithNeeds === jobEntries.length - 1) {
    probs.push({ tipo: 'build-sem-parallelismo', descricao: 'Jobs em cadeia linear — considere paralelizar jobs independentes', severidade: 'media', sugestao: 'Remover dependências (needs) desnecessárias para permitir execução paralela' });
  }
}

function analisarDownloadArtifacts(jobEntries: [string, WorkflowJob][], probs: ProblemaWorkflow[]) {
  let downloadCount = 0;
  for (const [, job] of jobEntries) {
    if (!job?.steps) continue;
    for (const s of job.steps) {
      if (s.uses && /download-artifact/.test(s.uses)) downloadCount++;
    }
  }
  if (downloadCount >= 3) {
    probs.push({ tipo: 'download-artifacts-desnecessario', descricao: `${downloadCount} download-artifact encontrados — considere consolidar artifacts`, severidade: 'baixa', sugestao: 'Consolidar artifacts ou usar cache compartilhado' });
  }
}

function analisarMultiplasInstalacoesDeps(jobEntries: [string, WorkflowJob][], probs: ProblemaWorkflow[]) {
  let installCount = 0;
  let hasCacheStep = false;

  for (const [, job] of jobEntries) {
    if (!job?.steps) continue;
    let jobHasInstall = false;
    for (const s of job.steps) {
      if (s.run && /\b(npm\s+(ci|install)|yarn\s+install|pnpm\s+install)\b/.test(s.run)) {
        jobHasInstall = true;
      }
      if (s.uses && /actions\/cache/.test(s.uses)) {
        hasCacheStep = true;
      }
    }
    if (jobHasInstall) installCount++;
  }

  if (installCount >= 2 && !hasCacheStep) {
    probs.push({ tipo: 'multiplas-instalacoes-deps', descricao: `Instalação de dependências em ${installCount} jobs sem cache compartilhado`, severidade: 'media', sugestao: 'Usar actions/cache ou artifact de node_modules para evitar instalações duplicadas' });
  }
}
