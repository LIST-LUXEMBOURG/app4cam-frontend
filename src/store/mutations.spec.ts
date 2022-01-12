import { mutations } from './index'
import { SET_FILES } from './mutation-types'
import { files } from '../../fixtures/files.json'

const mockFiles = files.map((file) => {
  return {
    name: file.name,
    creationTime: new Date(file.creationTime),
  }
})

describe('mutations', () => {
  it(SET_FILES, () => {
    const state = { files: [] }
    mutations[SET_FILES](state, mockFiles)
    expect(state.files).toEqual(mockFiles)
  })
})
