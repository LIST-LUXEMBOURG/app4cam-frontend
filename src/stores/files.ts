import { defineStore } from 'pinia'
import ApiClientService from '../services/ApiClientService'
import { FilesDeletedResponse } from '../services/ApiTypings'

interface State {
  files: FileInfo[]
}

export const useFilesStore = defineStore('files', {
  state: (): State => ({
    files: [],
  }),

  actions: {
    deleteFile(filename: string) {
      return ApiClientService.deleteFile(filename).then(() => {
        const index = this.files.findIndex((file) => file.name === filename)
        this.files.splice(index, 1)
      })
    },

    deleteFiles(filenames: string[]) {
      return ApiClientService.deleteFiles(filenames).then(
        (result: FilesDeletedResponse) => {
          for (const key in result) {
            if (result[key]) {
              const index = this.files.findIndex((file) => file.name === key)
              this.files.splice(index, 1)
            }
          }
        },
      )
    },

    fetchFiles() {
      this.files = []
      return ApiClientService.getFileList().then((files) => {
        this.files = files
      })
    },
  },
})
