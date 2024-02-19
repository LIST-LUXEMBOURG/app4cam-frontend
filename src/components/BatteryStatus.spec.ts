// © 2024 Luxembourg Institute of Science and Technology
import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { renderAsync } from '../../test/jest/renderAsync'
import BatteryStatus from './BatteryStatus.vue'

installQuasarPlugin()

const renderComponent = (initialState?: StateTree) =>
  renderAsync(BatteryStatus, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

describe(BatteryStatus.name, () => {
  it('displays a heading', async () => {
    await renderComponent()
    const heading = screen.getByRole('heading', { name: 'Battery status' })
    expect(heading).toBeInTheDocument()
  })

  it('displays picture count', async () => {
    await renderComponent({
      properties: {
        batteryVoltage: 1,
      },
    })
    const pictures = screen.queryByText('Battery voltage: 1')
    expect(pictures).toBeInTheDocument()
  })
})
