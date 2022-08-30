import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { renderAsync } from '../../test/jest/renderAsync'
import SiteNameDeviceIdHeading from './SiteNameDeviceIdHeading.vue'

installQuasarPlugin()

const renderComponent = (initialState?: StateTree) =>
  renderAsync(SiteNameDeviceIdHeading, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

describe(SiteNameDeviceIdHeading.name, () => {
  it('displays picture count', async () => {
    const deviceId = 'a'
    const siteName = 'b'
    await renderComponent({
      settings: {
        deviceId,
        siteName,
      },
    })
    const pictures = screen.getByRole('heading', {
      name: `${siteName} ${deviceId}`,
    })
    expect(pictures).toBeInTheDocument()
  })
})
