// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',       // simulate the browser
    globals: true,              // optional: use global APIs like `describe`
    setupFiles: './src/test/setup.js'  // see step 4
  },
});
