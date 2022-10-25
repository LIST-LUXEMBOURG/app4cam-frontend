import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { useSettingsStore } from './settings'
import { ApplicationSettings, ShotType } from 'src/settings'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('settings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetch settings', () => {
    const settings: ApplicationSettings = {
      camera: {
        shotTypes: ['pictures', 'videos'],
      },
      general: {
        deviceName: 'n',
        siteName: 's',
        systemTime: new Date().toISOString(),
        timeZone: 't',
      },
      triggering: {
        sensitivity: 0,
      },
    }
    const getSettingsSpy = jest
      .spyOn(ApiClientService, 'getSettings')
      .mockResolvedValue(settings)

    it('saves settings after fetching', async () => {
      const store = useSettingsStore()
      await store.fetchSettings()
      expect(store.$state).toStrictEqual(settings)
    })

    afterEach(() => {
      getSettingsSpy.mockClear()
    })
  })

  describe('get persistent settings', () => {
    it('does not return the non-persistent settings', () => {
      const store = useSettingsStore()
      const settings = store.getPersistentSettings()
      expect(settings.general).not.toHaveProperty('systemTime')
    })
  })

  describe('update persistent settings', () => {
    it("changes persistent settings' value", () => {
      const deviceName = 'd'
      const sensitivity = 1
      const shotTypes: ShotType[] = ['pictures', 'videos']
      const siteName = 's'
      const timeZone = 't'
      const store = useSettingsStore()
      store.updatePersistentSettings({
        camera: {
          shotTypes,
        },
        general: {
          deviceName,
          siteName,
          timeZone,
        },
        triggering: {
          sensitivity,
        },
      })
      expect(store.camera.shotTypes).toStrictEqual(shotTypes)
      expect(store.general.deviceName).toBe(deviceName)
      expect(store.general.siteName).toBe(siteName)
      expect(store.general.timeZone).toBe(timeZone)
      expect(store.triggering.sensitivity).toBe(sensitivity)
    })
  })

  describe('upload persistent settings', () => {
    const patchSettingsSpy = jest
      .spyOn(ApiClientService, 'patchSettings')
      .mockResolvedValue()

    it('uploads all persistent settings', async () => {
      const deviceName = 'd'
      const sensitivity = 1
      const shotTypes: ShotType[] = ['pictures', 'videos']
      const siteName = 's'
      const store = useSettingsStore()
      const timeZone = 't'
      store.camera.shotTypes = shotTypes
      store.general.deviceName = deviceName
      store.general.siteName = siteName
      store.general.timeZone = timeZone
      store.triggering.sensitivity = sensitivity
      await store.uploadPersistentSettings()
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        camera: {
          shotTypes,
        },
        general: {
          deviceName,
          siteName,
          timeZone,
        },
        triggering: {
          sensitivity,
        },
      })
    })

    afterEach(() => {
      patchSettingsSpy.mockClear()
    })
  })

  describe('upload all settings', () => {
    const putSettingsSpy = jest
      .spyOn(ApiClientService, 'putSettings')
      .mockResolvedValue()

    it('uploads all settings', async () => {
      const shotTypes: ShotType[] = ['pictures', 'videos']
      const systemTime = new Date().toString()
      const settings = {
        camera: {
          shotTypes,
        },
        general: {
          deviceName: 'd',
          siteName: 's',
          systemTime,
          timeZone: 't',
        },
        triggering: {
          sensitivity: 1,
        },
      }
      const store = useSettingsStore()
      store.camera.shotTypes = shotTypes
      store.general.deviceName = settings.general.deviceName
      store.general.siteName = settings.general.siteName
      store.general.systemTime = systemTime
      store.general.timeZone = settings.general.timeZone
      store.triggering.sensitivity = settings.triggering.sensitivity
      await store.uploadAllSettings()
      expect(ApiClientService.putSettings).toHaveBeenCalledWith(settings)
    })

    afterEach(() => {
      putSettingsSpy.mockClear()
    })
  })
})
