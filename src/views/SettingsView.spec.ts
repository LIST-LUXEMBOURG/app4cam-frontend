import { mount } from '@vue/test-utils'
import SettingsView from './SettingsView.vue'
import { key } from '../store'
import { QBtn, QForm } from 'quasar'
import { nextTick } from 'vue'

const SYSTEM_TIME_ISO = '2022-01-18T13:48:37.000Z'
const SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS = '20220118T134837000Z'

it('displays correct file name preview', async () => {
  const store = {
    state: {
      deviceId: 'd',
      siteName: 's',
      systemTime: new Date(SYSTEM_TIME_ISO),
    },
    dispatch: jest.fn(() => Promise.resolve()),
  }
  const wrapper = mount(SettingsView, {
    components: {
      'q-btn': QBtn,
      'q-form': QForm,
    },
    global: {
      provide: {
        _q_: undefined,
        [key as symbol]: store,
      },
      stubs: {
        'q-input': {
          template: '<i />',
        },
      },
    },
  })
  await nextTick()
  const input = wrapper.find('[data-test-id=filenamePreview]')
  expect(input.text()).toBe(
    store.state.siteName +
      ' ' +
      store.state.deviceId +
      ' ' +
      SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS +
      '.extension',
  )
})
