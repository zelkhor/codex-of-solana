import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const rootDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)));
const srcDir = path.resolve(rootDir, 'src');
const coreTestHelpers = path.resolve(rootDir, '../../packages/core/src/__tests__/index.ts');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': srcDir + '/',
      '@codex/core/testing': coreTestHelpers,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
    passWithNoTests: true,
  },
});
