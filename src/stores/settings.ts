import { defineStore } from 'pinia'
import ApiClientService from '../services/ApiClientService'

type State = Settings

export const useSettingsStore = defineStore('settings', {
  state: (): State => ({
    deviceId: '',
    siteName: '',
    systemTime: new Date(),
  }),

  actions: {
    fetchSettings() {
      return ApiClientService.getSettings().then((settings) => {
        this.deviceId = settings.deviceId
        this.siteName = settings.siteName
        this.systemTime = new Date(settings.systemTime)
      })
    },

    patchSettings(settings: Settings): Promise<void> {
      const settingsToUpdate: Partial<SettingsDto> = {}
      if (this.deviceId !== settings.deviceId) {
        settingsToUpdate.deviceId = settings.deviceId
      }
      if (this.siteName !== settings.siteName) {
        settingsToUpdate.siteName = settings.siteName
      }
      if (this.systemTime !== settings.systemTime) {
        settingsToUpdate.systemTime = settings.systemTime.toISOString()
      }
      if (Object.keys(settingsToUpdate).length === 0) {
        return Promise.resolve()
      }
      return ApiClientService.patchSettings(settingsToUpdate).then(() => {
        if (this.deviceId !== settings.deviceId) {
          this.deviceId = settings.deviceId
        }
        if (this.siteName !== settings.siteName) {
          this.siteName = settings.siteName
        }
        if (this.systemTime !== settings.systemTime) {
          this.systemTime = new Date(settings.systemTime)
        }
      })
    },

    putSettings(settings: ApplicationSettings): Promise<void> {
      if (Object.keys(settings).length === 0) {
        return Promise.resolve()
      }
      return ApiClientService.putSettings(settings).then(() => {
        if (this.deviceId !== settings.deviceId) {
          this.deviceId = settings.deviceId
        }
        if (this.siteName !== settings.siteName) {
          this.siteName = settings.siteName
        }
      })
    },
  },
})
