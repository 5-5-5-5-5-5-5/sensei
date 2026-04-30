// SPDX-License-Identifier: MIT
/**
 * Sistema de Pool de Workers para Processamento Paralelo de Arquivos
 *
 * Permite processar múltiplos arquivos em paralelo usando Worker Threads,
 * melhorando a performance em projetos grandes com muitos arquivos.
 *
 * Inteligente e adaptativo:
 * - Batch size dinâmico baseado no tamanho do projeto
 * - Auto-tuning de workers baseado na carga do sistema
 * - Resiliente para projetos pequenos e grandes
 */

import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';

import type { ContextoExecucao, FileEntryWithAst, MetricaAnalista, Ocorrencia, ProcessFilesResult, Tecnica, WorkerPoolOptions, WorkerResult, WorkerTask } from '@projeto-types';
import { ocorrenciaErroAnalista } from '@prometheus';

import { config } from '../config/config.js';
import { log } from '../messages/index.js';

// ESM compatível: __dirname não existe em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Re-exporta os tipos para compatibilidade
export type { ProcessFilesResult, WorkerPoolOptions, WorkerResult, WorkerTask };

interface WorkerMetrics {
  workerId: number;
  startTime: number;
  endTime?: number;
  duration?: number;
  filesProcessed: number;
  errors: number;
  memoryUsage?: number;
}

interface PoolMetrics {
  totalFiles: number;
  totalWorkers: number;
  batchSize: number;
  avgBatchTime: number;
  totalDuration: number;
  peakMemory: number;
  workerMetrics: WorkerMetrics[];
}

const MIN_FILES_FOR_PARALLEL = 20;
const _SMALL_PROJECT_THRESHOLD = 100;
const _LARGE_PROJECT_THRESHOLD = 10000;

const DEFAULT_BATCH_SIZES = {
  small: 5,
  medium: 10,
  large: 20,
  xlarge: 30
};

const DEFAULT_WORKER_COUNTS = {
  small: 2,
  medium: 0,
  large: 0,
  xlarge: 0
};

export interface WorkerPoolConfig {
  strategy?: 'auto' | 'sequential' | 'parallel' | 'streaming';
  adaptive?: boolean;
  memoryThreshold?: number;
}

/**
 * Pool de workers para processamento paralelo de arquivos
 */
export class WorkerPool {
  private maxWorkers: number;
  private batchSize: number;
  private timeoutMs: number;
  private enabled: boolean;
  private activeWorkers = 0;
  private results: WorkerResult[] = [];
  private errors: string[] = [];
  private metrics: PoolMetrics = {
    totalFiles: 0,
    totalWorkers: 0,
    batchSize: 0,
    avgBatchTime: 0,
    totalDuration: 0,
    peakMemory: 0,
    workerMetrics: []
  };
  private projectSize: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  private currentBatchTimes: number[] = [];
  private strategy: 'auto' | 'sequential' | 'parallel' | 'streaming' = 'auto';
  private parseInline: boolean = true;
  private extensions: string[] = [];

  constructor(options: WorkerPoolOptions = {}) {
    this.projectSize = this.detectProjectSize();
    const optimalConfig = this.calculateOptimalConfig(options);

    this.maxWorkers = optimalConfig.maxWorkers;
    this.batchSize = optimalConfig.batchSize;
    this.timeoutMs = optimalConfig.timeoutMs;
    this.enabled = options.enabled ?? config.WORKER_POOL_ENABLED !== false;
    this.extensions = config.SCANNER_EXTENSOES_COM_AST || [];

    if (!this.enabled || !Worker) {
      this.enabled = false;
      log.info('Pool de workers desabilitado (Worker Threads não disponível)');
    }
  }

  /**
   * Detecta o tamanho do projeto baseado no número de arquivos
   */
  private detectProjectSize(): 'small' | 'medium' | 'large' | 'xlarge' {
    if (process.env.PROMETHEUS_PROJECT_SIZE) {
      const envSize = process.env.PROMETHEUS_PROJECT_SIZE.toLowerCase();
      if (['small', 'medium', 'large', 'xlarge'].includes(envSize)) {
        return envSize as 'small' | 'medium' | 'large' | 'xlarge';
      }
    }
    return 'medium';
  }

