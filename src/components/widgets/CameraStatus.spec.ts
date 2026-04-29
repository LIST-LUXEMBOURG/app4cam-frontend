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
import { screen, waitFor } from '@testing-library/vue'
import type { MockInstance } from 'vitest'
import { renderAsync } from '../../../test/vitest/renderAsync'
import CameraStatus from './CameraStatus.vue'
import ApiClientService from 'src/helpers/ApiClientService'

const renderComponent = () =>
  renderAsync(CameraStatus, {
    global: {
      plugins: [createTestingPinia({ stubActions: false })],
    },
  })

describe('when the camera is connected', () => {
  let requestSpy: MockInstance

  beforeEach(() => {
    requestSpy = vi
      .spyOn(ApiClientService, 'getCameraConnectedStatus')
      .mockResolvedValue({
        isCameraConnected: true,
      })
  })

  it('displays a heading', async () => {
    await renderComponent()
    const heading = screen.getByRole('heading', { name: 'Camera' })
    expect(heading).toBeInTheDocument()
  })

  it('displays text', async () => {
    await renderComponent()
    await waitFor(() => expect(requestSpy).toHaveBeenCalledTimes(1))
    const status = await screen.findByTestId('status')
    expect(status).toHaveTextContent('The camera is connected.')
  })

  afterEach(() => {
    requestSpy.mockRestore()
  })
})

describe('when the camera is disconnected', () => {
  let requestSpy: MockInstance

  beforeAll(() => {
    requestSpy = vi
      .spyOn(ApiClientService, 'getCameraConnectedStatus')
      .mockResolvedValue({
        isCameraConnected: false,
      })
  })

  it('displays text', async () => {
    await renderComponent()
    await waitFor(() => expect(requestSpy).toHaveBeenCalledTimes(1))
    const status = await screen.findByTestId('status')
    expect(status).toHaveTextContent('The camera is disconnected.')
  })

  afterAll(() => {
    requestSpy.mockRestore()
  })
})
