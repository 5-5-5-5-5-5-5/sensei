// SPDX-License-Identifier: MIT
/**
 * Sistema de Mensagens Centralizado do Sensei com Internacionalização
 *
 * Resolve mensagens no locale configurado em sensei.config.json via campo "locale".
 * Valores suportados: "pt" (padrão), "en".
 *
 * Uso:
 *   import { getMessages } from '@core/messages/index.js';
 *   const msgs = getMessages();
 *   // msgs.log, msgs.MENSAGENS_CORRECOES, msgs.RelatorioMensagens, etc.
 */

import { config } from '@core/config/config.js';

import * as pt from './pt/index.js';
import * as en from './en/index.js';

export { ICONES, ICONES_ACAO, ICONES_ARQUIVO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_FEEDBACK, ICONES_NIVEL, ICONES_RELATORIO, ICONES_STATUS, ICONES_TIPOS, ICONES_ZELADOR, getIcone, suportaCores } from './shared/icons.js';

export type { IconeAcao, IconeArquivo, IconeComando, IconeDiagnostico, IconeFeedback, IconeNivel, IconeRelatorio, IconeStatus, IconeTipo, IconeZelador } from './shared/icons.js';

const localeMap: Record<string, Record<string, unknown>> = {
  pt,
  'pt-BR': pt,
  en,
  'en-US': en,
  'en-GB': en,
};

const DEFAULT_LOCALE = 'pt';

let cachedLocale: string | undefined;
let cachedMessages: typeof pt | undefined;

function resolveLocale(): string {
  if (cachedLocale) return cachedLocale;

  const localeFromConfig = (config as Record<string, unknown>)?.LOCALE as string | undefined;
  const localeEnv = process.env.SENSEI_LOCALE;

  const locale = (localeFromConfig || localeEnv || DEFAULT_LOCALE).toLowerCase();

  if (locale in localeMap) {
    cachedLocale = locale;
    return locale;
  }

  const shortLocale = locale.split('-')[0];
  if (shortLocale in localeMap) {
    cachedLocale = shortLocale;
    return shortLocale;
  }

  cachedLocale = DEFAULT_LOCALE;
  return DEFAULT_LOCALE;
}

export function getMessages(): typeof pt {
  if (cachedMessages) return cachedMessages;

  const locale = resolveLocale();
  cachedMessages = localeMap[locale] as typeof pt || localeMap[DEFAULT_LOCALE] as typeof pt;
  return cachedMessages;
}

export function setLocale(locale: string): void {
  cachedLocale = undefined;
  cachedMessages = undefined;
  const normalized = locale.toLowerCase();
  if (normalized in localeMap) {
    cachedLocale = normalized;
  } else {
    const shortLocale = normalized.split('-')[0];
    cachedLocale = shortLocale in localeMap ? shortLocale : DEFAULT_LOCALE;
  }
}

export function getLocale(): string {
  return resolveLocale();
}

export { RelatorioAsyncPatternsMensagens, RelatorioZeladorSaudeMensagens } from './pt/relatorios/index.js';
export * from './pt/index.js';

export { pt, en };

export * from './shared/icons.js';