  /**
   * Calcula a configuração ideal baseado no tamanho do projeto e carga do sistema
   */
  private calculateOptimalConfig(options: WorkerPoolOptions): {
    maxWorkers: number;
    batchSize: number;
    timeoutMs: number;
  } {
    const cpus = os.cpus().length;
    const _memGB = os.totalmem() / (1024 * 1024 * 1024);
    const _freeMemGB = os.freemem() / (1024 * 1024 * 1024);

    let maxWorkers = options.maxWorkers ?? config.WORKER_POOL_MAX_WORKERS ?? DEFAULT_WORKER_COUNTS[this.projectSize];
    let batchSize = options.batchSize ?? config.WORKER_POOL_BATCH_SIZE ?? DEFAULT_BATCH_SIZES[this.projectSize];

    if (maxWorkers <= 0) {
      maxWorkers = cpus;
      if (this.projectSize === 'small') {
        maxWorkers = Math.min(cpus, DEFAULT_WORKER_COUNTS.small);
      } else if (this.projectSize === 'large') {
        maxWorkers = Math.max(2, cpus - 1);
      } else if (this.projectSize === 'xlarge') {
        maxWorkers = Math.min(cpus, Math.max(4, cpus - 2));
      }
    }

    const envBatchSize = Number(process.env.PROMETHEUS_WORKER_BATCH_SIZE) || 0;
    if (envBatchSize > 0) {
      batchSize = envBatchSize;
    } else if (this.projectSize === 'small') {
      batchSize = Math.max(1, Math.min(batchSize, 5));
    } else if (this.projectSize === 'large') {
      batchSize = Math.min(20, batchSize * 2);
    } else if (this.projectSize === 'xlarge') {
      batchSize = Math.min(30, batchSize * 3);
    }

    let timeoutMs = options.timeoutMs ?? config.ANALISE_TIMEOUT_POR_ANALISTA_MS;
    const envTimeout = Number(process.env.PROMETHEUS_MAX_ANALYST_TIMEOUT_MS) || 0;
    if (envTimeout > 0) {
      timeoutMs = Math.min(timeoutMs, envTimeout);
    } else if (process.env.NODE_ENV === 'production') {
      timeoutMs = Math.min(timeoutMs, 10000);
    } else if (this.projectSize === 'xlarge') {
      timeoutMs = Math.max(timeoutMs, 60000);
    }

    return { maxWorkers, batchSize, timeoutMs };
  }

  /**
   * Ajusta dinamicamente o batch size baseado no desempenho
   */
  private adaptBatchSize(duration: number, fileCount: number): void {
    if (this.currentBatchTimes.length < 3) {
      this.currentBatchTimes.push(duration);
      return;
    }

    this.currentBatchTimes.shift();
    this.currentBatchTimes.push(duration);

    const avgTime = this.currentBatchTimes.reduce((a, b) => a + b, 0) / this.currentBatchTimes.length;
    const filesPerSecond = fileCount / (avgTime / 1000);

    if (filesPerSecond < 50 && this.batchSize > 5) {
      this.batchSize = Math.max(5, Math.floor(this.batchSize * 0.8));
    } else if (filesPerSecond > 200 && this.batchSize < 50) {
      this.batchSize = Math.min(50, Math.floor(this.batchSize * 1.2));
    }
  }

  /**
   * Retorna métricas do pool
   */
  getMetrics(): PoolMetrics {
    return { ...this.metrics };
  }

  /**
   * Estima memória necessária para o processamento
   */
  private estimateMemoryUsage(fileCount: number): number {
    const avgFileSizeKB = 50;
    const perFileMemoryKB = avgFileSizeKB * 3;
    return (fileCount * perFileMemoryKB) / (1024 * 1024);
  }

  /**
   * Determina a estratégia de processamento baseada no tamanho do projeto
   */
  private determineStrategy(fileCount: number): 'sequential' | 'parallel' | 'streaming' {
    const freeMemGB = os.freemem() / (1024 * 1024 * 1024);
    const totalMemGB = os.totalmem() / (1024 * 1024 * 1024);
    const memPressure = freeMemGB / totalMemGB;

    if (fileCount < MIN_FILES_FOR_PARALLEL) {
      return 'sequential';
    }

    if (fileCount > 10000 || memPressure < 0.2) {
      return 'streaming';
    }

    return 'parallel';
  }

