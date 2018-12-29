export interface Callback<T> {
    (err?: Error, result?: T): void
}

export type Resolvable<T> = T | Promise<T>

export interface IndexedObject {
    [key: string]: any
}

export interface DeferredPromise<R> {
  resolve: (thenableOrResult: R | Promise<R>) => void
  reject: (error: any) => void
    promise: Promise<R>
}

export function defer<R>(): DeferredPromise<R> {
    let resolve: (thenableOrResult: R | Promise<R>) => void
    let reject: (error: any) => void
    // TODO: HACK: HELLO
    let promise = new Promise<R>((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })
    return { resolve, reject, promise }
}