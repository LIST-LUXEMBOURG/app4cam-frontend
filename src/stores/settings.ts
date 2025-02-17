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
const PLACEHOLDER_SETTINGS: ApplicationSettings = {
  camera: {
    focus: 200,
    focusMaximum: Number.MAX_SAFE_INTEGER,
    focusMinimum: Number.MIN_SAFE_INTEGER,
    isLightEnabled: false,
    isPictureQualityEnabled: false,
    isShotTypesEnabled: false,
    light: 'visible',
    pictureQuality: 80,
    shotTypes: [],
    videoQuality: 80,
  },
  general: {
    deviceName: '',
    latitude: null,
    locationAccuracy: null,
    longitude: null,
    password: '0123456789',
    siteName: '',
    systemTime: new Date().toISOString(),
    timeZone: '',
  },
  triggering: {
    isLightEnabled: false,
    isTemperatureThresholdEnabled: false,
    light: 'infrared',
    sleepingTime: null,
    temperatureThreshold: 0,
    threshold: TRIGGER_THRESHOLD_MINIMUM,
    thresholdMaximum: Number.MAX_SAFE_INTEGER,
    useSunriseAndSunsetTimes: false,
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
          latitude: this.current.general.latitude,
          locationAccuracy: this.current.general.locationAccuracy,
          longitude: this.current.general.longitude,
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
        this.current.camera.isPictureQualityEnabled =
          settings.camera.isPictureQualityEnabled
        this.initial.camera.isPictureQualityEnabled =
          settings.camera.isPictureQualityEnabled
        this.current.camera.isShotTypesEnabled =
          settings.camera.isShotTypesEnabled
        this.initial.camera.isShotTypesEnabled =
          settings.camera.isShotTypesEnabled
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
        this.current.general.latitude = settings.general.latitude
        this.initial.general.latitude = settings.general.latitude
        this.current.general.locationAccuracy =
          settings.general.locationAccuracy
        this.initial.general.locationAccuracy =
          settings.general.locationAccuracy
        this.current.general.longitude = settings.general.longitude
        this.initial.general.longitude = settings.general.longitude
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
        this.current.triggering.isTemperatureThresholdEnabled =
          settings.triggering.isTemperatureThresholdEnabled
        this.initial.triggering.isTemperatureThresholdEnabled =
          settings.triggering.isTemperatureThresholdEnabled
        this.current.triggering.light = settings.triggering.light
        this.initial.triggering.light = settings.triggering.light
        this.current.triggering.sleepingTime = settings.triggering.sleepingTime
        this.initial.triggering.sleepingTime = settings.triggering.sleepingTime
        this.current.triggering.temperatureThreshold =
          settings.triggering.temperatureThreshold
        this.initial.triggering.temperatureThreshold =
          settings.triggering.temperatureThreshold
        this.current.triggering.threshold = settings.triggering.threshold
        this.initial.triggering.threshold = settings.triggering.threshold
        this.current.triggering.thresholdMaximum =
          settings.triggering.thresholdMaximum
        this.initial.triggering.thresholdMaximum =
          settings.triggering.thresholdMaximum
        this.current.triggering.useSunriseAndSunsetTimes =
          settings.triggering.useSunriseAndSunsetTimes
        this.initial.triggering.useSunriseAndSunsetTimes =
          settings.triggering.useSunriseAndSunsetTimes
        this.current.triggering.wakingUpTime = settings.triggering.wakingUpTime
        this.initial.triggering.wakingUpTime = settings.triggering.wakingUpTime
      })
    },

    updateInitialCameraSettingsWithCurrentOnes() {
      this.initial.camera.focus = this.current.camera.focus
      this.initial.camera.light = this.current.camera.light
      this.initial.camera.pictureQuality = this.current.camera.pictureQuality
      this.initial.camera.shotTypes = this.current.camera.shotTypes
      this.initial.camera.videoQuality = this.current.camera.videoQuality
    },

    updateInitialGeneralSettingsWithCurrentOnes() {
      this.initial.general.deviceName = this.current.general.deviceName
      this.initial.general.latitude = this.current.general.latitude
      this.initial.general.locationAccuracy =
        this.current.general.locationAccuracy
      this.initial.general.longitude = this.current.general.longitude
      this.initial.general.password = this.current.general.password
      this.initial.general.siteName = this.current.general.siteName
      this.initial.general.systemTime = this.current.general.systemTime
      this.initial.general.timeZone = this.current.general.timeZone
    },

    updateInitialTriggeringSettingsWithCurrentOnes() {
      this.initial.triggering.light = this.current.triggering.light
      this.initial.triggering.sleepingTime =
        this.current.triggering.sleepingTime
      this.initial.triggering.temperatureThreshold =
        this.current.triggering.temperatureThreshold
      this.initial.triggering.threshold = this.current.triggering.threshold
      this.initial.triggering.useSunriseAndSunsetTimes =
        this.current.triggering.useSunriseAndSunsetTimes
      this.initial.triggering.wakingUpTime =
        this.current.triggering.wakingUpTime
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
      this.current.general.latitude = settings.general.latitude
      this.initial.general.latitude = settings.general.latitude
      this.current.general.locationAccuracy = settings.general.locationAccuracy
      this.initial.general.locationAccuracy = settings.general.locationAccuracy
      this.current.general.longitude = settings.general.longitude
      this.initial.general.longitude = settings.general.longitude
      this.current.general.password = settings.general.password
      this.initial.general.password = settings.general.password
      this.current.general.siteName = settings.general.siteName
      this.initial.general.siteName = settings.general.siteName
      this.current.general.timeZone = settings.general.timeZone
      this.initial.general.timeZone = settings.general.timeZone

      this.current.triggering.light = settings.triggering.light
      this.initial.triggering.light = settings.triggering.light
      this.current.triggering.wakingUpTime = settings.triggering.wakingUpTime
      this.initial.triggering.wakingUpTime = settings.triggering.wakingUpTime
      this.current.triggering.temperatureThreshold =
        settings.triggering.temperatureThreshold
      this.initial.triggering.temperatureThreshold =
        settings.triggering.temperatureThreshold
      this.current.triggering.threshold = settings.triggering.threshold
      this.initial.triggering.threshold = settings.triggering.threshold
      this.current.triggering.useSunriseAndSunsetTimes =
        settings.triggering.useSunriseAndSunsetTimes
      this.initial.triggering.useSunriseAndSunsetTimes =
        settings.triggering.useSunriseAndSunsetTimes
      this.current.triggering.sleepingTime = settings.triggering.sleepingTime
      this.initial.triggering.sleepingTime = settings.triggering.sleepingTime
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
          latitude: this.current.general.latitude,
          locationAccuracy: this.current.general.locationAccuracy,
          longitude: this.current.general.longitude,
          password: this.current.general.password,
          siteName: this.current.general.siteName,
          timeZone: this.current.general.timeZone,
        },
        triggering: {
          light: this.current.triggering.light,
          sleepingTime: this.current.triggering.sleepingTime,
          temperatureThreshold: this.current.triggering.temperatureThreshold,
          threshold: this.current.triggering.threshold,
          useSunriseAndSunsetTimes:
            this.current.triggering.useSunriseAndSunsetTimes,
          wakingUpTime: this.current.triggering.wakingUpTime,
        },
      }
      return ApiClientService.patchSettings(settings)
        .then(this.updateInitialCameraSettingsWithCurrentOnes)
        .then(this.updateInitialGeneralSettingsWithCurrentOnes)
        .then(this.updateInitialTriggeringSettingsWithCurrentOnes)
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
      return ApiClientService.patchSettings({ camera: settings }).then(
        this.updateInitialCameraSettingsWithCurrentOnes,
      )
    },

    uploadChangedGeneralSettings(): Promise<void> {
      const settings: Partial<GeneralSettings> & { systemTime?: string } = {}
      if (this.current.general.deviceName !== this.initial.general.deviceName) {
        settings.deviceName = this.current.general.deviceName
      }
      if (this.current.general.latitude !== this.initial.general.latitude) {
        settings.latitude = this.current.general.latitude
      }
      if (
        this.current.general.locationAccuracy !==
        this.initial.general.locationAccuracy
      ) {
        settings.locationAccuracy = this.current.general.locationAccuracy
      }
      if (this.current.general.longitude !== this.initial.general.longitude) {
        settings.longitude = this.current.general.longitude
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
      return ApiClientService.patchSettings({ general: settings }).then(
        this.updateInitialGeneralSettingsWithCurrentOnes,
      )
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
        this.current.triggering.temperatureThreshold !==
        this.initial.triggering.temperatureThreshold
      ) {
        settings.temperatureThreshold =
          this.current.triggering.temperatureThreshold
      }
      if (
        this.current.triggering.threshold !== this.initial.triggering.threshold
      ) {
        settings.threshold = this.current.triggering.threshold
      }
      if (
        this.current.triggering.useSunriseAndSunsetTimes !==
        this.initial.triggering.useSunriseAndSunsetTimes
      ) {
        settings.useSunriseAndSunsetTimes =
          this.current.triggering.useSunriseAndSunsetTimes
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
      return ApiClientService.patchSettings({ triggering: settings }).then(
        this.updateInitialTriggeringSettingsWithCurrentOnes,
      )
    },
  },
})
