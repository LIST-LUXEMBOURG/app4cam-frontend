import axios, { AxiosResponse } from 'axios'
import { File } from '../store/index'

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
  getSettings(): Promise<Settings> {
    return unwrapAxiosResponse(apiClient.get('/settings'))
  },
  patchSettings(settings: Partial<Settings>): Promise<void> {
    return unwrapAxiosResponse(apiClient.patch('/settings', settings))
  },
}
