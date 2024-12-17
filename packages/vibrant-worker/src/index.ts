import { WorkerPool } from "./pool";
import type { TaskWorkerClass } from "./common";

export class WorkerManager {
	private _pools: { [name: string]: WorkerPool } = {};

	register(name: string, WorkerClass: TaskWorkerClass) {
		this._pools[name] = new WorkerPool(WorkerClass);
	}

	hasWorker(name: string) {
		return !!this._pools[name];
	}

	getWorker(name: string) {
		return this._pools[name];
	}

	invokeWorker<R>(name: string, args: any[], transferList?: any[]) {
		return this.hasWorker(name)
			? this.getWorker(name)!.invoke<R>(args, transferList)
			: Promise.reject(`Worker '${name}' does not exist`);
	}
}

export * from "./worker";
export * from "./common";
