// © 2022-2022 Luxembourg Institute of Science and Technology
import { render, screen } from '@testing-library/vue'
import FilenamePreview from './FilenamePreview.vue'

const renderComponent = () =>
  render(FilenamePreview, {
    props: {
      deviceName: 'a',
      siteName: 'b',
      systemTime: new Date().toISOString(),
      timeZone: 'Europe/Luxembourg',
    },
  })

it('displays a heading', async () => {
  renderComponent()
  const heading = screen.queryByRole('heading', { name: 'Filename preview' })
  expect(heading).toBeInTheDocument()
})

it('displays filename correctly', async () => {
  renderComponent()
  const container = screen.getByTestId('filenamePreview')
  expect(container).toHaveTextContent(
    /^[a-zA-Z0-9-]+_[a-zA-Z0-9-]+_[0-9]{8}T[0-9]{6}_Europe-Luxembourg.extension$/,
  )
})
