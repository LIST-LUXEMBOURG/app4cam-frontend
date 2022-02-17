import axios, { AxiosResponse } from 'axios'
import { File } from '../store'

const BASE_URL = 'http://localhost:3001'

export interface FileDownloadResponse {
  contentType: string
  data: string
  filename: string
}

const apiClient = axios.create({
  baseURL: BASE_URL,
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
    contentType: response.headers['Content-Type'],
    data: response.data,
    filename: name,
  }
}

export default {
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
      '/files/download',
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
}
