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

    videos: (state) => state.files.filter((f) => f.name.endsWith('mp4')),

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

    deleteFiles(filenames: string[]): Promise<void> {
      if (filenames.length === this.files.length) {
        return ApiClientService.deleteAllFiles().then(
          (result: FilesDeletedResponse) => {
            if (Object.keys(result).length === 1 && result['*']) {
              this.files.splice(0)
            }
          },
        )
      } else {
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
      }
    },

    fetchFiles() {
      this.files = []
      return ApiClientService.getFileList().then((files) => {
        this.files = files
      })
    },
  },
})
