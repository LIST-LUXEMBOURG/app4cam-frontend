import { defineStore } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { ApplicationSettings, Settings, SettingsDto } from '../settings'

type State = Settings

export const useSettingsStore = defineStore('settings', {
  state: (): State => ({
    deviceName: '',
    siteName: '',
    systemTime: new Date(),
    timeZone: '',
  }),

  actions: {
    fetchSettings() {
      return ApiClientService.getSettings().then((settings) => {
        this.deviceName = settings.deviceName
        this.siteName = settings.siteName
        this.systemTime = new Date(settings.systemTime)
        this.timeZone = settings.timeZone
      })
    },

    patchSettings(settings: Settings): Promise<void> {
      const settingsToUpdate: Partial<SettingsDto> = {}
      if (this.deviceName !== settings.deviceName) {
        settingsToUpdate.deviceName = settings.deviceName
      }
      if (this.siteName !== settings.siteName) {
        settingsToUpdate.siteName = settings.siteName
      }
      if (this.systemTime !== settings.systemTime) {
        settingsToUpdate.systemTime = settings.systemTime.toISOString()
      }
      if (this.timeZone !== settings.timeZone) {
        settingsToUpdate.timeZone = settings.timeZone
      }
      if (Object.keys(settingsToUpdate).length === 0) {
        return Promise.resolve()
      }
      return ApiClientService.patchSettings(settingsToUpdate).then(() => {
        if (this.deviceName !== settings.deviceName) {
          this.deviceName = settings.deviceName
        }
        if (this.siteName !== settings.siteName) {
          this.siteName = settings.siteName
        }
        if (this.systemTime !== settings.systemTime) {
          this.systemTime = new Date(settings.systemTime)
        }
        if (this.timeZone !== settings.timeZone) {
          this.timeZone = settings.timeZone
        }
      })
    },

    putSettings(settings: ApplicationSettings): Promise<void> {
      if (Object.keys(settings).length === 0) {
        return Promise.resolve()
      }
      return ApiClientService.putSettings(settings).then(() => {
        if (this.deviceName !== settings.deviceName) {
          this.deviceName = settings.deviceName
        }
        if (this.siteName !== settings.siteName) {
          this.siteName = settings.siteName
        }
        if (this.timeZone !== settings.timeZone) {
          this.timeZone = settings.timeZone
        }
      })
    },
  },
})
