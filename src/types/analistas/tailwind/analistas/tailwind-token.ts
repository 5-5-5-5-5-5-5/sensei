export interface TailwindTokenInfo {
  token: string;
  category: 'color' | 'spacing' | 'sizing' | 'typography' | 'layout' | 'flexbox' | 'grid' | 'border' | 'effect' | 'transition' | 'animation' | 'transform' | 'filter' | 'other';
  description?: string;
}