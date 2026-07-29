import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dawiddroz.github.io',
  base: '/tavola-viva-velletri',
  server: {
    allowedHosts: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
