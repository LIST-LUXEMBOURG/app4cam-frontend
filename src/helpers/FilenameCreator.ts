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
import DateConverter from './DateConverter'

export default class FilenameCreator {
  static createFilename({
    deviceName,
    extension,
    siteName,
    suffix = '',
    systemTime,
    timeZone,
  }: {
    deviceName: string | undefined
    extension: string
    siteName: string | undefined
    suffix?: string
    systemTime: Date | undefined
    timeZone: string | undefined
  }): string {
    const nameParts: string[] = []
    if (siteName) {
      nameParts.push(siteName)
    }
    if (deviceName) {
      nameParts.push(deviceName)
    }
    let time = ''
    if (systemTime && timeZone) {
      time = DateConverter.formatDateIsoLikeInTimeZone(systemTime, timeZone)
    }
    if (time) {
      nameParts.push(time)
    }
    if (timeZone) {
      nameParts.push(timeZone.replaceAll('/', '-'))
    }
    if (suffix) {
      nameParts.push(suffix)
    }
    const name = nameParts.join('_') + `.${extension}`
    return name
  }
}
