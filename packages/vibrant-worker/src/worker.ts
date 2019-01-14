import { Resolvable } from '@vibrant/types'
import {
  WorkerRequest,
  WorkerResponse,
  WorkerErrorResponse
} from './common'

export default function runInWorker<R> (self: Window, fn: (...args: any[]) => Resolvable<R>) {
  self.onmessage = (event) => {
    let data: WorkerRequest = event.data

    let { id, payload } = data

    let response: WorkerResponse<R> | WorkerErrorResponse

    Promise.resolve(fn(...payload))
      .then((ret) => {
        (self as any).postMessage({
          id,
          type: 'return',
          payload: ret
        })
      })
      .catch((e) => {
        (self as any).postMessage({
          id,
          type: 'error',
          payload: (e as Error).message
        })
      })
  }
}
