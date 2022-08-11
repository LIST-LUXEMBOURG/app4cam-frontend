import { defineStore } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { FilesDeletedResponse } from '../helpers/ApiTypings'

interface State {
  files: FileInfo[]
}

export const useFilesStore = defineStore('files', {
  state: (): State => ({
    files: [],
  }),

  getters: {
    pictures: (state) => state.files.filter((f) => f.name.endsWith('jpg')),

    pictureCount() {
      return this.pictures.length
    },

    videos: (state) => state.files.filter((f) => f.name.endsWith('mkv')),

    videoCount() {
      return this.videos.length
    },
  },

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
