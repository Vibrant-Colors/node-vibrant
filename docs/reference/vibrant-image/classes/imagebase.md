---
id: ImageBase
title: ImageBase
---

# Class: `abstract` ImageBase

## Implements

- [`Image`](../interfaces/image.md)

## Constructors

### new ImageBase()

```ts
new ImageBase(): ImageBase
```

#### Returns

[`ImageBase`](imagebase.md)

## Methods

### clear()

```ts
abstract clear(): void
```

#### Returns

`void`

#### Implementation of

[`Image`](../interfaces/image.md).[`clear`](../interfaces/Image.md#clear)

#### Defined in

[index.ts:51](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L51)

***

### getHeight()

```ts
abstract getHeight(): number
```

#### Returns

`number`

#### Implementation of

[`Image`](../interfaces/image.md).[`getHeight`](../interfaces/Image.md#getheight)

#### Defined in

[index.ts:54](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L54)

***

### getImageData()

```ts
abstract getImageData(): ImageData
```

#### Returns

[`ImageData`](../interfaces/imagedata.md)

#### Implementation of

[`Image`](../interfaces/image.md).[`getImageData`](../interfaces/Image.md#getimagedata)

#### Defined in

[index.ts:61](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L61)

***

### getPixelCount()

```ts
abstract getPixelCount(): number
```

#### Returns

`number`

#### Implementation of

[`Image`](../interfaces/image.md).[`getPixelCount`](../interfaces/Image.md#getpixelcount)

#### Defined in

[index.ts:60](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L60)

***

### getWidth()

```ts
abstract getWidth(): number
```

#### Returns

`number`

#### Implementation of

[`Image`](../interfaces/image.md).[`getWidth`](../interfaces/Image.md#getwidth)

#### Defined in

[index.ts:53](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L53)

***

### load()

```ts
abstract load(image): Promise<ImageBase>
```

#### Parameters

##### image

[`ImageSource`](../type-aliases/imagesource.md)

#### Returns

`Promise`\<[`ImageBase`](imagebase.md)\>

#### Implementation of

[`Image`](../interfaces/image.md).[`load`](../interfaces/Image.md#load)

#### Defined in

[index.ts:50](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L50)

***

### remove()

```ts
abstract remove(): void
```

#### Returns

`void`

#### Implementation of

[`Image`](../interfaces/image.md).[`remove`](../interfaces/Image.md#remove)

#### Defined in

[index.ts:62](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L62)

***

### resize()

```ts
abstract resize(
   targetWidth, 
   targetHeight, 
   ratio): void
```

#### Parameters

##### targetWidth

`number`

##### targetHeight

`number`

##### ratio

`number`

#### Returns

`void`

#### Implementation of

[`Image`](../interfaces/image.md).[`resize`](../interfaces/Image.md#resize)

#### Defined in

[index.ts:55](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L55)

***

### scaleDown()

```ts
scaleDown(opts): void
```

#### Parameters

##### opts

[`ImageOptions`](../interfaces/imageoptions.md)

#### Returns

`void`

#### Implementation of

[`Image`](../interfaces/image.md).[`scaleDown`](../interfaces/Image.md#scaledown)

#### Defined in

[index.ts:64](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L64)

***

### update()

```ts
abstract update(imageData): void
```

#### Parameters

##### imageData

[`ImageData`](../interfaces/imagedata.md)

#### Returns

`void`

#### Implementation of

[`Image`](../interfaces/image.md).[`update`](../interfaces/Image.md#update)

#### Defined in

[index.ts:52](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L52)
