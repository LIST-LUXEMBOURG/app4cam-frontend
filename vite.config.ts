import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { execSync } from 'child_process'

const commitHash = execSync('git rev-parse --short HEAD').toString()

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __COMMIT_HASH__: JSON.stringify(commitHash.trim()),
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar(),
  ],
})
