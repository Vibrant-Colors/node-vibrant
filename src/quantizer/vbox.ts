import { Vec3 } from '../color'
import { Pixels, Filter } from '../typing'
import { getColorIndex, SIGBITS, RSHIFT } from '../util'

export interface Dimension {
  r1: number
  r2: number
  g1: number
  g2: number
  b1: number
  b2: number
  [d: string]: number
}

export default class VBox {
  static build (pixels: Pixels, shouldIgnore?: Filter): VBox {
    let hn = 1 << (3 * SIGBITS)
    let hist = new Uint32Array(hn)
    let rmax: number
    let rmin: number
    let gmax: number
    let gmin: number
    let bmax: number
    let bmin: number
    let r: number
    let g: number
    let b: number
    let a: number
    rmax = gmax = bmax = 0
    rmin = gmin = bmin = Number.MAX_VALUE
    let n = pixels.length / 4
    let i = 0

    while (i < n) {
      let offset = i * 4
      i++
      r = pixels[offset + 0]
      g = pixels[offset + 1]
      b = pixels[offset + 2]
      a = pixels[offset + 3]

      // Ignored pixels' alpha is marked as 0 in filtering stage
      if (a === 0) continue

      r = r >> RSHIFT
      g = g >> RSHIFT
      b = b >> RSHIFT

      let index = getColorIndex(r, g, b)
      hist[index] += 1

      if (r > rmax) rmax = r
      if (r < rmin) rmin = r
      if (g > gmax) gmax = g
      if (g < gmin) gmin = g
      if (b > bmax) bmax = b
      if (b < bmin) bmin = b
    }
    return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, hist)
  }

  dimension: Dimension
  hist: Uint32Array

  private _volume = -1
  private _avg: Vec3 | null
  private _count = -1

  constructor (
    r1: number, r2: number,
    g1: number, g2: number,
    b1: number, b2: number,
    hist: Uint32Array
  ) {
    this.dimension = { r1, r2, g1, g2, b1, b2 }

    this.hist = hist
  }

  invalidate (): void {
    this._volume = this._count = -1
    this._avg = null
  }

  volume (): number {
    if (this._volume < 0) {
      let { r1, r2, g1, g2, b1, b2 } = this.dimension
      this._volume = (r2 - r1 + 1) * (g2 - g1 + 1) * (b2 - b1 + 1)
    }
    return this._volume
  }

  count (): number {
    if (this._count < 0) {
      let { hist } = this
      let { r1, r2, g1, g2, b1, b2 } = this.dimension
      let c = 0

      for (let r = r1; r <= r2; r++) {
        for (let g = g1; g <= g2; g++) {
          for (let b = b1; b <= b2; b++) {
            let index = getColorIndex(r, g, b)
            c += hist[index]
          }
        }
      }
      this._count = c
    }
    return this._count
  }

  clone (): VBox {
    let { hist } = this
    let { r1, r2, g1, g2, b1, b2 } = this.dimension
    return new VBox(r1, r2, g1, g2, b1, b2, hist)
  }

  avg (): Vec3 {
    if (!this._avg) {
      let { hist } = this
      let { r1, r2, g1, g2, b1, b2 } = this.dimension
      let ntot = 0
      let mult = 1 << (8 - SIGBITS)
      let rsum: number
      let gsum: number
      let bsum: number
      rsum = gsum = bsum = 0

      for (let r = r1; r <= r2; r++) {
        for (let g = g1; g <= g2; g++) {
          for (let b = b1; b <= b2; b++) {
            var index = getColorIndex(r, g, b)
            var h = hist[index]
            ntot += h
            rsum += (h * (r + 0.5) * mult)
            gsum += (h * (g + 0.5) * mult)
            bsum += (h * (b + 0.5) * mult)
          }
        }
      }
      if (ntot) {
        this._avg = [
          ~~(rsum / ntot),
          ~~(gsum / ntot),
          ~~(bsum / ntot)
        ]
      } else {
        this._avg = [
          ~~(mult * (r1 + r2 + 1) / 2),
          ~~(mult * (g1 + g2 + 1) / 2),
          ~~(mult * (b1 + b2 + 1) / 2)
        ]
      }
    }
    return this._avg
  }

  contains (rgb: Vec3): boolean {
    let [r, g, b] = rgb
    let { r1, r2, g1, g2, b1, b2 } = this.dimension
    r >>= RSHIFT
    g >>= RSHIFT
    b >>= RSHIFT

    return r >= r1 && r <= r2 &&
      g >= g1 && g <= g2 &&
      b >= b1 && b <= b2
  }

  split (): VBox[] {
    let { hist } = this
    let { r1, r2, g1, g2, b1, b2 } = this.dimension
    let count = this.count()
    if (!count) return []
    if (count === 1) return [this.clone()]
    let rw = r2 - r1 + 1
    let gw = g2 - g1 + 1
    let bw = b2 - b1 + 1

    let maxw = Math.max(rw, gw, bw)
    let accSum: Uint32Array | null = null
    let sum: number
    let total: number
    sum = total = 0

    let maxd: 'r' | 'g' | 'b' | null = null

    if (maxw === rw) {
      maxd = 'r'
      accSum = new Uint32Array(r2 + 1)
      for (let r = r1; r <= r2; r++) {
        sum = 0
        for (let g = g1; g <= g2; g++) {
          for (let b = b1; b <= b2; b++) {
            let index = getColorIndex(r, g, b)
            sum += hist[index]
          }
        }
        total += sum
        accSum[r] = total
      }
    } else if (maxw === gw) {
      maxd = 'g'
      accSum = new Uint32Array(g2 + 1)
      for (let g = g1; g <= g2; g++) {
        sum = 0
        for (let r = r1; r <= r2; r++) {
          for (let b = b1; b <= b2; b++) {
            let index = getColorIndex(r, g, b)
            sum += hist[index]
          }
        }
        total += sum
        accSum[g] = total
      }
    } else {
      maxd = 'b'
      accSum = new Uint32Array(b2 + 1)
      for (let b = b1; b <= b2; b++) {
        sum = 0
        for (let r = r1; r <= r2; r++) {
          for (let g = g1; g <= g2; g++) {
            let index = getColorIndex(r, g, b)
            sum += hist[index]
          }
        }
        total += sum
        accSum[b] = total
      }
    }

    let splitPoint = -1
    let reverseSum = new Uint32Array(accSum.length)
    for (let i = 0; i < accSum.length; i++) {
      let d = accSum[i]
      if (splitPoint < 0 && d > total / 2) splitPoint = i
      reverseSum[i] = total - d
    }

    let vbox = this

    function doCut (d: string): VBox[] {
      let dim1 = d + '1'
      let dim2 = d + '2'
      let d1 = vbox.dimension[dim1]
      let d2 = vbox.dimension[dim2]
      let vbox1 = vbox.clone()
      let vbox2 = vbox.clone()
      let left = splitPoint - d1
      let right = d2 - splitPoint
      if (left <= right) {
        d2 = Math.min(d2 - 1, ~~(splitPoint + right / 2))
        d2 = Math.max(0, d2)
      } else {
        d2 = Math.max(d1, ~~(splitPoint - 1 - left / 2))
        d2 = Math.min(vbox.dimension[dim2], d2)
      }

      while (!accSum![d2]) d2++

      let c2 = reverseSum[d2]
      while (!c2 && accSum![d2 - 1]) c2 = reverseSum[--d2]

      vbox1.dimension[dim2] = d2
      vbox2.dimension[dim1] = d2 + 1

      return [vbox1, vbox2]
    }

    return doCut(maxd)
  }
}
