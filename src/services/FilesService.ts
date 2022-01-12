import axios from 'axios'

const BASE_URL = 'http://localhost:3001'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getFiles() {
    return apiClient.get('/files')
  },
}
