// © 2024 Luxembourg Institute of Science and Technology
import { createTestingPinia } from '@pinia/testing'
import { render, screen } from '@testing-library/vue'
import { settings } from '../../fixtures/settings.json'
import GeneralSettings from './GeneralSettings.vue'

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

describe('when the settings are not loading', () => {
  it('displays an enabled site name field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Site name (optional)')
    expect(field).toBeInTheDocument()
    expect(field).toBeEnabled()
  })

  it('displays an enabled device name field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Device name')
    expect(field).toBeInTheDocument()
    expect(field).toBeEnabled()
  })

  it('displays a readonly device id field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Device ID')
    expect(field).toBeInTheDocument()
    expect(field).toHaveAttribute('readonly')
  })

  it('displays an enabled time zone field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Time zone')
    expect(field).toBeInTheDocument()
    expect(field).toBeEnabled()
  })

  it('displays an enabled date field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Date')
    expect(field).toBeInTheDocument()
    expect(field).toBeEnabled()
  })

  it('displays an enabled time field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Time')
    expect(field).toBeInTheDocument()
    expect(field).toBeEnabled()
  })

  it('displays an enabled Wi-Fi password field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Wi-Fi password')
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
  it('displays a disabled site name field', () => {
    renderComponent(true)
    const field = screen.getByLabelText('Site name (optional)')
    expect(field).toBeInTheDocument()
    expect(field).toBeDisabled()
  })

  it('displays a disabled device name field', () => {
    renderComponent(true)
    const field = screen.getByLabelText('Device name')
    expect(field).toBeInTheDocument()
    expect(field).toBeDisabled()
  })

  it('displays a readonly device id field', () => {
    renderComponent(true)
    const field = screen.getByLabelText('Device ID')
    expect(field).toBeInTheDocument()
    expect(field).toHaveAttribute('readonly')
  })

  it('displays a disabled time zone field', () => {
    renderComponent(true)
    const field = screen.getByLabelText('Time zone')
    expect(field).toBeInTheDocument()
    expect(field).toBeDisabled()
  })

  it('displays a disabled date field', () => {
    renderComponent(true)
    const field = screen.getByLabelText('Date')
    expect(field).toBeInTheDocument()
    expect(field).toBeDisabled()
  })

  it('displays a disabled time field', () => {
    renderComponent(true)
    const field = screen.getByLabelText('Time')
    expect(field).toBeInTheDocument()
    expect(field).toBeDisabled()
  })

  it('displays a disabled Wi-Fi password field', () => {
    renderComponent(true)
    const field = screen.getByLabelText('Wi-Fi password')
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
