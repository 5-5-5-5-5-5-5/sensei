// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Analista, Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import { createLineLookup } from '@shared/helpers';

interface ProblemaPontuacao {
  tipo: string;
  peso: number;
  descricao: string;
}

const tabelasPontuacao: ProblemaPontuacao[] = [
  { tipo: 'doctype-faltando', peso: 10, descricao: 'DOCTYPE ausente' },
  { tipo: 'html-lang-faltando', peso: 10, descricao: 'Atributo lang no <html> ausente' },
  { tipo: 'meta-charset-faltando', peso: 10, descricao: 'Meta charset ausente' },
  { tipo: 'viewport-faltando', peso: 8, descricao: 'Meta viewport ausente' },
  { tipo: 'title-faltando', peso: 8, descricao: '<title> ausente' },
  { tipo: 'img-sem-alt', peso: 10, descricao: 'Imagem sem atributo alt' },
  { tipo: 'img-sem-dimensoes', peso: 5, descricao: 'Imagem sem width/height' },
  { tipo: 'img-sem-loading', peso: 3, descricao: 'Imagem sem attribute loading' },
  { tipo: 'iframe-sem-title', peso: 10, descricao: 'Iframe sem title' },
  { tipo: 'link-blank-sem-rel', peso: 8, descricao: 'Link com target="_blank" sem rel' },
  { tipo: 'table-sem-caption', peso: 5, descricao: 'Tabela sem <caption>' },
  { tipo: 'form-sem-method', peso: 10, descricao: 'Formulário sem method' },
  { tipo: 'form-sem-action', peso: 8, descricao: 'Formulário sem action' },
  { tipo: 'input-sem-label', peso: 8, descricao: 'Input sem label ou name' },
  { tipo: 'input-sem-type', peso: 8, descricao: 'Input sem type' },
  { tipo: 'script-inline', peso: 5, descricao: 'Script inline' },
  { tipo: 'style-inline', peso: 5, descricao: 'Estilo inline <style>' },
  { tipo: 'inline-handler', peso: 6, descricao: 'handler inline (onclick, etc)' },
  { tipo: 'heading-invalido', peso: 5, descricao: 'Heading inválido (pulo de nível)' },
  { tipo: 'button-sem-texto', peso: 5, descricao: 'Botão sem texto ou aria-label' },
  { tipo: 'dangerous-html', peso: 15, descricao: 'Uso de innerHTML/outerHTML com variáveis' },
  { tipo: 'document-write', peso: 15, descricao: 'Uso de document.write()' }
];

function warn(message: string, relPath: string, line: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.html,
    tipo: 'pontuacao-html'
  });
}

