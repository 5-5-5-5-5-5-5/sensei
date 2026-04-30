// SPDX-License-Identifier: MIT
import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';

import { scanImports } from '../diagnostico/handlers/importer-handler.js';

const TSCONFIG_PATH = path.resolve(process.cwd(), 'tsconfig.json');
const SRC_DIR = path.resolve(process.cwd(), 'src');

const ALIASES_ESPECIAIS: Record<string, string> = {
  '@prometheus': './src/types/index.ts',
};

interface ImporterOptions {
  verbose?: boolean;
  dryRun?: boolean;
}

function verboseLog(msg: string, options: ImporterOptions) {
  if (options.verbose) {
    console.log(chalk.gray(`  → ${msg}`));
  }
}

function getBaseAliases(paths: Record<string, string[]>, options: ImporterOptions = {}) {
  const bases: { prefix: string; target: string }[] = [];

  for (const [key, values] of Object.entries(paths)) {
    if (key.endsWith('/*') && values[0]?.endsWith('/*')) {
      bases.push({
        prefix: key.slice(0, -2),
        target: values[0].slice(0, -2),
      });
      verboseLog(`Found wildcard base: ${key} → ${values[0]}`, options);
    }
  }

  try {
    const folders = fs.readdirSync(SRC_DIR).filter(f => {
      try {
        return fs.statSync(path.join(SRC_DIR, f)).isDirectory();
      } catch {
        return false;
      }
    });
    for (const folder of folders) {
      const prefix = `@${folder}`;
      const target = `./src/${folder}`;
      if (!bases.some(b => b.prefix === prefix)) {
        bases.push({ prefix, target });
        verboseLog(`Added folder alias: ${prefix} → ${target}`, options);
      }
    }
  } catch {}

  if (!bases.some(b => b.prefix === '@')) bases.push({ prefix: '@', target: './src/types/index' });
  if (!bases.some(b => b.prefix === '@/')) bases.push({ prefix: '@/', target: './src/' });
  if (!bases.some(b => b.prefix === '@src')) bases.push({ prefix: '@src', target: './src' });

  for (const [alias, target] of Object.entries(ALIASES_ESPECIAIS)) {
    const normalizedTarget = target.replace(/^\.\//, '').replace(/\.ts$/, '');
    if (!bases.some(b => b.prefix === alias)) {
      bases.push({ prefix: alias, target: normalizedTarget });
      verboseLog(`Added special alias: ${alias} → ${normalizedTarget}`, options);
    }
  }

  return bases.sort((a, b) => b.target.length - a.target.length);
}

function normalizeAlias(alias: string): string {
  const normalized = alias
    .replace(/\/index$/, '')
    .replace(/\.(js|ts)$/, '');
  return normalized;
}

function normalizeTarget(target: string): string {
  return target
    .replace(/\/index$/, '')
    .replace(/\.(js|ts)$/, '');
}

function scanBarrels(originalBases: { prefix: string; target: string }[], options: ImporterOptions, removeWildcards = false) {
  const spinner = ora('Escaneando barrels...').start();
  const barrels: { alias: string; path: string }[] = [];

  let tsconfig: { compilerOptions?: { paths?: Record<string, string[]> } };
  try {
    tsconfig = JSON.parse(fs.readFileSync(TSCONFIG_PATH, 'utf-8'));
  } catch {
    spinner.fail('tsconfig.json não encontrado');
    return { barrels: [], changed: false };
  }
  const paths = tsconfig.compilerOptions?.paths || {};

  function walk(dir: string) {
    let files: string[];
    try {
      files = fs.readdirSync(dir);
    } catch {
      return;
    }

    for (const file of files) {
      const fullPath = path.join(dir, file);
      let stats: fs.Stats;
      try {
        stats = fs.statSync(fullPath);
      } catch {
        continue;
      }

      if (stats.isDirectory()) {
        if (file === 'node_modules' || file === 'dist' || file.startsWith('.')) continue;
        walk(fullPath);
      } else if (file === 'index.ts') {
        const relativePath = `./${path.relative(process.cwd(), fullPath)}`;
        const folderPath = `./${path.relative(process.cwd(), dir)}`;

        if (folderPath.includes('/messages/') || (folderPath.endsWith('/messages') && !folderPath.endsWith('core/messages'))) {
            if (folderPath !== './src/core/messages') {
                continue;
            }
        }

        const base = originalBases.find(b => folderPath.startsWith(b.target));
        if (base) {
          const subFolder = folderPath.slice(base.target.length);
          let alias = base.prefix + (subFolder.startsWith('/') ? subFolder : (subFolder ? `/${subFolder}` : ''));

          alias = normalizeAlias(alias);

          if (alias.startsWith('@types')) {
             alias = alias.replace(/^@types/, '@projeto-types');
          }

          if (!paths[`${alias  }/*`] && !paths[alias]) {
            barrels.push({ alias, path: relativePath });
            verboseLog(`Found barrel: ${alias} → ${relativePath}`, options);
          }
        }
      }
    }
  }

  try {
    walk(SRC_DIR);
  } catch (err) {
    spinner.warn(`Erro ao escanear diretórios: ${err instanceof Error ? err.message : String(err)}`);
  }

  let changed = barrels.length > 0;
  if (removeWildcards) {
    for (const key of Object.keys(paths)) {
      if (key.endsWith('/*')) {
        delete paths[key];
        changed = true;
        verboseLog(`Removed wildcard: ${key}`, options);
      }
    }
  }

  for (const [alias, target] of Object.entries(ALIASES_ESPECIAIS)) {
    if (!paths[alias]) {
      const normalizedTarget = target.replace(/^\.\//, '');
      paths[alias] = [normalizedTarget];
      changed = true;
      verboseLog(`Added special alias: ${alias} → ${normalizedTarget}`, options);
    }
  }

  if (changed && !options.dryRun) {
    for (const barrel of barrels) {
      paths[barrel.alias] = [barrel.path];
    }

    const sortedPaths: Record<string, string[]> = {};
    Object.keys(paths).sort().forEach(key => {
      sortedPaths[key] = paths[key];
    });

    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }
    tsconfig.compilerOptions.paths = sortedPaths;

    const backupPath = `${TSCONFIG_PATH  }.backup`;
    try {
      fs.copyFileSync(TSCONFIG_PATH, backupPath);
      fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(tsconfig, null, 2));
      try { fs.unlinkSync(backupPath); } catch { /* ignora se não conseguir remover */ }
      spinner.succeed(`tsconfig.json atualizado: ${barrels.length} aliases adicionados${removeWildcards ? ' e wildcards removidos' : ''}.`);
    } catch (err) {
      try { fs.copyFileSync(backupPath, TSCONFIG_PATH); fs.unlinkSync(backupPath); } catch { /* ignora */ }
      spinner.fail(`Erro ao salvar tsconfig.json: ${err instanceof Error ? err.message : String(err)}`);
      return { barrels: [], changed: false };
    }
  } else if (options.dryRun) {
    spinner.info(`Dry-run: ${barrels.length} barrels encontrados (sem alterações)`);
  } else {
    spinner.info('Nenhum novo barrel encontrado.');
  }

  return { barrels, changed };
}

