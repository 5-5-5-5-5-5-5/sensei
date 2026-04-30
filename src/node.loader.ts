// SPDX-License-Identifier: MIT
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Loader ESM Universal - Suporta aliases do tsconfig.json em tempo de execução.
 */

const aliases: Record<string, string> = {
  "@analistas/arquitetos":
        "./src/analistas/arquitetos/index"
      ,
      "@analistas/css":
        "./src/analistas/css/index"
      ,
      "@analistas/css-in-js":
        "./src/analistas/css-in-js/index"
      ,
      "@analistas/css-in-js/analistas":
        "./src/analistas/css-in-js/analistas/index"
      ,
      "@analistas/css-in-js/corrections":
        "./src/analistas/css-in-js/corrections/index"
      ,
      "@analistas/css/analistas":
        "./src/analistas/css/analistas/index"
      ,
      "@analistas/css/corrections":
        "./src/analistas/css/corrections/index"
      ,
      "@analistas/detectores":
        "./src/analistas/detectores/index"
      ,
      "@analistas/estrategistas":
        "./src/analistas/estrategistas/index"
      ,
      "@analistas/formatters":
        "./src/analistas/formatters/index"
      ,
      "@analistas/github-actions":
        "./src/analistas/github-actions/index"
      ,
      "@analistas/github-actions/analistas":
        "./src/analistas/github-actions/analistas/index"
      ,
      "@analistas/github-actions/corrections":
        "./src/analistas/github-actions/corrections/index"
      ,
      "@analistas/html":
        "./src/analistas/html/index"
      ,
      "@analistas/html/analistas":
        "./src/analistas/html/analistas/index"
      ,
      "@analistas/html/corrections":
        "./src/analistas/html/corrections/index"
      ,
      "@analistas/js-ts":
        "./src/analistas/js-ts/index"
      ,
      "@analistas/js-ts/analistas":
        "./src/analistas/js-ts/analistas/index"
      ,
      "@analistas/js-ts/corrections":
        "./src/analistas/js-ts/corrections/index"
      ,
      "@analistas/js-ts/corrections/quick-fixes":
        "./src/analistas/js-ts/corrections/quick-fixes/index"
      ,
      "@analistas/js-ts/corrections/type-safety":
        "./src/analistas/js-ts/corrections/type-safety/index"
      ,
      "@analistas/js-ts/detectores":
        "./src/analistas/js-ts/detectores/index"
      ,
      "@analistas/plugins":
        "./src/analistas/plugins/index"
      ,
      "@analistas/pontuadores":
        "./src/analistas/pontuadores/index"
      ,
      "@analistas/python":
        "./src/analistas/python/index"
      ,
      "@analistas/python/analistas":
        "./src/analistas/python/analistas/index"
      ,
      "@analistas/python/corrections":
        "./src/analistas/python/corrections/index"
      ,
      "@analistas/python/detectores":
        "./src/analistas/python/detectores/index"
      ,
      "@analistas/react":
        "./src/analistas/react/index"
      ,
      "@analistas/react/analistas":
        "./src/analistas/react/analistas/index"
      ,
      "@analistas/react/corrections":
        "./src/analistas/react/corrections/index"
      ,
      "@analistas/react/detectores":
        "./src/analistas/react/detectores/index"
      ,
      "@analistas/registry":
        "./src/analistas/registry/index"
      ,
      "@analistas/shell":
        "./src/analistas/shell/index"
      ,
      "@analistas/shell/analistas":
        "./src/analistas/shell/analistas/index"
      ,
      "@analistas/shell/corrections":
        "./src/analistas/shell/corrections/index"
      ,
      "@analistas/sql":
        "./src/analistas/sql/index"
      ,
      "@analistas/sql/analistas":
        "./src/analistas/sql/analistas/index"
      ,
      "@analistas/sql/corrections":
        "./src/analistas/sql/corrections/index"
      ,
      "@analistas/sql/detectores":
        "./src/analistas/sql/detectores/index"
      ,
      "@analistas/svg":
        "./src/analistas/svg/index"
      ,
      "@analistas/svg/analistas":
        "./src/analistas/svg/analistas/index"
      ,
      "@analistas/svg/corrections":
        "./src/analistas/svg/corrections/index"
      ,
      "@analistas/svg/detectores":
        "./src/analistas/svg/detectores/index"
      ,
      "@analistas/tailwind":
        "./src/analistas/tailwind/index"
      ,
      "@analistas/tailwind/analistas":
        "./src/analistas/tailwind/analistas/index"
      ,
      "@analistas/tailwind/corrections":
        "./src/analistas/tailwind/corrections/index"
      ,
      "@analistas/tailwind/detectores":
        "./src/analistas/tailwind/detectores/index"
      ,
      "@analistas/xml":
        "./src/analistas/xml/index"
      ,
      "@analistas/xml/analistas":
        "./src/analistas/xml/analistas/index"
      ,
      "@analistas/xml/corrections":
        "./src/analistas/xml/corrections/index"
      ,
      "@analistas/xml/detectores":
        "./src/analistas/xml/detectores/index"
      ,
      "@bin":
        "./src/bin/index"
      ,
      "@cli":
        "./src/cli/index"
      ,
      "@cli/commands":
        "./src/cli/commands/index"
      ,
      "@cli/diagnostico":
        "./src/cli/diagnostico/index"
      ,
      "@cli/diagnostico/exporters":
        "./src/cli/diagnostico/exporters/index"
      ,
      "@cli/diagnostico/handlers":
        "./src/cli/diagnostico/handlers/index"
      ,
      "@cli/handlers":
        "./src/cli/handlers/index"
      ,
      "@cli/helpers":
        "./src/cli/helpers/index"
      ,
      "@cli/options":
        "./src/cli/options/index"
      ,
      "@cli/processing":
        "./src/cli/processing/index"
      ,
      "@core/config":
        "./src/core/config/index"
      ,
      "@core/config/auto":
        "./src/core/config/auto/index"
      ,
      "@core/execution":
        "./src/core/execution/index"
      ,
      "@core/messages":
        "./src/core/messages/index"
      ,
      "@core/parsing":
        "./src/core/parsing/index"
      ,
      "@core/registry":
        "./src/core/registry/index"
      ,
      "@core/reporting":
        "./src/core/reporting/index"
      ,
      "@core/schema":
        "./src/core/schema/index"
      ,
      "@core/utils":
        "./src/core/utils/index"
      ,
      "@core/workers":
        "./src/core/workers/index"
      ,
      "@guardian":
        "./src/guardian/index"
      ,
      "@licensas":
        "./src/licensas/index"
      ,
      "@projeto-types":
        "./src/types/index"
      ,
      "@projeto-types/analistas":
        "./src/types/analistas/index"
      ,
      "@projeto-types/analistas/corrections":
        "./src/types/analistas/corrections/index"
      ,
      "@projeto-types/analistas/css":
        "./src/types/analistas/css/index"
      ,
      "@projeto-types/analistas/css-in-js":
        "./src/types/analistas/css-in-js/index"
      ,
      "@projeto-types/analistas/css-in-js/analistas":
        "./src/types/analistas/css-in-js/analistas/index"
      ,
      "@projeto-types/analistas/css-in-js/corrections":
        "./src/types/analistas/css-in-js/corrections/index"
      ,
      "@projeto-types/analistas/css-in-js/detectores":
        "./src/types/analistas/css-in-js/detectores/index"
      ,
      "@projeto-types/analistas/css/analistas":
        "./src/types/analistas/css/analistas/index"
      ,
      "@projeto-types/analistas/css/corrections":
        "./src/types/analistas/css/corrections/index"
      ,
      "@projeto-types/analistas/css/detectores":
        "./src/types/analistas/css/detectores/index"
      ,
      "@projeto-types/analistas/detectores":
        "./src/types/analistas/detectores/index"
      ,
      "@projeto-types/analistas/estrategistas":
        "./src/types/analistas/estrategistas/index"
      ,
      "@projeto-types/analistas/formatters":
        "./src/types/analistas/formatters/index"
      ,
      "@projeto-types/analistas/formatters/analistas":
        "./src/types/analistas/formatters/analistas/index"
      ,
      "@projeto-types/analistas/formatters/corrections":
        "./src/types/analistas/formatters/corrections/index"
      ,
      "@projeto-types/analistas/formatters/detectores":
        "./src/types/analistas/formatters/detectores/index"
      ,
      "@projeto-types/analistas/github-actions":
        "./src/types/analistas/github-actions/index"
      ,
      "@projeto-types/analistas/github-actions/analistas":
        "./src/types/analistas/github-actions/analistas/index"
      ,
      "@projeto-types/analistas/github-actions/corrections":
        "./src/types/analistas/github-actions/corrections/index"
      ,
      "@projeto-types/analistas/github-actions/detectores":
        "./src/types/analistas/github-actions/detectores/index"
      ,
      "@projeto-types/analistas/html":
        "./src/types/analistas/html/index"
      ,
      "@projeto-types/analistas/html/analistas":
        "./src/types/analistas/html/analistas/index"
      ,
      "@projeto-types/analistas/html/corrections":
        "./src/types/analistas/html/corrections/index"
      ,
      "@projeto-types/analistas/html/detectores":
        "./src/types/analistas/html/detectores/index"
      ,
      "@projeto-types/analistas/js-ts":
        "./src/types/analistas/js-ts/index"
      ,
      "@projeto-types/analistas/js-ts/analistas":
        "./src/types/analistas/js-ts/analistas/index"
      ,
      "@projeto-types/analistas/js-ts/corrections":
        "./src/types/analistas/js-ts/corrections/index"
      ,
      "@projeto-types/analistas/js-ts/detectores":
        "./src/types/analistas/js-ts/detectores/index"
      ,
      "@projeto-types/analistas/markdown":
        "./src/types/analistas/markdown/index"
      ,
      "@projeto-types/analistas/markdown/analistas":
        "./src/types/analistas/markdown/analistas/index"
      ,
      "@projeto-types/analistas/plugins":
        "./src/types/analistas/plugins/index"
      ,
      "@projeto-types/analistas/python":
        "./src/types/analistas/python/index"
      ,
      "@projeto-types/analistas/python/analistas":
        "./src/types/analistas/python/analistas/index"
      ,
      "@projeto-types/analistas/python/corrections":
        "./src/types/analistas/python/corrections/index"
      ,
      "@projeto-types/analistas/python/detectores":
        "./src/types/analistas/python/detectores/index"
      ,
      "@projeto-types/analistas/react":
        "./src/types/analistas/react/index"
      ,
      "@projeto-types/analistas/react/analistas":
        "./src/types/analistas/react/analistas/index"
      ,
      "@projeto-types/analistas/react/corrections":
        "./src/types/analistas/react/corrections/index"
      ,
      "@projeto-types/analistas/react/detectores":
        "./src/types/analistas/react/detectores/index"
      ,
      "@projeto-types/analistas/shell":
        "./src/types/analistas/shell/index"
      ,
      "@projeto-types/analistas/shell/analistas":
        "./src/types/analistas/shell/analistas/index"
      ,
      "@projeto-types/analistas/shell/corrections":
        "./src/types/analistas/shell/corrections/index"
      ,
      "@projeto-types/analistas/shell/detectores":
        "./src/types/analistas/shell/detectores/index"
      ,
      "@projeto-types/analistas/sql":
        "./src/types/analistas/sql/index"
      ,
      "@projeto-types/analistas/sql/analistas":
        "./src/types/analistas/sql/analistas/index"
      ,
      "@projeto-types/analistas/sql/corrections":
        "./src/types/analistas/sql/corrections/index"
      ,
      "@projeto-types/analistas/sql/detectores":
        "./src/types/analistas/sql/detectores/index"
      ,
      "@projeto-types/analistas/svg":
        "./src/types/analistas/svg/index"
      ,
      "@projeto-types/analistas/svg/analistas":
        "./src/types/analistas/svg/analistas/index"
      ,
      "@projeto-types/analistas/svg/corrections":
        "./src/types/analistas/svg/corrections/index"
      ,
      "@projeto-types/analistas/svg/detectores":
        "./src/types/analistas/svg/detectores/index"
      ,
      "@projeto-types/analistas/tailwind":
        "./src/types/analistas/tailwind/index"
      ,
      "@projeto-types/analistas/tailwind/analistas":
        "./src/types/analistas/tailwind/analistas/index"
      ,
      "@projeto-types/analistas/tailwind/corrections":
        "./src/types/analistas/tailwind/corrections/index"
      ,
      "@projeto-types/analistas/tailwind/detectores":
        "./src/types/analistas/tailwind/detectores/index"
      ,
      "@projeto-types/analistas/xml":
        "./src/types/analistas/xml/index"
      ,
      "@projeto-types/analistas/xml/analistas":
        "./src/types/analistas/xml/analistas/index"
      ,
      "@projeto-types/analistas/xml/corrections":
        "./src/types/analistas/xml/corrections/index"
      ,
      "@projeto-types/analistas/xml/detectores":
        "./src/types/analistas/xml/detectores/index"
      ,
      "@projeto-types/cli":
        "./src/types/cli/index"
      ,
      "@projeto-types/comum":
        "./src/types/comum/index"
      ,
      "@projeto-types/core":
        "./src/types/core/index"
      ,
      "@projeto-types/estrutura":
        "./src/types/estrutura/index"
      ,
      "@projeto-types/guardian":
        "./src/types/guardian/index"
      ,
      "@projeto-types/licensas":
        "./src/types/licensas/index"
      ,
      "@projeto-types/projeto":
        "./src/types/projeto/index"
      ,
      "@projeto-types/relatorios":
        "./src/types/relatorios/index"
      ,
      "@projeto-types/shared":
        "./src/types/shared/index"
      ,
      "@projeto-types/zeladores":
        "./src/types/zeladores/index"
      ,
      "@prometheus":
        "./src/types/index"
      ,
      "@relatorios":
        "./src/relatorios/index"
      ,
      "@sdk":
        "./src/sdk/index"
      ,
      "@shared":
        "./src/shared/index"
      ,
      "@shared/data-processing":
        "./src/shared/data-processing/index"
      ,
      "@shared/helpers":
        "./src/shared/helpers/index"
      ,
      "@shared/impar":
        "./src/shared/impar/index"
      ,
      "@shared/persistence":
        "./src/shared/persistence/index"
      ,
      "@shared/plugins":
        "./src/shared/plugins/index"
      ,
      "@shared/validation":
        "./src/shared/validation/index"
      ,
      "@zeladores": "./src/zeladores/index"

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
