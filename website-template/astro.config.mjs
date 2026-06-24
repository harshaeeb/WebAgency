// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';

// `site.url` in site.ts is the single source of truth for the production domain.
// Astro needs it here for the sitemap and canonical URLs — keep them in sync by
// reading directly from site.ts rather than duplicating the value here.
export default defineConfig({
  site: site.url,

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});