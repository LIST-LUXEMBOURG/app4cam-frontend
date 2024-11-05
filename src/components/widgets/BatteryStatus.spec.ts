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
import { renderAsync } from '../../../test/vitest/renderAsync'
import BatteryStatus from './BatteryStatus.vue'

const renderComponent = (initialState?: StateTree) =>
  renderAsync(BatteryStatus, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

it('displays a heading', async () => {
  await renderComponent()
  const heading = screen.getByRole('heading', { name: 'Battery status' })
  expect(heading).toBeInTheDocument()
})

it('displays picture count', async () => {
  await renderComponent({
    properties: {
      batteryVoltage: 1,
    },
  })
  const pictures = screen.queryByText('1 V')
  expect(pictures).toBeInTheDocument()
})
