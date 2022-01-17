import { createStore as vuexCreateStore, StoreOptions } from 'vuex'
import actions from './actions'
import mutations from './mutations'

export interface File {
  name: string
  creationTime: Date
}

export interface State {
  deviceId: string
  files: File[]
  siteName: string
}

const state: State = {
  deviceId: '',
  files: [],
  siteName: '',
}

const store: StoreOptions<State> = {
  state,
  mutations,
  actions,
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
