import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'flintwork/primitives': resolve(__dirname, '../src/primitives/index.ts'),
      'flintwork': resolve(__dirname, '../src/index.ts'),
    },
  },
});