function replaceImports(originalBases: { prefix: string; target: string }[], options: ImporterOptions) {
  const spinner = ora('Substituindo imports...').start();

  let tsconfig: { compilerOptions?: { paths?: Record<string, string[]> } };
  try {
    tsconfig = JSON.parse(fs.readFileSync(TSCONFIG_PATH, 'utf-8'));
  } catch {
    spinner.fail('tsconfig.json não encontrado');
    return 0;
  }
  const paths: Record<string, string[]> = tsconfig.compilerOptions?.paths || {};

  const pathToAlias: Record<string, string> = {};

  function addAlias(target: string, alias: string) {
    const normTarget = target.startsWith('./') ? target : `./${target}`;
    const cleanTarget = normalizeTarget(normTarget);
    const existing = pathToAlias[cleanTarget];
    if (!existing) {
        pathToAlias[cleanTarget] = normalizeAlias(alias);
        return;
    }
    if (alias.length < existing.length) {
        pathToAlias[cleanTarget] = normalizeAlias(alias);
    }
  }

  for (const [alias, targets] of Object.entries(paths)) {
    if (alias.includes('*')) continue;
    const target = targets[0];
    if (target) {
      addAlias(target, alias);
      if (target.endsWith('/index.ts') || target.endsWith('/index.js')) {
        const dirTarget = target.replace(/\/index\.(js|ts)$/, '');
        addAlias(dirTarget, alias);
      }
    }
  }

  if (options.verbose) {
    console.log(chalk.gray('\nAliases configurados:'));
    for (const [target, alias] of Object.entries(pathToAlias)) {
      console.log(chalk.gray(`  ${target} → ${alias}`));
    }
  }

  let modifiedFilesCount = 0;
  const modifiedFiles: string[] = [];

  function walk(dir: string) {
    let files: string[];
    try {
      files = fs.readdirSync(dir);
    } catch {
      return;
    }

    for (const file of files) {
        const fullPath = path.join(dir, file);
        let stats: fs.Stats;
        try {
          stats = fs.statSync(fullPath);
        } catch {
          continue;
        }

        if (stats.isDirectory()) {
            if (file === 'node_modules' || file === 'dist' || file.startsWith('.')) continue;
            walk(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            let content: string;
            try {
              content = fs.readFileSync(fullPath, 'utf-8');
            } catch {
              continue;
            }
            let modified = false;

            const importExportRegex = /((?:import|export)\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"])|(import\(['"]([^'"]+)['"]\))/g;

            const relativeFileDir = `./${path.relative(process.cwd(), path.dirname(fullPath))}`;
            const fileBase = originalBases.find(b => relativeFileDir.startsWith(b.target) && b.prefix !== '@' && b.prefix !== '@/');

            content = content.replace(importExportRegex, (match, staticPart, staticPath, dynamicPart, dynamicPath) => {
                const importPath = staticPath || dynamicPath;
                if (!importPath || typeof importPath !== 'string') return match;

                if (!importPath.startsWith('.') && !importPath.startsWith('@')) return match;

                let resolvedPath = '';
                const cleanImportPath = importPath.replace(/\.(js|ts)$/, '');

                if (importPath.startsWith('.')) {
                    resolvedPath = `./${path.relative(process.cwd(), path.resolve(path.dirname(fullPath), cleanImportPath))}`;
                } else {
                    const base = originalBases.find(b => {
                        if (cleanImportPath === b.prefix) return true;
                        if (b.prefix.endsWith('/')) return cleanImportPath.startsWith(b.prefix);
                        return cleanImportPath.startsWith(`${b.prefix}/`);
                    });
                    if (base) {
                        const isExact = cleanImportPath === base.prefix;
                        const sub = isExact ? '' : cleanImportPath.slice(base.prefix.length + (base.prefix.endsWith('/') ? 0 : 1));
                        resolvedPath = base.target + (sub ? (base.target.endsWith('/') ? '' : '/') + sub : '');
                    }
                }

                if (resolvedPath) {
                    const normalizedResolved = resolvedPath.startsWith('./') ? resolvedPath : `./${resolvedPath}`;

                    let mustForceRelative = false;
                    if (fileBase) {
                        if (normalizedResolved.startsWith(fileBase.target)) {
                            mustForceRelative = true;
                        }
                    }

                    const cleanNormalized = normalizeTarget(normalizedResolved);
                    const dirNormalized = path.dirname(normalizedResolved);

                    const candidates = [
                        `${cleanNormalized}.ts`,
                        `${cleanNormalized}.js`,
                        `${cleanNormalized}/index.ts`,
                        `${cleanNormalized}/index.js`,
                        cleanNormalized,
                        dirNormalized,
                        `${dirNormalized}/index.ts`,
                        `${dirNormalized}/index.js`,
                    ];

                    let matchedAlias = '';
                    if (!mustForceRelative) {
                        for (const cand of candidates) {
                            if (pathToAlias[cand]) {
                                let candidateAlias = pathToAlias[cand];
                                if (candidateAlias.startsWith('@types')) {
                                    candidateAlias = candidateAlias.replace(/^@types/, '@projeto-types');
                                }

                                if (file === 'index.ts') {
                                    const relativeDir = `./${path.relative(process.cwd(), dir)}`;
                                    if (pathToAlias[relativeDir] === candidateAlias) {
                                        continue;
                                    }
                                }
                                matchedAlias = candidateAlias;
                                break;
                            }
                        }

                        if (!matchedAlias && importPath.startsWith('@types/')) {
                            matchedAlias = importPath.replace(/^@types\//, '@projeto-types/');
                        }
                    }

                    if (matchedAlias) {
                        if (matchedAlias !== importPath) {
                            modified = true;
                            verboseLog(`  ${importPath} → ${matchedAlias} in ${fullPath}`, options);
                            return match.replace(importPath, matchedAlias);
                        }
                    } else {
                        const absoluteImportedPath = path.resolve(process.cwd(), resolvedPath);
                        let newRelativePath = path.relative(path.dirname(fullPath), absoluteImportedPath);
                        if (!newRelativePath.startsWith('.')) newRelativePath = `./${newRelativePath}`;

                        const fullTarget = path.resolve(process.cwd(), resolvedPath);
                        let finalPath = newRelativePath;

                        // Verificação atomica usando lstat (evita TOCTOU)
                        let targetStat: fs.Stats | null = null;
                        try {
                          targetStat = fs.lstatSync(fullTarget);
                        } catch {}
                        let tsStat: fs.Stats | null = null;
                        try {
                          tsStat = fs.lstatSync(`${fullTarget}.ts`);
                        } catch {}
                        let indexStat: fs.Stats | null = null;
                        try {
                          indexStat = fs.lstatSync(`${fullTarget}/index.ts`);
                        } catch {}

                        if (targetStat?.isDirectory()) {
                            finalPath = finalPath.endsWith('/') ? `${finalPath}index.js` : `${finalPath}/index.js`;
                        } else if (tsStat || indexStat) {
                             if (tsStat) {
                                 finalPath += '.js';
                             } else {
                                 finalPath = finalPath.endsWith('/') ? `${finalPath}index.js` : `${finalPath}/index.js`;
                             }
                        } else {
                            if (!finalPath.endsWith('.js') && !finalPath.endsWith('.ts')) {
                                finalPath += '.js';
                            }
                        }

                        if (finalPath !== importPath) {
                            modified = true;
                            return match.replace(importPath, finalPath);
                        }
                    }
                }

                return match;
            });

            if (modified) {
              if (!options.dryRun) {
                try {
                  fs.writeFileSync(fullPath, content);
                  modifiedFilesCount++;
                  modifiedFiles.push(fullPath);
                } catch (err) {
                  spinner.warn(`Erro ao modificar ${fullPath}: ${err instanceof Error ? err.message : String(err)}`);
                }
              } else {
                modifiedFilesCount++;
                modifiedFiles.push(fullPath);
              }
            }
        }
    }
  }

  try {
    walk(SRC_DIR);
  } catch (err) {
    spinner.warn(`Erro ao processar arquivos: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (options.dryRun) {
    spinner.info(`Dry-run: ${modifiedFilesCount} arquivos seriam modificados.`);
    if (options.verbose) {
      console.log(chalk.gray('\nArquivos que seriam modificados:'));
      modifiedFiles.forEach(f => console.log(chalk.gray(`  ${f}`)));
    }
  } else {
    spinner.succeed(`Processo concluído. ${modifiedFilesCount} arquivos atualizados.`);
  }

  return modifiedFilesCount;
}

export function comandoImporter(
  aplicarFlagsGlobais: (opts: Record<string, unknown>) => void,
): Command {
  return new Command('importer')
    .description('Gerencia aliases de barrels no tsconfig e atualiza imports no projeto')
    .option('--scan', 'Faz a varredura no projeto e atualiza o tsconfig.json')
    .option('--replace', 'Substitui os imports no projeto para usar os novos aliases')
    .option('--dry-run', 'Executa sem fazer alterações, apenas mostra o que seria feito', false)
    .option('--verbose', 'Mostra logs detalhados do processo', false)
    .action(async function (this: Command, opts: { scan?: boolean; replace?: boolean; dryRun?: boolean; verbose?: boolean }) {
      const options: ImporterOptions = {
        dryRun: opts.dryRun,
        verbose: opts.verbose,
      };

      try {
        await aplicarFlagsGlobais(
          this.parent && typeof this.parent.opts === 'function'
            ? this.parent.opts()
            : {},
        );

        if (options.dryRun) {
          console.log(chalk.yellow('⚠ Modo dry-run: nenhuma alteração será feita\n'));
        }

        if (!opts.scan && !opts.replace) {
          const baseDir = process.cwd();
          const ocorrencias = await scanImports({ baseDir, silent: true });
          if (ocorrencias.length === 0) {
            console.log(chalk.green('Nenhum problema de import encontrado.'));
            return;
          }
          console.log(chalk.yellow(`Encontrados ${ocorrencias.length} problema(s) de import:`));
          for (const oc of ocorrencias) {
            console.log(`  ${oc.mensagem}`);
            if (oc.sugestao) console.log(`    ${chalk.gray(oc.sugestao)}`);
          }
          console.log(chalk.cyan('\nExecute "prometheus importer --scan" para corrigir.'));
          return;
        }

        let tsconfigData: { compilerOptions?: { paths?: Record<string, string[]> } };
        try {
          tsconfigData = JSON.parse(fs.readFileSync(TSCONFIG_PATH, 'utf-8'));
        } catch {
          console.error(chalk.red('tsconfig.json não encontrado no diretório atual.'));
          process.exit(1);
        }
        const originalBases = getBaseAliases(tsconfigData.compilerOptions?.paths || {}, options);

        if (opts.scan && opts.replace) {
          scanBarrels(originalBases, options, false);
          replaceImports(originalBases, options);
          scanBarrels(originalBases, options, true);
        } else if (opts.scan) {
          scanBarrels(originalBases, options, true);
        } else if (opts.replace) {
          replaceImports(originalBases, options);
        }
      } catch (error) {
        console.error(chalk.red(`Erro fatal no importer: ${error instanceof Error ? error.message : String(error)}`));
        if (options.verbose) {
          console.error(error instanceof Error ? error.stack : String(error));
        }
        process.exit(1);
      }
    });
}
