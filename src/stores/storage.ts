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
