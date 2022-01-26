import { mount } from '@vue/test-utils'
import { QItem, QItemLabel, QItemSection, Ripple } from 'quasar'
import ShotsView from './ShotsView.vue'
import { files as mockFiles } from '../../fixtures/files.json'
import { createStore } from '../store'

describe('Shots', () => {
  it.skip('displayes files in a list with the necessary information', () => {
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
        plugins: [
          createStore({
            state: () => ({ files: mockFiles }),
          }),
        ],
        provide: {
          _q_: undefined,
        },
      },
    })
    const files = wrapper.findAll('[data-testid=file]')
    expect(files).toHaveLength(mockFiles.length)
    files.forEach((file, i) => {
      const fileText = file.text()
      expect(fileText).toContain(mockFiles[i].name)
      expect(fileText).toContain(mockFiles[i].creationTime)
    })
  })
})
