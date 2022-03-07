import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import ApiClientService from '../services/ApiClientService'
import { Actions } from './action-types'
import { Mutations } from './mutation-types'
import { FilesDeletedResponse } from '../services/ApiTypings'

const actions: ActionTree<State, State> = {
  [Actions.DELETE_FILE](
    { commit }: ActionContext<State, State>,
    filename: string,
  ) {
    return ApiClientService.deleteFile(filename).then(() => {
      commit(Mutations.DELETE_FILE, filename)
    })
  },

  [Actions.DELETE_FILES](
    { commit }: ActionContext<State, State>,
    filenames: string[],
  ) {
    return ApiClientService.deleteFiles(filenames).then(
      (result: FilesDeletedResponse) => {
        for (const key in result) {
          if (result[key]) {
            commit(Mutations.DELETE_FILE, key)
          }
        }
      },
    )
  },

  [Actions.FETCH_FILES]({ commit }: ActionContext<State, State>) {
    return ApiClientService.getFileList().then((files) => {
      commit(Mutations.SET_FILES, files)
    })
  },

  [Actions.FETCH_SETTINGS]({ commit }: ActionContext<State, State>) {
    return ApiClientService.getSettings().then((settings) => {
      commit(Mutations.SET_DEVICE_ID, settings.deviceId)
      commit(Mutations.SET_SITE_NAME, settings.siteName)
      commit(Mutations.SET_SYSTEM_TIME, new Date(settings.systemTime))
    })
  },

  [Actions.SAVE_SETTINGS](
    { commit, state }: ActionContext<State, State>,
    settings: Settings,
  ): Promise<void> {
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
    if (Object.keys(settingsToUpdate).length === 0) {
      return Promise.resolve()
    }
    return ApiClientService.patchSettings(settingsToUpdate).then(() => {
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
  },
}

export default actions
