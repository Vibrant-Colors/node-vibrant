---
id: Swatch
title: Swatch
---

# Class: Swatch

Represents a color swatch generated from an image's palette.

## Constructors

### new Swatch()

```ts
new Swatch(rgb, population): Swatch
```

Internal use.

#### Parameters

##### rgb

[`Vec3`](../type-aliases/vec3.md)

`[r, g, b]`

##### population

`number`

Population of the color in an image

#### Returns

[`Swatch`](swatch.md)

#### Defined in

[index.ts:155](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L155)

## Accessors

### b

#### Get Signature

```ts
get b(): number
```

The blue value in the RGB value

##### Returns

`number`

#### Defined in

[index.ts:74](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L74)

***

### bodyTextColor

#### Get Signature

```ts
get bodyTextColor(): string
```

Returns an appropriate color to use for any 'body' text which is displayed over this Swatch's color.

##### Returns

`string`

#### Defined in

[index.ts:143](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L143)

***

### g

#### Get Signature

```ts
get g(): number
```

The green value in the RGB value

##### Returns

`number`

#### Defined in

[index.ts:68](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L68)

***

### hex

#### Get Signature

```ts
get hex(): string
```

The color value as a hex string

##### Returns

`string`

#### Defined in

[index.ts:97](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L97)

***

### hsl

#### Get Signature

```ts
get hsl(): Vec3
```

The color value as a hsl value

##### Returns

[`Vec3`](../type-aliases/vec3.md)

#### Defined in

[index.ts:86](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L86)

***

### population

#### Get Signature

```ts
get population(): number
```

##### Returns

`number`

#### Defined in

[index.ts:105](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L105)

***

### r

#### Get Signature

```ts
get r(): number
```

The red value in the RGB value

##### Returns

`number`

#### Defined in

[index.ts:62](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L62)

***

### rgb

#### Get Signature

```ts
get rgb(): Vec3
```

The color value as a rgb value

##### Returns

[`Vec3`](../type-aliases/vec3.md)

#### Defined in

[index.ts:80](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L80)

***

### titleTextColor

#### Get Signature

```ts
get titleTextColor(): string
```

Returns an appropriate color to use for any 'title' text which is displayed over this Swatch's color.

##### Returns

`string`

#### Defined in

[index.ts:133](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L133)

## Methods

### toJSON()

```ts
toJSON(): object
```

Get the JSON object for the swatch

#### Returns

`object`

##### population

```ts
population: number;
```

##### rgb

```ts
rgb: Vec3;
```

#### Defined in

[index.ts:112](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L112)

***

### applyFilters()

```ts
static applyFilters(colors, filters): Swatch[]
```

#### Parameters

##### colors

[`Swatch`](swatch.md)[]

##### filters

[`Filter`](../interfaces/filter.md)[]

#### Returns

[`Swatch`](swatch.md)[]

#### Defined in

[index.ts:35](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L35)

***

### clone()

```ts
static clone(swatch): Swatch
```

Make a value copy of a swatch based on a previous one. Returns a new Swatch instance

#### Parameters

##### swatch

[`Swatch`](swatch.md)

#### Returns

[`Swatch`](swatch.md)

#### Defined in

[index.ts:50](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/index.ts#L50)
