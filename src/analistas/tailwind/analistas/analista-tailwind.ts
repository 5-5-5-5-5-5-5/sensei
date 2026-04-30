// SPDX-License-Identifier: MIT
import type { Ocorrencia } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import { createLineLookup } from '@shared/helpers';

import { messages } from '../../../core/consts.js';
import { categorizeTailwindToken, hasDarkModeVariant, isJitPattern, TAILWIND_RESPONSIVE_PREFIXES, TAILWIND_STATE_PREFIXES } from './consts.js';

const disableEnv = process.env.PROMETHEUS_DISABLE_PLUGIN_TAILWIND === '1';

type Msg = ReturnType<typeof criarOcorrencia>;
type ClassBlock = { text: string; line: number; };

function extractBalancedBraces(src: string, braceStartIndex: number, maxLen = 8000): string | null {
  if (braceStartIndex < 0 || braceStartIndex >= src.length) return null;
  if (src[braceStartIndex] !== '{') return null;
  let currentIndex = braceStartIndex + 1;
  let depth = 1;
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  let escaped = false;
  const endLimite = Math.min(src.length, braceStartIndex + maxLen);
  while (currentIndex < endLimite) {
    const ch = src[currentIndex];
    if (escaped) { escaped = false; currentIndex++; continue; }
    if (ch === '\\') {
      if (inSingle || inDouble || inBacktick) { escaped = true; }
      currentIndex++;
      continue;
    }
    if (inSingle) { if (ch === "'") inSingle = false; currentIndex++; continue; }
    if (inDouble) { if (ch === '"') inDouble = false; currentIndex++; continue; }
    if (inBacktick) { if (ch === '`') inBacktick = false; currentIndex++; continue; }
    if (ch === "'") { inSingle = true; currentIndex++; continue; }
    if (ch === '"') { inDouble = true; currentIndex++; continue; }
    if (ch === '`') { inBacktick = true; currentIndex++; continue; }
    if (ch === '{') depth++; else if (ch === '}') depth--;
    if (depth === 0) return src.slice(braceStartIndex + 1, currentIndex);
    currentIndex++;
  }
  return null;
}

function sanitizeTemplateLiteralText(text: string): string {
  return text.replace(/\$\{[\s\S]*?\}/g, ' ');
}

