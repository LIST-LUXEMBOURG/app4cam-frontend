import FilenameCreator from './FilenameCreator'

const SYSTEM_TIME_ISO = '2022-01-18T13:48:37.000Z'
const SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS = '20220118T134837000Z'

describe('createFilename', () => {
  it('returns a valid filename', async () => {
    const deviceId = 'd'
    const siteName = 's'
    const systemTime = new Date(SYSTEM_TIME_ISO)
    const extension = 'e'
    expect(
      FilenameCreator.createFilename(deviceId, siteName, systemTime, extension),
    ).toBe(
      siteName +
        '_' +
        deviceId +
        '_' +
        SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS +
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
        extension,
        suffix,
      ),
    ).toBe(
      siteName +
        '_' +
        deviceId +
        '_' +
        SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS +
        '_' +
        suffix +
        '.' +
        extension,
    )
  })
})

describe('stripHyphensColonsDots', () => {
  it('removes all characters', async () => {
    expect(FilenameCreator.stripHyphensColonsDots(SYSTEM_TIME_ISO)).toBe(
      SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS,
    )
  })
})
