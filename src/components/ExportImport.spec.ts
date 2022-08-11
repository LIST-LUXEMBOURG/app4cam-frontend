import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { QBtn, QForm, QIcon } from 'quasar'
import ApiClientService from '../helpers/ApiClientService'
import { SettingsDto } from '../settings'
import ExportImport from './ExportImport.vue'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

const SYSTEM_TIME_ISO = '2022-01-18T13:48:37.000Z'

const SETTINGS: SettingsDto = {
  deviceId: 'd',
  siteName: 's',
  systemTime: SYSTEM_TIME_ISO,
  timeZone: 'Europe/Luxembourg',
}

jest.spyOn(ApiClientService, 'getSettings').mockResolvedValue(SETTINGS)

describe(ExportImport.name, () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ExportImport, {
      components: {
        'q-btn': QBtn,
        'q-form': QForm,
        'q-icon': QIcon,
      },
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
        provide: {
          _q_: undefined,
        },
        stubs: {
          'q-file': {
            template: '<i />',
          },
        },
      },
    })
  })

  it.skip('displays heading', async () => {
    const heading = wrapper.find('h5')
    expect(heading.text()).toBe('Export & import')
  })

  afterEach(() => {
    wrapper.unmount()
  })
})
