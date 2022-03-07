export interface FileDownloadResponse {
  contentType: string
  data: string
  filename: string
}

export interface FilesDeletedResponse {
  [key: string]: boolean
}
