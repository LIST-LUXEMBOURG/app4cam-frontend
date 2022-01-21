import { File } from '.'

export interface State {
  deviceId: string
  files: File[]
  siteName: string
  systemTime: Date
}

const state: State = {
  deviceId: '',
  files: [],
  siteName: '',
  systemTime: new Date(),
}

export default state
