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
