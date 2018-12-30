import Vibrant = require('node-vibrant')
import * as React from 'react'
import { render } from 'react-dom'
import { Palette, Swatch } from 'node-vibrant/lib/color';

declare var CONTEXT: {
  samples: {
    name: string
    nodePalette: Palette
  }[]
}

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
      let { _rgb, _population } = color as any
      color = new Swatch(_rgb, _population)
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

interface SampleProps {
  name: string
  nodePalette: Palette
}

interface SampleState {
  url: string
  palette?: Palette
}

function getSampleUrl(name: string) {
  return name
}
class Sample extends React.Component<SampleProps, SampleState> {
  constructor(props: SampleProps) {
    super(props)
    this.state = {
      url: getSampleUrl(this.props.name)
    }
  }
  componentDidMount() {
    Vibrant.from(this.state.url)
      .quality(1)
      .getPalette()
      .then(palette => this.setState({ palette }))
  }
  render() {
    return (
      <div>
        <p>{this.props.name}</p>
        <img src={this.state.url} />
        <PaletteView palette={this.props.nodePalette} source="node" />
        {this.state.palette && <PaletteView palette={this.state.palette} source="browser" />}
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        {CONTEXT && CONTEXT.samples.map((sample) => <Sample key={sample.name} {...sample} />)}
      </div>
    )
  }
}

render(<App />, document.getElementById('container'))