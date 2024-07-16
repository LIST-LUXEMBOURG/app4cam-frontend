/**
 * Copyright (C) 2022-2024  Luxembourg Institute of Science and Technology
 *
 * App4Cam is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * App4Cam is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with App4Cam.  If not, see <https://www.gnu.org/licenses/>.
 */
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
