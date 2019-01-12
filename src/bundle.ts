/* global Window */
import Vibrant = require('./browser')

((ns: any) => {
  ns.Vibrant = Vibrant
})((typeof window === 'object' && window instanceof Window) ? window : module.exports)
