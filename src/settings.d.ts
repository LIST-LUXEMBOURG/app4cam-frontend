export type ShotType = 'pictures' | 'videos'

interface GeneralSettings {
  deviceName: string
  siteName: string
  timeZone: string
}

interface CameraSettings {
  shotTypes: ShotType[]
}

interface TriggerSettings {
  sensitivity: number
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
