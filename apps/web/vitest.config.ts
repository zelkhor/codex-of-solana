import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const srcDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'src');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@/': srcDir + '/' },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
    passWithNoTests: true,
  },
});
