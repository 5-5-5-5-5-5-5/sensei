// SPDX-License-Identifier: MIT
// Analistas de melhorias e correções automáticas (unificado)
// Resolve analistas de correção automática dinamicamente para compatibilidade com múltiplas formas de export
// analistaFantasma not exported from js-ts/fantasma; that module provides detectarFantasmas used by zeladores
// Analistas especializados complementares
import type { Analista, EntradaRegistry, InfoAnalista, ModuloAnalista, Tecnica } from '@prometheus';
import { comSupressaoInline } from '@shared/helpers';

import { analistaAntiPadroesAsync } from '../detectores/detector-anti-padroes-async.js';
import { analistaArquitetura } from '../detectores/detector-arquitetura.js';
import { analistaCodigoFragil } from '../detectores/detector-codigo-fragil.js';
// Novos analistas refinados
import { analistaConstrucoesSintaticas } from '../detectores/detector-construcoes-sintaticas.js';
import * as detectorDependenciasMod from '../detectores/detector-dependencias.js';
import { analistaDuplicacoes } from '../detectores/detector-duplicacoes.js';
import * as detectorEstruturaMod from '../detectores/detector-estrutura.js';
import { detectorInterfacesInline } from '../detectores/detector-interfaces-inline.js';
import { analistaPadronizador } from '../detectores/detector-padronizador.js';
import { analistaSeguranca } from '../detectores/detector-seguranca.js';
import { detectorTiposInseguros } from '../detectores/detector-tipos-inseguros.js';
import { analistaVazamentoMemoria } from '../detectores/detector-vazamentos-memoria.js';
// Analistas contextuais inteligentes
import { analistaSugestoesContextuais } from '../estrategistas/sugestoes-contextuais.js';
import { detectorMarkdown } from '../formatters/detectores/detector-markdown.js';
// Analistas de IA (v0.7.0 - AI-Powered Analysis)
import { analistaComandosCli } from '../js-ts/analistas/analista-comandos-cli.js';
import { analistaFuncoesLongas } from '../js-ts/analistas/analista-funcoes-longas.js';
import { analistaPadroesUso } from '../js-ts/analistas/analista-padroes-uso.js';
import { analistaTodoComentarios } from '../js-ts/analistas/analista-todo-comments.js';
// Plugins opcionais (movidos para @analistas/plugins/)
import { analistaDocumentacao } from '../js-ts/detectores/detector-documentacao.js';
import { discoverAnalistasPlugins } from './autodiscovery.js';
import { analistaElementosLongos } from '../html/analistas/analista-elementos-longos.js';
import {analistaPadroesHtml} from '../html/analistas/analista-padroes-html.js';
import {analistaSegurancaHtml} from '../html/analistas/seguranca-html.js';
import {analistaQuickFixesHtml} from '../html/corrections/analista-quick-fixes-html.js';
import {analistaPontuacaoHtml} from '../html/corrections/analista-pontuacao-html.js';
// Analistas CSS
import {analistaElementosCssLongos} from '../css/analistas/analista-elementos-css-longos.js';
import {analisadorPadroesCss} from '../css/analistas/analisador-padroes-css.js';
import {analisadorSegurancaCss} from '../css/analistas/seguranca-css.js';
import {analisadorQuickFixesCss} from '../css/corrections/quick-fixes-css.js';
import {analisadorPontuacaoCss} from '../css/corrections/pontuacao-css.js';

let analistaCorrecaoAutomatica: EntradaRegistry = undefined;
try {
  const mod = await import('../js-ts/corrections/analista-pontuacao.js');
  // conservatively treat dynamic module shapes as unknown, avoid `any`
  const dynamicMod = mod as ModuloAnalista;
  analistaCorrecaoAutomatica = dynamicMod.analistaCorrecaoAutomatica ?? dynamicMod.analistas?.[0] ?? dynamicMod.default as EntradaRegistry ?? undefined;
} catch {
  // leave undefined - registry will tolerate undefined entries
}
const pluginsAutodiscovered = await discoverAnalistasPlugins();

// Registro central de analistas. Futuro: lazy loading, filtros por categoria.
const detectorDependencias = (detectorDependenciasMod as ModuloAnalista).detectorDependencias ?? (detectorDependenciasMod as ModuloAnalista).default ?? detectorDependenciasMod;
const detectorEstrutura = (detectorEstruturaMod as ModuloAnalista).detectorEstrutura ?? (detectorEstruturaMod as ModuloAnalista).default ?? detectorEstruturaMod;
export const registroAnalistas: (Analista | Tecnica)[] = [
// Analistas existentes
comSupressaoInline(detectorDependencias as unknown as Analista) as Tecnica, comSupressaoInline(detectorEstrutura as unknown as Analista) as Tecnica, comSupressaoInline(analistaFuncoesLongas as Analista), comSupressaoInline(analistaPadroesUso as unknown as Analista) as Tecnica, comSupressaoInline(analistaComandosCli as unknown as Analista) as Tecnica, comSupressaoInline(analistaTodoComentarios as unknown as Analista) as Tecnica,
// Novos analistas refinados
comSupressaoInline(analistaConstrucoesSintaticas), comSupressaoInline(analistaCodigoFragil), comSupressaoInline(analistaDuplicacoes), comSupressaoInline(analistaArquitetura),
// Analistas especializados complementares
// Analistas especializados complementares
comSupressaoInline(analistaAntiPadroesAsync as unknown as Analista), comSupressaoInline(analistaVazamentoMemoria as unknown as Analista), comSupressaoInline(analistaSeguranca), comSupressaoInline(analistaDocumentacao), comSupressaoInline(detectorMarkdown as unknown as Analista), comSupressaoInline(detectorTiposInseguros as unknown as Analista), comSupressaoInline(detectorInterfacesInline as unknown as Analista), comSupressaoInline(analistaPadronizador),
// Analistas HTML
comSupressaoInline(analistaElementosLongos), comSupressaoInline(analistaPadroesHtml), comSupressaoInline(analistaSegurancaHtml), comSupressaoInline(analistaQuickFixesHtml), comSupressaoInline(analistaPontuacaoHtml),
// Analistas CSS
comSupressaoInline(analistaElementosCssLongos), comSupressaoInline(analisadorPadroesCss), comSupressaoInline(analisadorSegurancaCss), comSupressaoInline(analisadorQuickFixesCss), comSupressaoInline(analisadorPontuacaoCss),
// Plugins autodiscovered em src/analistas/plugins/
...pluginsAutodiscovered.map(p => comSupressaoInline(p as unknown as Analista) as Tecnica),
// Analistas contextuais inteligentes
analistaSugestoesContextuais,
// Analistas de melhorias e correções automáticas
// If analistaCorrecaoAutomatica couldn't be resolved, skip the entry
...(analistaCorrecaoAutomatica ? [analistaCorrecaoAutomatica] : [])];
export function listarAnalistas(): InfoAnalista[] {
  return registroAnalistas.map(a => ({
    nome: (a as Analista).nome || 'desconhecido',
    categoria: (a as Analista).categoria || 'n/d',
    descricao: (a as Analista).descricao || ''
  }));
}
