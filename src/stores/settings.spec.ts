import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { useSettingsStore } from './settings'
import { ApplicationSettings, LightType, ShotType } from 'src/settings'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('settings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetch settings', () => {
    const settings: ApplicationSettings = {
      camera: {
        pictureQuality: 60,
        shotTypes: ['pictures', 'videos'],
        videoQuality: 90,
      },
      general: {
        deviceName: 'n',
        siteName: 's',
        systemTime: new Date().toISOString(),
        timeZone: 't',
      },
      triggering: {
        light: 'visible',
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
      const light = 'infrared'
      const pictureQuality = 40
      const sensitivity = 1
      const shotTypes: ShotType[] = ['pictures', 'videos']
      const siteName = 's'
      const timeZone = 't'
      const videoQuality = 90
      const store = useSettingsStore()
      store.updatePersistentSettings({
        camera: {
          shotTypes,
          pictureQuality,
          videoQuality,
        },
        general: {
          deviceName,
          siteName,
          timeZone,
        },
        triggering: {
          light,
          sensitivity,
        },
      })
      expect(store.camera.pictureQuality).toStrictEqual(pictureQuality)
      expect(store.camera.shotTypes).toStrictEqual(shotTypes)
      expect(store.camera.videoQuality).toStrictEqual(videoQuality)
      expect(store.general.deviceName).toBe(deviceName)
      expect(store.general.siteName).toBe(siteName)
      expect(store.general.timeZone).toBe(timeZone)
      expect(store.triggering.light).toBe(light)
      expect(store.triggering.sensitivity).toBe(sensitivity)
    })
  })

  describe('when updating only part of the settings', () => {
    const patchSettingsSpy = jest
      .spyOn(ApiClientService, 'patchSettings')
      .mockResolvedValue()

    it('uploads all persistent settings', async () => {
      const deviceName = 'd'
      const light = 'infrared'
      const pictureQuality = 40
      const sensitivity = 1
      const shotTypes: ShotType[] = ['pictures', 'videos']
      const siteName = 's'
      const store = useSettingsStore()
      const timeZone = 't'
      const videoQuality = 90
      store.camera.pictureQuality = pictureQuality
      store.camera.shotTypes = shotTypes
      store.camera.videoQuality = videoQuality
      store.general.deviceName = deviceName
      store.general.siteName = siteName
      store.general.timeZone = timeZone
      store.triggering.light = light
      store.triggering.sensitivity = sensitivity
      await store.uploadPersistentSettings()
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        camera: {
          pictureQuality,
          shotTypes,
          videoQuality,
        },
        general: {
          deviceName,
          siteName,
          timeZone,
        },
        triggering: {
          light,
          sensitivity,
        },
      })
    })

    it('uploads all camera settings', async () => {
      const pictureQuality = 40
      const shotTypes: ShotType[] = ['pictures', 'videos']
      const videoQuality = 90
      const store = useSettingsStore()
      store.camera.pictureQuality = pictureQuality
      store.camera.shotTypes = shotTypes
      store.camera.videoQuality = videoQuality
      await store.uploadAllCameraSettings()
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        camera: {
          pictureQuality,
          shotTypes,
          videoQuality,
        },
      })
    })

    it('uploads all general settings', async () => {
      const deviceName = 'd'
      const siteName = 's'
      const store = useSettingsStore()
      const systemTime = new Date().toString()
      const timeZone = 't'
      store.general.deviceName = deviceName
      store.general.siteName = siteName
      store.general.systemTime = systemTime
      store.general.timeZone = timeZone
      await store.uploadAllGeneralSettings()
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        general: {
          deviceName,
          siteName,
          systemTime,
          timeZone,
        },
      })
    })

    it('uploads all trigger settings', async () => {
      const light = 'infrared'
      const sensitivity = 1
      const store = useSettingsStore()
      store.triggering.light = light
      store.triggering.sensitivity = sensitivity
      await store.uploadAllTriggerSettings()
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        triggering: {
          light,
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
      const pictureQuality = 40
      const shotTypes: ShotType[] = ['pictures', 'videos']
      const systemTime = new Date().toString()
      const videoQuality = 90
      const settings = {
        camera: {
          pictureQuality,
          shotTypes,
          videoQuality,
        },
        general: {
          deviceName: 'd',
          siteName: 's',
          systemTime,
          timeZone: 't',
        },
        triggering: {
          light: 'infrared' as LightType,
          sensitivity: 1,
        },
      }
      const store = useSettingsStore()
      store.camera.pictureQuality = pictureQuality
      store.camera.shotTypes = shotTypes
      store.camera.videoQuality = videoQuality
      store.general.deviceName = settings.general.deviceName
      store.general.siteName = settings.general.siteName
      store.general.systemTime = systemTime
      store.general.timeZone = settings.general.timeZone
      store.triggering.light = settings.triggering.light
      store.triggering.sensitivity = settings.triggering.sensitivity
      await store.uploadAllSettings()
      expect(ApiClientService.putSettings).toHaveBeenCalledWith(settings)
    })

    afterEach(() => {
      putSettingsSpy.mockClear()
    })
  })
})
