// SPDX-License-Identifier: MIT
import { messages } from '@core/messages';
import type { JsonValue } from '@prometheus';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import { createLineLookup, maskXmlNonCode } from '@shared/helpers';

const disableEnv = process.env.PROMETHEUS_DISABLE_PLUGIN_XML === '1';
type Msg = ReturnType<typeof criarOcorrencia>;
function warn(message: string, relPath: string, line?: number, nivel: (typeof messages.SeverityNiveis)[keyof typeof messages.SeverityNiveis] = messages.SeverityNiveis.warning): Msg {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.xml,
    tipo: messages.AnalystTipos.xml
  });
}

function isYamlFile(relPath: string): boolean {
  return /\.ya?ml$/i.test(relPath);
}

function isJsonConfig(relPath: string): boolean {
  const jsonConfigNames = [
    'package.json', '.eslintrc', '.eslintrc.json', 'tsconfig.json',
    'webpack.config.js', 'vite.config.ts', '.prettierrc', 'jest.config.js',
    'rollup.config.js', 'babel.config.js', '.babelrc', 'stylelint.config.js',
    '.editorconfig', 'tslint.json', '.npmrc', '.yarnrc'
  ];
  const fileName = relPath.split('/').pop() || '';
  return jsonConfigNames.some(name => fileName === name || fileName.startsWith(`${name  }.`));
}

function collectXmlIssues(src: string, relPath: string): Msg[] {
  const scan = maskXmlNonCode(src);
  const lineOf = createLineLookup(scan).lineAt;

  if (isYamlFile(relPath)) {
    return collectYamlIssues(src, relPath, lineOf);
  }

  if (isJsonConfig(relPath)) {
    return collectJsonConfigIssues(src, relPath, lineOf);
  }

  return collectXmlFileIssues(src, relPath, scan, lineOf);
}

