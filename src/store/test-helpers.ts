import { File } from './index'

interface FileAsJson {
  name: string
  creationTime: string
}

export function convertJsonToFiles(files: FileAsJson[]): File[] {
  return files.map((file) => {
    return {
      name: file.name,
      creationTime: new Date(file.creationTime),
    }
  })
}
