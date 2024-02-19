// © 2022 Luxembourg Institute of Science and Technology
import FilenameCreator from './FilenameCreator'

const DEVICE_NAME = 'd'
const EXTENSION = 'e'
const SITE_NAME = 's'
const SYSTEM_TIME_ISO = '2022-01-18T13:48:37.000Z'
const SYSTEM_TIME_ISO_REDUCED = '20220118T134837'
const TIME_ZONE = 'UTC'

describe(FilenameCreator.createFilename.name, () => {
  it('returns a valid filename', () => {
    expect(
      FilenameCreator.createFilename({
        deviceName: DEVICE_NAME,
        siteName: SITE_NAME,
        systemTime: new Date(SYSTEM_TIME_ISO),
        timeZone: TIME_ZONE,
        extension: EXTENSION,
      }),
    ).toBe(
      SITE_NAME +
        '_' +
        DEVICE_NAME +
        '_' +
        SYSTEM_TIME_ISO_REDUCED +
        '_' +
        TIME_ZONE +
        '.' +
        EXTENSION,
    )
  })

  it('returns a valid filename with a suffix', () => {
    const suffix = 'x'
    expect(
      FilenameCreator.createFilename({
        deviceName: DEVICE_NAME,
        siteName: SITE_NAME,
        systemTime: new Date(SYSTEM_TIME_ISO),
        timeZone: TIME_ZONE,
        extension: EXTENSION,
        suffix,
      }),
    ).toBe(
      SITE_NAME +
        '_' +
        DEVICE_NAME +
        '_' +
        SYSTEM_TIME_ISO_REDUCED +
        '_' +
        TIME_ZONE +
        '_' +
        suffix +
        '.' +
        EXTENSION,
    )
  })

  it('returns a valid filename even if system time is undefined', () => {
    expect(
      FilenameCreator.createFilename({
        deviceName: DEVICE_NAME,
        siteName: SITE_NAME,
        systemTime: undefined,
        timeZone: TIME_ZONE,
        extension: EXTENSION,
      }),
    ).toBe(SITE_NAME + '_' + DEVICE_NAME + '_' + TIME_ZONE + '.' + EXTENSION)
  })

  it('returns a valid filename even if time zone is empty', () => {
    expect(
      FilenameCreator.createFilename({
        deviceName: DEVICE_NAME,
        siteName: SITE_NAME,
        systemTime: new Date(SYSTEM_TIME_ISO),
        timeZone: '',
        extension: EXTENSION,
      }),
    ).toBe(SITE_NAME + '_' + DEVICE_NAME + '.' + EXTENSION)
  })
})
