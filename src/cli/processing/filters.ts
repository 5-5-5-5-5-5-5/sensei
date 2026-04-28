// SPDX-License-Identifier: MIT
import fs from 'node:fs';

import { config , mesclarConfigExcludes } from '@core/config';

/**
 * Utilitários para processamento de filtros CLI
 */

export function processPatternListAchatado(raw: string[] | undefined): string[] {
  if (!raw || !raw.length) return [];
  return Array.from(new Set(raw.flatMap(r => r.split(/[\s,]+/)).map(s => s.trim()).filter(Boolean)));
}
export function processPatternGroups(raw: string[] | undefined): string[][] {
  if (!raw || !raw.length) return [];
  return raw.map(grupo => grupo.split(/[\s,]+/).map(s => s.trim()).filter(Boolean)).filter(g => g.length > 0);
}

// Expansão de includes: aceita diretórios sem curingas

export function expandIncludes(list: string[]): string[] {
  const META = /[\\*\?\{\}\[\]]/; // possui metacaracter de glob
  const out = new Set<string>();
  for (const p of list) {
    out.add(p);
    if (!META.test(p)) {
      // Sem meta: amplia para cobrir recursivamente — remove barras terminais (\ ou /)
      out.add(`${p.replace(/[\\\/]+$/, '')}/**`);
      // Se for nome simples (sem barra), adiciona variante recursiva em qualquer nível
      if (!p.includes('/') && !p.includes('\\')) out.add(`**/${p}/**`);
    }
  }
  return Array.from(out);
}

// Função para obter padrões de exclusão padrão do config

export function getDefaultExcludes(): string[] {
  // Primeiro tenta obter do prometheus.config.json do usuário
  const configIncluirExcluir = config.INCLUDE_EXCLUDE_RULES;
  if (configIncluirExcluir) {
    // Prioriza `globalExcludeGlob` (configuração moderna). Se não existir,
    // usa `defaultExcludes` para compatibilidade com formas antigas.
    if (Array.isArray(configIncluirExcluir.globalExcludeGlob) && configIncluirExcluir.globalExcludeGlob.length > 0) {
      return Array.from(new Set(configIncluirExcluir.globalExcludeGlob));
    }
    // Se não houver globalExcludeGlob, cairá no fallback abaixo que mescla padrões do sistema
  }

  // Se não há configuração do usuário, usa os padrões recomendados do sistema
  // Por enquanto usa 'generico', mas poderia detectar o tipo de projeto
  const tipoProjeto = detectarTipoProjeto();
  return mesclarConfigExcludes(null, tipoProjeto);
}

// Função auxiliar para detectar o tipo de projeto (simplificada)

function detectarTipoProjeto(): string {
  const cwd = process.cwd();
  let files: string[];
  try {
    files = fs.readdirSync(cwd);
  } catch {
    return 'generico';
  }
  const fileSet = new Set(files);

  // Detecção básica baseada em arquivos presentes
  if (fileSet.has('package.json')) {
    // Evita leitura de JSON aqui (função síncrona); usar heurística por arquivos
    // Heurística: presença de tsconfig.json indica TypeScript; caso contrário, Node.js
    if (fileSet.has('tsconfig.json')) return 'typescript';
    return 'nodejs';
  }
  if (fileSet.has('requirements.txt') || fileSet.has('pyproject.toml')) {
    return 'python';
  }
  if (fileSet.has('pom.xml') || fileSet.has('build.gradle')) {
    return 'java';
  }
  if (files.some(file => file.endsWith('.csproj')) || files.some(file => file.endsWith('.sln'))) {
    return 'dotnet';
  }
  return 'generico';
}
// Função principal para configurar filtros CLI
export function configurarFiltros(includeGroupsRaw: string[][], includeListFlat: string[], excludeList: string[], incluiNodeModules: boolean): void {
  // Configurar includes
  if (includeListFlat.length) {
    config.CLI_INCLUDE_GROUPS = includeGroupsRaw;
    config.CLI_INCLUDE_PATTERNS = includeListFlat;
  } else {
    config.CLI_INCLUDE_GROUPS = [];
    config.CLI_INCLUDE_PATTERNS = [];
  }

  // Configurar excludes com precedência clara:
  // 1. CLI --exclude (prioridade máxima)
  // 2. prometheus.config.json (configuração do usuário)
  // 3. Padrões do sistema (fallback)
  let finalExcluirPadroes: string[];
  if (excludeList.length > 0) {
    // 1. Precedência máxima: flags --exclude têm prioridade
    finalExcluirPadroes = excludeList;
  } else {
    // 2. Se não há flags, tenta configuração do usuário
    finalExcluirPadroes = getDefaultExcludes();
  }

  // Se node_modules está explicitamente incluído, remove dos padrões de exclusão
  if (incluiNodeModules) {
    finalExcluirPadroes = finalExcluirPadroes.filter(p => !/node_modules/.test(p));
  }

  // Aplicar configuração final
  config.CLI_EXCLUDE_PATTERNS = finalExcluirPadroes;
  sincronizarArraysExclusao(finalExcluirPadroes);
}

// Função auxiliar para sincronizar arrays de exclusão

function sincronizarArraysExclusao(_exclFiltered: string[]): void {
  //  SIMPLIFICADO: Não há mais arrays obsoletos para sincronizar
  // CLI flags dominam automaticamente via scanner.ts
}