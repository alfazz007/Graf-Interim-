import type { Lang } from './i18n';

export type Block =
  | { type: 'text'; heading?: string; body: string[] }
  | { type: 'list'; heading?: string; intro?: string; items: string[] }
  | { type: 'cards'; heading?: string; intro?: string; items: { title: string; text: string }[] }
  | { type: 'steps'; heading?: string; intro?: string; items: { title: string; text: string }[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'faq'; heading?: string; items: { q: string; a: string }[] }
  | { type: 'stats' }
  | { type: 'cta'; heading: string; text?: string }
  | { type: 'video'; provider: 'file'; src: string; poster?: string; title: string; caption?: string }
  | { type: 'prose'; markdown: string };

export interface LangContent {
  slug: string;
  navTitle: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  intro: string;
  highlights?: string[];
  noindex?: boolean;
  sections: Block[];
}

export interface PageData {
  id: string;
  template: 'service' | 'page' | 'faq' | 'legal' | 'contact';
  de: LangContent;
  en: LangContent;
}

const pageModules = import.meta.glob<PageData>('../content/pages/*.json', { eager: true, import: 'default' });
export const pages: PageData[] = Object.values(pageModules);
export const pageById = (id: string) => pages.find((p) => p.id === id);

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  updated: string;
  category: string;
  readingTime: number;
  cover: string;
  coverWidth: number;
  coverHeight: number;
}
export interface Post {
  slug: string;
  data: PostFrontmatter;
  Content: any;
}

const postModules = import.meta.glob<{ frontmatter: PostFrontmatter; Content: any }>('../content/blog/*.md', { eager: true });
export const posts: Post[] = Object.entries(postModules)
  .map(([file, m]) => ({ slug: file.split('/').pop()!.replace(/\.md$/, ''), data: m.frontmatter, Content: m.Content }))
  .sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)));

export function fmtDate(d: string, lang: Lang) {
  return new Date(d).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}