  /**
   * Processa arquivos usando pool de workers
   */
  async processFiles(files: FileEntryWithAst[], techniques: Tecnica[], context: ContextoExecucao): Promise<ProcessFilesResult> {
    this.metrics.totalFiles = files.length;
    this.metrics.batchSize = this.batchSize;
    this.metrics.totalWorkers = this.maxWorkers;

    this.strategy = this.determineStrategy(files.length);

    const estimatedMemory = this.estimateMemoryUsage(files.length);
    const freeMemGB = os.freemem() / (1024 * 1024 * 1024);

    if (!this.enabled || this.strategy === 'sequential' || files.length < MIN_FILES_FOR_PARALLEL) {
      log.info(` Processamento sequencial (${files.length} arquivos, estratégia: ${this.strategy})`);
      return this.processSequentially(files, techniques, context);
    }

    if (estimatedMemory > freeMemGB * 0.5) {
      log.aviso(` Memória limitada detectado (${freeMemGB.toFixed(1)}GB livre). Reduzindo workers.`);
      this.maxWorkers = Math.max(1, Math.floor(this.maxWorkers * 0.5));
      this.batchSize = Math.max(1, Math.floor(this.batchSize * 0.5));
    }

    const startHora = performance.now();
    const batches = this.createBatches(files);
    const nonGlobalTechniques = techniques.filter(t => !t.global);
    log.info(` Processamento ${this.strategy}: ${this.maxWorkers} workers, ${batches.length} lotes de ${this.batchSize} arquivos`);
    log.info(` Projeto classificado como: ${this.projectSize} (~${files.length} arquivos, ~${estimatedMemory.toFixed(1)}MB estimado)`);

    // Processa lotes globais primeiro
    const globalTechniques = techniques.filter(t => t.global);
    if (globalTechniques.length > 0) {
      await this.processGlobalTechniques(globalTechniques, context);
    }

    // Processa lotes de arquivos em paralelo
    await this.processBatches(batches, nonGlobalTechniques, context);
    const duration = performance.now() - startHora;
    const totalOccurrences = this.results.reduce((sum, r) => sum + r.occurrences.length, 0);
    const totalMetricas = this.results.flatMap(r => r.metrics);

    this.metrics.totalDuration = duration;
    this.metrics.avgBatchTime = batches.length > 0 ? duration / batches.length : 0;
    this.metrics.peakMemory = process.memoryUsage().heapUsed / (1024 * 1024);

    const filesPerSecond = (files.length / duration) * 1000;
    log.info(` Processamento concluído: ${Math.round(duration)}ms (${filesPerSecond.toFixed(1)} arquivos/seg)`);
    log.info(` ${this.results.length} workers, ${files.length} arquivos, ${totalOccurrences} ocorrências`);

    const totalCacheHits = this.results.reduce((sum, r) => sum + (r.cacheStats?.hits || 0), 0);
    const totalCacheMisses = this.results.reduce((sum, r) => sum + (r.cacheStats?.misses || 0), 0);
    if (totalCacheHits > 0 || totalCacheMisses > 0) {
      log.info(` Cache AST: ${totalCacheHits} hits, ${totalCacheMisses} misses`);
    }

    return {
      occurrences: this.results.flatMap(r => r.occurrences),
      metrics: totalMetricas,
      totalProcessed: files.length,
      duration,
      cacheStats: { hits: totalCacheHits, misses: totalCacheMisses }
    };
  }

  /**
   * Cria lotes de arquivos para processamento paralelo
   */
  private createBatches(files: FileEntryWithAst[]): FileEntryWithAst[][] {
    const batches: FileEntryWithAst[][] = [];
    for (let i = 0; i < files.length; i += this.batchSize) {
      batches.push(files.slice(i, i + this.batchSize));
    }
    return batches;
  }

