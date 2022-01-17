interface DeviceId {
  deviceId: string
}

interface SiteName {
  siteName: string
}

type Settings = DeviceId & SiteName
