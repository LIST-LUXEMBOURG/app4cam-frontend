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
import { userEvent } from '@testing-library/user-event'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { settings } from '../../fixtures/settings.json'
import SettingsView from './SettingsView.vue'
import { renderAsync } from 'app/test/vitest/renderAsync'
import ApiClientService from 'src/helpers/ApiClientService'
import { ApplicationSettings } from 'src/settings'

vi.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

const renderComponent = (initialState?: StateTree) =>
  renderAsync(SettingsView, {
    global: {
      plugins: [createTestingPinia({ initialState, stubActions: false })],
    },
  })

beforeAll(() => {
  vi.spyOn(ApiClientService, 'getAvailableTimeZones').mockResolvedValue({
    timeZones: [],
  })
  vi.spyOn(ApiClientService, 'getDeviceId').mockResolvedValue({
    deviceId: 'a',
  })
  vi.spyOn(ApiClientService, 'getSettings').mockResolvedValue(
    settings as ApplicationSettings,
  )
})

describe('when page loads', () => {
  it('hides general settings', async () => {
    await renderComponent()
    const field = screen.getByLabelText('Device name')
    expect(field).not.toBeVisible()
  })

  it('hides camera settings', async () => {
    await renderComponent()
    const field = screen.getByLabelText('Pictures')
    expect(field).not.toBeVisible()
  })

  it('hides trigger settings', async () => {
    await renderComponent()
    const field = screen.getByLabelText('Threshold')
    expect(field).not.toBeVisible()
  })
})

describe('when general settings heading is clicked', () => {
  const user = userEvent.setup()

  it('shows general settings', async () => {
    await renderComponent()
    const button = screen.getByRole('button', { name: /General settings/ })
    await user.click(button)
    const field = screen.getByLabelText('Device name')
    expect(field).toBeVisible()
  })

  it('hides camera settings', async () => {
    await renderComponent()
    const button = screen.getByRole('button', { name: /General settings/ })
    await user.click(button)
    const field = screen.getByLabelText('Pictures')
    expect(field).not.toBeVisible()
  })

  it('hides trigger settings', async () => {
    await renderComponent()
    const button = screen.getByRole('button', { name: /General settings/ })
    await user.click(button)
    const field = screen.getByLabelText('Threshold')
    expect(field).not.toBeVisible()
  })
})

describe('when camera settings heading is clicked', () => {
  const user = userEvent.setup()

  it('hides general settings', async () => {
    await renderComponent()
    const button = screen.getByRole('button', { name: /Camera settings/ })
    await user.click(button)
    const field = screen.getByLabelText('Device name')
    expect(field).not.toBeVisible()
  })

  it('shows camera settings', async () => {
    await renderComponent()
    const button = screen.getByRole('button', { name: /Camera settings/ })
    await user.click(button)
    expect(screen.getByLabelText('Picture quality')).toBeVisible()
  })

  it('hides trigger settings', async () => {
    await renderComponent()
    const button = screen.getByRole('button', { name: /Camera settings/ })
    await user.click(button)
    const field = screen.getByLabelText('Threshold')
    expect(field).not.toBeVisible()
  })
})

describe('when trigger settings heading is clicked', () => {
  const user = userEvent.setup()

  it('hides general settings', async () => {
    await renderComponent()
    const button = screen.getByRole('button', { name: /Trigger settings/ })
    await user.click(button)
    const field = screen.getByLabelText('Device name')
    expect(field).not.toBeVisible()
  })

  it('hides camera settings', async () => {
    await renderComponent()
    const button = screen.getByRole('button', { name: /Trigger settings/ })
    await user.click(button)
    const field = screen.getByLabelText('Pictures')
    expect(field).not.toBeVisible()
  })

  it('shows trigger settings', async () => {
    await renderComponent()
    const button = screen.getByRole('button', { name: /Trigger settings/ })
    await user.click(button)
    const field = screen.getByLabelText('Threshold')
    expect(field).toBeVisible()
  })
})