  /**
   * Processa técnicas globais (não paralelizáveis)
   */
  private async processGlobalTechniques(techniques: Tecnica[], context: ContextoExecucao): Promise<void> {
    for (const technique of techniques) {
      try {
        const startHora = performance.now();
        const result = await this.executeTechniqueWithTimeout(technique, '',
          // conteúdo vazio para técnicas globais
          '[global]', null,
          // sem AST
          undefined,
          // sem fullPath
          context);
        if (result) {
          const occurrences = Array.isArray(result) ? result : [result];
          this.results.push({
            workerId: -1,
            // ID especial para global
            occurrences,
            metrics: [{
              nome: technique.nome || 'global',
              duracaoMs: performance.now() - startHora,
              ocorrencias: occurrences.length,
              global: true
            }],
            processedArquivos: 0,
            errors: [],
            duration: performance.now() - startHora
          });
        }
      } catch (error) {
        const err = error as Error;
        this.errors.push(`Erro em técnica global '${technique.nome}': ${err.message}`);
        this.results.push({
          workerId: -1,
          occurrences: [ocorrenciaErroAnalista({
            mensagem: `Falha na técnica global '${technique.nome}': ${err.message}`,
            relPath: '[execução global]',
            origem: technique.nome
          })],
          metrics: [],
          processedArquivos: 0,
          errors: [err.message],
          duration: 0
        });
      }
    }
  }

  /**
   * Processa lotes de arquivos em paralelo
   */
  private async processBatches(batches: FileEntryWithAst[][], techniques: Tecnica[], context: ContextoExecucao): Promise<void> {
    // Conjunto de promises ativas para controle fino (removemos quando conclu eddas)
    const activePromises = new Set<Promise<void>>();
    for (let i = 0; i < batches.length; i++) {
      // Espera até ter vaga para novo worker
      while (this.activeWorkers >= this.maxWorkers) {
        // Aguarda a primeira promise ativa resolver (libera capacidade)
        if (activePromises.size === 0) break;
        await Promise.race(Array.from(activePromises));
      }
      const p = this.processBatch(batches[i], techniques, context, i);
      activePromises.add(p);

      // Quando a promise terminar, remove do conjunto
      p.then(() => activePromises.delete(p)).catch(() => activePromises.delete(p));
    }

    // Aguarda todas as promises ativas terminarem
    await Promise.all(Array.from(activePromises));
  }

