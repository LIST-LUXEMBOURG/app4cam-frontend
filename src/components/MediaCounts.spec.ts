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
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { renderAsync } from '../../test/vitest/renderAsync'
import MediaCounts from './MediaCounts.vue'

const renderComponent = (initialState?: StateTree) =>
  renderAsync(MediaCounts, {
    global: {
      plugins: [createTestingPinia({ initialState })],
    },
  })

it('displays a heading', async () => {
  await renderComponent()
  const heading = screen.getByRole('heading', { name: 'Media' })
  expect(heading).toBeInTheDocument()
})

const mockFiles = [
  { name: 'a.jpg', creationTime: new Date() },
  { name: 'b.mp4', creationTime: new Date() },
  { name: 'c.jpg', creationTime: new Date() },
  { name: 'd.mp4', creationTime: new Date() },
  { name: 'e.mp4', creationTime: new Date() },
]

it('displays picture count', async () => {
  await renderComponent({
    files: {
      files: mockFiles,
    },
  })
  const pictures = screen.queryByText('Pictures: 2')
  expect(pictures).toBeInTheDocument()
})

it('displays video count', async () => {
  await renderComponent({
    files: {
      files: mockFiles,
    },
  })
  const videos = screen.queryByText('Videos: 3')
  expect(videos).toBeInTheDocument()
})
