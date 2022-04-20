import { mount, VueWrapper } from '@vue/test-utils'
import FilenamePreview from './FilenamePreview.vue'

describe(FilenamePreview.name, () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(FilenamePreview, {
      props: {
        deviceId: 'a',
        siteName: 'b',
        systemTime: new Date(),
        timeZone: 'Europe/Luxembourg',
      },
    })
  })
  it('displays heading', async () => {
    const heading = wrapper.find('h6')
    expect(heading.text()).toBe('Filename preview')
  })

  it('displays filename correctly', async () => {
    const input = wrapper.find('[data-test-id=filenamePreview]')
    expect(input.text()).toMatch(
      /^[a-zA-Z0-9-]+_[a-zA-Z0-9-]+_[0-9]{8}T[0-9]{6}_Europe-Luxembourg.extension$/,
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })
})
