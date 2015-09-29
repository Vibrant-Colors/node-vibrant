
/*
  From Vibrant.js by Jari Zwarts
  Ported to node.js by AKFish

  Color algorithm class that finds variations on colors in an image.

  Credits
  --------
  Lokesh Dhakar (http://www.lokeshdhakar.com) - Created ColorThief
  Google - Palette support library in Android
 */
var Swatch, Vibrant, util,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

Swatch = require('./swatch');

util = require('./util');

module.exports = Vibrant = (function() {
  Vibrant.prototype.quantize = require('quantize');

  Vibrant.prototype._swatches = [];

  Vibrant.prototype.TARGET_DARK_LUMA = 0.26;

  Vibrant.prototype.MAX_DARK_LUMA = 0.45;

  Vibrant.prototype.MIN_LIGHT_LUMA = 0.55;

  Vibrant.prototype.TARGET_LIGHT_LUMA = 0.74;

  Vibrant.prototype.MIN_NORMAL_LUMA = 0.3;

  Vibrant.prototype.TARGET_NORMAL_LUMA = 0.5;

  Vibrant.prototype.MAX_NORMAL_LUMA = 0.7;

  Vibrant.prototype.TARGET_MUTED_SATURATION = 0.3;

  Vibrant.prototype.MAX_MUTED_SATURATION = 0.4;

  Vibrant.prototype.TARGET_VIBRANT_SATURATION = 1;

  Vibrant.prototype.MIN_VIBRANT_SATURATION = 0.35;

  Vibrant.prototype.WEIGHT_SATURATION = 3;

  Vibrant.prototype.WEIGHT_LUMA = 6;

  Vibrant.prototype.WEIGHT_POPULATION = 1;

  Vibrant.prototype.VibrantSwatch = void 0;

  Vibrant.prototype.MutedSwatch = void 0;

  Vibrant.prototype.DarkVibrantSwatch = void 0;

  Vibrant.prototype.DarkMutedSwatch = void 0;

  Vibrant.prototype.LightVibrantSwatch = void 0;

  Vibrant.prototype.LightMutedSwatch = void 0;

  Vibrant.prototype.HighestPopulation = 0;

  function Vibrant(sourceImage, opts) {
    this.sourceImage = sourceImage;
    if (opts == null) {
      opts = {};
    }
    this.swatches = bind(this.swatches, this);
    this.opts = util.defaults(opts, {
      colorCount: 64,
      quality: 5
    });
  }

  Vibrant.prototype.getSwatches = function(cb) {
    var image;
    return image = new this.constructor.Image(this.sourceImage, (function(_this) {
      return function(err, image) {
        var error;
        if (err != null) {
          return cb(err);
        }
        try {
          _this._process(image, _this.opts);
          return cb(null, _this.swatches());
        } catch (_error) {
          error = _error;
          return cb(error);
        }
      };
    })(this));
  };

  Vibrant.prototype._process = function(image, opts) {
    var a, allPixels, b, cmap, g, i, imageData, offset, pixelCount, pixels, r;
    imageData = image.getImageData();
    pixels = imageData.data;
    pixelCount = image.getPixelCount();
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
      i = i + opts.quality;
    }
    cmap = this.quantize(allPixels, opts.colorCount);
    this._swatches = cmap.vboxes.map((function(_this) {
      return function(vbox) {
        return new Swatch(vbox.color, vbox.vbox.count());
      };
    })(this));
    this.maxPopulation = this.findMaxPopulation;
    this.generateVarationColors();
    this.generateEmptySwatches();
    return image.removeCanvas();
  };

  Vibrant.prototype.generateVarationColors = function() {
    this.VibrantSwatch = this.findColorVariation(this.TARGET_NORMAL_LUMA, this.MIN_NORMAL_LUMA, this.MAX_NORMAL_LUMA, this.TARGET_VIBRANT_SATURATION, this.MIN_VIBRANT_SATURATION, 1);
    this.LightVibrantSwatch = this.findColorVariation(this.TARGET_LIGHT_LUMA, this.MIN_LIGHT_LUMA, 1, this.TARGET_VIBRANT_SATURATION, this.MIN_VIBRANT_SATURATION, 1);
    this.DarkVibrantSwatch = this.findColorVariation(this.TARGET_DARK_LUMA, 0, this.MAX_DARK_LUMA, this.TARGET_VIBRANT_SATURATION, this.MIN_VIBRANT_SATURATION, 1);
    this.MutedSwatch = this.findColorVariation(this.TARGET_NORMAL_LUMA, this.MIN_NORMAL_LUMA, this.MAX_NORMAL_LUMA, this.TARGET_MUTED_SATURATION, 0, this.MAX_MUTED_SATURATION);
    this.LightMutedSwatch = this.findColorVariation(this.TARGET_LIGHT_LUMA, this.MIN_LIGHT_LUMA, 1, this.TARGET_MUTED_SATURATION, 0, this.MAX_MUTED_SATURATION);
    return this.DarkMutedSwatch = this.findColorVariation(this.TARGET_DARK_LUMA, 0, this.MAX_DARK_LUMA, this.TARGET_MUTED_SATURATION, 0, this.MAX_MUTED_SATURATION);
  };

  Vibrant.prototype.generateEmptySwatches = function() {
    var hsl;
    if (this.VibrantSwatch === void 0) {
      if (this.DarkVibrantSwatch !== void 0) {
        hsl = this.DarkVibrantSwatch.getHsl();
        hsl[2] = this.TARGET_NORMAL_LUMA;
        this.VibrantSwatch = new Swatch(util.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
      }
    }
    if (this.DarkVibrantSwatch === void 0) {
      if (this.VibrantSwatch !== void 0) {
        hsl = this.VibrantSwatch.getHsl();
        hsl[2] = this.TARGET_DARK_LUMA;
        return this.DarkVibrantSwatch = new Swatch(util.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
      }
    }
  };

  Vibrant.prototype.findMaxPopulation = function() {
    var j, len, population, ref, swatch;
    population = 0;
    ref = this._swatches;
    for (j = 0, len = ref.length; j < len; j++) {
      swatch = ref[j];
      population = Math.max(population, swatch.getPopulation());
    }
    return population;
  };

  Vibrant.prototype.findColorVariation = function(targetLuma, minLuma, maxLuma, targetSaturation, minSaturation, maxSaturation) {
    var j, len, luma, max, maxValue, ref, sat, swatch, value;
    max = void 0;
    maxValue = 0;
    ref = this._swatches;
    for (j = 0, len = ref.length; j < len; j++) {
      swatch = ref[j];
      sat = swatch.getHsl()[1];
      luma = swatch.getHsl()[2];
      if (sat >= minSaturation && sat <= maxSaturation && luma >= minLuma && luma <= maxLuma && !this.isAlreadySelected(swatch)) {
        value = this.createComparisonValue(sat, targetSaturation, luma, targetLuma, swatch.getPopulation(), this.HighestPopulation);
        if (max === void 0 || value > maxValue) {
          max = swatch;
          maxValue = value;
        }
      }
    }
    return max;
  };

  Vibrant.prototype.createComparisonValue = function(saturation, targetSaturation, luma, targetLuma, population, maxPopulation) {
    return this.weightedMean(this.invertDiff(saturation, targetSaturation), this.WEIGHT_SATURATION, this.invertDiff(luma, targetLuma), this.WEIGHT_LUMA, population / maxPopulation, this.WEIGHT_POPULATION);
  };

  Vibrant.prototype.invertDiff = function(value, targetValue) {
    return 1 - Math.abs(value - targetValue);
  };

  Vibrant.prototype.weightedMean = function() {
    var i, sum, sumWeight, value, values, weight;
    values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    sum = 0;
    sumWeight = 0;
    i = 0;
    while (i < values.length) {
      value = values[i];
      weight = values[i + 1];
      sum += value * weight;
      sumWeight += weight;
      i += 2;
    }
    return sum / sumWeight;
  };

  Vibrant.prototype.swatches = function() {
    return {
      Vibrant: this.VibrantSwatch,
      Muted: this.MutedSwatch,
      DarkVibrant: this.DarkVibrantSwatch,
      DarkMuted: this.DarkMutedSwatch,
      LightVibrant: this.LightVibrantSwatch,
      LightMuted: this.LightMuted
    };
  };

  Vibrant.prototype.isAlreadySelected = function(swatch) {
    return this.VibrantSwatch === swatch || this.DarkVibrantSwatch === swatch || this.LightVibrantSwatch === swatch || this.MutedSwatch === swatch || this.DarkMutedSwatch === swatch || this.LightMutedSwatch === swatch;
  };

  return Vibrant;

})();
