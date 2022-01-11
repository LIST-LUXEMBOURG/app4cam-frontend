import { mount } from '@vue/test-utils'
import { QBtn, QIcon } from 'quasar'
import HelloWorld from './HelloWorld.vue'

describe('HelloWorld', () => {
  it('should display header text', () => {
    const msg = 'Hello Vue 3'
    const wrapper = mount(HelloWorld, {
      components: { 'q-btn': QBtn },
      props: { msg },
    })

    expect(wrapper.find('h1').text()).toEqual(msg)
  })
})
