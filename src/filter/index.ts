import { Filter, ImageData, Options } from '../typing'
export { default as Default } from './default'

export function combineFilters (filters: Filter[]): Filter | null {
  // TODO: caching
  if (!Array.isArray(filters) || filters.length === 0) return null
  return (r: number, g: number, b: number, a: number) => {
    if (a === 0) return false
    for (let i = 0; i < filters.length; i++) {
      if (!filters[i](r, g, b, a)) return false
    }
    return true
  }
}
