import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { renderAsync } from '../../test/jest/renderAsync'
import SiteAndDeviceNamesHeading from './SiteAndDeviceNamesHeading.vue'

installQuasarPlugin()

const renderComponent = (initialState?: StateTree) =>
  renderAsync(SiteAndDeviceNamesHeading, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

describe(SiteAndDeviceNamesHeading.name, () => {
  it('displays site and device names as heading', async () => {
    const deviceName = 'a'
    const siteName = 'b'
    await renderComponent({
      settings: {
        general: {
          deviceName,
          siteName,
        },
      },
    })
    const heading = screen.getByRole('heading', {
      name: `${siteName} ${deviceName}`,
    })
    expect(heading).toBeInTheDocument()
  })
})
