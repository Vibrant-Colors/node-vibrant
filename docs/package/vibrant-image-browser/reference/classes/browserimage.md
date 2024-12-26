---
id: BrowserImage
title: BrowserImage
---

# Class: BrowserImage

## Extends

- `ImageBase`

## Constructors

### new BrowserImage()

```ts
new BrowserImage(): BrowserImage
```

#### Returns

[`BrowserImage`](browserimage.md)

#### Inherited from

`ImageBase.constructor`

## Properties

### image

```ts
image: undefined | HTMLImageElement;
```

#### Defined in

[index.ts:29](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L29)

## Methods

### clear()

```ts
clear(): void
```

#### Returns

`void`

#### Overrides

`ImageBase.clear`

#### Defined in

[index.ts:125](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L125)

***

### getHeight()

```ts
getHeight(): number
```

#### Returns

`number`

#### Overrides

`ImageBase.getHeight`

#### Defined in

[index.ts:137](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L137)

***

### getImageData()

```ts
getImageData(): ImageData
```

#### Returns

`ImageData`

#### Overrides

`ImageBase.getImageData`

#### Defined in

[index.ts:156](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L156)

***

### getPixelCount()

```ts
getPixelCount(): number
```

#### Returns

`number`

#### Overrides

`ImageBase.getPixelCount`

#### Defined in

[index.ts:152](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L152)

***

### getWidth()

```ts
getWidth(): number
```

#### Returns

`number`

#### Overrides

`ImageBase.getWidth`

#### Defined in

[index.ts:133](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L133)

***

### load()

```ts
load(image): Promise<BrowserImage>
```

#### Parameters

##### image

`ImageSource`

#### Returns

`Promise`\<[`BrowserImage`](browserimage.md)\>

#### Overrides

`ImageBase.load`

#### Defined in

[index.ts:87](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L87)

***

### remove()

```ts
remove(): void
```

#### Returns

`void`

#### Overrides

`ImageBase.remove`

#### Defined in

[index.ts:165](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L165)

***

### resize()

```ts
resize(
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

#### Overrides

`ImageBase.resize`

#### Defined in

[index.ts:141](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L141)

***

### update()

```ts
update(imageData): void
```

#### Parameters

##### imageData

`ImageData`

#### Returns

`void`

#### Overrides

`ImageBase.update`

#### Defined in

[index.ts:129](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-browser/src/index.ts#L129)
