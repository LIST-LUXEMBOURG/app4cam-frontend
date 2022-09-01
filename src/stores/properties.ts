import { defineStore } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { DeviceIdResponse, VersionResponse } from '../helpers/ApiTypings'

type State = DeviceIdResponse & VersionResponse

export const usePropertiesStore = defineStore('properties', {
  state: (): State => ({
    commitHash: '',
    deviceId: '',
    version: '',
  }),

  actions: {
    fetchDeviceId() {
      return ApiClientService.getDeviceId().then((response) => {
        this.deviceId = response.deviceId
      })
    },

    fetchVersion() {
      return ApiClientService.getVersion().then((response) => {
        this.commitHash = response.commitHash
        this.version = response.version
      })
    },
  },
})
