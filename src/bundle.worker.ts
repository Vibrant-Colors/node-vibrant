/* global Window */
import WebWorker from './quantizer/worker'
import Vibrant = require('./browser')

((ns: any) => {
  ns.Vibrant = Vibrant
  Vibrant.Quantizer.WebWorker = WebWorker
})((typeof window === 'object' && window instanceof Window) ? window : module.exports)
