// © 2024 Luxembourg Institute of Science and Technology
import { createTestingPinia } from '@pinia/testing'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { renderAsync } from '../../test/vitest/renderAsync'
import BatteryStatus from './BatteryStatus.vue'

const renderComponent = (initialState?: StateTree) =>
  renderAsync(BatteryStatus, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

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
