---
id: ImageOptions
title: ImageOptions
---

# Interface: ImageOptions

## Properties

### maxDimension

```ts
maxDimension: number;
```

The max size of the image's longer side used in downsampling stage. This field will override `quality`.

#### Default

```ts
undefined
```

#### Defined in

[index.ts:29](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L29)

***

### quality

```ts
quality: number;
```

Scale down factor used in downsampling stage. 1 means no downsampling. If `maxDimension` is set, this value will not be used.

#### Default

```ts
5
```

#### Defined in

[index.ts:24](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/index.ts#L24)
