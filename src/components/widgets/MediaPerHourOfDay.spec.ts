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
import { screen } from '@testing-library/vue'
import { MockInstance } from 'vitest'
import { renderAsync } from '../../../test/vitest/renderAsync'
import ApiClientService from '../../helpers/ApiClientService'
import MediaPerHourOfDay from './MediaPerHourOfDay.vue'

const renderComponent = () =>
  renderAsync(MediaPerHourOfDay, {
    global: {
      stubs: ['apexchart'],
    },
  })

let spyGetNumberFilesPerHourOfDay: MockInstance
let spyGetShotTypes: MockInstance

beforeAll(() => {
  spyGetNumberFilesPerHourOfDay = vi
    .spyOn(ApiClientService, 'getNumberFilesPerHourOfDay')
    .mockResolvedValue({ hoursOfDayCounts: [] })
  spyGetShotTypes = vi
    .spyOn(ApiClientService, 'getShotTypes')
    .mockResolvedValue({ shotTypes: [] })
})

it('displays a heading', async () => {
  await renderComponent()
  const heading = screen.getByRole('heading', {
    name: 'Total observations over the day',
  })
  expect(heading).toBeInTheDocument()
})

afterAll(() => {
  spyGetNumberFilesPerHourOfDay.mockRestore()
  spyGetShotTypes.mockRestore()
})
