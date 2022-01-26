import FilenameCreator from './FilenameCreator'

const SYSTEM_TIME_ISO = '2022-01-18T13:48:37.000Z'
const SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS = '20220118T134837000Z'

describe('createFilename', () => {
  it('should return a valid filename', async () => {
    const deviceId = 'd'
    const siteName = 's'
    const systemTime = new Date(SYSTEM_TIME_ISO)
    expect(FilenameCreator.createFilename(deviceId, siteName, systemTime)).toBe(
      siteName +
        ' ' +
        deviceId +
        ' ' +
        SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS +
        '.extension',
    )
  })
})

describe('stripHyphensColonsDots', () => {
  it('should remove all characters', async () => {
    expect(FilenameCreator.stripHyphensColonsDots(SYSTEM_TIME_ISO)).toBe(
      SYSTEM_TIME_ISO_WITHOUT_SPECIAL_CHARS,
    )
  })
})
