import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../services/ApiClientService'
import { useSettingsStore } from './settings'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('settings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetch settings', () => {
    const systemTime = new Date()
    const settings: SettingsDto = {
      deviceId: 'd',
      siteName: 's',
      systemTime: systemTime.toISOString(),
    }
    const getSettingsSpy = jest
      .spyOn(ApiClientService, 'getSettings')
      .mockImplementation(() => {
        return Promise.resolve(settings)
      })

    it('saves settings after fetching', async () => {
      const store = useSettingsStore()
      await store.fetchSettings()
      expect(store.deviceId).toBe(settings.deviceId)
      expect(store.siteName).toBe(settings.siteName)
      expect(store.systemTime).toEqual(systemTime)
    })

    afterEach(() => {
      getSettingsSpy.mockClear()
    })
  })

  describe('patch settings', () => {
    const patchSettingsSpy = jest
      .spyOn(ApiClientService, 'patchSettings')
      .mockImplementation(() => Promise.resolve())

    it('saves all settings', async () => {
      const systemTime = new Date()
      const deviceId = 'd'
      const siteName = 's'
      const store = useSettingsStore()
      await store.patchSettings({
        deviceId,
        siteName,
        systemTime,
      })
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        deviceId,
        siteName,
        systemTime: systemTime.toISOString(),
      })
      expect(store.deviceId).toBe(deviceId)
      expect(store.siteName).toBe(siteName)
      expect(store.systemTime).toEqual(systemTime)
    })

    it('saves one setting', async () => {
      const systemTime = new Date()
      const settings = {
        deviceId: 'd',
        siteName: 's',
        systemTime: systemTime,
      }
      const store = useSettingsStore()
      store.deviceId = settings.deviceId
      store.siteName = settings.siteName
      await store.patchSettings(settings)
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        systemTime: systemTime.toISOString(),
      })
      expect(store.systemTime).toEqual(systemTime)
    })

    it('ignores unnecessary triggers', async () => {
      const systemTime = new Date()
      const settings = {
        deviceId: 'd',
        siteName: 's',
        systemTime: systemTime,
      }
      const store = useSettingsStore()
      store.deviceId = settings.deviceId
      store.siteName = settings.siteName
      store.systemTime = systemTime
      await store.patchSettings(settings)
      expect(ApiClientService.patchSettings).toHaveBeenCalledTimes(0)
    })

    afterEach(() => {
      patchSettingsSpy.mockClear()
    })
  })

  describe('put settings', () => {
    const putSettingsSpy = jest
      .spyOn(ApiClientService, 'putSettings')
      .mockImplementation(() => Promise.resolve())

    it('saves all settings', async () => {
      const settings = {
        deviceId: 'd',
        siteName: 's',
      }
      const store = useSettingsStore()
      await store.putSettings(settings)
      expect(ApiClientService.putSettings).toHaveBeenCalledWith(settings)
      expect(store.deviceId).toBe(settings.deviceId)
      expect(store.siteName).toBe(settings.siteName)
    })

    afterEach(() => {
      putSettingsSpy.mockClear()
    })
  })
})
