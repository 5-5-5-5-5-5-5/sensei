// SPDX-License-Identifier: MIT
/**
 * 自适应日志引擎，根据项目上下文自动调整
 * 自动检测复杂性并调整详细程度
 */

import { config } from '@core/config/config.js';
import { ICONES_FEEDBACK } from '@core/messages/shared/icons.js';
import { isJsonMode } from '@shared/helpers/json-mode.js';

import type { FileMap, LogContext, LogData, LogLevel, LogTemplate, ProjetoMetricas } from '@';

import { LogContextConfiguracao, LogMensagens } from './log-messages.js';

class LogEngineAdaptativo {
  private static instance: LogEngineAdaptativo;
  private contextoAtual: LogContext = 'medio';
  private metricas: ProjetoMetricas | null = null;
  private isCI: boolean = false;
  static getInstance(): LogEngineAdaptativo {
    if (!LogEngineAdaptativo.instance) {
      LogEngineAdaptativo.instance = new LogEngineAdaptativo();
    }
    return LogEngineAdaptativo.instance;
  }

  /**
   * 根据文件自动检测项目上下文
   */
  detectarContexto(fileMap: FileMap): LogContext {
    this.metricas = this.analisarProjeto(fileMap);
    this.isCI = this.detectarCI();

    if (this.isCI) {
      this.contextoAtual = 'ci';
      this.log('debug', LogMensagens.contexto.ci_cd, {});
      return 'ci';
    }
    const complexidade = this.metricas.estruturaComplexidade;
    const totalArquivos = this.metricas.totalArquivos;
    const linguagens = this.metricas.linguagens.length;
    if (totalArquivos < 20 && linguagens <= 2 && !this.metricas.temTestes) {
      this.contextoAtual = 'simples';
      this.log('info', LogMensagens.contexto.desenvolvedor_novo, {});
    } else if (totalArquivos > 100 || linguagens > 3 || complexidade === 'complexa') {
      this.contextoAtual = 'complexo';
      this.log('info', LogMensagens.contexto.equipe_experiente, {});
    } else {
      this.contextoAtual = 'medio';
    }

    this.log('info', LogMensagens.projeto.detectado, {
      tipo: this.contextoAtual,
      confianca: this.calcularConfianca()
    });
    this.log('debug', LogMensagens.projeto.estrutura, {
      arquivos: totalArquivos,
      linguagens
    });
    return this.contextoAtual;
  }

  /**
   * 分析项目指标以确定复杂性
   */
  private analisarProjeto(fileMap: FileMap): ProjetoMetricas {
    const arquivos = Object.values(fileMap);
    const totalArquivos = arquivos.length;

    const extensoes = new Set(arquivos.map(f => f.relPath.split('.').pop()?.toLowerCase()).filter((ext): ext is string => Boolean(ext)));
    const linguagens = Array.from(extensoes).filter(ext => ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'php', 'py', 'xml'].includes(ext));

