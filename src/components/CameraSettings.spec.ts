// © 2024 Luxembourg Institute of Science and Technology
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
  it('shows enabled types of shots fields', () => {
    renderComponent(false)
    const fieldPictures = screen.getByLabelText('Pictures')
    const fieldVideos = screen.getByLabelText('Videos')
    expect(fieldPictures).toBeInTheDocument()
    expect(fieldPictures).toBeEnabled()
    expect(fieldVideos).toBeInTheDocument()
    expect(fieldVideos).toBeEnabled()
  })

  it('shows an enabled picture quality field', () => {
    renderComponent(false)
    const field = screen.getByLabelText('Picture quality')
    expect(field).toBeInTheDocument()
    expect(field).toBeEnabled()
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
  it('shows disabled types of shots fields', () => {
    renderComponent(true)
    const fieldPictures = screen.getByLabelText('Pictures')
    const fieldVideos = screen.getByLabelText('Videos')
    expect(fieldPictures).toBeInTheDocument()
    expect(fieldPictures).toHaveAttribute('aria-disabled', 'true')
    expect(fieldVideos).toBeInTheDocument()
    expect(fieldVideos).toHaveAttribute('aria-disabled', 'true')
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