  /**
   * Processa um lote de arquivos em um worker
   */
  private async processBatch(files: FileEntryWithAst[], techniques: Tecnica[], context: ContextoExecucao, batchId: number): Promise<void> {
    this.activeWorkers++;
    try {
      const workerCaminho = path.join(__dirname, 'worker-executor.ts');

      // Serializar técnicas: remover funções (não podem ser clonadas para workers)
      const techniquesSerializaveis = techniques.map(t => {
        const techObj = t as unknown as Record<string, unknown>;
        const { aplicar: _aplicar, test, visitor: _visitor, ...rest } = techObj;
        // Salvar info sobre test para reconstruir no worker
        return {
          ...rest,
          _hasTest: typeof test === 'function',
          _testSource: typeof test === 'function' ? test.toString() : null
        };
      });

      // Calcula timeout adaptativo por lote baseado no tamanho médio dos arquivos
      const avgSize = files.reduce((s, f) => s + (f.content ? f.content.length : 0), 0) / Math.max(1, files.length);
      const sizeMultiplier = 1 + Math.min(4, avgSize / 50000);
      const batchTempoLimiteMs = Math.max(1000, Math.min(this.timeoutMs, Math.floor(this.timeoutMs * sizeMultiplier)));

      const useStreaming = this.strategy === 'streaming' || files.length > 100;

      const workerData: WorkerTask = {
        files,
        techniques: techniquesSerializaveis,
        context,
        workerId: batchId,
        timeoutMs: batchTempoLimiteMs,
        parseInline: this.parseInline,
        extensions: this.extensions
      };

      if (useStreaming) {
        workerData.batchSize = this.batchSize;
      }

      const worker = new Worker(workerCaminho, {
        workerData: workerData as unknown as WorkerTask
      });
      const workerKillMs = Math.max(30000, this.timeoutMs * 2 || 30000);
      const adjustedKillMs = Math.max(1000, Math.min(workerKillMs, batchTempoLimiteMs + 1000));
      const result = await new Promise<WorkerResult>((resolve, reject) => {
        let settled = false;
        // Timer para forçar término caso worker trave por muito tempo
        let killTimer: NodeJS.Timeout | null = setTimeout(() => {
          if (settled) return;
          settled = true;
          try {
            void worker.terminate();
          } catch {
            /* ignore */
          }
          // Log estruturado para kills (ajuda em observabilidade em produção)
          try {
            log.infoSemSanitizar(JSON.stringify({
              event: 'worker_killed',
              batchId,
              adjustedKillMs,
              reason: 'timeout'
            }));
          } catch { }
          reject(new Error(`Worker ${batchId} killed after ${adjustedKillMs}ms`));
        }, adjustedKillMs);
        worker.on('message', (msg: unknown) => {
          const m = msg as Record<string, unknown>;
          // Heartbeat: rearmar o kill timer
          if (m && m['type'] === 'heartbeat') {
            try {
              if (killTimer) clearTimeout(killTimer);
            } catch { }
            killTimer = setTimeout(() => {
              if (settled) return;
              settled = true;
              try {
                void worker.terminate();
              } catch { }
              try {
                log.infoSemSanitizar(JSON.stringify({
                  event: 'worker_killed',
                  batchId,
                  adjustedKillMs,
                  reason: 'heartbeat_timeout'
                }));
              } catch { }
              reject(new Error(`Worker ${batchId} killed after ${adjustedKillMs}ms (heartbeat timeout)`));
            }, adjustedKillMs);
            return;
          }
          if (settled) return;
          settled = true;
          try {
            if (killTimer) clearTimeout(killTimer);
          } catch { }
          // Normaliza a mensagem retornada pelo worker para o formato WorkerResult esperado
          try {
            const workerId = typeof m['workerId'] === 'number' ? m['workerId'] as number : batchId;
            const occurrences = Array.isArray(m['occurrences']) ? m['occurrences'] as Ocorrencia[] : Array.isArray(m['resultados']) ? m['resultados'] as Ocorrencia[] : [];
            const metrics = Array.isArray(m['metrics']) ? m['metrics'] as MetricaAnalista[] : [];
            const processedArquivos = typeof m['processedFiles'] === 'number' ? m['processedFiles'] as number : files.length || 0;
            const errors = Array.isArray(m['errors']) ? (m['errors'] as string[]).map(String) : m['erro'] ? [String(m['erro'])] : [];
            const duration = typeof m['duration'] === 'number' ? m['duration'] as number : 0;
            const cacheStats = m['cacheStats'] as { hits: number; misses: number } | undefined;
            const workerResultado: WorkerResult = {
              workerId,
              occurrences,
              metrics,
              processedArquivos,
              errors: errors as string[],
              duration,
              cacheStats
            };
            resolve(workerResultado);
          } catch (e) {
            reject(e);
          }
        });
        worker.on('error', err => {
          if (settled) return;
          settled = true;
          try {
            if (killTimer) clearTimeout(killTimer);
          } catch { }
          reject(err);
        });
        worker.on('exit', code => {
          if (settled) return;
          settled = true;
          try {
            if (killTimer) clearTimeout(killTimer);
          } catch { }
          if (code !== 0) {
            try {
              log.infoSemSanitizar(JSON.stringify({
                event: 'worker_exit_nonzero',
                batchId,
                code
              }));
            } catch { }
            reject(new Error(`Worker ${batchId} exited with code ${code}`));
          } else {
            resolve({
              workerId: batchId,
              occurrences: [],
              metrics: [],
              processedArquivos: files.length,
              errors: [],
              duration: 0
            });
          }
        });
      });
      this.results.push(result);
    } catch (error) {
      const err = error as Error;
      this.errors.push(`Erro no worker ${batchId}: ${err.message}`);

      // Adiciona resultado de erro
      this.results.push({
        workerId: batchId,
        occurrences: [ocorrenciaErroAnalista({
          mensagem: `Falha no worker ${batchId}: ${err.message}`,
          relPath: `[worker-${batchId}]`,
          origem: 'worker-pool'
        })],
        metrics: [],
        processedArquivos: 0,
        errors: [err.message],
        duration: 0
      });
    } finally {
      this.activeWorkers--;
    }
  }

