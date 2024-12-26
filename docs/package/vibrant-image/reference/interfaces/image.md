---
id: Image
title: Image
---

# Interface: Image

## Methods

### clear()

```ts
clear(): void
```

#### Returns

`void`

#### Defined in

[index.ts:34](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L34)

***

### getHeight()

```ts
getHeight(): number
```

#### Returns

`number`

#### Defined in

[index.ts:37](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L37)

***

### getImageData()

```ts
getImageData(): ImageData
```

#### Returns

[`ImageData`](imagedata.md)

#### Defined in

[index.ts:40](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L40)

***

### getPixelCount()

```ts
getPixelCount(): number
```

#### Returns

`number`

#### Defined in

[index.ts:39](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L39)

***

### getWidth()

```ts
getWidth(): number
```

#### Returns

`number`

#### Defined in

[index.ts:36](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L36)

***

### load()

```ts
load(image): Promise<Image>
```

#### Parameters

##### image

[`ImageSource`](../type-aliases/imagesource.md)

#### Returns

`Promise`\<[`Image`](image.md)\>

#### Defined in

[index.ts:33](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L33)

***

### remove()

```ts
remove(): void
```

#### Returns

`void`

#### Defined in

[index.ts:41](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L41)

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

#### Defined in

[index.ts:38](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L38)

***

### scaleDown()

```ts
scaleDown(opts): void
```

#### Parameters

##### opts

[`ImageOptions`](imageoptions.md)

#### Returns

`void`

#### Defined in

[index.ts:42](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L42)

***

### update()

```ts
update(imageData): void
```

#### Parameters

##### imageData

[`ImageData`](imagedata.md)

#### Returns

`void`

#### Defined in

[index.ts:35](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L35)
