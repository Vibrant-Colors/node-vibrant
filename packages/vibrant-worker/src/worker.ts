import type { Resolvable } from "@vibrant/types";
import type {
	WorkerErrorResponse,
	WorkerRequest,
	WorkerResponse,
} from "./common";

export function runInWorker<R>(
	self: Window,
	fn: (...args: any[]) => Resolvable<R>,
) {
	self.onmessage = (event) => {
		const data: WorkerRequest = event.data;

		const { id, payload } = data;

		let response: WorkerResponse<R> | WorkerErrorResponse;

		Promise.resolve(fn(...payload))
			.then((ret) => {
				(self as any).postMessage({
					id,
					type: "return",
					payload: ret,
				});
			})
			.catch((e) => {
				(self as any).postMessage({
					id,
					type: "error",
					payload: (e as Error).message,
				});
			});
	};
}
