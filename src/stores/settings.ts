// © 2022-2023 Luxembourg Institute of Science and Technology
import { defineStore } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import {
  ApplicationSettings,
  CameraSettings,
  GeneralSettings,
  PersistentSettings,
  TriggerSettings,
} from '../settings'

interface State {
  current: ApplicationSettings
  initial: ApplicationSettings
}

export const TRIGGER_THRESHOLD_MINIMUM = 1
export const TRIGGER_THRESHOLD_MAXIMUM = 2147483647
const PLACEHOLDER_SETTINGS: ApplicationSettings = {
  camera: {
    focus: 200,
    focusMaximum: Number.MAX_SAFE_INTEGER,
    focusMinimum: Number.MIN_SAFE_INTEGER,
    isLightEnabled: false,
    light: 'visible',
    pictureQuality: 80,
    shotTypes: [],
    videoQuality: 80,
  },
  general: {
    deviceName: '',
    password: '0123456789',
    siteName: '',
    systemTime: new Date().toISOString(),
    timeZone: '',
  },
  triggering: {
    isLightEnabled: false,
    light: 'infrared',
    threshold: TRIGGER_THRESHOLD_MINIMUM,
    sleepingTime: null,
    wakingUpTime: null,
  },
}

const deepClone = (obj: object) => JSON.parse(JSON.stringify(obj))
const isEmpty = (obj: object) => Object.keys(obj).length === 0

