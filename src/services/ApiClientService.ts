import axios, { AxiosResponse } from 'axios'
import { File } from '../store'

const BASE_URL = 'http://localhost:3001'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

async function unwrapAxiosResponse(
  axiosResponse: Promise<AxiosResponse<any, any>>,
) {
  const data = (await axiosResponse).data
  return data
}

export default {
  getFiles(): Promise<File[]> {
    return unwrapAxiosResponse(apiClient.get('/files'))
  },

  getSettings(): Promise<SettingsDto> {
    return unwrapAxiosResponse(apiClient.get('/settings'))
  },

  patchSettings(settings: Partial<SettingsDto>): Promise<void> {
    return unwrapAxiosResponse(apiClient.patch('/settings', settings))
  },
}
