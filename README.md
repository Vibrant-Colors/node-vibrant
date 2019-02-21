# node-vibrant
![Vibrant Logo](logo.png?raw=true "Vibrant Logo")

[![Slack badge](https://img.shields.io/badge/slack-node_vibrant-blue.svg?logo=slack&style=plastic)](https://join.slack.com/t/node-vibrant/shared_invite/enQtNTI2Mzg2NDk5MzUxLTdkN2EwMWNkYjY0MjNiMmI2YzFjZWM3Njc3ZDJmOWVkMzBkNzYzMDBhZTBiMGI0MjAyMmJhNDc0YTNlNjA5ZGY)
[![Build Status](https://travis-ci.org/akfish/node-vibrant.svg?branch=develop)](https://travis-ci.org/akfish/node-vibrant)

Extract prominent colors from an image.

- Identical API for both node.js and browser environment (with web worker)
- Support webpack

## Install

```bash
$ npm install node-vibrant@3.2.0.alpha
```

## Usage

```typescript
// ES5
var Vibrant = require('node-vibrant')
// ES6
import * as Vibrant from 'node-vibrant'
// Or
const Vibrant = require('node-vibrant')
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

## Webpack configuration

The default browser entry for `node-vibrant` has web worker support. You should make sure that `worker-loader` is installed:

```
$ npm install --save-dev worker-loader
```

Add rules:
```js
{
  // ...
  module: {
    rules: [
      {
        test: /\.worker.js$/,
        loader: 'worker-loader',
        options: { /* ... */ }
      },
      // ...
    ]
  }
}
```

## Documentation

TODO

## Notes

### Result Consistency
The results is consistent within each user's browser instance regardless of the visible region or display size of an image, unlike the original `vibrant.js` implementation.

However, due to the nature of the HTML5 canvas element, image rendering is platform/machine-dependent. The resulting swatches may vary between browsers, Node.js versions, and between machines. See [Canvas Fingerprinting](https://en.wikipedia.org/wiki/Canvas_fingerprinting).

The test specs use CIE delta E 1994 color difference to measure inconsistencies across platforms. It compares the generated color on Node.js, Chrome, Firefox and IE11. At `quality` == 1 (no downsampling) with no filters and the results are rather consistent. Color diffs between browsers are mostly not perceptible by the human eye. Downsampling _will_ cause perceptible inconsistent results across browsers due to differences in canvas implementations.
