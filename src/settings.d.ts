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

type Settings = DeviceId & SiteName & SystemTime

type SettingsDto = DeviceId & SiteName & SystemTimeDto
