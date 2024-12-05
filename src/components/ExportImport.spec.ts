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
import { createTestingPinia } from '@pinia/testing'
import { render, screen } from '@testing-library/vue'
import ExportImport from './ExportImport.vue'

const renderComponent = () =>
  render(ExportImport, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

it('displays a export button', () => {
  renderComponent()
  const button = screen.queryByRole('button', {
    name: 'Export settings',
  })
  expect(button).toBeInTheDocument()
})

it('displays a import button', () => {
  renderComponent()
  const button = screen.queryByRole('button', {
    name: 'Import',
  })
  expect(button).toBeInTheDocument()
})
