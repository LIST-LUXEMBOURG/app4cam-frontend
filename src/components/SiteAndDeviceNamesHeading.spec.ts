// © 2022-2023 Luxembourg Institute of Science and Technology
import { createTestingPinia } from '@pinia/testing'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { renderAsync } from '../../test/vitest/renderAsync'
import SiteAndDeviceNamesHeading from './SiteAndDeviceNamesHeading.vue'

const renderComponent = (initialState?: StateTree) =>
  renderAsync(SiteAndDeviceNamesHeading, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

it('displays site and device names as heading', async () => {
  const deviceName = 'a'
  const siteName = 'b'
  await renderComponent({
    settings: {
      current: {
        general: {
          deviceName,
          siteName,
        },
      },
    },
  })
  const heading = screen.getByRole('heading', {
    name: `${siteName} ${deviceName}`,
  })
  expect(heading).toBeInTheDocument()
})
