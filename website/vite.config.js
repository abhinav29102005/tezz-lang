import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

// Dynamically generate inputs for all HTML files in docs/
const docFiles = fs.readdirSync(resolve(import.meta.dirname, 'docs'))
  .filter(file => file.endsWith('.html'))
  .reduce((acc, file) => {
    const name = file.replace('.html', '');
    acc[`docs_${name}`] = resolve(import.meta.dirname, `docs/${file}`);
    return acc;
  }, {});

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        ...docFiles
      },
    },
  },
});
