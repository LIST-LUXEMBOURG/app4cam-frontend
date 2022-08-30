import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { render, screen } from '@testing-library/vue'
import SnapshotSection from './SnapshotSection.vue'

installQuasarPlugin()

const renderComponent = () => render(SnapshotSection)

describe(SnapshotSection.name, () => {
  it('displays a heading', () => {
    renderComponent()
    const heading = screen.queryByRole('heading', { name: 'Snapshot' })
    expect(heading).toBeInTheDocument()
  })

  it('displays take snapshot button', () => {
    renderComponent()
    const heading = screen.queryByRole('button', { name: 'Take snapshot' })
    expect(heading).toBeInTheDocument()
  })
})
