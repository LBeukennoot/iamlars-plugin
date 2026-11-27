import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'wp.element.createElement',
    jsxFragment: 'wp.element.Fragment'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.js'),
      output: {
        format: 'iife',
        name: 'iamlarsBlocks',
        entryFileNames: 'blocks.js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || (assetInfo.names && assetInfo.names[0]) || '';
          if (name.endsWith('.css') || name.includes('style')) {
            return 'blocks.css';
          }
          return '[name][extname]';
        },
        globals: {
          '@wordpress/blocks': '(window.wp && window.wp.blocks)',
          '@wordpress/block-editor': '(window.wp && window.wp.blockEditor)',
          '@wordpress/element': '(window.wp && window.wp.element)',
          '@wordpress/components': '(window.wp && window.wp.components)'
        }
      },
      external: ['@wordpress/blocks', '@wordpress/block-editor', '@wordpress/element', '@wordpress/components']
    }
  }
});