function collectYamlIssues(src: string, relPath: string, _lineOf: (index: number) => number): Msg[] {
  const ocorrencias: Msg[] = [];

  const lines = src.split('\n');
  let indentStack: number[] = [0];
  let inDocument = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '---') {
      inDocument = !inDocument;
      continue;
    }

    if (trimmed.startsWith('#')) continue;
    if (!trimmed) continue;

    const indent = line.search(/\S/);

    if (indent > indentStack[indentStack.length - 1] + 4) {
      ocorrencias.push(warn(messages.XmlMensagens.invalidXmlStructure, relPath, i + 1, messages.SeverityNiveis.warning));
    }

    if (trimmed.includes(':') && !trimmed.includes(': ')) {
      const key = trimmed.split(':')[0].trim();
      if (/^\d+$/.test(key)) {
        ocorrencias.push(warn('YAML integer as key detected - may cause issues', relPath, i + 1, messages.SeverityNiveis.warning));
      }
    }

    if (trimmed.match(/^-\s+-/)) {
      const dashCount = (trimmed.match(/-/g) || []).length;
      if (dashCount > 2) {
        ocorrencias.push(warn('Excessive YAML list nesting detected', relPath, i + 1, messages.SeverityNiveis.info));
      }
    }

    if (trimmed.includes('\t')) {
      ocorrencias.push(warn('YAML uses tabs for indentation - use spaces instead', relPath, i + 1, messages.SeverityNiveis.error));
    }

    indentStack = indentStack.slice(0, indent + 1);
    if (indent > 0) {
      indentStack.push(indent);
    }
  }

  try {
    const testYaml = src.replace(/^\s*---/gm, '').replace(/\s+$/gm, '');
    if (testYaml.includes(':') && testYaml.includes('#') && !testYaml.match(/^(\s*#.*\n)*\s*[^#]/m)) {
      ocorrencias.push(warn('YAML file appears to be only comments', relPath, 1, messages.SeverityNiveis.info));
    }
  } catch {
    // Ignore parse errors for comments-only detection
  }

  return ocorrencias;
}

function collectJsonConfigIssues(src: string, relPath: string, lineOf: (index: number) => number): Msg[] {
  const ocorrencias: Msg[] = [];

  let data: unknown;
  try {
    data = JSON.parse(src);
  } catch (e) {
    const error = e as Error;
    const match = error.message.match(/position (\d+)/);
    const pos = match ? parseInt(match[1], 10) : 0;
    ocorrencias.push(warn(`JSON parse error: ${error.message}`, relPath, lineOf(pos), messages.SeverityNiveis.error));
    return ocorrencias;
  }

  if (typeof data !== 'object' || data === null) {
    return ocorrencias;
  }

  collectJsonIssuesRecursive(data as JsonValue, '', relPath, lineOf, ocorrencias, src);

  return ocorrencias;
}

function collectJsonIssuesRecursive(
  obj: JsonValue,
  path: string,
  relPath: string,
  lineOf: (index: number) => number,
  ocorrencias: Msg[],
  src: string
): void {
  if (Array.isArray(obj)) {
    const seen: unknown[] = [];
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      if (typeof item === 'object' && item !== null && 'id' in item) {
        const id = (item as Record<string, unknown>).id;
        if (seen.includes(id)) {
          const line = findJsonKeyLine(src, `${path}[${i}].id`);
          ocorrencias.push(warn(`Duplicate ID "${id}" in JSON array`, relPath, line, messages.SeverityNiveis.warning));
        }
        seen.push(id);
      }
      if (typeof item === 'object' && item !== null) {
        collectJsonIssuesRecursive(item, `${path}[${i}]`, relPath, lineOf, ocorrencias, src);
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    const record = obj as Record<string, unknown>;
    const keys = Object.keys(record);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key.startsWith('_') && !key.startsWith('__')) {
        const line = findJsonKeyLine(src, key);
        ocorrencias.push(warn(`JSON key starting with single underscore: "${key}"`, relPath, line, messages.SeverityNiveis.info));
      }

      if (/(?:^|[A-Z])[A-Z]+/.test(key)) {
        const line = findJsonKeyLine(src, key);
        ocorrencias.push(warn(`JSON key uses camelCase but contains consecutive capitals: "${key}"`, relPath, line, messages.SeverityNiveis.info));
      }

      if (typeof record[key] === 'string') {
        const str = record[key] as string;
        if (str.length > 5000) {
          const line = findJsonKeyLine(src, key);
          ocorrencias.push(warn(`Very long string value (${str.length} chars) in JSON`, relPath, line, messages.SeverityNiveis.info));
        }
      }

      if (key === 'scripts' && typeof record[key] === 'object') {
        const scripts = record[key] as Record<string, string>;
        for (const [scriptName, scriptValue] of Object.entries(scripts)) {
          if (scriptValue.includes('rm -rf') || scriptValue.includes('del /')) {
            const line = findJsonKeyLine(src, `scripts.${scriptName}`);
            ocorrencias.push(warn(`Potentially dangerous command in npm script`, relPath, line, messages.SeverityNiveis.error));
          }
        }
      }

      if (typeof record[key] === 'object' && record[key] !== null) {
        collectJsonIssuesRecursive(record[key] as JsonValue, path ? `${path}.${key}` : key, relPath, lineOf, ocorrencias, src);
      }
    }
  }
}

