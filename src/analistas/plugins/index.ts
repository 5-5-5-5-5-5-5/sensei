// SPDX-License-Identifier: MIT
/**
 *  Plugins do Prometheus
 *
 * Analistas e detectores especializados que podem ser habilitados/desabilitados.
 * São opcionais e carregados dinamicamente pelo registry.
 *
 * Nota: Os plugins foram movidos de <linguagem>/plugins/ para <linguagem>/analistas/
 */

export { analistaGithubActions, analistaGithubActionsGlobal, registrarDetectorGithubActions } from '../github-actions/analistas/analista-github-actions.js';
export * from './analista-multi-plataforma.js'