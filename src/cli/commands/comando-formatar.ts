// SPDX-License-Identifier: MIT

import path from 'node:path';

import traverseModule from '@babel/traverse';
import { chalk, config, generate } from '@core/config';
import { getMessages } from '@core/messages';
import { decifrarSintaxe } from '@core/parsing';
import { scanRepository } from '@core/execution';
import type { FormatarCommandOpts, FormatResult } from '@prometheus';
import {
  formatarComPrettierProjeto,
  formatarPrettierMinimo,
} from '@shared/impar';
import { salvarEstado } from '@shared/persistence';
import { Command } from 'commander';
import micromatch from 'micromatch';

import { ExitCode, sair } from '../helpers/exit-codes.js';
import { processPatternList } from '../helpers/pattern-helpers.js';
import { configurarFiltros } from '../processing/filters.js';

const { log, CliFormatarExtraMensagens } = getMessages();

const traverse = traverseModule.default || traverseModule;

function isFormatavel(relPath: string): boolean {
  const basename = relPath.split('/').pop()?.toLowerCase() || '';
  return /\.(json[c5]?|md|markdown|ya?ml|ts|tsx|js|jsx|mjs|cjs|html?|css|py|xml|php|toml|ini|sql|dockerfile|sh|bash|java|properties|txt|log|lock|env|gradle|kts|svg|scss|less|go|k[mt])$/i.test(
    relPath,
  ) || /^(\.gitignore|\.editorconfig|\.npmrc|\.nvmrc)$/i.test(basename);
}

function isTsJsFile(relPath: string): boolean {
  return /\.(ts|tsx|js|jsx|mjs|cjs)$/i.test(relPath) && !relPath.includes('node_modules') && !relPath.includes('dist');
}

function detectaNodeModulesExplicito(
  includeGroups: string[][],
  includeFlat: string[],
): boolean {
  const all = [...includeFlat, ...includeGroups.flat()];
  return all.some((p) => /(^|\/)node_modules(\/|$)/.test(String(p || '')));
}

interface FixPatternsResult {
  total: number;
  arquivosAfetados: number;
  erros: number;
}

async function applyFixPatterns(
  code: string,
  relPath: string,
  baseDir: string,
  dryRun: boolean,
): Promise<{ changed: boolean; result?: string; errors: string[] }> {
  const errors: string[] = [];

  const ast = await decifrarSintaxe(code, path.extname(relPath), { relPath });
  if (!ast) {
    return { changed: false, errors: ['Falha ao parsear AST'] };
  }

  let modified = false;

  traverse(ast, {
    BinaryExpression(p: any) {
      const { node } = p;
      if (node.operator === '==' || node.operator === '!=') {
        const isNullCheck = (n: any) =>
          n.type === 'NullLiteral' ||
          (n.type === 'Identifier' && n.name === 'undefined');
        if (isNullCheck(node.right) || isNullCheck(node.left)) return;

        const sugerido = node.operator === '==' ? '===' : '!==';
        node.operator = sugerido as '===' | '!==';
        modified = true;
      }
    },
    TSAsExpression(p: any) {
      const { node } = p;
      if (node.typeAnnotation && node.typeAnnotation.type === 'TSAnyKeyword') {
        // just detect, no modification needed
      }
    },
    TSTypeAssertion(p: any) {
      const { node } = p;
      const { expression, typeAnnotation } = node;
      p.replaceWith({
        type: 'TSAsExpression',
        expression,
        typeAnnotation,
      });
      modified = true;
    },
  });

  if (!modified || dryRun) {
    return { changed: modified, errors };
  }

  try {
    const generated = generate(ast, {
      retainLines: true,
      comments: true,
    });

    const final = await formatarComPrettierProjeto({
      code: generated.code,
      relPath,
      baseDir,
    });

    const contentToWrite = final.ok ? final.formatted : generated.code;
    return { changed: true, result: contentToWrite, errors };
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
    return { changed: false, errors };
  }
}

