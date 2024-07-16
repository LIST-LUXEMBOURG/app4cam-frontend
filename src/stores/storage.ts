/**
 * Copyright (C) 2022-2024  Luxembourg Institute of Science and Technology
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
import { StorageResponse } from '../helpers/ApiTypings'

type State = StorageResponse

export const useStorageStore = defineStore('storage', {
  state: (): State => ({
    status: {
      isAvailable: true,
      message: '',
    },
    usage: {
      capacityKb: 0,
      usedPercentage: 0,
    },
  }),

  actions: {
    fetchStorage() {
      this.$reset()
      return ApiClientService.getStorage().then((response) => {
        this.status.isAvailable = response.status.isAvailable
        this.status.message = response.status.message
        this.usage.capacityKb = response.usage.capacityKb
        this.usage.usedPercentage = response.usage.usedPercentage
      })
    },

    fetchStorageStatus() {
      return ApiClientService.getStorageStatus().then((response) => {
        this.status.isAvailable = response.isAvailable
        this.status.message = response.message
      })
    },
  },
})
