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
