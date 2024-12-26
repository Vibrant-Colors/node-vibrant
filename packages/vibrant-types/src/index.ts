export type Resolvable<T> = T | Promise<T>;

/**
 * An internal implementation of Promise.withResolvers
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
 */
export class Defer<R> {
	resolve!: (thenableOrResult: R | Promise<R>) => void;
	reject!: (error: any) => void;
	promise: Promise<R>;
	constructor() {
		this.promise = new Promise<R>((_resolve, _reject) => {
			this.resolve = _resolve;
			this.reject = _reject;
		});
	}
}

/**
 * An internal implementation of Promise.withResolvers
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
 */
export function defer<R>(): Defer<R> {
	return new Defer<R>();
}