export const useSettingsStore = defineStore('settings', {
  state: (): State => ({
    current: deepClone(PLACEHOLDER_SETTINGS),
    initial: deepClone(PLACEHOLDER_SETTINGS),
  }),

  getters: {
    persistentSettings(): PersistentSettings {
      return {
        camera: { ...this.current.camera },
        general: {
          deviceName: this.current.general.deviceName,
          password: this.current.general.password,
          siteName: this.current.general.siteName,
          timeZone: this.current.general.timeZone,
        },
        triggering: { ...this.current.triggering },
      }
    },
  },

  actions: {
    fetchSettings(): Promise<void> {
      return ApiClientService.getSettings().then((settings) => {
        this.current.camera.focus = settings.camera.focus
        this.initial.camera.focus = settings.camera.focus
        this.current.camera.focusMaximum = settings.camera.focusMaximum
        this.initial.camera.focusMaximum = settings.camera.focusMaximum
        this.current.camera.focusMinimum = settings.camera.focusMinimum
        this.initial.camera.focusMinimum = settings.camera.focusMinimum
        this.current.camera.isLightEnabled = settings.camera.isLightEnabled
        this.initial.camera.isLightEnabled = settings.camera.isLightEnabled
        this.current.camera.light = settings.camera.light
        this.initial.camera.light = settings.camera.light
        this.current.camera.pictureQuality = settings.camera.pictureQuality
        this.initial.camera.pictureQuality = settings.camera.pictureQuality
        this.current.camera.shotTypes = settings.camera.shotTypes
        this.initial.camera.shotTypes = settings.camera.shotTypes
        this.current.camera.videoQuality = settings.camera.videoQuality
        this.initial.camera.videoQuality = settings.camera.videoQuality

        this.current.general.deviceName = settings.general.deviceName
        this.initial.general.deviceName = settings.general.deviceName
        this.current.general.password = settings.general.password
        this.initial.general.password = settings.general.password
        this.current.general.siteName = settings.general.siteName
        this.initial.general.siteName = settings.general.siteName
        this.current.general.systemTime = settings.general.systemTime
        this.initial.general.systemTime = settings.general.systemTime
        this.current.general.timeZone = settings.general.timeZone
        this.initial.general.timeZone = settings.general.timeZone

        this.current.triggering.isLightEnabled =
          settings.triggering.isLightEnabled
        this.initial.triggering.isLightEnabled =
          settings.triggering.isLightEnabled
        this.current.triggering.light = settings.triggering.light
        this.initial.triggering.light = settings.triggering.light
        this.current.triggering.threshold = settings.triggering.threshold
        this.initial.triggering.threshold = settings.triggering.threshold
        this.current.triggering.sleepingTime = settings.triggering.sleepingTime
        this.initial.triggering.sleepingTime = settings.triggering.sleepingTime
        this.current.triggering.wakingUpTime = settings.triggering.wakingUpTime
        this.initial.triggering.wakingUpTime = settings.triggering.wakingUpTime
      })
    },

    updatePersistentSettings(settings: PersistentSettings): void {
      this.current.camera.focus = settings.camera.focus
      this.initial.camera.focus = settings.camera.focus
      this.current.camera.light = settings.camera.light
      this.initial.camera.light = settings.camera.light
      this.current.camera.pictureQuality = settings.camera.pictureQuality
      this.initial.camera.pictureQuality = settings.camera.pictureQuality
      this.current.camera.shotTypes = settings.camera.shotTypes
      this.initial.camera.shotTypes = settings.camera.shotTypes
      this.current.camera.videoQuality = settings.camera.videoQuality
      this.initial.camera.videoQuality = settings.camera.videoQuality

      this.current.general.deviceName = settings.general.deviceName
      this.initial.general.deviceName = settings.general.deviceName
      this.current.general.password = settings.general.password
      this.initial.general.password = settings.general.password
      this.current.general.siteName = settings.general.siteName
      this.initial.general.siteName = settings.general.siteName
      this.current.general.timeZone = settings.general.timeZone
      this.initial.general.timeZone = settings.general.timeZone

      this.current.triggering.light = settings.triggering.light
      this.initial.triggering.light = settings.triggering.light
      this.current.triggering.threshold = settings.triggering.threshold
      this.initial.triggering.threshold = settings.triggering.threshold
      this.current.triggering.sleepingTime = settings.triggering.sleepingTime
      this.initial.triggering.sleepingTime = settings.triggering.sleepingTime
      this.current.triggering.wakingUpTime = settings.triggering.wakingUpTime
      this.initial.triggering.wakingUpTime = settings.triggering.wakingUpTime
    },

    uploadPersistentSettings(): Promise<void> {
      const settings: PersistentSettings = {
        camera: {
          focus: this.current.camera.focus,
          light: this.current.camera.light,
          pictureQuality: this.current.camera.pictureQuality,
          shotTypes: this.current.camera.shotTypes,
          videoQuality: this.current.camera.videoQuality,
        },
        general: {
          deviceName: this.current.general.deviceName,
          password: this.current.general.password,
          siteName: this.current.general.siteName,
          timeZone: this.current.general.timeZone,
        },
        triggering: {
          light: this.current.triggering.light,
          sleepingTime: this.current.triggering.sleepingTime,
          threshold: this.current.triggering.threshold,
          wakingUpTime: this.current.triggering.wakingUpTime,
        },
      }
      return ApiClientService.patchSettings(settings)
    },

    uploadChangedCameraSettings(): Promise<void> {
      const settings: Partial<CameraSettings> = {}
      if (this.current.camera.focus !== this.initial.camera.focus) {
        settings.focus = this.current.camera.focus
      }
      if (this.current.camera.light !== this.initial.camera.light) {
        settings.light = this.current.camera.light
      }
      if (
        this.current.camera.shotTypes.toString() !==
        this.initial.camera.shotTypes.toString()
      ) {
        settings.shotTypes = this.current.camera.shotTypes
      }
      if (
        this.current.camera.pictureQuality !==
        this.initial.camera.pictureQuality
      ) {
        settings.pictureQuality = this.current.camera.pictureQuality
      }
      if (
        this.current.camera.videoQuality !== this.initial.camera.videoQuality
      ) {
        settings.videoQuality = this.current.camera.videoQuality
      }
      if (isEmpty(settings)) {
        return Promise.resolve()
      }
      return ApiClientService.patchSettings({ camera: settings })
    },

    uploadChangedGeneralSettings(): Promise<void> {
      const settings: Partial<GeneralSettings> & { systemTime?: string } = {}
      if (this.current.general.deviceName !== this.initial.general.deviceName) {
        settings.deviceName = this.current.general.deviceName
      }
      if (this.current.general.password !== this.initial.general.password) {
        settings.password = this.current.general.password
      }
      if (this.current.general.siteName !== this.initial.general.siteName) {
        settings.siteName = this.current.general.siteName
      }
      if (this.current.general.systemTime !== this.initial.general.systemTime) {
        settings.systemTime = this.current.general.systemTime
      }
      if (this.current.general.timeZone !== this.initial.general.timeZone) {
        settings.timeZone = this.current.general.timeZone
      }
      if (isEmpty(settings)) {
        return Promise.resolve()
      }
      return ApiClientService.patchSettings({ general: settings })
    },

    uploadChangedTriggerSettings(): Promise<void> {
      const settings: Partial<TriggerSettings> = {}
      if (this.current.triggering.light !== this.initial.triggering.light) {
        settings.light = this.current.triggering.light
      }
      if (
        JSON.stringify(this.current.triggering.sleepingTime) !==
        JSON.stringify(this.initial.triggering.sleepingTime)
      ) {
        settings.sleepingTime = this.current.triggering.sleepingTime
      }
      if (
        this.current.triggering.threshold !== this.initial.triggering.threshold
      ) {
        settings.threshold = this.current.triggering.threshold
      }
      if (
        JSON.stringify(this.current.triggering.wakingUpTime) !==
        JSON.stringify(this.initial.triggering.wakingUpTime)
      ) {
        settings.wakingUpTime = this.current.triggering.wakingUpTime
      }
      if (isEmpty(settings)) {
        return Promise.resolve()
      }
      return ApiClientService.patchSettings({ triggering: settings })
    },
  },
})
