// © 2023 Luxembourg Institute of Science and Technology
import { render, screen } from '@testing-library/vue'
import LogFileDownloads from './LogFileDownloads.vue'

const renderComponent = () => render(LogFileDownloads)

it('displays a heading', () => {
  renderComponent()
  const heading = screen.queryByRole('heading', { name: 'Log files' })
  expect(heading).toBeInTheDocument()
})
