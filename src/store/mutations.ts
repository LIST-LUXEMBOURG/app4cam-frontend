import { MutationTree } from 'vuex'
import { File, State } from '.'
import { Mutations } from './mutation-types'

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
}

export default mutations
