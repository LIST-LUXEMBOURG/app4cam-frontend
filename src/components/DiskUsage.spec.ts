import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { renderAsync } from '../../test/jest/renderAsync'
import DiskUsage from './DiskUsage.vue'

installQuasarPlugin()

const renderComponent = (initialState?: StateTree) =>
  renderAsync(DiskUsage, {
    global: {
      plugins: [createTestingPinia({ initialState })],
      stubs: ['apexchart'],
    },
  })

describe(DiskUsage.name, () => {
  it('displays a heading', async () => {
    await renderComponent()
    const heading = screen.getByRole('heading', { name: 'Disk storage' })
    expect(heading).toBeInTheDocument()
  })

  it('displays a capacity in GB', async () => {
    await renderComponent({
      storage: {
        capacityKb: 1,
        usedPercentage: 0,
      },
    })
    const line = screen.queryByText(/Total capacity: \d+.?\d{0,2} GB/)
    expect(line).toBeInTheDocument()
  })
})
