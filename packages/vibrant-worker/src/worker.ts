import Bluebird = require('bluebird')
import { Resolvable } from 'vibrant-types'
import {
    WorkerRequest,
    WorkerResponse,
    WorkerErrorResponse
} from './common'

export default function runInWorker<R>(self: Window, fn: (...args: any[]) => Resolvable<R>) {
    self.onmessage = (event) => {
        let data: WorkerRequest = event.data

        let { id, payload } = data

        let response: WorkerResponse<R> | WorkerErrorResponse

        Bluebird.resolve(fn(...payload))
            .then((ret) => {
                (<any>self).postMessage({
                    id,
                    type: 'return',
                    payload: ret
                })
            })
            .catch((e) => {
                (<any>self).postMessage({
                    id,
                    type: 'error',
                    payload: (<Error>e).message
                })
            })
    }
}