export function comandoFormatar(
  aplicarFlagsGlobais: (opts: Record<string, unknown>) => void,
): Command {
  return new Command('formatar')
    .description(
      'Aplica a formatação interna estilo Prometheus (whitespace, seções, finais de linha)',
    )
    .option(
      '--check',
      'Apenas verifica se arquivos precisariam de formatação (default)',
      true,
    )
    .option('--write', 'Aplica as mudanças no filesystem', false)
    .option(
      '--engine <engine>',
      'Motor de formatação: auto|interno|prettier (auto tenta usar Prettier do projeto e cai no interno)',
      'auto',
    )
    .option(
      '--fix-patterns',
      'Escaneia padrões não padronizados (==/!=, as any, etc)',
      false,
    )
    .option(
      '--fix-patterns-write',
      'Aplica correções de padrões não padronizados',
      false,
    )
    .option(
      '--include <padrao>',
      'Glob pattern a INCLUIR (pode repetir a flag ou usar vírgulas / espaços para múltiplos)',
      (val: string, prev: string[]) => {
        prev.push(val);
        return prev;
      },
      [] as string[],
    )
    .option(
      '--exclude <padrao>',
      'Glob pattern a EXCLUIR adicionalmente (pode repetir a flag ou usar vírgulas / espaços)',
      (val: string, prev: string[]) => {
        prev.push(val);
        return prev;
      },
      [] as string[],
    )
    .action(async function (this: Command, opts: FormatarCommandOpts & { fixPatterns?: boolean; fixPatternsWrite?: boolean }) {
      try {
        await aplicarFlagsGlobais(
          this.parent && typeof this.parent.opts === 'function'
            ? this.parent.opts()
            : {},
        );

        const write = Boolean(opts.write);
        const check = write ? false : Boolean(opts.check ?? true);
        const fixPatterns = Boolean(opts.fixPatterns);
        const fixPatternsWrite = Boolean(opts.fixPatternsWrite);

        const engineRaw = String(
          opts.engine || process.env.PROMETHEUS_FORMAT_ENGINE || 'auto',
        ).trim();
        const engine =
          engineRaw === 'interno' ||
            engineRaw === 'prettier' ||
            engineRaw === 'auto'
            ? engineRaw
            : 'auto';

        const includeList = processPatternList(opts.include);
        const excludeList = processPatternList(opts.exclude);

        const includeGroupsRaw: string[][] = [];
        const incluiNodeModules = detectaNodeModulesExplicito(
          includeGroupsRaw,
          includeList,
        );
        configurarFiltros(
          includeGroupsRaw,
          includeList,
          excludeList,
          incluiNodeModules,
        );

        const baseDir = process.cwd();
        const result: FormatResult = {
          total: 0,
          formataveis: 0,
          mudaram: 0,
          erros: 0,
          arquivosMudaram: [],
        };

        const fixPatternsResult: FixPatternsResult = {
          total: 0,
          arquivosAfetados: 0,
          erros: 0,
        };

        if (fixPatterns) {
          log.info(chalk.cyan(CliFormatarExtraMensagens.fixPatternsScan));
        } else {
          log.info(chalk.bold(CliFormatarExtraMensagens.titulo));
        }

        if (config.SCAN_ONLY) {
          log.aviso(CliFormatarExtraMensagens.scanOnlyAtivo);
        }

        const fileMap = await scanRepository(baseDir, {
          includeContent: true,
          filter: (relPath: string) => {
            if (fixPatterns) {
              return isTsJsFile(relPath);
            }
            return isFormatavel(relPath);
          },
        });

        const entries = Object.values(fileMap);
        result.total = entries.length;

        for (const e of entries) {
          const relPath = e.relPath;

          if (excludeList.length && micromatch.isMatch(relPath, excludeList)) {
            continue;
          }

          if (includeList.length) {
            const matchGlob = micromatch.isMatch(relPath, includeList);
            const matchExact = includeList.some(
              (p) => String(p).trim() === relPath,
            );
            if (!matchGlob && !matchExact) continue;
          }

          if (fixPatterns) {
            const src = typeof e.content === 'string' ? e.content : '';
            const fixResult = await applyFixPatterns(src, relPath, baseDir, !fixPatternsWrite);

            if (fixResult.errors.length > 0) {
              fixPatternsResult.erros++;
              continue;
            }

            if (fixResult.changed) {
              fixPatternsResult.total++;
              fixPatternsResult.arquivosAfetados++;

              if (fixPatternsWrite && fixResult.result) {
                await salvarEstado(path.resolve(baseDir, relPath), fixResult.result);
              }
            }
            continue;
          }

          const src = typeof e.content === 'string' ? e.content : '';
          const resolved =
            engine === 'auto'
              ? await (async () => {
                const r = await formatarComPrettierProjeto({
                  code: src,
                  relPath,
                  baseDir,
                });
                if (!r.ok) return r;
                if (r.parser !== 'unknown') return r;
                return formatarPrettierMinimo({ code: src, relPath });
              })()
              : engine === 'interno'
                ? formatarPrettierMinimo({ code: src, relPath })
                : await formatarComPrettierProjeto({
                  code: src,
                  relPath,
                  baseDir,
                });

          if (!resolved.ok) {
            result.erros++;
            log.erro(CliFormatarExtraMensagens.falhaFormatar.replace('{arquivo}', relPath).replace('{erro}', resolved.error));
            continue;
          }

          if (resolved.parser === 'unknown') {
            continue;
          }

          result.formataveis++;

          if (!resolved.changed) {
            continue;
          }

          result.mudaram++;
          result.arquivosMudaram.push(relPath);

          if (write) {
            const abs = path.resolve(baseDir, relPath);
            await salvarEstado(abs, resolved.formatted);
          }
        }

        if (fixPatterns) {
          if (fixPatternsWrite) {
            log.sucesso(CliFormatarExtraMensagens.fixPatternsConcluido.replace('{total}', String(fixPatternsResult.arquivosAfetados)));
          } else {
            log.sucesso(CliFormatarExtraMensagens.fixPatternsEncontrados.replace('{total}', String(fixPatternsResult.total)));
          }
          sair(ExitCode.Ok);
          return;
        }

        if (result.erros > 0) {
          log.erro(CliFormatarExtraMensagens.errosEncontrados.replace('{total}', String(result.erros)));
          sair(ExitCode.Failure);
          return;
        }

        if (check) {
          if (result.mudaram > 0) {
            log.aviso(
              CliFormatarExtraMensagens.precisaFormatacao.replace('{total}', String(result.mudaram)),
            );
            sair(ExitCode.Failure);
            return;
          }
          log.sucesso(CliFormatarExtraMensagens.tudoFormatado);
          sair(ExitCode.Ok);
          return;
        }

        if (result.mudaram > 0) {
          log.sucesso(CliFormatarExtraMensagens.arquivosFormatados.replace('{total}', String(result.mudaram)));
        } else {
          log.info(CliFormatarExtraMensagens.nenhumaMudanca);
        }
        sair(ExitCode.Ok);
      } catch (err) {
        log.erro(
          `Falha ao formatar: ${err instanceof Error ? err.message : String(err)}`,
        );
        sair(ExitCode.Failure);
      }
    });
}