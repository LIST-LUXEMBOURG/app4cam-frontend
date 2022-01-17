import { ActionContext, ActionTree } from 'vuex'
import { State } from '.'
import ApiClientService from '../services/ApiClientService'
import { Actions } from './action-types'
import { Mutations } from './mutation-types'

const actions: ActionTree<State, State> = {
  [Actions.FETCH_FILES]({ commit }: ActionContext<State, State>) {
    return ApiClientService.getFiles()
      .then((files) => {
        commit(Mutations.SET_FILES, files)
      })
      .catch((error) => {
        throw error
      })
  },
  [Actions.FETCH_SETTINGS]({ commit }: ActionContext<State, State>) {
    return ApiClientService.getSettings()
      .then((settings) => {
        commit(Mutations.SET_DEVICE_ID, settings.deviceId)
        commit(Mutations.SET_SITE_NAME, settings.siteName)
      })
      .catch((error) => {
        throw error
      })
  },
  [Actions.SAVE_SETTINGS](
    { commit, state }: ActionContext<State, State>,
    settings: Settings,
  ) {
    const settingsToUpdate: Partial<Settings> = {}
    if (state.deviceId !== settings.deviceId) {
      settingsToUpdate.deviceId = settings.deviceId
    }
    if (state.siteName !== settings.siteName) {
      settingsToUpdate.siteName = settings.siteName
    }
    return ApiClientService.patchSettings(settingsToUpdate)
      .then(() => {
        if (state.deviceId !== settings.deviceId) {
          commit(Mutations.SET_DEVICE_ID, settings.deviceId)
        }
        if (state.siteName !== settings.siteName) {
          commit(Mutations.SET_SITE_NAME, settings.siteName)
        }
      })
      .catch((error) => {
        throw error
      })
  },
}

export default actions
