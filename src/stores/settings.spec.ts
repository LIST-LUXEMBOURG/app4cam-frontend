import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { useSettingsStore } from './settings'
import { ApplicationSettings, PersistentSettings, ShotType } from 'src/settings'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('settings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetch settings', () => {
    const settings: ApplicationSettings = {
      camera: {
        light: 'visible',
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
        threshold: 0,
        sleepingTime: '18:00',
        wakingUpTime: '08:00',
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
      const settings: PersistentSettings = {
        camera: {
          light: 'infrared',
          shotTypes: ['pictures', 'videos'],
          pictureQuality: 40,
          videoQuality: 90,
        },
        general: {
          deviceName: 'd',
          siteName: 's',
          timeZone: 't',
        },
        triggering: {
          light: 'infrared',
          sleepingTime: '18:00',
          threshold: 1,
          wakingUpTime: '08:00',
        },
      }
      const store = useSettingsStore()

      store.updatePersistentSettings(settings)

      expect(store.camera.light).toBe(settings.camera.light)
      expect(store.camera.pictureQuality).toBe(settings.camera.pictureQuality)
      expect(store.camera.shotTypes).toStrictEqual(settings.camera.shotTypes)
      expect(store.camera.videoQuality).toBe(settings.camera.videoQuality)
      expect(store.general.deviceName).toBe(settings.general.deviceName)
      expect(store.general.siteName).toBe(settings.general.siteName)
      expect(store.general.timeZone).toBe(settings.general.timeZone)
      expect(store.triggering.light).toBe(settings.triggering.light)
      expect(store.triggering.threshold).toBe(settings.triggering.threshold)
      expect(store.triggering.sleepingTime).toBe(
        settings.triggering.sleepingTime,
      )
      expect(store.triggering.wakingUpTime).toBe(
        settings.triggering.wakingUpTime,
      )
    })
  })

  describe('when updating only part of the settings', () => {
    const patchSettingsSpy = jest
      .spyOn(ApiClientService, 'patchSettings')
      .mockResolvedValue()

    it('uploads all persistent settings', async () => {
      const cameraLight = 'infrared'
      const deviceName = 'd'
      const pictureQuality = 40
      const threshold = 1
      const shotTypes: ShotType[] = ['pictures', 'videos']
      const siteName = 's'
      const sleepingTime = '18:00'
      const store = useSettingsStore()
      const timeZone = 't'
      const triggeringLight = 'infrared'
      const videoQuality = 90
      const wakingUpTime = '08:00'
      store.camera.light = cameraLight
      store.camera.pictureQuality = pictureQuality
      store.camera.shotTypes = shotTypes
      store.camera.videoQuality = videoQuality
      store.general.deviceName = deviceName
      store.general.siteName = siteName
      store.general.timeZone = timeZone
      store.triggering.light = triggeringLight
      store.triggering.threshold = threshold
      store.triggering.sleepingTime = sleepingTime
      store.triggering.wakingUpTime = wakingUpTime

      await store.uploadPersistentSettings()

      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        camera: {
          light: cameraLight,
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
          light: triggeringLight,
          sleepingTime,
          threshold,
          wakingUpTime,
        },
      })
    })

    it('uploads all camera settings', async () => {
      const light = 'infrared'
      const pictureQuality = 40
      const shotTypes: ShotType[] = ['pictures', 'videos']
      const videoQuality = 90
      const store = useSettingsStore()
      store.camera.light = light
      store.camera.pictureQuality = pictureQuality
      store.camera.shotTypes = shotTypes
      store.camera.videoQuality = videoQuality

      await store.uploadAllCameraSettings()

      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        camera: {
          light,
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
      const threshold = 1
      const sleepingTime = '18:00'
      const wakingUpTime = '08:00'
      const store = useSettingsStore()
      store.triggering.light = light
      store.triggering.threshold = threshold
      store.triggering.sleepingTime = sleepingTime
      store.triggering.wakingUpTime = wakingUpTime

      await store.uploadAllTriggerSettings()

      expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
        triggering: {
          light,
          sleepingTime,
          threshold,
          wakingUpTime,
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
      const settings: ApplicationSettings = {
        camera: {
          light: 'visible',
          pictureQuality: 40,
          shotTypes: ['pictures', 'videos'],
          videoQuality: 90,
        },
        general: {
          deviceName: 'd',
          siteName: 's',
          systemTime: new Date().toString(),
          timeZone: 't',
        },
        triggering: {
          light: 'infrared',
          sleepingTime: '18:00',
          threshold: 1,
          wakingUpTime: '08:00',
        },
      }
      const store = useSettingsStore()
      store.$state = settings

      await store.uploadAllSettings()

      expect(ApiClientService.putSettings).toHaveBeenCalledWith(settings)
    })

    afterEach(() => {
      putSettingsSpy.mockClear()
    })
  })
})
