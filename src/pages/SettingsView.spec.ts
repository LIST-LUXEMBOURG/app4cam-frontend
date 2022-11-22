import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { Notify } from 'quasar'
import { settings } from '../../fixtures/settings.json'
import SettingsView from './SettingsView.vue'
import { renderAsync } from 'app/test/jest/renderAsync'
import ApiClientService from 'src/helpers/ApiClientService'

installQuasarPlugin({ plugins: { Notify } })

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

const renderComponent = (initialState?: StateTree) =>
  renderAsync(SettingsView, {
    global: {
      plugins: [createTestingPinia({ initialState, stubActions: false })],
    },
  })

describe(SettingsView.name, () => {
  beforeAll(() => {
    jest
      .spyOn(ApiClientService, 'getAvailableTimeZones')
      .mockResolvedValue({ timeZones: [] })
    jest
      .spyOn(ApiClientService, 'getDeviceId')
      .mockResolvedValue({ deviceId: 'a' })
    jest.spyOn(ApiClientService, 'getSettings').mockResolvedValue(settings)
  })

  describe('when page loads', () => {
    it('shows general settings', async () => {
      await renderComponent()
      const field = screen.getByLabelText('Device name')
      expect(field).toBeVisible()
    })

    it('hides camera settings', async () => {
      await renderComponent()
      const field = screen.getByLabelText('Pictures')
      expect(field).not.toBeVisible()
    })

    it('hides trigger settings', async () => {
      await renderComponent()
      const field = screen.getByText('Trigger sensitivity')
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

    it('shows types of shots setting', async () => {
      await renderComponent()
      const button = screen.getByRole('button', { name: /Camera settings/ })
      await user.click(button)
      expect(screen.getByLabelText('Pictures')).toBeVisible()
      expect(screen.getByLabelText('Videos')).toBeVisible()
    })

    it('shows picture quality setting', async () => {
      await renderComponent()
      const button = screen.getByRole('button', { name: /Camera settings/ })
      await user.click(button)
      expect(screen.getByLabelText('Picture quality')).toBeVisible()
    })

    it('shows movie quality setting', async () => {
      await renderComponent()
      const button = screen.getByRole('button', { name: /Camera settings/ })
      await user.click(button)
      expect(screen.getByLabelText('Video quality')).toBeVisible()
    })

    it('hides trigger settings', async () => {
      await renderComponent()
      const button = screen.getByRole('button', { name: /Camera settings/ })
      await user.click(button)
      const field = screen.getByText('Trigger sensitivity')
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
      const field = screen.getByText('Trigger sensitivity')
      expect(field).toBeVisible()
    })
  })
})
