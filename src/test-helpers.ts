// © 2022 Luxembourg Institute of Science and Technology
interface FileAsJson {
  name: string
  creationTime: string
}

export function convertJsonToFiles(files: FileAsJson[]): FileInfo[] {
  return files.map((file) => {
    return {
      name: file.name,
      creationTime: new Date(file.creationTime),
    }
  })
}
