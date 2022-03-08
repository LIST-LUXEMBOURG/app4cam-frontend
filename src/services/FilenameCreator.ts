export default class FilenameCreator {
  static createFilename(
    deviceId: string,
    siteName: string,
    systemTime: Date,
    extension: string,
    suffix = '',
  ): string {
    const time = FilenameCreator.stripHyphensColonsDots(
      systemTime.toISOString(),
    )
    let name = `${siteName}_${deviceId}_${time}`
    if (suffix) {
      name += `_${suffix}`
    }
    name += `.${extension}`
    return name
  }

  static stripHyphensColonsDots(input: string) {
    return input.replaceAll('-', '').replaceAll(':', '').replaceAll('.', '')
  }
}
