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
import { settings } from '../../fixtures/settings.json'
import CameraSettings from './CameraSettings.vue'

const renderComponent = (isLoadingSettings: boolean) =>
  render(CameraSettings, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            settings: {
              current: settings.camera,
            },
          },
        }),
      ],
    },
    props: {
      isLoadingSettings,
    },
  })

describe('when the settings are not loading', () => {
  it('does not show types of shots fields', () => {
    renderComponent(false)
    const fieldPictures = screen.queryByLabelText('Pictures')
    const fieldVideos = screen.queryByLabelText('Videos')
    expect(fieldPictures).not.toBeInTheDocument()
    expect(fieldVideos).not.toBeInTheDocument()
  })

  it('does not show an picture quality field', () => {
    renderComponent(false)
    const field = screen.queryByLabelText('Picture quality')
    expect(field).not.toBeInTheDocument()
  })

  it('shows an enabled movie quality field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Video quality')
    expect(field).toBeInTheDocument()
    expect(field).toBeEnabled()
  })

  it('shows an enabled focus field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Focus')
    expect(field).toBeInTheDocument()
    expect(field).toBeEnabled()
  })

  it('displays an enabled save button', () => {
    renderComponent(false)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })
})

describe('when the settings are loading', () => {
  it('does not show types of shots fields', () => {
    renderComponent(true)
    const fieldPictures = screen.queryByLabelText('Pictures')
    const fieldVideos = screen.queryByLabelText('Videos')
    expect(fieldPictures).not.toBeInTheDocument()
    expect(fieldVideos).not.toBeInTheDocument()
  })

  it('shows a disabled focus field', () => {
    renderComponent(true)
    const field = screen.getByLabelText('Focus')
    expect(field).toBeInTheDocument()
    expect(field).toBeDisabled()
  })

  it('displays a disabled save button', () => {
    renderComponent(true)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })
})
