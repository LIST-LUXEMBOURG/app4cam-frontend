import {
  createStore as vuexCreateStore,
  Store,
  StoreOptions,
  useStore as baseUseStore,
} from 'vuex'
import actions from './actions'
import mutations from './mutations'
import { State } from './state'
import state from './state'
import { InjectionKey } from 'vue'

export interface File {
  name: string
  creationTime: Date
}

export const key: InjectionKey<Store<State>> = Symbol()

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
  return vuexCreateStore<State>(merge)
}

export default createStore()

export function useStore() {
  return baseUseStore(key)
}
