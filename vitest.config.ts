import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({ sassVariables: 'src/css/quasar.variables.css' }),
    tsconfigPaths(),
  ],
  test: {
    coverage: {
      include: ['src/**'],
      reporter: ['cobertura', 'lcov', 'text'],
      reportsDirectory: 'test/vitest/coverage',
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/vitest/setup.ts',
  },
})
