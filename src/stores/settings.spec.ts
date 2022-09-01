import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { useSettingsStore } from './settings'
import { SettingsDto } from 'src/settings'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('settings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetch settings', () => {
    const systemTime = new Date()
    const settings: SettingsDto = {
      deviceName: 'n',
      siteName: 's',
      systemTime: systemTime.toISOString(),
      timeZone: 't',
    }
    const getSettingsSpy = jest
      .spyOn(ApiClientService, 'getSettings')
      .mockResolvedValue(settings)

    it('saves settings after fetching', async () => {
      const store = useSettingsStore()
      await store.fetchSettings()
      expect(store.deviceName).toBe(settings.deviceName)
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
      .mockResolvedValue()

    it('saves all settings', async () => {
      const systemTime = new Date()
      const deviceName = 'd'
      const siteName = 's'
      const timeZone = 't'
      const store = useSettingsStore()
      await store.patchSettings({
        deviceName,
        siteName,
        systemTime,
        timeZone,
      })
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        deviceName,
        siteName,
        systemTime: systemTime.toISOString(),
        timeZone,
      })
      expect(store.deviceName).toBe(deviceName)
      expect(store.siteName).toBe(siteName)
      expect(store.systemTime).toEqual(systemTime)
      expect(store.timeZone).toBe(timeZone)
    })

    it('saves one setting', async () => {
      const systemTime = new Date()
      const settings = {
        deviceName: 'd',
        siteName: 's',
        systemTime,
        timeZone: 't',
      }
      const store = useSettingsStore()
      store.deviceName = settings.deviceName
      store.siteName = settings.siteName
      store.timeZone = settings.timeZone
      await store.patchSettings(settings)
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        systemTime: systemTime.toISOString(),
      })
      expect(store.systemTime).toEqual(systemTime)
    })

    it('ignores unnecessary triggers', async () => {
      const systemTime = new Date()
      const settings = {
        deviceName: 'd',
        siteName: 's',
        systemTime,
        timeZone: 't',
      }
      const store = useSettingsStore()
      store.deviceName = settings.deviceName
      store.siteName = settings.siteName
      store.systemTime = systemTime
      store.timeZone = settings.timeZone
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
      .mockResolvedValue()

    it('saves all settings', async () => {
      const settings = {
        deviceName: 'd',
        siteName: 's',
        timeZone: 't',
      }
      const store = useSettingsStore()
      await store.putSettings(settings)
      expect(ApiClientService.putSettings).toHaveBeenCalledWith(settings)
      expect(store.deviceName).toBe(settings.deviceName)
      expect(store.siteName).toBe(settings.siteName)
      expect(store.timeZone).toBe(settings.timeZone)
    })

    afterEach(() => {
      putSettingsSpy.mockClear()
    })
  })
})
