---
id: WorkerManager
title: WorkerManager
---

# Class: WorkerManager

## Constructors

### new WorkerManager()

```ts
new WorkerManager(): WorkerManager
```

#### Returns

[`WorkerManager`](workermanager.md)

## Methods

### getWorker()

```ts
getWorker(name): undefined | WorkerPool
```

#### Parameters

##### name

`string`

#### Returns

`undefined` \| `WorkerPool`

#### Defined in

[packages/vibrant-worker/src/index.ts:15](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-worker/src/index.ts#L15)

***

### hasWorker()

```ts
hasWorker(name): boolean
```

#### Parameters

##### name

`string`

#### Returns

`boolean`

#### Defined in

[packages/vibrant-worker/src/index.ts:11](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-worker/src/index.ts#L11)

***

### invokeWorker()

```ts
invokeWorker<R>(
   name, 
   args, 
transferList?): Promise<R>
```

#### Type Parameters

• **R**

#### Parameters

##### name

`string`

##### args

`any`[]

##### transferList?

`any`[]

#### Returns

`Promise`\<`R`\>

#### Defined in

[packages/vibrant-worker/src/index.ts:19](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-worker/src/index.ts#L19)

***

### register()

```ts
register(name, WorkerClass): void
```

#### Parameters

##### name

`string`

##### WorkerClass

[`TaskWorkerClass`](../interfaces/taskworkerclass.md)

#### Returns

`void`

#### Defined in

[packages/vibrant-worker/src/index.ts:7](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-worker/src/index.ts#L7)
