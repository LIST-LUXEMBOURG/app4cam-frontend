/**
 * Copyright (C) 2022-2024  Luxembourg Institute of Science and Technology
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
import axios, { AxiosResponse } from 'axios'
import { CONFIG } from '../config'
import {
  AvailableTimeZones,
  DeviceIdResponse,
  StorageResponse,
  FileDownloadResponse,
  FilesDeletedResponse,
  VersionResponse,
  StorageStatusResponse,
  BatteryVoltageResponse,
  SunriseAndSunsetResponse,
  DeviceNameResponse,
  SiteNameResponse,
  SystemTimeResponse,
  CameraConnectionStatus,
  UpgradeFileCheckResult,
  UpgradeStatus,
} from './ApiTypings'
import {
  ApplicationSettings,
  ApplicationSettingsWithoutFlags,
} from 'src/settings'

const apiClient = axios.create({
  baseURL: CONFIG.API_SERVER_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

async function unwrapAxiosResponse(axiosResponse: Promise<AxiosResponse>) {
  const data = (await axiosResponse).data
  return data
}

function convertAxiosResponseToFileDownloadResponse(
  response: AxiosResponse,
): FileDownloadResponse {
  const contentDisposition = response.headers['content-disposition']
  let name = ''
  if (contentDisposition) {
    name = contentDisposition.split('"')[1]
  }
  return {
    contentType: response.headers['content-type'],
    data: response.data,
    filename: name,
  }
}

export default {
  deleteFile(filename: string): Promise<void> {
    return unwrapAxiosResponse(apiClient.delete('/files/' + filename))
  },

  deleteFiles(filenames: string[]): Promise<FilesDeletedResponse> {
    return unwrapAxiosResponse(
      apiClient.delete('/files/', { data: { filenames } }),
    )
  },

  deleteAllFiles(): Promise<FilesDeletedResponse> {
    return unwrapAxiosResponse(
      apiClient.delete('/files/', { data: { filenames: ['*'] } }),
    )
  },

  async getAppLogFile(): Promise<FileDownloadResponse> {
    const response = await apiClient.get('/log-files/app', {
      responseType: 'blob',
    })
    return convertAxiosResponseToFileDownloadResponse(response)
  },

  getAvailableTimeZones(): Promise<AvailableTimeZones> {
    return unwrapAxiosResponse(apiClient.get('/properties/timezones'))
  },

  getBatteryVoltage(): Promise<BatteryVoltageResponse> {
    return unwrapAxiosResponse(apiClient.get('/properties/batteryVoltage'))
  },

  getCameraConnectedStatus(): Promise<CameraConnectionStatus> {
    return unwrapAxiosResponse(
      apiClient.get('/properties/cameraConnectionStatus'),
    )
  },

  getDeviceId(): Promise<DeviceIdResponse> {
    return unwrapAxiosResponse(apiClient.get('/properties/deviceId'))
  },

  getDeviceName(): Promise<DeviceNameResponse> {
    return unwrapAxiosResponse(apiClient.get('/settings/deviceName'))
  },

  getFileList(): Promise<FileInfo[]> {
    return unwrapAxiosResponse(apiClient.get('/files'))
  },

  getNextSunsetAndSunriseTimes(): Promise<SunriseAndSunsetResponse> {
    return unwrapAxiosResponse(apiClient.get('/properties/sunsetAndSunrise'))
  },

  getNumberFilesPerHourOfDay(): Promise<{ hoursOfDayCounts: number[] }> {
    return unwrapAxiosResponse(
      apiClient.get('/file-stats/number-per-hours-of-day'),
    )
  },

  getSiteName(): Promise<SiteNameResponse> {
    return unwrapAxiosResponse(apiClient.get('/settings/siteName'))
  },

  getSystemTime(): Promise<SystemTimeResponse> {
    return unwrapAxiosResponse(apiClient.get('/settings/systemTime'))
  },

  async getFile(filename: string): Promise<FileDownloadResponse> {
    const response = await apiClient.get('/files/' + filename, {
      responseType: 'blob',
    })
    return convertAxiosResponseToFileDownloadResponse(response)
  },

  async getFiles(filenames: string[]): Promise<FileDownloadResponse> {
    const response = await apiClient.post(
      '/files',
      { filenames },
      {
        responseType: 'blob',
      },
    )
    return convertAxiosResponseToFileDownloadResponse(response)
  },

  async getMotionLogFile(): Promise<FileDownloadResponse> {
    const response = await apiClient.get('/log-files/motion', {
      responseType: 'blob',
    })
    return convertAxiosResponseToFileDownloadResponse(response)
  },

  getSettings(): Promise<ApplicationSettings> {
    return unwrapAxiosResponse(apiClient.get('/settings'))
  },

  patchSettings(
    settings: DeepPartial<ApplicationSettingsWithoutFlags>,
  ): Promise<void> {
    return unwrapAxiosResponse(apiClient.patch('/settings', settings))
  },

  putSettings(settings: ApplicationSettingsWithoutFlags): Promise<void> {
    return unwrapAxiosResponse(apiClient.put('/settings', settings))
  },

  getShotTypes(): Promise<{ shotTypes: string[] }> {
    return unwrapAxiosResponse(apiClient.get('/settings/shotTypes'))
  },

  async getSnapshot(): Promise<FileDownloadResponse> {
    const response = await apiClient.get('/snapshots', {
      responseType: 'blob',
    })
    return convertAxiosResponseToFileDownloadResponse(response)
  },

  getStorage(): Promise<StorageResponse> {
    return unwrapAxiosResponse(apiClient.get('/storage'))
  },

  getStorageStatus(): Promise<StorageStatusResponse> {
    return unwrapAxiosResponse(apiClient.get('/storage/status'))
  },

  getVersion(): Promise<VersionResponse> {
    return unwrapAxiosResponse(apiClient.get('/properties/version'))
  },

  getUpgradeFileCheckResult(): Promise<UpgradeFileCheckResult> {
    return unwrapAxiosResponse(apiClient.get('/upgrades/fileCheckResult'))
  },

  postPerformUpgrade(): Promise<void> {
    return unwrapAxiosResponse(apiClient.post('/upgrades/upgrade'))
  },

  getUpgradeStatus(): Promise<UpgradeStatus> {
    return unwrapAxiosResponse(
      apiClient.get('/upgrades/status', { timeout: 3000 }),
    )
  },
}
