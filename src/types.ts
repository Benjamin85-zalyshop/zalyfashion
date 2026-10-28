export interface WebTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  badge?: string;
  html: string;
  css: string;
}

export interface CodeSnippet {
  id: string;
  name: string;
  category: 'html' | 'css';
  description: string;
  code: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type ActiveTab = 'split' | 'html' | 'css' | 'preview';
