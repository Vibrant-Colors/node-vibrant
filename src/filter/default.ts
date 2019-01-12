import { Filter } from '../typing'
export default function defaultFilter (r: number, g: number, b: number, a: number): boolean {
  return a >= 125 &&
    !(r > 250 && g > 250 && b > 250)
}
