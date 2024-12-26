---
id: Builder
title: Builder
---

# Class: Builder

Helper class for change configurations and create a Vibrant instance. Methods of a Builder instance can be chained like:

## Example

```javascript
Vibrant.from(src)
  .quality(1)
  .clearFilters()
  // ...
  .getPalette()
  .then((palette) => {})
```

## Constructors

### new Builder()

```ts
new Builder(src, opts): Builder
```

Arguments are the same as `Vibrant.constructor`.

#### Parameters

##### src

`ImageSource`

##### opts

`Partial`\<`Options`\> = `{}`

#### Returns

[`Builder`](builder.md)

#### Defined in

[builder.ts:28](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L28)

## Methods

### addFilter()

```ts
addFilter(name): Builder
```

Adds a filter function

#### Parameters

##### name

`string`

#### Returns

[`Builder`](builder.md)

this `Builder` instance.

#### Defined in

[builder.ts:55](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L55)

***

### build()

```ts
build(): Vibrant
```

Builds and returns a `Vibrant` instance as configured.

#### Returns

[`Vibrant`](vibrant.md)

#### Defined in

[builder.ts:127](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L127)

***

### clearFilters()

```ts
clearFilters(): Builder
```

Clear all filters.

#### Returns

[`Builder`](builder.md)

this `Builder` instance.

#### Defined in

[builder.ts:80](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L80)

***

### getPalette()

```ts
getPalette(): Promise<Palette>
```

Builds a `Vibrant` instance as configured and calls its `getPalette` method.

#### Returns

`Promise`\<`Palette`\>

#### Defined in

[builder.ts:134](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L134)

***

### maxColorCount()

```ts
maxColorCount(n): Builder
```

Sets `opts.colorCount` to `n`.

#### Parameters

##### n

`number`

#### Returns

[`Builder`](builder.md)

this `Builder` instance.

#### Defined in

[builder.ts:37](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L37)

***

### maxDimension()

```ts
maxDimension(d): Builder
```

Sets `opts.maxDimension` to `d`.

#### Parameters

##### d

`number`

#### Returns

[`Builder`](builder.md)

this `Builder` instance.

#### Defined in

[builder.ts:46](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L46)

***

### quality()

```ts
quality(q): Builder
```

Sets `opts.quality` to `q`.

#### Parameters

##### q

`number`

#### Returns

[`Builder`](builder.md)

this `Builder` instance.

#### Defined in

[builder.ts:89](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L89)

***

### removeFilter()

```ts
removeFilter(name): Builder
```

Removes a filter function.

#### Parameters

##### name

`string`

#### Returns

[`Builder`](builder.md)

this `Builder` instance.

#### Defined in

[builder.ts:68](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L68)

***

### useGenerator()

```ts
useGenerator(generator, options?): Builder
```

Sets `opts.generator` to `generator`

#### Parameters

##### generator

`string`

##### options?

`any`

#### Returns

[`Builder`](builder.md)

this `Builder` instance.

#### Defined in

[builder.ts:107](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L107)

***

### useImageClass()

```ts
useImageClass(imageClass): Builder
```

Specifies which `Image` implementation class to use.

#### Parameters

##### imageClass

`ImageClass`

#### Returns

[`Builder`](builder.md)

this `Builder` instance.

#### Defined in

[builder.ts:98](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L98)

***

### useQuantizer()

```ts
useQuantizer(quantizer, options?): Builder
```

Specifies which `Quantizer` implementation class to use

#### Parameters

##### quantizer

`string`

##### options?

`any`

#### Returns

[`Builder`](builder.md)

this `Builder` instance.

#### Defined in

[builder.ts:119](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-core/src/builder.ts#L119)
