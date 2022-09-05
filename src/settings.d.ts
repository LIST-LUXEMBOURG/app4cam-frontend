export type ShotType = 'pictures' | 'videos'

export interface ApplicationSettings {
  deviceName: string
  shotTypes: ShotType[]
  siteName: string
  timeZone: string
}

interface SystemTime {
  systemTime: Date
}

interface SystemTimeDto {
  systemTime: string
}

export type Settings = ApplicationSettings & SystemTime

export type SettingsDto = ApplicationSettings & SystemTimeDto
