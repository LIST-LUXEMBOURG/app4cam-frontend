import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { renderAsync } from '../../test/jest/renderAsync'
import MediaCounts from './MediaCounts.vue'

installQuasarPlugin()

const renderComponent = (initialState?: StateTree) =>
  renderAsync(MediaCounts, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

describe(MediaCounts.name, () => {
  it('displays a heading', async () => {
    await renderComponent()
    const heading = screen.getByRole('heading', { name: 'Media' })
    expect(heading).toBeInTheDocument()
  })

  const mockFiles = [
    { name: 'a.jpg', creationTime: new Date() },
    { name: 'b.mp4', creationTime: new Date() },
    { name: 'c.jpg', creationTime: new Date() },
    { name: 'd.mp4', creationTime: new Date() },
    { name: 'e.mp4', creationTime: new Date() },
  ]

  it('displays picture count', async () => {
    await renderComponent({
      files: {
        files: mockFiles,
      },
    })
    const pictures = screen.queryByText('Pictures: 2')
    expect(pictures).toBeInTheDocument()
  })

  it('displays video count', async () => {
    await renderComponent({
      files: {
        files: mockFiles,
      },
    })
    const videos = screen.queryByText('Videos: 3')
    expect(videos).toBeInTheDocument()
  })
})
