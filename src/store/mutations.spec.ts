import { State } from './state'
import { Mutations } from './mutation-types'
import { files } from '../../fixtures/files.json'
import { convertJsonToFiles } from './test-helpers'
import mutations from './mutations'

const mockFiles = convertJsonToFiles(files)

let state: State

describe('mutations', () => {
  beforeEach(() => {
    state = {
      deviceId: '',
      files: [],
      siteName: '',
      systemTime: new Date(),
    }
  })

  describe(Mutations.SET_DEVICE_ID, () => {
    it('sets', () => {
      const deviceId = 'a'
      mutations[Mutations.SET_DEVICE_ID](state, deviceId)
      expect(state.deviceId).toBe(deviceId)
    })
  })

  describe(Mutations.SET_FILES, () => {
    it('sets', () => {
      mutations[Mutations.SET_FILES](state, mockFiles)
      expect(state.files).toBe(mockFiles)
    })
  })

  describe(Mutations.SET_SITE_NAME, () => {
    it('sets', () => {
      const siteName = 'b'
      mutations[Mutations.SET_SITE_NAME](state, siteName)
      expect(state.siteName).toBe(siteName)
    })
  })

  describe(Mutations.SET_SYSTEM_TIME, () => {
    it('sets', () => {
      const systemTime = '2022-01-18T13:48:37.000Z'
      mutations[Mutations.SET_SYSTEM_TIME](state, systemTime)
      expect(state.systemTime).toBe(systemTime)
    })
  })
})
