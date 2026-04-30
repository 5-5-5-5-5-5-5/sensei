// SPDX-License-Identifier: MIT
import type { Correcao, Ocorrencia } from '@prometheus';
import { criarCorrecao } from '@prometheus';

export const quickFixesTailwind = criarCorrecao({
  nome: 'quick-fixes-tailwind',
  categoria: 'quick-fix',
  descricao: 'Correcoes rapidas para problemas comuns em classes Tailwind CSS',
  test: (relPath: string): boolean => /\.(jsx|tsx|js|ts|html|astro)$/i.test(relPath),
  aplicar: async (ocorrencia: Ocorrencia, src: string): Promise<Correcao | null> => {
    const { linha, mensagem } = ocorrencia;

    if (!linha) return null;

    const lines = src.split('\n');
    const line = lines[linha - 1];

    if (mensagem.includes('Repeated class')) {
      const classMatch = line.match(/class(Name)?\s*=\s*["'`]([^"'`]+)["'`]/);
      if (classMatch) {
        const classes = classMatch[1].split(/\s+/).filter(Boolean);
        const uniqueClasses = [...new Set(classes)];
        if (uniqueClasses.length < classes.length) {
          const fixed = line.replace(classMatch[1], uniqueClasses.join(' '));
          return {
            original: line,
            modificado: fixed,
            descricao: 'Remove duplicate Tailwind classes'
          };
        }
      }
    }

    if (mensagem.includes('arbitrary value') || mensagem.includes('arbitrary')) {
      const arbMatch = line.match(/\[([^\]]+)\]/);
      if (arbMatch) {
        const value = arbMatch[1];
        if (/^\d+px$/.test(value)) {
          const num = parseInt(value);
          const rem = Math.round(num / 4) / 4;
          const fixed = line.replace(arbMatch[0], `[${rem}rem]`);
          return {
            original: line,
            modificado: fixed,
            descricao: 'Convert px to rem for better accessibility'
          };
        }
        if (/^\d+rem$/.test(value)) {
          const fixed = line.replace(arbMatch[0], `[${value}]`);
          return {
            original: line,
            modificado: fixed,
            descricao: 'Consider using standard Tailwind spacing scale'
          };
        }
      }
    }

    if (mensagem.includes('Use of !') || mensagem.includes('important')) {
      const importantMatch = line.match(/(\S+)!/);
      if (importantMatch) {
        const token = importantMatch[1].replace('!', '');
        return {
          original: line,
          modificado: line,
          descricao: `Consider removing !important from "${token}". Use CSS specificity or higher utility class instead.`
        };
      }
    }

    if (mensagem.includes('dark mode')) {
      const fixed = line;
      return {
        original: line,
        modificado: fixed,
        descricao: 'Consider using Tailwind dark mode plugin with class: strategy'
      };
    }

    if (mensagem.includes('z-index') && mensagem.includes('High')) {
      const zMatch = line.match(/z-(\d+)/);
      if (zMatch) {
        const value = parseInt(zMatch[1]);
        if (value > 50) {
          const suggested = value > 100 ? 'auto' : '10';
          const fixed = line.replace(/z-\d+/, `z-${suggested}`);
          return {
            original: line,
            modificado: fixed,
            descricao: `Reduce z-index from ${value} to ${suggested}. Use named layers for better maintainability.`
          };
        }
      }
    }

    if (mensagem.includes('blur') && mensagem.includes('performance')) {
      const blurMatch = line.match(/blur-\d+/);
      if (blurMatch) {
        const fixed = line.replace(/blur-\d+/, 'blur-sm');
        return {
          original: line,
          modificado: fixed,
          descricao: 'Reduce blur value for better mobile performance'
        };
      }
    }

    return null;
  }
});