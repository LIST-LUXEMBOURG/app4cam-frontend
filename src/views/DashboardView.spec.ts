import { mount, VueWrapper } from '@vue/test-utils'
import DashboardView from './DashboardView.vue'
import { ClosePopup, QBtn, QCard, QCardSection, QDialog, QSpace } from 'quasar'
import { createTestingPinia } from '@pinia/testing'
import ApiClientService from '../services/ApiClientService'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

const SETTINGS: SettingsDto = {
  deviceId: 'd',
  siteName: 's',
  systemTime: new Date().toISOString(),
}
jest.spyOn(ApiClientService, 'getSettings').mockImplementation(() => {
  return Promise.resolve(SETTINGS)
})

let wrapper: VueWrapper

beforeEach(() => {
  wrapper = mount(DashboardView, {
    components: {
      'q-btn': QBtn,
      'q-card': QCard,
      'q-card-section': QCardSection,
      'q-dialog': QDialog,
      'q-space': QSpace,
    },
    directives: {
      ClosePopup,
    },
    global: {
      plugins: [createTestingPinia({ stubActions: false })],
      provide: {
        _q_: undefined,
      },
    },
  })
})

describe('heading', () => {
  it('displays device ID and site name', async () => {
    const input = wrapper.find('[data-test-id=deviceInformation]')
    expect(input.text()).toBe(SETTINGS.siteName + ' ' + SETTINGS.deviceId)
  })
})

afterEach(() => {
  wrapper.unmount()
})
