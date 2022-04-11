import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../services/ApiClientService'
import { VersionResponse } from '../services/ApiTypings'
import { useVersionStore } from './version'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('version store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetch version', () => {
    const VERSION: VersionResponse = {
      commitHash: 'a',
      version: 'b',
    }
    const getSettingsSpy = jest
      .spyOn(ApiClientService, 'getVersion')
      .mockImplementation(() => {
        return Promise.resolve(VERSION)
      })

    it('saves version after fetching', async () => {
      const store = useVersionStore()
      await store.fetchVersion()
      expect(store.commitHash).toBe(VERSION.commitHash)
      expect(store.version).toBe(VERSION.version)
    })

    afterEach(() => {
      getSettingsSpy.mockClear()
    })
  })
})
