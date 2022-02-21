import actions from './actions'
import ApiClientService from '../services/ApiClientService'
import { Mutations } from './mutation-types'
import { files } from '../../fixtures/files.json'
import { convertJsonToFiles } from './test-helpers'
import { Actions } from './action-types'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))
jest.mock('../services/ApiClientService')

const mockFiles = convertJsonToFiles(files)

describe('actions', () => {
  describe(Actions.FETCH_FILES, () => {
    it('commits after fetching', async () => {
      jest.spyOn(ApiClientService, 'getFileList').mockImplementation(() => {
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
    const commit = jest.fn()
    const patchSettingsSpy = jest
      .spyOn(ApiClientService, 'patchSettings')
      .mockImplementation(() => Promise.resolve())
    const state = {}

    it('saves all settings', async () => {
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
      // @ts-ignore
      await actions[Actions.SAVE_SETTINGS]({ commit, state }, oneSetting)
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith(oneSetting)
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_SITE_NAME,
        oneSetting.siteName,
      )
    })

    it('ignores unnecessary triggers', async () => {
      // @ts-ignore
      await actions[Actions.SAVE_SETTINGS]({ commit, state }, {})
      expect(ApiClientService.patchSettings).toHaveBeenCalledTimes(0)
      expect(commit).toHaveBeenCalledTimes(0)
    })

    afterEach(() => {
      commit.mockClear()
      patchSettingsSpy.mockClear()
    })
  })
})
