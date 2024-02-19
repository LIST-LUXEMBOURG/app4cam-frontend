// © 2022-2023 Luxembourg Institute of Science and Technology
import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { render, screen } from '@testing-library/vue'
import ExportImport from './ExportImport.vue'

installQuasarPlugin()

const renderComponent = () =>
  render(ExportImport, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

describe(ExportImport.name, () => {
  it('displays a heading', () => {
    renderComponent()
    const heading = screen.queryByRole('heading', {
      name: 'Export & import settings',
    })
    expect(heading).toBeInTheDocument()
  })
})
