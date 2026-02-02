/**
 * Copyright (C) 2022-2026 Luxembourg Institute of Science and Technology
 *
 * App4Cam is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * App4Cam is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with App4Cam.  If not, see <https://www.gnu.org/licenses/>.
 */

import { LightType } from 'src/settings'

type CurrentLightType = LightType | 'unsupported'

export interface BatteryVoltageResponse {
  batteryVoltage: number
}

export interface CameraConnectionStatus {
  isCameraConnected: boolean | null
}

export interface DeviceIdResponse {
  deviceId: string
}

export interface DeviceNameResponse {
  deviceName: string
}

export interface FileDownloadResponse {
  contentType: string | undefined
  data: string
  filename: string
}

export type FilesDeletedResponse = Record<string, boolean>

export interface LightTypeResponse {
  lightType: CurrentLightType
}

export interface SiteNameResponse {
  siteName?: string
}

export interface SystemTimeResponse {
  systemTime: string
}

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

export interface SunriseAndSunsetResponse {
  sunrise: {
    hour: number
    minute: number
  }
  sunset: {
    hour: number
    minute: number
  }
}

export interface UpgradeFileCheckResult {
  isOkay: boolean
  message: string
}

export interface UpgradeStatus {
  inProgress: boolean
}
