/**
 * Copyright (C) since 2026 Luxembourg Institute of Science and Technology
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
import PowerActions from './PowerActions.vue'

const renderComponent = () => render(PowerActions)

it('displays the shut down button', () => {
  renderComponent()
  const button = screen.queryByRole('button', {
    name: 'Shut down device',
  })
  expect(button).toBeInTheDocument()
})

it('displays the restart button', () => {
  renderComponent()
  const button = screen.queryByRole('button', {
    name: 'Restart device',
  })
  expect(button).toBeInTheDocument()
})
