/**
 * Copyright (C) 2022-2026 Luxembourg Institute of Science and Technology
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
import { defineStore } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import {
  BatteryVoltageResponse,
  LightTypeResponse,
  DeviceIdResponse,
  CameraConnectionStatus,
  VersionResponse,
} from '../helpers/ApiTypings'

type State = BatteryVoltageResponse &
  LightTypeResponse &
  DeviceIdResponse &
  CameraConnectionStatus &
  VersionResponse

export const usePropertiesStore = defineStore('properties', {
  state: (): State => ({
    batteryVoltage: 0,
    commitHash: '',
    lightType: 'unsupported',
    isCameraConnected: false,
    deviceId: '',
    version: '',
  }),

  actions: {
    fetchBatteryVoltage() {
      return ApiClientService.getBatteryVoltage().then((response) => {
        this.batteryVoltage = response.batteryVoltage
      })
    },

    fetchCameraStatus() {
      return ApiClientService.getCameraConnectedStatus().then((response) => {
        this.isCameraConnected = response.isCameraConnected
      })
    },

    fetchDeviceId() {
      return ApiClientService.getDeviceId().then((response) => {
        this.deviceId = response.deviceId
      })
    },

    fetchLightType() {
      return ApiClientService.getLightType().then((response) => {
        this.lightType = response.lightType
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
