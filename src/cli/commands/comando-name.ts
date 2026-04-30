// SPDX-License-Identifier: MIT

import generateModule from '@babel/generator';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { chalk, config } from '@core/config';
import { getMessages } from '@core/messages';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

import { ExitCode, sair } from '../helpers/exit-codes.js';
import { getFilesWithExtension, getSourceFiles } from '../helpers/get-files-src.js';

const { log, CliComandoNameMensagens } = getMessages();

const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

function parseMappingLine(line: string): { oldName: string; newName: string } | null {
  const parts = line.split('=');
  if (parts.length < 2) return null;
  const oldName = parts[0].trim();
  const newName = parts[1].trim();
  if (!oldName || !newName || oldName === newName) return null;
  return { oldName, newName };
}

function loadMappingsFromFile(
  filePath: string,
  mappings: Map<string, string>,
  raizDir: string,
): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  for (const line of lines) {
    const parsed = parseMappingLine(line);
    if (parsed) {
      const existing = mappings.get(parsed.oldName);
      if (existing !== undefined && existing !== parsed.newName && config.VERBOSE) {
        log.info(
          CliComandoNameMensagens.conflitoMapeamento
            .replace('{nome}', parsed.oldName)
            .replace('{arquivo}', path.relative(raizDir, filePath))
            .replace('{novo}', parsed.newName)
            .replace('{anterior}', existing),
        );
      }
      mappings.set(parsed.oldName, parsed.newName);
    }
  }
}

