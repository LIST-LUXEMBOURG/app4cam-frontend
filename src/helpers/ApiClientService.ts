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
} from './ApiTypings'
import { ApplicationSettings } from 'src/settings'

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

  getAvailableTimeZones(): Promise<AvailableTimeZones> {
    return unwrapAxiosResponse(apiClient.get('/settings/timezones'))
  },

  getDeviceId(): Promise<DeviceIdResponse> {
    return unwrapAxiosResponse(apiClient.get('/properties/deviceId'))
  },

  getFileList(): Promise<FileInfo[]> {
    return unwrapAxiosResponse(apiClient.get('/files'))
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

  getSettings(): Promise<ApplicationSettings> {
    return unwrapAxiosResponse(apiClient.get('/settings'))
  },

  patchSettings(settings: DeepPartial<ApplicationSettings>): Promise<void> {
    return unwrapAxiosResponse(apiClient.patch('/settings', settings))
  },

  putSettings(settings: ApplicationSettings): Promise<void> {
    return unwrapAxiosResponse(apiClient.put('/settings', settings))
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
    return unwrapAxiosResponse(apiClient.get('/storage/Status'))
  },

  getVersion(): Promise<VersionResponse> {
    return unwrapAxiosResponse(apiClient.get('/properties/version'))
  },
}