function findJsonKeyLine(src: string, keyPath: string): number {
  const key = keyPath.split('.').pop()?.replace(/[\[\]\d]/g, '') || '';
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"${key}"`)) {
      return i + 1;
    }
  }
  return 1;
}

function collectXmlFileIssues(src: string, relPath: string, scan: string, lineOf: (index: number) => number): Msg[] {
  const ocorrencias: Msg[] = [];

  const trimmed = src.trimStart();
  const seemsCompleteDocument = /^<\w/i.test(trimmed) && !trimmed.includes('<?xml');
  if (seemsCompleteDocument && /^</.test(trimmed)) {
    ocorrencias.push(warn(messages.XmlMensagens.xmlPrologAusente, relPath, 1, messages.SeverityNiveis.info));
  }

  const tagRegex = /<\/?([a-zA-Z_][\w.-]*(?::[a-zA-Z_][\w.-]*)?)(?:\s[^>]*)?>/g;
  let match;
  const tagStack: string[] = [];
  const tagLines: Map<string, number> = new Map();

  while ((match = tagRegex.exec(scan)) !== null) {
    const fullTag = match[0];
    const tagNome = match[1];
    const line = lineOf(match.index);

    if (fullTag.startsWith('</')) {
      const expected = tagStack.pop();
      if (expected !== tagNome) {
        ocorrencias.push(warn(messages.XmlMensagens.invalidXmlStructure, relPath, line, messages.SeverityNiveis.error));
        break;
      }
    } else if (!fullTag.endsWith('/>')) {
      if (!/<\?xml|<!DOCTYPE|<!--/.test(fullTag)) {
        tagStack.push(tagNome);
        tagLines.set(tagNome, line);
      }
    }
  }
  if (tagStack.length > 0) {
    ocorrencias.push(warn(messages.XmlMensagens.invalidXmlStructure, relPath, lineOf(scan.length), messages.SeverityNiveis.error));
  }

  const xmlnsRegex = /xmlns(?::([a-zA-Z_][\w.-]*))?\s*=\s*['"][^'"]*['"]/g;
  const declaredNamespaces = new Set<string>();
  while ((match = xmlnsRegex.exec(scan)) !== null) {
    const prefix = match[1];
    if (prefix) declaredNamespaces.add(prefix);
  }
  const prefixRegex = /([a-zA-Z_][\w.-]*):[a-zA-Z_][\w.-]*/g;
  while ((match = prefixRegex.exec(scan)) !== null) {
    const prefix = match[1];
    if (!declaredNamespaces.has(prefix) && prefix !== 'xml' && prefix !== 'xmlns') {
      const line = lineOf(match.index);
      ocorrencias.push(warn(messages.XmlMensagens.namespaceUndeclared(prefix), relPath, line, messages.SeverityNiveis.warning));
    }
  }

  const idAttributes = new Map<string, number[]>();
  const idRegex = /\sid=["']([^"']+)["']/g;
  while ((match = idRegex.exec(scan)) !== null) {
    const id = match[1];
    const line = lineOf(match.index);
    if (!idAttributes.has(id)) {
      idAttributes.set(id, []);
    }
    idAttributes.get(id)?.push(line);
  }
  for (const [id, lines] of idAttributes) {
    if (lines.length > 1) {
      for (const line of lines) {
        ocorrencias.push(warn(`Duplicate ID "${id}" found in XML`, relPath, line, messages.SeverityNiveis.warning));
      }
    }
  }

  const attrOrderRegex = /<(\w+)([^>]*)\/?>/g;
  const elementsWithAttrOrder: Map<string, string[]> = new Map();
  while ((match = attrOrderRegex.exec(scan)) !== null) {
    const tagName = match[1];
    const attrs = match[2];
    if (attrs) {
      const attrList = attrs.trim().split(/\s+/);
      if (!elementsWithAttrOrder.has(tagName)) {
        elementsWithAttrOrder.set(tagName, []);
      }
      const existing = elementsWithAttrOrder.get(tagName);
      if (existing && existing.length > 0) {
        const lastAttrs = existing[existing.length - 1].split(/\s+/);
        const lastAttrName = lastAttrs[0];
        const currentAttrName = attrList[0];
        if (lastAttrName > currentAttrName) {
          const line = lineOf(match.index);
          ocorrencias.push(warn('Attribute order not consistent within element', relPath, line, messages.SeverityNiveis.info));
        }
      }
      existing?.push(attrs.trim());
    }
  }

  for (const m of scan.matchAll(/<!DOCTYPE\b[\s\S]*?(?:\]\s*>|>)/gi)) {
    const chunk = m[0] ?? '';
    const hasExternalId = /\b(SYSTEM|PUBLIC)\b/i.test(chunk);
    const line = lineOf(m.index);
    ocorrencias.push(warn(messages.XmlMensagens.doctypeDetectado, relPath, line));
    if (hasExternalId) {
      ocorrencias.push(warn(messages.XmlMensagens.doctypeExternoDetectado, relPath, line, messages.SeverityNiveis.error));
    }
  }
  for (const m of scan.matchAll(/<!ENTITY\b[\s\S]*?>/gi)) {
    const chunk = m[0] ?? '';
    const hasExternal = /\b(SYSTEM|PUBLIC)\b/i.test(chunk);
    const isParamEntity = /<!ENTITY\s+%/i.test(chunk);
    const hasDangerousSystemId = /\bSYSTEM\b[\s\S]*?['"]\s*(file:|ftp:|gopher:|jar:|php:|data:)/i.test(chunk);
    const line = lineOf(m.index);
    if (isParamEntity) {
      ocorrencias.push(warn(messages.XmlMensagens.entidadeParametroDetectada, relPath, line, messages.SeverityNiveis.warning));
    }

    const entityValor = chunk.match(/<!ENTITY\s+[^'"]*\s+['"]([^'"]*)['"]/i)?.[1];
    if (entityValor && entityValor.includes('&') && entityValor.length > 100) {
      ocorrencias.push(warn(messages.XmlMensagens.largeEntityExpansion, relPath, line, messages.SeverityNiveis.error));
    }
    ocorrencias.push(warn(hasExternal ? messages.XmlMensagens.entidadeExternaDetectada : messages.XmlMensagens.entidadeDetectada, relPath, line, hasExternal || hasDangerousSystemId ? messages.SeverityNiveis.error : messages.SeverityNiveis.warning));
  }

  for (const m of scan.matchAll(/<\s*(?:xi|xinclude):include\b[^>]*>/gi)) {
    ocorrencias.push(warn(messages.XmlMensagens.xincludeDetectado, relPath, lineOf(m.index)));
  }

  for (const m of scan.matchAll(/=\s*['"]\s*<!\[CDATA\[[\s\S]*?\]\]>\s*['"]/gi)) {
    ocorrencias.push(warn(messages.XmlMensagens.cdataInAttribute, relPath, lineOf(m.index), messages.SeverityNiveis.error));
  }

  const processingInstructionRegex = /<\?(\w+)\s+[^?]*\?>/g;
  while ((match = processingInstructionRegex.exec(scan)) !== null) {
    const target = match[1].toLowerCase();
    if (target !== 'xml' && target !== 'xml-stylesheet') {
      const line = lineOf(match.index);
      ocorrencias.push(warn(`Unusual processing instruction: <?${match[1]}?>`, relPath, line, messages.SeverityNiveis.info));
    }
  }

  const commentRegex = /<!--[\s\S]*?-->/g;
  let commentMatch;
  let nestedCommentWarning = false;
  while ((commentMatch = commentRegex.exec(scan)) !== null) {
    const commentContent = commentMatch[0];
    if (commentContent.includes('<!--')) {
      if (!nestedCommentWarning) {
        ocorrencias.push(warn('Possible nested comment detected in XML', relPath, lineOf(commentMatch.index), messages.SeverityNiveis.warning));
        nestedCommentWarning = true;
      }
    }
  }

  return ocorrencias;
}

export const analistaXml = criarAnalista({
  nome: 'analista-xml',
  categoria: 'markup',
  descricao: 'Analisador completo para XML, YAML e arquivos de configuração JSON (segurança, estrutura e boas práticas).',
  global: false,
  test: (relPath: string): boolean => {
    return /\.xml$/i.test(relPath) ||
           /\.ya?ml$/i.test(relPath) ||
           isJsonConfig(relPath);
  },
  aplicar: async (src, relPath): Promise<Msg[] | null> => {
    if (disableEnv) return null;
    const msgs = collectXmlIssues(src, relPath);
    return msgs.length ? msgs : null;
  }
});