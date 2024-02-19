// © 2022 Luxembourg Institute of Science and Technology
export class FileDownloader {
  static downloadFile(
    blobParts: BlobPart[],
    contentType: string | undefined,
    filename: string,
  ): void {
    const file = new Blob(blobParts, { type: contentType })
    const fileUrl = URL.createObjectURL(file)
    const anchorElement = document.createElement('a')
    anchorElement.download = filename
    anchorElement.href = fileUrl
    anchorElement.click()
    URL.revokeObjectURL(fileUrl)
    anchorElement.remove()
  }
}
