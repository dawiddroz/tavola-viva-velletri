import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tavolaviva.it',
  server: {
    allowedHosts: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
