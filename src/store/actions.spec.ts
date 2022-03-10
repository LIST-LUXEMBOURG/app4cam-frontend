import actions from './actions'
import ApiClientService from '../services/ApiClientService'
import { Mutations } from './mutation-types'
import { files } from '../../fixtures/files.json'
import { convertJsonToFiles } from './test-helpers'
import { Actions } from './action-types'
import { FilesDeletedResponse } from '../services/ApiTypings'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))
jest.mock('../services/ApiClientService')

const mockFiles = convertJsonToFiles(files)

describe('actions', () => {
  describe(Actions.DELETE_FILE, () => {
    it('commits after deleting a file', async () => {
      const filename = 'a'
      jest
        .spyOn(ApiClientService, 'deleteFile')
        .mockImplementation(() => Promise.resolve())
      const commit = jest.fn()
      // @ts-ignore
      await actions[Actions.DELETE_FILE]({ commit }, filename)
      expect(commit).toHaveBeenCalledWith(Mutations.DELETE_FILE, filename)
    })
  })

  describe(Actions.DELETE_FILES, () => {
    it('commits two files after deleting two of three files', async () => {
      const filenames = ['a', 'b', 'c']
      jest.spyOn(ApiClientService, 'deleteFiles').mockImplementation(() => {
        const response: FilesDeletedResponse = { a: false, b: true, c: true }
        return Promise.resolve(response)
      })
      const commit = jest.fn()
      // @ts-ignore
      await actions[Actions.DELETE_FILES]({ commit }, filenames)
      expect(commit).toHaveBeenCalledWith(Mutations.DELETE_FILE, filenames[1])
      expect(commit).toHaveBeenCalledWith(Mutations.DELETE_FILE, filenames[2])
    })
  })

  describe(Actions.FETCH_FILES, () => {
    it('commits after fetching', async () => {
      jest.spyOn(ApiClientService, 'getFileList').mockImplementation(() => {
        return Promise.resolve(mockFiles)
      })
      const commit = jest.fn()
      // @ts-ignore
      await actions[Actions.FETCH_FILES]({ commit })
      expect(commit).toHaveBeenCalledWith(Mutations.SET_FILES, [])
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

  describe(Actions.PATCH_SETTINGS, () => {
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
      await actions[Actions.PATCH_SETTINGS](
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
      await actions[Actions.PATCH_SETTINGS]({ commit, state }, oneSetting)
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith(oneSetting)
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_SITE_NAME,
        oneSetting.siteName,
      )
    })

    it('ignores unnecessary triggers', async () => {
      // @ts-ignore
      await actions[Actions.PATCH_SETTINGS]({ commit, state }, {})
      expect(ApiClientService.patchSettings).toHaveBeenCalledTimes(0)
      expect(commit).toHaveBeenCalledTimes(0)
    })

    afterEach(() => {
      commit.mockClear()
      patchSettingsSpy.mockClear()
    })
  })

  describe(Actions.PATCH_SETTINGS, () => {
    const commit = jest.fn()
    const putSettingsSpy = jest
      .spyOn(ApiClientService, 'putSettings')
      .mockImplementation(() => Promise.resolve())
    const state = {}

    it('saves all settings', async () => {
      const settings = {
        deviceId: 'd',
        siteName: 's',
      }
      // @ts-ignore
      await actions[Actions.PUT_SETTINGS]({ commit, state }, settings)
      expect(ApiClientService.putSettings).toHaveBeenCalledWith(settings)
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_DEVICE_ID,
        settings.deviceId,
      )
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_SITE_NAME,
        settings.siteName,
      )
    })

    afterEach(() => {
      commit.mockClear()
      putSettingsSpy.mockClear()
    })
  })
})
