// © 2022 Luxembourg Institute of Science and Technology
/* eslint-disable jest/expect-expect */
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { render } from '@testing-library/vue'
import TimeOutOfSyncDialog from './TimeOutOfSyncDialog.vue'

installQuasarPlugin()

const renderComponent = () => render(TimeOutOfSyncDialog)

describe(TimeOutOfSyncDialog.name, () => {
  it('displays itself', () => {
    renderComponent()
  })
})
