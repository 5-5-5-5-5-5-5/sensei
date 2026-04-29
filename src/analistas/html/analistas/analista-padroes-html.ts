// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { Ocorrencia, TecnicaAplicarResultado } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import { createLineLookup, maskHtmlComments, maskTagBlocks } from '@shared/helpers';

function warn(message: string, relPath: string, line?: number, nivel: Ocorrencia['nivel'] = 'info'): Ocorrencia {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.html,
    tipo: 'html'
  });
}

export const analistaPadroesHtml = criarAnalista({
  nome: 'analista-padroes-html',
  categoria: 'qualidade',
  descricao: 'Detecta padrões problemáticos em HTML (tables sem caption, forms sem labels, imgs sem alt, etc)',
  global: false,
  test: (relPath: string): boolean => /\.(html|htm)$/i.test(relPath),
  aplicar: async (src: string, relPath: string): Promise<TecnicaAplicarResultado | null> => {
    const ocorrencias: Ocorrencia[] = [];
    const isTemplate = /\.(template\.html|\.component\.html)$/i.test(relPath);
    
    if (isTemplate) return null;

    const scan = maskHtmlComments(maskTagBlocks(maskTagBlocks(src, 'script'), 'style'));
    const lineOf = createLineLookup(scan).lineAt;

    for (const m of scan.matchAll(/<table[^>]*>/gi)) {
      const hasCaption = /<caption/i.test(m[0]);
      const hasAriaLabel = /\saria-label=/i.test(m[0]);
      if (!hasCaption && !hasAriaLabel) {
        ocorrencias.push(warn('Tabela sem <caption> ou aria-label', relPath, lineOf(m.index), 'aviso'));
      }
    }

    for (const m of scan.matchAll(/<form[^>]*>/gi)) {
      const hasMethod = /\smethod=/i.test(m[0]);
      const hasAction = /\saction=/i.test(m[0]);
      if (!hasMethod) {
        ocorrencias.push(warn('Formulário sem atributo method', relPath, lineOf(m.index), 'aviso'));
      }
      if (!hasAction && !/<form[^>]*data-/i.test(m[0])) {
        ocorrencias.push(warn('Formulário sem action', relPath, lineOf(m.index), 'aviso'));
      }
    }

    for (const m of scan.matchAll(/<input[^>]*>/gi)) {
      const hasLabel = /\s(?:aria-label|label-for)=/i.test(m[0]);
      const hasName = /\sname=/i.test(m[0]);
      const type = m[0].match(/\stype=["']?([^"'>\s]+)["']?/i)?.[1]?.toLowerCase();
      const isHidden = type === 'hidden';
      const isButton = type === 'button' || type === 'submit' || type === 'reset';
      if (!isHidden && !isButton && !hasLabel && !hasName) {
        ocorrencias.push(warn('Input sem label ou name', relPath, lineOf(m.index), 'info'));
      }
    }

    for (const m of scan.matchAll(/<img[^>]*>/gi)) {
      const isSvg = /\.svg/i.test(m[0]);
      const hasAlt = /\salt=/i.test(m[0]);
      const hasAriaHidden = /\saria-hidden=["']true['"]/i.test(m[0]);
      const hasAriaLabel = /\saria-label=/i.test(m[0]);
      const isDecorative = /\s(?:data-)?(?:decorative|icon|symbol)=/i.test(m[0]);
      if (!hasAlt && !hasAriaHidden && !hasAriaLabel && !isDecorative && !isSvg) {
        ocorrencias.push(warn('Imagem sem atributo alt', relPath, lineOf(m.index), 'aviso'));
      }
    }

    for (const m of scan.matchAll(/<a[^>]*target=["']?_blank["']?[^>]*>/gi)) {
      const hasRel = /\srel=["'][^"']*(noopener|noreferrer)[^"']*["']/i.test(m[0]);
      if (!hasRel) {
        ocorrencias.push(warn('Link com target="_blank" sem rel="noopener noreferrer"', relPath, lineOf(m.index), 'aviso'));
      }
    }

    for (const m of src.matchAll(/<script[^>]*>[\s\S]*?<\/\s*script\b[^>]*\s*>/gi)) {
      const hasSrc = /\ssrc=/i.test(m[0]);
      const inner = m[0].replace(/^[\s\S]*?<script\b[^>]*>/i, '').replace(/<\/\s*script\b[^>]*\s*>[\s\S]*$/i, '');
      if (!hasSrc && inner.trim().length > 0) {
        ocorrencias.push(warn('Script inline encontrado (evitar)', relPath, lineOf(m.index), 'aviso'));
      }
    }

    for (const m of src.matchAll(/<style[^>]*>[\s\S]*?<\/\s*style\b[^>]*\s*>/gi)) {
      const inner = m[0].replace(/^[\s\S]*?<style\b[^>]*>/i, '').replace(/<\/\s*style[^>]*\s*>[\s\S]*$/i, '');
      if (inner.trim().length > 0) {
        ocorrencias.push(warn('Estilo inline <style> encontrado (evitar)', relPath, lineOf(m.index), 'info'));
      }
    }

    return ocorrencias.length > 0 ? ocorrencias : null;
  }
});