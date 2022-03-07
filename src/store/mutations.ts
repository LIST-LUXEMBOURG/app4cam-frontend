import { MutationTree } from 'vuex'
import { File } from '.'
import { Mutations } from './mutation-types'
import { State } from './state'

const mutations: MutationTree<State> = {
  [Mutations.DELETE_FILE](state: State, filename: string) {
    const index = state.files.findIndex((file) => file.name === filename)
    state.files.splice(index, 1)
  },

  [Mutations.SET_DEVICE_ID](state: State, deviceId: string) {
    state.deviceId = deviceId
  },

  [Mutations.SET_FILES](state: State, files: File[]) {
    state.files = files
  },

  [Mutations.SET_SITE_NAME](state: State, siteName: string) {
    state.siteName = siteName
  },

  [Mutations.SET_SYSTEM_TIME](state: State, systemTime: Date) {
    state.systemTime = systemTime
  },
}

export default mutations
