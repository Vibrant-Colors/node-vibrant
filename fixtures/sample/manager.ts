import path = require('path')
import Bluebird = require('bluebird')
import { Application } from 'express'
import { readdir, readFile, writeFile } from 'fs'
import bodyParser = require('body-parser')

const readdirAsync = Bluebird.promisify(readdir)
const readFileAsync = Bluebird.promisify<string, string, string>(readFile)
const writeFileAsync = Bluebird.promisify<void, string, string, string>(writeFile)

import Vibrant = require('../../src')
import { Sample, SampleContext } from './types';

async function listSampleFiles(folder: string) {
  return (<string[]>await readdirAsync(folder))
    .filter(f => /.jpg/i.test(f))
}

class Cooldown<T> {
  private _promise: Promise<T> | null
  _timer: NodeJS.Timeout;
  _resolve: (value?: {} | PromiseLike<{}>) => void;
  _reject: (reason?: any) => void;
  constructor(public readonly delay: number, public readonly task: () => T | PromiseLike<T>) {
  }
  done() {
    // Lazy initialize
    if (!this._promise) this.reset()
    // Reset timer
    clearTimeout(this._timer)
    this._timer = setTimeout(() => {
      this._promise = null
      this._resolve()
      this._resolve = null
      this._reject = null
    }, this.delay)

    return this._promise
  }
  reset() {
    if (this._promise) {
      this._reject('User cancelled')
      this._promise = null
      this._resolve = null
      this._reject = null
    }
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    }).then(() => Promise.resolve(this.task()))
  }
}


export class SampleManager {
  private _current: Sample[] | null
  private _snapshot: Sample[] | null
  constructor(public readonly sampleFolder: string) {

  }
  async getCurrent(): Bluebird<Sample[]> {
    if (!this._current) {
      this._current = await Bluebird.map(listSampleFiles(this.sampleFolder),
        (name: string) => {
          const filePath = path.join(__dirname, 'images', name)
          return Vibrant.from(filePath)
            .quality(1)
            .getPalette()
            .then(node => ({ name, palettes: { node }, filePath }))
        }
      )
      this.saveSnapshot()
    }
    return this._current
  }
  async getSnapshot(): Bluebird<Sample[] | null> {
    if (!this._snapshot) {
      try {
        const file = path.join(this.sampleFolder, 'palettes.json')
        this._snapshot = JSON.parse(await readFileAsync(file, 'utf8'))
        // Fill absolute file path
        this._snapshot.forEach(s => s.filePath = path.join(__dirname, 'images', s.name))
      } catch (e) {
        console.warn(`Failed to load snapshot: ${e}`)
      }
    }
    return this._snapshot
  }
  // Cool down timer
  private async _doSaveSnapshot(): Bluebird<boolean> {
    if (!this._current) {
      console.warn('No snapshot to be saved. (premature exit?)')
      return false
    }
    try {
      const file = path.join(this.sampleFolder, 'palettes.current.json')
      console.log(`Saving snapshot to ${file}`)
      // Ignore absolute file path
      const content = JSON.stringify(this._current, (key, value) => key === 'filePath' ? undefined : value, 2)
      await writeFileAsync(file, content, 'utf8')
      console.log(`Snapshot saved`)
      return true
    } catch (e) {
      console.warn(`Failed to save snapshot: ${e}`)
      return false
    }
  }
  private _saveTimer = new Cooldown(1000, () => this._doSaveSnapshot())
  async saveSnapshot(): Bluebird<boolean> {
    return this._saveTimer.done()
  }
  async getContext(): Bluebird<SampleContext> {
    return Bluebird.props({
      current: this.getCurrent(),
      snapshot: this.getSnapshot()
    })
  }
  buildMiddleware() {
    return (app: Application) => {
      app.use(bodyParser.json())
      app.post('/palettes', (req, res) => {
        const { name, palette } = req.body
        // TODO: better validation
        if (!name || !palette) {
          res.statusCode = 400
          console.warn('POST /palettes: received invalid payload:', JSON.stringify(req.body))
        } else {
          console.log(`Received browser palette for '${name}'`)

          const sample = this._current!.find(s => s.name === name)
          if (!sample) {
            console.error(`No such sample named '${name}`)
            res.statusCode = 400
          } else {
            sample.palettes['browser'] = palette
            this.saveSnapshot()
            // Accepted
            res.statusCode = 202
          }
        }
        res.send()
      })
    }
  }
}