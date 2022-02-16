import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import ApiClientService from '../services/ApiClientService'
import { Actions } from './action-types'
import { Mutations } from './mutation-types'

const actions: ActionTree<State, State> = {
  [Actions.FETCH_FILES]({ commit }: ActionContext<State, State>) {
    return ApiClientService.getFileList()
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
        commit(Mutations.SET_SYSTEM_TIME, new Date(settings.systemTime))
      })
      .catch((error) => {
        throw error
      })
  },

  [Actions.SAVE_SETTINGS](
    { commit, state }: ActionContext<State, State>,
    settings: Settings,
  ) {
    const settingsToUpdate: Partial<SettingsDto> = {}
    if (state.deviceId !== settings.deviceId) {
      settingsToUpdate.deviceId = settings.deviceId
    }
    if (state.siteName !== settings.siteName) {
      settingsToUpdate.siteName = settings.siteName
    }
    if (state.systemTime !== settings.systemTime) {
      settingsToUpdate.systemTime = settings.systemTime.toISOString()
    }
    return ApiClientService.patchSettings(settingsToUpdate)
      .then(() => {
        if (state.deviceId !== settings.deviceId) {
          commit(Mutations.SET_DEVICE_ID, settings.deviceId)
        }
        if (state.siteName !== settings.siteName) {
          commit(Mutations.SET_SITE_NAME, settings.siteName)
        }
        if (state.systemTime !== settings.systemTime) {
          commit(Mutations.SET_SYSTEM_TIME, settings.systemTime)
        }
      })
      .catch((error) => {
        throw error
      })
  },
}

export default actions