export function comandoName(
  aplicarFlagsGlobais: (opts: Record<string, unknown>) => void,
): Command {
  return new Command('name')
    .description(CliComandoNameMensagens.descricao)
    .option(
      '--escrever',
      CliComandoNameMensagens.opcaoEscrever,
      false,
    )
    .option(
      '--replace',
      CliComandoNameMensagens.opcaoReplace,
      false,
    )
    .option(
      '--legacy',
      CliComandoNameMensagens.opcaoLegacy,
      false,
    )
    .action(async function (this: Command, opts: { escrever?: boolean; replace?: boolean; legacy?: boolean }) {
      try {
        await aplicarFlagsGlobais(
          this.parent && typeof this.parent.opts === 'function'
            ? this.parent.opts()
            : {},
        );
      } catch (err) {
        log.erro(
          `Falha ao aplicar flags: ${err instanceof Error ? err.message : String(err)}`,
        );
        sair(ExitCode.Failure);
        return;
      }

      const RAIZ_DIR = process.cwd();
      const SRC_DIR = path.resolve(RAIZ_DIR, 'src');
      const NAMES_DIR = path.resolve(RAIZ_DIR, 'names');

      if (opts.escrever) {
        fs.mkdirSync(NAMES_DIR, { recursive: true });
        log.info(chalk.cyan(CliComandoNameMensagens.iniciandoVarredura));

        const files = getSourceFiles(SRC_DIR);
        const allNomes = new Set<string>();
        let arquivosComNomes = 0;

        for (const file of files) {
          try {
            const code = fs.readFileSync(file, 'utf-8');
            const ast = parse(code, {
              sourceType: 'module',
              plugins: ['typescript', 'decorators-legacy'],
            });

            const variableNomes = new Set<string>();
            traverse(ast, {
              VariableDeclarator(path) {
                if (path.node.id.type === 'Identifier') {
                  const name = path.node.id.name;
                  variableNomes.add(name);
                  allNomes.add(name);
                }
              },
            });

            if (variableNomes.size > 0) {
              const relPath = path.relative(SRC_DIR, file);
              const outRelPath = relPath.replace(/\.(ts|js)$/i, '.txt');
              const outFile = path.join(NAMES_DIR, outRelPath);
              const outDir = path.dirname(outFile);
              fs.mkdirSync(outDir, { recursive: true });
              const sorted = Array.from(variableNomes).sort();
              const content = sorted.map((name) => `${name} = `).join('\n');
              fs.writeFileSync(outFile, content);
              arquivosComNomes++;
            }
          } catch {
            console.warn(
              CliComandoNameMensagens.avisoErroProcessar.replace('{arquivo}', path.relative(RAIZ_DIR, file)),
            );
          }
        }

        if (opts.legacy) {
          const SAIDA_ARQUIVO = path.resolve(NAMES_DIR, 'name.txt');
          const sortedNomes = Array.from(allNomes).sort();
          const content = sortedNomes.map((name) => `${name} = `).join('\n');
          fs.writeFileSync(SAIDA_ARQUIVO, content);
          log.sucesso(
            CliComandoNameMensagens.varreduraConcluidaFragmentada
              .replace('{variaveis}', String(sortedNomes.length))
              .replace('{arquivos}', String(arquivosComNomes))
              .replace('{pastaFragmentada}', chalk.bold('names/'))
              .replace('{pastaAgregada}', chalk.bold(path.relative(RAIZ_DIR, SAIDA_ARQUIVO))),
          );
        } else {
          log.sucesso(
            CliComandoNameMensagens.varreduraConcluidaEspelhada
              .replace('{variaveis}', String(allNomes.size))
              .replace('{arquivos}', String(arquivosComNomes))
              .replace('{pasta}', chalk.bold('names/')),
          );
        }
      }

      if (opts.replace) {
        const mappings = new Map<string, string>();

        if (fs.existsSync(path.resolve(NAMES_DIR, 'name.txt'))) {
          loadMappingsFromFile(path.resolve(NAMES_DIR, 'name.txt'), mappings, RAIZ_DIR);
        } else if (fs.existsSync(NAMES_DIR)) {
          const txtFiles = getFilesWithExtension(NAMES_DIR, '.txt');
          if (txtFiles.length === 0) {
            log.erro(
              CliComandoNameMensagens.nenhumArquivoMapeamento.replace('{pasta}', chalk.bold('names/')).replace('{comando}', chalk.bold('name --escrever')),
            );
            sair(ExitCode.Failure);
            return;
          }
          for (const f of txtFiles) {
            loadMappingsFromFile(f, mappings, RAIZ_DIR);
          }
        } else {
          log.erro(
            CliComandoNameMensagens.pastaNaoEncontrada.replace('{pasta}', chalk.bold('names/')).replace('{comando}', chalk.bold('name --escrever')),
          );
          sair(ExitCode.Failure);
          return;
        }

        if (mappings.size === 0) {
          log.aviso(
            CliComandoNameMensagens.nenhumMapeamento,
          );
          return;
        }

        const files = getSourceFiles(SRC_DIR);
        let totalArquivosUpdated = 0;
        log.info(
          chalk.cyan(
            CliComandoNameMensagens.iniciandoRenomeacao.replace('{total}', String(mappings.size)),
          ),
        );
        for (const file of files) {
          try {
            const code = fs.readFileSync(file, 'utf-8');
            const ast = parse(code, {
              sourceType: 'module',
              plugins: ['typescript', 'decorators-legacy'],
            });
            let changed = false;
            traverse(ast, {
              Identifier(path) {
                const newName = mappings.get(path.node.name);
                if (newName && newName !== path.node.name) {
                  path.node.name = newName;
                  changed = true;
                }
              },
            });
            if (changed) {
              const output = generate(
                ast,
                {
                  retainLines: false,
                  comments: true,
                  compact: false,
                },
                code,
              );
              fs.writeFileSync(file, output.code);
              if (config.VERBOSE)
                log.info(CliComandoNameMensagens.arquivoAtualizado.replace('{arquivo}', path.relative(RAIZ_DIR, file)));
              totalArquivosUpdated++;
            }
          } catch {
            // ignora erros de parse por arquivo
          }
        }
        log.sucesso(
          CliComandoNameMensagens.renomeacaoConcluida.replace('{total}', String(totalArquivosUpdated)),
        );
      }

      if (!opts.escrever && !opts.replace) {
        log.info(CliComandoNameMensagens.uso);
      }
    });
}