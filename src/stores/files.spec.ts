// © 2022 Luxembourg Institute of Science and Technology
import { createPinia, setActivePinia } from 'pinia'
import { MockInstance } from 'vitest'
import { files } from '../../fixtures/files.json'
import ApiClientService from '../helpers/ApiClientService'
import { FilesDeletedResponse } from '../helpers/ApiTypings'
import { convertJsonToFiles } from '../test-helpers'
import { useFilesStore } from './files'

const mockFiles = convertJsonToFiles(files)

vi.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('files store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('when two pictures and one video are present', () => {
    it('filters the pictures', () => {
      const store = useFilesStore()
      store.files = mockFiles
      expect(store.pictures).toStrictEqual([mockFiles[0], mockFiles[1]])
    })

    it('filters the videos', () => {
      const store = useFilesStore()
      store.files = mockFiles
      expect(store.videos).toStrictEqual([mockFiles[2]])
    })

    it('returns the picture count', () => {
      const store = useFilesStore()
      store.files = mockFiles
      expect(store.pictureCount).toBe(2)
    })

    it('returns the video count', () => {
      const store = useFilesStore()
      store.files = mockFiles
      expect(store.videoCount).toBe(1)
    })
  })

  describe('delete file', () => {
    vi.spyOn(ApiClientService, 'deleteFile').mockResolvedValue()

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
    const filenames = ['a', 'b', 'c']
    let spy: MockInstance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let store: any

    beforeAll(() => {
      spy = vi.spyOn(ApiClientService, 'deleteFiles').mockImplementation(() => {
        const response: FilesDeletedResponse = { a: true, b: false, c: true }
        return Promise.resolve(response)
      })
    })

    beforeEach(() => {
      store = useFilesStore()
      for (const filename of filenames) {
        store.files.push({
          name: filename,
          creationTime: new Date(),
        })
      }
    })

    it('makes the API call', async () => {
      expect(store.files).toHaveLength(3)
      await store.deleteFiles([filenames[0], filenames[2]])
      expect(spy).toHaveBeenCalled()
    })

    it('removes two of three files', async () => {
      expect(store.files).toHaveLength(3)
      await store.deleteFiles([filenames[0], filenames[2]])
      expect(store.files).toHaveLength(1)
      expect(store.files[0].name).toBe(filenames[1])
    })

    afterAll(() => {
      spy.mockRestore()
    })
  })

  describe('delete all files', () => {
    const filenames = ['a', 'b', 'c']
    let spy: MockInstance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let store: any

    beforeAll(() => {
      spy = vi
        .spyOn(ApiClientService, 'deleteAllFiles')
        .mockImplementation(() => {
          const response: FilesDeletedResponse = { '*': true }
          return Promise.resolve(response)
        })
    })

    beforeEach(() => {
      store = useFilesStore()
      for (const filename of filenames) {
        store.files.push({
          name: filename,
          creationTime: new Date(),
        })
      }
    })

    it('makes the API call', async () => {
      expect(store.files).toHaveLength(3)
      await store.deleteFiles([filenames[0], filenames[1], filenames[2]])
      expect(spy).toHaveBeenCalled()
    })

    it('removes all three files', async () => {
      expect(store.files).toHaveLength(3)
      await store.deleteFiles([filenames[0], filenames[1], filenames[2]])
      expect(store.files).toHaveLength(0)
    })

    afterAll(() => {
      spy.mockRestore()
    })
  })

  describe('fetch files', () => {
    vi.spyOn(ApiClientService, 'getFileList').mockResolvedValue(mockFiles)

    it('stores files', async () => {
      const store = useFilesStore()
      await store.fetchFiles()
      expect(store.files).toEqual(mockFiles)
    })
  })
})
