// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://graf-interim.de',
  trailingSlash: 'always',
  output: 'static',
  adapter: vercel(),
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(datenschutzerklaerung|privacy-policy)\//.test(page),
      i18n: { defaultLocale: 'de', locales: { de: 'de-DE', en: 'en-US' } },
    }),
  ],
});
