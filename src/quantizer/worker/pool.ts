import { Swatch } from '../../color'
import omit = require('lodash/omit')
import find = require('lodash/find')
import {
  Quantizer,
  Filter,
  Pixels,
  ComputedOptions
} from '../../typing'
import {
  DeferredPromise,
  defer
} from '../../util'

import {
  WorkerRequest,
  WorkerResponse,
  WorkerErrorResponse
} from './common'

interface Task extends WorkerRequest {
  deferred: DeferredPromise<Swatch[]>
}

interface TaskWorker extends Worker {
  id: number
  idle: boolean
}

interface TaskWorkerClass {
  new(): TaskWorker
}

const WorkerClass: TaskWorkerClass = require('worker-loader?inline=true!./worker')

const MAX_WORKER_COUNT = 5
export default class WorkerPool {
  private static _instance: WorkerPool
  private static _task_id = 0
  static get instance() {
    if (!this._instance) this._instance = new WorkerPool()
    return this._instance
  }

  private _workers: TaskWorker[] = []
  private _queue: Task[] = []
  private _executing: { [id: number]: Task } = {}

  private _findIdleWorker(): TaskWorker {
    let worker: TaskWorker
    // if no idle worker && worker count < max count, make new one
    if (this._workers.length === 0 || this._workers.length < MAX_WORKER_COUNT) {
      worker = new WorkerClass()
      worker.id = this._workers.length
      worker.idle = true
      this._workers.push(worker)
      worker.onmessage = this._onMessage.bind(this, worker.id)
    } else {
      worker = find(this._workers, 'idle')!
    }

    return worker
  }

  private _enqueue(pixels: Pixels, opts: ComputedOptions): Promise<Swatch[]> {
    let d = defer<Swatch[]>()

    // make task item
    let task: Task = {
      id: WorkerPool._task_id++,
      payload: {
        pixels, opts
      },
      deferred: d
    }
    this._queue.push(task)

    // Try dequeue
    this._tryDequeue()

    return d.promise
  }

  private _tryDequeue() {
    // Called when a work has finished or from _enqueue

    // No pending task
    if (this._queue.length <= 0) return

    // Find idle worker
    let worker = this._findIdleWorker()
    // No idle worker
    if (!worker) return

    // Dequeue task
    let task = this._queue.shift()
    this._executing[task!.id] = task!

    // Send payload
    let request = <WorkerRequest>omit(task, 'deferred')
    request.payload.opts = <ComputedOptions>omit(
      request.payload.opts,
      'ImageClass',
      'combinedFilter',
      'filters',
      'generator',
      'quantizer'
    )
    worker.postMessage(request)
    worker.idle = false
  }
  private _onMessage(workerId: number, event: MessageEvent) {
    let data: WorkerResponse | WorkerErrorResponse = event.data
    if (!data) return
    // Worker should send result along with payload id
    let { id } = data
    // Task is looked up by id
    let task = this._executing[id]
    this._executing[id] = undefined!

    // Resolve or reject deferred promise
    switch (data.type) {
      case 'return':
        task.deferred.resolve(data.payload.map(({ rgb, population }) => new Swatch(rgb, population)))
        break
      case 'error':
        task.deferred.reject(new Error(data.payload))
        break
    }
    // Update worker status
    this._workers[workerId].idle = true
    // Try dequeue next task
    this._tryDequeue()
  }
  quantize(pixels: Pixels, opts: ComputedOptions): Promise<Swatch[]> {
    return this._enqueue(pixels, opts)
  }
}
