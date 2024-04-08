// © 2022-2023 Luxembourg Institute of Science and Technology
export type LightType = 'infrared' | 'visible'
export type ShotType = 'pictures' | 'videos'

interface TriggeringTime {
  hour: number
  minute: number
}

interface GeneralSettings {
  deviceName: string
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
  }
}
