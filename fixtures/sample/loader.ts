import path from "path";
import { Sample } from "./types";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TestSample extends Sample {
  url: string;
  relativeUrl: string;
}

export const SNAPSHOT: Sample[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./images/palettes.json"), "utf-8")
);

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
