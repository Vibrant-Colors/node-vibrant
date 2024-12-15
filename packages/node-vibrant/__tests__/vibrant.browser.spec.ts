import { describe, it } from "vitest";
import { loadTestSamples } from "../../../fixtures/sample/loader";

import { testVibrant, testVibrantAsPromised } from "./common/helper";

import Vibrant from "../src/worker";

const SAMPLES = loadTestSamples();

describe("Palette Extraction", () => {
  SAMPLES.forEach((example) => {
    it(
      `${example.name} (callback)`,
      testVibrant(Vibrant, example, "relativeUrl", "browser")
    );
    it(
      `${example.name} (Promise)`,
      testVibrantAsPromised(Vibrant, example, "relativeUrl", "browser")
    );
  });
});
