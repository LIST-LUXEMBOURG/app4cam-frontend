import { defineStore } from 'pinia'
import ApiClientService from '../services/ApiClientService'
import { DiskSpaceUsageResponse } from '../services/ApiTypings'

type State = DiskSpaceUsageResponse

export const useStorageStore = defineStore('storage', {
  state: (): State => ({
    capacityKb: 0,
    usedPercentage: 0,
  }),

  actions: {
    fetchStorage() {
      this.$reset()
      return ApiClientService.getStorage().then((response) => {
        this.capacityKb = response.capacityKb
        this.usedPercentage = response.usedPercentage
      })
    },
  },
})