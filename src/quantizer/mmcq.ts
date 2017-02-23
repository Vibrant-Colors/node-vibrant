import {
    Quantizer,
    Filter,
    Pixels,
    Options
} from '../typing'
import { Swatch } from '../color'
import VBox from './vbox'
import PQueue from './pqueue'

const maxIterations = 1000
const fractByPopulations = 0.75
function _splitBoxes(pq: PQueue<VBox>, target: number): void {
    let colorCount = 1
    let iteration = 0
    while (iteration < maxIterations) {

        iteration++
        let vbox = pq.pop()
        if (!vbox.count()) continue

        let [vbox1, vbox2] = vbox.split()

        pq.push(vbox1)
        if (vbox2) {

            pq.push(vbox2)
            colorCount++
        }
        if (colorCount >= target || iteration > maxIterations) return
    }
}

const MMCQ: Quantizer = (pixels: Pixels, opts: Options): Array<Swatch> => {
    if (pixels.length === 0 || opts.colorCount < 2 || opts.colorCount > 256) {
        throw new Error('Wrong MMCQ parameters')
    }

    let shouldIgnore: Filter = null

    if (Array.isArray(opts.filters) && opts.filters.length > 0) {
        shouldIgnore = (r, g, b, a) => {
            for (let f of opts.filters) {
                if (!f(r, g, b, a)) return true
            }
            return false
        }
    }

    let vbox = VBox.build(pixels, shouldIgnore)
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
    let swatches: Swatch[] = []
    // let vboxes = []
    while (pq2.size()) {

        let v = pq2.pop()
        let color = v.avg()
        let [r, g, b] = color
        if (shouldIgnore === null || !shouldIgnore(r, g, b, 255)) {
            // @vboxes.push v
            swatches.push(new Swatch(color, v.count()))
        }

    }
    return swatches
}

export default MMCQ