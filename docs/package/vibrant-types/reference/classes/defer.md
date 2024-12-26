---
id: Defer
title: Defer
---

# Class: Defer\<R\>

An internal implementation of Promise.withResolvers

## See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers

## Type Parameters

• **R**

## Constructors

### new Defer()

```ts
new Defer<R>(): Defer<R>
```

#### Returns

[`Defer`](defer.md)\<`R`\>

#### Defined in

[index.ts:11](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-types/src/index.ts#L11)

## Properties

### promise

```ts
promise: Promise<R>;
```

#### Defined in

[index.ts:10](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-types/src/index.ts#L10)

***

### reject()

```ts
reject: (error) => void;
```

#### Parameters

##### error

`any`

#### Returns

`void`

#### Defined in

[index.ts:9](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-types/src/index.ts#L9)

***

### resolve()

```ts
resolve: (thenableOrResult) => void;
```

#### Parameters

##### thenableOrResult

`R` | `Promise`\<`R`\>

#### Returns

`void`

#### Defined in

[index.ts:8](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-types/src/index.ts#L8)
