import { State } from './index'
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
    }
  })

  it(Mutations.SET_DEVICE_ID, () => {
    const deviceId = 'a'
    mutations[Mutations.SET_DEVICE_ID](state, deviceId)
    expect(state.deviceId).toEqual(deviceId)
  })

  it(Mutations.SET_FILES, () => {
    mutations[Mutations.SET_FILES](state, mockFiles)
    expect(state.files).toEqual(mockFiles)
  })

  it(Mutations.SET_SITE_NAME, () => {
    const siteName = 'b'
    mutations[Mutations.SET_SITE_NAME](state, siteName)
    expect(state.siteName).toEqual(siteName)
  })
})
