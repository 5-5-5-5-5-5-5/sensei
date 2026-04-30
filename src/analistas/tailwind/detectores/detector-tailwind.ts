// SPDX-License-Identifier: MIT

export interface TailwindDetectorConfig {
  enableJit?: boolean;
  enableDarkMode?: boolean;
  enableArbitraryValues?: boolean;
  enableResponsivePatterns?: boolean;
}

export function detectarTailwindEmSrc(src: string): boolean {
  const tailwindPatterns = [
    /\bflex\b/,
    /\bgrid\b/,
    /\bspace-y-\d+\b/,
    /\bp-\d+\b/,
    /\bm-\d+\b/,
    /\bw-\d+\b/,
    /\bh-\d+\b/,
    /\bbg-\w+-\d+\b/,
    /\btext-\w+-\d+\b/,
    /\brounded\w*\b/,
    /\bshadow\w*\b/,
    /\bfont-\w+\b/,
    /\bleading-\w+\b/,
    /\btracking-\w+\b/,
    /\bjustify-\w+\b/,
    /\bitems-\w+\b/,
    /\bhover:\w+\b/,
    /\bfocus:\w+\b/,
    /\bsm:\w+\b/,
    /\bmd:\w+\b/,
    /\blg:\w+\b/,
    /\bxl:\w+\b/,
    /\b\w+\[\w+\]\b/
  ];

  return tailwindPatterns.some(p => p.test(src));
}

export function detectarTailwindEmDependencias(packageJson: string): { usaTailwind: boolean; versao?: string; plugins?: string[] } {
  const deps = packageJson.toLowerCase();

  const usa = /\btailwindcss\b/.test(deps);
  if (!usa) return { usaTailwind: false };

  const versaoMatch = deps.match(/tailwindcss["']?\s*[:=]\s*["']?(\d+\.\d+\.\d+)/);
  const versao = versaoMatch?.[1];

  const plugins: string[] = [];
  const pluginMap: Record<string, string> = {
    '@tailwindcss/forms': 'Forms plugin',
    '@tailwindcss/typography': 'Typography plugin',
    '@tailwindcss/line-clamp': 'Line clamp plugin',
    '@tailwindcss/aspect-ratio': 'Aspect ratio plugin'
  };

  for (const [pkg, name] of Object.entries(pluginMap)) {
    if (deps.includes(pkg)) plugins.push(name);
  }

  return { usaTailwind: true, versao, plugins };
}

export function detectarTailwindConfig(tailwindConfig: string): { modoDark?: string; content?: string[]; theme?: Record<string, unknown> } {
  if (!tailwindConfig) return {};

  const darkModeMatch = tailwindConfig.match(/darkMode:\s*['"]([^'"]+)['"]/);
  const darkMode = darkModeMatch?.[1];

  const contentMatch = tailwindConfig.matchAll(/content:\s*\[([^\]]+)\]/g);
  const content = Array.from(contentMatch, m => m[1].replace(/['"]/g, '').trim()).flat();

  return {
    ...(darkMode && { modoDark: darkMode }),
    ...(content.length && { content }),
    ...(tailwindConfig.includes('theme:') && {})
  };
}

export const detectorTailwind = {
  nome: 'detector-tailwind',
  descricao: 'Detecta uso de Tailwind CSS e analisa configuracoes',
  detectar: (src: string): { detectado: boolean; linguagem: string; meta?: Record<string, unknown> } | null => {
    if (!detectarTailwindEmSrc(src)) return null;

    const configuracoes: string[] = [];
    if (/\bdark:\w+\b/.test(src)) configuracoes.push('dark mode');
    if (/\bsm:|md:|lg:|xl:/.test(src)) configuracoes.push('responsive');
    if (/\[.*\]/.test(src)) configuracoes.push('arbitrary values');
    if (/\bgroup:\w+\b/.test(src)) configuracoes.push('group variants');
    if (/\bpeer:\w+\b/.test(src)) configuracoes.push('peer variants');

    return {
      detectado: true,
      linguagem: 'css',
      meta: {
        tipo: 'framework',
        nome: 'Tailwind CSS',
        configuracoes
      }
    };
  }
};