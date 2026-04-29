// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Analista, Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarOcorrencia } from '@prometheus';
import { createLineLookup } from '@shared/helpers';

const quickFixesHtml: Array<{
  pattern: RegExp;
  type: string;
  fix: (match: RegExpMatchArray) => string;
  description: string;
}> = [
  {
    pattern: /\.(innerHTML|outerHTML)\s*=\s*([^"']|$)/g,
    type: 'dangerous-html',
    fix: (m) => m[0].replace(/\.(innerHTML|outerHTML)\s*=\s*/, '.textContent = '),
    description: 'Substituir innerHTML/outerHTML por textContent para evitar XSS'
  },
  {
    pattern: /document\.write\(/g,
    type: 'dangerous-html',
    fix: () => '// document.write() removido - usar manipulação de DOM segura',
    description: 'Remover document.write() - usar createElement/appendChild'
  },
  {
    pattern: /<a[^>]*href=["']?["']/g,
    type: 'link-sem-href',
    fix: (m) => m[0].replace(/href=["']?["']/, 'href="#"'),
    description: 'Adicionar href placeholder em links sem URL'
  },
  {
    pattern: /<iframe[^>](?!.*title=)/g,
    type: 'iframe-sem-title',
    fix: (m) => `${m[0].slice(0, -1)  } title="Descrição do iframe">`,
    description: 'Adicionar title em iframe para acessibilidade'
  },
  {
    pattern: /<img[^>](?!.*alt=)/g,
    type: 'img-sem-alt',
    fix: (m) => `${m[0].slice(0, -1)  } alt="">`,
    description: 'Adicionar alt em img para acessibilidade'
  },
  {
    pattern: /<a[^>]*target=["']?_blank["']?[^>]*>(?!.*rel=)/g,
    type: 'link-blank-sem-rel',
    fix: (m) => `${m[0].slice(0, -1)  } rel="noopener noreferrer">`,
    description: 'Adicionar rel="noopener noreferrer" em links com target="_blank"'
  },
  {
    pattern: /<button[^>](?!.*type=)/g,
    type: 'button-sem-type',
    fix: (m) => `${m[0].slice(0, -1)  } type="button">`,
    description: 'Adicionar type="button" em buttons'
  }
];

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.html,
    tipo: 'auto-fix-html'
  });
}

export const analistaQuickFixesHtml: Analista = {
  nome: 'analista-quick-fixes-html',
  categoria: 'melhorias',
  descricao: 'Detecta problemas HTML e oferece correções automáticas',
  global: false,
  test: (relPath: string): boolean => /\.(html|htm)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    if (!src) return null;
    const ocorrencias: Ocorrencia[] = [];
    const lineOf = createLineLookup(src).lineAt;

    for (const qf of quickFixesHtml) {
      const regex = new RegExp(qf.pattern.source, qf.pattern.flags);
      for (const m of src.matchAll(regex)) {
        if (typeof m.index === 'number') {
          const linha = lineOf(m.index);
          qf.fix(m);

          ocorrencias.push(warn(
            `${qf.description} (${qf.type})`,
            relPath,
            linha,
            qf.type === 'dangerous-html' ? 'erro' : 'aviso'
          ));
        }
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
};