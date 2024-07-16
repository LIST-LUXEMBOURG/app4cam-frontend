/**
 * Copyright (C) 2022-2024  Luxembourg Institute of Science and Technology
 *
 * App4Cam is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * App4Cam is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with App4Cam.  If not, see <https://www.gnu.org/licenses/>.
 */
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
