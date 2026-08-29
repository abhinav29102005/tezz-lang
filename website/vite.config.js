import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        introduction: resolve(__dirname, 'docs/introduction.html'),
        installation: resolve(__dirname, 'docs/installation-and-cli.html'),
        syntax: resolve(__dirname, 'docs/syntax.html'),
        hinglish: resolve(__dirname, 'docs/hinglish.html'),
        services: resolve(__dirname, 'docs/services-and-routes.html'),
        deployment: resolve(__dirname, 'docs/deployment.html'),
      },
    },
  },
});
