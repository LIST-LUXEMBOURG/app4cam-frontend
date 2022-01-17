import actions from './actions'
import ApiClientService from '../services/ApiClientService'
import { Mutations } from './mutation-types'
import { files } from '../../fixtures/files.json'
import { convertJsonToFiles } from './test-helpers'
import { Actions } from './action-types'

jest.mock('../services/ApiClientService')

const mockFiles = convertJsonToFiles(files)

const mockSettings: Settings = {
  deviceId: 'd',
  siteName: 's',
}

describe('actions', () => {
  it(Actions.FETCH_FILES, async () => {
    jest.spyOn(ApiClientService, 'getFiles').mockImplementation(() => {
      return Promise.resolve(mockFiles)
    })
    const commit = jest.fn()
    // @ts-ignore
    await actions[Actions.FETCH_FILES]({ commit })
    expect(commit).toHaveBeenCalledWith(Mutations.SET_FILES, mockFiles)
  })

  it(Actions.FETCH_SETTINGS, async () => {
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
  })

  describe(Actions.SAVE_SETTINGS, () => {
    it('saves all settings', async () => {
      jest
        .spyOn(ApiClientService, 'patchSettings')
        .mockImplementation(() => Promise.resolve())
      const commit = jest.fn()
      const state = {}
      // @ts-ignore
      await actions[Actions.SAVE_SETTINGS]({ commit, state }, mockSettings)
      expect(ApiClientService.patchSettings).toHaveBeenCalledWith(mockSettings)
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_DEVICE_ID,
        mockSettings.deviceId,
      )
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_SITE_NAME,
        mockSettings.siteName,
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
