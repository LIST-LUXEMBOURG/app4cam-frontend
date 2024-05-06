// © 2022 Luxembourg Institute of Science and Technology
import { render, screen } from '@testing-library/vue'
import TimeOutOfSyncDialogDetails from './TimeOutOfSyncDialogDetails.vue'

const renderComponent = () => render(TimeOutOfSyncDialogDetails)

describe('when it is loaded', () => {
  it('displays a general heading', async () => {
    renderComponent()
    const heading = await screen.findByRole('heading', {
      name: 'Time Out Of Sync',
    })
    expect(heading).toBeInTheDocument()
  })

  it('displays a cancel button', () => {
    renderComponent()
    const button = screen.getByRole('button', {
      name: 'Cancel',
    })
    expect(button).toBeInTheDocument()
  })

  it('displays a download button', () => {
    renderComponent()
    const button = screen.getByRole('button', {
      name: 'Go to settings',
    })
    expect(button).toBeInTheDocument()
  })
})
