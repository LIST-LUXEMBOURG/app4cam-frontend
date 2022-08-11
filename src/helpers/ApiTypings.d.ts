export interface FileDownloadResponse {
  contentType: string
  data: string
  filename: string
}

export interface FilesDeletedResponse {
  [filename: string]: boolean
}

export interface DiskSpaceUsageResponse {
  capacityKb: number
  usedPercentage: number
}

export interface AvailableTimeZones {
  timeZones: string[]
}

export interface VersionResponse {
  commitHash: string
  version: string
}
