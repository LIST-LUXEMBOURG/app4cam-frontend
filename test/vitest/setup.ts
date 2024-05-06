// © 2022 Luxembourg Institute of Science and Technology
import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/vue'
import { config } from '@vue/test-utils'
import { Notify, Quasar, QuasarPluginOptions } from 'quasar'

configure({ testIdAttribute: 'data-test-id' })

beforeAll(() => {
  const options: Partial<QuasarPluginOptions> = {
    plugins: {
      Notify,
    },
  }
  config.global.plugins.unshift([Quasar, options])
})
