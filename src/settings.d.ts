interface ApplicationSettings {
  deviceId: string
  siteName: string
  timeZone: string
}

interface SystemTime {
  systemTime: Date
}

interface SystemTimeDto {
  systemTime: string
}

type Settings = ApplicationSettings & SystemTime

type SettingsDto = ApplicationSettings & SystemTimeDto
