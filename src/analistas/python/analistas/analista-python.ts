// SPDX-License-Identifier: MIT
// @prometheus-disable python
import { messages } from '@core/messages';
import { criarAnalista, criarOcorrencia } from '@prometheus';
import { createLineLookup, maskPythonComments, maskPythonStringsAndComments } from '@shared/helpers';

const disableEnv = process.env.PROMETHEUS_DISABLE_PLUGIN_PYTHON === '1';
type Msg = ReturnType<typeof criarOcorrencia>;

function isPythonFile(relPath: string): boolean {
  return /\.(py|pyx|pyi)$/i.test(relPath);
}

function warn(
  message: string,
  relPath: string,
  line?: number,
  nivel: (typeof messages.SeverityNiveis)[keyof typeof messages.SeverityNiveis] = messages.SeverityNiveis.warning
): Msg {
  return criarOcorrencia({
    relPath,
    mensagem: message,
    linha: line,
    nivel,
    origem: messages.AnalystOrigens.python,
    tipo: messages.AnalystTipos.python
  });
}

function collectPythonIssues(src: string, relPath: string): Msg[] {
  const ocorrencias: Msg[] = [];
  const lineOf = createLineLookup(src).lineAt;

  const scan = maskPythonStringsAndComments(src);
  const scanNoComentarios = maskPythonComments(src);

  for (const match of scan.matchAll(/^\s*(?:async\s+)?def\s+([a-z_][a-z0-9_]*)\s*\((.*?)\)(?!\s*->)/gm)) {
    const funcNome = match[1] || '';
    const line = lineOf(match.index);
    if (/^__|main|__init__|setUp|tearDown|get_|set_/.test(funcNome)) continue;
    ocorrencias.push(warn(messages.PythonMensagens.missingTypeHints, relPath, line));
  }

  for (const match of scan.matchAll(/^\s*print\s*\(/gm)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.printInsteadOfLog, relPath, line));
  }

  for (const match of scan.matchAll(/\beval\s*\(/gi)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.evalUsage, relPath, line, messages.SeverityNiveis.error));
  }

  for (const match of scan.matchAll(/\bexec\s*\(/gi)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.execUsage, relPath, line, messages.SeverityNiveis.error));
  }

  for (const match of scan.matchAll(/\bsubprocess\.(?:run|Popen|call|check_call|check_output)\s*\([\s\S]*?\)/g)) {
    if (!/\bshell\s*=\s*True\b/.test(match[0])) continue;
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.subprocessShellTrue, relPath, line, messages.SeverityNiveis.error));
  }

  for (const match of scan.matchAll(/\bpickle\.(?:load|loads)\s*\(/gi)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.pickleUsage, relPath, line, messages.SeverityNiveis.error));
  }

  for (const match of scan.matchAll(/\byaml\.load\s*\([\s\S]*?\)/gi)) {
    const text = match[0] ?? '';
    const hasSafeLoader = /\bLoader\s*=\s*yaml\.(?:SafeLoader|CSafeLoader)\b/.test(text);
    const hasFullLoader = /\bLoader\s*=\s*yaml\.(?:FullLoader|CFullLoader)\b/.test(text);
    const hasExplicitLoader = /\bLoader\s*=/.test(text);
    if (hasSafeLoader) continue;
    const line = lineOf(match.index);
    ocorrencias.push(
      warn(
        messages.PythonMensagens.yamlUnsafeLoad,
        relPath,
        line,
        hasFullLoader || hasExplicitLoader ? messages.SeverityNiveis.warning : messages.SeverityNiveis.error
      )
    );
  }

  for (const match of scanNoComentarios.matchAll(/(?:requests|urllib)\.(?:get|post|request)\s*\([^)]*\)/g)) {
    const hasVerify = /verify\s*=/i.test(match[0]);
    if (!hasVerify && /http:\/\//i.test(match[0])) {
      const line = lineOf(match.index);
      ocorrencias.push(warn(messages.PythonMensagens.httpWithoutVerify, relPath, line));
    }
  }

  for (const match of scanNoComentarios.matchAll(
    /\b(?:execute|executemany|executescript)\s*\(\s*f(['"])(?:SELECT|INSERT|UPDATE|DELETE)[\s\S]*?\1/gi
  )) {
    const text = match[0] ?? '';
    if (!/\{[^}]+\}/.test(text)) continue;
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.sqlInjection, relPath, line, messages.SeverityNiveis.error));
  }

  for (const match of scan.matchAll(/^\s*except\s*:\s*$/gm)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.broadExcept, relPath, line));
  }

  for (const match of scan.matchAll(/except\s+\w+\s*(?:as\s+\w+)?\s*:\s*pass/g)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.passInExcept, relPath, line));
  }

  for (const match of scan.matchAll(/except\s+\w+\s*(?:as\s+\w+)?\s*:\s*\n\s*raise\s*\n/gm)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.bareRaise, relPath, line));
  }

  for (const match of scan.matchAll(/^\s*global\s+\w+/gm)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.globalKeyword, relPath, line));
  }

  for (const match of scan.matchAll(/def\s+\w+\s*\([^)]*=\s*(?:\[|\{)[^\]}]*(?:\]|\})/g)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.mutableDefault, relPath, line));
  }

  for (const match of scan.matchAll(/for\s+\w+\s+in\s+\w+:\s*\n\s*(\w+)\.append\s*\(/g)) {
    const line = lineOf(match.index);
    ocorrencias.push(
      warn(messages.PythonMensagens.listComprehensionOpportunity, relPath, line, messages.SeverityNiveis.suggestion)
    );
  }

  for (const match of scan.matchAll(/for\s+\w+\s+in\s+(\w+):\s*\n\s*(?:value|val)\s*=\s*\1\[/gm)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.loopingOverDict, relPath, line, messages.SeverityNiveis.suggestion));
  }

  for (const match of scanNoComentarios.matchAll(/\bwith\s+(?:open|closing)\s*\([^)]*\)\s*(?:as\s+\w+)?:/gm)) {
    const line = lineOf(match.index);
    const context = match[0] ?? '';
    const hasAs = /\bas\s+\w+/.test(context);
    if (!hasAs) {
      ocorrencias.push(warn(messages.PythonMensagens.contextManagerWithoutAs, relPath, line, messages.SeverityNiveis.suggestion));
    }
  }

  for (const match of scan.matchAll(/@(?:staticmethod|classmethod)\s*\n\s*def\s+\w+/gm)) {
    const line = lineOf(match.index);
    const nextPortion = scan.slice(match.index, match.index + 200);
    if (!/@functools\.wraps/.test(nextPortion)) {
      ocorrencias.push(warn(messages.PythonMensagens.decoratorWithoutWraps, relPath, line, messages.SeverityNiveis.warning));
    }
  }

  for (const match of scan.matchAll(/(?:\[x\s+for\s+x\s+in\s+|list comprehension\])/gi)) {
    const line = lineOf(match.index);
    const text = match[0] ?? '';
    if (text.includes('range(') && !text.includes('list(')) {
      ocorrencias.push(
        warn(messages.PythonMensagens.generatorInsteadOfListComprehension, relPath, line, messages.SeverityNiveis.suggestion)
      );
    }
  }

  for (const match of scan.matchAll(/def\s+([a-z_][a-z0-9_]*)\s*\([^)]*\{\d+\}[^)]*\)/g)) {
    const line = lineOf(match.index);
    ocorrencias.push(warn(messages.PythonMensagens.magicNumberArg, relPath, line));
  }

  return ocorrencias;
}

export const analistaPython = criarAnalista({
  nome: 'analista-python',
  categoria: 'framework',
  descricao: 'Heurísticas leves para Python (boas práticas e segurança).',
  global: false,
  test: (relPath: string): boolean => isPythonFile(relPath),
  aplicar: async (src: string, relPath: string): Promise<Msg[] | null> => {
    if (disableEnv) return null;
    if (relPath.includes('src/analistas/plugins/analista-python.ts')) return null;
    const msgs = collectPythonIssues(src, relPath);
    return msgs.length ? msgs : null;
  }
});