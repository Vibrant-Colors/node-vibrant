import * as Bluebird from 'bluebird'

export interface Callback<T> {
    (err?: Error, result?: T): void
}

export type Resolvable<T> = T | Bluebird<T>

export interface IndexedObject {
    [key: string]: any
}

export interface DeferredBluebird<R> {
    resolve: (thenableOrResult: R | Bluebird.Thenable<R>) => void
    reject: (error: any) => void
    promise: Bluebird<R>
}

export function defer<R>(): DeferredBluebird<R> {
    let resolve: (thenableOrResult: R | Bluebird.Thenable<R>) => void
    let reject: (error: any) => void
    let promise = new Bluebird<R>((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
    })
    return { resolve, reject, promise }
}