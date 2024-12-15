import { describe, it, beforeEach, afterEach } from "vitest";

const TEST_PORT = 3444;

import { loadTestSamples } from "../../../fixtures/sample/loader";

import { testVibrant, testVibrantAsPromised } from "./common/helper";

import { createSampleServer } from "../../../fixtures/sample/server";

import http from "http";

import Vibrant from "../src/node";

const SAMPLES = loadTestSamples(TEST_PORT);

describe("Palette Extraction", () => {
  describe("process samples", () =>
    SAMPLES.forEach((sample) => {
      it(
        `${sample.name} (callback)`,
        testVibrant(Vibrant, sample, "filePath", "node")
      );
      it(
        `${sample.name} (Promise)`,
        testVibrantAsPromised(Vibrant, sample, "filePath", "node")
      );
    }));

  describe("process remote images (http)", function () {
    let server: http.Server | null = null;

    beforeEach(async () => {
      server = createSampleServer();
      await new Promise<void>((resolve) =>
        server.listen(TEST_PORT, () => resolve())
      );
    });

    afterEach(
      async () =>
        await new Promise<void>((resolve) => server!.close(() => resolve()))
    );

    SAMPLES.forEach((sample) => {
      it(
        `${sample.url} (callback)`,
        testVibrant(Vibrant, sample, "url", "node")
      );
      it(
        `${sample.url} (Promise)`,
        testVibrantAsPromised(Vibrant, sample, "url", "node")
      );
    });
  });
});
