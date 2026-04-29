// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import { createLineLookup } from '@shared/helpers';
import { parseDocument } from 'htmlparser2';
import type { AnyNode, Element, Text } from 'domhandler';

const LIMITE_PROFUNDIDADE = 5;
const LIMITE_TAMANHO_CONTEUDO = 2000;

function warn(message: string, relPath: string, line?: number): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel: messages.SeverityNiveis.warning,
    origem: messages.AnalystOrigens.html,
    tipo: 'html'
  });
}

type NodeWithChildren = AnyNode & {
  children?: AnyNode[];
};

function walk(node: AnyNode, visit: (n: AnyNode, depth: number) => void, depth = 0) {
  visit(node, depth);
  const children = (node as NodeWithChildren).children;
  if (Array.isArray(children)) {
    for (const c of children) walk(c, visit, depth + 1);
  }
}

function getTextContent(node: AnyNode): string {
  if (node.type === 'text') {
    return String((node as Text).data || '');
  }
  const children = (node as NodeWithChildren).children;
  if (Array.isArray(children)) {
    return children.map(c => getTextContent(c)).join('');
  }
  return '';
}

function isElement(n: AnyNode): n is Element {
  return n.type === 'tag';
}

export const analistaElementosLongos = criarAnalista({
  nome: 'analista-elementos-longos',
  categoria: 'complexidade',
  descricao: 'Detecta elementos HTML muito grandes, aninhamento excessivo ou conteúdo inline extenso',
  global: false,
  test: (relPath: string): boolean => /\.(html|htm)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const isTemplate = /\.(template\.html|\.component\.html)$/i.test(relPath);
    const lineOf = createLineLookup(src).lineAt;

    try {
      const doc = parseDocument(src, {
        xmlMode: false,
        withStartIndices: true,
        withEndIndices: true,
        recognizeSelfClosing: true
      }) as unknown as AnyNode;

      walk(doc as unknown as AnyNode, (node, depth) => {
        if (!isElement(node)) return;
        const tag = String(node.name || '').toLowerCase();
        const line = lineOf(typeof (node as unknown as { startIndex?: number }).startIndex === 'number'
          ? (node as unknown as { startIndex?: number }).startIndex as number : 0);

        if (depth > LIMITE_PROFUNDIDADE && !isTemplate) {
          ocorrencias.push(warn(
            `Elemento <${tag}> com aninhamento profundo (nível ${depth}, máx: ${LIMITE_PROFUNDIDADE})`,
            relPath,
            line
          ));
        }

        const textContent = getTextContent(node);
        if (textContent.length > LIMITE_TAMANHO_CONTEUDO && !isTemplate) {
          ocorrencias.push(warn(
            `Elemento <${tag}> com conteúdo muito longo (${textContent.length} chars, máx: ${LIMITE_TAMANHO_CONTEUDO})`,
            relPath,
            line
          ));
        }
      });

      return ocorrencias.length > 0 ? ocorrencias : null;
    } catch {
      return null;
    }
  }
});