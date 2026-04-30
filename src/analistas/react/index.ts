// SPDX-License-Identifier: MIT
/**
 * React Analyst Framework
 *
 * Comprehensive exports for React, Next.js, Vue, and Electron analysis
 */

// Plugin Analysts
export { analistaReact } from './analistas/analista-react.js';
export { analistaReactHooks } from './analistas/analista-react-hooks.js';

// Pattern Analysts
export * from './analistas/index.js';

// Corrections
export * from './corrections/index.js';

// Context Detection
export { detectarContextoReact, inferirArquetipoReact } from './detectores/detector-contexto-react.js';
export type { EvidenciaContexto,ResultadoDeteccaoContextual } from '@prometheus';
