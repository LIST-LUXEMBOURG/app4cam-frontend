import {
  ActionContext,
  createStore as vuexCreateStore,
  MutationTree,
  StoreOptions,
} from 'vuex'
import FilesService from '../services/FilesService'
import { SET_FILES } from './mutation-types'

interface File {
  name: string
  creationTime: Date
}

interface State {
  files: File[]
}

const state: State = {
  files: [],
}

export const mutations: MutationTree<State> = {
  [SET_FILES](state: State, files: File[]) {
    state.files = files
  },
}

const store: StoreOptions<State> = {
  state,
  mutations,
  actions: {
    fetchFiles({ commit }: ActionContext<State, State>) {
      return FilesService.getFiles()
        .then((response) => {
          commit(SET_FILES, response.data)
        })
        .catch((error) => {
          throw error
        })
    },
  },
}

const defaultStoreOverrides = {
  state: () => {
    return {}
  },
}

function makeState(
  initialState: State | (() => State) | undefined,
  overrideState: any,
) {
  return {
    ...(typeof initialState === 'function' ? initialState() : initialState),
    ...overrideState(),
  }
}

export function createStore(storeOverrides = defaultStoreOverrides) {
  const merge = {
    ...store,
    ...storeOverrides,
    ...{
      state: makeState(store.state, storeOverrides.state),
    },
  }
  return vuexCreateStore(merge)
}

export default createStore()
