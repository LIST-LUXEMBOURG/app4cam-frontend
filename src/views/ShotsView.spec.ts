import { mount } from '@vue/test-utils'
import { QItem, QItemLabel, QItemSection, Ripple } from 'quasar'
import ShotsView from './ShotsView.vue'
import { files as mockFiles } from '../../fixtures/files.json'
import { key } from '../store'

it('displayes files in a list with the necessary information', () => {
  const store = {
    state: {
      files: mockFiles,
    },
    dispatch: jest.fn(() => Promise.resolve()),
  }
  const wrapper = mount(ShotsView, {
    components: {
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
  const files = wrapper.findAll('[data-test-id="file"]')
  expect(files).toHaveLength(mockFiles.length)
  files.forEach((file, i) => {
    const fileText = file.text()
    expect(fileText).toContain(mockFiles[i].name)
    expect(fileText).toContain(mockFiles[i].creationTime)
  })
})
