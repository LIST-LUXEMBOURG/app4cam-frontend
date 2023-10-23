export type LightType = 'infrared' | 'visible'
export type ShotType = 'pictures' | 'videos'

interface GeneralSettings {
  deviceName: string
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
  sleepingTime: string
  threshold: number
  wakingUpTime: string
}

export interface PersistentSettings {
  camera: CameraSettings
  general: GeneralSettings
  triggering: TriggerSettings
}

export type ApplicationSettings = PersistentSettings & {
  general: {
    systemTime: string
  }
}
