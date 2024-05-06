// © 2024 Luxembourg Institute of Science and Technology
import { createTestingPinia } from '@pinia/testing'
import { render, screen } from '@testing-library/vue'
import { settings } from '../../fixtures/settings.json'
import TriggerSettings from './TriggerSettings.vue'

const renderComponent = (isLoadingSettings: boolean) =>
  render(TriggerSettings, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            settings: {
              current: settings.triggering,
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
  it('shows enabled working time switch and disabled time fields', () => {
    renderComponent(false)
    const fieldSwitch = screen.getByLabelText(
      'Turn on only during the following interval',
    )
    const fieldWakingUp = screen.getByTestId('wakingUpTime-field')
    const fieldSleeping = screen.getByTestId('sleepingTime-field')
    expect(fieldSwitch).toBeInTheDocument()
    expect(fieldSwitch).toBeEnabled()
    expect(fieldWakingUp).toBeInTheDocument()
    expect(fieldWakingUp).toBeDisabled()
    expect(fieldSleeping).toBeInTheDocument()
    expect(fieldSleeping).toBeDisabled()
  })

  it('shows an enabled threshold field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Threshold')
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
  it('shows disabled working time switch and time fields', () => {
    renderComponent(true)
    const fieldSwitch = screen.getByLabelText(
      'Turn on only during the following interval',
    )
    const fieldWakingUp = screen.getByTestId('wakingUpTime-field')
    const fieldSleeping = screen.getByTestId('sleepingTime-field')
    expect(fieldSwitch).toBeInTheDocument()
    expect(fieldSwitch).toHaveAttribute('aria-disabled', 'true')
    expect(fieldWakingUp).toBeInTheDocument()
    expect(fieldWakingUp).toBeDisabled()
    expect(fieldSleeping).toBeInTheDocument()
    expect(fieldSleeping).toBeDisabled()
  })

  it('shows a disabled threshold field', () => {
    renderComponent(true)
    const field = screen.getByLabelText('Threshold')
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
