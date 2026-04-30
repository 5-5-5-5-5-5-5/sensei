// SPDX-License-Identifier: MIT

export const TAILWIND_SCREEN_SIZES = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const TAILWIND_SPACING_SCALE = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96] as const;

export const TAILWIND_COLOR_PALETTES = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'] as const;

export const TAILWIND_JIT_PATTERNS = [
  'aspect-',
  'columns-',
  'break-after-',
  'break-before-',
  'break-inside-',
  'box-decoration-',
  'clear-',
  'clip-',
  'columns-',
  'content-',
  'flex-',
  'grow',
  'shrink',
  'basis-',
  'delay-',
  'duration-',
  'list-',
  'outline-',
  'object-',
  'overflow-',
  'rotate-',
  'scale-',
  'skew-',
  'sr-only',
  'not-sr-only',
  'static',
  'fixed',
  'absolute',
  'relative',
  'sticky',
  'isolate',
  'isolate-layer',
  'fit-',
  'indent-',
  'inherit',
  'initial',
  'text-',
  'normal',
  'ordinal',
  'tabular',
  'diagonal-fractions',
  'stacked-fractions',
  'leading-',
  'tracking-',
  'decoration-',
  'underline',
  'overline',
  'line-through',
  'no-underline',
  'antialiased',
  'subpixel-antialiased',
  'grayscale',
  'sepia',
  'blur',
  'backdrop-blur',
  'caption-',
  'table-',
  'tab-',
  'caret-',
  'accent-',
  'place-',
  'col-end-',
  'col-span-',
  'row-end-',
  'row-span-'
] as const;

export const TAILWIND_RESPONSIVE_PREFIXES = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
export const TAILWIND_STATE_PREFIXES = ['hover', 'focus', 'active', 'group-hover', 'group-focus', 'group-active', 'focus-within', 'focus-visible', 'disabled', 'readonly', 'required', 'invalid', 'valid', 'placeholder', 'checked', 'indeterminate', 'default', 'first', 'last', 'only', 'odd', 'even', 'visited', 'link', 'not-checked'] as const;
export const TAILWIND_DARK_MODE_VARIANTS = ['dark', 'dark:hover', 'dark:focus', 'dark:active', 'dark:group-hover', 'dark:group-focus'] as const;

export type TailwindScreen = keyof typeof TAILWIND_SCREEN_SIZES;
export type TailwindColor = (typeof TAILWIND_COLOR_PALETTES)[number];
export type TailwindJitPattern = (typeof TAILWIND_JIT_PATTERNS)[number];

export interface TailwindTokenInfo {
  token: string;
  category: 'color' | 'spacing' | 'sizing' | 'typography' | 'layout' | 'flexbox' | 'grid' | 'border' | 'effect' | 'transition' | 'animation' | 'transform' | 'filter' | 'other';
  description?: string;
}

