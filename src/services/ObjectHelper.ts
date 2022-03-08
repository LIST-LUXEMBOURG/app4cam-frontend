export function cloneDeep<T>(o: T): T {
  return JSON.parse(JSON.stringify(o))
}
