---
id: TaskWorker
title: TaskWorker
---

# Interface: TaskWorker

## Extends

- `Worker`

## Properties

### id

```ts
id: number;
```

#### Defined in

[packages/vibrant-worker/src/common.ts:20](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-worker/src/common.ts#L20)

***

### idle

```ts
idle: boolean;
```

#### Defined in

[packages/vibrant-worker/src/common.ts:21](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-worker/src/common.ts#L21)

***

### onerror

```ts
onerror: null | (this, ev) => any;
```

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ServiceWorker/error_event)

#### Inherited from

`Worker.onerror`

#### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:2419

***

### onmessage

```ts
onmessage: null | (this, ev) => any;
```

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Worker/message_event)

#### Inherited from

`Worker.onmessage`

#### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:25812

***

### onmessageerror

```ts
onmessageerror: null | (this, ev) => any;
```

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Worker/messageerror_event)

#### Inherited from

`Worker.onmessageerror`

#### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:25814

## Methods

### addEventListener()

#### Call Signature

```ts
addEventListener<K>(
   type, 
   listener, 
   options?): void
```

Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

##### Type Parameters

• **K** *extends* keyof `WorkerEventMap`

##### Parameters

###### type

`K`

###### listener

(`this`, `ev`) => `any`

###### options?

`boolean` | `AddEventListenerOptions`

##### Returns

`void`

##### Inherited from

`Worker.addEventListener`

##### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:25828

#### Call Signature

```ts
addEventListener(
   type, 
   listener, 
   options?): void
```

Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

##### Parameters

###### type

`string`

###### listener

`EventListenerOrEventListenerObject`

###### options?

`boolean` | `AddEventListenerOptions`

##### Returns

`void`

##### Inherited from

`Worker.addEventListener`

##### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:25829

***

### dispatchEvent()

```ts
dispatchEvent(event): boolean
```

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

#### Parameters

##### event

`Event`

#### Returns

`boolean`

#### Inherited from

`Worker.dispatchEvent`

#### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:8309

***

### postMessage()

#### Call Signature

```ts
postMessage(message, transfer): void
```

Clones message and transmits it to worker's global environment. transfer can be passed as a list of objects that are to be transferred rather than cloned.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Worker/postMessage)

##### Parameters

###### message

`any`

###### transfer

`Transferable`[]

##### Returns

`void`

##### Inherited from

`Worker.postMessage`

##### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:25820

#### Call Signature

```ts
postMessage(message, options?): void
```

##### Parameters

###### message

`any`

###### options?

`StructuredSerializeOptions`

##### Returns

`void`

##### Inherited from

`Worker.postMessage`

##### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:25821

***

### removeEventListener()

#### Call Signature

```ts
removeEventListener<K>(
   type, 
   listener, 
   options?): void
```

Removes the event listener in target's event listener list with the same type, callback, and options.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

##### Type Parameters

• **K** *extends* keyof `WorkerEventMap`

##### Parameters

###### type

`K`

###### listener

(`this`, `ev`) => `any`

###### options?

`boolean` | `EventListenerOptions`

##### Returns

`void`

##### Inherited from

`Worker.removeEventListener`

##### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:25830

#### Call Signature

```ts
removeEventListener(
   type, 
   listener, 
   options?): void
```

Removes the event listener in target's event listener list with the same type, callback, and options.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

##### Parameters

###### type

`string`

###### listener

`EventListenerOrEventListenerObject`

###### options?

`boolean` | `EventListenerOptions`

##### Returns

`void`

##### Inherited from

`Worker.removeEventListener`

##### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:25831

***

### terminate()

```ts
terminate(): void
```

Aborts worker's associated global environment.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Worker/terminate)

#### Returns

`void`

#### Inherited from

`Worker.terminate`

#### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:25827
