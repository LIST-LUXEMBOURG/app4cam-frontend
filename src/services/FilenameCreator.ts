export default class FilenameCreator {
  static createFilename(
    deviceId: string,
    siteName: string,
    systemTime: Date,
  ): string {
    const time = FilenameCreator.stripHyphensColonsDots(
      systemTime.toISOString(),
    )
    return siteName + '_' + deviceId + '_' + time + '.extension'
  }

  static stripHyphensColonsDots(input: string) {
    return input.replaceAll('-', '').replaceAll(':', '').replaceAll('.', '')
  }
}
