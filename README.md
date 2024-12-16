# node-vibrant

<img align="right" width="265" src="logo.png?raw=true">

[![Slack badge](https://badgen.net/badge/slack/node-vibrant?icon=slack)](https://join.slack.com/t/node-vibrant/shared_invite/enQtNTI2Mzg2NDk5MzUxLTdkN2EwMWNkYjY0MjNiMmI2YzFjZWM3Njc3ZDJmOWVkMzBkNzYzMDBhZTBiMGI0MjAyMmJhNDc0YTNlNjA5ZGY)
[![Build Status](https://badgen.net/travis/akfish/node-vibrant/develop?label=build)](https://travis-ci.org/akfish/node-vibrant)

Extract prominent colors from an image.

- Identical API for node.js, browser, and worker environments

## Install

```bash
$ npm install node-vibrant
```

## Usage

```typescript
// Node
import Vibrant from 'node-vibrant/node'
// Browser
import Vibrant from 'node-vibrant/browser'
// Web Worker
import Vibrant from 'node-vibrant/worker'

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

## Documentation

Documentation is currently in the works. Apologies for the inconvenience.

## Notes

### Result Consistency

The results are consistent within each user's browser instance regardless of the visible region or display size of an image, unlike the original `vibrant.js` implementation.

However, due to the nature of the HTML5 canvas element, image rendering is platform/machine-dependent. The resulting swatches may vary between browsers, Node.js versions, and between machines. See [Canvas Fingerprinting](https://en.wikipedia.org/wiki/Canvas_fingerprinting).

The test specs use CIE delta E 1994 color difference to measure inconsistencies across platforms. It compares the generated color on Node.js, Chrome, Firefox, and IE11. At `quality` == 1 (no downsampling) with no filters and the results are rather consistent. Color diffs between browsers are mostly not perceptible by the human eye. Downsampling _will_ cause perceptible inconsistent results across browsers due to differences in canvas implementations.
