import actions from './actions'
import ApiClientService from '../services/ApiClientService'
import { Mutations } from './mutation-types'
import { files } from '../../fixtures/files.json'
import { convertJsonToFiles } from './test-helpers'
import { Actions } from './action-types'

jest.mock('../services/ApiClientService')

const mockFiles = convertJsonToFiles(files)

describe('actions', () => {
  describe(Actions.FETCH_FILES, () => {
    it('commits after fetching', async () => {
      jest.spyOn(ApiClientService, 'getFiles').mockImplementation(() => {
        return Promise.resolve(mockFiles)
      })
      const commit = jest.fn()
      // @ts-ignore
      await actions[Actions.FETCH_FILES]({ commit })
      expect(commit).toHaveBeenCalledWith(Mutations.SET_FILES, mockFiles)
    })
  })

  describe(Actions.FETCH_SETTINGS, () => {
    it('commits after fetching', async () => {
      const systemTime = new Date()
      const mockSettings: SettingsDto = {
        deviceId: 'd',
        siteName: 's',
        systemTime: systemTime.toISOString(),
      }
      jest.spyOn(ApiClientService, 'getSettings').mockImplementation(() => {
        return Promise.resolve(mockSettings)
      })
      const commit = jest.fn()
      // @ts-ignore
      await actions[Actions.FETCH_SETTINGS]({ commit })
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_DEVICE_ID,
        mockSettings.deviceId,
      )
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_SITE_NAME,
        mockSettings.siteName,
      )
      expect(commit).toHaveBeenCalledWith(Mutations.SET_SYSTEM_TIME, systemTime)
    })
  })

  describe(Actions.SAVE_SETTINGS, () => {
    it('saves all settings', async () => {
      jest
        .spyOn(ApiClientService, 'patchSettings')
        .mockImplementation(() => Promise.resolve())
      const commit = jest.fn()
      const state = {}
      const mockSettingsWithoutSystemTime = {
        deviceId: 'd',
        siteName: 's',
      }
      // @ts-ignore
      await actions[Actions.SAVE_SETTINGS](
        { commit, state },
        mockSettingsWithoutSystemTime,
      )
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith(
        mockSettingsWithoutSystemTime,
      )
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_DEVICE_ID,
        mockSettingsWithoutSystemTime.deviceId,
      )
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_SITE_NAME,
        mockSettingsWithoutSystemTime.siteName,
      )
    })

    it('saves one setting', async () => {
      const oneSetting = { siteName: 'ss' }
      jest
        .spyOn(ApiClientService, 'patchSettings')
        .mockImplementation(() => Promise.resolve())
      const commit = jest.fn()
      const state = {}
      // @ts-ignore
      await actions[Actions.SAVE_SETTINGS]({ commit, state }, oneSetting)
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith(oneSetting)
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_SITE_NAME,
        oneSetting.siteName,
      )
    })
  })
})
