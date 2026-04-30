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
    origem: messages.AnalystOrigens.xml,
    tipo: 'xml'
  });
}

export const analistaXmlPatterns = criarAnalista({
  nome: 'analista-xml-patterns',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em arquivos XML',
  global: false,
  test: (relPath: string): boolean => /\.xml$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const lines = src.split('\n');

    if (!/<\?xml[^?]*\?>/i.test(src)) {
      ocorrencias.push(warn(messages.XmlMensagens.xmlPrologAusente, relPath, 1, 'info'));
    }


    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/<!DOCTYPE/i.test(line)) {
        ocorrencias.push(warn(messages.XmlMensagens.doctypeDetectado, relPath, i + 1, 'aviso'));

        if (/SYSTEM|PUBLIC/i.test(line)) {
          ocorrencias.push(warn(messages.XmlMensagens.doctypeExternoDetectado, relPath, i + 1, 'erro'));
        }
      }

      if (/<!ENTITY[^%]/i.test(line)) {
        ocorrencias.push(warn(messages.XmlMensagens.entidadeDetectada, relPath, i + 1, 'aviso'));

        if (/SYSTEM|PUBLIC/i.test(line)) {
          ocorrencias.push(warn(messages.XmlMensagens.entidadeExternaDetectada, relPath, i + 1, 'erro'));
        }
      }

      if (/<!ENTITY\s+%/i.test(line)) {
        ocorrencias.push(warn(messages.XmlMensagens.entidadeParametroDetectada, relPath, i + 1, 'aviso'));
      }

      if (/<xi:include|xi:fallback/i.test(line)) {
        ocorrencias.push(warn(messages.XmlMensagens.xincludeDetectado, relPath, i + 1, 'info'));
      }

      const namespaceMatch = line.match(/(\w+):(\w+)=/);
      if (namespaceMatch) {
        const prefix = namespaceMatch[1];
        const hasXmlns = /xmlns:/.test(line) || src.includes(`xmlns:${prefix}=`);
        if (!hasXmlns) {
          ocorrencias.push(warn(messages.XmlMensagens.namespaceUndeclared(prefix), relPath, i + 1, 'erro'));
        }
      }

      if (/&(?!\w+;)/.test(line)) {
        ocorrencias.push(warn('Entidade inválida detectada no XML', relPath, i + 1, 'erro'));
      }
    }

    const tagStack: string[] = [];
    const tagRegex = /<(\/?)(\w+)[^>]*\/?>/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(src)) !== null) {
      if (tagMatch[0].endsWith('/>')) continue;
      if (tagMatch[1]) {
        if (tagStack.length > 0 && tagStack[tagStack.length - 1] === tagMatch[2]) {
          tagStack.pop();
        }
      } else {
        tagStack.push(tagMatch[2]);
      }
    }

    if (tagStack.length > 0) {
      ocorrencias.push(warn(messages.XmlMensagens.invalidXmlStructure, relPath, lines.length, 'erro'));
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});