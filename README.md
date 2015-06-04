# node-vibrant
Extract prominent colors from an image.

`node-vibrant` is a node.js port of [Vibrant.js](https://github.com/jariz/vibrant.js), which is a javascript port of the [awesome Palette class](https://developer.android.com/reference/android/support/v7/graphics/Palette.html) in the Android support library.

## Install

```bash
$ npm install node-vibrant
```

## Usage

```coffee
Vibrant = require('node-vibrant')

v = new Vibrant('path/to/image', opts)
v.getSwatches (err, swatches) ->
  console.log(swatches)
```

## References

### `Vibrant.constructor(imagePath, opts)`

Name | Type | Description
---- | ---- | --------------
`imagePath` | string | Path to image file
`opts` | object | Options (optional)

#### `opts`

Field | Default | Description
----- | ------- | -----------
`colorCount` | `64` | amount of colors in initial palette from which the swatches will be generated
`quality` | `5` | 0 is highest, but takes way more processing

### `Vibrant.getSwatches(cb)`

Name | Type | Description
---- | ---- | --------------
`cb` | function | callback function

#### `cb(err, swatches)`

Name | Type | Description
---- | ---- | --------------
`err` | object | Error (if thrown)
`swatches` | object | Resulting swatches
