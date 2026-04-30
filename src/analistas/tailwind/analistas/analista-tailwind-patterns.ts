// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

import { categorizeTailwindToken, hasDarkModeVariant } from './consts.js';

function warn(message: string, relPath: string, line?: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({ relPath, mensagem: message, linha: line, nivel, origem: messages.AnalystOrigens.tailwind, tipo: messages.AnalystTipos.tailwind });
}

export const analistaTailwindPatterns = criarAnalista({
  nome: 'analista-tailwind-patterns',
  categoria: 'qualidade',
  descricao: 'Detecta padroes problemáticos em classes Tailwind CSS',
  global: false,
  test: (relPath: string): boolean => /\.(jsx|tsx|js|ts|html|astro)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<Ocorrencia[] | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/\bfont-mono\b/.test(line) || /\bfont-sans\b/.test(line)) {
        ocorrencias.push(warn('Font family explicitly set. Consider using design system tokens.', relPath, i + 1, 'suggestion'));
      }

      if (/tracking-(?:tighter|tight|normal|wider|wider)/i.test(line)) {
        const sizeMatch = line.match(/tracking-(?:tighter|tight|normal|wider|wider)/i);
        if (sizeMatch) {
          ocorrencias.push(warn(`Non-standard tracking value: ${sizeMatch[0]}`, relPath, i + 1, 'info'));
        }
      }

      if (/leading-\d+/.test(line)) {
        const leadingMatch = line.match(/leading-(\d+)/i);
        if (leadingMatch) {
          const value = parseInt(leadingMatch[1]);
          if (value < 3 || value > 10) {
            ocorrencias.push(warn(`Unusual line-height multiplier: ${value}. Standard Tailwind range is 3-10.`, relPath, i + 1, 'info'));
          }
        }
      }

      if (/w-px\b/.test(line) || /h-px\b/.test(line)) {
        ocorrencias.push(warn('Pixel-based sizing detected. Consider using rem for scalability.', relPath, i + 1, 'suggestion'));
      }

      if (/text-\d+(?:\/[\w-]+)?\b/.test(line)) {
        const match = line.match(/text-(\d+)(?:\/([\w-]+))?/i);
        if (match) {
          const fontSize = parseInt(match[1]);
          if (fontSize > 14 && fontSize % 2 !== 0) {
            ocorrencias.push(warn(`Non-standard font size: ${match[0]}. Odd sizes may cause subpixel rendering issues.`, relPath, i + 1, 'info'));
          }
        }
      }

      if (/z-\d+\b/.test(line)) {
        const zMatch = line.match(/z-(\d+)/i);
        if (zMatch) {
          const value = parseInt(zMatch[1]);
          if (value > 50) {
            ocorrencias.push(warn(`High z-index value: ${value}. Consider using named layers or a lower value.`, relPath, i + 1, 'info'));
          }
        }
      }

      if (/grayscale-\d+/.test(line)) {
        const grayMatch = line.match(/grayscale-(\d+)/i);
        if (grayMatch) {
          const value = parseInt(grayMatch[1]);
          if (value > 0 && value < 100) {
            ocorrencias.push(warn(`Partial grayscale filter: ${value}. Consider full or zero for clarity.`, relPath, i + 1, 'info'));
          }
        }
      }

      if (/blur-(\d+)/.test(line)) {
        const blurMatch = line.match(/blur-(\d+)/i);
        if (blurMatch) {
          const value = parseInt(blurMatch[1]);
          if (value > 50) {
            ocorrencias.push(warn(`High blur value: ${value}px. May impact performance on mobile.`, relPath, i + 1, 'suggestion'));
          }
        }
      }

      if (/duration-\d+\b/.test(line)) {
        const durMatch = line.match(/duration-(\d+)/i);
        if (durMatch) {
          const value = parseInt(durMatch[1]);
          if (value > 1000) {
            ocorrencias.push(warn(`Long transition duration: ${value}ms. Consider shorter for better UX.`, relPath, i + 1, 'info'));
          }
        }
      }

      const classMatch = line.match(/class(Name)?\s*=\s*["'`]([^"'`]+)["'`]/);
      if (classMatch) {
        const classes = classMatch[1].split(/\s+/).filter(Boolean);
        const darkClasses = classes.filter(c => hasDarkModeVariant(c));
        if (darkClasses.length > 3) {
          ocorrencias.push(warn(`Many dark mode variants (${darkClasses.length}). Consider using CSS variables or Tailwind dark mode plugin.`, relPath, i + 1, 'suggestion'));
        }

        const arbitraryClasses = classes.filter(c => /\[.*\]/.test(c));
        if (arbitraryClasses.length > 3) {
          ocorrencias.push(warn(`Many arbitrary values (${arbitraryClasses.length}). Review design system alignment.`, relPath, i + 1, 'suggestion'));
        }

        const duplicateClasses = classes.filter((c, idx) => classes.indexOf(c) !== idx);
        if (duplicateClasses.length > 0) {
          const uniq = [...new Set(duplicateClasses)];
          ocorrencias.push(warn(`Duplicate classes detected: ${uniq.join(', ')}`, relPath, i + 1, 'warning'));
        }
      }

      for (const cls of line.matchAll(/class(Name)?\s*=\s*["'`]([^"'`]+)["'`]/g)) {
        const classes = (cls[2] ?? '').split(/\s+/).filter(Boolean);
        for (const c of classes) {
          const cat = categorizeTailwindToken(c);
          if (cat && cat.category === 'color' && /-\d{3,4}/.test(c)) {
            const weightMatch = c.match(/-(\d{3,4})/);
            if (weightMatch) {
              const weight = parseInt(weightMatch[1]);
              if (weight < 50 || weight > 950) {
                ocorrencias.push(warn(`Non-standard color weight: ${weight}. Tailwind uses 50-950.`, relPath, i + 1, 'info'));
              }
            }
          }
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});