export function categorizeTailwindToken(token: string): TailwindTokenInfo | null {
  const base = token.replace(/^(sm|md|lg|xl|2xl|hover|focus|active|group|dark|peer|before|after|placeholder|checked|disabled):/, '');

  if (/^bg-(?!opacity)/.test(base)) return { token, category: 'color', description: 'Background color' };
  if (/^text-/.test(base)) return { token, category: 'typography', description: 'Text color' };
  if (/^border-/i.test(base)) return { token, category: 'border', description: 'Border styling' };
  if (/^rounded/.test(base)) return { token, category: 'border', description: 'Border radius' };
  if (/^shadow/.test(base)) return { token, category: 'effect', description: 'Box shadow' };
  if (/^opacity/.test(base)) return { token, category: 'effect', description: 'Opacity level' };
  if (/^blur/.test(base)) return { token, category: 'filter', description: 'Blur filter' };
  if (/^backdrop/.test(base)) return { token, category: 'filter', description: 'Backdrop filter' };
  if (/^grayscale/.test(base)) return { token, category: 'filter', description: 'Grayscale filter' };
  if (/^sepia/.test(base)) return { token, category: 'filter', description: 'Sepia filter' };
  if (/^rotate/.test(base)) return { token, category: 'transform', description: 'Rotation transform' };
  if (/^scale/.test(base)) return { token, category: 'transform', description: 'Scale transform' };
  if (/^skew/.test(base)) return { token, category: 'transform', description: 'Skew transform' };
  if (/^translate/.test(base)) return { token, category: 'transform', description: 'Translation transform' };
  if (/^transition/.test(base)) return { token, category: 'transition', description: 'Transition timing' };
  if (/^duration/.test(base)) return { token, category: 'transition', description: 'Transition duration' };
  if (/^delay/.test(base)) return { token, category: 'transition', description: 'Transition delay' };
  if (/^ease/.test(base)) return { token, category: 'transition', description: 'Transition easing' };
  if (/^animate/.test(base)) return { token, category: 'animation', description: 'Animation class' };
  if (/^p[trblxy]?/.test(base)) return { token, category: 'spacing', description: 'Padding' };
  if (/^m[trblxy]?/.test(base)) return { token, category: 'spacing', description: 'Margin' };
  if (/^gap/.test(base)) return { token, category: 'spacing', description: 'Gap spacing' };
  if (/^space-/.test(base)) return { token, category: 'spacing', description: 'Space between' };
  if (/^w/.test(base)) return { token, category: 'sizing', description: 'Width' };
  if (/^h/.test(base)) return { token, category: 'sizing', description: 'Height' };
  if (/^min-w/.test(base)) return { token, category: 'sizing', description: 'Min width' };
  if (/^max-w/.test(base)) return { token, category: 'sizing', description: 'Max width' };
  if (/^min-h/.test(base)) return { token, category: 'sizing', description: 'Min height' };
  if (/^max-h/.test(base)) return { token, category: 'sizing', description: 'Max height' };
  if (/^inset/.test(base)) return { token, category: 'layout', description: 'Inset positioning' };
  if (/^(top|left|right|bottom)(?:-|\[)/.test(base)) return { token, category: 'layout', description: 'Position offset' };
  if (/^z-/.test(base)) return { token, category: 'layout', description: 'Z-index stacking' };
  if (/^flex/.test(base)) return { token, category: 'flexbox', description: 'Flexbox layout' };
  if (/^justify-/.test(base)) return { token, category: 'flexbox', description: 'Justify content' };
  if (/^items-/.test(base)) return { token, category: 'flexbox', description: 'Align items' };
  if (/^self-/.test(base)) return { token, category: 'flexbox', description: 'Align self' };
  if (/^content-/.test(base)) return { token, category: 'flexbox', description: 'Align content' };
  if (/^flex-grow/.test(base)) return { token, category: 'flexbox', description: 'Flex grow' };
  if (/^flex-shrink/.test(base)) return { token, category: 'flexbox', description: 'Flex shrink' };
  if (/^grid/.test(base)) return { token, category: 'grid', description: 'CSS Grid layout' };
  if (/^col-/.test(base)) return { token, category: 'grid', description: 'Grid column' };
  if (/^row-/.test(base)) return { token, category: 'grid', description: 'Grid row' };
  if (/^font-/.test(base)) return { token, category: 'typography', description: 'Font weight' };
  if (/^text-/.test(base)) return { token, category: 'typography', description: 'Text sizing' };
  if (/^leading-/.test(base)) return { token, category: 'typography', description: 'Line height' };
  if (/^tracking-/.test(base)) return { token, category: 'typography', description: 'Letter spacing' };
  if (/^underline/.test(base) || /^overline/.test(base) || /^line-through/.test(base)) return { token, category: 'typography', description: 'Text decoration' };

  return null;
}

export function isValidScreenSize(screen: string): screen is TailwindScreen {
  return screen in TAILWIND_SCREEN_SIZES;
}

export function isJitPattern(token: string): boolean {
  const base = token.replace(/^(sm|md|lg|xl|2xl|hover|focus|active|group|dark|peer):/, '');
  return TAILWIND_JIT_PATTERNS.some(p => base.startsWith(p) || base === p);
}

export function hasDarkModeVariant(token: string): boolean {
  return TAILWIND_DARK_MODE_VARIANTS.some(v => token.startsWith(`${v  }:`));
}