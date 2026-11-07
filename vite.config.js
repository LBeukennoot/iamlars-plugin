import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'wp.element.createElement',
    jsxFragment: 'wp.element.Fragment',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      // Pass only the JS entry point
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
          '@wordpress/blocks': 'wp.blocks',
          '@wordpress/block-editor': 'wp.blockEditor',
          '@wordpress/element': 'wp.element',
        },
      },
      external: [
        '@wordpress/blocks',
        '@wordpress/block-editor',
        '@wordpress/element',
      ],
    },
  },
});