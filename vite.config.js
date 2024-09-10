
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    cssCodeSplit: true,
  },
  server: {
    port: 3000,
    mimeTypes: {
      'text/css': ['css']
    }
  },
});
