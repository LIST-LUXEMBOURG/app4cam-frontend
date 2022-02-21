import { mount } from '@vue/test-utils'
import DashboardView from './DashboardView.vue'
import { key } from '../store'
import { nextTick } from 'vue'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

it('displays device ID and site name', async () => {
  const store = {
    state: {
      deviceId: 'd',
      siteName: 's',
    },
    dispatch: jest.fn(() => Promise.resolve()),
  }
  const wrapper = mount(DashboardView, {
    global: {
      provide: {
        _q_: undefined,
        [key as symbol]: store,
      },
    },
  })
  await nextTick()
  const input = wrapper.find('[data-test-id=deviceInformation]')
  expect(input.text()).toBe(store.state.siteName + ' ' + store.state.deviceId)
  wrapper.unmount()
})
