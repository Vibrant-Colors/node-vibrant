---
id: NodeImage
title: NodeImage
---

# Class: NodeImage

## Extends

- `ImageBase`

## Constructors

### new NodeImage()

```ts
new NodeImage(): NodeImage
```

#### Returns

[`NodeImage`](nodeimage.md)

#### Inherited from

`ImageBase.constructor`

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

[index.ts:83](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-node/src/index.ts#L83)

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

[index.ts:91](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-node/src/index.ts#L91)

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

[index.ts:104](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-node/src/index.ts#L104)

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

[index.ts:99](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-node/src/index.ts#L99)

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

[index.ts:87](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-node/src/index.ts#L87)

***

### load()

```ts
load(image): Promise<ImageBase>
```

#### Parameters

##### image

`ImageSource`

#### Returns

`Promise`\<`ImageBase`\>

#### Overrides

`ImageBase.load`

#### Defined in

[index.ts:69](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-node/src/index.ts#L69)

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

[index.ts:108](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-node/src/index.ts#L108)

***

### resize()

```ts
resize(
   targetWidth, 
   targetHeight, 
   _ratio): void
```

#### Parameters

##### targetWidth

`number`

##### targetHeight

`number`

##### \_ratio

`number`

#### Returns

`void`

#### Overrides

`ImageBase.resize`

#### Defined in

[index.ts:95](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-node/src/index.ts#L95)

***

### update()

```ts
update(_imageData): void
```

#### Parameters

##### \_imageData

`ImageData`

#### Returns

`void`

#### Overrides

`ImageBase.update`

#### Defined in

[index.ts:85](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image-node/src/index.ts#L85)
