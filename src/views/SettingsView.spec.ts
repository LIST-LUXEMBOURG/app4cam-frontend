import { mount, VueWrapper } from '@vue/test-utils'
import SettingsView from './SettingsView.vue'
import { QBtn, QForm, QIcon } from 'quasar'
import { createTestingPinia } from '@pinia/testing'
import ApiClientService from '../services/ApiClientService'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

const SYSTEM_TIME_ISO = '2022-01-18T13:48:37.000Z'
const SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS = '20220118T134837000Z'

const SETTINGS: SettingsDto = {
  deviceId: 'd',
  siteName: 's',
  systemTime: SYSTEM_TIME_ISO,
}
jest.spyOn(ApiClientService, 'getSettings').mockImplementation(() => {
  return Promise.resolve(SETTINGS)
})

let wrapper: VueWrapper

beforeEach(() => {
  wrapper = mount(SettingsView, {
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
        'q-input': {
          template: '<i />',
        },
      },
    },
  })
})

describe('file name preview', () => {
  it('displays correctly', async () => {
    const input = wrapper.find('[data-test-id=filenamePreview]')
    expect(input.text()).toBe(
      SETTINGS.siteName +
        '_' +
        SETTINGS.deviceId +
        '_' +
        SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS +
        '.extension',
    )
  })
})

afterEach(() => {
  wrapper.unmount()
})
