import quantize from '../mmcq'

import {
  WorkerRequest,
  WorkerResponse,
  WorkerErrorResponse
} from './common'

export declare var self: DedicatedWorkerGlobalScope

self.onmessage = (event) => {
  let data: WorkerRequest = event.data

  let { id, payload } = data

  let response: WorkerResponse | WorkerErrorResponse

  try {
    let swatches = quantize(payload.pixels, payload.opts)
    response = {
      id,
      type: 'return',
      payload: swatches
    }
  } catch (e) {
    response = {
      id,
      type: 'error',
      payload: (<Error>e).message
    }
  }
  self.postMessage(response)
}
