export interface FileDownloadResponse {
  contentType: string
  data: string
  filename: string
}

export interface FilesDeletedResponse {
  [filename: string]: boolean
}
