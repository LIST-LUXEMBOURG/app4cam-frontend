import { mount, VueWrapper } from '@vue/test-utils'
import { QBtn, QItem, QItemLabel, QItemSection, Ripple } from 'quasar'
import ShotsView from './ShotsView.vue'
import { files as mockFiles } from '../../fixtures/files.json'
import { key } from '../store'

let wrapper: VueWrapper<any>

beforeAll(() => {
  const store = {
    state: {
      files: mockFiles,
    },
    dispatch: jest.fn(() => Promise.resolve()),
  }
  wrapper = mount(ShotsView, {
    components: {
      'q-btn': QBtn,
      'q-item': QItem,
      'q-item-label': QItemLabel,
      'q-item-section': QItemSection,
    },
    directives: {
      Ripple,
    },
    global: {
      provide: {
        _q_: undefined,
        [key as symbol]: store,
      },
    },
  })
})

it('displays files in a list with the necessary information', () => {
  const files = wrapper.findAll('[data-test-id="file"]')
  expect(files).toHaveLength(mockFiles.length)
  files.forEach((file, i) => {
    const fileText = file.text()
    expect(fileText).toContain(mockFiles[i].name)
    expect(fileText).toContain(mockFiles[i].creationTime)
  })
})

it('changes the download button disabled state depending on if a file is selected', async () => {
  const downloadButton = wrapper.find('[data-test-id="download-button"]')
  expect(downloadButton.element.hasAttribute('disabled')).toBeTruthy()
  const files = wrapper.findAll('[data-test-id="file"]')
  await files[0].trigger('click')
  expect(downloadButton.element.hasAttribute('disabled')).toBeFalsy()
  await files[0].trigger('click')
  expect(downloadButton.element.hasAttribute('disabled')).toBeTruthy()
})

afterAll(() => {
  wrapper.unmount()
})
