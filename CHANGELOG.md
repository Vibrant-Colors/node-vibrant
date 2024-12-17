# v4.0.0

`node-vibrant`'s internal packaging is now vastly more stable and improved. We'll continue to ship the default package with the same API as before, but now you can also import individual modules for more control over your environment.

## Breaking Changes

- You now must import from `node-vibrant/browser`, `node-vibrant/node`, or `node-vibrant/worker` to get the correct environment-specific implementation
- `Vibrant` class is now a default export
- Node 18+ is now required
- ES5 support is dropped

# v3.2.0

`node-vibrant` is now a monorepo. Building blocks of `node-vibrant` has been separated into multiple small packages under `@vibrant/*` scope. The goal is to make it more flexible, allowing alternative algorithms, additional image format support and etc to be implemented by 3rd party packages.

The `node-vibrant` package still provides default experience out-of-box.

## Breaking Changes

- `strickNullChecks` flag is now enabled.
- Prebuilt bundle will not be provided. You should use your own `webpack` workflow.

# 3.1.0

- Fix empty swatches sometimes showing up for images
- Update deps
- Moved from Bluebird to native promises
- Fix issue with dist folder not appearing on install
- Fix issue with images not loading properly

# 3.0.0

## New WebWorker support in v3.0

Quantization is the most time-consuming stage in `node-vibrant`. In v3.0, the quantization can be run in the WebWorker to avoid freezing the UI thread.

Here's how to use this feature:

1. Use WebWorker build `dist/vibrant.worker.js` or `dist/vibrant.worker.min.js`. Or if you are re-bundling with webpack, use `lib/bundle.worker.js` as entry
2. Use WebWorker quantizer:
   ```ts
   let v = Vibrant.from(src).useQuantizer(Vibrant.Quantizer.WebWorker);
   // Other configurations
   ```
