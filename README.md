# node-vibrant
[![Build Status](https://travis-ci.org/akfish/node-vibrant.svg?branch=master)](https://travis-ci.org/akfish/node-vibrant)

Extract prominent colors from an image.

## ** NOTICE **

This project is refactored into a monorepo in version 3.2.0 (see [develop](https://github.com/akfish/node-vibrant/tree/develop) branch, npm version `node-vibrant@3.2.0-alpha`).

We will not merge new PRs to v3.1 related to new featuresets during this time. However, bug fixes and security vulnerability fixes are still highly encouraged. 

## New WebWorker support in v3.0

Quantization is the most time-consuming stage in `node-vibrant`. In v3.0, the quantization can be run in the WebWorker to avoid freezing the UI thread.

Here's how to use this feature:
1. Use WebWorker build `dist/vibrant.worker.js` or `dist/vibrant.worker.min.js`. Or if you are re-bundling with webpack, use `lib/bundle.worker.js` as entry
2. Use WebWorker quantizer:
   ```ts
   let v = Vibrant.from(src)
     .useQuantizer(Vibrant.Quantizer.WebWorker)
     // Other configurations
   ```

## Features
- Identical API for both node.js and browser environment
- Support browserify/webpack
- Consistent results (*See [Result Consistency](#result-consistency))

## Install

```bash
$ npm install node-vibrant
```

## Usage
### node.js / browserify

```js
// ES5
var Vibrant = require('node-vibrant')
// ES6
import * as Vibrant from 'node-vibrant'
// TypeScript
import Vibrant = require('node-vibrant')

// Using builder
Vibrant.from('path/to/image').getPalette((err, palette) => console.log(palette))
// Promise
Vibrant.from('path/to/image').getPalette()
  .then((palette) => console.log(palette))

// Using constructor
let v = new Vibrant('path/to/image', opts)
v.getPalette((err, palette) => console.log(palette))
// Promise
v.getPalette().then((palette) => console.log(palette))
```

### Browser

If you installed node-vibrant with `npm`, compiled bundles are available under `node_modules/node-vibrant/dist`.
Or you can download bundles from [Relases](https://github.com/akfish/node-vibrant/releases).

```html
<!-- Debug version -->
<script src="/path/to/dist/vibrant.js"></script>
<!-- Uglified version -->
<script src="/path/to/dist/vibrant.min.js"></script>

<script>
  // Use `Vibrant` in script
  // Vibrant is exported to global. window.Vibrant === Vibrant
  Vibrant.from('path/to/image').getPalette(function(err, palette) {});
  // Promise
  Vibrant.from('path/to/image').getPalette().then(function(palette) {});
  // Or
  var v = new Vibrant('/path/to/image', opts);
  // ... same as in node.js
</script>
```

## Contribution Guidelines
1. Make changes
2. Write test specs if necessary
3. Pass tests
4. Commit **source files only** (without compiled files)

## References

### `Vibrant`
Main class of `node-vibrant`.

#### `Vibrant.from(src: ImageSource): Builder`
Make a `Builder` for an image. Returns a `Builder` instance.

#### `constructor(src: ImageSource, opts: Partial<Options>)`

Name    |  Description
------- |  ---------------------------------------
`image` |  Path to image file (support HTTP/HTTPs)
`opts`  |  Options (optional)

##### `ImageSource`

```ts
export type ImageSource = string
  | HTMLImageElement  // Browser only
  | Buffer            // Node.js only
```

##### `Options`

```ts
export interface Options {
    colorCount: number
    quality: number
    maxDimension: number
    filters: Array<Filter>
    ImageClass: ImageClass
    quantizer: Quantizer
    generator?: Generator
}
```

Field          | Default                         | Description
-------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------
`colorCount`   | 64                              | amount of colors in initial palette from which the swatches will be generated
`quality`      | 5                               | Scale down factor used in downsampling stage. `1` means no downsampling. If `maxDimension` is set, this value will not be used.
`maxDimension` | `undefined`                     | The max size of the image's longer side used in downsampling stage. This field will override `quality`.
`filters`      | `[]`                            | An array of filters
`ImageClass`   | `Image.Node` or `Image.Browser` | An `Image` implementation class
`quantizer`    | `Vibrant.Quantizer.MMCQ`        | A `Quantizer` implementation class
`generator`    | `Vibrant.Generator.Default`     | An `Generator` instance

##### `Resolvable<T>`

```ts
export type Resolvable<T> = T | Promise<T>
```

##### `Quantizer`

```ts
export interface Quantizer {
    (pixels: Pixels, opts: Options): Resolvable<Array<Swatch>>
}
```

##### `Generator`

```ts
export interface Generator {
    (swatches: Array<Swatch>, opts?: Object): Resolvable<Palette>
}
```


##### `Filter`

Returns `true` if the color is to be kept.

```ts
export interface Filter {
    (red: number, green: number, blue: number, alpha: number): boolean
}
```

#### `getPalette(cb?: Callback<Palette>): Promise<Palette>`

Name | Description
---- | -----------------
`cb` | (Optional) callback function. Can be omitted when using `Promise`.

##### `Callback<T>`

```ts
export interface Callback<T> {
    (err?: Error, result?: T): void
}
```

#### `getSwatches(cb?: Callback<Palette>): Promise<Palette>`
Alias of `getPalette`.

### `Vibrant.Builder`
Helper class for change configurations and create a `Vibrant` instance. Methods of a `Builder` instance can be chained like:

```ts
Vibrant.from(src)
  .quality(1)
  .clearFilters()
  // ...
  .getPalette()
  .then((palette) => {})
```

#### `constructor(src: ImageSource, opts: Partial<Options>)`
Arguments are the same as `Vibrant.constructor`.

#### `quality(q: number): Builder`
Sets `opts.quality` to `q`. Returns this `Builder` instance.

#### `maxColorCount(n: number): Builder`
Sets `opts.colorCount` to `n`. Returns this `Builder` instance.

#### `maxDimension(d: number): Builder`
Sets `opts.maxDimension` to `d`. Returns this `Builder` instance.

#### `addFilter(f: Filter): Builder`
Adds a filter function. Returns this `Builder` instance.

#### `removeFilter(f: Filter): Builder`
Removes a filter function. Returns this `Builder` instance.

#### `clearFilters(): Builder`
Clear all filters. Returns this `Builder` instance.

#### `useImageClass(imageClass: ImageClass): Builder`
Specifies which `Image` implementation class to use. Returns this `Builder` instance.

#### `useQuantizer(quantizer: Quantizer): Builder`
Specifies which `Quantizer` implementation class to use. Returns this `Builder` instance.

#### `useGenerator(generator: Generator): Builder`
Sets `opts.generator` to `generator`. Returns this `Builder` instance.

#### `build(): Vibrant`
Builds and returns a `Vibrant` instance as configured.

#### `getPalette(cb?: Callback<Palette>): Promise<Palette>`
Builds a `Vibrant` instance as configured and calls its `getPalette` method.

#### `getSwatches(cb? Callback<Palette>): Promise<Palette>`
Alias of `getPalette`.

### `Vibrant.Swatch`
Represents a color swatch generated from an image's palette.

#### `Vec3`

```ts
export interface Vec3 extends Array<number> {
    0: number,
    1: number,
    2: number
}
```

#### `constructor(rgb: Vec3, population: number)`
Internal use.

Name         | Description
------------ | -----------------------------------
`rgb`        | `[r, g, b]`
`population` | Population of the color in an image

#### `getHsl(): Vec3`
#### `getPopulation(): number`
#### `getRgb(): Vec3`
#### `getHex(): string`
#### `getTitleTextColor(): string`
Returns an appropriate color to use for any 'title' text which is displayed over this `Swatch`'s color.

#### `getBodyTextColor(): string`
Returns an appropriate color to use for any 'body' text which is displayed over this `Swatch`'s color.

### `Vibrant.Util`
Utility methods. Internal usage.

#### `hexToRgb(hex: string): Vec3`
#### `rgbToHex(r: number, g: number, b: number): string`
#### `hslToRgb(h: number, s: number, l: number): Vec3`
#### `rgbToHsl(r: number, g: number, b: number): Vec3`
#### `xyzToRgb(x: number, y: number, z: number): Vec3`
#### `rgbToXyz(r: number, g: number, b: number): Vec3`
#### `xyzToCIELab(x: number, y: number, z: number): Vec3`
#### `rgbToCIELab(l: number, a: number, b: number): Vec3`
#### `deltaE94(lab1: number, lab2: number): number`
Computes CIE delta E 1994 diff between `lab1` and `lab2`. The 2 colors are in CIE-Lab color space. Used in tests to compare 2 colors' perceptual similarity.

#### `rgbDiff(rgb1: Vec3, rgb2: Vec3): number`
Compute CIE delta E 1994 diff between `rgb1` and `rgb2`.

#### `hexDiff(hex1: string, hex2: string): number`
Compute CIE delta E 1994 diff between `hex1` and `hex2`.

#### `getColorDiffStatus(d: number): string`
Gets a string to describe the meaning of the color diff. Used in tests.

Delta E  | Perception                             | Returns
-------- | -------------------------------------- | -----------
<= 1.0   | Not perceptible by human eyes.         | `"Perfect"`
1 - 2    | Perceptible through close observation. | `"Close"`
2 - 10   | Perceptible at a glance.               | `"Good"`
11 - 49  | Colors are more similar than opposite  | `"Similar"`
50 - 100 | Colors are exact opposite              | `Wrong`

## NPM Tasks

Task            | Description
--------------- | --------------------------------------
`build:browser` | Build browser target
`build:node`    | Build node.js target
`build`         | Build all targets
`clean:browser` | Clean browser build
`clean:node`    | Clean node.js build
`clean`         | Clean all builds
`test:browser`  | Run browser specs (karma)
`test:node`     | Run node.js specs (mocha)
`test`          | Run all specs

## Notes
### Intentional Deviation From `vibrant.js`
- `node-vibrant` takes image path, not the image object as parameter for the obvious reason that node.js environment has no access to HTML DOM object.
- `node-vibrant` provides asynchronous API since most node.js image processing library is asynchronous. And the original `vibrant.js` workflow is asynchronous any way (though you will have to handle the image loading yourself, while `node-vibrant` does it for you).
- `node-vibrant` uses one single `opts` object to hold all options for future expansions. And it feels more node.js-like.
- `node-vibrant` uses method call to initiate image processing instead of constructor so that developers can use it with `Promise`.

### Result Consistency
The results is consistent within each user's browser instance regardelss of visible region or display size of the image, unlike the original `vibrant.js` implementation.

However, due to the very nature of HTML5 canvas element, image rendering is platform/machine-dependent. Thus the resulting swatches in browser environment varies and may not be the same as in node.js nor in another machine. See [Canvas Fingerprinting](https://en.wikipedia.org/wiki/Canvas_fingerprinting).

The test specs use CIE delta E 1994 color difference to measure inconsistencies across platforms. It compares the generated color on node.js, Chrome, Firefox and IE11. At `quality` == 1 (no downsampling) and no filters, the results are rather consistent. Color diffs between browsers are mostly not perceptible by human eyes. Downsampling _will_ cause perceptible inconsistent results across browsers due to differences in canvas implementations.