    const temSrcFolder = arquivos.some(f => f.relPath.startsWith('src/'));
    const temMultiplosDiretorios = new Set(arquivos.map(f => f.relPath.split('/')[0])).size > 5;
    const temConfiguracaoArquivos = arquivos.some(f => ['package.json', 'tsconfig.json', 'webpack.config.js', 'vite.config.ts'].includes(f.relPath.split('/').pop() || ''));
    let estruturaComplexidade: 'simples' | 'media' | 'complexa' = 'simples';
    if (totalArquivos > 100 || temMultiplosDiretorios) {
      estruturaComplexidade = 'complexa';
    } else if (totalArquivos > 20 || temSrcFolder || temConfiguracaoArquivos) {
      estruturaComplexidade = 'media';
    }
    return {
      totalArquivos,
      linguagens,
      estruturaComplexidade,
      temCI: arquivos.some(f => f.relPath.includes('.github/') || f.relPath.includes('.gitlab-ci')),
      temTestes: arquivos.some(f => f.relPath.includes('test') || f.relPath.includes('spec')),
      temDependencias: arquivos.some(f => f.relPath === 'package.json' || f.relPath === 'requirements.txt')
    };
  }

  /**
   * 检测是否在CI/CD环境中运行
   */
  private detectarCI(): boolean {
    return !!(process.env.CI || process.env.GITHUB_ACTIONS || process.env.GITLAB_CI || process.env.JENKINS_URL || config.REPORT_SILENCE_LOGS);
  }

  /**
   * 计算上下文检测的置信度
   */
  private calcularConfianca(): number {
    if (!this.metricas) return 50;
    let confianca = 60;

    if (this.metricas.totalArquivos > 0) confianca += 10;
    if (this.metricas.linguagens.length > 0) confianca += 10;
    if (this.metricas.temTestes) confianca += 10;
    if (this.metricas.temDependencias) confianca += 10;
    return Math.min(confianca, 95);
  }

  /**
   * 基于当前上下文的自适应日志
   */
  log(level: LogLevel, template: LogTemplate, data: LogData = {}): void {
    if (isJsonMode()) {
      if (level !== 'erro') return;
      const formattedMensagem = this.formatMessage(template, data, LogContextConfiguracao[this.contextoAtual]);
      console.error(formattedMensagem);
      return;
    }
    const contextoConfiguracao = LogContextConfiguracao[this.contextoAtual];

    if (this.isCI && this.contextoAtual === 'ci') {
      this.logEstruturado(level, template, data);
      return;
    }

    const formattedMensagem = this.formatMessage(template, data, contextoConfiguracao);
    const timestamp = this.formatTimestamp();
    const logMethod = this.getLogMethod(level);
    logMethod(`[${timestamp}] ${formattedMensagem}`);
  }

  /**
   * CI/CD的结构化日志
   */
  private logEstruturado(level: LogLevel, template: LogTemplate, data: LogData): void {
    const logEntrada = {
      timestamp: new Date().toISOString(),
      level,
      message: this.formatMessage(template, data),
      context: this.contextoAtual,
      ...data
    };
    console.log(JSON.stringify(logEntrada));
  }

  /**
   * 基于上下文格式化消息
   */
  private formatMessage(template: LogTemplate, data: LogData, contextoConfiguracao = LogContextConfiguracao[this.contextoAtual]): string {
    const processedData = {
      ...data
    };

    if (processedData.arquivo && typeof processedData.arquivo === 'string') {
      processedData.arquivo = this.formatarNomeArquivo(processedData.arquivo, contextoConfiguracao.formato_arquivo);
    }

    return template.replace(/\{(\w+)\}/g, (match: string, key: string) => {
      const value = processedData[key];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * 基于上下文格式化文件名
   */
  private formatarNomeArquivo(arquivo: string, formato: string): string {
    switch (formato) {
      case 'nome_apenas':
        return arquivo.split('/').pop() || arquivo;
      case 'relativo':
        return arquivo.length > 50 ? `...${arquivo.slice(-45)}` : arquivo;
      case 'completo':
        return arquivo;
      default:
        return arquivo;
    }
  }
  private formatTimestamp(): string {
    const now = new Date();
    return now.toTimeString().slice(0, 8);
  }
  private getLogMethod(level: LogLevel) {
    switch (level) {
      case 'erro':
        return console.error;
      case 'aviso':
        return console.warn;
      default:
        return console.log;
    }
  }

  /**
   * 外部使用的getter
   */
  get contexto(): LogContext {
    return this.contextoAtual;
  }
  get metricas_projeto(): ProjetoMetricas | null {
    return this.metricas;
  }

  /**
   * 强制特定上下文(用于测试或手动覆盖)
   */
  forcarContexto(contexto: LogContext): void {
    this.contextoAtual = contexto;
    this.log('debug', `${ICONES_FEEDBACK.info} 强制上下文: ${contexto}`, {});
  }
}
export const logEngine = LogEngineAdaptativo.getInstance();
export { LogEngineAdaptativo };