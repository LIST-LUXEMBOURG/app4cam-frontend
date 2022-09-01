import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { render, screen } from '@testing-library/vue'
import ApiClientService from '../helpers/ApiClientService'
import { SettingsDto } from '../settings'
import ExportImport from './ExportImport.vue'

installQuasarPlugin()

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

const SYSTEM_TIME_ISO = '2022-01-18T13:48:37.000Z'

const SETTINGS: SettingsDto = {
  deviceName: 'n',
  siteName: 's',
  systemTime: SYSTEM_TIME_ISO,
  timeZone: 'Europe/Luxembourg',
}

const renderComponent = () =>
  render(ExportImport, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

describe(ExportImport.name, () => {
  beforeAll(() => {
    jest.spyOn(ApiClientService, 'getSettings').mockResolvedValue(SETTINGS)
  })

  it('displays a heading', () => {
    renderComponent()
    const heading = screen.queryByRole('heading', { name: 'Export & import' })
    expect(heading).toBeInTheDocument()
  })
})
