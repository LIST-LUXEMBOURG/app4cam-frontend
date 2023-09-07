import { defineStore } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { ApplicationSettings, PersistentSettings } from '../settings'

type State = ApplicationSettings

export const TRIGGER_THRESHOLD_MINIMUM = 1
export const TRIGGER_THRESHOLD_MAXIMUM = 2147483647

export const useSettingsStore = defineStore('settings', {
  state: (): State => ({
    camera: {
      pictureQuality: 80,
      shotTypes: [],
      videoQuality: 80,
    },
    general: {
      deviceName: '',
      siteName: '',
      systemTime: new Date().toISOString(),
      timeZone: '',
    },
    triggering: {
      light: 'infrared',
      threshold: TRIGGER_THRESHOLD_MINIMUM,
      sleepingTime: '',
      wakingUpTime: '',
    },
  }),

  actions: {
    fetchSettings(): Promise<void> {
      return ApiClientService.getSettings().then((settings) => {
        this.camera.pictureQuality = settings.camera.pictureQuality
        this.camera.shotTypes = settings.camera.shotTypes
        this.camera.videoQuality = settings.camera.videoQuality
        this.general.deviceName = settings.general.deviceName
        this.general.siteName = settings.general.siteName
        this.general.systemTime = settings.general.systemTime
        this.general.timeZone = settings.general.timeZone
        this.triggering.light = settings.triggering.light
        this.triggering.threshold = settings.triggering.threshold
        this.triggering.sleepingTime = settings.triggering.sleepingTime
        this.triggering.wakingUpTime = settings.triggering.wakingUpTime
      })
    },

    getPersistentSettings(): PersistentSettings {
      return {
        camera: {
          pictureQuality: this.camera.pictureQuality,
          shotTypes: this.camera.shotTypes,
          videoQuality: this.camera.videoQuality,
        },
        general: {
          deviceName: this.general.deviceName,
          siteName: this.general.siteName,
          timeZone: this.general.timeZone,
        },
        triggering: {
          light: this.triggering.light,
          threshold: this.triggering.threshold,
          sleepingTime: this.triggering.sleepingTime,
          wakingUpTime: this.triggering.wakingUpTime,
        },
      }
    },

    updatePersistentSettings(settings: PersistentSettings): void {
      this.camera.pictureQuality = settings.camera.pictureQuality
      this.camera.shotTypes = settings.camera.shotTypes
      this.camera.videoQuality = settings.camera.videoQuality
      this.general.deviceName = settings.general.deviceName
      this.general.siteName = settings.general.siteName
      this.general.timeZone = settings.general.timeZone
      this.triggering.light = settings.triggering.light
      this.triggering.threshold = settings.triggering.threshold
      this.triggering.sleepingTime = settings.triggering.sleepingTime
      this.triggering.wakingUpTime = settings.triggering.wakingUpTime
    },

    uploadPersistentSettings(): Promise<void> {
      const settings: PersistentSettings = {
        camera: {
          pictureQuality: this.camera.pictureQuality,
          shotTypes: this.camera.shotTypes,
          videoQuality: this.camera.videoQuality,
        },
        general: {
          deviceName: this.general.deviceName,
          siteName: this.general.siteName,
          timeZone: this.general.timeZone,
        },
        triggering: {
          light: this.triggering.light,
          threshold: this.triggering.threshold,
          sleepingTime: this.triggering.sleepingTime,
          wakingUpTime: this.triggering.wakingUpTime,
        },
      }
      return ApiClientService.patchSettings(settings)
    },

    uploadAllCameraSettings(): Promise<void> {
      const settings: Omit<ApplicationSettings, 'general' | 'triggering'> = {
        camera: {
          shotTypes: this.camera.shotTypes,
          pictureQuality: this.camera.pictureQuality,
          videoQuality: this.camera.videoQuality,
        },
      }
      return ApiClientService.patchSettings(settings)
    },

    uploadAllGeneralSettings(): Promise<void> {
      const settings: Omit<ApplicationSettings, 'camera' | 'triggering'> = {
        general: {
          deviceName: this.general.deviceName,
          siteName: this.general.siteName,
          systemTime: this.general.systemTime,
          timeZone: this.general.timeZone,
        },
      }
      return ApiClientService.patchSettings(settings)
    },

    uploadAllTriggerSettings(): Promise<void> {
      const settings: Omit<ApplicationSettings, 'camera' | 'general'> = {
        triggering: {
          light: this.triggering.light,
          threshold: this.triggering.threshold,
          sleepingTime: this.triggering.sleepingTime,
          wakingUpTime: this.triggering.wakingUpTime,
        },
      }
      return ApiClientService.patchSettings(settings)
    },

    uploadAllSettings(): Promise<void> {
      const settings: ApplicationSettings = {
        camera: {
          pictureQuality: this.camera.pictureQuality,
          shotTypes: this.camera.shotTypes,
          videoQuality: this.camera.videoQuality,
        },
        general: {
          deviceName: this.general.deviceName,
          siteName: this.general.siteName,
          systemTime: this.general.systemTime,
          timeZone: this.general.timeZone,
        },
        triggering: {
          light: this.triggering.light,
          threshold: this.triggering.threshold,
          sleepingTime: this.triggering.sleepingTime,
          wakingUpTime: this.triggering.wakingUpTime,
        },
      }
      return ApiClientService.putSettings(settings)
    },
  },
})
