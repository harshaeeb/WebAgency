// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// IMPORTANT: `site` must be set to the client's real production domain
// before launch — Astro needs it to generate correct absolute URLs in the
// sitemap and canonical tags. Update this on every new client build.
// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});