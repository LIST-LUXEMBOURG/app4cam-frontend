interface DeviceId {
  deviceId: string
}

interface SiteName {
  siteName: string
}

interface SystemTime {
  systemTime: Date
}

interface SystemTimeDto {
  systemTime: string
}

type ApplicationSettings = DeviceId & SiteName

type Settings = ApplicationSettings & SystemTime

type SettingsDto = ApplicationSettings & SystemTimeDto
