export interface Callback<T> {
  (err?: Error, result?: T): void
}

export type Resolvable<T> = T | Promise<T>

export interface IndexedObject {
  [key: string]: any
}

export class Defer<R> {
  resolve: (thenableOrResult: R | Promise<R>) => void
  reject: (error: any) => void
  promise: Promise<R>
  constructor () {
    this.promise = new Promise<R>((_resolve, _reject) => {
      this.resolve = _resolve
      this.reject = _reject
    })
  }
}

export function defer<R> (): Defer<R> {
  return new Defer<R>()
}
