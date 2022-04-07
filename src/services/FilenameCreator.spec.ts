import FilenameCreator from './FilenameCreator'

const SYSTEM_TIME_ISO = '2022-01-18T13:48:37.000Z'
const SYSTEM_TIME_ISO_REDUCED = '20220118T134837'

describe('createFilename', () => {
  it('returns a valid filename', async () => {
    const deviceId = 'd'
    const siteName = 's'
    const systemTime = new Date(SYSTEM_TIME_ISO)
    const extension = 'e'
    expect(
      FilenameCreator.createFilename(
        deviceId,
        siteName,
        systemTime,
        'UTC',
        extension,
      ),
    ).toBe(
      siteName +
        '_' +
        deviceId +
        '_' +
        SYSTEM_TIME_ISO_REDUCED +
        '.' +
        extension,
    )
  })

  it('returns a valid filename with a suffix', async () => {
    const deviceId = 'd'
    const siteName = 's'
    const systemTime = new Date(SYSTEM_TIME_ISO)
    const extension = 'e'
    const suffix = 'x'
    expect(
      FilenameCreator.createFilename(
        deviceId,
        siteName,
        systemTime,
        'UTC',
        extension,
        suffix,
      ),
    ).toBe(
      siteName +
        '_' +
        deviceId +
        '_' +
        SYSTEM_TIME_ISO_REDUCED +
        '_' +
        suffix +
        '.' +
        extension,
    )
  })
})
