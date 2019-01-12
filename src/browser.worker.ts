/* global Window */
import WebWorker from './quantizer/worker'
import Vibrant = require('./browser')

// TODO: use this as webpack entry instead. Let webpack generate UMD module wrapper.
Vibrant.Quantizer.WebWorker = WebWorker

export = Vibrant