function detectarProblemasHtml(src: string, relPath: string): { tipo: string; linha: number }[] {
  const problemas: { tipo: string; linha: number }[] = [];
  const lineOf = createLineLookup(src).lineAt;

  if (!/<!DOCTYPE\s+html>/i.test(src)) {
    problemas.push({ tipo: 'doctype-faltando', linha: 1 });
  }
  const htmlTagMatch = src.match(/<html[^>]*>/i);
  if (htmlTagMatch && !/\slang=['"]/i.test(htmlTagMatch[0])) {
    problemas.push({ tipo: 'html-lang-faltando', linha: lineOf(htmlTagMatch.index || 0) });
  }
  if (!/<meta[^>]* charset=/i.test(src) && !/<meta[^>]*http-equiv[^>]*charset/i.test(src)) {
    problemas.push({ tipo: 'meta-charset-faltando', linha: 1 });
  }
  if (!/<meta[^>]*name=["']viewport["']/i.test(src)) {
    problemas.push({ tipo: 'viewport-faltando', linha: 1 });
  }
  if (!/<title>[^<]*<\/title>/i.test(src)) {
    problemas.push({ tipo: 'title-faltando', linha: 1 });
  }
  for (const m of src.matchAll(/<img[^>]*>/gi)) {
    if (!/\salt=/i.test(m[0]) && !/\saria-/i.test(m[0])) {
      problemas.push({ tipo: 'img-sem-alt', linha: lineOf(m.index || 0) });
    }
    if (!/\s(width|height)=/i.test(m[0])) {
      problemas.push({ tipo: 'img-sem-dimensoes', linha: lineOf(m.index || 0) });
    }
    if (!/\sloading=/i.test(m[0])) {
      problemas.push({ tipo: 'img-sem-loading', linha: lineOf(m.index || 0) });
    }
  }
  for (const m of src.matchAll(/<iframe[^>]*>/gi)) {
    if (!/\stitle=/i.test(m[0])) {
      problemas.push({ tipo: 'iframe-sem-title', linha: lineOf(m.index || 0) });
    }
  }
  for (const m of src.matchAll(/<a[^>]*target=["']?_blank["']?[^>]*>/gi)) {
    if (!/\srel=/i.test(m[0])) {
      problemas.push({ tipo: 'link-blank-sem-rel', linha: lineOf(m.index || 0) });
    }
  }
  for (const m of src.matchAll(/<table[^>]*>/gi)) {
    if (!/<caption/i.test(src.substring(m.index || 0, (m.index || 0) + 200))) {
      problemas.push({ tipo: 'table-sem-caption', linha: lineOf(m.index || 0) });
    }
  }
  for (const m of src.matchAll(/<form[^>]*>/gi)) {
    if (!/\smethod=/i.test(m[0])) {
      problemas.push({ tipo: 'form-sem-method', linha: lineOf(m.index || 0) });
    }
    if (!/\saction=/i.test(m[0]) && !/\sdata-/i.test(m[0])) {
      problemas.push({ tipo: 'form-sem-action', linha: lineOf(m.index || 0) });
    }
  }
  for (const m of src.matchAll(/<input[^>]*>/gi)) {
    if (!/\s(?:aria-label|label|name)=/i.test(m[0])) {
      problemas.push({ tipo: 'input-sem-label', linha: lineOf(m.index || 0) });
    }
    if (!/\stype=/i.test(m[0])) {
      problemas.push({ tipo: 'input-sem-type', linha: lineOf(m.index || 0) });
    }
  }
  for (const m of src.matchAll(/<script[^>]*>[\s\S]*?<\/\s*script\b[^>]*\s*>/gi)) {
    if (!/\ssrc=/i.test(m[0])) {
      problemas.push({ tipo: 'script-inline', linha: lineOf(m.index || 0) });
    }
  }
  for (const m of src.matchAll(/<style[^>]*>[\s\S]*?<\/\s*style\b[^>]*\s*>/gi)) {
    problemas.push({ tipo: 'style-inline', linha: lineOf(m.index || 0) });
  }
  for (const m of src.matchAll(/\son(?:click|change|submit|load|error|mouseover|mouseout|keyup|keydown|focus|blur|input)=/gi)) {
    problemas.push({ tipo: 'inline-handler', linha: lineOf(m.index || 0) });
  }
  for (const m of src.matchAll(/\.(innerHTML|outerHTML)\s*=\s*[^"']/gi)) {
    problemas.push({ tipo: 'dangerous-html', linha: lineOf(m.index || 0) });
  }
  if (/\bdocument\.write\(/i.test(src)) {
    for (const m of src.matchAll(/document\.write\(/gi)) {
      problemas.push({ tipo: 'document-write', linha: lineOf(m.index || 0) });
    }
  }

  return problemas;
}

export const analistaPontuacaoHtml: Analista = {
  nome: 'pontuacao-html',
  categoria: 'formatacao',
  descricao: 'Sistema de pontuação para problemasHTML',
  global: false,
  test: (relPath: string): boolean => /\.(html|htm)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    if (!src) return null;
    const problemas = detectarProblemasHtml(src, relPath);
    if (problemas.length === 0) return null;

    let pontuacaoTotal = 0;
    for (const p of problemas) {
      const entry = tabelasPontuacao.find(t => t.tipo === p.tipo);
      if (entry) pontuacaoTotal += entry.peso;
    }

    const nivel: Ocorrencia['nivel'] = pontuacaoTotal > 50 ? 'erro' : pontuacaoTotal > 20 ? 'aviso' : 'info';

    return [warn(
      `Pontuação HTML: ${pontuacaoTotal} pontos em ${problemas.length} problemas`,
      relPath,
      1,
      nivel
    )];
  }
};