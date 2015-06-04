expectedSwatches =
  1:
    Vibrant:      "#6174CD"
    Muted:        "#6C5758"
    DarkVibrant:  "#423C8D"
    DarkMuted:    "#12151E"
    LightVibrant: "#C7B060"
    LightMuted:   "#C9C4CA"
  2:
    Vibrant:      "#2C41A7"
    Muted:        "#7D8B9B"
    DarkVibrant:  "#CF9D13"
    DarkMuted:    "#66635C"
    LightVibrant: "#E2E2E1"
    LightMuted:   null
  3:
    Vibrant:      "#E34C4A"
    Muted:        "#646A50"
    DarkVibrant:  "#06362A"
    DarkMuted:    "#557B69"
    LightVibrant: "#FBF2EA"
    LightMuted:   "#AF9E82"
  4:
    Vibrant:      "#BA9945"
    Muted:        "#847C8C"
    DarkVibrant:  "#3C1E18"
    DarkMuted:    "#080604"
    LightVibrant: "#DE56B8"
    LightMuted:   null

expect = require('chai').expect
path = require('path')
Vibrant = require('../src/vibrant')

testVibrant = (i) ->
  p = path.join __dirname, "/examples/#{i}.jpg"
  console.log "Process #{p}"
  v = new Vibrant(p)
  actual = v.swatches()
  for name, value of expectedSwatches[i]
    expect(actual).to.have.property name
    expect(actual[name].getHex()).to.equal value

describe "node-vibrant", ->
  it "should extract same swatches as vibrant.js", ->
    for i in [1..4]
      testVibrant i