function normalizeClassText(text: string): string {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function isTernaryExpressionText(text: string): boolean {
  return /\?/.test(text) && /:/.test(text);
}

function extractStringLiterals(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(/"([^"\\\n]|\\.)*"/g)) out.push((m[0] ?? '').slice(1, -1));
  for (const m of text.matchAll(/'([^'\\\n]|\\.)*'/g)) out.push((m[0] ?? '').slice(1, -1));
  for (const m of text.matchAll(/`([^`]*)`/g)) out.push(sanitizeTemplateLiteralText((m[1] ?? '').toString()));
  return out;
}

function extractClassBlocks(src: string): ClassBlock[] {
  const blocks: ClassBlock[] = [];
  const lineOf = createLineLookup(src).lineAt;
  const seen = new Set<string>();
  const pushBlock = (text: string, line: number) => {
    const normalized = normalizeClassText(text);
    if (!normalized) return;
    const key = `${line}|${normalized}`;
    if (seen.has(key)) return;
    seen.add(key);
    blocks.push({ text: normalized, line });
  };

  for (const m of src.matchAll(/\bclass(Name)?\s*=\s*(["'])([^"']*)\2/gi)) pushBlock(m[3] ?? '', lineOf(m.index));
  for (const m of src.matchAll(/\bclass(Name)?\s*=\s*\{\s*(["'])([^"']*)\2\s*\}/gi)) pushBlock(m[3] ?? '', lineOf(m.index));
  for (const m of src.matchAll(/\bclass(Name)?\s*=\s*\{\s*`([^`]*)`\s*\}/gi)) pushBlock(sanitizeTemplateLiteralText(m[2] ?? ''), lineOf(m.index));
  for (const m of src.matchAll(/\bclass(Name)?\s*=\s*`([^`]*)`/gi)) pushBlock(sanitizeTemplateLiteralText(m[2] ?? ''), lineOf(m.index));

  for (const m of src.matchAll(/\bclass(Name)?\s*=\s*\{/gi)) {
    const idx = m.index ?? -1;
    if (idx < 0) continue;
    const braceIdx = idx + (m[0]?.length ?? 0) - 1;
    const expr = extractBalancedBraces(src, braceIdx);
    if (!expr) continue;
    const line = lineOf(idx);
    const literals = extractStringLiterals(expr).map(s => s.trim()).filter(Boolean);
    if (!literals.length) continue;
    if (isTernaryExpressionText(expr)) { literals.forEach(s => pushBlock(s, line)); continue; }
    pushBlock(literals.join(' '), line);
  }

  for (const m of src.matchAll(/\bclass:list\s*=\s*\{/gi)) {
    const idx = m.index ?? -1;
    if (idx < 0) continue;
    const braceIdx = idx + (m[0]?.length ?? 0) - 1;
    const expr = extractBalancedBraces(src, braceIdx);
    if (!expr) continue;
    const line = lineOf(idx);
    const literals = extractStringLiterals(expr).map(s => s.trim()).filter(Boolean);
    if (!literals.length) continue;
    if (isTernaryExpressionText(expr)) { literals.forEach(s => pushBlock(s, line)); continue; }
    pushBlock(literals.join(' '), line);
  }

  for (const m of src.matchAll(/\b(?:clsx|cn|twMerge|classNames|classnames)\s*\(([^)]*)\)/g)) {
    const args = m[1] ?? '';
    const literals = extractStringLiterals(args).map(s => s.trim()).filter(Boolean);
    if (!literals.length) continue;
    pushBlock(literals.join(' '), lineOf(m.index));
  }
  return blocks;
}

function hasTailwindTokens(src: string): boolean {
  const blocks = extractClassBlocks(src);
  if (!blocks.length) return false;
  const tokenRe = /\b(?:bg-|text-|m[trblxy]?-|p[trblxy]?-|flex|grid|gap-|space-|rounded|shadow|justify-|items-|w-|h-|min-w-|max-w-|min-h-|max-h-|inset-|top-|left-|right-|bottom-|z-|overflow-|cursor-|select-|border|ring|opacity-|font-|leading-|tracking-|transition|duration-|ease-|animate-|underline|no-underline|sr-only|not-sr-only|container)\S*/i;
  return blocks.some(b => tokenRe.test(b.text));
}

function extractClasses(src: string): { token: string; line: number }[] {
  const results: { token: string; line: number }[] = [];
  for (const block of extractClassBlocks(src)) {
    const classes = block.text.split(/\s+/).filter(Boolean);
    classes.forEach(token => results.push({ token, line: block.line }));
  }
  return results;
}

function splitVariants(token: string): { variants: string; base: string } {
  const parts = token.split(':').filter(Boolean);
  if (parts.length <= 1) return { variants: '', base: token };
  return { variants: parts.slice(0, -1).join(':'), base: parts[parts.length - 1] };
}

function propertyKey(token: string): string | null {
  const { variants, base } = splitVariants(token);
  if (/^(fa-|icon-)/.test(base)) return null;
  const padMatch = /^(p[trblxy]?)(?:-|\[)/.exec(base);
  if (padMatch) return `${variants}|padding:${padMatch[1]}`;
  const marMatch = /^(m[trblxy]?)(?:-|\[)/.exec(base);
  if (marMatch) return `${variants}|margin:${marMatch[1]}`;
  const gapMatch = /^(gap(?:-[xy])?)(?:-|\[)/.exec(base);
  if (gapMatch) return `${variants}|gap:${gapMatch[1]}`;
  if (/^space-[xy]/.test(base)) return `${variants}|space`;
  if (/^(block|inline-block|inline|flex|grid|hidden)$/.test(base)) return `${variants}|display`;
  if (/^flex-(row|col)(-reverse)?$/.test(base)) return `${variants}|flex-direction`;
  if (/^justify-/.test(base)) return `${variants}|justify`;
  if (/^items-/.test(base)) return `${variants}|items`;
  if (/^rounded(?:-|\b|\[)/.test(base)) return `${variants}|rounded`;
  if (/^shadow(?:-|\b|\[)/.test(base)) return `${variants}|shadow`;
  if (/^bg-(?!opacity-)/.test(base)) return `${variants}|bg-color`;
  if (/^text-(xs|sm|base|lg|xl|\d+xl)$/.test(base)) return `${variants}|text-size`;
  if (/^text-(black|white|transparent|current)$/.test(base)) return `${variants}|text-color`;
  if (/^text-[a-z]+-\d{2,3}$/.test(base)) return `${variants}|text-color`;
  const groups: { re: RegExp; key: string }[] = [
    { re: /^w(?:-|\[)/, key: 'width' },
    { re: /^h(?:-|\[)/, key: 'height' },
    { re: /^min-w(?:-|\[)/, key: 'min-w' },
    { re: /^max-w(?:-|\[)/, key: 'max-w' },
    { re: /^min-h(?:-|\[)/, key: 'min-h' },
    { re: /^max-h(?:-|\[)/, key: 'max-h' },
    { re: /^(top|left|right|bottom)(?:-|\[)/, key: 'position' }
  ];
  const found = groups.find(g => g.re.test(base));
  return found ? `${variants}|${found.key}` : null;
}

function warn(message: string, relPath: string, line?: number, nivel: Ocorrencia['nivel'] = 'aviso'): Msg {
  return criarOcorrencia({ relPath, mensagem: message, linha: line, nivel, origem: messages.AnalystOrigins.tailwind, tipo: messages.AnalystTipos.tailwind });
}

function collectTailwindIssues(src: string, relPath: string): Msg[] {
  const ocorrencias: Msg[] = [];
  const blocks = extractClassBlocks(src);

  for (const block of blocks) {
    const tokens = (block.text || '').split(/\s+/).filter(Boolean);
    if (!tokens.length) continue;
    const line = block.line;
    const seen: Record<string, string[]> = {};

    for (const token of tokens) {
      const key = propertyKey(token);
      if (!key) continue;
      if (!seen[key]) seen[key] = [];
      seen[key].push(token);
    }

    for (const [key, list] of Object.entries(seen)) {
      const uniqTokens = [...new Set(list)];
      const repeats = list.filter((t, i) => list.indexOf(t) !== i);
      for (const r of [...new Set(repeats)]) {
        ocorrencias.push(warn(messages.TailwindMensagens.repeatedClass(r), relPath, line));
      }
      if (uniqTokens.length > 1) {
        const normalizedChave = key.includes('|') ? key.split('|').slice(1).join('|') : key;
        ocorrencias.push(warn(messages.TailwindMensagens.conflictingClasses(normalizedChave, uniqTokens.slice(0, 4)), relPath, line));
        const propSuffix = normalizedChave;
        const variantsSet = new Set<string>();
        for (const k of Object.keys(seen)) {
          const parts = k.split('|');
          const varPart = parts.length > 1 ? parts[0] : '';
          const propPart = parts.length > 1 ? parts.slice(1).join('|') : k;
          if (propPart === propSuffix) variantsSet.add(varPart || 'base');
        }
        if (variantsSet.size > 1) {
          ocorrencias.push(warn(messages.TailwindMensagens.variantConflict(propSuffix, Array.from(variantsSet)), relPath, line, 'suggestion'));
        }
      }
    }

    const propVariants: Record<string, Set<string>> = {};
    for (const k of Object.keys(seen)) {
      const parts = k.split('|');
      const varPart = parts.length > 1 ? parts[0] : '';
      const propPart = parts.length > 1 ? parts.slice(1).join('|') : k;
      if (!propVariants[propPart]) propVariants[propPart] = new Set();
      propVariants[propPart].add(varPart || 'base');
    }
    for (const [prop, vset] of Object.entries(propVariants)) {
      if (vset.size > 1) {
        ocorrencias.push(warn(messages.TailwindMensagens.variantConflict(prop, Array.from(vset)), relPath, line, 'suggestion'));
      }
    }
  }

  const safeArbitrary = /(var\()|(rgb\()|(hsl\()|(calc\()|url\(|linear-gradient|conic-gradient|radial-gradient|\d+(px|rem|em|%|vh|vw|ms|s|deg|fr)?\]|\d+\/\d+|\[--|^\d+\/\d+|\d+px|\d+rem|\d+em|\d+%|\d+deg|\d+fr/i;
  const allTokens = extractClasses(src);

  allTokens.filter(({ token }) => /\[.*\]/.test(token)).forEach(({ token, line }) => {
    const hasDangerousUrl = /\[.*url\(.+\).*\]/i.test(token) && /javascript:|data:text\/html/i.test(token);
    if (hasDangerousUrl) {
      ocorrencias.push(warn(messages.TailwindMensagens.dangerousArbitraryValue(token), relPath, line));
      return;
    }
    if (safeArbitrary.test(token)) return;
    ocorrencias.push(warn(messages.TailwindMensagens.arbitraryValue(token), relPath, line));
  });

  allTokens.filter(({ token }) => /!$/.test(token) || /!\]/.test(token)).forEach(({ token, line }) => {
    ocorrencias.push(warn(messages.TailwindMensagens.importantUsage(token), relPath, line, 'suggestion'));
  });

  for (const token of extractClasses(src).map(t => t.token)) {
    if (isJitPattern(token)) {
      const cat = categorizeTailwindToken(token);
      if (cat) {
        const line = extractClasses(src).find(t => t.token === token)?.line;
        if (/\[.*\]/.test(token)) {
          ocorrencias.push(warn(`JIT arbitrary value detected: ${token} (${cat.category})`, relPath, line, 'info'));
        }
      }
    }
  }

  for (const token of extractClasses(src).map(t => t.token)) {
    if (hasDarkModeVariant(token)) {
      const line = extractClasses(src).find(t => t.token === token)?.line;
      const cat = categorizeTailwindToken(token);
      if (cat) {
        ocorrencias.push(warn(`Dark mode variant with ${cat.category}: ${token}`, relPath, line, 'info'));
      }
    }
  }

  const tokensWithResponsive = extractClasses(src).map(t => t.token).filter(t =>
    TAILWIND_RESPONSIVE_PREFIXES.some(p => t.startsWith(`${p  }:`))
  );
  if (tokensWithResponsive.length > 0) {
    const uniqueVariants = new Set(tokensWithResponsive.map(t => {
      const parts = t.split(':');
      return parts[0];
    }));
    if (uniqueVariants.size >= 4) {
      const line = extractClasses(src).find(t => uniqueVariants.values().next().value && t.token.startsWith(`${uniqueVariants.values().next().value  }:`))?.line;
      ocorrencias.push(warn(`Full responsive scale detected (${uniqueVariants.size} breakpoints). Consider using design tokens or CSS variables.`, relPath, line, 'suggestao'));
    }
  }

  const tokensWithState = extractClasses(src).map(t => t.token).filter(t =>
    TAILWIND_STATE_PREFIXES.some(p => t.includes(`${p  }:`))
  );
  if (tokensWithState.length > 10) {
    const stateSet = new Set(tokensWithState.map(t => {
      const parts = t.split(':');
      return parts[0];
    }));
    if (stateSet.size >= 3) {
      const line = extractClasses(src).find(t => t.token.startsWith(`${[...stateSet][0]  }:`))?.line;
      ocorrencias.push(warn(`Many state variants detected (${stateSet.size} states). Ensure accessibility for keyboard/screen readers.`, relPath, line, 'info'));
    }
  }

  return ocorrencias;
}

export const analistaTailwind = criarAnalista({
  nome: 'analista-tailwind',
  categoria: 'estilo',
  descricao: 'Heuristicas leves de Tailwind CSS com suporte JIT, dark mode, e valores arbitrarios.',
  global: false,
  test: (relPath: string): boolean => /\.(jsx|tsx|js|ts|html|astro)$/i.test(relPath),
  aplicar: async (src, relPath): Promise<Msg[] | null> => {
    if (disableEnv) return null;
    if (!hasTailwindTokens(src)) return null;
    const msgs = collectTailwindIssues(src, relPath);
    return msgs.length ? msgs : null;
  }
});