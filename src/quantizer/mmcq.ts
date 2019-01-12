import {
  Quantizer,
  Filter,
  Pixels,
  ComputedOptions
} from '../typing'
import { Swatch } from '../color'
import VBox from './vbox'
import PQueue from './pqueue'

const fractByPopulations = 0.75

function _splitBoxes (pq: PQueue<VBox>, target: number): void {
  let lastSize = pq.size()
  while (pq.size() < target) {
    let vbox = pq.pop()

    if (vbox && vbox.count() > 0) {
      let [vbox1, vbox2] = vbox.split()

      pq.push(vbox1)
      if (vbox2 && vbox2.count() > 0) pq.push(vbox2)

      // No more new boxes, converged
      if (pq.size() === lastSize) {
        break
      } else {
        lastSize = pq.size()
      }
    } else {
      break
    }
  }
}

const MMCQ = (pixels: Pixels, opts: ComputedOptions): Array<Swatch> => {
  if (pixels.length === 0 || opts.colorCount < 2 || opts.colorCount > 256) {
    throw new Error('Wrong MMCQ parameters')
  }

  let vbox = VBox.build(pixels)
  let hist = vbox.hist
  let colorCount = Object.keys(hist).length
  let pq = new PQueue<VBox>((a, b) => a.count() - b.count())

  pq.push(vbox)

  // first set of colors, sorted by population
  _splitBoxes(pq, fractByPopulations * opts.colorCount)

  // Re-order
  let pq2 = new PQueue<VBox>((a, b) => a.count() * a.volume() - b.count() * b.volume())
  pq2.contents = pq.contents

  // next set - generate the median cuts using the (npix * vol) sorting.
  _splitBoxes(pq2, opts.colorCount - pq2.size())

  // calculate the actual colors
  return generateSwatches(pq2)
}

function generateSwatches (pq: PQueue<VBox>) {
  let swatches: Swatch[] = []
  while (pq.size()) {
    let v = pq.pop()
    let color = v.avg()
    let [r, g, b] = color
    swatches.push(new Swatch(color, v.count()))
  }
  return swatches
}

export default MMCQ
