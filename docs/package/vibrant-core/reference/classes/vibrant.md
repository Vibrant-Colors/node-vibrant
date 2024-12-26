---
id: Vibrant
title: Vibrant
---

# Class: Vibrant

Main class of `node-vibrant`.

## Constructors

### new Vibrant()

```ts
new Vibrant(_src, opts?): Vibrant
```

#### Parameters

##### \_src

`ImageSource`

Path to image file (supports HTTP/HTTPs)

##### opts?

`Partial`\<`Options`\>

Options (optional)

#### Returns

[`Vibrant`](vibrant.md)

#### Defined in

[index.ts:43](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L43)

## Properties

### opts

```ts
opts: Options;
```

#### Defined in

[index.ts:36](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L36)

***

### DefaultOpts

```ts
static DefaultOpts: Partial<Options>;
```

#### Defined in

[index.ts:22](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L22)

## Accessors

### result

#### Get Signature

```ts
get result(): undefined | ProcessResult
```

##### Returns

`undefined` \| `ProcessResult`

#### Defined in

[index.ts:32](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L32)

## Methods

### getPalette()

```ts
getPalette(): Promise<Palette>
```

#### Returns

`Promise`\<`Palette`\>

#### Defined in

[index.ts:71](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L71)

***

### getPalettes()

```ts
getPalettes(): Promise<{}>
```

#### Returns

`Promise`\<\{\}\>

#### Defined in

[index.ts:93](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L93)

***

### palette()

```ts
palette(): Palette
```

#### Returns

`Palette`

#### Defined in

[index.ts:61](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L61)

***

### swatches()

```ts
swatches(): Palette
```

#### Returns

`Palette`

#### Defined in

[index.ts:65](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L65)

***

### from()

```ts
static from(src): Builder
```

#### Parameters

##### src

`ImageSource`

#### Returns

[`Builder`](builder.md)

#### Defined in

[index.ts:28](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L28)

***

### use()

```ts
static use(pipeline): void
```

#### Parameters

##### pipeline

`Pipeline`

#### Returns

`void`

#### Defined in

[index.ts:18](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/index.ts#L18)
