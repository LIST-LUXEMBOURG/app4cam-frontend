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
import SiteAndDeviceNamesHeading from './SiteAndDeviceNamesHeading.vue'

const renderComponent = (initialState?: StateTree) =>
  renderAsync(SiteAndDeviceNamesHeading, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

it('displays site and device names as heading', async () => {
  const deviceName = 'a'
  const siteName = 'b'
  await renderComponent({
    settings: {
      current: {
        general: {
          deviceName,
          siteName,
        },
      },
    },
  })
  const heading = screen.getByRole('heading', {
    name: `${siteName} ${deviceName}`,
  })
  expect(heading).toBeInTheDocument()
})
