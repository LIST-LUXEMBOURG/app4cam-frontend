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
  it('displays picture count', async () => {
    const deviceName = 'a'
    const siteName = 'b'
    await renderComponent({
      settings: {
        deviceName,
        siteName,
      },
    })
    const pictures = screen.getByRole('heading', {
      name: `${siteName} ${deviceName}`,
    })
    expect(pictures).toBeInTheDocument()
  })
})