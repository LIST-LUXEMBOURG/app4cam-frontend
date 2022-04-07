import DateConverter from './DateConverter'

export default class FilenameCreator {
  static createFilename(
    deviceId: string,
    siteName: string,
    systemTime: Date,
    timeZone: string,
    extension: string,
    suffix = '',
  ): string {
    const time = DateConverter.formatDateIsoLikeInTimeZone(systemTime, timeZone)
    let name = `${siteName}_${deviceId}_${time}`
    if (suffix) {
      name += `_${suffix}`
    }
    name += `.${extension}`
    return name
  }
}
