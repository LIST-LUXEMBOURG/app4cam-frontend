/**
 * Copyright (C) 2026 Luxembourg Institute of Science and Technology
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
import CurrentLightType from './CurrentLightType.vue'

const renderComponent = (initialState?: StateTree) =>
  renderAsync(CurrentLightType, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

describe('when the light type is visible', () => {
  const lightType = 'visible'

  it('displays a heading', async () => {
    await renderComponent({
      properties: {
        lightType,
      },
    })
    const heading = screen.queryByRole('heading', {
      name: 'Current light type',
    })
    expect(heading).toBeInTheDocument()
  })

  it('displays the light type', async () => {
    await renderComponent({
      properties: {
        lightType,
      },
    })
    const lightTypeElement = screen.queryByText(lightType)
    expect(lightTypeElement).toBeInTheDocument()
  })
})

describe('when the light type is unsupported', () => {
  it('hides the component', async () => {
    await renderComponent({
      properties: {
        lightType: 'unsupported',
      },
    })
    const heading = screen.queryByTestId('light-type-widget')
    expect(heading).not.toBeInTheDocument()
  })
})
