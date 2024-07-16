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
export type LightType = 'infrared' | 'visible'
export type ShotType = 'pictures' | 'videos'

interface TriggeringTime {
  hour: number
  minute: number
}

interface GeneralSettings {
  deviceName: string
  latitude: number | null
  locationAccuracy: number | null
  longitude: number | null
  password: string
  siteName: string
  timeZone: string
}

interface CameraSettings {
  focus: number
  light: LightType
  pictureQuality: number
  shotTypes: ShotType[]
  videoQuality: number
}

interface TriggerSettings {
  light: LightType
  sleepingTime: TriggeringTime | null
  temperatureThreshold: number
  threshold: number
  wakingUpTime: TriggeringTime | null
}

export interface PersistentSettings {
  camera: CameraSettings
  general: GeneralSettings
  triggering: TriggerSettings
}

export type ApplicationSettingsWithoutFlags = PersistentSettings & {
  general: {
    systemTime: string
  }
}

export type ApplicationSettings = ApplicationSettingsWithoutFlags & {
  camera: {
    focusMaximum: number
    focusMinimum: number
    isLightEnabled: boolean
  }
  triggering: {
    isLightEnabled: boolean
    isTemperatureThresholdEnabled: boolean
    thresholdMaximum: number
  }
}
