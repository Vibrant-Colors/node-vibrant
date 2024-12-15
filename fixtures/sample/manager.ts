import path from "path";
import { Application } from "express";
import { promises } from "fs";
import { json as bodyParserJson } from "body-parser";
import { defer, Defer } from "@vibrant/types";

const readdirAsync = promises.readdir;
const readFileAsync = promises.readFile;
const writeFileAsync = promises.writeFile;

import Vibrant from "node-vibrant";
import { Sample, SampleContext } from "./types";

async function listSampleFiles(folder: string) {
  return ((await readdirAsync(folder)) as string[]).filter((f) =>
    /.jpg/i.test(f)
  );
}

class Cooldown<T> {
  _timer: any;
  _promise: Promise<T> | null = null;
  _barrier: Defer<void> | null = null;
  constructor(
    public readonly delay: number,
    public readonly task: () => T | PromiseLike<T>
  ) {}
  done() {
    // Lazy initialize
    if (!this._barrier) this.reset();
    // Reset timer
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this._barrier!.resolve();
      this._barrier = null;
      this._promise = null;
    }, this.delay);

    return this._promise!;
  }
  reset() {
    if (this._barrier) {
      this._barrier.reject("User cancelled");
      this._barrier = null;
      this._promise = null;
    }
    this._barrier = defer<void>();
    this._promise = this._barrier.promise.then(() =>
      Promise.resolve(this.task())
    );
  }
}

export class SampleManager {
  private _current: Sample[] | null;
  private _snapshot: Sample[] | null;
  constructor(public readonly sampleFolder: string) {}
  async getCurrent(): Promise<Sample[]> {
    if (!this._current) {
      const files = await listSampleFiles(this.sampleFolder);
      this._current = await Promise.all(
        files.map(async (name: string) => {
          const filePath = path.join(__dirname, "images", name);
          const palette = await Vibrant.from(filePath).quality(1).getPalette();
          return { name, palettes: { node: palette }, filePath };
        })
      );
      this.saveSnapshot();
    }
    return this._current;
  }
  async getSnapshot(): Promise<Sample[] | null> {
    if (!this._snapshot) {
      try {
        const file = path.join(this.sampleFolder, "palettes.json");
        this._snapshot = JSON.parse(await readFileAsync(file, "utf8"));
        // Fill absolute file path
        this._snapshot!.forEach(
          (s) => (s.filePath = path.join(__dirname, "images", s.name))
        );
      } catch (e) {
        console.warn(`Failed to load snapshot: ${e}`);
      }
    }
    return this._snapshot;
  }
  // Cool down timer
  private async _doSaveSnapshot(): Promise<boolean> {
    if (!this._current) {
      console.warn("No snapshot to be saved. (premature exit?)");
      return false;
    }
    try {
      const file = path.join(this.sampleFolder, "palettes.current.json");
      console.log(`Saving snapshot to ${file}`);
      // Ignore absolute file path
      const content = JSON.stringify(
        this._current,
        (key, value) => (key === "filePath" ? undefined : value),
        2
      );
      await writeFileAsync(file, content, "utf8");
      console.log(`Snapshot saved`);
      return true;
    } catch (e) {
      console.warn(`Failed to save snapshot: ${e}`);
      return false;
    }
  }
  private _saveTimer = new Cooldown(1000, () => this._doSaveSnapshot());
  async saveSnapshot(): Promise<boolean> {
    return this._saveTimer.done();
  }
  async getContext(): Promise<SampleContext> {
    const [current, snapshot] = await Promise.all([
      this.getCurrent(),
      this.getSnapshot(),
    ]);
    return { current, snapshot };
  }
  buildMiddleware() {
    return () => (app: Application) => {
      app.use(bodyParserJson());
      app.post("/palettes", (req, res) => {
        const { name, palette } = req.body;
        // TODO: better validation
        if (!name || !palette) {
          res.statusCode = 400;
          console.warn(
            "POST /palettes: received invalid payload:",
            JSON.stringify(req.body)
          );
        } else {
          console.log(`Received browser palette for '${name}'`);

          const sample = this._current!.find((s) => s.name === name);
          if (!sample) {
            console.error(`No such sample named '${name}`);
            res.statusCode = 400;
          } else {
            sample.palettes["browser"] = palette;
            this.saveSnapshot();
            // Accepted
            res.statusCode = 202;
          }
        }
        res.send();
      });
    };
  }
}
