import Vibrant = require('node-vibrant')
import * as React from 'react'
import { render } from 'react-dom'
import { Palette, Swatch } from 'node-vibrant/lib/color'
import { SampleContext } from './types'
import { Sample } from "./types";

declare var CONTEXT: SampleContext

interface SwatchProps {
  name: string
  color?: Swatch
}

interface SwatchState {
  hex: string
}

class SwatchView extends React.Component<SwatchProps, SwatchState> {
  constructor(props: SwatchProps) {
    super(props)

    let color = this.props.color
    // Is plain JSON injected by webpack.DefinePlugin?
    if (color && !(this.props.color instanceof Swatch)) {
      // Re-hydrate
      let { rgb, population } = color
      color = new Swatch(rgb, population)
    }

    this.state = {
      hex: this.props.color ? color.hex : 'transparent'
    }
  }
  render() {
    return (
      <div
        className="color-block"
        style={{
          position: 'relative',
          width: '64px',
          height: '64px',
          display: 'inline-block',
          background: this.state.hex
        }}
      >
        {this.props.name}
      </div>
    )
  }
}

interface PaletteProps {
  source: string
  palette: Palette
}

const PALETTE_KEYS = [
  'Vibrant',
  'Muted',
  'DarkVibrant',
  'DarkMuted',
  'LightVibrant',
  'LightMuted'
]

class PaletteView extends React.Component<PaletteProps> {
  render() {
    return (
      <div>
        <p>{this.props.source}</p>
        <div>
          {PALETTE_KEYS.map(name => <SwatchView key={name} name={name} color={this.props.palette[name]} />)}
        </div>
      </div>
    )
  }
}

interface SampleProps extends Sample {
}

interface SampleState {
  url: string
  palette?: Palette
}

function getSampleUrl(name: string) {
  return name
}

class SampleView extends React.Component<SampleProps, SampleState> {
  constructor(props: SampleProps) {
    super(props)
    this.state = {
      url: getSampleUrl(this.props.name)
    }
  }
  private _onPalette(palette: Palette) {
    this.setState({ palette })

    fetch('/palettes', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.props.name,
        palette
      })
    })
      .then(() => console.log(`Palette for '${this.props.name}' sent`))
      .catch((e) => console.error(`Failed to send palette for '${this.props.name}': ${e}`))
  }
  componentDidMount() {
    Vibrant.from(this.state.url)
      .quality(1)
      .getPalette()
      .then(palette => this._onPalette(palette))
  }
  render() {
    const { name, palettes } = this.props
    return (
      <div>
        <p>{name}</p>
        <img src={this.state.url} />
        {Object.keys(palettes).map(source => <PaletteView key={source} palette={palettes[source]} {...{ source }} />)}
        {this.state.palette && <PaletteView palette={this.state.palette} source="browser" />}
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        {CONTEXT && CONTEXT.current.map((sample) => <SampleView key={sample.name} {...sample} />)}
      </div>
    )
  }
}

render(<App />, document.getElementById('container'))