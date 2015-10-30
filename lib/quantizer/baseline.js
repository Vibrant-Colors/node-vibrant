var BaselineQuantizer, Quantizer, Swatch, quantize,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Swatch = require('../swatch');

Quantizer = require('./index');

quantize = require('quantize');

module.exports = BaselineQuantizer = (function(superClass) {
  extend(BaselineQuantizer, superClass);

  function BaselineQuantizer() {
    return BaselineQuantizer.__super__.constructor.apply(this, arguments);
  }

  BaselineQuantizer.prototype.initialize = function(pixels, opts) {
    var a, allPixels, b, cmap, g, i, offset, pixelCount, r;
    this.opts = opts;
    pixelCount = pixels.length / 4;
    allPixels = [];
    i = 0;
    while (i < pixelCount) {
      offset = i * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];
      if (a >= 125) {
        if (!(r > 250 && g > 250 && b > 250)) {
          allPixels.push([r, g, b]);
        }
      }
      i = i + this.opts.quality;
    }
    cmap = quantize(allPixels, this.opts.colorCount);
    return this.swatches = cmap.vboxes.map((function(_this) {
      return function(vbox) {
        return new Swatch(vbox.color, vbox.vbox.count());
      };
    })(this));
  };

  BaselineQuantizer.prototype.getQuantizedColors = function() {
    return this.swatches;
  };

  return BaselineQuantizer;

})(Quantizer);
