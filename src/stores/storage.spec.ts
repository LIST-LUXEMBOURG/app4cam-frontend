import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../services/ApiClientService'
import { DiskSpaceUsageResponse } from '../services/ApiTypings'
import { useStorageStore } from './storage'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('settings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetch settings', () => {
    const settings: DiskSpaceUsageResponse = {
      capacityKb: 1,
      usedPercentage: 2,
    }
    const getSettingsSpy = jest
      .spyOn(ApiClientService, 'getStorage')
      .mockImplementation(() => {
        return Promise.resolve(settings)
      })

    it('saves settings after fetching', async () => {
      const store = useStorageStore()
      await store.fetchStorage()
      expect(store.capacityKb).toBe(settings.capacityKb)
      expect(store.usedPercentage).toBe(settings.usedPercentage)
    })

    afterEach(() => {
      getSettingsSpy.mockClear()
    })
  })
})
