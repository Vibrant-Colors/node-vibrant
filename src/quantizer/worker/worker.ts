import quantize from '../mmcq'

import {
  WorkerRequest,
  WorkerResponse,
  WorkerErrorResponse
} from './common'

self.onmessage = (event: MessageEvent) => {
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
  }
  catch (e) {
    response = {
      id,
      type: 'error',
      payload: (<Error>e).message
    }
  }
  (<any>self).postMessage(response)
}

