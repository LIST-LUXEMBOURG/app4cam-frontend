// © 2022 Luxembourg Institute of Science and Technology
import { render, screen } from '@testing-library/vue'
import SnapshotSection from './SnapshotSection.vue'

const renderComponent = () => render(SnapshotSection)

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
