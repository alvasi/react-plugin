import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Use 'jsdom' for React component tests
    setupFiles: './src/setupTests.ts', // Setup file for extending expect or global setup
  },
});
