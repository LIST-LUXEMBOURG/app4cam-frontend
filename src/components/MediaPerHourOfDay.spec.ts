// © 2024 Luxembourg Institute of Science and Technology
import { screen } from '@testing-library/vue'
import { MockInstance } from 'vitest'
import { renderAsync } from '../../test/vitest/renderAsync'
import ApiClientService from '../helpers/ApiClientService'
import MediaPerHourOfDay from './MediaPerHourOfDay.vue'

const renderComponent = () =>
  renderAsync(MediaPerHourOfDay, {
    global: {
      stubs: ['apexchart'],
    },
  })

let spyGetNumberFilesPerHourOfDay: MockInstance
let spyGetShotTypes: MockInstance

beforeAll(() => {
  spyGetNumberFilesPerHourOfDay = vi
    .spyOn(ApiClientService, 'getNumberFilesPerHourOfDay')
    .mockResolvedValue({ hoursOfDayCounts: [] })
  spyGetShotTypes = vi
    .spyOn(ApiClientService, 'getShotTypes')
    .mockResolvedValue({ shotTypes: [] })
})

it('displays a heading', async () => {
  await renderComponent()
  const heading = screen.getByRole('heading', {
    name: 'Total observations over the day',
  })
  expect(heading).toBeInTheDocument()
})

afterAll(() => {
  spyGetNumberFilesPerHourOfDay.mockRestore()
  spyGetShotTypes.mockRestore()
})
