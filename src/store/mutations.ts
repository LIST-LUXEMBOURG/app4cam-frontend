import { MutationTree } from 'vuex'
import { File } from '.'
import { Mutations } from './mutation-types'
import { State } from './state'

const mutations: MutationTree<State> = {
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
