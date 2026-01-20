import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    environment: 'jsdom',
    setupFiles: ['test.setup.ts'],
    globals: true,
    include: ['src/**/*.spec.ts'],
  },
});