  /**
   * Processamento sequencial como fallback
   */
  private async processSequentially(files: FileEntryWithAst[], techniques: Tecnica[], context: ContextoExecucao): Promise<{
    occurrences: Ocorrencia[];
    metrics: MetricaAnalista[];
    totalProcessed: number;
    duration: number;
  }> {
    const startHora = performance.now();
    const occurrences: Ocorrencia[] = [];
    const metrics: MetricaAnalista[] = [];
    log.info(' Usando processamento sequencial (workers desabilitados)');

    // Processa técnicas globais
    const globalTechniques = techniques.filter(t => t.global);
    for (const technique of globalTechniques) {
      try {
        const result = await this.executeTechniqueWithTimeout(technique, '', '[global]', null, undefined, context);
        if (result) {
          const occs = Array.isArray(result) ? result : [result];
          occurrences.push(...occs);
        }
      } catch (error) {
        const err = error as Error;
        occurrences.push(ocorrenciaErroAnalista({
          mensagem: `Falha na técnica global '${technique.nome}': ${err.message}`,
          relPath: '[execução global]',
          origem: technique.nome
        }));
      }
    }

    // Processa arquivos sequencialmente
    const nonGlobalTechniques = techniques.filter(t => !t.global);
    for (const file of files) {
      for (const technique of nonGlobalTechniques) {
        if (technique.test && !technique.test(file.relPath)) continue;
        try {
          const startHora = performance.now();
          const result = await this.executeTechniqueWithTimeout(technique, file.content ?? '', file.relPath, file.ast && 'node' in file.ast ? file.ast : null, file.fullCaminho, context);
          if (result) {
            const occs = Array.isArray(result) ? result : [result];
            occurrences.push(...occs);
          }
          const duration = performance.now() - startHora;
          metrics.push({
            nome: technique.nome || 'desconhecido',
            duracaoMs: duration,
            ocorrencias: Array.isArray(result) ? result.length : result ? 1 : 0,
            global: false
          });
        } catch (error) {
          const err = error as Error;
          occurrences.push(ocorrenciaErroAnalista({
            mensagem: `Falha na técnica '${technique.nome}' para ${file.relPath}: ${err.message}`,
            relPath: file.relPath,
            origem: technique.nome
          }));
        }
      }
    }
    return {
      occurrences,
      metrics,
      totalProcessed: files.length,
      duration: performance.now() - startHora
    };
  }

  /**
   * Executa uma técnica com timeout
   */
  private async executeTechniqueWithTimeout(technique: Tecnica, content: string, relPath: string, ast: import('@babel/traverse').NodePath<import('@babel/types').Node> | null, fullCaminho: string | undefined, context: ContextoExecucao): Promise<ReturnType<Tecnica['aplicar']>> {
    if (this.timeoutMs > 0) {
      let timer: NodeJS.Timeout | null = null;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Timeout: analista '${technique.nome}' excedeu ${this.timeoutMs}ms`));
        }, this.timeoutMs);
      });
      const execPromise = technique.aplicar(content, relPath, ast, fullCaminho, context);
      try {
        return await Promise.race([execPromise, timeoutPromise]);
      } finally {
        if (timer) clearTimeout(timer);
      }
    } else {
      return await technique.aplicar(content, relPath, ast, fullCaminho, context);
    }
  }

  /**
   * Retorna estatísticas do pool
   */
  getStats(): {
    maxWorkers: number;
    batchSize: number;
    enabled: boolean;
    activeWorkers: number;
    completedWorkers: number;
    totalErrors: number;
    errors: string[];
    metrics: PoolMetrics;
  } {
    return {
      maxWorkers: this.maxWorkers,
      batchSize: this.batchSize,
      enabled: this.enabled,
      activeWorkers: this.activeWorkers,
      completedWorkers: this.results.length,
      totalErrors: this.errors.length,
      errors: this.errors,
      metrics: this.metrics
    };
  }
}

/**
 * Função de conveniência para usar o pool de workers
 */

export async function processarComWorkers(files: FileEntryWithAst[], techniques: Tecnica[], context: ContextoExecucao, options?: WorkerPoolOptions): Promise<{
  occurrences: Ocorrencia[];
  metrics: MetricaAnalista[];
  totalProcessed: number;
  duration: number;
}> {
  const pool = new WorkerPool(options);
  return await pool.processFiles(files, techniques, context);
}