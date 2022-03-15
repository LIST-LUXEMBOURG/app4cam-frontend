import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../services/ApiClientService'
import { useFilesStore } from './files'
import { files } from '../../fixtures/files.json'
import { convertJsonToFiles } from '../test-helpers'
import { FilesDeletedResponse } from '../services/ApiTypings'

const mockFiles = convertJsonToFiles(files)

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('files store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('delete file', () => {
    jest
      .spyOn(ApiClientService, 'deleteFile')
      .mockImplementation(() => Promise.resolve())

    it('removes a file', async () => {
      const filename = 'a'
      const store = useFilesStore()
      store.files.push({
        name: filename,
        creationTime: new Date(),
      })
      expect(store.files).toHaveLength(1)
      await store.deleteFile(filename)
      expect(store.files).toHaveLength(0)
    })
  })

  describe('delete files', () => {
    jest.spyOn(ApiClientService, 'deleteFiles').mockImplementation(() => {
      const response: FilesDeletedResponse = { a: true, b: false, c: true }
      return Promise.resolve(response)
    })

    it('removes two of three files', async () => {
      const filenames = ['a', 'b', 'c']
      const store = useFilesStore()
      for (const filename of filenames) {
        store.files.push({
          name: filename,
          creationTime: new Date(),
        })
      }
      expect(store.files).toHaveLength(3)
      await store.deleteFiles([filenames[0], filenames[2]])
      expect(store.files).toHaveLength(1)
      expect(store.files[0].name).toBe(filenames[1])
    })
  })

  describe('fetch files', () => {
    jest.spyOn(ApiClientService, 'getFileList').mockImplementation(() => {
      return Promise.resolve(mockFiles)
    })

    it('stores files', async () => {
      const store = useFilesStore()
      await store.fetchFiles()
      expect(store.files).toEqual(mockFiles)
    })
  })
})
