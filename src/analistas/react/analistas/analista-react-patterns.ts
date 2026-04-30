// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';

function warn(message: string, relPath: string, line?: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.react,
    tipo: 'react'
  });
}

export const analistaReactPatterns = criarAnalista({
  nome: 'analista-react-patterns',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em código React',
  global: false,
  test: (relPath: string): boolean => /\.(jsx|tsx|react\.js|react\.ts)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/target\s*=\s*["']?_blank["']?/.test(line) && !/rel\s*=\s*["'][^"']*(?:noopener|noreferrer)/i.test(line)) {
        ocorrencias.push(warn(messages.ReactMensagens.linkTargetBlank, relPath, i + 1, 'aviso'));
      }

      if (/dangerouslySetInnerHTML/i.test(line)) {
        ocorrencias.push(warn(messages.ReactMensagens.dangerouslySetInnerHTML, relPath, i + 1, 'aviso'));
      }

      if (/src\s*=\s*["']https?:\/\//i.test(line) && !/https:/i.test(line)) {
        ocorrencias.push(warn(messages.ReactMensagens.httpFetch, relPath, i + 1, 'info'));
      }

      if (/(?:password|secret|api[_-]?key|token)\s*[:=]\s*["'][^"']+["']/i.test(line)) {
        ocorrencias.push(warn(messages.ReactMensagens.hardcodedCredential, relPath, i + 1, 'erro'));
      }

      if (/location\.href\s*=/.test(line)) {
        ocorrencias.push(warn(messages.ReactMensagens.locationHrefRedirect, relPath, i + 1, 'aviso'));
      }

      const jsxMapMatch = line.match(/\.map\s*\([^)]*,\s*(\w+)\s*\)/);
      if (jsxMapMatch) {
        const hasKeyAfter = lines.slice(i + 1, i + 5).some(l => new RegExp(`key\\s*=|\\{${jsxMapMatch[1]}\\}`).test(l));
        if (!hasKeyAfter && !/key\s*=/.test(line)) {
          ocorrencias.push(warn(messages.ReactMensagens.listItemNoKey, relPath, i + 1, 'aviso'));
        }
      }

      const indexAsKeyMatch = line.match(/\.map\s*\(\s*\(?\s*_?\s*,\s*(\w+)\s*\)/);
      if (indexAsKeyMatch && indexAsKeyMatch[1] === 'index') {
        if (!/key\s*=\s*\{index\}/.test(line)) {
          ocorrencias.push(warn(messages.ReactMensagens.indexAsKey, relPath, i + 1, 'info'));
        }
      }

      if (/<img[^>]*>/i.test(line) && !/(alt=|aria-label=)/i.test(line)) {
        ocorrencias.push(warn(messages.ReactMensagens.imgWithoutAlt, relPath, i + 1, 'aviso'));
      }

      const inlineHandlerMatch = line.match(/\s(onClick|onChange|onSubmit)\s*=\s*\{/);
      if (inlineHandlerMatch) {
        const isArrowFunction = /=>\s*\{/.test(line) || /\)\s*=>\s*\{/.test(line);
        if (isArrowFunction) {
          ocorrencias.push(warn(messages.ReactMensagens.inlineHandlerJsx, relPath, i + 1, 'info'));
        }
      }

      const deprecatedMethods = ['componentWillMount', 'componentWillReceiveProps', 'componentWillUpdate'];
      for (const method of deprecatedMethods) {
        if (new RegExp(`\\b${method}\\b`).test(line)) {
          ocorrencias.push(warn(messages.ReactMensagens.deprecatedLifecycleMethod(method), relPath, i + 1, 'aviso'));
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});