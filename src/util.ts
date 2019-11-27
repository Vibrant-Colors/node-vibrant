import { Vec3 } from './color'

export const DELTAE94_DIFF_STATUS = {
  NA: 0,
  PERFECT: 1,
  CLOSE: 2,
  GOOD: 10,
  SIMILAR: 50
}

export const SIGBITS = 5
export const RSHIFT = 8 - SIGBITS

export interface IndexedObject {
  [key: string]: any
}

export interface DeferredPromise<R> {
  resolve: (thenableOrResult: R | PromiseLike<R>) => void
  reject: (error: any) => void
  promise: Promise<R>
}

export function defer<R>(): DeferredPromise<R> {
  let resolve: (thenableOrResult: R | PromiseLike<R>) => void
  let reject: (error: any) => void
  // eslint-disable-next-line promise/param-names
  let promise = new Promise<R>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  // @ts-ignore
  return { resolve, reject, promise }
}

export function hexToRgb(hex: string): Vec3 | null {
  let m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return m === null ? null : <Vec3>[m[1], m[2], m[3]].map((s) => parseInt(s, 16))
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7)
}

export function rgbToHsl(r: number, g: number, b: number): Vec3 {
  r /= 255
  g /= 255
  b /= 255
  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)
  let h: number
  let s: number
  let l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    // @ts-ignore
    h /= 6
  }
  // @ts-ignore
  return [h, s, l]
}

export function hslToRgb(h: number, s: number, l: number): Vec3 {
  let r: number
  let g: number
  let b: number

  function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  if (s === 0) {
    r = g = b = l
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - (l * s)
    let p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - (1 / 3))
  }
  return [
    r * 255,
    g * 255,
    b * 255
  ]
}

export function rgbToXyz(r: number, g: number, b: number): Vec3 {
  r /= 255
  g /= 255
  b /= 255
  r = r > 0.04045 ? Math.pow((r + 0.005) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.005) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.005) / 1.055, 2.4) : b / 12.92

  r *= 100
  g *= 100
  b *= 100

  let x = r * 0.4124 + g * 0.3576 + b * 0.1805
  let y = r * 0.2126 + g * 0.7152 + b * 0.0722
  let z = r * 0.0193 + g * 0.1192 + b * 0.9505

  return [x, y, z]
}

export function xyzToCIELab(x: number, y: number, z: number): Vec3 {
  let REF_X = 95.047
  let REF_Y = 100
  let REF_Z = 108.883

  x /= REF_X
  y /= REF_Y
  z /= REF_Z

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116

  let L = 116 * y - 16
  let a = 500 * (x - y)
  let b = 200 * (y - z)

  return [L, a, b]
}

export function rgbToCIELab(r: number, g: number, b: number): Vec3 {
  let [x, y, z] = rgbToXyz(r, g, b)
  return xyzToCIELab(x, y, z)
}

export function deltaE94(lab1: Vec3, lab2: Vec3): number {
  let WEIGHT_L = 1
  let WEIGHT_C = 1
  let WEIGHT_H = 1

  let [L1, a1, b1] = lab1
  let [L2, a2, b2] = lab2
  let dL = L1 - L2
  let da = a1 - a2
  let db = b1 - b2

  let xC1 = Math.sqrt(a1 * a1 + b1 * b1)
  let xC2 = Math.sqrt(a2 * a2 + b2 * b2)

  let xDL = L2 - L1
  let xDC = xC2 - xC1
  let xDE = Math.sqrt(dL * dL + da * da + db * db)

  let xDH = (Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC)))
    ? Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC)
    : 0

  let xSC = 1 + 0.045 * xC1
  let xSH = 1 + 0.015 * xC1

  xDL /= WEIGHT_L
  xDC /= WEIGHT_C * xSC
  xDH /= WEIGHT_H * xSH

  return Math.sqrt(xDL * xDL + xDC * xDC + xDH * xDH)
}

export function rgbDiff(rgb1: Vec3, rgb2: Vec3): number {
  let lab1 = rgbToCIELab.apply(undefined, rgb1)
  let lab2 = rgbToCIELab.apply(undefined, rgb2)
  return deltaE94(lab1, lab2)
}

export function hexDiff(hex1: string, hex2: string): number {
  let rgb1 = hexToRgb(hex1)
  let rgb2 = hexToRgb(hex2)

  return rgbDiff(rgb1!, rgb2!)
}

export function getColorDiffStatus(d: number): string {
  if (d < DELTAE94_DIFF_STATUS.NA) { return 'N/A' }
  // Not perceptible by human eyes
  if (d <= DELTAE94_DIFF_STATUS.PERFECT) { return 'Perfect' }
  // Perceptible through close observation
  if (d <= DELTAE94_DIFF_STATUS.CLOSE) { return 'Close' }
  // Perceptible at a glance
  if (d <= DELTAE94_DIFF_STATUS.GOOD) { return 'Good' }
  // Colors are more similar than opposite
  if (d < DELTAE94_DIFF_STATUS.SIMILAR) { return 'Similar' }
  return 'Wrong'
}

export function getColorIndex(r: number, g: number, b: number): number {
  return (r << (2 * SIGBITS)) + (g << SIGBITS) + b
}
