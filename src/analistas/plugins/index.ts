// SPDX-License-Identifier: MIT
/**
 *  Plugins do Prometheus
 *
 * Analistas e detectores especializados que podem ser habilitados/desabilitados.
 * São opcionais e carregados dinamicamente pelo registry.
 *
 * Nota: Os plugins foram movidos para pastas de linguagem em src/analistas/<linguagem>/
 * Este arquivo agora re-exporta de suas-localizacoes para compatibilidade.
 *
 * Estrutura atual:
 * - js-ts/      - JavaScript/TypeScript + Node.js
 * - html/       - HTML
 * - css/        - CSS
 * - tailwind/   - Tailwind CSS
 * - css-in-js/  - CSS-in-JS
 * - react/     - React + React Hooks
 * - python/    - Python
 * - xml/       - XML
 * - svg/       - SVG
 * - sql/       - SQL
 * - shell/     - Shell
 * - github-actions/ - GitHub Actions
 * - formatters/ - JSON/MD/YAML
 */

// Analistas de linguagem/framework (movidos para pastas dedicadas)
export * from '../css/plugins/analista-css.js';
export * from '../css-in-js/plugins/analista-css-in-js.js';
export * from '../formatters/plugins/analista-formater.js';
export * from '../github-actions/plugins/analista-github-actions.js';
export * from '../html/plugins/analista-html.js';
export * from '../python/plugins/analista-python.js';
export * from '../react/plugins/analista-react.js';
export * from '../react/plugins/analista-react-hooks.js';
export * from '../shell/plugins/analista-shell.js';
export * from '../sql/plugins/analista-sql.js';
export * from '../svg/plugins/analista-svg.js';
export * from '../tailwind/plugins/analista-tailwind.js';
export * from '../xml/plugins/analista-xml.js';

// Detectores especializados (movidos para pastas de linguagem)
export * from '../js-ts/detectores/detector-documentacao.js';
export * from '../formatters/detectores/detector-markdown.js';
export * from '../js-ts/detectores/detector-node.js';
export * from '../xml/detectores/detector-xml.js';
