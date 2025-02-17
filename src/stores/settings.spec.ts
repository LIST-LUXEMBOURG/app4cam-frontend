/**
 * Copyright (C) 2022-2024  Luxembourg Institute of Science and Technology
 *
 * App4Cam is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * App4Cam is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with App4Cam.  If not, see <https://www.gnu.org/licenses/>.
 */
import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { useSettingsStore } from './settings'
import { ApplicationSettings, PersistentSettings, ShotType } from 'src/settings'

vi.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

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
          focusMaximum: 1000,
          focusMinimum: 0,
          isLightEnabled: true,
          isPictureQualityEnabled: true,
          isShotTypesEnabled: true,
          light: 'visible',
          pictureQuality: 60,
          shotTypes: ['pictures', 'videos'],
          videoQuality: 90,
        },
        general: {
          deviceName: 'n',
          latitude: 1,
          locationAccuracy: 3,
          longitude: 2,
          password: '123',
          siteName: 's',
          systemTime: new Date().toISOString(),
          timeZone: 't',
        },
        triggering: {
          isLightEnabled: true,
          isTemperatureThresholdEnabled: true,
          light: 'visible',
          sleepingTime: { hour: 18, minute: 0 },
          temperatureThreshold: 7,
          threshold: 0,
          thresholdMaximum: 1,
          useSunriseAndSunsetTimes: false,
          wakingUpTime: { hour: 8, minute: 0 },
        },
      }
      const getSettingsSpy = vi
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
            latitude: 3,
            locationAccuracy: 6,
            longitude: 4,
            password: '123',
            siteName: 's',
            timeZone: 't',
          },
          triggering: {
            light: 'infrared',
            sleepingTime: { hour: 18, minute: 0 },
            temperatureThreshold: 8,
            threshold: 1,
            useSunriseAndSunsetTimes: false,
            wakingUpTime: { hour: 8, minute: 0 },
          },
        }
        const store = useSettingsStore()

        store.updatePersistentSettings(settings)

        expect(store.current.camera).toStrictEqual({
          ...settings.camera,
          focusMaximum: Number.MAX_SAFE_INTEGER,
          focusMinimum: Number.MIN_SAFE_INTEGER,
          isLightEnabled: false,
          isPictureQualityEnabled: false,
          isShotTypesEnabled: false,
        })
        expect(store.initial.camera).toStrictEqual({
          ...settings.camera,
          focusMaximum: Number.MAX_SAFE_INTEGER,
          focusMinimum: Number.MIN_SAFE_INTEGER,
          isLightEnabled: false,
          isPictureQualityEnabled: false,
          isShotTypesEnabled: false,
        })
        expect(store.current.general.deviceName).toBe(
          settings.general.deviceName,
        )
        expect(store.initial.general.deviceName).toBe(
          settings.general.deviceName,
        )
        expect(store.current.general.latitude).toBe(settings.general.latitude)
        expect(store.initial.general.latitude).toBe(settings.general.latitude)
        expect(store.current.general.locationAccuracy).toBe(
          settings.general.locationAccuracy,
        )
        expect(store.initial.general.locationAccuracy).toBe(
          settings.general.locationAccuracy,
        )
        expect(store.current.general.longitude).toBe(settings.general.longitude)
        expect(store.initial.general.longitude).toBe(settings.general.longitude)
        expect(store.current.general.siteName).toBe(settings.general.siteName)
        expect(store.initial.general.siteName).toBe(settings.general.siteName)
        expect(store.current.general.timeZone).toBe(settings.general.timeZone)
        expect(store.initial.general.timeZone).toBe(settings.general.timeZone)
        expect(store.current.triggering).toStrictEqual({
          ...settings.triggering,
          isLightEnabled: false,
          isTemperatureThresholdEnabled: false,
          thresholdMaximum: Number.MAX_SAFE_INTEGER,
        })
        expect(store.initial.triggering).toStrictEqual({
          ...settings.triggering,
          isLightEnabled: false,
          isTemperatureThresholdEnabled: false,
          thresholdMaximum: Number.MAX_SAFE_INTEGER,
          useSunriseAndSunsetTimes: false,
        })
      })
    })

    describe('when updating only part of the settings', () => {
      const patchSettingsSpy = vi
        .spyOn(ApiClientService, 'patchSettings')
        .mockResolvedValue()

      it('uploads all persistent settings and resets initial state', async () => {
        const cameraLight = 'infrared'
        const deviceName = 'd'
        const focus = 200
        const latitude = 1
        const locationAccuracy = 3
        const longitude = 2
        const password = '123'
        const pictureQuality = 40
        const threshold = 1
        const shotTypes: ShotType[] = ['pictures', 'videos']
        const siteName = 's'
        const sleepingTime = { hour: 18, minute: 0 }
        const store = useSettingsStore()
        const temperatureThreshold = 9
        const timeZone = 't'
        const useSunriseAndSunsetTimes = false
        const triggeringLight = 'infrared'
        const videoQuality = 90
        const wakingUpTime = { hour: 8, minute: 0 }
        store.current.camera.focus = focus
        store.current.camera.light = cameraLight
        store.current.camera.pictureQuality = pictureQuality
        store.current.camera.shotTypes = shotTypes
        store.current.camera.videoQuality = videoQuality
        store.current.general.deviceName = deviceName
        store.current.general.latitude = latitude
        store.current.general.locationAccuracy = locationAccuracy
        store.current.general.longitude = longitude
        store.current.general.password = password
        store.current.general.siteName = siteName
        store.current.general.timeZone = timeZone
        store.current.triggering.light = triggeringLight
        store.current.triggering.sleepingTime = sleepingTime
        store.current.triggering.temperatureThreshold = temperatureThreshold
        store.current.triggering.threshold = threshold
        store.current.triggering.useSunriseAndSunsetTimes =
          useSunriseAndSunsetTimes
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
            latitude,
            locationAccuracy,
            longitude,
            password,
            siteName,
            timeZone,
          },
          triggering: {
            light: triggeringLight,
            sleepingTime,
            temperatureThreshold,
            threshold,
            useSunriseAndSunsetTimes,
            wakingUpTime,
          },
        })
        expect(store.initial.camera.focus).toBe(focus)
        expect(store.initial.camera.light).toBe(cameraLight)
        expect(store.initial.camera.pictureQuality).toBe(pictureQuality)
        expect(store.initial.camera.shotTypes).toStrictEqual(shotTypes)
        expect(store.initial.camera.videoQuality).toBe(videoQuality)
        expect(store.initial.general.deviceName).toBe(deviceName)
        expect(store.initial.general.latitude).toBe(latitude)
        expect(store.initial.general.locationAccuracy).toBe(locationAccuracy)
        expect(store.initial.general.longitude).toBe(longitude)
        expect(store.initial.general.password).toBe(password)
        expect(store.initial.general.siteName).toBe(siteName)
        expect(store.initial.general.timeZone).toBe(timeZone)
        expect(store.initial.triggering.light).toBe(triggeringLight)
        expect(store.initial.triggering.sleepingTime).toStrictEqual(
          sleepingTime,
        )
        expect(store.initial.triggering.temperatureThreshold).toBe(
          temperatureThreshold,
        )
        expect(store.initial.triggering.threshold).toBe(threshold)
        expect(store.initial.triggering.wakingUpTime).toStrictEqual(
          wakingUpTime,
        )
      })

      it('uploads all changed camera settings and resets initial state', async () => {
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
        expect(store.initial.camera.focus).toBe(focus)
        expect(store.initial.camera.light).toBe(light)
        expect(store.initial.camera.pictureQuality).toBe(pictureQuality)
        expect(store.initial.camera.shotTypes).toStrictEqual(shotTypes)
        expect(store.initial.camera.videoQuality).toBe(videoQuality)
      })

      it('uploads no empty camera settings', async () => {
        const store = useSettingsStore()
        await store.uploadChangedCameraSettings()

        expect(ApiClientService.patchSettings).not.toHaveBeenCalled()
      })

      it('uploads all changed general settings and resets initial state', async () => {
        const deviceName = 'd'
        const latitude = 1
        const locationAccuracy = 2
        const longitude = 3
        const password = '123'
        const siteName = 's'
        const systemTime = new Date().toString()
        const timeZone = 't'
        const store = useSettingsStore()
        store.current.general.deviceName = deviceName
        store.current.general.latitude = latitude
        store.current.general.locationAccuracy = locationAccuracy
        store.current.general.longitude = longitude
        store.current.general.password = password
        store.current.general.siteName = siteName
        store.current.general.systemTime = systemTime
        store.current.general.timeZone = timeZone

        await store.uploadChangedGeneralSettings()

        expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
          general: {
            deviceName,
            latitude,
            locationAccuracy,
            longitude,
            password,
            siteName,
            systemTime,
            timeZone,
          },
        })
        expect(store.initial.general.deviceName).toBe(deviceName)
        expect(store.initial.general.latitude).toBe(latitude)
        expect(store.initial.general.locationAccuracy).toBe(locationAccuracy)
        expect(store.initial.general.longitude).toBe(longitude)
        expect(store.initial.general.password).toBe(password)
        expect(store.initial.general.siteName).toBe(siteName)
        expect(store.initial.general.systemTime).toBe(systemTime)
        expect(store.initial.general.timeZone).toBe(timeZone)
      })

      it('uploads no empty general settings', async () => {
        const store = useSettingsStore()
        await store.uploadChangedGeneralSettings()

        expect(ApiClientService.patchSettings).not.toHaveBeenCalled()
      })

      it('uploads all changed trigger settings and resets initial state', async () => {
        const light = 'visible'
        const temperatureThreshold = 9
        const sleepingTime = { hour: 18, minute: 0 }
        const threshold = 2
        const wakingUpTime = { hour: 8, minute: 0 }
        const store = useSettingsStore()
        store.current.triggering.light = light
        store.current.triggering.sleepingTime = sleepingTime
        store.current.triggering.temperatureThreshold = temperatureThreshold
        store.current.triggering.threshold = threshold
        store.current.triggering.wakingUpTime = wakingUpTime

        await store.uploadChangedTriggerSettings()

        expect(ApiClientService.patchSettings).toHaveBeenCalledWith({
          triggering: {
            light,
            sleepingTime,
            temperatureThreshold,
            threshold,
            wakingUpTime,
          },
        })
        expect(store.initial.triggering.light).toBe(light)
        expect(store.initial.triggering.sleepingTime).toStrictEqual(
          sleepingTime,
        )
        expect(store.initial.triggering.temperatureThreshold).toBe(
          temperatureThreshold,
        )
        expect(store.initial.triggering.threshold).toBe(threshold)
        expect(store.initial.triggering.wakingUpTime).toStrictEqual(
          wakingUpTime,
        )
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
