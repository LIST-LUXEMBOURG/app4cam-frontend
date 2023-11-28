import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { useSettingsStore } from './settings'
import { ApplicationSettings, PersistentSettings, ShotType } from 'src/settings'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('settings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('getters', () => {
    describe('persistent settings', () => {
      it('does not return the non-persistent settings', () => {
        const store = useSettingsStore()
        const settings = store.persistentSettings
        expect(settings.general).not.toHaveProperty('systemTime')
      })
    })
  })

  describe('actions', () => {
    describe('fetch settings', () => {
      const settings: ApplicationSettings = {
        camera: {
          focus: 200,
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
        expect(store.$state.current).toStrictEqual(settings)
        expect(store.$state.initial).toStrictEqual(settings)
      })

      afterEach(() => {
        getSettingsSpy.mockClear()
      })
    })

    describe('update persistent settings', () => {
      it("changes persistent settings' value", () => {
        const settings: PersistentSettings = {
          camera: {
            focus: 300,
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

        expect(store.current.camera).toStrictEqual(settings.camera)
        expect(store.initial.camera).toStrictEqual(settings.camera)
        expect(store.current.general.deviceName).toBe(
          settings.general.deviceName,
        )
        expect(store.initial.general.deviceName).toBe(
          settings.general.deviceName,
        )
        expect(store.current.general.siteName).toBe(settings.general.siteName)
        expect(store.initial.general.siteName).toBe(settings.general.siteName)
        expect(store.current.general.timeZone).toBe(settings.general.timeZone)
        expect(store.initial.general.timeZone).toBe(settings.general.timeZone)
        expect(store.current.triggering).toStrictEqual(settings.triggering)
        expect(store.initial.triggering).toStrictEqual(settings.triggering)
      })
    })

    describe('when updating only part of the settings', () => {
      const patchSettingsSpy = jest
        .spyOn(ApiClientService, 'patchSettings')
        .mockResolvedValue()

      it('uploads all persistent settings', async () => {
        const cameraLight = 'infrared'
        const deviceName = 'd'
        const focus = 200
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
        store.current.camera.focus = focus
        store.current.camera.light = cameraLight
        store.current.camera.pictureQuality = pictureQuality
        store.current.camera.shotTypes = shotTypes
        store.current.camera.videoQuality = videoQuality
        store.current.general.deviceName = deviceName
        store.current.general.siteName = siteName
        store.current.general.timeZone = timeZone
        store.current.triggering.light = triggeringLight
        store.current.triggering.threshold = threshold
        store.current.triggering.sleepingTime = sleepingTime
        store.current.triggering.wakingUpTime = wakingUpTime

        await store.uploadPersistentSettings()

        expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
          camera: {
            focus,
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

      it('uploads all changed camera settings', async () => {
        const focus = 300
        const light = 'infrared'
        const pictureQuality = 40
        const shotTypes: ShotType[] = ['videos']
        const videoQuality = 90
        const store = useSettingsStore()
        store.current.camera.focus = focus
        store.current.camera.light = light
        store.current.camera.pictureQuality = pictureQuality
        store.current.camera.shotTypes = shotTypes
        store.current.camera.videoQuality = videoQuality

        await store.uploadChangedCameraSettings()

        expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
          camera: {
            focus,
            light,
            pictureQuality,
            shotTypes,
            videoQuality,
          },
        })
      })

      it('uploads no empty camera settings', async () => {
        const store = useSettingsStore()
        await store.uploadChangedCameraSettings()

        expect(ApiClientService.patchSettings).not.toHaveBeenCalled()
      })

      it('uploads all changed general settings', async () => {
        const deviceName = 'd'
        const siteName = 's'
        const store = useSettingsStore()
        const systemTime = new Date().toString()
        const timeZone = 't'
        store.current.general.deviceName = deviceName
        store.current.general.siteName = siteName
        store.current.general.systemTime = systemTime
        store.current.general.timeZone = timeZone

        await store.uploadChangedGeneralSettings()

        expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
          general: {
            deviceName,
            siteName,
            systemTime,
            timeZone,
          },
        })
      })

      it('uploads no empty general settings', async () => {
        const store = useSettingsStore()
        await store.uploadChangedGeneralSettings()

        expect(ApiClientService.patchSettings).not.toHaveBeenCalled()
      })

      it('uploads all changed trigger settings', async () => {
        const light = 'visible'
        const threshold = 2
        const sleepingTime = '18:00'
        const wakingUpTime = '08:00'
        const store = useSettingsStore()
        store.current.triggering.light = light
        store.current.triggering.threshold = threshold
        store.current.triggering.sleepingTime = sleepingTime
        store.current.triggering.wakingUpTime = wakingUpTime

        await store.uploadChangedTriggerSettings()

        expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
          triggering: {
            light,
            sleepingTime,
            threshold,
            wakingUpTime,
          },
        })
      })

      it('uploads no empty trigger settings', async () => {
        const store = useSettingsStore()
        await store.uploadChangedTriggerSettings()

        expect(ApiClientService.patchSettings).not.toHaveBeenCalled()
      })

      afterEach(() => {
        patchSettingsSpy.mockClear()
      })
    })
  })
})
