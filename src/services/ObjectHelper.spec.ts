import { cloneDeep } from './ObjectHelper'

describe('cloneDeep', () => {
  it('copies an object', async () => {
    const test = {
      a: 1,
      b: {
        c: 'd',
        e: 2,
      },
    }
    expect(cloneDeep(test)).toEqual(test)
  })
})
