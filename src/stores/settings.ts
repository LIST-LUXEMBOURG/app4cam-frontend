import { defineStore } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { ApplicationSettings, PersistentSettings } from '../settings'

type State = ApplicationSettings

export const TRIGGER_SENSITIVITY_MINIMUM = 0.01
export const TRIGGER_SENSITIVITY_MAXIMUM = 10

export const useSettingsStore = defineStore('settings', {
  state: (): State => ({
    camera: {
      shotTypes: [],
    },
    general: {
      deviceName: '',
      siteName: '',
      systemTime: new Date().toISOString(),
      timeZone: '',
    },
    triggering: {
      sensitivity: TRIGGER_SENSITIVITY_MINIMUM,
    },
  }),

  actions: {
    fetchSettings(): Promise<void> {
      return ApiClientService.getSettings().then((settings) => {
        this.camera.shotTypes = settings.camera.shotTypes
        this.general.deviceName = settings.general.deviceName
        this.general.siteName = settings.general.siteName
        this.general.systemTime = settings.general.systemTime
        this.general.timeZone = settings.general.timeZone
        this.triggering.sensitivity = settings.triggering.sensitivity
      })
    },

    getPersistentSettings(): PersistentSettings {
      return {
        camera: {
          shotTypes: this.camera.shotTypes,
        },
        general: {
          deviceName: this.general.deviceName,
          siteName: this.general.siteName,
          timeZone: this.general.timeZone,
        },
        triggering: {
          sensitivity: this.triggering.sensitivity,
        },
      }
    },

    updatePersistentSettings(settings: PersistentSettings): void {
      this.camera.shotTypes = settings.camera.shotTypes
      this.general.deviceName = settings.general.deviceName
      this.general.siteName = settings.general.siteName
      this.general.timeZone = settings.general.timeZone
      this.triggering.sensitivity = settings.triggering.sensitivity
    },

    uploadPersistentSettings(): Promise<void> {
      const settings: PersistentSettings = {
        camera: {
          shotTypes: this.camera.shotTypes,
        },
        general: {
          deviceName: this.general.deviceName,
          siteName: this.general.siteName,
          timeZone: this.general.timeZone,
        },
        triggering: {
          sensitivity: this.triggering.sensitivity,
        },
      }
      return ApiClientService.patchSettings(settings)
    },

    uploadAllCameraSettings(): Promise<void> {
      const settings: Omit<ApplicationSettings, 'general' | 'triggering'> = {
        camera: {
          shotTypes: this.camera.shotTypes,
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
          sensitivity: this.triggering.sensitivity,
        },
      }
      return ApiClientService.patchSettings(settings)
    },

    uploadAllSettings(): Promise<void> {
      const settings: ApplicationSettings = {
        camera: {
          shotTypes: this.camera.shotTypes,
        },
        general: {
          deviceName: this.general.deviceName,
          siteName: this.general.siteName,
          systemTime: this.general.systemTime,
          timeZone: this.general.timeZone,
        },
        triggering: {
          sensitivity: this.triggering.sensitivity,
        },
      }
      return ApiClientService.putSettings(settings)
    },
  },
})
