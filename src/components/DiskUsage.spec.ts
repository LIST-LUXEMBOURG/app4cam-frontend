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
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { renderAsync } from '../../test/vitest/renderAsync'
import DiskUsage from './DiskUsage.vue'

const renderComponent = (initialState?: StateTree) =>
  renderAsync(DiskUsage, {
    global: {
      plugins: [createTestingPinia({ initialState })],
      stubs: ['apexchart'],
    },
  })

it('displays a heading', async () => {
  await renderComponent()
  const heading = screen.getByRole('heading', { name: 'Disk storage' })
  expect(heading).toBeInTheDocument()
})

it('displays a capacity in GB', async () => {
  await renderComponent({
    storage: {
      capacityKb: 1,
      usedPercentage: 0,
    },
  })
  const line = screen.queryByText(/Total capacity: \d+.?\d{0,2} GB/)
  expect(line).toBeInTheDocument()
})
