// © 2024 Luxembourg Institute of Science and Technology
import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { render, screen } from '@testing-library/vue'
import { Notify } from 'quasar'
import { settings } from '../../fixtures/settings.json'
import GeneralSettings from './GeneralSettings.vue'

installQuasarPlugin({ plugins: { Notify } })

const renderComponent = (isLoadingSettings: boolean) =>
  render(GeneralSettings, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            settings: {
              current: settings.general,
            },
          },
        }),
      ],
      stubs: ['FilenamePreview'],
    },
    props: {
      isLoadingSettings,
    },
  })

describe(GeneralSettings.name, () => {
  describe('when the settings are not loading', () => {
    it('displays an enabled site name field', () => {
      renderComponent(false)
      const field = screen.queryByLabelText('Site name (optional)')
      expect(field).toBeEnabled()
    })

    it('displays an enabled device name field', () => {
      renderComponent(false)
      const field = screen.queryByLabelText('Device name')
      expect(field).toBeEnabled()
    })

    it('displays a readonly device id field', () => {
      renderComponent(false)
      const field = screen.queryByLabelText('Device ID')
      expect(field).toHaveAttribute('readonly')
    })

    it('displays an enabled time zone field', () => {
      renderComponent(false)
      const field = screen.queryByLabelText('Time zone')
      expect(field).toBeEnabled()
    })

    it('displays an enabled date field', () => {
      renderComponent(false)
      const field = screen.queryByLabelText('Date')
      expect(field).toBeEnabled()
    })

    it('displays an enabled time field', () => {
      renderComponent(false)
      const field = screen.queryByLabelText('Time')
      expect(field).toBeEnabled()
    })

    it('displays an enabled Wi-Fi password field', () => {
      renderComponent(false)
      const field = screen.queryByLabelText('Wi-Fi password')
      expect(field).toBeEnabled()
    })

    it('displays an enabled save button', () => {
      renderComponent(false)
      const button = screen.queryByRole('button', { name: 'Save' })
      expect(button).toBeEnabled()
    })
  })

  describe('when the settings are loading', () => {
    it('displays a disabled site name field', () => {
      renderComponent(true)
      const field = screen.queryByLabelText('Site name (optional)')
      expect(field).toBeDisabled()
    })

    it('displays a disabled device name field', () => {
      renderComponent(true)
      const field = screen.queryByLabelText('Device name')
      expect(field).toBeDisabled()
    })

    it('displays a readonly device id field', () => {
      renderComponent(true)
      const field = screen.queryByLabelText('Device ID')
      expect(field).toHaveAttribute('readonly')
    })

    it('displays a disabled time zone field', () => {
      renderComponent(true)
      const field = screen.queryByLabelText('Time zone')
      expect(field).toBeDisabled()
    })

    it('displays a disabled date field', () => {
      renderComponent(true)
      const field = screen.queryByLabelText('Date')
      expect(field).toBeDisabled()
    })

    it('displays a disabled time field', () => {
      renderComponent(true)
      const field = screen.queryByLabelText('Time')
      expect(field).toBeDisabled()
    })

    it('displays a disabled Wi-Fi password field', () => {
      renderComponent(true)
      const field = screen.queryByLabelText('Wi-Fi password')
      expect(field).toBeDisabled()
    })

    it('displays a disabled save button', () => {
      renderComponent(true)
      const button = screen.queryByRole('button', { name: 'Save' })
      expect(button).toBeDisabled()
    })
  })
})
