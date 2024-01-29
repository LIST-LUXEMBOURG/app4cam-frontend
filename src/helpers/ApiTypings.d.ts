export interface BatteryVoltageResponse {
  batteryVoltage: number
}

export interface DeviceIdResponse {
  deviceId: string
}

export interface FileDownloadResponse {
  contentType: string | undefined
  data: string
  filename: string
}

export type FilesDeletedResponse = Record<string, boolean>

export interface StorageResponse {
  status: StorageStatusResponse
  usage: {
    capacityKb: number
    usedPercentage: number
  }
}

export interface StorageStatusResponse {
  isAvailable: boolean
  message: string
}

export interface AvailableTimeZones {
  timeZones: string[]
}

export interface VersionResponse {
  commitHash: string
  version: string
}
