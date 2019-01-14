import WorkerPool from './pool'

export interface TaskWorker extends Worker {
  id: number
  idle: boolean
}

export interface TaskWorkerClass {
  new(): TaskWorker
}

export default class WorkerManager {
  private _pools: { [name: string]: WorkerPool } = {}
  register (name: string, WorkerClass: TaskWorkerClass) {
    this._pools[name] = new WorkerPool(WorkerClass)
  }
  hasWorker (name: string) {
    return !!this._pools[name]
  }
  getWorker (name: string) {
    return this._pools[name]
  }
  invokeWorker<R> (name: string, args: any[], transferList?: any[]) {
    return this.hasWorker(name)
      ? this.getWorker(name).invoke<R>(args, transferList)
      : Promise.reject(`Worker '${name}' does not exist`)
  }
}
