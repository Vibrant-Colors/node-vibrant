import path = require("path");
import { Sample } from "./types";

export interface TestSample extends Sample {
  url: string;
  relativeUrl: string;
}

export const SNAPSHOT: Sample[] = require("fixtures/sample/images/palettes.json");

export interface TestSample extends Sample {
  url: string;
  relativeUrl: string;
}

export type SamplePathKey = Exclude<keyof TestSample, "palettes">;

export function loadTestSamples(
  port = 80,
  relativeBase = "base/fixtures/sample/images"
): TestSample[] {
  const urlBase = "http://localhost" + (port === 80 ? "" : `:${port}`);
  return SNAPSHOT.map((s) =>
    Object.assign(s, {
      filePath: path.join(__dirname, "images", s.name),
      url: `${urlBase}/${s.name}`,
      relativeUrl: `${relativeBase}/${s.name}`,
    })
  );
}
