---
id: Histogram
title: Histogram
---

# Class: Histogram

## Constructors

### new Histogram()

```ts
new Histogram(pixels, opts): Histogram
```

#### Parameters

##### pixels

[`Pixels`](../type-aliases/pixels.md)

##### opts

[`HistogramOptions`](../interfaces/histogramoptions.md)

#### Returns

[`Histogram`](histogram.md)

#### Defined in

[histogram.ts:20](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L20)

## Properties

### bmax

```ts
bmax: number;
```

#### Defined in

[histogram.ts:9](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L9)

***

### bmin

```ts
bmin: number;
```

#### Defined in

[histogram.ts:8](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L8)

***

### getColorIndex()

```ts
getColorIndex: (r, g, b) => number;
```

#### Parameters

##### r

`number`

##### g

`number`

##### b

`number`

#### Returns

`number`

#### Defined in

[histogram.ts:19](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L19)

***

### gmax

```ts
gmax: number;
```

#### Defined in

[histogram.ts:11](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L11)

***

### gmin

```ts
gmin: number;
```

#### Defined in

[histogram.ts:10](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L10)

***

### hist

```ts
hist: Uint32Array;
```

#### Defined in

[histogram.ts:14](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L14)

***

### opts

```ts
opts: HistogramOptions;
```

#### Defined in

[histogram.ts:22](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L22)

***

### pixels

```ts
pixels: Pixels;
```

#### Defined in

[histogram.ts:21](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L21)

***

### rmax

```ts
rmax: number;
```

#### Defined in

[histogram.ts:13](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L13)

***

### rmin

```ts
rmin: number;
```

#### Defined in

[histogram.ts:12](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L12)

## Accessors

### colorCount

#### Get Signature

```ts
get colorCount(): number
```

##### Returns

`number`

#### Defined in

[histogram.ts:16](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-image/src/histogram.ts#L16)
