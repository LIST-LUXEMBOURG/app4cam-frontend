import { defineStore } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { VersionResponse } from '../helpers/ApiTypings'

type State = VersionResponse

export const useVersionStore = defineStore('version', {
  state: (): State => ({
    commitHash: '',
    version: '',
  }),

  actions: {
    fetchVersion() {
      this.$reset()
      return ApiClientService.getVersion().then((response) => {
        this.commitHash = response.commitHash
        this.version = response.version
      })
    },
  },
})
