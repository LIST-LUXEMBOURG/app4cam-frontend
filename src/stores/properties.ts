import { defineStore } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import {
  BatteryVoltageResponse,
  DeviceIdResponse,
  VersionResponse,
} from '../helpers/ApiTypings'

type State = BatteryVoltageResponse & DeviceIdResponse & VersionResponse

export const usePropertiesStore = defineStore('properties', {
  state: (): State => ({
    batteryVoltage: 0,
    commitHash: '',
    deviceId: '',
    version: '',
  }),

  actions: {
    fetchBatteryVoltage() {
      return ApiClientService.getBatteryVoltage().then((response) => {
        this.batteryVoltage = response.batteryVoltage
      })
    },

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
