// SPDX-License-Identifier: MIT
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Loader ESM Universal - Suporta aliases do tsconfig.json em tempo de execução.
 */

const aliases: Record<string, string> = {
  '@bin': 'bin/index',
  '@cli': 'cli/index',
  '@cli/commands': 'cli/commands/index',
  '@cli/diagnostico': 'cli/diagnostico/index',
  '@cli/diagnostico/exporters': 'cli/diagnostico/exporters/index',
  '@cli/diagnostico/handlers': 'cli/diagnostico/handlers/index',
  '@cli/handlers': 'cli/handlers/index',
  '@cli/helpers': 'cli/helpers/index',
  '@cli/options': 'cli/options/index',
  '@cli/processing': 'cli/processing/index',
  '@core/config': 'core/config/index',
  '@core/config/auto': 'core/config/auto/index',
  '@core/execution': 'core/execution/index',
  '@core/messages': 'core/messages/index',
  '@core/parsing': 'core/parsing/index',
  '@core/registry': 'core/registry/index',
  '@core/reporting': 'core/reporting/index',
  '@core/schema': 'core/schema/index',
  '@core/utils': 'core/utils/index',
  '@core/workers': 'core/workers/index',
  '@core/': 'core/',
  '@guardian': 'guardian/index',
  '@guardian/': 'guardian/',
  '@licensas': 'licensas/index',
  '@licensas/': 'licensas/',
  '@projeto-types': 'types/index',
  '@projeto-types/analistas': 'types/analistas/index',
  '@projeto-types/cli': 'types/cli/index',
  '@projeto-types/comum': 'types/comum/index',
  '@projeto-types/core': 'types/core/index',
  '@projeto-types/core/messages': 'types/core/messages/index',
  '@projeto-types/estrutura': 'types/estrutura/index',
  '@projeto-types/guardian': 'types/guardian/index',
  '@projeto-types/licensas': 'types/licensas/index',
  '@projeto-types/projeto': 'types/projeto/index',
  '@projeto-types/relatorios': 'types/relatorios/index',
  '@projeto-types/shared': 'types/shared/index',
  '@projeto-types/zeladores': 'types/zeladores/index',
  '@projeto-types/': 'types/',
  '@relatorios': 'relatorios/index',
  '@relatorios/': 'relatorios/',
  '@sdk': 'sdk/index',
  '@shared': 'shared/index',
  '@shared/data-processing': 'shared/data-processing/index',
  '@shared/helpers': 'shared/helpers/index',
  '@shared/impar': 'shared/impar/index',
  '@shared/persistence': 'shared/persistence/index',
  '@shared/plugins': 'shared/plugins/index',
  '@shared/validation': 'shared/validation/index',
  '@shared/': 'shared/',
  '@src/': '',
  '@zeladores': 'zeladores/index',
  '@zeladores/': 'zeladores/',
  '@': 'types/index',
  '@/': 'src/',
  '@analistas/arquitetos': 'analistas/arquitetos/index',
  '@analistas/corrections/quick-fixes': 'analistas/corrections/quick-fixes/index',
  '@analistas/corrections/type-safety': 'analistas/corrections/type-safety/index',
  '@analistas/detectores': 'analistas/detectores/index',
  '@analistas/estrategistas': 'analistas/estrategistas/index',
  '@analistas/js-ts': 'analistas/js-ts/index',
  '@analistas/css-in-js': 'analistas/css-in-js/index',
  '@analistas/css': 'analistas/css/index',
  '@analistas/html': 'analistas/html/index',
  '@analistas/plugins': 'analistas/plugins/index',
  '@analistas/pontuadores': 'analistas/pontuadores/index',
  '@analistas/registry': 'analistas/registry/index',
  '@analistas/': 'analistas/',
};

export async function resolve(
  specifier: string,
  context: { parentURL?: string },
  nextResolve: (specifier: string, context: { parentURL?: string }) => Promise<{ url: string; shortCircuit: boolean }>
): Promise<{ url: string; shortCircuit: boolean }> {
  if (!specifier.startsWith('@')) {
    return nextResolve(specifier, context);
  }

  const sortedAliases = Object.entries(aliases).sort((a, b) => b[0].length - a[0].length);

  for (const [prefix, replacement] of sortedAliases) {
    const isExactMatch = specifier === prefix;
    const isPrefixMatch = prefix.endsWith('/') && specifier.startsWith(prefix);

    if (isExactMatch || isPrefixMatch) {
      const remaining = isExactMatch ? '' : specifier.slice(prefix.length);
      const newPath = replacement + remaining;

      let basePath = process.cwd();
      if (context.parentURL) {
        try {
          const parentPath = fileURLToPath(context.parentURL);
          if (parentPath.includes('/src/')) {
            basePath = join(parentPath.split('/src/')[0], 'src');
          } else if (parentPath.includes('/dist/')) {
            basePath = join(parentPath.split('/dist/')[0], 'dist');
          }
        } catch {}
      }

      const fullPath = join(basePath, newPath);
      let foundFile = '';

      const tryFile = (p: string) => {
        if (existsSync(p) && statSync(p).isFile()) {
          foundFile = p;
          return true;
        }
        return false;
      };

      const exts = ['.ts', '.js', '.tsx', '.mjs', '.cjs'];

      if (!tryFile(fullPath)) {
        for (const ext of exts) {
          if (tryFile(fullPath + ext)) break;
        }

        if (!foundFile && !fullPath.includes('.')) {
          for (const ext of exts) {
            if (tryFile(join(fullPath, `index${ext}`))) break;
          }
        }
      }

      if (foundFile) {
        return {
          url: pathToFileURL(foundFile).href,
          shortCircuit: true,
        };
      }
    }
  }

  return nextResolve(specifier, context);
}

export async function load(
  url: string,
  context: { format?: string },
  nextLoad: (url: string, context: { format?: string }) => Promise<{ format: string; source?: string }>
): Promise<{ format: string; source?: string }> {
  return nextLoad(url, context);
}