// © 2023 Luxembourg Institute of Science and Technology
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { render, screen } from '@testing-library/vue'
import LogFileDownloads from './LogFileDownloads.vue'

installQuasarPlugin()

const renderComponent = () => render(LogFileDownloads)

describe(LogFileDownloads.name, () => {
  it('displays a heading', () => {
    renderComponent()
    const heading = screen.queryByRole('heading', { name: 'Log files' })
    expect(heading).toBeInTheDocument()
  })
})
