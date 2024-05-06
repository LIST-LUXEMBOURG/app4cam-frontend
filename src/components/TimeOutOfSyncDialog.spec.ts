// © 2022 Luxembourg Institute of Science and Technology
/* eslint-disable vitest/expect-expect */
import { render } from '@testing-library/vue'
import TimeOutOfSyncDialog from './TimeOutOfSyncDialog.vue'

const renderComponent = () => render(TimeOutOfSyncDialog)

it('displays itself', () => {
  renderComponent()
})
