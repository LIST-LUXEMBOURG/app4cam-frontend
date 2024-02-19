// © 2022 Luxembourg Institute of Science and Technology
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
