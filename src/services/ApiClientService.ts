import axios, { AxiosResponse } from 'axios'
import { CONFIG } from '../config'
import { File } from '../store'
import { FileDownloadResponse, FilesDeletedResponse } from './ApiTypings'

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
  const name = contentDisposition.split('"')[1]
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

  getFileList(): Promise<File[]> {
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

  getSettings(): Promise<SettingsDto> {
    return unwrapAxiosResponse(apiClient.get('/settings'))
  },

  patchSettings(settings: Partial<SettingsDto>): Promise<void> {
    return unwrapAxiosResponse(apiClient.patch('/settings', settings))
  },

  putSettings(settings: ApplicationSettings) {
    return unwrapAxiosResponse(apiClient.put('/settings', settings))
  },

  async getSnapshot(): Promise<FileDownloadResponse> {
    const response = await apiClient.get('/snapshots', {
      responseType: 'blob',
    })
    return convertAxiosResponseToFileDownloadResponse(response)
  },
}
