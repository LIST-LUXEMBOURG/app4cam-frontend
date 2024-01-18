import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { userEvent } from '@testing-library/user-event'
import { screen } from '@testing-library/vue'
import { StateTree } from 'pinia'
import { files } from '../../fixtures/files.json'
import ApiClientService from '../helpers/ApiClientService'
import { convertJsonToFiles } from '../test-helpers'
import MediaView from './MediaView.vue'
import { renderAsync } from 'app/test/jest/renderAsync'

installQuasarPlugin()

const mockFiles = convertJsonToFiles(files)

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

const SELECTED_FILE_CLASS = 'bg-blue-1'

const renderComponent = (initialState?: StateTree) =>
  renderAsync(MediaView, {
    global: {
      plugins: [createTestingPinia({ initialState, stubActions: false })],
    },
  })

describe(MediaView.name, () => {
  beforeAll(() => {
    jest.spyOn(ApiClientService, 'getFileList').mockResolvedValue(mockFiles)
  })

  describe('when page loads', () => {
    it('displays all files', async () => {
      await renderComponent()
      const files = await screen.findAllByTestId('file')
      expect(files).toHaveLength(mockFiles.length)
    })

    it('displays files with the necessary information', async () => {
      await renderComponent()
      const files = await screen.findAllByTestId('file')
      files.forEach((file, i) => {
        expect(file).toHaveTextContent(mockFiles[i].name)
        expect(file).toHaveTextContent(
          mockFiles[i].creationTime.getUTCFullYear().toString(),
        )
      })
    })

    it('displays files as not selected', async () => {
      await renderComponent()
      const files = await screen.findAllByTestId('file')
      files.forEach((file) => {
        expect(file).not.toHaveClass(SELECTED_FILE_CLASS)
      })
    })

    it('displays select all button as enabled', async () => {
      await renderComponent()
      const button = screen.getByRole('button', { name: 'Select all' })
      expect(button).toBeEnabled()
    })

    it('displays unselect all button as disabled', async () => {
      await renderComponent()
      const button = screen.getByRole('button', {
        name: 'Unselect all',
      })
      expect(button).toBeDisabled()
    })

    it('displays download button as disabled', async () => {
      await renderComponent()
      const button = screen.getByRole('button', {
        name: 'Download',
      })
      expect(button).toBeDisabled()
    })

    it('displays delete button as disabled', async () => {
      await renderComponent()
      const button = screen.getByRole('button', {
        name: 'Delete',
      })
      expect(button).toBeDisabled()
    })
  })

  describe('when first item of multiple is clicked', () => {
    const user = userEvent.setup()

    it('toggles its active state', async () => {
      await renderComponent()
      const files = await screen.findAllByTestId('file')
      await user.click(files[0])
      expect(files[0]).toHaveClass(SELECTED_FILE_CLASS)
    })

    it('displays select all button as enabled', async () => {
      await renderComponent()
      const files = await screen.findAllByTestId('file')
      await user.click(files[0])
      const button = screen.getByRole('button', { name: 'Select all' })
      expect(button).toBeEnabled()
    })

    it('displays unselect all button as enabled', async () => {
      await renderComponent()
      const files = await screen.findAllByTestId('file')
      await user.click(files[0])
      const button = screen.getByRole('button', {
        name: 'Unselect all',
      })
      expect(button).toBeEnabled()
    })

    it('displays download button as enabled', async () => {
      await renderComponent()
      const files = await screen.findAllByTestId('file')
      await user.click(files[0])
      const button = screen.getByRole('button', {
        name: 'Download',
      })
      expect(button).toBeEnabled()
    })

    it('displays delete button as enabled', async () => {
      await renderComponent()
      const files = await screen.findAllByTestId('file')
      await user.click(files[0])
      const button = screen.getByRole('button', {
        name: 'Delete',
      })
      expect(button).toBeEnabled()
    })

    describe('and when first item is clicked again', () => {
      it('toggles its active state', async () => {
        await renderComponent()
        const files = await screen.findAllByTestId('file')
        await user.click(files[0])
        await user.click(files[0])
        expect(files[0]).not.toHaveClass(SELECTED_FILE_CLASS)
      })

      it('displays download button as disabled', async () => {
        await renderComponent()
        const files = await screen.findAllByTestId('file')
        await user.click(files[0])
        await user.click(files[0])
        const button = screen.getByRole('button', {
          name: 'Download',
        })
        expect(button).toBeDisabled()
      })

      it('displays delete button as disabled', async () => {
        await renderComponent()
        const files = await screen.findAllByTestId('file')
        await user.click(files[0])
        await user.click(files[0])
        const button = screen.getByRole('button', {
          name: 'Delete',
        })
        expect(button).toBeDisabled()
      })
    })

    describe('and when unselect all button is clicked', () => {
      it('displays select all button as disabled', async () => {
        await renderComponent()
        const files = await screen.findAllByTestId('file')
        await user.click(files[0])
        const button = screen.getByRole('button', {
          name: 'Unselect all',
        })
        await user.click(button)
        expect(button).toBeDisabled()
      })
    })
  })

  describe('when select all button is clicked', () => {
    it('displays select all button as disabled', async () => {
      const user = userEvent.setup()
      await renderComponent()
      const button = screen.getByRole('button', { name: 'Select all' })
      await user.click(button)
      expect(button).toBeDisabled()
    })
  })
})
