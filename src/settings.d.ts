export interface ApplicationSettings {
  deviceName: string
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
