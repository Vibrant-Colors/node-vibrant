(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * quantize.js Copyright 2008 Nick Rabinowitz
 * Ported to node.js by Olivier Lesnicki
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

// fill out a couple protovis dependencies
/*
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 */
if (!pv) {
    var pv = {
        map: function(array, f) {
            var o = {};
            return f ? array.map(function(d, i) {
                o.index = i;
                return f.call(o, d);
            }) : array.slice();
        },
        naturalOrder: function(a, b) {
            return (a < b) ? -1 : ((a > b) ? 1 : 0);
        },
        sum: function(array, f) {
            var o = {};
            return array.reduce(f ? function(p, d, i) {
                o.index = i;
                return p + f.call(o, d);
            } : function(p, d) {
                return p + d;
            }, 0);
        },
        max: function(array, f) {
            return Math.max.apply(null, f ? pv.map(array, f) : array);
        }
    }
}

/**
 * Basic Javascript port of the MMCQ (modified median cut quantization)
 * algorithm from the Leptonica library (http://www.leptonica.com/).
 * Returns a color map you can use to map original pixels to the reduced
 * palette. Still a work in progress.
 * 
 * @author Nick Rabinowitz
 * @example
 
// array of pixels as [R,G,B] arrays
var myPixels = [[190,197,190], [202,204,200], [207,214,210], [211,214,211], [205,207,207]
                // etc
                ];
var maxColors = 4;
 
var cmap = MMCQ.quantize(myPixels, maxColors);
var newPalette = cmap.palette();
var newPixels = myPixels.map(function(p) { 
    return cmap.map(p); 
});
 
 */
var MMCQ = (function() {
    // private constants
    var sigbits = 5,
        rshift = 8 - sigbits,
        maxIterations = 1000,
        fractByPopulations = 0.75;

    // get reduced-space color index for a pixel

    function getColorIndex(r, g, b) {
        return (r << (2 * sigbits)) + (g << sigbits) + b;
    }

    // Simple priority queue

    function PQueue(comparator) {
        var contents = [],
            sorted = false;

        function sort() {
            contents.sort(comparator);
            sorted = true;
        }

        return {
            push: function(o) {
                contents.push(o);
                sorted = false;
            },
            peek: function(index) {
                if (!sorted) sort();
                if (index === undefined) index = contents.length - 1;
                return contents[index];
            },
            pop: function() {
                if (!sorted) sort();
                return contents.pop();
            },
            size: function() {
                return contents.length;
            },
            map: function(f) {
                return contents.map(f);
            },
            debug: function() {
                if (!sorted) sort();
                return contents;
            }
        };
    }

    // 3d color space box

    function VBox(r1, r2, g1, g2, b1, b2, histo) {
        var vbox = this;
        vbox.r1 = r1;
        vbox.r2 = r2;
        vbox.g1 = g1;
        vbox.g2 = g2;
        vbox.b1 = b1;
        vbox.b2 = b2;
        vbox.histo = histo;
    }
    VBox.prototype = {
        volume: function(force) {
            var vbox = this;
            if (!vbox._volume || force) {
                vbox._volume = ((vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1));
            }
            return vbox._volume;
        },
        count: function(force) {
            var vbox = this,
                histo = vbox.histo;
            if (!vbox._count_set || force) {
                var npix = 0,
                    i, j, k;
                for (i = vbox.r1; i <= vbox.r2; i++) {
                    for (j = vbox.g1; j <= vbox.g2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                            index = getColorIndex(i, j, k);
                            npix += (histo[index] || 0);
                        }
                    }
                }
                vbox._count = npix;
                vbox._count_set = true;
            }
            return vbox._count;
        },
        copy: function() {
            var vbox = this;
            return new VBox(vbox.r1, vbox.r2, vbox.g1, vbox.g2, vbox.b1, vbox.b2, vbox.histo);
        },
        avg: function(force) {
            var vbox = this,
                histo = vbox.histo;
            if (!vbox._avg || force) {
                var ntot = 0,
                    mult = 1 << (8 - sigbits),
                    rsum = 0,
                    gsum = 0,
                    bsum = 0,
                    hval,
                    i, j, k, histoindex;
                for (i = vbox.r1; i <= vbox.r2; i++) {
                    for (j = vbox.g1; j <= vbox.g2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                            histoindex = getColorIndex(i, j, k);
                            hval = histo[histoindex] || 0;
                            ntot += hval;
                            rsum += (hval * (i + 0.5) * mult);
                            gsum += (hval * (j + 0.5) * mult);
                            bsum += (hval * (k + 0.5) * mult);
                        }
                    }
                }
                if (ntot) {
                    vbox._avg = [~~(rsum / ntot), ~~ (gsum / ntot), ~~ (bsum / ntot)];
                } else {
                    //console.log('empty box');
                    vbox._avg = [~~(mult * (vbox.r1 + vbox.r2 + 1) / 2), ~~ (mult * (vbox.g1 + vbox.g2 + 1) / 2), ~~ (mult * (vbox.b1 + vbox.b2 + 1) / 2)];
                }
            }
            return vbox._avg;
        },
        contains: function(pixel) {
            var vbox = this,
                rval = pixel[0] >> rshift;
            gval = pixel[1] >> rshift;
            bval = pixel[2] >> rshift;
            return (rval >= vbox.r1 && rval <= vbox.r2 &&
                gval >= vbox.g1 && gval <= vbox.g2 &&
                bval >= vbox.b1 && bval <= vbox.b2);
        }
    };

    // Color map

    function CMap() {
        this.vboxes = new PQueue(function(a, b) {
            return pv.naturalOrder(
                a.vbox.count() * a.vbox.volume(),
                b.vbox.count() * b.vbox.volume()
            )
        });;
    }
    CMap.prototype = {
        push: function(vbox) {
            this.vboxes.push({
                vbox: vbox,
                color: vbox.avg()
            });
        },
        palette: function() {
            return this.vboxes.map(function(vb) {
                return vb.color
            });
        },
        size: function() {
            return this.vboxes.size();
        },
        map: function(color) {
            var vboxes = this.vboxes;
            for (var i = 0; i < vboxes.size(); i++) {
                if (vboxes.peek(i).vbox.contains(color)) {
                    return vboxes.peek(i).color;
                }
            }
            return this.nearest(color);
        },
        nearest: function(color) {
            var vboxes = this.vboxes,
                d1, d2, pColor;
            for (var i = 0; i < vboxes.size(); i++) {
                d2 = Math.sqrt(
                    Math.pow(color[0] - vboxes.peek(i).color[0], 2) +
                    Math.pow(color[1] - vboxes.peek(i).color[1], 2) +
                    Math.pow(color[2] - vboxes.peek(i).color[2], 2)
                );
                if (d2 < d1 || d1 === undefined) {
                    d1 = d2;
                    pColor = vboxes.peek(i).color;
                }
            }
            return pColor;
        },
        forcebw: function() {
            // XXX: won't  work yet
            var vboxes = this.vboxes;
            vboxes.sort(function(a, b) {
                return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color))
            });

            // force darkest color to black if everything < 5
            var lowest = vboxes[0].color;
            if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5)
                vboxes[0].color = [0, 0, 0];

            // force lightest color to white if everything > 251
            var idx = vboxes.length - 1,
                highest = vboxes[idx].color;
            if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251)
                vboxes[idx].color = [255, 255, 255];
        }
    };

    // histo (1-d array, giving the number of pixels in
    // each quantized region of color space), or null on error

    function getHisto(pixels) {
        var histosize = 1 << (3 * sigbits),
            histo = new Array(histosize),
            index, rval, gval, bval;
        pixels.forEach(function(pixel) {
            rval = pixel[0] >> rshift;
            gval = pixel[1] >> rshift;
            bval = pixel[2] >> rshift;
            index = getColorIndex(rval, gval, bval);
            histo[index] = (histo[index] || 0) + 1;
        });
        return histo;
    }

    function vboxFromPixels(pixels, histo) {
        var rmin = 1000000,
            rmax = 0,
            gmin = 1000000,
            gmax = 0,
            bmin = 1000000,
            bmax = 0,
            rval, gval, bval;
        // find min/max
        pixels.forEach(function(pixel) {
            rval = pixel[0] >> rshift;
            gval = pixel[1] >> rshift;
            bval = pixel[2] >> rshift;
            if (rval < rmin) rmin = rval;
            else if (rval > rmax) rmax = rval;
            if (gval < gmin) gmin = gval;
            else if (gval > gmax) gmax = gval;
            if (bval < bmin) bmin = bval;
            else if (bval > bmax) bmax = bval;
        });
        return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
    }

    function medianCutApply(histo, vbox) {
        if (!vbox.count()) return;

        var rw = vbox.r2 - vbox.r1 + 1,
            gw = vbox.g2 - vbox.g1 + 1,
            bw = vbox.b2 - vbox.b1 + 1,
            maxw = pv.max([rw, gw, bw]);
        // only one pixel, no split
        if (vbox.count() == 1) {
            return [vbox.copy()]
        }
        /* Find the partial sum arrays along the selected axis. */
        var total = 0,
            partialsum = [],
            lookaheadsum = [],
            i, j, k, sum, index;
        if (maxw == rw) {
            for (i = vbox.r1; i <= vbox.r2; i++) {
                sum = 0;
                for (j = vbox.g1; j <= vbox.g2; j++) {
                    for (k = vbox.b1; k <= vbox.b2; k++) {
                        index = getColorIndex(i, j, k);
                        sum += (histo[index] || 0);
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        } else if (maxw == gw) {
            for (i = vbox.g1; i <= vbox.g2; i++) {
                sum = 0;
                for (j = vbox.r1; j <= vbox.r2; j++) {
                    for (k = vbox.b1; k <= vbox.b2; k++) {
                        index = getColorIndex(j, i, k);
                        sum += (histo[index] || 0);
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        } else { /* maxw == bw */
            for (i = vbox.b1; i <= vbox.b2; i++) {
                sum = 0;
                for (j = vbox.r1; j <= vbox.r2; j++) {
                    for (k = vbox.g1; k <= vbox.g2; k++) {
                        index = getColorIndex(j, k, i);
                        sum += (histo[index] || 0);
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        }
        partialsum.forEach(function(d, i) {
            lookaheadsum[i] = total - d
        });

        function doCut(color) {
            var dim1 = color + '1',
                dim2 = color + '2',
                left, right, vbox1, vbox2, d2, count2 = 0;
            for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
                if (partialsum[i] > total / 2) {
                    vbox1 = vbox.copy();
                    vbox2 = vbox.copy();
                    left = i - vbox[dim1];
                    right = vbox[dim2] - i;
                    if (left <= right)
                        d2 = Math.min(vbox[dim2] - 1, ~~ (i + right / 2));
                    else d2 = Math.max(vbox[dim1], ~~ (i - 1 - left / 2));
                    // avoid 0-count boxes
                    while (!partialsum[d2]) d2++;
                    count2 = lookaheadsum[d2];
                    while (!count2 && partialsum[d2 - 1]) count2 = lookaheadsum[--d2];
                    // set dimensions
                    vbox1[dim2] = d2;
                    vbox2[dim1] = vbox1[dim2] + 1;
                    // console.log('vbox counts:', vbox.count(), vbox1.count(), vbox2.count());
                    return [vbox1, vbox2];
                }
            }

        }
        // determine the cut planes
        return maxw == rw ? doCut('r') :
            maxw == gw ? doCut('g') :
            doCut('b');
    }

    function quantize(pixels, maxcolors) {
        // short-circuit
        if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
            // console.log('wrong number of maxcolors');
            return false;
        }

        // XXX: check color content and convert to grayscale if insufficient

        var histo = getHisto(pixels),
            histosize = 1 << (3 * sigbits);

        // check that we aren't below maxcolors already
        var nColors = 0;
        histo.forEach(function() {
            nColors++
        });
        if (nColors <= maxcolors) {
            // XXX: generate the new colors from the histo and return
        }

        // get the beginning vbox from the colors
        var vbox = vboxFromPixels(pixels, histo),
            pq = new PQueue(function(a, b) {
                return pv.naturalOrder(a.count(), b.count())
            });
        pq.push(vbox);

        // inner function to do the iteration

        function iter(lh, target) {
            var ncolors = 1,
                niters = 0,
                vbox;
            while (niters < maxIterations) {
                vbox = lh.pop();
                if (!vbox.count()) { /* just put it back */
                    lh.push(vbox);
                    niters++;
                    continue;
                }
                // do the cut
                var vboxes = medianCutApply(histo, vbox),
                    vbox1 = vboxes[0],
                    vbox2 = vboxes[1];

                if (!vbox1) {
                    // console.log("vbox1 not defined; shouldn't happen!");
                    return;
                }
                lh.push(vbox1);
                if (vbox2) { /* vbox2 can be null */
                    lh.push(vbox2);
                    ncolors++;
                }
                if (ncolors >= target) return;
                if (niters++ > maxIterations) {
                    // console.log("infinite loop; perhaps too few pixels!");
                    return;
                }
            }
        }

        // first set of colors, sorted by population
        iter(pq, fractByPopulations * maxcolors);
        // console.log(pq.size(), pq.debug().length, pq.debug().slice());

        // Re-sort by the product of pixel occupancy times the size in color space.
        var pq2 = new PQueue(function(a, b) {
            return pv.naturalOrder(a.count() * a.volume(), b.count() * b.volume())
        });
        while (pq.size()) {
            pq2.push(pq.pop());
        }

        // next set - generate the median cuts using the (npix * vol) sorting.
        iter(pq2, maxcolors - pq2.size());

        // calculate the actual colors
        var cmap = new CMap();
        while (pq2.size()) {
            cmap.push(pq2.pop());
        }

        return cmap;
    }

    return {
        quantize: quantize
    }
})();

module.exports = MMCQ.quantize

},{}],2:[function(require,module,exports){
var Vibrant;

Vibrant = require('./vibrant');

Vibrant.DefaultOpts.Image = require('./image/browser');

module.exports = Vibrant;


},{"./image/browser":8,"./vibrant":21}],3:[function(require,module,exports){
var Vibrant;

window.Vibrant = Vibrant = require('./browser');


},{"./browser":2}],4:[function(require,module,exports){
module.exports = function(r, g, b, a) {
  return a >= 125 && !(r > 250 && g > 250 && b > 250);
};


},{}],5:[function(require,module,exports){
module.exports.Default = require('./default');


},{"./default":4}],6:[function(require,module,exports){
var DefaultGenerator, DefaultOpts, Generator, Swatch, util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

Swatch = require('../swatch');

util = require('../util');

Generator = require('./index');

DefaultOpts = {
  targetDarkLuma: 0.26,
  maxDarkLuma: 0.45,
  minLightLuma: 0.55,
  targetLightLuma: 0.74,
  minNormalLuma: 0.3,
  targetNormalLuma: 0.5,
  maxNormalLuma: 0.7,
  targetMutesSaturation: 0.3,
  maxMutesSaturation: 0.4,
  targetVibrantSaturation: 1.0,
  minVibrantSaturation: 0.35,
  weightSaturation: 3,
  weightLuma: 6,
  weightPopulation: 1
};

module.exports = DefaultGenerator = (function(superClass) {
  extend(DefaultGenerator, superClass);

  DefaultGenerator.prototype.HighestPopulation = 0;

  function DefaultGenerator(opts) {
    this.opts = util.defaults(opts, DefaultOpts);
    this.VibrantSwatch = null;
    this.LightVibrantSwatch = null;
    this.DarkVibrantSwatch = null;
    this.MutedSwatch = null;
    this.LightMutedSwatch = null;
    this.DarkMutedSwatch = null;
  }

  DefaultGenerator.prototype.generate = function(swatches) {
    this.swatches = swatches;
    this.maxPopulation = this.findMaxPopulation;
    this.generateVarationColors();
    return this.generateEmptySwatches();
  };

  DefaultGenerator.prototype.getVibrantSwatch = function() {
    return this.VibrantSwatch;
  };

  DefaultGenerator.prototype.getLightVibrantSwatch = function() {
    return this.LightVibrantSwatch;
  };

  DefaultGenerator.prototype.getDarkVibrantSwatch = function() {
    return this.DarkVibrantSwatch;
  };

  DefaultGenerator.prototype.getMutedSwatch = function() {
    return this.MutedSwatch;
  };

  DefaultGenerator.prototype.getLightMutedSwatch = function() {
    return this.LightMutedSwatch;
  };

  DefaultGenerator.prototype.getDarkMutedSwatch = function() {
    return this.DarkMutedSwatch;
  };

  DefaultGenerator.prototype.generateVarationColors = function() {
    this.VibrantSwatch = this.findColorVariation(this.opts.targetNormalLuma, this.opts.minNormalLuma, this.opts.maxNormalLuma, this.opts.targetVibrantSaturation, this.opts.minVibrantSaturation, 1);
    this.LightVibrantSwatch = this.findColorVariation(this.opts.targetLightLuma, this.opts.minLightLuma, 1, this.opts.targetVibrantSaturation, this.opts.minVibrantSaturation, 1);
    this.DarkVibrantSwatch = this.findColorVariation(this.opts.targetDarkLuma, 0, this.opts.maxDarkLuma, this.opts.targetVibrantSaturation, this.opts.minVibrantSaturation, 1);
    this.MutedSwatch = this.findColorVariation(this.opts.targetNormalLuma, this.opts.minNormalLuma, this.opts.maxNormalLuma, this.opts.targetMutesSaturation, 0, this.opts.maxMutesSaturation);
    this.LightMutedSwatch = this.findColorVariation(this.opts.targetLightLuma, this.opts.minLightLuma, 1, this.opts.targetMutesSaturation, 0, this.opts.maxMutesSaturation);
    return this.DarkMutedSwatch = this.findColorVariation(this.opts.targetDarkLuma, 0, this.opts.maxDarkLuma, this.opts.targetMutesSaturation, 0, this.opts.maxMutesSaturation);
  };

  DefaultGenerator.prototype.generateEmptySwatches = function() {
    var hsl;
    if (this.VibrantSwatch === null) {
      if (this.DarkVibrantSwatch !== null) {
        hsl = this.DarkVibrantSwatch.getHsl();
        hsl[2] = this.opts.targetNormalLuma;
        this.VibrantSwatch = new Swatch(util.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
      }
    }
    if (this.DarkVibrantSwatch === null) {
      if (this.VibrantSwatch !== null) {
        hsl = this.VibrantSwatch.getHsl();
        hsl[2] = this.opts.targetDarkLuma;
        return this.DarkVibrantSwatch = new Swatch(util.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
      }
    }
  };

  DefaultGenerator.prototype.findMaxPopulation = function() {
    var j, len, population, ref, swatch;
    population = 0;
    ref = this.swatches;
    for (j = 0, len = ref.length; j < len; j++) {
      swatch = ref[j];
      population = Math.max(population, swatch.getPopulation());
    }
    return population;
  };

  DefaultGenerator.prototype.findColorVariation = function(targetLuma, minLuma, maxLuma, targetSaturation, minSaturation, maxSaturation) {
    var j, len, luma, max, maxValue, ref, sat, swatch, value;
    max = null;
    maxValue = 0;
    ref = this.swatches;
    for (j = 0, len = ref.length; j < len; j++) {
      swatch = ref[j];
      sat = swatch.getHsl()[1];
      luma = swatch.getHsl()[2];
      if (sat >= minSaturation && sat <= maxSaturation && luma >= minLuma && luma <= maxLuma && !this.isAlreadySelected(swatch)) {
        value = this.createComparisonValue(sat, targetSaturation, luma, targetLuma, swatch.getPopulation(), this.HighestPopulation);
        if (max === null || value > maxValue) {
          max = swatch;
          maxValue = value;
        }
      }
    }
    return max;
  };

  DefaultGenerator.prototype.createComparisonValue = function(saturation, targetSaturation, luma, targetLuma, population, maxPopulation) {
    return this.weightedMean(this.invertDiff(saturation, targetSaturation), this.opts.weightSaturation, this.invertDiff(luma, targetLuma), this.opts.weightLuma, population / maxPopulation, this.opts.weightPopulation);
  };

  DefaultGenerator.prototype.invertDiff = function(value, targetValue) {
    return 1 - Math.abs(value - targetValue);
  };

  DefaultGenerator.prototype.weightedMean = function() {
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

  DefaultGenerator.prototype.isAlreadySelected = function(swatch) {
    return this.VibrantSwatch === swatch || this.DarkVibrantSwatch === swatch || this.LightVibrantSwatch === swatch || this.MutedSwatch === swatch || this.DarkMutedSwatch === swatch || this.LightMutedSwatch === swatch;
  };

  return DefaultGenerator;

})(Generator);


},{"../swatch":19,"../util":20,"./index":7}],7:[function(require,module,exports){
var Generator;

module.exports = Generator = (function() {
  function Generator() {}

  Generator.prototype.generate = function(swatches) {};

  Generator.prototype.getVibrantSwatch = function() {};

  Generator.prototype.getLightVibrantSwatch = function() {};

  Generator.prototype.getDarkVibrantSwatch = function() {};

  Generator.prototype.getMutedSwatch = function() {};

  Generator.prototype.getLightMutedSwatch = function() {};

  Generator.prototype.getDarkMutedSwatch = function() {};

  return Generator;

})();

module.exports.Default = require('./default');


},{"./default":6}],8:[function(require,module,exports){
var BrowserImage, Image,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Image = require('./index');

module.exports = BrowserImage = (function(superClass) {
  extend(BrowserImage, superClass);

  function BrowserImage(path, cb) {
    this.img = document.createElement('img');
    this.img.crossOrigin = 'anonymous';
    this.img.src = path;
    this.img.onload = (function(_this) {
      return function() {
        _this._initCanvas();
        return typeof cb === "function" ? cb(null, _this) : void 0;
      };
    })(this);
    this.img.onerror = (function(_this) {
      return function(e) {
        var err;
        err = new Error("Fail to load image: " + path);
        err.raw = e;
        return typeof cb === "function" ? cb(err) : void 0;
      };
    })(this);
  }

  BrowserImage.prototype._initCanvas = function() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.width = this.canvas.width = this.img.width;
    this.height = this.canvas.height = this.img.height;
    return this.context.drawImage(this.img, 0, 0, this.width, this.height);
  };

  BrowserImage.prototype.clear = function() {
    return this.context.clearRect(0, 0, this.width, this.height);
  };

  BrowserImage.prototype.getWidth = function() {
    return this.width;
  };

  BrowserImage.prototype.getHeight = function() {
    return this.height;
  };

  BrowserImage.prototype.resize = function(w, h, r) {
    this.width = this.canvas.width = w;
    this.height = this.canvas.height = h;
    this.context.scale(r, r);
    return this.context.drawImage(this.img, 0, 0);
  };

  BrowserImage.prototype.update = function(imageData) {
    return this.context.putImageData(imageData, 0, 0);
  };

  BrowserImage.prototype.getPixelCount = function() {
    return this.width * this.height;
  };

  BrowserImage.prototype.getImageData = function() {
    return this.context.getImageData(0, 0, this.width, this.height);
  };

  BrowserImage.prototype.removeCanvas = function() {
    return this.canvas.parentNode.removeChild(this.canvas);
  };

  return BrowserImage;

})(Image);


},{"./index":9}],9:[function(require,module,exports){
var Image;

module.exports = Image = (function() {
  function Image() {}

  Image.prototype.clear = function() {};

  Image.prototype.update = function(imageData) {};

  Image.prototype.getWidth = function() {};

  Image.prototype.getHeight = function() {};

  Image.prototype.scaleDown = function(opts) {
    var height, maxSide, ratio, width;
    width = this.getWidth();
    height = this.getHeight();
    ratio = 1;
    if (opts.maxDimension != null) {
      maxSide = Math.max(width, height);
      if (maxSide > opts.maxDimension) {
        ratio = opts.maxDimension / maxSide;
      }
    } else {
      ratio = 1 / opts.quality;
    }
    if (ratio < 1) {
      return this.resize(width * ratio, height * ratio, ratio);
    }
  };

  Image.prototype.resize = function(w, h, r) {};

  Image.prototype.getPixelCount = function() {};

  Image.prototype.getImageData = function() {};

  Image.prototype.removeCanvas = function() {};

  return Image;

})();


},{}],10:[function(require,module,exports){
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


},{"../swatch":19,"./index":16,"quantize":1}],11:[function(require,module,exports){
var ColorCut, ColorCutQuantizer, Quantizer, Swatch,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Swatch = require('../swatch');

Quantizer = require('./index');

ColorCut = require('./impl/color-cut');

module.exports = ColorCutQuantizer = (function(superClass) {
  extend(ColorCutQuantizer, superClass);

  function ColorCutQuantizer() {
    return ColorCutQuantizer.__super__.constructor.apply(this, arguments);
  }

  ColorCutQuantizer.prototype.initialize = function(pixels, opts) {
    var buf, buf8, data;
    this.opts = opts;
    buf = new ArrayBuffer(pixels.length);
    buf8 = new Uint8ClampedArray(buf);
    data = new Uint32Array(buf);
    buf8.set(pixels);
    return this.quantizer = new ColorCut(data, this.opts);
  };

  ColorCutQuantizer.prototype.getQuantizedColors = function() {
    return this.quantizer.getQuantizedColors();
  };

  return ColorCutQuantizer;

})(Quantizer);


},{"../swatch":19,"./impl/color-cut":12,"./index":16}],12:[function(require,module,exports){
var ABGRColor, COMPONENT_BLUE, COMPONENT_GREEN, COMPONENT_RED, Color, ColorCutQuantizer, QUANTIZE_WORD_MASK, QUANTIZE_WORD_WIDTH, RGBAColor, Swatch, Vbox, approximateToRgb888, isLittleEndian, modifySignificantOctet, modifyWordWidth, quantizeFromRgb888, quantizedBlue, quantizedGreen, quantizedRed, sort;

Swatch = require('../../swatch');

sort = function(arr, lower, upper) {
  var partition, pivot, swap;
  swap = function(a, b) {
    var t;
    t = arr[a];
    arr[a] = arr[b];
    return arr[b] = t;
  };
  partition = function(pivot, left, right) {
    var index, j, ref, ref1, v, value;
    index = left;
    value = arr[pivot];
    swap(pivot, right);
    for (v = j = ref = left, ref1 = right - 1; ref <= ref1 ? j <= ref1 : j >= ref1; v = ref <= ref1 ? ++j : --j) {
      if (arr[v] > value) {
        swap(v, index);
        index++;
      }
    }
    swap(right, index);
    return index;
  };
  if (lower < upper) {
    pivot = lower + Math.ceil((upper - lower) / 2);
    pivot = partition(pivot, lower, upper);
    sort(arr, lower, pivot - 1);
    return sort(arr, pivot + 1, upper);
  }
};

COMPONENT_RED = -3;

COMPONENT_GREEN = -2;

COMPONENT_BLUE = -1;

QUANTIZE_WORD_WIDTH = 5;

QUANTIZE_WORD_MASK = (1 << QUANTIZE_WORD_WIDTH) - 1;

RGBAColor = {
  red: function(c) {
    return c >> 24;
  },
  green: function(c) {
    return c << 8 >> 24;
  },
  blue: function(c) {
    return c << 16 >> 24;
  },
  alpha: function(c) {
    return c << 24 >> 24;
  }
};

ABGRColor = {
  red: function(c) {
    return c << 24 >> 24;
  },
  green: function(c) {
    return c << 16 >> 24;
  },
  blue: function(c) {
    return c << 8 >> 24;
  },
  alpha: function(c) {
    return c >> 24;
  }
};

isLittleEndian = function() {
  var a, b, c;
  a = new ArrayBuffer(4);
  b = new Uint8Array(a);
  c = new Uint32Array(a);
  b[0] = 0xa1;
  b[1] = 0xb2;
  b[2] = 0xc3;
  b[3] = 0xd4;
  if (c[0] === 0xd4c3b2a1) {
    return true;
  }
  if (c[0] === 0xa1b2c3d4) {
    return false;
  }
  throw new Error("Failed to determin endianness");
};

Color = isLittleEndian() ? ABGRColor : RGBAColor;

modifyWordWidth = function(value, current, target) {
  var newValue;
  newValue = 0;
  if (target > current) {
    newValue = value << (target - current);
  } else {
    newValue = value >> (current - target);
  }
  return newValue & ((1 << target) - 1);
};

modifySignificantOctet = function(a, dimension, lower, upper) {
  var color, i, j, k, ref, ref1, ref2, ref3;
  switch (dimension) {
    case COMPONENT_RED:
      break;
    case COMPONENT_GREEN:
      for (i = j = ref = lower, ref1 = upper; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        color = a[i];
        a[i] = quantizedGreen(color) << (QUANTIZE_WORD_WIDTH + QUANTIZE_WORD_WIDTH) | quantizedRed(color) << QUANTIZE_WORD_WIDTH | quantizedBlue(color);
      }
      break;
    case COMPONENT_BLUE:
      for (i = k = ref2 = lower, ref3 = upper; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        color = a[i];
        a[i] = quantizedBlue(color) << (QUANTIZE_WORD_WIDTH + QUANTIZE_WORD_WIDTH) | quantizedGreen(color) << QUANTIZE_WORD_WIDTH | quantizedRed(color);
      }
      break;
  }
};

quantizeFromRgb888 = function(color) {
  var b, g, r;
  r = modifyWordWidth(Color.red(color), 8, QUANTIZE_WORD_WIDTH);
  g = modifyWordWidth(Color.green(color), 8, QUANTIZE_WORD_WIDTH);
  b = modifyWordWidth(Color.blue(color), 8, QUANTIZE_WORD_WIDTH);
  return r << (QUANTIZE_WORD_WIDTH + QUANTIZE_WORD_WIDTH) | g << QUANTIZE_WORD_WIDTH | b;
};

approximateToRgb888 = function(r, g, b) {
  var color;
  if (!((g != null) && (b != null))) {
    color = r;
    r = quantizedRed(color);
    g = quantizedGreen(color);
    b = quantizedBlue(color);
  }
  return [modifyWordWidth(r, QUANTIZE_WORD_WIDTH, 8), modifyWordWidth(g, QUANTIZE_WORD_WIDTH, 8), modifyWordWidth(b, QUANTIZE_WORD_WIDTH, 8)];
};

quantizedRed = function(color) {
  return color >> (QUANTIZE_WORD_WIDTH + QUANTIZE_WORD_WIDTH) & QUANTIZE_WORD_MASK;
};

quantizedGreen = function(color) {
  return color >> QUANTIZE_WORD_WIDTH & QUANTIZE_WORD_MASK;
};

quantizedBlue = function(color) {
  return color & QUANTIZE_WORD_MASK;
};

module.exports = ColorCutQuantizer = (function() {
  function ColorCutQuantizer(data, opts) {
    var c, color, distinctColorCount, distinctColorIndex, i, j, k, l, m, quantizedColor, ref, ref1, ref2, ref3;
    this.opts = opts;
    this.hist = new Uint32Array(1 << (QUANTIZE_WORD_WIDTH * 3));
    this.pixels = new Uint32Array(data.length);
    for (i = j = 0, ref = data.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      this.pixels[i] = quantizedColor = quantizeFromRgb888(data[i]);
      this.hist[quantizedColor]++;
    }
    distinctColorCount = 0;
    for (color = k = 0, ref1 = this.hist.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; color = 0 <= ref1 ? ++k : --k) {
      if (this.hist[color] > 0) {
        distinctColorCount++;
      }
    }
    this.colors = new Uint32Array(distinctColorCount);
    distinctColorIndex = 0;
    for (color = l = 0, ref2 = this.hist.length - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; color = 0 <= ref2 ? ++l : --l) {
      if (this.hist[color] > 0) {
        this.colors[distinctColorIndex++] = color;
      }
    }
    if (distinctColorCount <= this.opts.colorCount) {
      this.quantizedColors = [];
      for (i = m = 0, ref3 = this.colors.length - 1; 0 <= ref3 ? m <= ref3 : m >= ref3; i = 0 <= ref3 ? ++m : --m) {
        c = this.colors[i];
        this.quantizedColors.push(new Swatch(approximateToRgb888(c), this.hist[c]));
      }
    } else {
      this.quantizedColors = this.quantizePixels(this.opts.colorCount);
    }
  }

  ColorCutQuantizer.prototype.getQuantizedColors = function() {
    return this.quantizedColors;
  };

  ColorCutQuantizer.prototype.quantizePixels = function(maxColors) {
    var pq;
    pq = new PriorityQueue({
      comparator: Vbox.comparator
    });
    pq.queue(new Vbox(this.colors, this.hist, 0, this.colors.length - 1));
    this.splitBoxes(pq, maxColors);
    return this.generateAverageColors(pq);
  };

  ColorCutQuantizer.prototype.splitBoxes = function(queue, maxSize) {
    var vbox;
    while (queue.length < maxSize) {
      vbox = queue.dequeue();
      if (vbox != null ? vbox.canSplit() : void 0) {
        queue.queue(vbox.splitBox());
        queue.queue(vbox);
      } else {
        return;
      }
    }
  };

  ColorCutQuantizer.prototype.generateAverageColors = function(vboxes) {
    var colors;
    colors = [];
    while (vboxes.length > 0) {
      colors.push(vboxes.dequeue().getAverageColor());
    }
    return colors;
  };

  return ColorCutQuantizer;

})();

Vbox = (function() {
  Vbox.comparator = function(lhs, rhs) {
    return lhs.getVolume() - rhs.getVolume();
  };

  function Vbox(colors1, hist, lowerIndex, upperIndex) {
    this.colors = colors1;
    this.hist = hist;
    this.lowerIndex = lowerIndex;
    this.upperIndex = upperIndex;
    this.fitBox();
  }

  Vbox.prototype.getVolume = function() {
    return (this.maxRed - this.minRed + 1) * (this.maxGreen - this.minGreen + 1) * (this.maxBlue - this.minBlue + 1);
  };

  Vbox.prototype.canSplit = function() {
    return this.getColorCount() > 1;
  };

  Vbox.prototype.getColorCount = function() {
    return 1 + this.upperIndex - this.lowerIndex;
  };

  Vbox.prototype.fitBox = function() {
    var b, color, count, g, i, j, r, ref, ref1;
    this.minRed = this.minGreen = this.minBlue = Number.MAX_VALUE;
    this.maxRed = this.maxGreen = this.maxBlue = Number.MIN_VALUE;
    this.population = 0;
    count = 0;
    for (i = j = ref = this.lowerIndex, ref1 = this.upperIndex; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      color = this.colors[i];
      count += this.hist[color];
      r = quantizedRed(color);
      g = quantizedGreen(color);
      b = quantizedBlue(color);
      if (r > this.maxRed) {
        this.maxRed = r;
      }
      if (r < this.minRed) {
        this.minRed = r;
      }
      if (g > this.maxGreen) {
        this.maxGreen = g;
      }
      if (g < this.minGreen) {
        this.minGreen = g;
      }
      if (b > this.maxBlue) {
        this.maxRed = b;
      }
      if (b < this.minBlue) {
        this.minRed = b;
      }
    }
    return this.population = count;
  };

  Vbox.prototype.splitBox = function() {
    var newBox, splitPoint;
    if (!this.canSplit()) {
      throw new Error("Cannot split a box with only 1 color");
    }
    splitPoint = this.findSplitPoint();
    newBox = new Vbox(this.colors, this.hist, splitPoint + 1, this.upperIndex);
    this.upperIndex = splitPoint;
    this.fitBox();
    return newBox;
  };

  Vbox.prototype.getLongestColorDimension = function() {
    var blueLength, greenLength, redLength;
    redLength = this.maxRed - this.minRed;
    greenLength = this.maxGreen - this.minGreen;
    blueLength = this.maxBlue - this.minBlue;
    if (redLength >= greenLength && redLength >= blueLength) {
      return COMPONENT_RED;
    }
    if (greenLength >= redLength && greenLength >= blueLength) {
      return COMPONENT_GREEN;
    }
    return COMPONENT_BLUE;
  };

  Vbox.prototype.findSplitPoint = function() {
    var count, i, j, longestDimension, midPoint, ref, ref1;
    longestDimension = this.getLongestColorDimension();
    modifySignificantOctet(this.colors, longestDimension, this.lowerIndex, this.upperIndex);
    sort(this.colors, this.lowerIndex, this.upperIndex + 1);
    modifySignificantOctet(this.colors, longestDimension, this.lowerIndex, this.upperIndex);
    midPoint = this.population / 2;
    count = 0;
    for (i = j = ref = this.lowerIndex, ref1 = this.upperIndex; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      count += this.hist[this.colors[i]];
      if (count >= midPoint) {
        return i;
      }
    }
    return this.lowerIndex;
  };

  Vbox.prototype.getAverageColor = function() {
    var blueMean, blueSum, color, colorPopulation, greenMean, greenSum, i, j, redMean, redSum, ref, ref1, totalPopulation;
    redSum = greenSum = blueSum = 0;
    totalPopulation = 0;
    for (i = j = ref = this.lowerIndex, ref1 = this.upperIndex; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      color = this.colors[i];
      colorPopulation = this.hist[color];
      totalPopulation += colorPopulation;
      redSum += colorPopulation * quantizedRed(color);
      greenSum += colorPopulation * quantizedGreen(color);
      blueSum += colorPopulation * quantizedBlue(color);
    }
    redMean = Math.round(redSum / totalPopulation);
    greenMean = Math.round(greenSum / totalPopulation);
    blueMean = Math.round(blueSum / totalPopulation);
    return new Swatch(approximateToRgb888(redMean, greenMean, blueMean), totalPopulation);
  };

  return Vbox;

})();


},{"../../swatch":19}],13:[function(require,module,exports){
var MMCQ, PQueue, RSHIFT, SIGBITS, Swatch, VBox, getColorIndex, ref, util;

ref = util = require('../../util'), getColorIndex = ref.getColorIndex, SIGBITS = ref.SIGBITS, RSHIFT = ref.RSHIFT;

Swatch = require('../../swatch');

VBox = require('./vbox');

PQueue = require('./pqueue');

module.exports = MMCQ = (function() {
  MMCQ.DefaultOpts = {
    maxIterations: 1000,
    fractByPopulations: 0.75
  };

  function MMCQ(opts) {
    this.opts = util.defaults(opts, this.constructor.DefaultOpts);
  }

  MMCQ.prototype.quantize = function(pixels, opts) {
    var color, colorCount, hist, pq, pq2, shouldIgnore, swatches, v, vbox;
    if (pixels.length === 0 || opts.colorCount < 2 || opts.colorCount > 256) {
      throw new Error("Wrong MMCQ parameters");
    }
    shouldIgnore = function() {
      return false;
    };
    if (Array.isArray(opts.filters) && opts.filters.length > 0) {
      shouldIgnore = function(r, g, b, a) {
        var f, i, len, ref1;
        ref1 = opts.filters;
        for (i = 0, len = ref1.length; i < len; i++) {
          f = ref1[i];
          if (!f(r, g, b, a)) {
            return true;
          }
        }
        return false;
      };
    }
    vbox = VBox.build(pixels, shouldIgnore);
    hist = vbox.hist;
    colorCount = Object.keys(hist).length;
    pq = new PQueue(function(a, b) {
      return a.count() - b.count();
    });
    pq.push(vbox);
    this._splitBoxes(pq, this.opts.fractByPopulations * opts.colorCount);
    pq2 = new PQueue(function(a, b) {
      return a.count() * a.volume() - b.count() * b.volume();
    });
    pq2.contents = pq.contents;
    this._splitBoxes(pq2, opts.colorCount - pq2.size());
    swatches = [];
    this.vboxes = [];
    while (pq2.size()) {
      v = pq2.pop();
      color = v.avg();
      if (!(typeof shouldIgnore === "function" ? shouldIgnore(color[0], color[1], color[2], 255) : void 0)) {
        this.vboxes.push(v);
        swatches.push(new Swatch(color, v.count()));
      }
    }
    return swatches;
  };

  MMCQ.prototype._splitBoxes = function(pq, target) {
    var colorCount, iteration, maxIterations, ref1, vbox, vbox1, vbox2;
    colorCount = 1;
    iteration = 0;
    maxIterations = this.opts.maxIterations;
    while (iteration < maxIterations) {
      iteration++;
      vbox = pq.pop();
      if (!vbox.count()) {
        continue;
      }
      ref1 = vbox.split(), vbox1 = ref1[0], vbox2 = ref1[1];
      pq.push(vbox1);
      if (vbox2) {
        pq.push(vbox2);
        colorCount++;
      }
      if (colorCount >= target || iteration > maxIterations) {
        return;
      }
    }
  };

  return MMCQ;

})();


},{"../../swatch":19,"../../util":20,"./pqueue":14,"./vbox":15}],14:[function(require,module,exports){
var PQueue;

module.exports = PQueue = (function() {
  function PQueue(comparator) {
    this.comparator = comparator;
    this.contents = [];
    this.sorted = false;
  }

  PQueue.prototype._sort = function() {
    this.contents.sort(this.comparator);
    return this.sorted = true;
  };

  PQueue.prototype.push = function(o) {
    this.contents.push(o);
    return this.sorted = false;
  };

  PQueue.prototype.peek = function(index) {
    if (!this.sorted) {
      this._sort();
    }
    if (index == null) {
      index = this.contents.length - 1;
    }
    return this.contents[index];
  };

  PQueue.prototype.pop = function() {
    if (!this.sorted) {
      this._sort();
    }
    return this.contents.pop();
  };

  PQueue.prototype.size = function() {
    return this.contents.length;
  };

  PQueue.prototype.map = function(f) {
    if (!this.sorted) {
      this._sort();
    }
    return this.contents.map(f);
  };

  return PQueue;

})();


},{}],15:[function(require,module,exports){
var RSHIFT, SIGBITS, VBox, getColorIndex, ref, util;

ref = util = require('../../util'), getColorIndex = ref.getColorIndex, SIGBITS = ref.SIGBITS, RSHIFT = ref.RSHIFT;

module.exports = VBox = (function() {
  VBox.build = function(pixels, shouldIgnore) {
    var a, b, bmax, bmin, g, gmax, gmin, hist, hn, i, index, n, offset, r, rmax, rmin;
    hn = 1 << (3 * SIGBITS);
    hist = new Uint32Array(hn);
    rmax = gmax = bmax = 0;
    rmin = gmin = bmin = Number.MAX_VALUE;
    n = pixels.length / 4;
    i = 0;
    while (i < n) {
      offset = i * 4;
      i++;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];
      if (shouldIgnore(r, g, b, a)) {
        continue;
      }
      r = r >> RSHIFT;
      g = g >> RSHIFT;
      b = b >> RSHIFT;
      index = getColorIndex(r, g, b);
      hist[index] += 1;
      if (r > rmax) {
        rmax = r;
      }
      if (r < rmin) {
        rmin = r;
      }
      if (g > gmax) {
        gmax = g;
      }
      if (g < gmin) {
        gmin = g;
      }
      if (b > bmax) {
        bmax = b;
      }
      if (b < bmin) {
        bmin = b;
      }
    }
    return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, hist);
  };

  function VBox(r1, r2, g1, g2, b1, b2, hist1) {
    this.r1 = r1;
    this.r2 = r2;
    this.g1 = g1;
    this.g2 = g2;
    this.b1 = b1;
    this.b2 = b2;
    this.hist = hist1;
  }

  VBox.prototype.invalidate = function() {
    delete this._count;
    delete this._avg;
    return delete this._volume;
  };

  VBox.prototype.volume = function() {
    if (this._volume == null) {
      this._volume = (this.r2 - this.r1 + 1) * (this.g2 - this.g1 + 1) * (this.b2 - this.b1 + 1);
    }
    return this._volume;
  };

  VBox.prototype.count = function() {
    var c, hist;
    if (this._count == null) {
      hist = this.hist;
      c = 0;
      
      for (var r = this.r1; r <= this.r2; r++) {
        for (var g = this.g1; g <= this.g2; g++) {
          for (var b = this.b1; b <= this.b2; b++) {
            var index = getColorIndex(r, g, b);
            c += hist[index];
          }
        }
      }
      ;
      this._count = c;
    }
    return this._count;
  };

  VBox.prototype.clone = function() {
    return new VBox(this.r1, this.r2, this.g1, this.g2, this.b1, this.b2, this.hist);
  };

  VBox.prototype.avg = function() {
    var bsum, gsum, hist, mult, ntot, rsum;
    if (this._avg == null) {
      hist = this.hist;
      ntot = 0;
      mult = 1 << (8 - SIGBITS);
      rsum = gsum = bsum = 0;
      
      for (var r = this.r1; r <= this.r2; r++) {
        for (var g = this.g1; g <= this.g2; g++) {
          for (var b = this.b1; b <= this.b2; b++) {
            var index = getColorIndex(r, g, b);
            var h = hist[index];
            ntot += h;
            rsum += (h * (r + 0.5) * mult);
            gsum += (h * (g + 0.5) * mult);
            bsum += (h * (b + 0.5) * mult);
          }
        }
      }
      ;
      if (ntot) {
        this._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
      } else {
        this._avg = [~~(mult * (this.r1 + this.r2 + 1) / 2), ~~(mult * (this.g1 + this.g2 + 1) / 2), ~~(mult * (this.b1 + this.b2 + 1) / 2)];
      }
    }
    return this._avg;
  };

  VBox.prototype.split = function() {
    var accSum, bw, d, doCut, gw, hist, i, j, maxd, maxw, ref1, reverseSum, rw, splitPoint, sum, total, vbox;
    hist = this.hist;
    if (!this.count()) {
      return null;
    }
    if (this.count() === 1) {
      return [this.clone()];
    }
    rw = this.r2 - this.r1 + 1;
    gw = this.g2 - this.g1 + 1;
    bw = this.b2 - this.b1 + 1;
    maxw = Math.max(rw, gw, bw);
    accSum = null;
    sum = total = 0;
    maxd = null;
    switch (maxw) {
      case rw:
        maxd = 'r';
        accSum = new Uint32Array(this.r2 + 1);
        
        for (var r = this.r1; r <= this.r2; r++) {
          sum = 0
          for (var g = this.g1; g <= this.g2; g++) {
            for (var b = this.b1; b <= this.b2; b++) {
              var index = getColorIndex(r, g, b);
              sum += hist[index];
            }
          }
          total += sum;
          accSum[r] = total;
        }
        ;
        break;
      case gw:
        maxd = 'g';
        accSum = new Uint32Array(this.g2 + 1);
        
        for (var g = this.g1; g <= this.g2; g++) {
          sum = 0
          for (var r = this.r1; r <= this.r2; r++) {
            for (var b = this.b1; b <= this.b2; b++) {
              var index = getColorIndex(r, g, b);
              sum += hist[index];
            }
          }
          total += sum;
          accSum[g] = total;
        }
        ;
        break;
      case bw:
        maxd = 'b';
        accSum = new Uint32Array(this.b2 + 1);
        
        for (var b = this.b1; b <= this.b2; b++) {
          sum = 0
          for (var r = this.r1; r <= this.r2; r++) {
            for (var g = this.g1; g <= this.g2; g++) {
              var index = getColorIndex(r, g, b);
              sum += hist[index];
            }
          }
          total += sum;
          accSum[b] = total;
        }
        ;
    }
    splitPoint = -1;
    reverseSum = new Uint32Array(accSum.length);
    for (i = j = 0, ref1 = accSum.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
      d = accSum[i];
      if (splitPoint < 0 && d > total / 2) {
        splitPoint = i;
      }
      reverseSum[i] = total - d;
    }
    vbox = this;
    doCut = function(d) {
      var c2, d1, d2, dim1, dim2, left, right, vbox1, vbox2;
      dim1 = d + "1";
      dim2 = d + "2";
      d1 = vbox[dim1];
      d2 = vbox[dim2];
      vbox1 = vbox.clone();
      vbox2 = vbox.clone();
      left = splitPoint - d1;
      right = d2 - splitPoint;
      if (left <= right) {
        d2 = Math.min(d2 - 1, ~~(splitPoint + right / 2));
        d2 = Math.max(0, d2);
      } else {
        d2 = Math.max(d1, ~~(splitPoint - 1 - left / 2));
        d2 = Math.min(vbox[dim2], d2);
      }
      while (!accSum[d2]) {
        d2++;
      }
      c2 = reverseSum[d2];
      while (!c2 && accSum[d2 - 1]) {
        c2 = reverseSum[--d2];
      }
      vbox1[dim2] = d2;
      vbox2[dim1] = d2 + 1;
      return [vbox1, vbox2];
    };
    return doCut(maxd);
  };

  VBox.prototype.contains = function(p) {
    var b, g, r;
    r = p[0] >> RSHIFT;
    g = p[1] >> RSHIFT;
    b = p[2] >> RSHIFT;
    return r >= this.r1 && r <= this.r2 && g >= this.g1 && g <= this.g2 && b >= this.b1 && b <= this.b2;
  };

  return VBox;

})();


},{"../../util":20}],16:[function(require,module,exports){
var Quantizer;

module.exports = Quantizer = (function() {
  function Quantizer() {}

  Quantizer.prototype.initialize = function(pixels, opts) {};

  Quantizer.prototype.getQuantizedColors = function() {};

  return Quantizer;

})();

module.exports.Baseline = require('./baseline');

module.exports.NoCopy = require('./nocopy');

module.exports.ColorCut = require('./color-cut');

module.exports.MMCQ = require('./mmcq');


},{"./baseline":10,"./color-cut":11,"./mmcq":17,"./nocopy":18}],17:[function(require,module,exports){
var MMCQ, MMCQImpl, Quantizer, Swatch,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Swatch = require('../swatch');

Quantizer = require('./index');

MMCQImpl = require('./impl/mmcq');

module.exports = MMCQ = (function(superClass) {
  extend(MMCQ, superClass);

  function MMCQ() {
    return MMCQ.__super__.constructor.apply(this, arguments);
  }

  MMCQ.prototype.initialize = function(pixels, opts) {
    var mmcq;
    this.opts = opts;
    mmcq = new MMCQImpl();
    return this.swatches = mmcq.quantize(pixels, this.opts);
  };

  MMCQ.prototype.getQuantizedColors = function() {
    return this.swatches;
  };

  return MMCQ;

})(Quantizer);


},{"../swatch":19,"./impl/mmcq":13,"./index":16}],18:[function(require,module,exports){
var NoCopyQuantizer, Quantizer, Swatch, quantize,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Swatch = require('../swatch');

Quantizer = require('./index');

quantize = require('../../vendor-mod/quantize');

module.exports = NoCopyQuantizer = (function(superClass) {
  extend(NoCopyQuantizer, superClass);

  function NoCopyQuantizer() {
    return NoCopyQuantizer.__super__.constructor.apply(this, arguments);
  }

  NoCopyQuantizer.prototype.initialize = function(pixels, opts) {
    var cmap;
    this.opts = opts;
    cmap = quantize(pixels, this.opts);
    return this.swatches = cmap.vboxes.map((function(_this) {
      return function(vbox) {
        return new Swatch(vbox.color, vbox.vbox.count());
      };
    })(this));
  };

  NoCopyQuantizer.prototype.getQuantizedColors = function() {
    return this.swatches;
  };

  return NoCopyQuantizer;

})(Quantizer);


},{"../../vendor-mod/quantize":22,"../swatch":19,"./index":16}],19:[function(require,module,exports){
var Swatch, util;

util = require('./util');


/*
  From Vibrant.js by Jari Zwarts
  Ported to node.js by AKFish

  Swatch class
 */

module.exports = Swatch = (function() {
  Swatch.prototype.hsl = void 0;

  Swatch.prototype.rgb = void 0;

  Swatch.prototype.population = 1;

  Swatch.prototype.yiq = 0;

  function Swatch(rgb, population) {
    this.rgb = rgb;
    this.population = population;
  }

  Swatch.prototype.getHsl = function() {
    if (!this.hsl) {
      return this.hsl = util.rgbToHsl(this.rgb[0], this.rgb[1], this.rgb[2]);
    } else {
      return this.hsl;
    }
  };

  Swatch.prototype.getPopulation = function() {
    return this.population;
  };

  Swatch.prototype.getRgb = function() {
    return this.rgb;
  };

  Swatch.prototype.getHex = function() {
    return util.rgbToHex(this.rgb[0], this.rgb[1], this.rgb[2]);
  };

  Swatch.prototype.getTitleTextColor = function() {
    this._ensureTextColors();
    if (this.yiq < 200) {
      return "#fff";
    } else {
      return "#000";
    }
  };

  Swatch.prototype.getBodyTextColor = function() {
    this._ensureTextColors();
    if (this.yiq < 150) {
      return "#fff";
    } else {
      return "#000";
    }
  };

  Swatch.prototype._ensureTextColors = function() {
    if (!this.yiq) {
      return this.yiq = (this.rgb[0] * 299 + this.rgb[1] * 587 + this.rgb[2] * 114) / 1000;
    }
  };

  return Swatch;

})();


},{"./util":20}],20:[function(require,module,exports){
var DELTAE94, RSHIFT, SIGBITS;

DELTAE94 = {
  NA: 0,
  PERFECT: 1,
  CLOSE: 2,
  GOOD: 10,
  SIMILAR: 50
};

SIGBITS = 5;

RSHIFT = 8 - SIGBITS;

module.exports = {
  clone: function(o) {
    var _o, key, value;
    if (typeof o === 'object') {
      if (Array.isArray(o)) {
        return o.map((function(_this) {
          return function(v) {
            return _this.clone(v);
          };
        })(this));
      } else {
        _o = {};
        for (key in o) {
          value = o[key];
          _o[key] = this.clone(value);
        }
        return _o;
      }
    }
    return o;
  },
  defaults: function() {
    var _o, i, key, len, o, value;
    o = {};
    for (i = 0, len = arguments.length; i < len; i++) {
      _o = arguments[i];
      for (key in _o) {
        value = _o[key];
        if (o[key] == null) {
          o[key] = this.clone(value);
        }
      }
    }
    return o;
  },
  hexToRgb: function(hex) {
    var m;
    m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (m != null) {
      return [m[1], m[2], m[3]].map(function(s) {
        return parseInt(s, 16);
      });
    }
    return null;
  },
  rgbToHex: function(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
  },
  rgbToHsl: function(r, g, b) {
    var d, h, l, max, min, s;
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = void 0;
    s = void 0;
    l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [h, s, l];
  },
  hslToRgb: function(h, s, l) {
    var b, g, hue2rgb, p, q, r;
    r = void 0;
    g = void 0;
    b = void 0;
    hue2rgb = function(p, q, t) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };
    if (s === 0) {
      r = g = b = l;
    } else {
      q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
      p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - (1 / 3));
    }
    return [r * 255, g * 255, b * 255];
  },
  rgbToXyz: function(r, g, b) {
    var x, y, z;
    r /= 255;
    g /= 255;
    b /= 255;
    r = r > 0.04045 ? Math.pow((r + 0.005) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.005) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.005) / 1.055, 2.4) : b / 12.92;
    r *= 100;
    g *= 100;
    b *= 100;
    x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x, y, z];
  },
  xyzToCIELab: function(x, y, z) {
    var L, REF_X, REF_Y, REF_Z, a, b;
    REF_X = 95.047;
    REF_Y = 100;
    REF_Z = 108.883;
    x /= REF_X;
    y /= REF_Y;
    z /= REF_Z;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    L = 116 * y - 16;
    a = 500 * (x - y);
    b = 200 * (y - z);
    return [L, a, b];
  },
  rgbToCIELab: function(r, g, b) {
    var ref, x, y, z;
    ref = this.rgbToXyz(r, g, b), x = ref[0], y = ref[1], z = ref[2];
    return this.xyzToCIELab(x, y, z);
  },
  deltaE94: function(lab1, lab2) {
    var L1, L2, WEIGHT_C, WEIGHT_H, WEIGHT_L, a1, a2, b1, b2, dL, da, db, xC1, xC2, xDC, xDE, xDH, xDL, xSC, xSH;
    WEIGHT_L = 1;
    WEIGHT_C = 1;
    WEIGHT_H = 1;
    L1 = lab1[0], a1 = lab1[1], b1 = lab1[2];
    L2 = lab2[0], a2 = lab2[1], b2 = lab2[2];
    dL = L1 - L2;
    da = a1 - a2;
    db = b1 - b2;
    xC1 = Math.sqrt(a1 * a1 + b1 * b1);
    xC2 = Math.sqrt(a2 * a2 + b2 * b2);
    xDL = L2 - L1;
    xDC = xC2 - xC1;
    xDE = Math.sqrt(dL * dL + da * da + db * db);
    if (Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC))) {
      xDH = Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC);
    } else {
      xDH = 0;
    }
    xSC = 1 + 0.045 * xC1;
    xSH = 1 + 0.015 * xC1;
    xDL /= WEIGHT_L;
    xDC /= WEIGHT_C * xSC;
    xDH /= WEIGHT_H * xSH;
    return Math.sqrt(xDL * xDL + xDC * xDC + xDH * xDH);
  },
  rgbDiff: function(rgb1, rgb2) {
    var lab1, lab2;
    lab1 = this.rgbToCIELab.apply(this, rgb1);
    lab2 = this.rgbToCIELab.apply(this, rgb2);
    return this.deltaE94(lab1, lab2);
  },
  hexDiff: function(hex1, hex2) {
    var rgb1, rgb2;
    rgb1 = this.hexToRgb(hex1);
    rgb2 = this.hexToRgb(hex2);
    return this.rgbDiff(rgb1, rgb2);
  },
  DELTAE94_DIFF_STATUS: DELTAE94,
  getColorDiffStatus: function(d) {
    if (d < DELTAE94.NA) {
      return "N/A";
    }
    if (d <= DELTAE94.PERFECT) {
      return "Perfect";
    }
    if (d <= DELTAE94.CLOSE) {
      return "Close";
    }
    if (d <= DELTAE94.GOOD) {
      return "Good";
    }
    if (d < DELTAE94.SIMILAR) {
      return "Similar";
    }
    return "Wrong";
  },
  SIGBITS: SIGBITS,
  RSHIFT: RSHIFT,
  getColorIndex: function(r, g, b) {
    return (r << (2 * SIGBITS)) + (g << SIGBITS) + b;
  }
};


},{}],21:[function(require,module,exports){

/*
  From Vibrant.js by Jari Zwarts
  Ported to node.js by AKFish

  Color algorithm class that finds variations on colors in an image.

  Credits
  --------
  Lokesh Dhakar (http://www.lokeshdhakar.com) - Created ColorThief
  Google - Palette support library in Android
 */
var Builder, DefaultGenerator, Filter, Swatch, Vibrant, util,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Swatch = require('./swatch');

util = require('./util');

DefaultGenerator = require('./generator').Default;

Filter = require('./filter');

module.exports = Vibrant = (function() {
  Vibrant.DefaultOpts = {
    colorCount: 64,
    quality: 5,
    generator: new DefaultGenerator(),
    Image: null,
    Quantizer: require('./quantizer').MMCQ,
    filters: []
  };

  Vibrant.from = function(src) {
    return new Builder(src);
  };

  Vibrant.prototype.quantize = require('quantize');

  Vibrant.prototype._swatches = [];

  function Vibrant(sourceImage, opts) {
    this.sourceImage = sourceImage;
    if (opts == null) {
      opts = {};
    }
    this.swatches = bind(this.swatches, this);
    this.opts = util.defaults(opts, this.constructor.DefaultOpts);
    this.generator = this.opts.generator;
  }

  Vibrant.prototype.getPalette = function(cb) {
    var image;
    return image = new this.opts.Image(this.sourceImage, (function(_this) {
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

  Vibrant.prototype.getSwatches = function(cb) {
    return this.getPalette(cb);
  };

  Vibrant.prototype._process = function(image, opts) {
    var imageData, quantizer, swatches;
    image.scaleDown(this.opts);
    imageData = image.getImageData();
    quantizer = new this.opts.Quantizer();
    quantizer.initialize(imageData.data, this.opts);
    swatches = quantizer.getQuantizedColors();
    this.generator.generate(swatches);
    return image.removeCanvas();
  };

  Vibrant.prototype.swatches = function() {
    return {
      Vibrant: this.generator.getVibrantSwatch(),
      Muted: this.generator.getMutedSwatch(),
      DarkVibrant: this.generator.getDarkVibrantSwatch(),
      DarkMuted: this.generator.getDarkMutedSwatch(),
      LightVibrant: this.generator.getLightVibrantSwatch(),
      LightMuted: this.generator.getLightMutedSwatch()
    };
  };

  return Vibrant;

})();

module.exports.Builder = Builder = (function() {
  function Builder(src1, opts1) {
    this.src = src1;
    this.opts = opts1 != null ? opts1 : {};
    this.opts.filters = util.clone(Vibrant.DefaultOpts.filters);
  }

  Builder.prototype.maxColorCount = function(n) {
    this.opts.colorCount = n;
    return this;
  };

  Builder.prototype.maxDimension = function(d) {
    this.opts.maxDimension = d;
    return this;
  };

  Builder.prototype.addFilter = function(f) {
    if (typeof f === 'function') {
      this.opts.filters.push(f);
    }
    return this;
  };

  Builder.prototype.removeFilter = function(f) {
    var i;
    if ((i = this.opts.filters.indexOf(f)) > 0) {
      this.opts.filters.splice(i);
    }
    return this;
  };

  Builder.prototype.clearFilters = function() {
    this.opts.filters = [];
    return this;
  };

  Builder.prototype.quality = function(q) {
    this.opts.quality = q;
    return this;
  };

  Builder.prototype.useImage = function(image) {
    this.opts.Image = image;
    return this;
  };

  Builder.prototype.useGenerator = function(generator) {
    this.opts.generator = generator;
    return this;
  };

  Builder.prototype.useQuantizer = function(quantizer) {
    this.opts.Quantizer = quantizer;
    return this;
  };

  Builder.prototype.build = function() {
    if (this.v == null) {
      this.v = new Vibrant(this.src, this.opts);
    }
    return this.v;
  };

  Builder.prototype.getSwatches = function(cb) {
    return this.build().getPalette(cb);
  };

  Builder.prototype.getPalette = function(cb) {
    return this.build().getPalette(cb);
  };

  Builder.prototype.from = function(src) {
    return new Vibrant(src, this.opts);
  };

  return Builder;

})();

module.exports.Util = util;

module.exports.Swatch = Swatch;

module.exports.Quantizer = require('./quantizer/');

module.exports.Generator = require('./generator/');

module.exports.Filter = require('./filter/');


},{"./filter":5,"./filter/":5,"./generator":7,"./generator/":7,"./quantizer":16,"./quantizer/":16,"./swatch":19,"./util":20,"quantize":1}],22:[function(require,module,exports){
/*
 * quantize.js Copyright 2008 Nick Rabinowitz
 * Ported to node.js by Olivier Lesnicki
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

// fill out a couple protovis dependencies
/*
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 */
if (!pv) {
    var pv = {
        map: function(array, f) {
            var o = {};
            return f ? array.map(function(d, i) {
                o.index = i;
                return f.call(o, d);
            }) : array.slice();
        },
        naturalOrder: function(a, b) {
            return a - b;
        },
        sum: function(array, f) {
            var o = {};
            return array.reduce(f ? function(p, d, i) {
                o.index = i;
                return p + f.call(o, d);
            } : function(p, d) {
                return p + d;
            }, 0);
        },
        max: function(array, f) {
            return Math.max.apply(null, f ? pv.map(array, f) : array);
        }
    }
}

/**
 * Basic Javascript port of the MMCQ (modified median cut quantization)
 * algorithm from the Leptonica library (http://www.leptonica.com/).
 * Returns a color map you can use to map original pixels to the reduced
 * palette. Still a work in progress.
 *
 * @author Nick Rabinowitz
 * @example

// array of pixels as [R,G,B] arrays
var myPixels = [[190,197,190], [202,204,200], [207,214,210], [211,214,211], [205,207,207]
                // etc
                ];
var maxColors = 4;

var cmap = MMCQ.quantize(myPixels, maxColors);
var newPalette = cmap.palette();
var newPixels = myPixels.map(function(p) {
    return cmap.map(p);
});

 */
var MMCQ = (function() {
    // private constants
    var sigbits = 5,
        rshift = 8 - sigbits,
        maxIterations = 1000,
        fractByPopulations = 0.75;

    // get reduced-space color index for a pixel

    function getColorIndex(r, g, b) {
        return (r << (2 * sigbits)) + (g << sigbits) + b;
    }

    // Simple priority queue

    function PQueue(comparator) {
        var contents = [],
            sorted = false;

        function sort() {
            contents.sort(comparator);
            sorted = true;
        }

        return {
            push: function(o) {
                contents.push(o);
                sorted = false;
            },
            peek: function(index) {
                if (!sorted) sort();
                if (index === undefined) index = contents.length - 1;
                return contents[index];
            },
            pop: function() {
                if (!sorted) sort();
                return contents.pop();
            },
            size: function() {
                return contents.length;
            },
            map: function(f) {
                return contents.map(f);
            },
            debug: function() {
                if (!sorted) sort();
                return contents;
            }
        };
    }

    // 3d color space box

    function VBox(r1, r2, g1, g2, b1, b2, histo) {
        var vbox = this;
        vbox.r1 = r1;
        vbox.r2 = r2;
        vbox.g1 = g1;
        vbox.g2 = g2;
        vbox.b1 = b1;
        vbox.b2 = b2;
        vbox.histo = histo;
    }
    VBox.prototype = {
        volume: function(force) {
            var vbox = this;
            if (!vbox._volume || force) {
                vbox._volume = ((vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1));
            }
            return vbox._volume;
        },
        count: function(force) {
            var vbox = this,
                histo = vbox.histo;
            if (!vbox._count_set || force) {
                var npix = 0,
                    i, j, k;
                for (i = vbox.r1; i <= vbox.r2; i++) {
                    for (j = vbox.g1; j <= vbox.g2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                            index = getColorIndex(i, j, k);
                            npix += histo[index];
                        }
                    }
                }
                vbox._count = npix;
                vbox._count_set = true;
            }
            return vbox._count;
        },
        copy: function() {
            var vbox = this;
            return new VBox(vbox.r1, vbox.r2, vbox.g1, vbox.g2, vbox.b1, vbox.b2, vbox.histo);
        },
        avg: function(force) {
            var vbox = this,
                histo = vbox.histo;
            if (!vbox._avg || force) {
                var ntot = 0,
                    mult = 1 << (8 - sigbits),
                    // mult = (8 - sigbits),
                    rsum = 0,
                    gsum = 0,
                    bsum = 0,
                    hval,
                    i, j, k, histoindex;
                for (i = vbox.r1; i <= vbox.r2; i++) {
                    for (j = vbox.g1; j <= vbox.g2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                            histoindex = getColorIndex(i, j, k);
                            hval = histo[histoindex];
                            ntot += hval;
                            rsum += (hval * (i + 0.5) * mult);
                            gsum += (hval * (j + 0.5) * mult);
                            bsum += (hval * (k + 0.5) * mult);
                        }
                    }
                }
                if (ntot) {
                    vbox._avg = [~~(rsum / ntot), ~~ (gsum / ntot), ~~ (bsum / ntot)];
                } else {
                    //console.log('empty box');
                    vbox._avg = [~~(mult * (vbox.r1 + vbox.r2 + 1) / 2), ~~ (mult * (vbox.g1 + vbox.g2 + 1) / 2), ~~ (mult * (vbox.b1 + vbox.b2 + 1) / 2)];
                }
            }
            return vbox._avg;
        },
        contains: function(pixel) {
            var vbox = this,
                rval = pixel[0] >> rshift;
            gval = pixel[1] >> rshift;
            bval = pixel[2] >> rshift;
            return (rval >= vbox.r1 && rval <= vbox.r2 &&
                gval >= vbox.g1 && gval <= vbox.g2 &&
                bval >= vbox.b1 && bval <= vbox.b2);
        }
    };

    // Color map

    function CMap() {
        this.vboxes = new PQueue(function(a, b) {
            return pv.naturalOrder(
                a.vbox.count() * a.vbox.volume(),
                b.vbox.count() * b.vbox.volume()
            )
        });;
    }
    CMap.prototype = {
        push: function(vbox) {
            this.vboxes.push({
                vbox: vbox,
                color: vbox.avg()
            });
        },
        palette: function() {
            return this.vboxes.map(function(vb) {
                return vb.color
            });
        },
        size: function() {
            return this.vboxes.size();
        },
        map: function(color) {
            var vboxes = this.vboxes;
            for (var i = 0; i < vboxes.size(); i++) {
                if (vboxes.peek(i).vbox.contains(color)) {
                    return vboxes.peek(i).color;
                }
            }
            return this.nearest(color);
        },
        nearest: function(color) {
            var vboxes = this.vboxes,
                d1, d2, pColor;
            for (var i = 0; i < vboxes.size(); i++) {
                d2 = Math.sqrt(
                    Math.pow(color[0] - vboxes.peek(i).color[0], 2) +
                    Math.pow(color[1] - vboxes.peek(i).color[1], 2) +
                    Math.pow(color[2] - vboxes.peek(i).color[2], 2)
                );
                if (d2 < d1 || d1 === undefined) {
                    d1 = d2;
                    pColor = vboxes.peek(i).color;
                }
            }
            return pColor;
        },
        forcebw: function() {
            // XXX: won't  work yet
            var vboxes = this.vboxes;
            vboxes.sort(function(a, b) {
                return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color))
            });

            // force darkest color to black if everything < 5
            var lowest = vboxes[0].color;
            if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5)
                vboxes[0].color = [0, 0, 0];

            // force lightest color to white if everything > 251
            var idx = vboxes.length - 1,
                highest = vboxes[idx].color;
            if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251)
                vboxes[idx].color = [255, 255, 255];
        }
    };


    function getAll(pixels, shouldIgnore) {
        var histosize = 1 << (3 * sigbits),
            histo = new Uint32Array(histosize),
            index, rval, gval, bval;
        var rmin = 1000000,
            rmax = 0,
            gmin = 1000000,
            gmax = 0,
            bmin = 1000000,
            bmax = 0;

        var pixelCount = pixels.length / 4,
            i = 0;

        // Yes, it matters
        if (typeof shouldIgnore === 'function') {
          while (i < pixelCount) {
              offset = i * 4;
              i++;
              r = pixels[offset + 0];
              g = pixels[offset + 1];
              b = pixels[offset + 2];
              a = pixels[offset + 3];
              if (shouldIgnore(r, g, b, a)) continue;
              rval = r >> rshift;
              gval = g >> rshift;
              bval = b >> rshift;
              index = getColorIndex(rval, gval, bval);
              histo[index]++;
              if (rval < rmin) rmin = rval;
              else if (rval > rmax) rmax = rval;
              if (gval < gmin) gmin = gval;
              else if (gval > gmax) gmax = gval;
              if (bval < bmin) bmin = bval;
              else if (bval > bmax) bmax = bval;
          }
        } else {
          while (i < pixelCount) {
              offset = i * 4;
              i++;
              r = pixels[offset + 0];
              g = pixels[offset + 1];
              b = pixels[offset + 2];
              a = pixels[offset + 3];
              rval = r >> rshift;
              gval = g >> rshift;
              bval = b >> rshift;
              index = getColorIndex(rval, gval, bval);
              histo[index]++;
              if (rval < rmin) rmin = rval;
              else if (rval > rmax) rmax = rval;
              if (gval < gmin) gmin = gval;
              else if (gval > gmax) gmax = gval;
              if (bval < bmin) bmin = bval;
              else if (bval > bmax) bmax = bval;
          }
        }

        return {
          histo: histo,
          vbox: new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo)
        };
    }

    // histo (1-d array, giving the number of pixels in
    // each quantized region of color space), or null on error

    function getHisto(pixels, shouldIgnore) {
        var histosize = 1 << (3 * sigbits),
            histo = new Uint32Array(histosize),
            index, rval, gval, bval;

        var pixelCount = pixels.length / 4,
            i = 0;

        // Yes, it matters
        if (typeof shouldIgnore === 'function') {
          while (i < pixelCount) {
              offset = i * 4;
              i++;
              r = pixels[offset + 0];
              g = pixels[offset + 1];
              b = pixels[offset + 2];
              a = pixels[offset + 3];
              if (shouldIgnore(r, g, b, a)) continue;
              rval = r >> rshift;
              gval = g >> rshift;
              bval = b >> rshift;
              index = getColorIndex(rval, gval, bval);
              histo[index]++;
          }
        } else {
          while (i < pixelCount) {
              offset = i * 4;
              i++;
              r = pixels[offset + 0];
              g = pixels[offset + 1];
              b = pixels[offset + 2];
              a = pixels[offset + 3];
              rval = r >> rshift;
              gval = g >> rshift;
              bval = b >> rshift;
              index = getColorIndex(rval, gval, bval);
              histo[index]++;
          }
        }

        return histo;
    }

    function vboxFromPixels(pixels, histo, shouldIgnore) {
        var rmin = 1000000,
            rmax = 0,
            gmin = 1000000,
            gmax = 0,
            bmin = 1000000,
            bmax = 0,
            rval, gval, bval;
        // find min/max
        var pixelCount = pixels.length / 4,
            i = 0;

        // Yes, it matters
        if (typeof shouldIgnore === 'function') {
          while (i < pixelCount) {
              offset = i * 4;
              i++;
              r = pixels[offset + 0];
              g = pixels[offset + 1];
              b = pixels[offset + 2];
              a = pixels[offset + 3];
              if (shouldIgnore(r, g, b, a)) continue;
              rval = r >> rshift;
              gval = g >> rshift;
              bval = b >> rshift;
              if (rval < rmin) rmin = rval;
              else if (rval > rmax) rmax = rval;
              if (gval < gmin) gmin = gval;
              else if (gval > gmax) gmax = gval;
              if (bval < bmin) bmin = bval;
              else if (bval > bmax) bmax = bval;
          }
        } else {
            while (i < pixelCount) {
              offset = i * 4;
              i++;
              r = pixels[offset + 0];
              g = pixels[offset + 1];
              b = pixels[offset + 2];
              a = pixels[offset + 3];
              rval = r >> rshift;
              gval = g >> rshift;
              bval = b >> rshift;
              if (rval < rmin) rmin = rval;
              else if (rval > rmax) rmax = rval;
              if (gval < gmin) gmin = gval;
              else if (gval > gmax) gmax = gval;
              if (bval < bmin) bmin = bval;
              else if (bval > bmax) bmax = bval;
          }
        }
        return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
    }

    function medianCutApply(histo, vbox) {
        if (!vbox.count()) return;

        var rw = vbox.r2 - vbox.r1 + 1,
            gw = vbox.g2 - vbox.g1 + 1,
            bw = vbox.b2 - vbox.b1 + 1,
            maxw = pv.max([rw, gw, bw]);
        // only one pixel, no split
        if (vbox.count() == 1) {
            return [vbox.copy()]
        }
        /* Find the partial sum arrays along the selected axis. */
        var total = 0,
            partialsum,
            lookaheadsum,
            i, j, k, sum, index;
        // var D = ['r', 'g', 'b'],
        //   indexer = getColorIndex;
        // if (maxw == gw) {
        //   D = ['g', 'r', 'b'];
        //   indexer = function(g, r, b) { return getColorIndex(r, g, b); };
        // } else if (maxw == bw) {
        //   indexer = function(b, r, g) { return getColorIndex(r, g, b); };
        //   D = ['b', 'r', 'g'];
        // }
        // partialsum = new Uint32Array(vbox[D[0] + "2"] + 1);
        // console.log(vbox[D[0] + "2"])
        // for (i = vbox[D[0] + "1"]; i <= vbox[D[0] + "2"]; i++) {
        //     sum = 0;
        //     for (j = vbox[D[1] + "1"]; j <= vbox[D[1] + "2"]; j++) {
        //         for (k = vbox[D[2] + "1"]; k <= vbox[D[2] + "2"]; k++) {
        //             index = indexer(i, j, k);
        //             sum += histo[index];
        //         }
        //     }
        //     total += sum;
        //     console.log(i + "->" + total)
        //     partialsum[i] = total;
        // }
        var maxd = 'b';
        if (maxw == rw) {
            maxd = 'r';
            partialsum = new Uint32Array(vbox.r2 + 1);
            for (i = vbox.r1; i <= vbox.r2; i++) {
                sum = 0;
                for (j = vbox.g1; j <= vbox.g2; j++) {
                    for (k = vbox.b1; k <= vbox.b2; k++) {
                        index = getColorIndex(i, j, k);
                        sum += histo[index];
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        } else if (maxw == gw) {
            maxd = 'g';
            partialsum = new Uint32Array(vbox.g2 + 1);
            for (i = vbox.g1; i <= vbox.g2; i++) {
                sum = 0;
                for (j = vbox.r1; j <= vbox.r2; j++) {
                    for (k = vbox.b1; k <= vbox.b2; k++) {
                        index = getColorIndex(j, i, k);
                        sum += histo[index];
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        } else { /* maxw == bw */
            // maxd = 'b';
            partialsum = new Uint32Array(vbox.b2 + 1);
            for (i = vbox.b1; i <= vbox.b2; i++) {
                sum = 0;
                for (j = vbox.r1; j <= vbox.r2; j++) {
                    for (k = vbox.g1; k <= vbox.g2; k++) {
                        index = getColorIndex(j, k, i);
                        sum += histo[index];
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        }
        var splitPoint = -1;
        lookaheadsum = new Uint32Array(partialsum.length);
        for (i = 0; i < partialsum.length; i++) {
          var d = partialsum[i];
          if (splitPoint < 0 && d > (total / 2)) splitPoint = i;
          lookaheadsum[i] = total - d
        }
        // partialsum.forEach(function(d, i) {
        //   if (splitPoint < 0 && d > (total / 2)) splitPoint = i
        //     lookaheadsum[i] = total - d
        // });

        // console.log('cut')
        function doCut(color) {
            var dim1 = color + '1',
                dim2 = color + '2',
                left, right, vbox1, vbox2, d2, count2 = 0,
                i = splitPoint;
            vbox1 = vbox.copy();
            vbox2 = vbox.copy();
            left = i - vbox[dim1];
            right = vbox[dim2] - i;
            if (left <= right) {
                d2 = Math.min(vbox[dim2] - 1, ~~ (i + right / 2));
                d2 = Math.max(0, d2);
            } else {
                d2 = Math.max(vbox[dim1], ~~ (i - 1 - left / 2));
                d2 = Math.min(vbox[dim2], d2);
            }
            // console.log(partialsum[d2])
            // avoid 0-count boxes
            while (!partialsum[d2]) d2++;
            count2 = lookaheadsum[d2];
            // console.log('-_-')
            while (!count2 && partialsum[d2 - 1]) count2 = lookaheadsum[--d2];
            // set dimensions
            vbox1[dim2] = d2;
            vbox2[dim1] = vbox1[dim2] + 1;
            // console.log('vbox counts:', vbox.count(), vbox1.count(), vbox2.count());
            return [vbox1, vbox2];

        }
        // determine the cut planes
        return doCut(maxd);
        // return maxw == rw ? doCut('r') :
        //     maxw == gw ? doCut('g') :
        //     doCut('b');
    }

    function quantize(pixels, opts) {
        var maxcolors = opts.colorCount;
        // short-circuit
        if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
            // console.log('wrong number of maxcolors');
            return false;
        }

        var hasFilters = Array.isArray(opts.filters) && opts.filters.length > 0;
        function shouldIgnore(r, g, b, a) {
          for (var i = 0; i < opts.filters.length; i++) {
            var f = opts.filters[i];
            if (!f(r, g, b, a)) {
              return true;
            }
          }
          return false;
        }

        var r = getAll(pixels, hasFilters ? houldIgnore : null);
        // XXX: check color content and convert to grayscale if insufficient

        // var histo = getHisto(pixels, hasFilters ? shouldIgnore : null),
        var histo = r.histo,
            histosize = 1 << (3 * sigbits);

        // check that we aren't below maxcolors already
        var nColors = Object.keys(histo).length;
        if (nColors <= maxcolors) {
            // XXX: generate the new colors from the histo and return
        }

        // get the beginning vbox from the colors
        // var vbox = vboxFromPixels(pixels, histo, hasFilters ? shouldIgnore : null),
        var vbox = r.vbox,
            pq = new PQueue(function(a, b) {
                return pv.naturalOrder(a.count(), b.count())
            });
        pq.push(vbox);

        // inner function to do the iteration

        function iter(lh, target) {
            var ncolors = 1,
                niters = 0,
                vbox;
            while (niters < maxIterations) {
                vbox = lh.pop();
                if (!vbox.count()) { /* just put it back */
                    // lh.push(vbox); // Maybe not
                    niters++;
                    continue;
                }
                // do the cut
                var vboxes = medianCutApply(histo, vbox),
                    vbox1 = vboxes[0],
                    vbox2 = vboxes[1];

                if (!vbox1) {
                    // console.log("vbox1 not defined; shouldn't happen!");
                    return;
                }
                lh.push(vbox1);
                if (vbox2) { /* vbox2 can be null */
                    lh.push(vbox2);
                    ncolors++;
                }
                if (ncolors >= target) return;
                if (niters++ > maxIterations) {
                    return;
                }
            }
        }

        // first set of colors, sorted by population
        iter(pq, fractByPopulations * maxcolors);
        // console.log(pq.size(), pq.debug().length, pq.debug().slice());

        // Re-sort by the product of pixel occupancy times the size in color space.
        var pq2 = new PQueue(function(a, b) {
            return pv.naturalOrder(a.count() * a.volume(), b.count() * b.volume())
        });
        while (pq.size()) {
            pq2.push(pq.pop());
        }

        // next set - generate the median cuts using the (npix * vol) sorting.
        iter(pq2, maxcolors - pq2.size());

        // calculate the actual colors
        var cmap = new CMap();
        while (pq2.size()) {
            var v = pq2.pop(),
              c = vbox.avg();
            if (!hasFilters || !shouldIgnore(c[0], c[1], c[2], 255)) {
              cmap.push(v);
            }
        }

        return cmap;
    }

    return {
        quantize: quantize,
        getAll: getAll,
        medianCutApply: medianCutApply
    }
})();

module.exports = MMCQ.quantize
module.exports.getAll = MMCQ.getAll
module.exports.splitBox = MMCQ.medianCutApply

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcXVhbnRpemUvcXVhbnRpemUuanMiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXGJyb3dzZXIuY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFxidW5kbGUuY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFxmaWx0ZXJcXGRlZmF1bHQuY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFxmaWx0ZXJcXGluZGV4LmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xcZ2VuZXJhdG9yXFxkZWZhdWx0LmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xcZ2VuZXJhdG9yXFxpbmRleC5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXGltYWdlXFxicm93c2VyLmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xcaW1hZ2VcXGluZGV4LmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xccXVhbnRpemVyXFxiYXNlbGluZS5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHF1YW50aXplclxcY29sb3ItY3V0LmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xccXVhbnRpemVyXFxpbXBsXFxjb2xvci1jdXQuY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFxxdWFudGl6ZXJcXGltcGxcXG1tY3EuY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFxxdWFudGl6ZXJcXGltcGxcXHBxdWV1ZS5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHF1YW50aXplclxcaW1wbFxcdmJveC5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHF1YW50aXplclxcaW5kZXguY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFxxdWFudGl6ZXJcXG1tY3EuY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFxxdWFudGl6ZXJcXG5vY29weS5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHN3YXRjaC5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHV0aWwuY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFx2aWJyYW50LmNvZmZlZSIsInZlbmRvci1tb2QvcXVhbnRpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFlQSxJQUFBOztBQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7QUFDVixPQUFPLENBQUMsV0FBVyxDQUFDLEtBQXBCLEdBQTRCLE9BQUEsQ0FBUSxpQkFBUjs7QUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNIakIsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7Ozs7QUNBM0IsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO1NBQ2YsQ0FBQSxJQUFLLEdBQUwsSUFBYSxDQUFJLENBQUMsQ0FBQSxHQUFJLEdBQUosSUFBWSxDQUFBLEdBQUksR0FBaEIsSUFBd0IsQ0FBQSxHQUFJLEdBQTdCO0FBREY7Ozs7QUNBakIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLEdBQXlCLE9BQUEsQ0FBUSxXQUFSOzs7O0FDQXpCLElBQUEsc0RBQUE7RUFBQTs7OztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7QUFDVCxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVI7O0FBQ1AsU0FBQSxHQUFZLE9BQUEsQ0FBUSxTQUFSOztBQUVaLFdBQUEsR0FDRTtFQUFBLGNBQUEsRUFBZ0IsSUFBaEI7RUFDQSxXQUFBLEVBQWEsSUFEYjtFQUVBLFlBQUEsRUFBYyxJQUZkO0VBR0EsZUFBQSxFQUFpQixJQUhqQjtFQUlBLGFBQUEsRUFBZSxHQUpmO0VBS0EsZ0JBQUEsRUFBa0IsR0FMbEI7RUFNQSxhQUFBLEVBQWUsR0FOZjtFQU9BLHFCQUFBLEVBQXVCLEdBUHZCO0VBUUEsa0JBQUEsRUFBb0IsR0FScEI7RUFTQSx1QkFBQSxFQUF5QixHQVR6QjtFQVVBLG9CQUFBLEVBQXNCLElBVnRCO0VBV0EsZ0JBQUEsRUFBa0IsQ0FYbEI7RUFZQSxVQUFBLEVBQVksQ0FaWjtFQWFBLGdCQUFBLEVBQWtCLENBYmxCOzs7QUFlRixNQUFNLENBQUMsT0FBUCxHQUNNOzs7NkJBQ0osaUJBQUEsR0FBbUI7O0VBQ04sMEJBQUMsSUFBRDtJQUNYLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLFdBQXBCO0lBQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFDakIsSUFBQyxDQUFBLGtCQUFELEdBQXNCO0lBQ3RCLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBQ3BCLElBQUMsQ0FBQSxlQUFELEdBQW1CO0VBUFI7OzZCQVNiLFFBQUEsR0FBVSxTQUFDLFFBQUQ7SUFBQyxJQUFDLENBQUEsV0FBRDtJQUNULElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQTtJQUVsQixJQUFDLENBQUEsc0JBQUQsQ0FBQTtXQUNBLElBQUMsQ0FBQSxxQkFBRCxDQUFBO0VBSlE7OzZCQU1WLGdCQUFBLEdBQWtCLFNBQUE7V0FDaEIsSUFBQyxDQUFBO0VBRGU7OzZCQUdsQixxQkFBQSxHQUF1QixTQUFBO1dBQ3JCLElBQUMsQ0FBQTtFQURvQjs7NkJBR3ZCLG9CQUFBLEdBQXNCLFNBQUE7V0FDcEIsSUFBQyxDQUFBO0VBRG1COzs2QkFHdEIsY0FBQSxHQUFnQixTQUFBO1dBQ2QsSUFBQyxDQUFBO0VBRGE7OzZCQUdoQixtQkFBQSxHQUFxQixTQUFBO1dBQ25CLElBQUMsQ0FBQTtFQURrQjs7NkJBR3JCLGtCQUFBLEdBQW9CLFNBQUE7V0FDbEIsSUFBQyxDQUFBO0VBRGlCOzs2QkFHcEIsc0JBQUEsR0FBd0IsU0FBQTtJQUN0QixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBMUIsRUFBNEMsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFsRCxFQUFpRSxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQXZFLEVBQ2YsSUFBQyxDQUFBLElBQUksQ0FBQyx1QkFEUyxFQUNnQixJQUFDLENBQUEsSUFBSSxDQUFDLG9CQUR0QixFQUM0QyxDQUQ1QztJQUdqQixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQUMsQ0FBQSxJQUFJLENBQUMsZUFBMUIsRUFBMkMsSUFBQyxDQUFBLElBQUksQ0FBQyxZQUFqRCxFQUErRCxDQUEvRCxFQUNwQixJQUFDLENBQUEsSUFBSSxDQUFDLHVCQURjLEVBQ1csSUFBQyxDQUFBLElBQUksQ0FBQyxvQkFEakIsRUFDdUMsQ0FEdkM7SUFHdEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFDLENBQUEsSUFBSSxDQUFDLGNBQTFCLEVBQTBDLENBQTFDLEVBQTZDLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBbkQsRUFDbkIsSUFBQyxDQUFBLElBQUksQ0FBQyx1QkFEYSxFQUNZLElBQUMsQ0FBQSxJQUFJLENBQUMsb0JBRGxCLEVBQ3dDLENBRHhDO0lBR3JCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQUMsQ0FBQSxJQUFJLENBQUMsZ0JBQTFCLEVBQTRDLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBbEQsRUFBaUUsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUF2RSxFQUNiLElBQUMsQ0FBQSxJQUFJLENBQUMscUJBRE8sRUFDZ0IsQ0FEaEIsRUFDbUIsSUFBQyxDQUFBLElBQUksQ0FBQyxrQkFEekI7SUFHZixJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQUMsQ0FBQSxJQUFJLENBQUMsZUFBMUIsRUFBMkMsSUFBQyxDQUFBLElBQUksQ0FBQyxZQUFqRCxFQUErRCxDQUEvRCxFQUNsQixJQUFDLENBQUEsSUFBSSxDQUFDLHFCQURZLEVBQ1csQ0FEWCxFQUNjLElBQUMsQ0FBQSxJQUFJLENBQUMsa0JBRHBCO1dBR3BCLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFDLENBQUEsSUFBSSxDQUFDLGNBQTFCLEVBQTBDLENBQTFDLEVBQTZDLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBbkQsRUFDakIsSUFBQyxDQUFBLElBQUksQ0FBQyxxQkFEVyxFQUNZLENBRFosRUFDZSxJQUFDLENBQUEsSUFBSSxDQUFDLGtCQURyQjtFQWhCRzs7NkJBbUJ4QixxQkFBQSxHQUF1QixTQUFBO0FBQ3JCLFFBQUE7SUFBQSxJQUFHLElBQUMsQ0FBQSxhQUFELEtBQWtCLElBQXJCO01BRUUsSUFBRyxJQUFDLENBQUEsaUJBQUQsS0FBd0IsSUFBM0I7UUFFRSxHQUFBLEdBQU0sSUFBQyxDQUFBLGlCQUFpQixDQUFDLE1BQW5CLENBQUE7UUFDTixHQUFJLENBQUEsQ0FBQSxDQUFKLEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQztRQUNmLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsR0FBSSxDQUFBLENBQUEsQ0FBbEIsRUFBc0IsR0FBSSxDQUFBLENBQUEsQ0FBMUIsRUFBOEIsR0FBSSxDQUFBLENBQUEsQ0FBbEMsQ0FBUCxFQUE4QyxDQUE5QyxFQUp2QjtPQUZGOztJQVFBLElBQUcsSUFBQyxDQUFBLGlCQUFELEtBQXNCLElBQXpCO01BRUUsSUFBRyxJQUFDLENBQUEsYUFBRCxLQUFvQixJQUF2QjtRQUVFLEdBQUEsR0FBTSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsQ0FBQTtRQUNOLEdBQUksQ0FBQSxDQUFBLENBQUosR0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDO2VBQ2YsSUFBQyxDQUFBLGlCQUFELEdBQXlCLElBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsR0FBSSxDQUFBLENBQUEsQ0FBbEIsRUFBc0IsR0FBSSxDQUFBLENBQUEsQ0FBMUIsRUFBOEIsR0FBSSxDQUFBLENBQUEsQ0FBbEMsQ0FBUCxFQUE4QyxDQUE5QyxFQUozQjtPQUZGOztFQVRxQjs7NkJBaUJ2QixpQkFBQSxHQUFtQixTQUFBO0FBQ2pCLFFBQUE7SUFBQSxVQUFBLEdBQWE7QUFDYjtBQUFBLFNBQUEscUNBQUE7O01BQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxHQUFMLENBQVMsVUFBVCxFQUFxQixNQUFNLENBQUMsYUFBUCxDQUFBLENBQXJCO0FBQWI7V0FDQTtFQUhpQjs7NkJBS25CLGtCQUFBLEdBQW9CLFNBQUMsVUFBRCxFQUFhLE9BQWIsRUFBc0IsT0FBdEIsRUFBK0IsZ0JBQS9CLEVBQWlELGFBQWpELEVBQWdFLGFBQWhFO0FBQ2xCLFFBQUE7SUFBQSxHQUFBLEdBQU07SUFDTixRQUFBLEdBQVc7QUFFWDtBQUFBLFNBQUEscUNBQUE7O01BQ0UsR0FBQSxHQUFNLE1BQU0sQ0FBQyxNQUFQLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBO01BQ3RCLElBQUEsR0FBTyxNQUFNLENBQUMsTUFBUCxDQUFBLENBQWdCLENBQUEsQ0FBQTtNQUV2QixJQUFHLEdBQUEsSUFBTyxhQUFQLElBQXlCLEdBQUEsSUFBTyxhQUFoQyxJQUNELElBQUEsSUFBUSxPQURQLElBQ21CLElBQUEsSUFBUSxPQUQzQixJQUVELENBQUksSUFBQyxDQUFBLGlCQUFELENBQW1CLE1BQW5CLENBRk47UUFHSSxLQUFBLEdBQVEsSUFBQyxDQUFBLHFCQUFELENBQXVCLEdBQXZCLEVBQTRCLGdCQUE1QixFQUE4QyxJQUE5QyxFQUFvRCxVQUFwRCxFQUNOLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FETSxFQUNrQixJQUFDLENBQUEsaUJBRG5CO1FBRVIsSUFBRyxHQUFBLEtBQU8sSUFBUCxJQUFlLEtBQUEsR0FBUSxRQUExQjtVQUNFLEdBQUEsR0FBTTtVQUNOLFFBQUEsR0FBVyxNQUZiO1NBTEo7O0FBSkY7V0FhQTtFQWpCa0I7OzZCQW1CcEIscUJBQUEsR0FBdUIsU0FBQyxVQUFELEVBQWEsZ0JBQWIsRUFDbkIsSUFEbUIsRUFDYixVQURhLEVBQ0QsVUFEQyxFQUNXLGFBRFg7V0FFckIsSUFBQyxDQUFBLFlBQUQsQ0FDRSxJQUFDLENBQUEsVUFBRCxDQUFZLFVBQVosRUFBd0IsZ0JBQXhCLENBREYsRUFDNkMsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFEbkQsRUFFRSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosRUFBa0IsVUFBbEIsQ0FGRixFQUVpQyxJQUFDLENBQUEsSUFBSSxDQUFDLFVBRnZDLEVBR0UsVUFBQSxHQUFhLGFBSGYsRUFHOEIsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFIcEM7RUFGcUI7OzZCQVF2QixVQUFBLEdBQVksU0FBQyxLQUFELEVBQVEsV0FBUjtXQUNWLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQUEsR0FBUSxXQUFqQjtFQURNOzs2QkFHWixZQUFBLEdBQWMsU0FBQTtBQUNaLFFBQUE7SUFEYTtJQUNiLEdBQUEsR0FBTTtJQUNOLFNBQUEsR0FBWTtJQUNaLENBQUEsR0FBSTtBQUNKLFdBQU0sQ0FBQSxHQUFJLE1BQU0sQ0FBQyxNQUFqQjtNQUNFLEtBQUEsR0FBUSxNQUFPLENBQUEsQ0FBQTtNQUNmLE1BQUEsR0FBUyxNQUFPLENBQUEsQ0FBQSxHQUFJLENBQUo7TUFDaEIsR0FBQSxJQUFPLEtBQUEsR0FBUTtNQUNmLFNBQUEsSUFBYTtNQUNiLENBQUEsSUFBSztJQUxQO1dBTUEsR0FBQSxHQUFNO0VBVk07OzZCQVlkLGlCQUFBLEdBQW1CLFNBQUMsTUFBRDtXQUNqQixJQUFDLENBQUEsYUFBRCxLQUFrQixNQUFsQixJQUE0QixJQUFDLENBQUEsaUJBQUQsS0FBc0IsTUFBbEQsSUFDRSxJQUFDLENBQUEsa0JBQUQsS0FBdUIsTUFEekIsSUFDbUMsSUFBQyxDQUFBLFdBQUQsS0FBZ0IsTUFEbkQsSUFFRSxJQUFDLENBQUEsZUFBRCxLQUFvQixNQUZ0QixJQUVnQyxJQUFDLENBQUEsZ0JBQUQsS0FBcUI7RUFIcEM7Ozs7R0F0SFU7Ozs7QUNyQi9CLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O3NCQUNKLFFBQUEsR0FBVSxTQUFDLFFBQUQsR0FBQTs7c0JBRVYsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBOztzQkFFbEIscUJBQUEsR0FBdUIsU0FBQSxHQUFBOztzQkFFdkIsb0JBQUEsR0FBc0IsU0FBQSxHQUFBOztzQkFFdEIsY0FBQSxHQUFnQixTQUFBLEdBQUE7O3NCQUVoQixtQkFBQSxHQUFxQixTQUFBLEdBQUE7O3NCQUVyQixrQkFBQSxHQUFvQixTQUFBLEdBQUE7Ozs7OztBQUV0QixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWYsR0FBeUIsT0FBQSxDQUFRLFdBQVI7Ozs7QUNoQnpCLElBQUEsbUJBQUE7RUFBQTs7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztBQUNSLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztFQUNTLHNCQUFDLElBQUQsRUFBTyxFQUFQO0lBQ1gsSUFBQyxDQUFBLEdBQUQsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtJQUNQLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxHQUFtQjtJQUNuQixJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsR0FBVztJQUVYLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxHQUFjLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtRQUNaLEtBQUMsQ0FBQSxXQUFELENBQUE7MENBQ0EsR0FBSSxNQUFNO01BRkU7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0lBSWQsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLEdBQWUsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLENBQUQ7QUFDYixZQUFBO1FBQUEsR0FBQSxHQUFVLElBQUEsS0FBQSxDQUFNLHNCQUFBLEdBQXlCLElBQS9CO1FBQ1YsR0FBRyxDQUFDLEdBQUosR0FBVTswQ0FDVixHQUFJO01BSFM7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0VBVEo7O3lCQWNiLFdBQUEsR0FBYSxTQUFBO0lBQ1gsSUFBQyxDQUFBLE1BQUQsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QjtJQUNWLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1gsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFkLENBQTBCLElBQUMsQ0FBQSxNQUEzQjtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLElBQUMsQ0FBQSxHQUFHLENBQUM7SUFDOUIsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBQyxDQUFBLEdBQUcsQ0FBQztXQUNoQyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBbUIsSUFBQyxDQUFBLEdBQXBCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLElBQUMsQ0FBQSxLQUFoQyxFQUF1QyxJQUFDLENBQUEsTUFBeEM7RUFOVzs7eUJBUWIsS0FBQSxHQUFPLFNBQUE7V0FDTCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsSUFBQyxDQUFBLEtBQTFCLEVBQWlDLElBQUMsQ0FBQSxNQUFsQztFQURLOzt5QkFHUCxRQUFBLEdBQVUsU0FBQTtXQUNSLElBQUMsQ0FBQTtFQURPOzt5QkFHVixTQUFBLEdBQVcsU0FBQTtXQUNULElBQUMsQ0FBQTtFQURROzt5QkFHWCxNQUFBLEdBQVEsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7SUFDTixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQjtJQUN6QixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQjtJQUMzQixJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVQsQ0FBZSxDQUFmLEVBQWtCLENBQWxCO1dBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQW1CLElBQUMsQ0FBQSxHQUFwQixFQUF5QixDQUF6QixFQUE0QixDQUE1QjtFQUpNOzt5QkFNUixNQUFBLEdBQVEsU0FBQyxTQUFEO1dBQ04sSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLFNBQXRCLEVBQWlDLENBQWpDLEVBQW9DLENBQXBDO0VBRE07O3lCQUdSLGFBQUEsR0FBZSxTQUFBO1dBQ2IsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUE7RUFERzs7eUJBR2YsWUFBQSxHQUFjLFNBQUE7V0FDWixJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsSUFBQyxDQUFBLEtBQTdCLEVBQW9DLElBQUMsQ0FBQSxNQUFyQztFQURZOzt5QkFHZCxZQUFBLEdBQWMsU0FBQTtXQUNaLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQW5CLENBQStCLElBQUMsQ0FBQSxNQUFoQztFQURZOzs7O0dBL0NXOzs7O0FDRjNCLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O2tCQUNKLEtBQUEsR0FBTyxTQUFBLEdBQUE7O2tCQUVQLE1BQUEsR0FBUSxTQUFDLFNBQUQsR0FBQTs7a0JBRVIsUUFBQSxHQUFVLFNBQUEsR0FBQTs7a0JBRVYsU0FBQSxHQUFXLFNBQUEsR0FBQTs7a0JBRVgsU0FBQSxHQUFXLFNBQUMsSUFBRDtBQUNULFFBQUE7SUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFFBQUQsQ0FBQTtJQUNSLE1BQUEsR0FBUyxJQUFDLENBQUEsU0FBRCxDQUFBO0lBRVQsS0FBQSxHQUFRO0lBQ1IsSUFBRyx5QkFBSDtNQUNFLE9BQUEsR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsRUFBZ0IsTUFBaEI7TUFDVixJQUFHLE9BQUEsR0FBVSxJQUFJLENBQUMsWUFBbEI7UUFDRSxLQUFBLEdBQVEsSUFBSSxDQUFDLFlBQUwsR0FBb0IsUUFEOUI7T0FGRjtLQUFBLE1BQUE7TUFLRSxLQUFBLEdBQVEsQ0FBQSxHQUFJLElBQUksQ0FBQyxRQUxuQjs7SUFPQSxJQUFHLEtBQUEsR0FBUSxDQUFYO2FBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFBLEdBQVEsS0FBaEIsRUFBdUIsTUFBQSxHQUFTLEtBQWhDLEVBQXVDLEtBQXZDLEVBREY7O0VBWlM7O2tCQWVYLE1BQUEsR0FBUSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxHQUFBOztrQkFHUixhQUFBLEdBQWUsU0FBQSxHQUFBOztrQkFFZixZQUFBLEdBQWMsU0FBQSxHQUFBOztrQkFFZCxZQUFBLEdBQWMsU0FBQSxHQUFBOzs7Ozs7OztBQ2hDaEIsSUFBQSw4Q0FBQTtFQUFBOzs7QUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0FBQ1QsU0FBQSxHQUFZLE9BQUEsQ0FBUSxTQUFSOztBQUNaLFFBQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7QUFFWCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OzhCQUNKLFVBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ1YsUUFBQTtJQURtQixJQUFDLENBQUEsT0FBRDtJQUNuQixVQUFBLEdBQWEsTUFBTSxDQUFDLE1BQVAsR0FBZ0I7SUFDN0IsU0FBQSxHQUFZO0lBQ1osQ0FBQSxHQUFJO0FBRUosV0FBTSxDQUFBLEdBQUksVUFBVjtNQUNFLE1BQUEsR0FBUyxDQUFBLEdBQUk7TUFDYixDQUFBLEdBQUksTUFBTyxDQUFBLE1BQUEsR0FBUyxDQUFUO01BQ1gsQ0FBQSxHQUFJLE1BQU8sQ0FBQSxNQUFBLEdBQVMsQ0FBVDtNQUNYLENBQUEsR0FBSSxNQUFPLENBQUEsTUFBQSxHQUFTLENBQVQ7TUFDWCxDQUFBLEdBQUksTUFBTyxDQUFBLE1BQUEsR0FBUyxDQUFUO01BRVgsSUFBRyxDQUFBLElBQUssR0FBUjtRQUNFLElBQUcsQ0FBSSxDQUFDLENBQUEsR0FBSSxHQUFKLElBQVksQ0FBQSxHQUFJLEdBQWhCLElBQXdCLENBQUEsR0FBSSxHQUE3QixDQUFQO1VBQ0UsU0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFmLEVBREY7U0FERjs7TUFHQSxDQUFBLEdBQUksQ0FBQSxHQUFJLElBQUMsQ0FBQSxJQUFJLENBQUM7SUFWaEI7SUFhQSxJQUFBLEdBQU8sUUFBQSxDQUFTLFNBQVQsRUFBb0IsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUExQjtXQUNQLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxJQUFEO2VBQ3RCLElBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFaLEVBQW1CLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBVixDQUFBLENBQW5CO01BRHNCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtFQW5CRjs7OEJBc0JaLGtCQUFBLEdBQW9CLFNBQUE7V0FDbEIsSUFBQyxDQUFBO0VBRGlCOzs7O0dBdkJVOzs7O0FDTGhDLElBQUEsOENBQUE7RUFBQTs7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztBQUNULFNBQUEsR0FBWSxPQUFBLENBQVEsU0FBUjs7QUFDWixRQUFBLEdBQVcsT0FBQSxDQUFRLGtCQUFSOztBQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7OEJBQ0osVUFBQSxHQUFZLFNBQUMsTUFBRCxFQUFTLElBQVQ7QUFDVixRQUFBO0lBRG1CLElBQUMsQ0FBQSxPQUFEO0lBQ25CLEdBQUEsR0FBVSxJQUFBLFdBQUEsQ0FBWSxNQUFNLENBQUMsTUFBbkI7SUFDVixJQUFBLEdBQVcsSUFBQSxpQkFBQSxDQUFrQixHQUFsQjtJQUNYLElBQUEsR0FBVyxJQUFBLFdBQUEsQ0FBWSxHQUFaO0lBQ1gsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFUO1dBRUEsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxRQUFBLENBQVMsSUFBVCxFQUFlLElBQUMsQ0FBQSxJQUFoQjtFQU5QOzs4QkFTWixrQkFBQSxHQUFvQixTQUFBO1dBQ2xCLElBQUMsQ0FBQSxTQUFTLENBQUMsa0JBQVgsQ0FBQTtFQURrQjs7OztHQVZVOzs7O0FDSmhDLElBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSOztBQUVULElBQUEsR0FBTyxTQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWEsS0FBYjtBQUNMLE1BQUE7RUFBQSxJQUFBLEdBQU8sU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNMLFFBQUE7SUFBQSxDQUFBLEdBQUksR0FBSSxDQUFBLENBQUE7SUFDUixHQUFJLENBQUEsQ0FBQSxDQUFKLEdBQVMsR0FBSSxDQUFBLENBQUE7V0FDYixHQUFJLENBQUEsQ0FBQSxDQUFKLEdBQVM7RUFISjtFQUtQLFNBQUEsR0FBWSxTQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsS0FBZDtBQUNWLFFBQUE7SUFBQSxLQUFBLEdBQVE7SUFDUixLQUFBLEdBQVEsR0FBSSxDQUFBLEtBQUE7SUFFWixJQUFBLENBQUssS0FBTCxFQUFZLEtBQVo7QUFFQSxTQUFTLHNHQUFUO01BQ0UsSUFBRyxHQUFJLENBQUEsQ0FBQSxDQUFKLEdBQVMsS0FBWjtRQUNFLElBQUEsQ0FBSyxDQUFMLEVBQVEsS0FBUjtRQUNBLEtBQUEsR0FGRjs7QUFERjtJQUtBLElBQUEsQ0FBSyxLQUFMLEVBQVksS0FBWjtXQUVBO0VBYlU7RUFlWixJQUFHLEtBQUEsR0FBUSxLQUFYO0lBQ0UsS0FBQSxHQUFRLEtBQUEsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLENBQUMsS0FBQSxHQUFRLEtBQVQsQ0FBQSxHQUFrQixDQUE1QjtJQUNoQixLQUFBLEdBQVEsU0FBQSxDQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0IsS0FBeEI7SUFFUixJQUFBLENBQUssR0FBTCxFQUFVLEtBQVYsRUFBaUIsS0FBQSxHQUFRLENBQXpCO1dBQ0EsSUFBQSxDQUFLLEdBQUwsRUFBVSxLQUFBLEdBQVEsQ0FBbEIsRUFBcUIsS0FBckIsRUFMRjs7QUFyQks7O0FBNkJQLGFBQUEsR0FBb0IsQ0FBQzs7QUFDckIsZUFBQSxHQUFvQixDQUFDOztBQUNyQixjQUFBLEdBQW9CLENBQUM7O0FBRXJCLG1CQUFBLEdBQXNCOztBQUN0QixrQkFBQSxHQUFzQixDQUFDLENBQUEsSUFBSyxtQkFBTixDQUFBLEdBQTZCOztBQUduRCxTQUFBLEdBQ0U7RUFBQSxHQUFBLEVBQUssU0FBQyxDQUFEO1dBQ0gsQ0FBQSxJQUFHO0VBREEsQ0FBTDtFQUVBLEtBQUEsRUFBTyxTQUFDLENBQUQ7V0FDTCxDQUFBLElBQUcsQ0FBSCxJQUFNO0VBREQsQ0FGUDtFQUlBLElBQUEsRUFBTSxTQUFDLENBQUQ7V0FDSixDQUFBLElBQUcsRUFBSCxJQUFPO0VBREgsQ0FKTjtFQU1BLEtBQUEsRUFBTyxTQUFDLENBQUQ7V0FDTCxDQUFBLElBQUcsRUFBSCxJQUFPO0VBREYsQ0FOUDs7O0FBVUYsU0FBQSxHQUNFO0VBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtXQUNILENBQUEsSUFBRyxFQUFILElBQU87RUFESixDQUFMO0VBRUEsS0FBQSxFQUFPLFNBQUMsQ0FBRDtXQUNMLENBQUEsSUFBRyxFQUFILElBQU87RUFERixDQUZQO0VBSUEsSUFBQSxFQUFNLFNBQUMsQ0FBRDtXQUNKLENBQUEsSUFBRyxDQUFILElBQU07RUFERixDQUpOO0VBTUEsS0FBQSxFQUFPLFNBQUMsQ0FBRDtXQUNMLENBQUEsSUFBRztFQURFLENBTlA7OztBQVNGLGNBQUEsR0FBaUIsU0FBQTtBQUNmLE1BQUE7RUFBQSxDQUFBLEdBQVEsSUFBQSxXQUFBLENBQVksQ0FBWjtFQUNSLENBQUEsR0FBUSxJQUFBLFVBQUEsQ0FBVyxDQUFYO0VBQ1IsQ0FBQSxHQUFRLElBQUEsV0FBQSxDQUFZLENBQVo7RUFDUixDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU87RUFDUCxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU87RUFDUCxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU87RUFDUCxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU87RUFDUCxJQUFHLENBQUUsQ0FBQSxDQUFBLENBQUYsS0FBUSxVQUFYO0FBQTJCLFdBQU8sS0FBbEM7O0VBQ0EsSUFBRyxDQUFFLENBQUEsQ0FBQSxDQUFGLEtBQVEsVUFBWDtBQUEyQixXQUFPLE1BQWxDOztBQUNBLFFBQVUsSUFBQSxLQUFBLENBQU0sK0JBQU47QUFWSzs7QUFZakIsS0FBQSxHQUFXLGNBQUEsQ0FBQSxDQUFILEdBQXlCLFNBQXpCLEdBQXdDOztBQUVoRCxlQUFBLEdBQWtCLFNBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsTUFBakI7QUFDaEIsTUFBQTtFQUFBLFFBQUEsR0FBVztFQUNYLElBQUcsTUFBQSxHQUFTLE9BQVo7SUFDRSxRQUFBLEdBQVcsS0FBQSxJQUFTLENBQUMsTUFBQSxHQUFTLE9BQVYsRUFEdEI7R0FBQSxNQUFBO0lBR0UsUUFBQSxHQUFXLEtBQUEsSUFBUyxDQUFDLE9BQUEsR0FBVSxNQUFYLEVBSHRCOztTQUtBLFFBQUEsR0FBVyxDQUFDLENBQUMsQ0FBQSxJQUFHLE1BQUosQ0FBQSxHQUFjLENBQWY7QUFQSzs7QUFTbEIsc0JBQUEsR0FBeUIsU0FBQyxDQUFELEVBQUksU0FBSixFQUFlLEtBQWYsRUFBc0IsS0FBdEI7QUFDdkIsTUFBQTtBQUFBLFVBQU8sU0FBUDtBQUFBLFNBQ08sYUFEUDtBQUVJO0FBRkosU0FHTyxlQUhQO0FBS0ksV0FBUyxtR0FBVDtRQUNFLEtBQUEsR0FBUSxDQUFFLENBQUEsQ0FBQTtRQUNWLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxjQUFBLENBQWUsS0FBZixDQUFBLElBQXlCLENBQUMsbUJBQUEsR0FBc0IsbUJBQXZCLENBQXpCLEdBQ0gsWUFBQSxDQUFhLEtBQWIsQ0FBQSxJQUF1QixtQkFEcEIsR0FFSCxhQUFBLENBQWMsS0FBZDtBQUpOO0FBS0E7QUFWSixTQVdPLGNBWFA7QUFhSSxXQUFTLHNHQUFUO1FBQ0UsS0FBQSxHQUFRLENBQUUsQ0FBQSxDQUFBO1FBQ1YsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLGFBQUEsQ0FBYyxLQUFkLENBQUEsSUFBd0IsQ0FBQyxtQkFBQSxHQUFzQixtQkFBdkIsQ0FBeEIsR0FDSCxjQUFBLENBQWUsS0FBZixDQUFBLElBQXlCLG1CQUR0QixHQUVILFlBQUEsQ0FBYSxLQUFiO0FBSk47QUFLQTtBQWxCSjtBQUR1Qjs7QUFzQnpCLGtCQUFBLEdBQXFCLFNBQUMsS0FBRDtBQUNuQixNQUFBO0VBQUEsQ0FBQSxHQUFJLGVBQUEsQ0FBZ0IsS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFWLENBQWhCLEVBQWtDLENBQWxDLEVBQXFDLG1CQUFyQztFQUNKLENBQUEsR0FBSSxlQUFBLENBQWdCLEtBQUssQ0FBQyxLQUFOLENBQVksS0FBWixDQUFoQixFQUFvQyxDQUFwQyxFQUF1QyxtQkFBdkM7RUFDSixDQUFBLEdBQUksZUFBQSxDQUFnQixLQUFLLENBQUMsSUFBTixDQUFXLEtBQVgsQ0FBaEIsRUFBbUMsQ0FBbkMsRUFBc0MsbUJBQXRDO1NBRUosQ0FBQSxJQUFHLENBQUMsbUJBQUEsR0FBb0IsbUJBQXJCLENBQUgsR0FBNkMsQ0FBQSxJQUFHLG1CQUFoRCxHQUFvRTtBQUxqRDs7QUFPckIsbUJBQUEsR0FBc0IsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFDcEIsTUFBQTtFQUFBLElBQUcsQ0FBSSxDQUFDLFdBQUEsSUFBTyxXQUFSLENBQVA7SUFDRSxLQUFBLEdBQVE7SUFDUixDQUFBLEdBQUksWUFBQSxDQUFhLEtBQWI7SUFDSixDQUFBLEdBQUksY0FBQSxDQUFlLEtBQWY7SUFDSixDQUFBLEdBQUksYUFBQSxDQUFjLEtBQWQsRUFKTjs7U0FLQSxDQUNFLGVBQUEsQ0FBZ0IsQ0FBaEIsRUFBbUIsbUJBQW5CLEVBQXdDLENBQXhDLENBREYsRUFFRSxlQUFBLENBQWdCLENBQWhCLEVBQW1CLG1CQUFuQixFQUF3QyxDQUF4QyxDQUZGLEVBR0UsZUFBQSxDQUFnQixDQUFoQixFQUFtQixtQkFBbkIsRUFBd0MsQ0FBeEMsQ0FIRjtBQU5vQjs7QUFZdEIsWUFBQSxHQUFlLFNBQUMsS0FBRDtTQUNiLEtBQUEsSUFBUyxDQUFDLG1CQUFBLEdBQXNCLG1CQUF2QixDQUFULEdBQXVEO0FBRDFDOztBQUdmLGNBQUEsR0FBaUIsU0FBQyxLQUFEO1NBQ2YsS0FBQSxJQUFTLG1CQUFULEdBQStCO0FBRGhCOztBQUdqQixhQUFBLEdBQWdCLFNBQUMsS0FBRDtTQUNkLEtBQUEsR0FBUTtBQURNOztBQUloQixNQUFNLENBQUMsT0FBUCxHQUNNO0VBQ1MsMkJBQUMsSUFBRCxFQUFPLElBQVA7QUFDWCxRQUFBO0lBRGtCLElBQUMsQ0FBQSxPQUFEO0lBQ2xCLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxXQUFBLENBQVksQ0FBQSxJQUFLLENBQUMsbUJBQUEsR0FBc0IsQ0FBdkIsQ0FBakI7SUFDWixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsV0FBQSxDQUFZLElBQUksQ0FBQyxNQUFqQjtBQUNkLFNBQVMsMEZBQVQ7TUFDRSxJQUFDLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUixHQUFhLGNBQUEsR0FBaUIsa0JBQUEsQ0FBbUIsSUFBSyxDQUFBLENBQUEsQ0FBeEI7TUFDOUIsSUFBQyxDQUFBLElBQUssQ0FBQSxjQUFBLENBQU47QUFGRjtJQUlBLGtCQUFBLEdBQXFCO0FBRXJCLFNBQWEsNEdBQWI7TUFJRSxJQUFHLElBQUMsQ0FBQSxJQUFLLENBQUEsS0FBQSxDQUFOLEdBQWUsQ0FBbEI7UUFDRSxrQkFBQSxHQURGOztBQUpGO0lBT0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLFdBQUEsQ0FBWSxrQkFBWjtJQUNkLGtCQUFBLEdBQXFCO0FBRXJCLFNBQWEsNEdBQWI7TUFDRSxJQUFHLElBQUMsQ0FBQSxJQUFLLENBQUEsS0FBQSxDQUFOLEdBQWUsQ0FBbEI7UUFDRSxJQUFDLENBQUEsTUFBTyxDQUFBLGtCQUFBLEVBQUEsQ0FBUixHQUFnQyxNQURsQzs7QUFERjtJQUlBLElBQUcsa0JBQUEsSUFBc0IsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUEvQjtNQUNFLElBQUMsQ0FBQSxlQUFELEdBQW1CO0FBQ25CLFdBQVMsc0dBQVQ7UUFDRSxDQUFBLEdBQUksSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBO1FBQ1osSUFBQyxDQUFBLGVBQWUsQ0FBQyxJQUFqQixDQUEwQixJQUFBLE1BQUEsQ0FBTyxtQkFBQSxDQUFvQixDQUFwQixDQUFQLEVBQStCLElBQUMsQ0FBQSxJQUFLLENBQUEsQ0FBQSxDQUFyQyxDQUExQjtBQUZGLE9BRkY7S0FBQSxNQUFBO01BTUUsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUF0QixFQU5yQjs7RUF2Qlc7OzhCQStCYixrQkFBQSxHQUFvQixTQUFBO1dBQ2xCLElBQUMsQ0FBQTtFQURpQjs7OEJBR3BCLGNBQUEsR0FBZ0IsU0FBQyxTQUFEO0FBSWQsUUFBQTtJQUFBLEVBQUEsR0FBUyxJQUFBLGFBQUEsQ0FBYztNQUFBLFVBQUEsRUFBWSxJQUFJLENBQUMsVUFBakI7S0FBZDtJQUlULEVBQUUsQ0FBQyxLQUFILENBQWEsSUFBQSxJQUFBLENBQUssSUFBQyxDQUFBLE1BQU4sRUFBYyxJQUFDLENBQUEsSUFBZixFQUFxQixDQUFyQixFQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsQ0FBekMsQ0FBYjtJQUtBLElBQUMsQ0FBQSxVQUFELENBQVksRUFBWixFQUFnQixTQUFoQjtXQUdBLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixFQUF2QjtFQWhCYzs7OEJBa0JoQixVQUFBLEdBQVksU0FBQyxLQUFELEVBQVEsT0FBUjtBQUNWLFFBQUE7QUFBQSxXQUFNLEtBQUssQ0FBQyxNQUFOLEdBQWUsT0FBckI7TUFDRSxJQUFBLEdBQU8sS0FBSyxDQUFDLE9BQU4sQ0FBQTtNQUVQLG1CQUFHLElBQUksQ0FBRSxRQUFOLENBQUEsVUFBSDtRQUNFLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFaO1FBQ0EsS0FBSyxDQUFDLEtBQU4sQ0FBWSxJQUFaLEVBRkY7T0FBQSxNQUFBO0FBSUUsZUFKRjs7SUFIRjtFQURVOzs4QkFVWixxQkFBQSxHQUF1QixTQUFDLE1BQUQ7QUFDckIsUUFBQTtJQUFBLE1BQUEsR0FBUztBQUVULFdBQU0sTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBdEI7TUFDRSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxlQUFqQixDQUFBLENBQVo7SUFERjtXQVNBO0VBWnFCOzs7Ozs7QUFjbkI7RUFDSixJQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsR0FBRCxFQUFNLEdBQU47V0FDWCxHQUFHLENBQUMsU0FBSixDQUFBLENBQUEsR0FBa0IsR0FBRyxDQUFDLFNBQUosQ0FBQTtFQURQOztFQUdBLGNBQUMsT0FBRCxFQUFVLElBQVYsRUFBaUIsVUFBakIsRUFBOEIsVUFBOUI7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUFTLElBQUMsQ0FBQSxPQUFEO0lBQU8sSUFBQyxDQUFBLGFBQUQ7SUFBYSxJQUFDLENBQUEsYUFBRDtJQUN6QyxJQUFDLENBQUEsTUFBRCxDQUFBO0VBRFc7O2lCQUdiLFNBQUEsR0FBVyxTQUFBO1dBQ1QsQ0FBQyxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFYLEdBQW9CLENBQXJCLENBQUEsR0FBMEIsQ0FBQyxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxRQUFiLEdBQXdCLENBQXpCLENBQTFCLEdBQXdELENBQUMsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsT0FBWixHQUFzQixDQUF2QjtFQUQvQzs7aUJBR1gsUUFBQSxHQUFVLFNBQUE7V0FDUixJQUFDLENBQUEsYUFBRCxDQUFBLENBQUEsR0FBbUI7RUFEWDs7aUJBR1YsYUFBQSxHQUFlLFNBQUE7V0FDYixDQUFBLEdBQUksSUFBQyxDQUFBLFVBQUwsR0FBa0IsSUFBQyxDQUFBO0VBRE47O2lCQUdmLE1BQUEsR0FBUSxTQUFBO0FBQ04sUUFBQTtJQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsT0FBRCxHQUFXLE1BQU0sQ0FBQztJQUN4QyxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLE9BQUQsR0FBVyxNQUFNLENBQUM7SUFDeEMsSUFBQyxDQUFBLFVBQUQsR0FBYztJQUNkLEtBQUEsR0FBUTtBQUNSLFNBQVMsdUhBQVQ7TUFDRSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBO01BQ2hCLEtBQUEsSUFBUyxJQUFDLENBQUEsSUFBSyxDQUFBLEtBQUE7TUFFZixDQUFBLEdBQUksWUFBQSxDQUFhLEtBQWI7TUFDSixDQUFBLEdBQUksY0FBQSxDQUFlLEtBQWY7TUFDSixDQUFBLEdBQUksYUFBQSxDQUFjLEtBQWQ7TUFFSixJQUFHLENBQUEsR0FBSSxJQUFDLENBQUEsTUFBUjtRQUFvQixJQUFDLENBQUEsTUFBRCxHQUFVLEVBQTlCOztNQUNBLElBQUcsQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFSO1FBQW9CLElBQUMsQ0FBQSxNQUFELEdBQVUsRUFBOUI7O01BQ0EsSUFBRyxDQUFBLEdBQUksSUFBQyxDQUFBLFFBQVI7UUFBc0IsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUFsQzs7TUFDQSxJQUFHLENBQUEsR0FBSSxJQUFDLENBQUEsUUFBUjtRQUFzQixJQUFDLENBQUEsUUFBRCxHQUFZLEVBQWxDOztNQUNBLElBQUcsQ0FBQSxHQUFJLElBQUMsQ0FBQSxPQUFSO1FBQXFCLElBQUMsQ0FBQSxNQUFELEdBQVUsRUFBL0I7O01BQ0EsSUFBRyxDQUFBLEdBQUksSUFBQyxDQUFBLE9BQVI7UUFBcUIsSUFBQyxDQUFBLE1BQUQsR0FBVSxFQUEvQjs7QUFiRjtXQWVBLElBQUMsQ0FBQSxVQUFELEdBQWM7RUFwQlI7O2lCQXNCUixRQUFBLEdBQVUsU0FBQTtBQUNSLFFBQUE7SUFBQSxJQUFHLENBQUksSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFQO0FBQ0UsWUFBVSxJQUFBLEtBQUEsQ0FBTSxzQ0FBTixFQURaOztJQUdBLFVBQUEsR0FBYSxJQUFDLENBQUEsY0FBRCxDQUFBO0lBRWIsTUFBQSxHQUFhLElBQUEsSUFBQSxDQUFLLElBQUMsQ0FBQSxNQUFOLEVBQWMsSUFBQyxDQUFBLElBQWYsRUFBcUIsVUFBQSxHQUFhLENBQWxDLEVBQXFDLElBQUMsQ0FBQSxVQUF0QztJQUdiLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFDZCxJQUFDLENBQUEsTUFBRCxDQUFBO1dBRUE7RUFaUTs7aUJBY1Ysd0JBQUEsR0FBMEIsU0FBQTtBQUN4QixRQUFBO0lBQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBO0lBQ3ZCLFdBQUEsR0FBYyxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQTtJQUMzQixVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUE7SUFFekIsSUFBRyxTQUFBLElBQWEsV0FBYixJQUE2QixTQUFBLElBQWEsVUFBN0M7QUFDRSxhQUFPLGNBRFQ7O0lBRUEsSUFBRyxXQUFBLElBQWUsU0FBZixJQUE2QixXQUFBLElBQWUsVUFBL0M7QUFDRSxhQUFPLGdCQURUOztBQUVBLFdBQU87RUFUaUI7O2lCQVcxQixjQUFBLEdBQWdCLFNBQUE7QUFDZCxRQUFBO0lBQUEsZ0JBQUEsR0FBbUIsSUFBQyxDQUFBLHdCQUFELENBQUE7SUFFbkIsc0JBQUEsQ0FBdUIsSUFBQyxDQUFBLE1BQXhCLEVBQWdDLGdCQUFoQyxFQUFrRCxJQUFDLENBQUEsVUFBbkQsRUFBK0QsSUFBQyxDQUFBLFVBQWhFO0lBSUEsSUFBQSxDQUFLLElBQUMsQ0FBQSxNQUFOLEVBQWMsSUFBQyxDQUFBLFVBQWYsRUFBMkIsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUF6QztJQUVBLHNCQUFBLENBQXVCLElBQUMsQ0FBQSxNQUF4QixFQUFnQyxnQkFBaEMsRUFBa0QsSUFBQyxDQUFBLFVBQW5ELEVBQStELElBQUMsQ0FBQSxVQUFoRTtJQUVBLFFBQUEsR0FBVyxJQUFDLENBQUEsVUFBRCxHQUFjO0lBRXpCLEtBQUEsR0FBUTtBQUNSLFNBQVMsdUhBQVQ7TUFDRSxLQUFBLElBQVMsSUFBQyxDQUFBLElBQUssQ0FBQSxJQUFDLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUjtNQUNmLElBQUcsS0FBQSxJQUFTLFFBQVo7QUFDRSxlQUFPLEVBRFQ7O0FBRkY7QUFLQSxXQUFPLElBQUMsQ0FBQTtFQW5CTTs7aUJBcUJoQixlQUFBLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsTUFBQSxHQUFTLFFBQUEsR0FBVyxPQUFBLEdBQVU7SUFDOUIsZUFBQSxHQUFrQjtBQUVsQixTQUFTLHVIQUFUO01BQ0UsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFPLENBQUEsQ0FBQTtNQUNoQixlQUFBLEdBQWtCLElBQUMsQ0FBQSxJQUFLLENBQUEsS0FBQTtNQUV4QixlQUFBLElBQW1CO01BRW5CLE1BQUEsSUFBVSxlQUFBLEdBQWtCLFlBQUEsQ0FBYSxLQUFiO01BQzVCLFFBQUEsSUFBWSxlQUFBLEdBQWtCLGNBQUEsQ0FBZSxLQUFmO01BQzlCLE9BQUEsSUFBVyxlQUFBLEdBQWtCLGFBQUEsQ0FBYyxLQUFkO0FBUi9CO0lBVUEsT0FBQSxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsTUFBQSxHQUFTLGVBQXBCO0lBQ1YsU0FBQSxHQUFZLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBQSxHQUFXLGVBQXRCO0lBQ1osUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBQSxHQUFVLGVBQXJCO0FBRVgsV0FBVyxJQUFBLE1BQUEsQ0FBTyxtQkFBQSxDQUFvQixPQUFwQixFQUE2QixTQUE3QixFQUF3QyxRQUF4QyxDQUFQLEVBQTBELGVBQTFEO0VBbEJJOzs7Ozs7OztBQ25TbkIsSUFBQTs7QUFBQSxNQUFtQyxJQUFBLEdBQU8sT0FBQSxDQUFRLFlBQVIsQ0FBMUMsRUFBQyxvQkFBQSxhQUFELEVBQWdCLGNBQUEsT0FBaEIsRUFBeUIsYUFBQTs7QUFDekIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSOztBQUNULElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRVQsTUFBTSxDQUFDLE9BQVAsR0FDTTtFQUNKLElBQUMsQ0FBQSxXQUFELEdBQ0U7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUNBLGtCQUFBLEVBQW9CLElBRHBCOzs7RUFHVyxjQUFDLElBQUQ7SUFDWCxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxFQUFvQixJQUFDLENBQUEsV0FBVyxDQUFDLFdBQWpDO0VBREc7O2lCQUViLFFBQUEsR0FBVSxTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ1IsUUFBQTtJQUFBLElBQUcsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBakIsSUFBc0IsSUFBSSxDQUFDLFVBQUwsR0FBa0IsQ0FBeEMsSUFBNkMsSUFBSSxDQUFDLFVBQUwsR0FBa0IsR0FBbEU7QUFDRSxZQUFVLElBQUEsS0FBQSxDQUFNLHVCQUFOLEVBRFo7O0lBR0EsWUFBQSxHQUFlLFNBQUE7YUFBRztJQUFIO0lBRWYsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLElBQUksQ0FBQyxPQUFuQixDQUFBLElBQWdDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBYixHQUFzQixDQUF6RDtNQUNFLFlBQUEsR0FBZSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7QUFDYixZQUFBO0FBQUE7QUFBQSxhQUFBLHNDQUFBOztVQUNFLElBQUcsQ0FBSSxDQUFBLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUFQO0FBQTBCLG1CQUFPLEtBQWpDOztBQURGO0FBRUEsZUFBTztNQUhNLEVBRGpCOztJQU9BLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQVgsRUFBbUIsWUFBbkI7SUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDO0lBQ1osVUFBQSxHQUFhLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixDQUFpQixDQUFDO0lBQy9CLEVBQUEsR0FBUyxJQUFBLE1BQUEsQ0FBTyxTQUFDLENBQUQsRUFBSSxDQUFKO2FBQVUsQ0FBQyxDQUFDLEtBQUYsQ0FBQSxDQUFBLEdBQVksQ0FBQyxDQUFDLEtBQUYsQ0FBQTtJQUF0QixDQUFQO0lBRVQsRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSO0lBR0EsSUFBQyxDQUFBLFdBQUQsQ0FBYSxFQUFiLEVBQWlCLElBQUMsQ0FBQSxJQUFJLENBQUMsa0JBQU4sR0FBMkIsSUFBSSxDQUFDLFVBQWpEO0lBR0EsR0FBQSxHQUFVLElBQUEsTUFBQSxDQUFPLFNBQUMsQ0FBRCxFQUFJLENBQUo7YUFBVSxDQUFDLENBQUMsS0FBRixDQUFBLENBQUEsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFBLENBQVosR0FBeUIsQ0FBQyxDQUFDLEtBQUYsQ0FBQSxDQUFBLEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBQTtJQUEvQyxDQUFQO0lBQ1YsR0FBRyxDQUFDLFFBQUosR0FBZSxFQUFFLENBQUM7SUFHbEIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxHQUFiLEVBQWtCLElBQUksQ0FBQyxVQUFMLEdBQWtCLEdBQUcsQ0FBQyxJQUFKLENBQUEsQ0FBcEM7SUFHQSxRQUFBLEdBQVc7SUFDWCxJQUFDLENBQUEsTUFBRCxHQUFVO0FBQ1YsV0FBTSxHQUFHLENBQUMsSUFBSixDQUFBLENBQU47TUFDRSxDQUFBLEdBQUksR0FBRyxDQUFDLEdBQUosQ0FBQTtNQUNKLEtBQUEsR0FBUSxDQUFDLENBQUMsR0FBRixDQUFBO01BQ1IsSUFBRyx1Q0FBSSxhQUFjLEtBQU0sQ0FBQSxDQUFBLEdBQUksS0FBTSxDQUFBLENBQUEsR0FBSSxLQUFNLENBQUEsQ0FBQSxHQUFJLGNBQW5EO1FBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsQ0FBYjtRQUNBLFFBQVEsQ0FBQyxJQUFULENBQWtCLElBQUEsTUFBQSxDQUFPLEtBQVAsRUFBYyxDQUFDLENBQUMsS0FBRixDQUFBLENBQWQsQ0FBbEIsRUFGRjs7SUFIRjtXQU9BO0VBeENROztpQkEwQ1YsV0FBQSxHQUFhLFNBQUMsRUFBRCxFQUFLLE1BQUw7QUFDWCxRQUFBO0lBQUEsVUFBQSxHQUFhO0lBQ2IsU0FBQSxHQUFZO0lBQ1osYUFBQSxHQUFnQixJQUFDLENBQUEsSUFBSSxDQUFDO0FBQ3RCLFdBQU0sU0FBQSxHQUFZLGFBQWxCO01BQ0UsU0FBQTtNQUNBLElBQUEsR0FBTyxFQUFFLENBQUMsR0FBSCxDQUFBO01BQ1AsSUFBRyxDQUFDLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FBSjtBQUNFLGlCQURGOztNQUdBLE9BQWlCLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FBakIsRUFBQyxlQUFELEVBQVE7TUFFUixFQUFFLENBQUMsSUFBSCxDQUFRLEtBQVI7TUFDQSxJQUFHLEtBQUg7UUFDRSxFQUFFLENBQUMsSUFBSCxDQUFRLEtBQVI7UUFDQSxVQUFBLEdBRkY7O01BR0EsSUFBRyxVQUFBLElBQWMsTUFBZCxJQUF3QixTQUFBLEdBQVksYUFBdkM7QUFDRSxlQURGOztJQVpGO0VBSlc7Ozs7Ozs7O0FDN0RmLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtFQUNTLGdCQUFDLFVBQUQ7SUFBQyxJQUFDLENBQUEsYUFBRDtJQUNaLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsTUFBRCxHQUFVO0VBRkM7O21CQUliLEtBQUEsR0FBTyxTQUFBO0lBQ0wsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLFVBQWhCO1dBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVTtFQUZMOzttQkFJUCxJQUFBLEdBQU0sU0FBQyxDQUFEO0lBQ0osSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsQ0FBZjtXQUNBLElBQUMsQ0FBQSxNQUFELEdBQVU7RUFGTjs7bUJBSU4sSUFBQSxHQUFNLFNBQUMsS0FBRDtJQUNKLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBUjtNQUNFLElBQUMsQ0FBQSxLQUFELENBQUEsRUFERjs7O01BRUEsUUFBUyxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsR0FBbUI7O1dBQzVCLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQTtFQUpOOzttQkFNTixHQUFBLEdBQUssU0FBQTtJQUNILElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBUjtNQUNFLElBQUMsQ0FBQSxLQUFELENBQUEsRUFERjs7V0FFQSxJQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBQTtFQUhHOzttQkFLTCxJQUFBLEdBQU0sU0FBQTtXQUNKLElBQUMsQ0FBQSxRQUFRLENBQUM7RUFETjs7bUJBR04sR0FBQSxHQUFLLFNBQUMsQ0FBRDtJQUNILElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBUjtNQUNFLElBQUMsQ0FBQSxLQUFELENBQUEsRUFERjs7V0FFQSxJQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBYyxDQUFkO0VBSEc7Ozs7Ozs7O0FDNUJQLElBQUE7O0FBQUEsTUFBbUMsSUFBQSxHQUFPLE9BQUEsQ0FBUSxZQUFSLENBQTFDLEVBQUMsb0JBQUEsYUFBRCxFQUFnQixjQUFBLE9BQWhCLEVBQXlCLGFBQUE7O0FBRXpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007RUFDSixJQUFDLENBQUEsS0FBRCxHQUFRLFNBQUMsTUFBRCxFQUFTLFlBQVQ7QUFDTixRQUFBO0lBQUEsRUFBQSxHQUFLLENBQUEsSUFBRyxDQUFDLENBQUEsR0FBRSxPQUFIO0lBQ1IsSUFBQSxHQUFXLElBQUEsV0FBQSxDQUFZLEVBQVo7SUFDWCxJQUFBLEdBQU8sSUFBQSxHQUFPLElBQUEsR0FBTztJQUNyQixJQUFBLEdBQU8sSUFBQSxHQUFPLElBQUEsR0FBTyxNQUFNLENBQUM7SUFDNUIsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxNQUFQLEdBQWdCO0lBQ3BCLENBQUEsR0FBSTtBQUVKLFdBQU0sQ0FBQSxHQUFJLENBQVY7TUFDRSxNQUFBLEdBQVMsQ0FBQSxHQUFJO01BQ2IsQ0FBQTtNQUNBLENBQUEsR0FBSSxNQUFPLENBQUEsTUFBQSxHQUFTLENBQVQ7TUFDWCxDQUFBLEdBQUksTUFBTyxDQUFBLE1BQUEsR0FBUyxDQUFUO01BQ1gsQ0FBQSxHQUFJLE1BQU8sQ0FBQSxNQUFBLEdBQVMsQ0FBVDtNQUNYLENBQUEsR0FBSSxNQUFPLENBQUEsTUFBQSxHQUFTLENBQVQ7TUFFWCxJQUFHLFlBQUEsQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBQUg7QUFBaUMsaUJBQWpDOztNQUVBLENBQUEsR0FBSSxDQUFBLElBQUs7TUFDVCxDQUFBLEdBQUksQ0FBQSxJQUFLO01BQ1QsQ0FBQSxHQUFJLENBQUEsSUFBSztNQUdULEtBQUEsR0FBUSxhQUFBLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQjtNQUNSLElBQUssQ0FBQSxLQUFBLENBQUwsSUFBZTtNQUVmLElBQUcsQ0FBQSxHQUFJLElBQVA7UUFDRSxJQUFBLEdBQU8sRUFEVDs7TUFFQSxJQUFHLENBQUEsR0FBSSxJQUFQO1FBQ0UsSUFBQSxHQUFPLEVBRFQ7O01BRUEsSUFBRyxDQUFBLEdBQUksSUFBUDtRQUNFLElBQUEsR0FBTyxFQURUOztNQUVBLElBQUcsQ0FBQSxHQUFJLElBQVA7UUFDRSxJQUFBLEdBQU8sRUFEVDs7TUFFQSxJQUFHLENBQUEsR0FBSSxJQUFQO1FBQ0UsSUFBQSxHQUFPLEVBRFQ7O01BRUEsSUFBRyxDQUFBLEdBQUksSUFBUDtRQUNFLElBQUEsR0FBTyxFQURUOztJQTVCRjtXQStCSSxJQUFBLElBQUEsQ0FBSyxJQUFMLEVBQVcsSUFBWCxFQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUE2QixJQUE3QixFQUFtQyxJQUFuQyxFQUF5QyxJQUF6QztFQXZDRTs7RUF5Q0ssY0FBQyxFQUFELEVBQU0sRUFBTixFQUFXLEVBQVgsRUFBZ0IsRUFBaEIsRUFBcUIsRUFBckIsRUFBMEIsRUFBMUIsRUFBK0IsS0FBL0I7SUFBQyxJQUFDLENBQUEsS0FBRDtJQUFLLElBQUMsQ0FBQSxLQUFEO0lBQUssSUFBQyxDQUFBLEtBQUQ7SUFBSyxJQUFDLENBQUEsS0FBRDtJQUFLLElBQUMsQ0FBQSxLQUFEO0lBQUssSUFBQyxDQUFBLEtBQUQ7SUFBSyxJQUFDLENBQUEsT0FBRDtFQUEvQjs7aUJBR2IsVUFBQSxHQUFZLFNBQUE7SUFDVixPQUFPLElBQUMsQ0FBQTtJQUNSLE9BQU8sSUFBQyxDQUFBO1dBQ1IsT0FBTyxJQUFDLENBQUE7RUFIRTs7aUJBS1osTUFBQSxHQUFRLFNBQUE7SUFDTixJQUFPLG9CQUFQO01BQ0UsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFDLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQVAsR0FBWSxDQUFiLENBQUEsR0FBa0IsQ0FBQyxJQUFDLENBQUEsRUFBRCxHQUFNLElBQUMsQ0FBQSxFQUFQLEdBQVksQ0FBYixDQUFsQixHQUFvQyxDQUFDLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQVAsR0FBWSxDQUFiLEVBRGpEOztXQUVBLElBQUMsQ0FBQTtFQUhLOztpQkFLUixLQUFBLEdBQU8sU0FBQTtBQUNMLFFBQUE7SUFBQSxJQUFPLG1CQUFQO01BQ0UsSUFBQSxHQUFPLElBQUMsQ0FBQTtNQUNSLENBQUEsR0FBSTtNQUNKOzs7Ozs7Ozs7O01BZUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxFQWxCWjs7V0FtQkEsSUFBQyxDQUFBO0VBcEJJOztpQkFzQlAsS0FBQSxHQUFPLFNBQUE7V0FDRCxJQUFBLElBQUEsQ0FBSyxJQUFDLENBQUEsRUFBTixFQUFVLElBQUMsQ0FBQSxFQUFYLEVBQWUsSUFBQyxDQUFBLEVBQWhCLEVBQW9CLElBQUMsQ0FBQSxFQUFyQixFQUF5QixJQUFDLENBQUEsRUFBMUIsRUFBOEIsSUFBQyxDQUFBLEVBQS9CLEVBQW1DLElBQUMsQ0FBQSxJQUFwQztFQURDOztpQkFHUCxHQUFBLEdBQUssU0FBQTtBQUNILFFBQUE7SUFBQSxJQUFPLGlCQUFQO01BQ0UsSUFBQSxHQUFPLElBQUMsQ0FBQTtNQUNSLElBQUEsR0FBTztNQUNQLElBQUEsR0FBTyxDQUFBLElBQUssQ0FBQyxDQUFBLEdBQUksT0FBTDtNQUNaLElBQUEsR0FBTyxJQUFBLEdBQU8sSUFBQSxHQUFPO01BQ3JCOzs7Ozs7Ozs7Ozs7OztNQXlCQSxJQUFHLElBQUg7UUFDRSxJQUFDLENBQUEsSUFBRCxHQUFRLENBQ04sQ0FBQyxDQUFDLENBQUMsSUFBQSxHQUFPLElBQVIsQ0FESSxFQUVOLENBQUMsQ0FBQyxDQUFDLElBQUEsR0FBTyxJQUFSLENBRkksRUFHTixDQUFDLENBQUMsQ0FBQyxJQUFBLEdBQU8sSUFBUixDQUhJLEVBRFY7T0FBQSxNQUFBO1FBT0UsSUFBQyxDQUFBLElBQUQsR0FBUSxDQUNOLENBQUMsQ0FBQyxDQUFDLElBQUEsR0FBTyxDQUFDLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQVAsR0FBWSxDQUFiLENBQVAsR0FBeUIsQ0FBMUIsQ0FESSxFQUVOLENBQUMsQ0FBQyxDQUFDLElBQUEsR0FBTyxDQUFDLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQVAsR0FBWSxDQUFiLENBQVAsR0FBeUIsQ0FBMUIsQ0FGSSxFQUdOLENBQUMsQ0FBQyxDQUFDLElBQUEsR0FBTyxDQUFDLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQVAsR0FBWSxDQUFiLENBQVAsR0FBeUIsQ0FBMUIsQ0FISSxFQVBWO09BOUJGOztXQTBDQSxJQUFDLENBQUE7RUEzQ0U7O2lCQTZDTCxLQUFBLEdBQU8sU0FBQTtBQUNMLFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBO0lBQ1IsSUFBRyxDQUFDLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBSjtBQUNFLGFBQU8sS0FEVDs7SUFFQSxJQUFHLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBQSxLQUFZLENBQWY7QUFDRSxhQUFPLENBQUMsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFELEVBRFQ7O0lBR0EsRUFBQSxHQUFLLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQVAsR0FBWTtJQUNqQixFQUFBLEdBQUssSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFDLENBQUEsRUFBUCxHQUFZO0lBQ2pCLEVBQUEsR0FBSyxJQUFDLENBQUEsRUFBRCxHQUFNLElBQUMsQ0FBQSxFQUFQLEdBQVk7SUFFakIsSUFBQSxHQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsRUFBakI7SUFDUCxNQUFBLEdBQVM7SUFDVCxHQUFBLEdBQU0sS0FBQSxHQUFRO0lBRWQsSUFBQSxHQUFPO0FBQ1AsWUFBTyxJQUFQO0FBQUEsV0FDTyxFQURQO1FBRUksSUFBQSxHQUFPO1FBQ1AsTUFBQSxHQUFhLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxFQUFELEdBQU0sQ0FBbEI7UUFDYjs7Ozs7Ozs7Ozs7OztBQUhHO0FBRFAsV0F5Qk8sRUF6QlA7UUEwQkksSUFBQSxHQUFPO1FBQ1AsTUFBQSxHQUFhLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxFQUFELEdBQU0sQ0FBbEI7UUFDYjs7Ozs7Ozs7Ozs7OztBQUhHO0FBekJQLFdBaURPLEVBakRQO1FBa0RJLElBQUEsR0FBTztRQUNQLE1BQUEsR0FBYSxJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsRUFBRCxHQUFNLENBQWxCO1FBQ2I7Ozs7Ozs7Ozs7Ozs7QUFwREo7SUEwRUEsVUFBQSxHQUFhLENBQUM7SUFDZCxVQUFBLEdBQWlCLElBQUEsV0FBQSxDQUFZLE1BQU0sQ0FBQyxNQUFuQjtBQUNqQixTQUFTLGlHQUFUO01BQ0UsQ0FBQSxHQUFJLE1BQU8sQ0FBQSxDQUFBO01BQ1gsSUFBRyxVQUFBLEdBQWEsQ0FBYixJQUFrQixDQUFBLEdBQUksS0FBQSxHQUFRLENBQWpDO1FBQ0UsVUFBQSxHQUFhLEVBRGY7O01BRUEsVUFBVyxDQUFBLENBQUEsQ0FBWCxHQUFnQixLQUFBLEdBQVE7QUFKMUI7SUFNQSxJQUFBLEdBQU87SUFDUCxLQUFBLEdBQVEsU0FBQyxDQUFEO0FBQ04sVUFBQTtNQUFBLElBQUEsR0FBTyxDQUFBLEdBQUk7TUFDWCxJQUFBLEdBQU8sQ0FBQSxHQUFJO01BQ1gsRUFBQSxHQUFLLElBQUssQ0FBQSxJQUFBO01BQ1YsRUFBQSxHQUFLLElBQUssQ0FBQSxJQUFBO01BQ1YsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQUE7TUFDUixLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBQTtNQUNSLElBQUEsR0FBTyxVQUFBLEdBQWE7TUFDcEIsS0FBQSxHQUFRLEVBQUEsR0FBSztNQUNiLElBQUcsSUFBQSxJQUFRLEtBQVg7UUFDRSxFQUFBLEdBQUssSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFBLEdBQUssQ0FBZCxFQUFpQixDQUFDLENBQUUsQ0FBQyxVQUFBLEdBQWEsS0FBQSxHQUFRLENBQXRCLENBQXBCO1FBQ0wsRUFBQSxHQUFLLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEVBQVosRUFGUDtPQUFBLE1BQUE7UUFJRSxFQUFBLEdBQUssSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBQWEsQ0FBQyxDQUFFLENBQUMsVUFBQSxHQUFhLENBQWIsR0FBaUIsSUFBQSxHQUFPLENBQXpCLENBQWhCO1FBQ0wsRUFBQSxHQUFLLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSyxDQUFBLElBQUEsQ0FBZCxFQUFxQixFQUFyQixFQUxQOztBQVFBLGFBQU0sQ0FBQyxNQUFPLENBQUEsRUFBQSxDQUFkO1FBQ0UsRUFBQTtNQURGO01BSUEsRUFBQSxHQUFLLFVBQVcsQ0FBQSxFQUFBO0FBQ2hCLGFBQU0sQ0FBQyxFQUFELElBQVEsTUFBTyxDQUFBLEVBQUEsR0FBSyxDQUFMLENBQXJCO1FBQ0UsRUFBQSxHQUFLLFVBQVcsQ0FBQSxFQUFFLEVBQUY7TUFEbEI7TUFHQSxLQUFNLENBQUEsSUFBQSxDQUFOLEdBQWM7TUFDZCxLQUFNLENBQUEsSUFBQSxDQUFOLEdBQWMsRUFBQSxHQUFLO0FBR25CLGFBQU8sQ0FBQyxLQUFELEVBQVEsS0FBUjtJQTdCRDtXQStCUixLQUFBLENBQU0sSUFBTjtFQWxJSzs7aUJBb0lQLFFBQUEsR0FBVSxTQUFDLENBQUQ7QUFDUixRQUFBO0lBQUEsQ0FBQSxHQUFJLENBQUUsQ0FBQSxDQUFBLENBQUYsSUFBTTtJQUNWLENBQUEsR0FBSSxDQUFFLENBQUEsQ0FBQSxDQUFGLElBQU07SUFDVixDQUFBLEdBQUksQ0FBRSxDQUFBLENBQUEsQ0FBRixJQUFNO1dBRVYsQ0FBQSxJQUFLLElBQUMsQ0FBQSxFQUFOLElBQWEsQ0FBQSxJQUFLLElBQUMsQ0FBQSxFQUFuQixJQUEwQixDQUFBLElBQUssSUFBQyxDQUFBLEVBQWhDLElBQXVDLENBQUEsSUFBSyxJQUFDLENBQUEsRUFBN0MsSUFBb0QsQ0FBQSxJQUFLLElBQUMsQ0FBQSxFQUExRCxJQUFpRSxDQUFBLElBQUssSUFBQyxDQUFBO0VBTC9EOzs7Ozs7OztBQ3BRWixJQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztzQkFDSixVQUFBLEdBQVksU0FBQyxNQUFELEVBQVMsSUFBVCxHQUFBOztzQkFFWixrQkFBQSxHQUFvQixTQUFBLEdBQUE7Ozs7OztBQUV0QixNQUFNLENBQUMsT0FBTyxDQUFDLFFBQWYsR0FBMEIsT0FBQSxDQUFRLFlBQVI7O0FBQzFCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBZixHQUF3QixPQUFBLENBQVEsVUFBUjs7QUFDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFmLEdBQTBCLE9BQUEsQ0FBUSxhQUFSOztBQUMxQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQWYsR0FBc0IsT0FBQSxDQUFRLFFBQVI7Ozs7QUNUdEIsSUFBQSxpQ0FBQTtFQUFBOzs7QUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0FBQ1QsU0FBQSxHQUFZLE9BQUEsQ0FBUSxTQUFSOztBQUNaLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7QUFFWCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O2lCQUNKLFVBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ1YsUUFBQTtJQURtQixJQUFDLENBQUEsT0FBRDtJQUNuQixJQUFBLEdBQVcsSUFBQSxRQUFBLENBQUE7V0FDWCxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQyxRQUFMLENBQWMsTUFBZCxFQUFzQixJQUFDLENBQUEsSUFBdkI7RUFGRjs7aUJBSVosa0JBQUEsR0FBb0IsU0FBQTtXQUNsQixJQUFDLENBQUE7RUFEaUI7Ozs7R0FMSDs7OztBQ0xuQixJQUFBLDRDQUFBO0VBQUE7OztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7QUFDVCxTQUFBLEdBQVksT0FBQSxDQUFRLFNBQVI7O0FBQ1osUUFBQSxHQUFXLE9BQUEsQ0FBUSwyQkFBUjs7QUFFWCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OzRCQUNKLFVBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ1YsUUFBQTtJQURtQixJQUFDLENBQUEsT0FBRDtJQUNuQixJQUFBLEdBQU8sUUFBQSxDQUFTLE1BQVQsRUFBaUIsSUFBQyxDQUFBLElBQWxCO1dBQ1AsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLElBQUQ7ZUFDdEIsSUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLEtBQVosRUFBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFWLENBQUEsQ0FBbkI7TUFEc0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO0VBRkY7OzRCQUtaLGtCQUFBLEdBQW9CLFNBQUE7V0FDbEIsSUFBQyxDQUFBO0VBRGlCOzs7O0dBTlE7Ozs7QUNMOUIsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7OztBQUNQOzs7Ozs7O0FBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTttQkFDSixHQUFBLEdBQUs7O21CQUNMLEdBQUEsR0FBSzs7bUJBQ0wsVUFBQSxHQUFZOzttQkFDWixHQUFBLEdBQUs7O0VBRVEsZ0JBQUMsR0FBRCxFQUFNLFVBQU47SUFDWCxJQUFDLENBQUEsR0FBRCxHQUFPO0lBQ1AsSUFBQyxDQUFBLFVBQUQsR0FBYztFQUZIOzttQkFJYixNQUFBLEdBQVEsU0FBQTtJQUNOLElBQUcsQ0FBSSxJQUFDLENBQUEsR0FBUjthQUNFLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBbkIsRUFBdUIsSUFBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQTVCLEVBQWdDLElBQUMsQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUFyQyxFQURUO0tBQUEsTUFBQTthQUVLLElBQUMsQ0FBQSxJQUZOOztFQURNOzttQkFLUixhQUFBLEdBQWUsU0FBQTtXQUNiLElBQUMsQ0FBQTtFQURZOzttQkFHZixNQUFBLEdBQVEsU0FBQTtXQUNOLElBQUMsQ0FBQTtFQURLOzttQkFHUixNQUFBLEdBQVEsU0FBQTtXQUNOLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQW5CLEVBQXVCLElBQUMsQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUE1QixFQUFnQyxJQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBckM7RUFETTs7bUJBR1IsaUJBQUEsR0FBbUIsU0FBQTtJQUNqQixJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUNBLElBQUcsSUFBQyxDQUFBLEdBQUQsR0FBTyxHQUFWO2FBQW1CLE9BQW5CO0tBQUEsTUFBQTthQUErQixPQUEvQjs7RUFGaUI7O21CQUluQixnQkFBQSxHQUFrQixTQUFBO0lBQ2hCLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBQ0EsSUFBRyxJQUFDLENBQUEsR0FBRCxHQUFPLEdBQVY7YUFBbUIsT0FBbkI7S0FBQSxNQUFBO2FBQStCLE9BQS9COztFQUZnQjs7bUJBSWxCLGlCQUFBLEdBQW1CLFNBQUE7SUFDakIsSUFBRyxDQUFJLElBQUMsQ0FBQSxHQUFSO2FBQWlCLElBQUMsQ0FBQSxHQUFELEdBQU8sQ0FBQyxJQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBTCxHQUFVLEdBQVYsR0FBZ0IsSUFBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQUwsR0FBVSxHQUExQixHQUFnQyxJQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBTCxHQUFVLEdBQTNDLENBQUEsR0FBa0QsS0FBMUU7O0VBRGlCOzs7Ozs7OztBQ3hDckIsSUFBQTs7QUFBQSxRQUFBLEdBQ0U7RUFBQSxFQUFBLEVBQUksQ0FBSjtFQUNBLE9BQUEsRUFBUyxDQURUO0VBRUEsS0FBQSxFQUFPLENBRlA7RUFHQSxJQUFBLEVBQU0sRUFITjtFQUlBLE9BQUEsRUFBUyxFQUpUOzs7QUFNRixPQUFBLEdBQVU7O0FBQ1YsTUFBQSxHQUFTLENBQUEsR0FBSTs7QUFJYixNQUFNLENBQUMsT0FBUCxHQUNFO0VBQUEsS0FBQSxFQUFPLFNBQUMsQ0FBRDtBQUNMLFFBQUE7SUFBQSxJQUFHLE9BQU8sQ0FBUCxLQUFZLFFBQWY7TUFDRSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxDQUFIO0FBQ0UsZUFBTyxDQUFDLENBQUMsR0FBRixDQUFNLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFBTyxLQUFJLENBQUMsS0FBTCxDQUFXLENBQVg7VUFBUDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTixFQURUO09BQUEsTUFBQTtRQUdFLEVBQUEsR0FBSztBQUNMLGFBQUEsUUFBQTs7VUFDRSxFQUFHLENBQUEsR0FBQSxDQUFILEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFYO0FBRFo7QUFFQSxlQUFPLEdBTlQ7T0FERjs7V0FRQTtFQVRLLENBQVA7RUFXQSxRQUFBLEVBQVUsU0FBQTtBQUNSLFFBQUE7SUFBQSxDQUFBLEdBQUk7QUFDSixTQUFBLDJDQUFBOztBQUNFLFdBQUEsU0FBQTs7UUFDRSxJQUFPLGNBQVA7VUFBb0IsQ0FBRSxDQUFBLEdBQUEsQ0FBRixHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBWCxFQUE3Qjs7QUFERjtBQURGO1dBSUE7RUFOUSxDQVhWO0VBbUJBLFFBQUEsRUFBVSxTQUFDLEdBQUQ7QUFDUixRQUFBO0lBQUEsQ0FBQSxHQUFJLDJDQUEyQyxDQUFDLElBQTVDLENBQWlELEdBQWpEO0lBQ0osSUFBRyxTQUFIO0FBQ0UsYUFBTyxDQUFDLENBQUUsQ0FBQSxDQUFBLENBQUgsRUFBTyxDQUFFLENBQUEsQ0FBQSxDQUFULEVBQWEsQ0FBRSxDQUFBLENBQUEsQ0FBZixDQUFrQixDQUFDLEdBQW5CLENBQXVCLFNBQUMsQ0FBRDtlQUFPLFFBQUEsQ0FBUyxDQUFULEVBQVksRUFBWjtNQUFQLENBQXZCLEVBRFQ7O0FBRUEsV0FBTztFQUpDLENBbkJWO0VBeUJBLFFBQUEsRUFBVSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtXQUNSLEdBQUEsR0FBTSxDQUFDLENBQUMsQ0FBQSxJQUFLLEVBQU4sQ0FBQSxHQUFZLENBQUMsQ0FBQSxJQUFLLEVBQU4sQ0FBWixHQUF3QixDQUFDLENBQUEsSUFBSyxDQUFOLENBQXhCLEdBQW1DLENBQXBDLENBQXNDLENBQUMsUUFBdkMsQ0FBZ0QsRUFBaEQsQ0FBbUQsQ0FBQyxLQUFwRCxDQUEwRCxDQUExRCxFQUE2RCxDQUE3RDtFQURFLENBekJWO0VBNEJBLFFBQUEsRUFBVSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUNSLFFBQUE7SUFBQSxDQUFBLElBQUs7SUFDTCxDQUFBLElBQUs7SUFDTCxDQUFBLElBQUs7SUFDTCxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWY7SUFDTixHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWY7SUFDTixDQUFBLEdBQUk7SUFDSixDQUFBLEdBQUk7SUFDSixDQUFBLEdBQUksQ0FBQyxHQUFBLEdBQU0sR0FBUCxDQUFBLEdBQWM7SUFDbEIsSUFBRyxHQUFBLEtBQU8sR0FBVjtNQUNFLENBQUEsR0FBSSxDQUFBLEdBQUksRUFEVjtLQUFBLE1BQUE7TUFJRSxDQUFBLEdBQUksR0FBQSxHQUFNO01BQ1YsQ0FBQSxHQUFPLENBQUEsR0FBSSxHQUFQLEdBQWdCLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxHQUFKLEdBQVUsR0FBWCxDQUFwQixHQUF5QyxDQUFBLEdBQUksQ0FBQyxHQUFBLEdBQU0sR0FBUDtBQUNqRCxjQUFPLEdBQVA7QUFBQSxhQUNPLENBRFA7VUFFSSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBVixHQUFjLENBQUksQ0FBQSxHQUFJLENBQVAsR0FBYyxDQUFkLEdBQXFCLENBQXRCO0FBRGY7QUFEUCxhQUdPLENBSFA7VUFJSSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBVixHQUFjO0FBRGY7QUFIUCxhQUtPLENBTFA7VUFNSSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBVixHQUFjO0FBTnRCO01BT0EsQ0FBQSxJQUFLLEVBYlA7O1dBY0EsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7RUF2QlEsQ0E1QlY7RUFxREEsUUFBQSxFQUFVLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO0FBQ1IsUUFBQTtJQUFBLENBQUEsR0FBSTtJQUNKLENBQUEsR0FBSTtJQUNKLENBQUEsR0FBSTtJQUVKLE9BQUEsR0FBVSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtNQUNSLElBQUcsQ0FBQSxHQUFJLENBQVA7UUFDRSxDQUFBLElBQUssRUFEUDs7TUFFQSxJQUFHLENBQUEsR0FBSSxDQUFQO1FBQ0UsQ0FBQSxJQUFLLEVBRFA7O01BRUEsSUFBRyxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQVg7QUFDRSxlQUFPLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxDQUFWLEdBQWMsRUFEM0I7O01BRUEsSUFBRyxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQVg7QUFDRSxlQUFPLEVBRFQ7O01BRUEsSUFBRyxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQVg7QUFDRSxlQUFPLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxDQUFDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBVCxDQUFWLEdBQXdCLEVBRHJDOzthQUVBO0lBWFE7SUFhVixJQUFHLENBQUEsS0FBSyxDQUFSO01BQ0UsQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFBLEdBQUksRUFEZDtLQUFBLE1BQUE7TUFJRSxDQUFBLEdBQU8sQ0FBQSxHQUFJLEdBQVAsR0FBZ0IsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBcEIsR0FBaUMsQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFDLENBQUEsR0FBSSxDQUFMO01BQzdDLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBSixHQUFRO01BQ1osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBdEI7TUFDSixDQUFBLEdBQUksT0FBQSxDQUFRLENBQVIsRUFBVyxDQUFYLEVBQWMsQ0FBZDtNQUNKLENBQUEsR0FBSSxPQUFBLENBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFsQixFQVJOOztXQVNBLENBQ0UsQ0FBQSxHQUFJLEdBRE4sRUFFRSxDQUFBLEdBQUksR0FGTixFQUdFLENBQUEsR0FBSSxHQUhOO0VBM0JRLENBckRWO0VBc0ZBLFFBQUEsRUFBVSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUNSLFFBQUE7SUFBQSxDQUFBLElBQUs7SUFDTCxDQUFBLElBQUs7SUFDTCxDQUFBLElBQUs7SUFDTCxDQUFBLEdBQU8sQ0FBQSxHQUFJLE9BQVAsR0FBb0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFDLENBQUEsR0FBSSxLQUFMLENBQUEsR0FBYyxLQUF2QixFQUE4QixHQUE5QixDQUFwQixHQUE0RCxDQUFBLEdBQUk7SUFDcEUsQ0FBQSxHQUFPLENBQUEsR0FBSSxPQUFQLEdBQW9CLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQyxDQUFBLEdBQUksS0FBTCxDQUFBLEdBQWMsS0FBdkIsRUFBOEIsR0FBOUIsQ0FBcEIsR0FBNEQsQ0FBQSxHQUFJO0lBQ3BFLENBQUEsR0FBTyxDQUFBLEdBQUksT0FBUCxHQUFvQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQUMsQ0FBQSxHQUFJLEtBQUwsQ0FBQSxHQUFjLEtBQXZCLEVBQThCLEdBQTlCLENBQXBCLEdBQTRELENBQUEsR0FBSTtJQUVwRSxDQUFBLElBQUs7SUFDTCxDQUFBLElBQUs7SUFDTCxDQUFBLElBQUs7SUFFTCxDQUFBLEdBQUksQ0FBQSxHQUFJLE1BQUosR0FBYSxDQUFBLEdBQUksTUFBakIsR0FBMEIsQ0FBQSxHQUFJO0lBQ2xDLENBQUEsR0FBSSxDQUFBLEdBQUksTUFBSixHQUFhLENBQUEsR0FBSSxNQUFqQixHQUEwQixDQUFBLEdBQUk7SUFDbEMsQ0FBQSxHQUFJLENBQUEsR0FBSSxNQUFKLEdBQWEsQ0FBQSxHQUFJLE1BQWpCLEdBQTBCLENBQUEsR0FBSTtXQUVsQyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtFQWhCUSxDQXRGVjtFQXdHQSxXQUFBLEVBQWEsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFDWCxRQUFBO0lBQUEsS0FBQSxHQUFRO0lBQ1IsS0FBQSxHQUFRO0lBQ1IsS0FBQSxHQUFRO0lBRVIsQ0FBQSxJQUFLO0lBQ0wsQ0FBQSxJQUFLO0lBQ0wsQ0FBQSxJQUFLO0lBRUwsQ0FBQSxHQUFPLENBQUEsR0FBSSxRQUFQLEdBQXFCLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUEsR0FBRSxDQUFkLENBQXJCLEdBQTJDLEtBQUEsR0FBUSxDQUFSLEdBQVksRUFBQSxHQUFLO0lBQ2hFLENBQUEsR0FBTyxDQUFBLEdBQUksUUFBUCxHQUFxQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFBLEdBQUUsQ0FBZCxDQUFyQixHQUEyQyxLQUFBLEdBQVEsQ0FBUixHQUFZLEVBQUEsR0FBSztJQUNoRSxDQUFBLEdBQU8sQ0FBQSxHQUFJLFFBQVAsR0FBcUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBQSxHQUFFLENBQWQsQ0FBckIsR0FBMkMsS0FBQSxHQUFRLENBQVIsR0FBWSxFQUFBLEdBQUs7SUFFaEUsQ0FBQSxHQUFJLEdBQUEsR0FBTSxDQUFOLEdBQVU7SUFDZCxDQUFBLEdBQUksR0FBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLENBQUw7SUFDVixDQUFBLEdBQUksR0FBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLENBQUw7V0FFVixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtFQWpCVyxDQXhHYjtFQTJIQSxXQUFBLEVBQWEsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFDWCxRQUFBO0lBQUEsTUFBWSxJQUFJLENBQUMsUUFBTCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBWixFQUFDLFVBQUQsRUFBSSxVQUFKLEVBQU87V0FDUCxJQUFJLENBQUMsV0FBTCxDQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixDQUF2QjtFQUZXLENBM0hiO0VBK0hBLFFBQUEsRUFBVSxTQUFDLElBQUQsRUFBTyxJQUFQO0FBRVIsUUFBQTtJQUFBLFFBQUEsR0FBVztJQUNYLFFBQUEsR0FBVztJQUNYLFFBQUEsR0FBVztJQUVWLFlBQUQsRUFBSyxZQUFMLEVBQVM7SUFDUixZQUFELEVBQUssWUFBTCxFQUFTO0lBQ1QsRUFBQSxHQUFLLEVBQUEsR0FBSztJQUNWLEVBQUEsR0FBSyxFQUFBLEdBQUs7SUFDVixFQUFBLEdBQUssRUFBQSxHQUFLO0lBRVYsR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBQSxHQUFLLEVBQUwsR0FBVSxFQUFBLEdBQUssRUFBekI7SUFDTixHQUFBLEdBQU0sSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFBLEdBQUssRUFBTCxHQUFVLEVBQUEsR0FBSyxFQUF6QjtJQUVOLEdBQUEsR0FBTSxFQUFBLEdBQUs7SUFDWCxHQUFBLEdBQU0sR0FBQSxHQUFNO0lBQ1osR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBQSxHQUFLLEVBQUwsR0FBVSxFQUFBLEdBQUssRUFBZixHQUFvQixFQUFBLEdBQUssRUFBbkM7SUFFTixJQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQUFBLEdBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULENBQVYsQ0FBQSxHQUEyQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxHQUFMLENBQVMsR0FBVCxDQUFWLENBQS9DO01BQ0UsR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBQSxHQUFNLEdBQU4sR0FBWSxHQUFBLEdBQU0sR0FBbEIsR0FBd0IsR0FBQSxHQUFNLEdBQXhDLEVBRFI7S0FBQSxNQUFBO01BR0UsR0FBQSxHQUFNLEVBSFI7O0lBS0EsR0FBQSxHQUFNLENBQUEsR0FBSSxLQUFBLEdBQVE7SUFDbEIsR0FBQSxHQUFNLENBQUEsR0FBSSxLQUFBLEdBQVE7SUFFbEIsR0FBQSxJQUFPO0lBQ1AsR0FBQSxJQUFPLFFBQUEsR0FBVztJQUNsQixHQUFBLElBQU8sUUFBQSxHQUFXO1dBRWxCLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBQSxHQUFNLEdBQU4sR0FBWSxHQUFBLEdBQU0sR0FBbEIsR0FBd0IsR0FBQSxHQUFNLEdBQXhDO0VBL0JRLENBL0hWO0VBZ0tBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxJQUFQO0FBQ1AsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBbUIsSUFBbkIsRUFBc0IsSUFBdEI7SUFDUCxJQUFBLEdBQU8sSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQW1CLElBQW5CLEVBQXNCLElBQXRCO1dBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBQWdCLElBQWhCO0VBSE8sQ0FoS1Q7RUFxS0EsT0FBQSxFQUFTLFNBQUMsSUFBRCxFQUFPLElBQVA7QUFFUCxRQUFBO0lBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtJQUNQLElBQUEsR0FBTyxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7V0FHUCxJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQsRUFBZSxJQUFmO0VBTk8sQ0FyS1Q7RUE2S0Esb0JBQUEsRUFBc0IsUUE3S3RCO0VBK0tBLGtCQUFBLEVBQW9CLFNBQUMsQ0FBRDtJQUNsQixJQUFHLENBQUEsR0FBSSxRQUFRLENBQUMsRUFBaEI7QUFDRSxhQUFPLE1BRFQ7O0lBR0EsSUFBRyxDQUFBLElBQUssUUFBUSxDQUFDLE9BQWpCO0FBQ0UsYUFBTyxVQURUOztJQUdBLElBQUcsQ0FBQSxJQUFLLFFBQVEsQ0FBQyxLQUFqQjtBQUNFLGFBQU8sUUFEVDs7SUFHQSxJQUFHLENBQUEsSUFBSyxRQUFRLENBQUMsSUFBakI7QUFDRSxhQUFPLE9BRFQ7O0lBR0EsSUFBRyxDQUFBLEdBQUksUUFBUSxDQUFDLE9BQWhCO0FBQ0UsYUFBTyxVQURUOztBQUVBLFdBQU87RUFmVyxDQS9LcEI7RUFnTUEsT0FBQSxFQUFTLE9BaE1UO0VBaU1BLE1BQUEsRUFBUSxNQWpNUjtFQWtNQSxhQUFBLEVBQWUsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7V0FDYixDQUFDLENBQUEsSUFBRyxDQUFDLENBQUEsR0FBRSxPQUFILENBQUosQ0FBQSxHQUFtQixDQUFDLENBQUEsSUFBSyxPQUFOLENBQW5CLEdBQW9DO0VBRHZCLENBbE1mOzs7Ozs7QUNiRjs7Ozs7Ozs7Ozs7QUFBQSxJQUFBLHdEQUFBO0VBQUE7O0FBV0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUFDUCxnQkFBQSxHQUFtQixPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDOztBQUMxQyxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRVQsTUFBTSxDQUFDLE9BQVAsR0FDTTtFQUNKLE9BQUMsQ0FBQSxXQUFELEdBQ0U7SUFBQSxVQUFBLEVBQVksRUFBWjtJQUNBLE9BQUEsRUFBUyxDQURUO0lBRUEsU0FBQSxFQUFlLElBQUEsZ0JBQUEsQ0FBQSxDQUZmO0lBR0EsS0FBQSxFQUFPLElBSFA7SUFJQSxTQUFBLEVBQVcsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQyxJQUpsQztJQUtBLE9BQUEsRUFBUyxFQUxUOzs7RUFPRixPQUFDLENBQUEsSUFBRCxHQUFPLFNBQUMsR0FBRDtXQUNELElBQUEsT0FBQSxDQUFRLEdBQVI7RUFEQzs7b0JBR1AsUUFBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztvQkFFVixTQUFBLEdBQVc7O0VBRUUsaUJBQUMsV0FBRCxFQUFlLElBQWY7SUFBQyxJQUFDLENBQUEsY0FBRDs7TUFBYyxPQUFPOzs7SUFDakMsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsRUFBb0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFqQztJQUNSLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLElBQUksQ0FBQztFQUZSOztvQkFJYixVQUFBLEdBQVksU0FBQyxFQUFEO0FBQ1YsUUFBQTtXQUFBLEtBQUEsR0FBWSxJQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLElBQUMsQ0FBQSxXQUFiLEVBQTBCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxHQUFELEVBQU0sS0FBTjtBQUNwQyxZQUFBO1FBQUEsSUFBRyxXQUFIO0FBQWEsaUJBQU8sRUFBQSxDQUFHLEdBQUgsRUFBcEI7O0FBQ0E7VUFDRSxLQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsRUFBaUIsS0FBQyxDQUFBLElBQWxCO2lCQUNBLEVBQUEsQ0FBRyxJQUFILEVBQVMsS0FBQyxDQUFBLFFBQUQsQ0FBQSxDQUFULEVBRkY7U0FBQSxjQUFBO1VBR007QUFDSixpQkFBTyxFQUFBLENBQUcsS0FBSCxFQUpUOztNQUZvQztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUI7RUFERjs7b0JBU1osV0FBQSxHQUFhLFNBQUMsRUFBRDtXQUNYLElBQUMsQ0FBQSxVQUFELENBQVksRUFBWjtFQURXOztvQkFHYixRQUFBLEdBQVUsU0FBQyxLQUFELEVBQVEsSUFBUjtBQUNSLFFBQUE7SUFBQSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFDLENBQUEsSUFBakI7SUFDQSxTQUFBLEdBQVksS0FBSyxDQUFDLFlBQU4sQ0FBQTtJQUVaLFNBQUEsR0FBZ0IsSUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBQTtJQUNoQixTQUFTLENBQUMsVUFBVixDQUFxQixTQUFTLENBQUMsSUFBL0IsRUFBcUMsSUFBQyxDQUFBLElBQXRDO0lBRUEsUUFBQSxHQUFXLFNBQVMsQ0FBQyxrQkFBVixDQUFBO0lBRVgsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFYLENBQW9CLFFBQXBCO1dBRUEsS0FBSyxDQUFDLFlBQU4sQ0FBQTtFQVhROztvQkFhVixRQUFBLEdBQVUsU0FBQTtXQUNSO01BQUEsT0FBQSxFQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMsZ0JBQVgsQ0FBQSxDQUFkO01BQ0EsS0FBQSxFQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxDQUFBLENBRGQ7TUFFQSxXQUFBLEVBQWMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxvQkFBWCxDQUFBLENBRmQ7TUFHQSxTQUFBLEVBQWMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxrQkFBWCxDQUFBLENBSGQ7TUFJQSxZQUFBLEVBQWMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxxQkFBWCxDQUFBLENBSmQ7TUFLQSxVQUFBLEVBQWMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxtQkFBWCxDQUFBLENBTGQ7O0VBRFE7Ozs7OztBQVFaLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixHQUNNO0VBQ1MsaUJBQUMsSUFBRCxFQUFPLEtBQVA7SUFBQyxJQUFDLENBQUEsTUFBRDtJQUFNLElBQUMsQ0FBQSx1QkFBRCxRQUFRO0lBQzFCLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixHQUFnQixJQUFJLENBQUMsS0FBTCxDQUFXLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBL0I7RUFETDs7b0JBR2IsYUFBQSxHQUFlLFNBQUMsQ0FBRDtJQUNiLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixHQUFtQjtXQUNuQjtFQUZhOztvQkFJZixZQUFBLEdBQWMsU0FBQyxDQUFEO0lBQ1osSUFBQyxDQUFBLElBQUksQ0FBQyxZQUFOLEdBQXFCO1dBQ3JCO0VBRlk7O29CQUlkLFNBQUEsR0FBVyxTQUFDLENBQUQ7SUFDVCxJQUFHLE9BQU8sQ0FBUCxLQUFZLFVBQWY7TUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFkLENBQW1CLENBQW5CLEVBREY7O1dBRUE7RUFIUzs7b0JBS1gsWUFBQSxHQUFjLFNBQUMsQ0FBRDtBQUNaLFFBQUE7SUFBQSxJQUFHLENBQUMsQ0FBQSxHQUFJLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWQsQ0FBc0IsQ0FBdEIsQ0FBTCxDQUFBLEdBQWlDLENBQXBDO01BQ0UsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBZCxDQUFxQixDQUFyQixFQURGOztXQUVBO0VBSFk7O29CQUtkLFlBQUEsR0FBYyxTQUFBO0lBQ1osSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLEdBQWdCO1dBQ2hCO0VBRlk7O29CQUlkLE9BQUEsR0FBUyxTQUFDLENBQUQ7SUFDUCxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sR0FBZ0I7V0FDaEI7RUFGTzs7b0JBSVQsUUFBQSxHQUFVLFNBQUMsS0FBRDtJQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixHQUFjO1dBQ2Q7RUFGUTs7b0JBSVYsWUFBQSxHQUFjLFNBQUMsU0FBRDtJQUNaLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtXQUNsQjtFQUZZOztvQkFJZCxZQUFBLEdBQWMsU0FBQyxTQUFEO0lBQ1osSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCO1dBQ2xCO0VBRlk7O29CQUlkLEtBQUEsR0FBTyxTQUFBO0lBQ0wsSUFBTyxjQUFQO01BQ0UsSUFBQyxDQUFBLENBQUQsR0FBUyxJQUFBLE9BQUEsQ0FBUSxJQUFDLENBQUEsR0FBVCxFQUFjLElBQUMsQ0FBQSxJQUFmLEVBRFg7O1dBRUEsSUFBQyxDQUFBO0VBSEk7O29CQUtQLFdBQUEsR0FBYSxTQUFDLEVBQUQ7V0FDWCxJQUFDLENBQUEsS0FBRCxDQUFBLENBQVEsQ0FBQyxVQUFULENBQW9CLEVBQXBCO0VBRFc7O29CQUdiLFVBQUEsR0FBWSxTQUFDLEVBQUQ7V0FDVixJQUFDLENBQUEsS0FBRCxDQUFBLENBQVEsQ0FBQyxVQUFULENBQW9CLEVBQXBCO0VBRFU7O29CQUdaLElBQUEsR0FBTSxTQUFDLEdBQUQ7V0FDQSxJQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWEsSUFBQyxDQUFBLElBQWQ7RUFEQTs7Ozs7O0FBR1IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFmLEdBQXNCOztBQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWYsR0FBd0I7O0FBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBZixHQUEyQixPQUFBLENBQVEsY0FBUjs7QUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFmLEdBQTJCLE9BQUEsQ0FBUSxjQUFSOztBQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWYsR0FBd0IsT0FBQSxDQUFRLFdBQVI7Ozs7QUNuSXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBxdWFudGl6ZS5qcyBDb3B5cmlnaHQgMjAwOCBOaWNrIFJhYmlub3dpdHpcbiAqIFBvcnRlZCB0byBub2RlLmpzIGJ5IE9saXZpZXIgTGVzbmlja2lcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuXG4vLyBmaWxsIG91dCBhIGNvdXBsZSBwcm90b3ZpcyBkZXBlbmRlbmNpZXNcbi8qXG4gKiBCbG9jayBiZWxvdyBjb3BpZWQgZnJvbSBQcm90b3ZpczogaHR0cDovL21ib3N0b2NrLmdpdGh1Yi5jb20vcHJvdG92aXMvXG4gKiBDb3B5cmlnaHQgMjAxMCBTdGFuZm9yZCBWaXN1YWxpemF0aW9uIEdyb3VwXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2U6IGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvYnNkLWxpY2Vuc2UucGhwXG4gKi9cbmlmICghcHYpIHtcbiAgICB2YXIgcHYgPSB7XG4gICAgICAgIG1hcDogZnVuY3Rpb24oYXJyYXksIGYpIHtcbiAgICAgICAgICAgIHZhciBvID0ge307XG4gICAgICAgICAgICByZXR1cm4gZiA/IGFycmF5Lm1hcChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgICAgICAgby5pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYuY2FsbChvLCBkKTtcbiAgICAgICAgICAgIH0pIDogYXJyYXkuc2xpY2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbmF0dXJhbE9yZGVyOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gKGEgPCBiKSA/IC0xIDogKChhID4gYikgPyAxIDogMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHN1bTogZnVuY3Rpb24oYXJyYXksIGYpIHtcbiAgICAgICAgICAgIHZhciBvID0ge307XG4gICAgICAgICAgICByZXR1cm4gYXJyYXkucmVkdWNlKGYgPyBmdW5jdGlvbihwLCBkLCBpKSB7XG4gICAgICAgICAgICAgICAgby5pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHAgKyBmLmNhbGwobywgZCk7XG4gICAgICAgICAgICB9IDogZnVuY3Rpb24ocCwgZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwICsgZDtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9LFxuICAgICAgICBtYXg6IGZ1bmN0aW9uKGFycmF5LCBmKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgZiA/IHB2Lm1hcChhcnJheSwgZikgOiBhcnJheSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogQmFzaWMgSmF2YXNjcmlwdCBwb3J0IG9mIHRoZSBNTUNRIChtb2RpZmllZCBtZWRpYW4gY3V0IHF1YW50aXphdGlvbilcbiAqIGFsZ29yaXRobSBmcm9tIHRoZSBMZXB0b25pY2EgbGlicmFyeSAoaHR0cDovL3d3dy5sZXB0b25pY2EuY29tLykuXG4gKiBSZXR1cm5zIGEgY29sb3IgbWFwIHlvdSBjYW4gdXNlIHRvIG1hcCBvcmlnaW5hbCBwaXhlbHMgdG8gdGhlIHJlZHVjZWRcbiAqIHBhbGV0dGUuIFN0aWxsIGEgd29yayBpbiBwcm9ncmVzcy5cbiAqIFxuICogQGF1dGhvciBOaWNrIFJhYmlub3dpdHpcbiAqIEBleGFtcGxlXG4gXG4vLyBhcnJheSBvZiBwaXhlbHMgYXMgW1IsRyxCXSBhcnJheXNcbnZhciBteVBpeGVscyA9IFtbMTkwLDE5NywxOTBdLCBbMjAyLDIwNCwyMDBdLCBbMjA3LDIxNCwyMTBdLCBbMjExLDIxNCwyMTFdLCBbMjA1LDIwNywyMDddXG4gICAgICAgICAgICAgICAgLy8gZXRjXG4gICAgICAgICAgICAgICAgXTtcbnZhciBtYXhDb2xvcnMgPSA0O1xuIFxudmFyIGNtYXAgPSBNTUNRLnF1YW50aXplKG15UGl4ZWxzLCBtYXhDb2xvcnMpO1xudmFyIG5ld1BhbGV0dGUgPSBjbWFwLnBhbGV0dGUoKTtcbnZhciBuZXdQaXhlbHMgPSBteVBpeGVscy5tYXAoZnVuY3Rpb24ocCkgeyBcbiAgICByZXR1cm4gY21hcC5tYXAocCk7IFxufSk7XG4gXG4gKi9cbnZhciBNTUNRID0gKGZ1bmN0aW9uKCkge1xuICAgIC8vIHByaXZhdGUgY29uc3RhbnRzXG4gICAgdmFyIHNpZ2JpdHMgPSA1LFxuICAgICAgICByc2hpZnQgPSA4IC0gc2lnYml0cyxcbiAgICAgICAgbWF4SXRlcmF0aW9ucyA9IDEwMDAsXG4gICAgICAgIGZyYWN0QnlQb3B1bGF0aW9ucyA9IDAuNzU7XG5cbiAgICAvLyBnZXQgcmVkdWNlZC1zcGFjZSBjb2xvciBpbmRleCBmb3IgYSBwaXhlbFxuXG4gICAgZnVuY3Rpb24gZ2V0Q29sb3JJbmRleChyLCBnLCBiKSB7XG4gICAgICAgIHJldHVybiAociA8PCAoMiAqIHNpZ2JpdHMpKSArIChnIDw8IHNpZ2JpdHMpICsgYjtcbiAgICB9XG5cbiAgICAvLyBTaW1wbGUgcHJpb3JpdHkgcXVldWVcblxuICAgIGZ1bmN0aW9uIFBRdWV1ZShjb21wYXJhdG9yKSB7XG4gICAgICAgIHZhciBjb250ZW50cyA9IFtdLFxuICAgICAgICAgICAgc29ydGVkID0gZmFsc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc29ydCgpIHtcbiAgICAgICAgICAgIGNvbnRlbnRzLnNvcnQoY29tcGFyYXRvcik7XG4gICAgICAgICAgICBzb3J0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHB1c2g6IGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKG8pO1xuICAgICAgICAgICAgICAgIHNvcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBlZWs6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzb3J0ZWQpIHNvcnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkgaW5kZXggPSBjb250ZW50cy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50c1tpbmRleF07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNvcnRlZCkgc29ydCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50cy5wb3AoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudHMubGVuZ3RoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1hcDogZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50cy5tYXAoZik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVidWc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICghc29ydGVkKSBzb3J0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIDNkIGNvbG9yIHNwYWNlIGJveFxuXG4gICAgZnVuY3Rpb24gVkJveChyMSwgcjIsIGcxLCBnMiwgYjEsIGIyLCBoaXN0bykge1xuICAgICAgICB2YXIgdmJveCA9IHRoaXM7XG4gICAgICAgIHZib3gucjEgPSByMTtcbiAgICAgICAgdmJveC5yMiA9IHIyO1xuICAgICAgICB2Ym94LmcxID0gZzE7XG4gICAgICAgIHZib3guZzIgPSBnMjtcbiAgICAgICAgdmJveC5iMSA9IGIxO1xuICAgICAgICB2Ym94LmIyID0gYjI7XG4gICAgICAgIHZib3guaGlzdG8gPSBoaXN0bztcbiAgICB9XG4gICAgVkJveC5wcm90b3R5cGUgPSB7XG4gICAgICAgIHZvbHVtZTogZnVuY3Rpb24oZm9yY2UpIHtcbiAgICAgICAgICAgIHZhciB2Ym94ID0gdGhpcztcbiAgICAgICAgICAgIGlmICghdmJveC5fdm9sdW1lIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICAgICAgdmJveC5fdm9sdW1lID0gKCh2Ym94LnIyIC0gdmJveC5yMSArIDEpICogKHZib3guZzIgLSB2Ym94LmcxICsgMSkgKiAodmJveC5iMiAtIHZib3guYjEgKyAxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmJveC5fdm9sdW1lO1xuICAgICAgICB9LFxuICAgICAgICBjb3VudDogZnVuY3Rpb24oZm9yY2UpIHtcbiAgICAgICAgICAgIHZhciB2Ym94ID0gdGhpcyxcbiAgICAgICAgICAgICAgICBoaXN0byA9IHZib3guaGlzdG87XG4gICAgICAgICAgICBpZiAoIXZib3guX2NvdW50X3NldCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIHZhciBucGl4ID0gMCxcbiAgICAgICAgICAgICAgICAgICAgaSwgaiwgaztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSB2Ym94LnIxOyBpIDw9IHZib3gucjI7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSB2Ym94LmcxOyBqIDw9IHZib3guZzI7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gdmJveC5iMTsgayA8PSB2Ym94LmIyOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgoaSwgaiwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnBpeCArPSAoaGlzdG9baW5kZXhdIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZib3guX2NvdW50ID0gbnBpeDtcbiAgICAgICAgICAgICAgICB2Ym94Ll9jb3VudF9zZXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZib3guX2NvdW50O1xuICAgICAgICB9LFxuICAgICAgICBjb3B5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB2Ym94ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBuZXcgVkJveCh2Ym94LnIxLCB2Ym94LnIyLCB2Ym94LmcxLCB2Ym94LmcyLCB2Ym94LmIxLCB2Ym94LmIyLCB2Ym94Lmhpc3RvKTtcbiAgICAgICAgfSxcbiAgICAgICAgYXZnOiBmdW5jdGlvbihmb3JjZSkge1xuICAgICAgICAgICAgdmFyIHZib3ggPSB0aGlzLFxuICAgICAgICAgICAgICAgIGhpc3RvID0gdmJveC5oaXN0bztcbiAgICAgICAgICAgIGlmICghdmJveC5fYXZnIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG50b3QgPSAwLFxuICAgICAgICAgICAgICAgICAgICBtdWx0ID0gMSA8PCAoOCAtIHNpZ2JpdHMpLFxuICAgICAgICAgICAgICAgICAgICByc3VtID0gMCxcbiAgICAgICAgICAgICAgICAgICAgZ3N1bSA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGJzdW0gPSAwLFxuICAgICAgICAgICAgICAgICAgICBodmFsLFxuICAgICAgICAgICAgICAgICAgICBpLCBqLCBrLCBoaXN0b2luZGV4O1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IHZib3gucjE7IGkgPD0gdmJveC5yMjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IHZib3guZzE7IGogPD0gdmJveC5nMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSB2Ym94LmIxOyBrIDw9IHZib3guYjI7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvaW5kZXggPSBnZXRDb2xvckluZGV4KGksIGosIGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh2YWwgPSBoaXN0b1toaXN0b2luZGV4XSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG50b3QgKz0gaHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByc3VtICs9IChodmFsICogKGkgKyAwLjUpICogbXVsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3N1bSArPSAoaHZhbCAqIChqICsgMC41KSAqIG11bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJzdW0gKz0gKGh2YWwgKiAoayArIDAuNSkgKiBtdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobnRvdCkge1xuICAgICAgICAgICAgICAgICAgICB2Ym94Ll9hdmcgPSBbfn4ocnN1bSAvIG50b3QpLCB+fiAoZ3N1bSAvIG50b3QpLCB+fiAoYnN1bSAvIG50b3QpXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdlbXB0eSBib3gnKTtcbiAgICAgICAgICAgICAgICAgICAgdmJveC5fYXZnID0gW35+KG11bHQgKiAodmJveC5yMSArIHZib3gucjIgKyAxKSAvIDIpLCB+fiAobXVsdCAqICh2Ym94LmcxICsgdmJveC5nMiArIDEpIC8gMiksIH5+IChtdWx0ICogKHZib3guYjEgKyB2Ym94LmIyICsgMSkgLyAyKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZib3guX2F2ZztcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uKHBpeGVsKSB7XG4gICAgICAgICAgICB2YXIgdmJveCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgcnZhbCA9IHBpeGVsWzBdID4+IHJzaGlmdDtcbiAgICAgICAgICAgIGd2YWwgPSBwaXhlbFsxXSA+PiByc2hpZnQ7XG4gICAgICAgICAgICBidmFsID0gcGl4ZWxbMl0gPj4gcnNoaWZ0O1xuICAgICAgICAgICAgcmV0dXJuIChydmFsID49IHZib3gucjEgJiYgcnZhbCA8PSB2Ym94LnIyICYmXG4gICAgICAgICAgICAgICAgZ3ZhbCA+PSB2Ym94LmcxICYmIGd2YWwgPD0gdmJveC5nMiAmJlxuICAgICAgICAgICAgICAgIGJ2YWwgPj0gdmJveC5iMSAmJiBidmFsIDw9IHZib3guYjIpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIENvbG9yIG1hcFxuXG4gICAgZnVuY3Rpb24gQ01hcCgpIHtcbiAgICAgICAgdGhpcy52Ym94ZXMgPSBuZXcgUFF1ZXVlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBwdi5uYXR1cmFsT3JkZXIoXG4gICAgICAgICAgICAgICAgYS52Ym94LmNvdW50KCkgKiBhLnZib3gudm9sdW1lKCksXG4gICAgICAgICAgICAgICAgYi52Ym94LmNvdW50KCkgKiBiLnZib3gudm9sdW1lKClcbiAgICAgICAgICAgIClcbiAgICAgICAgfSk7O1xuICAgIH1cbiAgICBDTWFwLnByb3RvdHlwZSA9IHtcbiAgICAgICAgcHVzaDogZnVuY3Rpb24odmJveCkge1xuICAgICAgICAgICAgdGhpcy52Ym94ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdmJveDogdmJveCxcbiAgICAgICAgICAgICAgICBjb2xvcjogdmJveC5hdmcoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHBhbGV0dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmJveGVzLm1hcChmdW5jdGlvbih2Yikge1xuICAgICAgICAgICAgICAgIHJldHVybiB2Yi5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmJveGVzLnNpemUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWFwOiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgdmFyIHZib3hlcyA9IHRoaXMudmJveGVzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Ym94ZXMuc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodmJveGVzLnBlZWsoaSkudmJveC5jb250YWlucyhjb2xvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZib3hlcy5wZWVrKGkpLmNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5lYXJlc3QoY29sb3IpO1xuICAgICAgICB9LFxuICAgICAgICBuZWFyZXN0OiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgdmFyIHZib3hlcyA9IHRoaXMudmJveGVzLFxuICAgICAgICAgICAgICAgIGQxLCBkMiwgcENvbG9yO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Ym94ZXMuc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkMiA9IE1hdGguc3FydChcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coY29sb3JbMF0gLSB2Ym94ZXMucGVlayhpKS5jb2xvclswXSwgMikgK1xuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhjb2xvclsxXSAtIHZib3hlcy5wZWVrKGkpLmNvbG9yWzFdLCAyKSArXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KGNvbG9yWzJdIC0gdmJveGVzLnBlZWsoaSkuY29sb3JbMl0sIDIpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAoZDIgPCBkMSB8fCBkMSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGQxID0gZDI7XG4gICAgICAgICAgICAgICAgICAgIHBDb2xvciA9IHZib3hlcy5wZWVrKGkpLmNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwQ29sb3I7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcmNlYnc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gWFhYOiB3b24ndCAgd29yayB5ZXRcbiAgICAgICAgICAgIHZhciB2Ym94ZXMgPSB0aGlzLnZib3hlcztcbiAgICAgICAgICAgIHZib3hlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHYubmF0dXJhbE9yZGVyKHB2LnN1bShhLmNvbG9yKSwgcHYuc3VtKGIuY29sb3IpKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGZvcmNlIGRhcmtlc3QgY29sb3IgdG8gYmxhY2sgaWYgZXZlcnl0aGluZyA8IDVcbiAgICAgICAgICAgIHZhciBsb3dlc3QgPSB2Ym94ZXNbMF0uY29sb3I7XG4gICAgICAgICAgICBpZiAobG93ZXN0WzBdIDwgNSAmJiBsb3dlc3RbMV0gPCA1ICYmIGxvd2VzdFsyXSA8IDUpXG4gICAgICAgICAgICAgICAgdmJveGVzWzBdLmNvbG9yID0gWzAsIDAsIDBdO1xuXG4gICAgICAgICAgICAvLyBmb3JjZSBsaWdodGVzdCBjb2xvciB0byB3aGl0ZSBpZiBldmVyeXRoaW5nID4gMjUxXG4gICAgICAgICAgICB2YXIgaWR4ID0gdmJveGVzLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICAgICAgaGlnaGVzdCA9IHZib3hlc1tpZHhdLmNvbG9yO1xuICAgICAgICAgICAgaWYgKGhpZ2hlc3RbMF0gPiAyNTEgJiYgaGlnaGVzdFsxXSA+IDI1MSAmJiBoaWdoZXN0WzJdID4gMjUxKVxuICAgICAgICAgICAgICAgIHZib3hlc1tpZHhdLmNvbG9yID0gWzI1NSwgMjU1LCAyNTVdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGhpc3RvICgxLWQgYXJyYXksIGdpdmluZyB0aGUgbnVtYmVyIG9mIHBpeGVscyBpblxuICAgIC8vIGVhY2ggcXVhbnRpemVkIHJlZ2lvbiBvZiBjb2xvciBzcGFjZSksIG9yIG51bGwgb24gZXJyb3JcblxuICAgIGZ1bmN0aW9uIGdldEhpc3RvKHBpeGVscykge1xuICAgICAgICB2YXIgaGlzdG9zaXplID0gMSA8PCAoMyAqIHNpZ2JpdHMpLFxuICAgICAgICAgICAgaGlzdG8gPSBuZXcgQXJyYXkoaGlzdG9zaXplKSxcbiAgICAgICAgICAgIGluZGV4LCBydmFsLCBndmFsLCBidmFsO1xuICAgICAgICBwaXhlbHMuZm9yRWFjaChmdW5jdGlvbihwaXhlbCkge1xuICAgICAgICAgICAgcnZhbCA9IHBpeGVsWzBdID4+IHJzaGlmdDtcbiAgICAgICAgICAgIGd2YWwgPSBwaXhlbFsxXSA+PiByc2hpZnQ7XG4gICAgICAgICAgICBidmFsID0gcGl4ZWxbMl0gPj4gcnNoaWZ0O1xuICAgICAgICAgICAgaW5kZXggPSBnZXRDb2xvckluZGV4KHJ2YWwsIGd2YWwsIGJ2YWwpO1xuICAgICAgICAgICAgaGlzdG9baW5kZXhdID0gKGhpc3RvW2luZGV4XSB8fCAwKSArIDE7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaGlzdG87XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmJveEZyb21QaXhlbHMocGl4ZWxzLCBoaXN0bykge1xuICAgICAgICB2YXIgcm1pbiA9IDEwMDAwMDAsXG4gICAgICAgICAgICBybWF4ID0gMCxcbiAgICAgICAgICAgIGdtaW4gPSAxMDAwMDAwLFxuICAgICAgICAgICAgZ21heCA9IDAsXG4gICAgICAgICAgICBibWluID0gMTAwMDAwMCxcbiAgICAgICAgICAgIGJtYXggPSAwLFxuICAgICAgICAgICAgcnZhbCwgZ3ZhbCwgYnZhbDtcbiAgICAgICAgLy8gZmluZCBtaW4vbWF4XG4gICAgICAgIHBpeGVscy5mb3JFYWNoKGZ1bmN0aW9uKHBpeGVsKSB7XG4gICAgICAgICAgICBydmFsID0gcGl4ZWxbMF0gPj4gcnNoaWZ0O1xuICAgICAgICAgICAgZ3ZhbCA9IHBpeGVsWzFdID4+IHJzaGlmdDtcbiAgICAgICAgICAgIGJ2YWwgPSBwaXhlbFsyXSA+PiByc2hpZnQ7XG4gICAgICAgICAgICBpZiAocnZhbCA8IHJtaW4pIHJtaW4gPSBydmFsO1xuICAgICAgICAgICAgZWxzZSBpZiAocnZhbCA+IHJtYXgpIHJtYXggPSBydmFsO1xuICAgICAgICAgICAgaWYgKGd2YWwgPCBnbWluKSBnbWluID0gZ3ZhbDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGd2YWwgPiBnbWF4KSBnbWF4ID0gZ3ZhbDtcbiAgICAgICAgICAgIGlmIChidmFsIDwgYm1pbikgYm1pbiA9IGJ2YWw7XG4gICAgICAgICAgICBlbHNlIGlmIChidmFsID4gYm1heCkgYm1heCA9IGJ2YWw7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3IFZCb3gocm1pbiwgcm1heCwgZ21pbiwgZ21heCwgYm1pbiwgYm1heCwgaGlzdG8pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lZGlhbkN1dEFwcGx5KGhpc3RvLCB2Ym94KSB7XG4gICAgICAgIGlmICghdmJveC5jb3VudCgpKSByZXR1cm47XG5cbiAgICAgICAgdmFyIHJ3ID0gdmJveC5yMiAtIHZib3gucjEgKyAxLFxuICAgICAgICAgICAgZ3cgPSB2Ym94LmcyIC0gdmJveC5nMSArIDEsXG4gICAgICAgICAgICBidyA9IHZib3guYjIgLSB2Ym94LmIxICsgMSxcbiAgICAgICAgICAgIG1heHcgPSBwdi5tYXgoW3J3LCBndywgYnddKTtcbiAgICAgICAgLy8gb25seSBvbmUgcGl4ZWwsIG5vIHNwbGl0XG4gICAgICAgIGlmICh2Ym94LmNvdW50KCkgPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIFt2Ym94LmNvcHkoKV1cbiAgICAgICAgfVxuICAgICAgICAvKiBGaW5kIHRoZSBwYXJ0aWFsIHN1bSBhcnJheXMgYWxvbmcgdGhlIHNlbGVjdGVkIGF4aXMuICovXG4gICAgICAgIHZhciB0b3RhbCA9IDAsXG4gICAgICAgICAgICBwYXJ0aWFsc3VtID0gW10sXG4gICAgICAgICAgICBsb29rYWhlYWRzdW0gPSBbXSxcbiAgICAgICAgICAgIGksIGosIGssIHN1bSwgaW5kZXg7XG4gICAgICAgIGlmIChtYXh3ID09IHJ3KSB7XG4gICAgICAgICAgICBmb3IgKGkgPSB2Ym94LnIxOyBpIDw9IHZib3gucjI7IGkrKykge1xuICAgICAgICAgICAgICAgIHN1bSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChqID0gdmJveC5nMTsgaiA8PSB2Ym94LmcyOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gdmJveC5iMTsgayA8PSB2Ym94LmIyOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChpLCBqLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bSArPSAoaGlzdG9baW5kZXhdIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRvdGFsICs9IHN1bTtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsc3VtW2ldID0gdG90YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobWF4dyA9PSBndykge1xuICAgICAgICAgICAgZm9yIChpID0gdmJveC5nMTsgaSA8PSB2Ym94LmcyOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzdW0gPSAwO1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IHZib3gucjE7IGogPD0gdmJveC5yMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IHZib3guYjE7IGsgPD0gdmJveC5iMjsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgoaiwgaSwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdW0gKz0gKGhpc3RvW2luZGV4XSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0b3RhbCArPSBzdW07XG4gICAgICAgICAgICAgICAgcGFydGlhbHN1bVtpXSA9IHRvdGFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvKiBtYXh3ID09IGJ3ICovXG4gICAgICAgICAgICBmb3IgKGkgPSB2Ym94LmIxOyBpIDw9IHZib3guYjI7IGkrKykge1xuICAgICAgICAgICAgICAgIHN1bSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChqID0gdmJveC5yMTsgaiA8PSB2Ym94LnIyOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gdmJveC5nMTsgayA8PSB2Ym94LmcyOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChqLCBrLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bSArPSAoaGlzdG9baW5kZXhdIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRvdGFsICs9IHN1bTtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsc3VtW2ldID0gdG90YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGFydGlhbHN1bS5mb3JFYWNoKGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICAgIGxvb2thaGVhZHN1bVtpXSA9IHRvdGFsIC0gZFxuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBkb0N1dChjb2xvcikge1xuICAgICAgICAgICAgdmFyIGRpbTEgPSBjb2xvciArICcxJyxcbiAgICAgICAgICAgICAgICBkaW0yID0gY29sb3IgKyAnMicsXG4gICAgICAgICAgICAgICAgbGVmdCwgcmlnaHQsIHZib3gxLCB2Ym94MiwgZDIsIGNvdW50MiA9IDA7XG4gICAgICAgICAgICBmb3IgKGkgPSB2Ym94W2RpbTFdOyBpIDw9IHZib3hbZGltMl07IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0aWFsc3VtW2ldID4gdG90YWwgLyAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZib3gxID0gdmJveC5jb3B5KCk7XG4gICAgICAgICAgICAgICAgICAgIHZib3gyID0gdmJveC5jb3B5KCk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBpIC0gdmJveFtkaW0xXTtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSB2Ym94W2RpbTJdIC0gaTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPD0gcmlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICBkMiA9IE1hdGgubWluKHZib3hbZGltMl0gLSAxLCB+fiAoaSArIHJpZ2h0IC8gMikpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGQyID0gTWF0aC5tYXgodmJveFtkaW0xXSwgfn4gKGkgLSAxIC0gbGVmdCAvIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYXZvaWQgMC1jb3VudCBib3hlc1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIXBhcnRpYWxzdW1bZDJdKSBkMisrO1xuICAgICAgICAgICAgICAgICAgICBjb3VudDIgPSBsb29rYWhlYWRzdW1bZDJdO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIWNvdW50MiAmJiBwYXJ0aWFsc3VtW2QyIC0gMV0pIGNvdW50MiA9IGxvb2thaGVhZHN1bVstLWQyXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGRpbWVuc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgdmJveDFbZGltMl0gPSBkMjtcbiAgICAgICAgICAgICAgICAgICAgdmJveDJbZGltMV0gPSB2Ym94MVtkaW0yXSArIDE7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd2Ym94IGNvdW50czonLCB2Ym94LmNvdW50KCksIHZib3gxLmNvdW50KCksIHZib3gyLmNvdW50KCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Zib3gxLCB2Ym94Ml07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBjdXQgcGxhbmVzXG4gICAgICAgIHJldHVybiBtYXh3ID09IHJ3ID8gZG9DdXQoJ3InKSA6XG4gICAgICAgICAgICBtYXh3ID09IGd3ID8gZG9DdXQoJ2cnKSA6XG4gICAgICAgICAgICBkb0N1dCgnYicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHF1YW50aXplKHBpeGVscywgbWF4Y29sb3JzKSB7XG4gICAgICAgIC8vIHNob3J0LWNpcmN1aXRcbiAgICAgICAgaWYgKCFwaXhlbHMubGVuZ3RoIHx8IG1heGNvbG9ycyA8IDIgfHwgbWF4Y29sb3JzID4gMjU2KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd3JvbmcgbnVtYmVyIG9mIG1heGNvbG9ycycpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWFhYOiBjaGVjayBjb2xvciBjb250ZW50IGFuZCBjb252ZXJ0IHRvIGdyYXlzY2FsZSBpZiBpbnN1ZmZpY2llbnRcblxuICAgICAgICB2YXIgaGlzdG8gPSBnZXRIaXN0byhwaXhlbHMpLFxuICAgICAgICAgICAgaGlzdG9zaXplID0gMSA8PCAoMyAqIHNpZ2JpdHMpO1xuXG4gICAgICAgIC8vIGNoZWNrIHRoYXQgd2UgYXJlbid0IGJlbG93IG1heGNvbG9ycyBhbHJlYWR5XG4gICAgICAgIHZhciBuQ29sb3JzID0gMDtcbiAgICAgICAgaGlzdG8uZm9yRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5Db2xvcnMrK1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG5Db2xvcnMgPD0gbWF4Y29sb3JzKSB7XG4gICAgICAgICAgICAvLyBYWFg6IGdlbmVyYXRlIHRoZSBuZXcgY29sb3JzIGZyb20gdGhlIGhpc3RvIGFuZCByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCB0aGUgYmVnaW5uaW5nIHZib3ggZnJvbSB0aGUgY29sb3JzXG4gICAgICAgIHZhciB2Ym94ID0gdmJveEZyb21QaXhlbHMocGl4ZWxzLCBoaXN0byksXG4gICAgICAgICAgICBwcSA9IG5ldyBQUXVldWUoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwdi5uYXR1cmFsT3JkZXIoYS5jb3VudCgpLCBiLmNvdW50KCkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcHEucHVzaCh2Ym94KTtcblxuICAgICAgICAvLyBpbm5lciBmdW5jdGlvbiB0byBkbyB0aGUgaXRlcmF0aW9uXG5cbiAgICAgICAgZnVuY3Rpb24gaXRlcihsaCwgdGFyZ2V0KSB7XG4gICAgICAgICAgICB2YXIgbmNvbG9ycyA9IDEsXG4gICAgICAgICAgICAgICAgbml0ZXJzID0gMCxcbiAgICAgICAgICAgICAgICB2Ym94O1xuICAgICAgICAgICAgd2hpbGUgKG5pdGVycyA8IG1heEl0ZXJhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB2Ym94ID0gbGgucG9wKCk7XG4gICAgICAgICAgICAgICAgaWYgKCF2Ym94LmNvdW50KCkpIHsgLyoganVzdCBwdXQgaXQgYmFjayAqL1xuICAgICAgICAgICAgICAgICAgICBsaC5wdXNoKHZib3gpO1xuICAgICAgICAgICAgICAgICAgICBuaXRlcnMrKztcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRvIHRoZSBjdXRcbiAgICAgICAgICAgICAgICB2YXIgdmJveGVzID0gbWVkaWFuQ3V0QXBwbHkoaGlzdG8sIHZib3gpLFxuICAgICAgICAgICAgICAgICAgICB2Ym94MSA9IHZib3hlc1swXSxcbiAgICAgICAgICAgICAgICAgICAgdmJveDIgPSB2Ym94ZXNbMV07XG5cbiAgICAgICAgICAgICAgICBpZiAoIXZib3gxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidmJveDEgbm90IGRlZmluZWQ7IHNob3VsZG4ndCBoYXBwZW4hXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxoLnB1c2godmJveDEpO1xuICAgICAgICAgICAgICAgIGlmICh2Ym94MikgeyAvKiB2Ym94MiBjYW4gYmUgbnVsbCAqL1xuICAgICAgICAgICAgICAgICAgICBsaC5wdXNoKHZib3gyKTtcbiAgICAgICAgICAgICAgICAgICAgbmNvbG9ycysrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmNvbG9ycyA+PSB0YXJnZXQpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAobml0ZXJzKysgPiBtYXhJdGVyYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaW5maW5pdGUgbG9vcDsgcGVyaGFwcyB0b28gZmV3IHBpeGVscyFcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaXJzdCBzZXQgb2YgY29sb3JzLCBzb3J0ZWQgYnkgcG9wdWxhdGlvblxuICAgICAgICBpdGVyKHBxLCBmcmFjdEJ5UG9wdWxhdGlvbnMgKiBtYXhjb2xvcnMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwcS5zaXplKCksIHBxLmRlYnVnKCkubGVuZ3RoLCBwcS5kZWJ1ZygpLnNsaWNlKCkpO1xuXG4gICAgICAgIC8vIFJlLXNvcnQgYnkgdGhlIHByb2R1Y3Qgb2YgcGl4ZWwgb2NjdXBhbmN5IHRpbWVzIHRoZSBzaXplIGluIGNvbG9yIHNwYWNlLlxuICAgICAgICB2YXIgcHEyID0gbmV3IFBRdWV1ZShmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gcHYubmF0dXJhbE9yZGVyKGEuY291bnQoKSAqIGEudm9sdW1lKCksIGIuY291bnQoKSAqIGIudm9sdW1lKCkpXG4gICAgICAgIH0pO1xuICAgICAgICB3aGlsZSAocHEuc2l6ZSgpKSB7XG4gICAgICAgICAgICBwcTIucHVzaChwcS5wb3AoKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBuZXh0IHNldCAtIGdlbmVyYXRlIHRoZSBtZWRpYW4gY3V0cyB1c2luZyB0aGUgKG5waXggKiB2b2wpIHNvcnRpbmcuXG4gICAgICAgIGl0ZXIocHEyLCBtYXhjb2xvcnMgLSBwcTIuc2l6ZSgpKTtcblxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGFjdHVhbCBjb2xvcnNcbiAgICAgICAgdmFyIGNtYXAgPSBuZXcgQ01hcCgpO1xuICAgICAgICB3aGlsZSAocHEyLnNpemUoKSkge1xuICAgICAgICAgICAgY21hcC5wdXNoKHBxMi5wb3AoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY21hcDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBxdWFudGl6ZTogcXVhbnRpemVcbiAgICB9XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1NQ1EucXVhbnRpemVcbiIsIlZpYnJhbnQgPSByZXF1aXJlKCcuL3ZpYnJhbnQnKVxuVmlicmFudC5EZWZhdWx0T3B0cy5JbWFnZSA9IHJlcXVpcmUoJy4vaW1hZ2UvYnJvd3NlcicpXG5cbm1vZHVsZS5leHBvcnRzID0gVmlicmFudFxuIiwid2luZG93LlZpYnJhbnQgPSBWaWJyYW50ID0gcmVxdWlyZSgnLi9icm93c2VyJylcbiIsIm1vZHVsZS5leHBvcnRzID0gKHIsIGcsIGIsIGEpIC0+XHJcbiAgYSA+PSAxMjUgYW5kIG5vdCAociA+IDI1MCBhbmQgZyA+IDI1MCBhbmQgYiA+IDI1MClcclxuIiwibW9kdWxlLmV4cG9ydHMuRGVmYXVsdCA9IHJlcXVpcmUoJy4vZGVmYXVsdCcpXHJcbiIsIlN3YXRjaCA9IHJlcXVpcmUoJy4uL3N3YXRjaCcpXHJcbnV0aWwgPSByZXF1aXJlKCcuLi91dGlsJylcclxuR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9pbmRleCcpXHJcblxyXG5EZWZhdWx0T3B0cyA9XHJcbiAgdGFyZ2V0RGFya0x1bWE6IDAuMjZcclxuICBtYXhEYXJrTHVtYTogMC40NVxyXG4gIG1pbkxpZ2h0THVtYTogMC41NVxyXG4gIHRhcmdldExpZ2h0THVtYTogMC43NFxyXG4gIG1pbk5vcm1hbEx1bWE6IDAuM1xyXG4gIHRhcmdldE5vcm1hbEx1bWE6IDAuNVxyXG4gIG1heE5vcm1hbEx1bWE6IDAuN1xyXG4gIHRhcmdldE11dGVzU2F0dXJhdGlvbjogMC4zXHJcbiAgbWF4TXV0ZXNTYXR1cmF0aW9uOiAwLjRcclxuICB0YXJnZXRWaWJyYW50U2F0dXJhdGlvbjogMS4wXHJcbiAgbWluVmlicmFudFNhdHVyYXRpb246IDAuMzVcclxuICB3ZWlnaHRTYXR1cmF0aW9uOiAzXHJcbiAgd2VpZ2h0THVtYTogNlxyXG4gIHdlaWdodFBvcHVsYXRpb246IDFcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuY2xhc3MgRGVmYXVsdEdlbmVyYXRvciBleHRlbmRzIEdlbmVyYXRvclxyXG4gIEhpZ2hlc3RQb3B1bGF0aW9uOiAwXHJcbiAgY29uc3RydWN0b3I6IChvcHRzKSAtPlxyXG4gICAgQG9wdHMgPSB1dGlsLmRlZmF1bHRzKG9wdHMsIERlZmF1bHRPcHRzKVxyXG4gICAgQFZpYnJhbnRTd2F0Y2ggPSBudWxsXHJcbiAgICBATGlnaHRWaWJyYW50U3dhdGNoID0gbnVsbFxyXG4gICAgQERhcmtWaWJyYW50U3dhdGNoID0gbnVsbFxyXG4gICAgQE11dGVkU3dhdGNoID0gbnVsbFxyXG4gICAgQExpZ2h0TXV0ZWRTd2F0Y2ggPSBudWxsXHJcbiAgICBARGFya011dGVkU3dhdGNoID0gbnVsbFxyXG5cclxuICBnZW5lcmF0ZTogKEBzd2F0Y2hlcykgLT5cclxuICAgIEBtYXhQb3B1bGF0aW9uID0gQGZpbmRNYXhQb3B1bGF0aW9uXHJcblxyXG4gICAgQGdlbmVyYXRlVmFyYXRpb25Db2xvcnMoKVxyXG4gICAgQGdlbmVyYXRlRW1wdHlTd2F0Y2hlcygpXHJcblxyXG4gIGdldFZpYnJhbnRTd2F0Y2g6IC0+XHJcbiAgICBAVmlicmFudFN3YXRjaFxyXG5cclxuICBnZXRMaWdodFZpYnJhbnRTd2F0Y2g6IC0+XHJcbiAgICBATGlnaHRWaWJyYW50U3dhdGNoXHJcblxyXG4gIGdldERhcmtWaWJyYW50U3dhdGNoOiAtPlxyXG4gICAgQERhcmtWaWJyYW50U3dhdGNoXHJcblxyXG4gIGdldE11dGVkU3dhdGNoOiAtPlxyXG4gICAgQE11dGVkU3dhdGNoXHJcblxyXG4gIGdldExpZ2h0TXV0ZWRTd2F0Y2g6IC0+XHJcbiAgICBATGlnaHRNdXRlZFN3YXRjaFxyXG5cclxuICBnZXREYXJrTXV0ZWRTd2F0Y2g6IC0+XHJcbiAgICBARGFya011dGVkU3dhdGNoXHJcblxyXG4gIGdlbmVyYXRlVmFyYXRpb25Db2xvcnM6IC0+XHJcbiAgICBAVmlicmFudFN3YXRjaCA9IEBmaW5kQ29sb3JWYXJpYXRpb24oQG9wdHMudGFyZ2V0Tm9ybWFsTHVtYSwgQG9wdHMubWluTm9ybWFsTHVtYSwgQG9wdHMubWF4Tm9ybWFsTHVtYSxcclxuICAgICAgQG9wdHMudGFyZ2V0VmlicmFudFNhdHVyYXRpb24sIEBvcHRzLm1pblZpYnJhbnRTYXR1cmF0aW9uLCAxKTtcclxuXHJcbiAgICBATGlnaHRWaWJyYW50U3dhdGNoID0gQGZpbmRDb2xvclZhcmlhdGlvbihAb3B0cy50YXJnZXRMaWdodEx1bWEsIEBvcHRzLm1pbkxpZ2h0THVtYSwgMSxcclxuICAgICAgQG9wdHMudGFyZ2V0VmlicmFudFNhdHVyYXRpb24sIEBvcHRzLm1pblZpYnJhbnRTYXR1cmF0aW9uLCAxKTtcclxuXHJcbiAgICBARGFya1ZpYnJhbnRTd2F0Y2ggPSBAZmluZENvbG9yVmFyaWF0aW9uKEBvcHRzLnRhcmdldERhcmtMdW1hLCAwLCBAb3B0cy5tYXhEYXJrTHVtYSxcclxuICAgICAgQG9wdHMudGFyZ2V0VmlicmFudFNhdHVyYXRpb24sIEBvcHRzLm1pblZpYnJhbnRTYXR1cmF0aW9uLCAxKTtcclxuXHJcbiAgICBATXV0ZWRTd2F0Y2ggPSBAZmluZENvbG9yVmFyaWF0aW9uKEBvcHRzLnRhcmdldE5vcm1hbEx1bWEsIEBvcHRzLm1pbk5vcm1hbEx1bWEsIEBvcHRzLm1heE5vcm1hbEx1bWEsXHJcbiAgICAgIEBvcHRzLnRhcmdldE11dGVzU2F0dXJhdGlvbiwgMCwgQG9wdHMubWF4TXV0ZXNTYXR1cmF0aW9uKTtcclxuXHJcbiAgICBATGlnaHRNdXRlZFN3YXRjaCA9IEBmaW5kQ29sb3JWYXJpYXRpb24oQG9wdHMudGFyZ2V0TGlnaHRMdW1hLCBAb3B0cy5taW5MaWdodEx1bWEsIDEsXHJcbiAgICAgIEBvcHRzLnRhcmdldE11dGVzU2F0dXJhdGlvbiwgMCwgQG9wdHMubWF4TXV0ZXNTYXR1cmF0aW9uKTtcclxuXHJcbiAgICBARGFya011dGVkU3dhdGNoID0gQGZpbmRDb2xvclZhcmlhdGlvbihAb3B0cy50YXJnZXREYXJrTHVtYSwgMCwgQG9wdHMubWF4RGFya0x1bWEsXHJcbiAgICAgIEBvcHRzLnRhcmdldE11dGVzU2F0dXJhdGlvbiwgMCwgQG9wdHMubWF4TXV0ZXNTYXR1cmF0aW9uKTtcclxuXHJcbiAgZ2VuZXJhdGVFbXB0eVN3YXRjaGVzOiAtPlxyXG4gICAgaWYgQFZpYnJhbnRTd2F0Y2ggaXMgbnVsbFxyXG4gICAgICAjIElmIHdlIGRvIG5vdCBoYXZlIGEgdmlicmFudCBjb2xvci4uLlxyXG4gICAgICBpZiBARGFya1ZpYnJhbnRTd2F0Y2ggaXNudCBudWxsXHJcbiAgICAgICAgIyAuLi5idXQgd2UgZG8gaGF2ZSBhIGRhcmsgdmlicmFudCwgZ2VuZXJhdGUgdGhlIHZhbHVlIGJ5IG1vZGlmeWluZyB0aGUgbHVtYVxyXG4gICAgICAgIGhzbCA9IEBEYXJrVmlicmFudFN3YXRjaC5nZXRIc2woKVxyXG4gICAgICAgIGhzbFsyXSA9IEBvcHRzLnRhcmdldE5vcm1hbEx1bWFcclxuICAgICAgICBAVmlicmFudFN3YXRjaCA9IG5ldyBTd2F0Y2ggdXRpbC5oc2xUb1JnYihoc2xbMF0sIGhzbFsxXSwgaHNsWzJdKSwgMFxyXG5cclxuICAgIGlmIEBEYXJrVmlicmFudFN3YXRjaCBpcyBudWxsXHJcbiAgICAgICMgSWYgd2UgZG8gbm90IGhhdmUgYSB2aWJyYW50IGNvbG9yLi4uXHJcbiAgICAgIGlmIEBWaWJyYW50U3dhdGNoIGlzbnQgbnVsbFxyXG4gICAgICAgICMgLi4uYnV0IHdlIGRvIGhhdmUgYSBkYXJrIHZpYnJhbnQsIGdlbmVyYXRlIHRoZSB2YWx1ZSBieSBtb2RpZnlpbmcgdGhlIGx1bWFcclxuICAgICAgICBoc2wgPSBAVmlicmFudFN3YXRjaC5nZXRIc2woKVxyXG4gICAgICAgIGhzbFsyXSA9IEBvcHRzLnRhcmdldERhcmtMdW1hXHJcbiAgICAgICAgQERhcmtWaWJyYW50U3dhdGNoID0gbmV3IFN3YXRjaCB1dGlsLmhzbFRvUmdiKGhzbFswXSwgaHNsWzFdLCBoc2xbMl0pLCAwXHJcblxyXG4gIGZpbmRNYXhQb3B1bGF0aW9uOiAtPlxyXG4gICAgcG9wdWxhdGlvbiA9IDBcclxuICAgIHBvcHVsYXRpb24gPSBNYXRoLm1heChwb3B1bGF0aW9uLCBzd2F0Y2guZ2V0UG9wdWxhdGlvbigpKSBmb3Igc3dhdGNoIGluIEBzd2F0Y2hlc1xyXG4gICAgcG9wdWxhdGlvblxyXG5cclxuICBmaW5kQ29sb3JWYXJpYXRpb246ICh0YXJnZXRMdW1hLCBtaW5MdW1hLCBtYXhMdW1hLCB0YXJnZXRTYXR1cmF0aW9uLCBtaW5TYXR1cmF0aW9uLCBtYXhTYXR1cmF0aW9uKSAtPlxyXG4gICAgbWF4ID0gbnVsbFxyXG4gICAgbWF4VmFsdWUgPSAwXHJcblxyXG4gICAgZm9yIHN3YXRjaCBpbiBAc3dhdGNoZXNcclxuICAgICAgc2F0ID0gc3dhdGNoLmdldEhzbCgpWzFdO1xyXG4gICAgICBsdW1hID0gc3dhdGNoLmdldEhzbCgpWzJdXHJcblxyXG4gICAgICBpZiBzYXQgPj0gbWluU2F0dXJhdGlvbiBhbmQgc2F0IDw9IG1heFNhdHVyYXRpb24gYW5kXHJcbiAgICAgICAgbHVtYSA+PSBtaW5MdW1hIGFuZCBsdW1hIDw9IG1heEx1bWEgYW5kXHJcbiAgICAgICAgbm90IEBpc0FscmVhZHlTZWxlY3RlZChzd2F0Y2gpXHJcbiAgICAgICAgICB2YWx1ZSA9IEBjcmVhdGVDb21wYXJpc29uVmFsdWUgc2F0LCB0YXJnZXRTYXR1cmF0aW9uLCBsdW1hLCB0YXJnZXRMdW1hLFxyXG4gICAgICAgICAgICBzd2F0Y2guZ2V0UG9wdWxhdGlvbigpLCBASGlnaGVzdFBvcHVsYXRpb25cclxuICAgICAgICAgIGlmIG1heCBpcyBudWxsIG9yIHZhbHVlID4gbWF4VmFsdWVcclxuICAgICAgICAgICAgbWF4ID0gc3dhdGNoXHJcbiAgICAgICAgICAgIG1heFZhbHVlID0gdmFsdWVcclxuXHJcbiAgICBtYXhcclxuXHJcbiAgY3JlYXRlQ29tcGFyaXNvblZhbHVlOiAoc2F0dXJhdGlvbiwgdGFyZ2V0U2F0dXJhdGlvbixcclxuICAgICAgbHVtYSwgdGFyZ2V0THVtYSwgcG9wdWxhdGlvbiwgbWF4UG9wdWxhdGlvbikgLT5cclxuICAgIEB3ZWlnaHRlZE1lYW4oXHJcbiAgICAgIEBpbnZlcnREaWZmKHNhdHVyYXRpb24sIHRhcmdldFNhdHVyYXRpb24pLCBAb3B0cy53ZWlnaHRTYXR1cmF0aW9uLFxyXG4gICAgICBAaW52ZXJ0RGlmZihsdW1hLCB0YXJnZXRMdW1hKSwgQG9wdHMud2VpZ2h0THVtYSxcclxuICAgICAgcG9wdWxhdGlvbiAvIG1heFBvcHVsYXRpb24sIEBvcHRzLndlaWdodFBvcHVsYXRpb25cclxuICAgIClcclxuXHJcbiAgaW52ZXJ0RGlmZjogKHZhbHVlLCB0YXJnZXRWYWx1ZSkgLT5cclxuICAgIDEgLSBNYXRoLmFicyB2YWx1ZSAtIHRhcmdldFZhbHVlXHJcblxyXG4gIHdlaWdodGVkTWVhbjogKHZhbHVlcy4uLikgLT5cclxuICAgIHN1bSA9IDBcclxuICAgIHN1bVdlaWdodCA9IDBcclxuICAgIGkgPSAwXHJcbiAgICB3aGlsZSBpIDwgdmFsdWVzLmxlbmd0aFxyXG4gICAgICB2YWx1ZSA9IHZhbHVlc1tpXVxyXG4gICAgICB3ZWlnaHQgPSB2YWx1ZXNbaSArIDFdXHJcbiAgICAgIHN1bSArPSB2YWx1ZSAqIHdlaWdodFxyXG4gICAgICBzdW1XZWlnaHQgKz0gd2VpZ2h0XHJcbiAgICAgIGkgKz0gMlxyXG4gICAgc3VtIC8gc3VtV2VpZ2h0XHJcblxyXG4gIGlzQWxyZWFkeVNlbGVjdGVkOiAoc3dhdGNoKSAtPlxyXG4gICAgQFZpYnJhbnRTd2F0Y2ggaXMgc3dhdGNoIG9yIEBEYXJrVmlicmFudFN3YXRjaCBpcyBzd2F0Y2ggb3JcclxuICAgICAgQExpZ2h0VmlicmFudFN3YXRjaCBpcyBzd2F0Y2ggb3IgQE11dGVkU3dhdGNoIGlzIHN3YXRjaCBvclxyXG4gICAgICBARGFya011dGVkU3dhdGNoIGlzIHN3YXRjaCBvciBATGlnaHRNdXRlZFN3YXRjaCBpcyBzd2F0Y2hcclxuIiwibW9kdWxlLmV4cG9ydHMgPVxyXG5jbGFzcyBHZW5lcmF0b3JcclxuICBnZW5lcmF0ZTogKHN3YXRjaGVzKSAtPlxyXG5cclxuICBnZXRWaWJyYW50U3dhdGNoOiAtPlxyXG5cclxuICBnZXRMaWdodFZpYnJhbnRTd2F0Y2g6IC0+XHJcblxyXG4gIGdldERhcmtWaWJyYW50U3dhdGNoOiAtPlxyXG5cclxuICBnZXRNdXRlZFN3YXRjaDogLT5cclxuXHJcbiAgZ2V0TGlnaHRNdXRlZFN3YXRjaDogLT5cclxuXHJcbiAgZ2V0RGFya011dGVkU3dhdGNoOiAtPlxyXG5cclxubW9kdWxlLmV4cG9ydHMuRGVmYXVsdCA9IHJlcXVpcmUoJy4vZGVmYXVsdCcpXHJcbiIsIkltYWdlID0gcmVxdWlyZSgnLi9pbmRleCcpXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBCcm93c2VySW1hZ2UgZXh0ZW5kcyBJbWFnZVxuICBjb25zdHJ1Y3RvcjogKHBhdGgsIGNiKSAtPlxuICAgIEBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgIEBpbWcuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJ1xuICAgIEBpbWcuc3JjID0gcGF0aFxuXG4gICAgQGltZy5vbmxvYWQgPSA9PlxuICAgICAgQF9pbml0Q2FudmFzKClcbiAgICAgIGNiPyhudWxsLCBAKVxuXG4gICAgQGltZy5vbmVycm9yID0gKGUpID0+XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoXCJGYWlsIHRvIGxvYWQgaW1hZ2U6IFwiICsgcGF0aCk7XG4gICAgICBlcnIucmF3ID0gZTtcbiAgICAgIGNiPyhlcnIpXG5cbiAgX2luaXRDYW52YXM6IC0+XG4gICAgQGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgQGNvbnRleHQgPSBAY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIEBjYW52YXNcbiAgICBAd2lkdGggPSBAY2FudmFzLndpZHRoID0gQGltZy53aWR0aFxuICAgIEBoZWlnaHQgPSBAY2FudmFzLmhlaWdodCA9IEBpbWcuaGVpZ2h0XG4gICAgQGNvbnRleHQuZHJhd0ltYWdlIEBpbWcsIDAsIDAsIEB3aWR0aCwgQGhlaWdodFxuXG4gIGNsZWFyOiAtPlxuICAgIEBjb250ZXh0LmNsZWFyUmVjdCAwLCAwLCBAd2lkdGgsIEBoZWlnaHRcblxuICBnZXRXaWR0aDogLT5cbiAgICBAd2lkdGhcblxuICBnZXRIZWlnaHQ6IC0+XG4gICAgQGhlaWdodFxuXG4gIHJlc2l6ZTogKHcsIGgsIHIpIC0+XG4gICAgQHdpZHRoID0gQGNhbnZhcy53aWR0aCA9IHdcbiAgICBAaGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgPSBoXG4gICAgQGNvbnRleHQuc2NhbGUociwgcilcbiAgICBAY29udGV4dC5kcmF3SW1hZ2UgQGltZywgMCwgMFxuXG4gIHVwZGF0ZTogKGltYWdlRGF0YSkgLT5cbiAgICBAY29udGV4dC5wdXRJbWFnZURhdGEgaW1hZ2VEYXRhLCAwLCAwXG5cbiAgZ2V0UGl4ZWxDb3VudDogLT5cbiAgICBAd2lkdGggKiBAaGVpZ2h0XG5cbiAgZ2V0SW1hZ2VEYXRhOiAtPlxuICAgIEBjb250ZXh0LmdldEltYWdlRGF0YSAwLCAwLCBAd2lkdGgsIEBoZWlnaHRcblxuICByZW1vdmVDYW52YXM6IC0+XG4gICAgQGNhbnZhcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkIEBjYW52YXNcbiIsIm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEltYWdlXG4gIGNsZWFyOiAtPlxuXG4gIHVwZGF0ZTogKGltYWdlRGF0YSkgLT5cblxuICBnZXRXaWR0aDogLT5cblxuICBnZXRIZWlnaHQ6IC0+XG5cbiAgc2NhbGVEb3duOiAob3B0cykgLT5cbiAgICB3aWR0aCA9IEBnZXRXaWR0aCgpXG4gICAgaGVpZ2h0ID0gQGdldEhlaWdodCgpXG5cbiAgICByYXRpbyA9IDFcbiAgICBpZiBvcHRzLm1heERpbWVuc2lvbj9cbiAgICAgIG1heFNpZGUgPSBNYXRoLm1heCh3aWR0aCwgaGVpZ2h0KVxuICAgICAgaWYgbWF4U2lkZSA+IG9wdHMubWF4RGltZW5zaW9uXG4gICAgICAgIHJhdGlvID0gb3B0cy5tYXhEaW1lbnNpb24gLyBtYXhTaWRlXG4gICAgZWxzZVxuICAgICAgcmF0aW8gPSAxIC8gb3B0cy5xdWFsaXR5XG5cbiAgICBpZiByYXRpbyA8IDFcbiAgICAgIEByZXNpemUgd2lkdGggKiByYXRpbywgaGVpZ2h0ICogcmF0aW8sIHJhdGlvXG5cbiAgcmVzaXplOiAodywgaCwgcikgLT5cblxuXG4gIGdldFBpeGVsQ291bnQ6IC0+XG5cbiAgZ2V0SW1hZ2VEYXRhOiAtPlxuXG4gIHJlbW92ZUNhbnZhczogLT5cbiIsIlN3YXRjaCA9IHJlcXVpcmUoJy4uL3N3YXRjaCcpXHJcblF1YW50aXplciA9IHJlcXVpcmUoJy4vaW5kZXgnKVxyXG5xdWFudGl6ZSA9IHJlcXVpcmUoJ3F1YW50aXplJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuY2xhc3MgQmFzZWxpbmVRdWFudGl6ZXIgZXh0ZW5kcyBRdWFudGl6ZXJcclxuICBpbml0aWFsaXplOiAocGl4ZWxzLCBAb3B0cykgLT5cclxuICAgIHBpeGVsQ291bnQgPSBwaXhlbHMubGVuZ3RoIC8gNFxyXG4gICAgYWxsUGl4ZWxzID0gW11cclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IHBpeGVsQ291bnRcclxuICAgICAgb2Zmc2V0ID0gaSAqIDRcclxuICAgICAgciA9IHBpeGVsc1tvZmZzZXQgKyAwXVxyXG4gICAgICBnID0gcGl4ZWxzW29mZnNldCArIDFdXHJcbiAgICAgIGIgPSBwaXhlbHNbb2Zmc2V0ICsgMl1cclxuICAgICAgYSA9IHBpeGVsc1tvZmZzZXQgKyAzXVxyXG4gICAgICAjIElmIHBpeGVsIGlzIG1vc3RseSBvcGFxdWUgYW5kIG5vdCB3aGl0ZVxyXG4gICAgICBpZiBhID49IDEyNVxyXG4gICAgICAgIGlmIG5vdCAociA+IDI1MCBhbmQgZyA+IDI1MCBhbmQgYiA+IDI1MClcclxuICAgICAgICAgIGFsbFBpeGVscy5wdXNoIFtyLCBnLCBiXVxyXG4gICAgICBpID0gaSArIEBvcHRzLnF1YWxpdHlcclxuXHJcblxyXG4gICAgY21hcCA9IHF1YW50aXplIGFsbFBpeGVscywgQG9wdHMuY29sb3JDb3VudFxyXG4gICAgQHN3YXRjaGVzID0gY21hcC52Ym94ZXMubWFwICh2Ym94KSA9PlxyXG4gICAgICBuZXcgU3dhdGNoIHZib3guY29sb3IsIHZib3gudmJveC5jb3VudCgpXHJcblxyXG4gIGdldFF1YW50aXplZENvbG9yczogLT5cclxuICAgIEBzd2F0Y2hlc1xyXG4iLCJTd2F0Y2ggPSByZXF1aXJlKCcuLi9zd2F0Y2gnKVxyXG5RdWFudGl6ZXIgPSByZXF1aXJlKCcuL2luZGV4JylcclxuQ29sb3JDdXQgPSByZXF1aXJlKCcuL2ltcGwvY29sb3ItY3V0JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuY2xhc3MgQ29sb3JDdXRRdWFudGl6ZXIgZXh0ZW5kcyBRdWFudGl6ZXJcclxuICBpbml0aWFsaXplOiAocGl4ZWxzLCBAb3B0cykgLT5cclxuICAgIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihwaXhlbHMubGVuZ3RoKVxyXG4gICAgYnVmOCA9IG5ldyBVaW50OENsYW1wZWRBcnJheShidWYpXHJcbiAgICBkYXRhID0gbmV3IFVpbnQzMkFycmF5KGJ1ZilcclxuICAgIGJ1Zjguc2V0KHBpeGVscylcclxuXHJcbiAgICBAcXVhbnRpemVyID0gbmV3IENvbG9yQ3V0KGRhdGEsIEBvcHRzKVxyXG5cclxuXHJcbiAgZ2V0UXVhbnRpemVkQ29sb3JzOiAtPlxyXG4gICAgQHF1YW50aXplci5nZXRRdWFudGl6ZWRDb2xvcnMoKVxyXG4iLCIjIFByaW9yaXR5UXVldWUgPSByZXF1aXJlKCdqcy1wcmlvcml0eS1xdWV1ZScpXHJcblN3YXRjaCA9IHJlcXVpcmUoJy4uLy4uL3N3YXRjaCcpXHJcblxyXG5zb3J0ID0gKGFyciwgbG93ZXIsIHVwcGVyKSAtPlxyXG4gIHN3YXAgPSAoYSwgYikgLT5cclxuICAgIHQgPSBhcnJbYV1cclxuICAgIGFyclthXSA9IGFycltiXVxyXG4gICAgYXJyW2JdID0gdFxyXG5cclxuICBwYXJ0aXRpb24gPSAocGl2b3QsIGxlZnQsIHJpZ2h0KSAtPlxyXG4gICAgaW5kZXggPSBsZWZ0XHJcbiAgICB2YWx1ZSA9IGFycltwaXZvdF1cclxuXHJcbiAgICBzd2FwKHBpdm90LCByaWdodClcclxuXHJcbiAgICBmb3IgdiBpbiBbbGVmdC4ucmlnaHQgLSAxXVxyXG4gICAgICBpZiBhcnJbdl0gPiB2YWx1ZVxyXG4gICAgICAgIHN3YXAodiwgaW5kZXgpXHJcbiAgICAgICAgaW5kZXgrK1xyXG5cclxuICAgIHN3YXAocmlnaHQsIGluZGV4KVxyXG5cclxuICAgIGluZGV4XHJcblxyXG4gIGlmIGxvd2VyIDwgdXBwZXJcclxuICAgIHBpdm90ID0gbG93ZXIgKyBNYXRoLmNlaWwoKHVwcGVyIC0gbG93ZXIpIC8gMilcclxuICAgIHBpdm90ID0gcGFydGl0aW9uKHBpdm90LCBsb3dlciwgdXBwZXIpXHJcblxyXG4gICAgc29ydChhcnIsIGxvd2VyLCBwaXZvdCAtIDEpXHJcbiAgICBzb3J0KGFyciwgcGl2b3QgKyAxLCB1cHBlcilcclxuXHJcblxyXG5DT01QT05FTlRfUkVEICAgICA9IC0zXHJcbkNPTVBPTkVOVF9HUkVFTiAgID0gLTJcclxuQ09NUE9ORU5UX0JMVUUgICAgPSAtMVxyXG5cclxuUVVBTlRJWkVfV09SRF9XSURUSCA9IDVcclxuUVVBTlRJWkVfV09SRF9NQVNLICA9ICgxIDw8IFFVQU5USVpFX1dPUkRfV0lEVEgpIC0gMVxyXG5cclxuIyAzMmJpdCBjb2xvciBvcmRlciBvbiBiaWctZW5kaWFuIG1hY2hpbmVcclxuUkdCQUNvbG9yID1cclxuICByZWQ6IChjKSAtPlxyXG4gICAgYz4+MjRcclxuICBncmVlbjogKGMpIC0+XHJcbiAgICBjPDw4Pj4yNFxyXG4gIGJsdWU6IChjKSAtPlxyXG4gICAgYzw8MTY+PjI0XHJcbiAgYWxwaGE6IChjKSAtPlxyXG4gICAgYzw8MjQ+PjI0XHJcblxyXG4jIDMyYml0IGNvbG9yIG9yZGVyIG9uIGxpdHRsZS1lbmRpYW4gbWFjaGluZVxyXG5BQkdSQ29sb3IgPVxyXG4gIHJlZDogKGMpIC0+XHJcbiAgICBjPDwyND4+MjRcclxuICBncmVlbjogKGMpIC0+XHJcbiAgICBjPDwxNj4+MjRcclxuICBibHVlOiAoYykgLT5cclxuICAgIGM8PDg+PjI0XHJcbiAgYWxwaGE6IChjKSAtPlxyXG4gICAgYz4+MjRcclxuXHJcbmlzTGl0dGxlRW5kaWFuID0gLT5cclxuICBhID0gbmV3IEFycmF5QnVmZmVyKDQpXHJcbiAgYiA9IG5ldyBVaW50OEFycmF5KGEpXHJcbiAgYyA9IG5ldyBVaW50MzJBcnJheShhKVxyXG4gIGJbMF0gPSAweGExXHJcbiAgYlsxXSA9IDB4YjJcclxuICBiWzJdID0gMHhjM1xyXG4gIGJbM10gPSAweGQ0XHJcbiAgaWYgY1swXSA9PSAweGQ0YzNiMmExIHRoZW4gcmV0dXJuIHRydWVcclxuICBpZiBjWzBdID09IDB4YTFiMmMzZDQgdGhlbiByZXR1cm4gZmFsc2VcclxuICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZGV0ZXJtaW4gZW5kaWFubmVzc1wiKVxyXG5cclxuQ29sb3IgPSBpZiBpc0xpdHRsZUVuZGlhbigpIHRoZW4gQUJHUkNvbG9yIGVsc2UgUkdCQUNvbG9yXHJcblxyXG5tb2RpZnlXb3JkV2lkdGggPSAodmFsdWUsIGN1cnJlbnQsIHRhcmdldCkgLT5cclxuICBuZXdWYWx1ZSA9IDBcclxuICBpZiB0YXJnZXQgPiBjdXJyZW50XHJcbiAgICBuZXdWYWx1ZSA9IHZhbHVlIDw8ICh0YXJnZXQgLSBjdXJyZW50KVxyXG4gIGVsc2VcclxuICAgIG5ld1ZhbHVlID0gdmFsdWUgPj4gKGN1cnJlbnQgLSB0YXJnZXQpXHJcblxyXG4gIG5ld1ZhbHVlICYgKCgxPDx0YXJnZXQpIC0gMSlcclxuXHJcbm1vZGlmeVNpZ25pZmljYW50T2N0ZXQgPSAoYSwgZGltZW5zaW9uLCBsb3dlciwgdXBwZXIpIC0+XHJcbiAgc3dpdGNoIGRpbWVuc2lvblxyXG4gICAgd2hlbiBDT01QT05FTlRfUkVEXHJcbiAgICAgIGJyZWFrXHJcbiAgICB3aGVuIENPTVBPTkVOVF9HUkVFTlxyXG4gICAgICAjIFJHQiAtPiBHUkJcclxuICAgICAgZm9yIGkgaW4gW2xvd2VyLi51cHBlcl1cclxuICAgICAgICBjb2xvciA9IGFbaV1cclxuICAgICAgICBhW2ldID0gcXVhbnRpemVkR3JlZW4oY29sb3IpIDw8IChRVUFOVElaRV9XT1JEX1dJRFRIICsgUVVBTlRJWkVfV09SRF9XSURUSCkgXFxcclxuICAgICAgICAgIHwgcXVhbnRpemVkUmVkKGNvbG9yKSA8PCBRVUFOVElaRV9XT1JEX1dJRFRIIFxcXHJcbiAgICAgICAgICB8IHF1YW50aXplZEJsdWUoY29sb3IpXHJcbiAgICAgIGJyZWFrXHJcbiAgICB3aGVuIENPTVBPTkVOVF9CTFVFXHJcbiAgICAgICMgUkdCIC0+IEJHUlxyXG4gICAgICBmb3IgaSBpbiBbbG93ZXIuLnVwcGVyXVxyXG4gICAgICAgIGNvbG9yID0gYVtpXVxyXG4gICAgICAgIGFbaV0gPSBxdWFudGl6ZWRCbHVlKGNvbG9yKSA8PCAoUVVBTlRJWkVfV09SRF9XSURUSCArIFFVQU5USVpFX1dPUkRfV0lEVEgpIFxcXHJcbiAgICAgICAgICB8IHF1YW50aXplZEdyZWVuKGNvbG9yKSA8PCBRVUFOVElaRV9XT1JEX1dJRFRIIFxcXHJcbiAgICAgICAgICB8IHF1YW50aXplZFJlZChjb2xvcilcclxuICAgICAgYnJlYWtcclxuXHJcbiMgUGxhdGZvcm0gZGVwZW5kZW50XHJcbnF1YW50aXplRnJvbVJnYjg4OCA9IChjb2xvcikgLT5cclxuICByID0gbW9kaWZ5V29yZFdpZHRoIENvbG9yLnJlZChjb2xvciksIDgsIFFVQU5USVpFX1dPUkRfV0lEVEhcclxuICBnID0gbW9kaWZ5V29yZFdpZHRoIENvbG9yLmdyZWVuKGNvbG9yKSwgOCwgUVVBTlRJWkVfV09SRF9XSURUSFxyXG4gIGIgPSBtb2RpZnlXb3JkV2lkdGggQ29sb3IuYmx1ZShjb2xvciksIDgsIFFVQU5USVpFX1dPUkRfV0lEVEhcclxuXHJcbiAgcjw8KFFVQU5USVpFX1dPUkRfV0lEVEgrUVVBTlRJWkVfV09SRF9XSURUSCl8Zzw8UVVBTlRJWkVfV09SRF9XSURUSHxiXHJcblxyXG5hcHByb3hpbWF0ZVRvUmdiODg4ID0gKHIsIGcsIGIpIC0+XHJcbiAgaWYgbm90IChnPyBhbmQgYj8pXHJcbiAgICBjb2xvciA9IHJcclxuICAgIHIgPSBxdWFudGl6ZWRSZWQoY29sb3IpXHJcbiAgICBnID0gcXVhbnRpemVkR3JlZW4oY29sb3IpXHJcbiAgICBiID0gcXVhbnRpemVkQmx1ZShjb2xvcilcclxuICBbXHJcbiAgICBtb2RpZnlXb3JkV2lkdGgociwgUVVBTlRJWkVfV09SRF9XSURUSCwgOClcclxuICAgIG1vZGlmeVdvcmRXaWR0aChnLCBRVUFOVElaRV9XT1JEX1dJRFRILCA4KVxyXG4gICAgbW9kaWZ5V29yZFdpZHRoKGIsIFFVQU5USVpFX1dPUkRfV0lEVEgsIDgpXHJcbiAgXVxyXG5cclxucXVhbnRpemVkUmVkID0gKGNvbG9yKSAtPlxyXG4gIGNvbG9yID4+IChRVUFOVElaRV9XT1JEX1dJRFRIICsgUVVBTlRJWkVfV09SRF9XSURUSCkgJiBRVUFOVElaRV9XT1JEX01BU0tcclxuXHJcbnF1YW50aXplZEdyZWVuID0gKGNvbG9yKSAtPlxyXG4gIGNvbG9yID4+IFFVQU5USVpFX1dPUkRfV0lEVEggJiBRVUFOVElaRV9XT1JEX01BU0tcclxuXHJcbnF1YW50aXplZEJsdWUgPSAoY29sb3IpIC0+XHJcbiAgY29sb3IgJiBRVUFOVElaRV9XT1JEX01BU0tcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbmNsYXNzIENvbG9yQ3V0UXVhbnRpemVyXHJcbiAgY29uc3RydWN0b3I6IChkYXRhLCBAb3B0cykgLT5cclxuICAgIEBoaXN0ID0gbmV3IFVpbnQzMkFycmF5KDEgPDwgKFFVQU5USVpFX1dPUkRfV0lEVEggKiAzKSlcclxuICAgIEBwaXhlbHMgPSBuZXcgVWludDMyQXJyYXkoZGF0YS5sZW5ndGgpXHJcbiAgICBmb3IgaSBpbiBbMC4uZGF0YS5sZW5ndGggLSAxXVxyXG4gICAgICBAcGl4ZWxzW2ldID0gcXVhbnRpemVkQ29sb3IgPSBxdWFudGl6ZUZyb21SZ2I4ODggZGF0YVtpXVxyXG4gICAgICBAaGlzdFtxdWFudGl6ZWRDb2xvcl0rK1xyXG5cclxuICAgIGRpc3RpbmN0Q29sb3JDb3VudCA9IDBcclxuXHJcbiAgICBmb3IgY29sb3IgaW4gWzAuLkBoaXN0Lmxlbmd0aCAtIDFdXHJcbiAgICAgICMgVE9ETzogYXBwbHkgZmlsdGVyc1xyXG4gICAgICAjIGlmIEBoaXN0W2NvbG9yXSA+IDAgYW5kIEBzaG91bGRJZ25vcmVDb2xvcihjb2xvcilcclxuICAgICAgIyAgIEBoaXN0W2NvbG9yXSA9IDBcclxuICAgICAgaWYgQGhpc3RbY29sb3JdID4gMFxyXG4gICAgICAgIGRpc3RpbmN0Q29sb3JDb3VudCsrXHJcblxyXG4gICAgQGNvbG9ycyA9IG5ldyBVaW50MzJBcnJheShkaXN0aW5jdENvbG9yQ291bnQpXHJcbiAgICBkaXN0aW5jdENvbG9ySW5kZXggPSAwXHJcblxyXG4gICAgZm9yIGNvbG9yIGluIFswLi5AaGlzdC5sZW5ndGggLSAxXVxyXG4gICAgICBpZiBAaGlzdFtjb2xvcl0gPiAwXHJcbiAgICAgICAgQGNvbG9yc1tkaXN0aW5jdENvbG9ySW5kZXgrK10gPSBjb2xvclxyXG5cclxuICAgIGlmIGRpc3RpbmN0Q29sb3JDb3VudCA8PSBAb3B0cy5jb2xvckNvdW50XHJcbiAgICAgIEBxdWFudGl6ZWRDb2xvcnMgPSBbXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uQGNvbG9ycy5sZW5ndGgtMV1cclxuICAgICAgICBjID0gQGNvbG9yc1tpXVxyXG4gICAgICAgIEBxdWFudGl6ZWRDb2xvcnMucHVzaCBuZXcgU3dhdGNoIGFwcHJveGltYXRlVG9SZ2I4ODgoYyksIEBoaXN0W2NdXHJcbiAgICBlbHNlXHJcbiAgICAgIEBxdWFudGl6ZWRDb2xvcnMgPSBAcXVhbnRpemVQaXhlbHMoQG9wdHMuY29sb3JDb3VudClcclxuXHJcbiAgZ2V0UXVhbnRpemVkQ29sb3JzOiAtPlxyXG4gICAgQHF1YW50aXplZENvbG9yc1xyXG5cclxuICBxdWFudGl6ZVBpeGVsczogKG1heENvbG9ycykgLT5cclxuICAgICMgLy8gQ3JlYXRlIHRoZSBwcmlvcml0eSBxdWV1ZSB3aGljaCBpcyBzb3J0ZWQgYnkgdm9sdW1lIGRlc2NlbmRpbmcuIFRoaXMgbWVhbnMgd2UgYWx3YXlzXHJcbiAgICAjIC8vIHNwbGl0IHRoZSBsYXJnZXN0IGJveCBpbiB0aGUgcXVldWVcclxuICAgICMgZmluYWwgUHJpb3JpdHlRdWV1ZTxWYm94PiBwcSA9IG5ldyBQcmlvcml0eVF1ZXVlPD4obWF4Q29sb3JzLCBWQk9YX0NPTVBBUkFUT1JfVk9MVU1FKTtcclxuICAgIHBxID0gbmV3IFByaW9yaXR5UXVldWUoY29tcGFyYXRvcjogVmJveC5jb21wYXJhdG9yKVxyXG5cclxuICAgICMgLy8gVG8gc3RhcnQsIG9mZmVyIGEgYm94IHdoaWNoIGNvbnRhaW5zIGFsbCBvZiB0aGUgY29sb3JzXHJcbiAgICAjIHBxLm9mZmVyKG5ldyBWYm94KDAsIG1Db2xvcnMubGVuZ3RoIC0gMSkpO1xyXG4gICAgcHEucXVldWUobmV3IFZib3goQGNvbG9ycywgQGhpc3QsIDAsIEBjb2xvcnMubGVuZ3RoIC0gMSkpXHJcbiAgICAjXHJcbiAgICAjIC8vIE5vdyBnbyB0aHJvdWdoIHRoZSBib3hlcywgc3BsaXR0aW5nIHRoZW0gdW50aWwgd2UgaGF2ZSByZWFjaGVkIG1heENvbG9ycyBvciB0aGVyZSBhcmUgbm9cclxuICAgICMgLy8gbW9yZSBib3hlcyB0byBzcGxpdFxyXG4gICAgIyBzcGxpdEJveGVzKHBxLCBtYXhDb2xvcnMpO1xyXG4gICAgQHNwbGl0Qm94ZXMocHEsIG1heENvbG9ycylcclxuICAgICNcclxuICAgICMgLy8gRmluYWxseSwgcmV0dXJuIHRoZSBhdmVyYWdlIGNvbG9ycyBvZiB0aGUgY29sb3IgYlxyXG4gICAgQGdlbmVyYXRlQXZlcmFnZUNvbG9ycyhwcSlcclxuXHJcbiAgc3BsaXRCb3hlczogKHF1ZXVlLCBtYXhTaXplKSAtPlxyXG4gICAgd2hpbGUgcXVldWUubGVuZ3RoIDwgbWF4U2l6ZVxyXG4gICAgICB2Ym94ID0gcXVldWUuZGVxdWV1ZSgpXHJcblxyXG4gICAgICBpZiB2Ym94Py5jYW5TcGxpdCgpXHJcbiAgICAgICAgcXVldWUucXVldWUgdmJveC5zcGxpdEJveCgpXHJcbiAgICAgICAgcXVldWUucXVldWUgdmJveFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gIGdlbmVyYXRlQXZlcmFnZUNvbG9yczogKHZib3hlcykgLT5cclxuICAgIGNvbG9ycyA9IFtdXHJcblxyXG4gICAgd2hpbGUgdmJveGVzLmxlbmd0aCA+IDBcclxuICAgICAgY29sb3JzLnB1c2ggdmJveGVzLmRlcXVldWUoKS5nZXRBdmVyYWdlQ29sb3IoKVxyXG4gICAgIyBjb2xvcnMgPSBbXVxyXG4gICAgI1xyXG4gICAgIyB2Ym94ZXMuZm9yRWFjaCAodmJveCkgPT5cclxuICAgICMgICBzd2F0Y2ggPSB2Ym94LmdldEF2ZXJhZ2VDb2xvcigpXHJcbiAgICAjICAgaWYgbm90IEBzaG91bGRJZ25vcmVDb2xvclxyXG4gICAgIyAgICAgY29sb3JzLnB1c2ggc3dhdGNoXHJcblxyXG4gICAgY29sb3JzXHJcblxyXG5jbGFzcyBWYm94XHJcbiAgQGNvbXBhcmF0b3I6IChsaHMsIHJocykgLT5cclxuICAgIGxocy5nZXRWb2x1bWUoKSAtIHJocy5nZXRWb2x1bWUoKVxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBjb2xvcnMsIEBoaXN0LCBAbG93ZXJJbmRleCwgQHVwcGVySW5kZXgpIC0+XHJcbiAgICBAZml0Qm94KClcclxuXHJcbiAgZ2V0Vm9sdW1lOiAtPlxyXG4gICAgKEBtYXhSZWQgLSBAbWluUmVkICsgMSkgKiAoQG1heEdyZWVuIC0gQG1pbkdyZWVuICsgMSkgKiAoQG1heEJsdWUgLSBAbWluQmx1ZSArIDEpXHJcblxyXG4gIGNhblNwbGl0OiAtPlxyXG4gICAgQGdldENvbG9yQ291bnQoKSA+IDFcclxuXHJcbiAgZ2V0Q29sb3JDb3VudDogLT5cclxuICAgIDEgKyBAdXBwZXJJbmRleCAtIEBsb3dlckluZGV4XHJcblxyXG4gIGZpdEJveDogLT5cclxuICAgIEBtaW5SZWQgPSBAbWluR3JlZW4gPSBAbWluQmx1ZSA9IE51bWJlci5NQVhfVkFMVUVcclxuICAgIEBtYXhSZWQgPSBAbWF4R3JlZW4gPSBAbWF4Qmx1ZSA9IE51bWJlci5NSU5fVkFMVUVcclxuICAgIEBwb3B1bGF0aW9uID0gMFxyXG4gICAgY291bnQgPSAwXHJcbiAgICBmb3IgaSBpbiBbQGxvd2VySW5kZXguLkB1cHBlckluZGV4XVxyXG4gICAgICBjb2xvciA9IEBjb2xvcnNbaV1cclxuICAgICAgY291bnQgKz0gQGhpc3RbY29sb3JdXHJcblxyXG4gICAgICByID0gcXVhbnRpemVkUmVkIGNvbG9yXHJcbiAgICAgIGcgPSBxdWFudGl6ZWRHcmVlbiBjb2xvclxyXG4gICAgICBiID0gcXVhbnRpemVkQmx1ZSBjb2xvclxyXG5cclxuICAgICAgaWYgciA+IEBtYXhSZWQgdGhlbiBAbWF4UmVkID0gclxyXG4gICAgICBpZiByIDwgQG1pblJlZCB0aGVuIEBtaW5SZWQgPSByXHJcbiAgICAgIGlmIGcgPiBAbWF4R3JlZW4gdGhlbiBAbWF4R3JlZW4gPSBnXHJcbiAgICAgIGlmIGcgPCBAbWluR3JlZW4gdGhlbiBAbWluR3JlZW4gPSBnXHJcbiAgICAgIGlmIGIgPiBAbWF4Qmx1ZSB0aGVuIEBtYXhSZWQgPSBiXHJcbiAgICAgIGlmIGIgPCBAbWluQmx1ZSB0aGVuIEBtaW5SZWQgPSBiXHJcblxyXG4gICAgQHBvcHVsYXRpb24gPSBjb3VudFxyXG5cclxuICBzcGxpdEJveDogLT5cclxuICAgIGlmIG5vdCBAY2FuU3BsaXQoKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgc3BsaXQgYSBib3ggd2l0aCBvbmx5IDEgY29sb3JcIilcclxuXHJcbiAgICBzcGxpdFBvaW50ID0gQGZpbmRTcGxpdFBvaW50KClcclxuXHJcbiAgICBuZXdCb3ggPSBuZXcgVmJveChAY29sb3JzLCBAaGlzdCwgc3BsaXRQb2ludCArIDEsIEB1cHBlckluZGV4KVxyXG5cclxuICAgICMgTm93IGNoYW5nZSB0aGlzIGJveCdzIHVwcGVySW5kZXggYW5kIHJlY29tcHV0ZSB0aGUgY29sb3IgYm91bmRhcmllc1xyXG4gICAgQHVwcGVySW5kZXggPSBzcGxpdFBvaW50XHJcbiAgICBAZml0Qm94KClcclxuXHJcbiAgICBuZXdCb3hcclxuXHJcbiAgZ2V0TG9uZ2VzdENvbG9yRGltZW5zaW9uOiAtPlxyXG4gICAgcmVkTGVuZ3RoID0gQG1heFJlZCAtIEBtaW5SZWRcclxuICAgIGdyZWVuTGVuZ3RoID0gQG1heEdyZWVuIC0gQG1pbkdyZWVuXHJcbiAgICBibHVlTGVuZ3RoID0gQG1heEJsdWUgLSBAbWluQmx1ZVxyXG5cclxuICAgIGlmIHJlZExlbmd0aCA+PSBncmVlbkxlbmd0aCBhbmQgcmVkTGVuZ3RoID49IGJsdWVMZW5ndGhcclxuICAgICAgcmV0dXJuIENPTVBPTkVOVF9SRURcclxuICAgIGlmIGdyZWVuTGVuZ3RoID49IHJlZExlbmd0aCBhbmQgZ3JlZW5MZW5ndGggPj0gYmx1ZUxlbmd0aFxyXG4gICAgICByZXR1cm4gQ09NUE9ORU5UX0dSRUVOXHJcbiAgICByZXR1cm4gQ09NUE9ORU5UX0JMVUVcclxuXHJcbiAgZmluZFNwbGl0UG9pbnQ6IC0+XHJcbiAgICBsb25nZXN0RGltZW5zaW9uID0gQGdldExvbmdlc3RDb2xvckRpbWVuc2lvbigpXHJcblxyXG4gICAgbW9kaWZ5U2lnbmlmaWNhbnRPY3RldCBAY29sb3JzLCBsb25nZXN0RGltZW5zaW9uLCBAbG93ZXJJbmRleCwgQHVwcGVySW5kZXhcclxuXHJcbiAgICAjIC8vIE5vdyBzb3J0Li4uIEFycmF5cy5zb3J0IHVzZXMgYSBleGNsdXNpdmUgdG9JbmRleCBzbyB3ZSBuZWVkIHRvIGFkZCAxXHJcbiAgICAjIEFycmF5cy5zb3J0KGNvbG9ycywgbUxvd2VySW5kZXgsIG1VcHBlckluZGV4ICsgMSk7XHJcbiAgICBzb3J0IEBjb2xvcnMsIEBsb3dlckluZGV4LCBAdXBwZXJJbmRleCArIDFcclxuXHJcbiAgICBtb2RpZnlTaWduaWZpY2FudE9jdGV0IEBjb2xvcnMsIGxvbmdlc3REaW1lbnNpb24sIEBsb3dlckluZGV4LCBAdXBwZXJJbmRleFxyXG5cclxuICAgIG1pZFBvaW50ID0gQHBvcHVsYXRpb24gLyAyXHJcblxyXG4gICAgY291bnQgPSAwXHJcbiAgICBmb3IgaSBpbiBbQGxvd2VySW5kZXguLkB1cHBlckluZGV4XVxyXG4gICAgICBjb3VudCArPSBAaGlzdFtAY29sb3JzW2ldXVxyXG4gICAgICBpZiBjb3VudCA+PSBtaWRQb2ludFxyXG4gICAgICAgIHJldHVybiBpXHJcblxyXG4gICAgcmV0dXJuIEBsb3dlckluZGV4XHJcblxyXG4gIGdldEF2ZXJhZ2VDb2xvcjogLT5cclxuICAgIHJlZFN1bSA9IGdyZWVuU3VtID0gYmx1ZVN1bSA9IDBcclxuICAgIHRvdGFsUG9wdWxhdGlvbiA9IDBcclxuXHJcbiAgICBmb3IgaSBpbiBbQGxvd2VySW5kZXguLkB1cHBlckluZGV4XVxyXG4gICAgICBjb2xvciA9IEBjb2xvcnNbaV1cclxuICAgICAgY29sb3JQb3B1bGF0aW9uID0gQGhpc3RbY29sb3JdXHJcblxyXG4gICAgICB0b3RhbFBvcHVsYXRpb24gKz0gY29sb3JQb3B1bGF0aW9uXHJcblxyXG4gICAgICByZWRTdW0gKz0gY29sb3JQb3B1bGF0aW9uICogcXVhbnRpemVkUmVkKGNvbG9yKVxyXG4gICAgICBncmVlblN1bSArPSBjb2xvclBvcHVsYXRpb24gKiBxdWFudGl6ZWRHcmVlbihjb2xvcilcclxuICAgICAgYmx1ZVN1bSArPSBjb2xvclBvcHVsYXRpb24gKiBxdWFudGl6ZWRCbHVlKGNvbG9yKVxyXG5cclxuICAgIHJlZE1lYW4gPSBNYXRoLnJvdW5kIHJlZFN1bSAvIHRvdGFsUG9wdWxhdGlvblxyXG4gICAgZ3JlZW5NZWFuID0gTWF0aC5yb3VuZCBncmVlblN1bSAvIHRvdGFsUG9wdWxhdGlvblxyXG4gICAgYmx1ZU1lYW4gPSBNYXRoLnJvdW5kIGJsdWVTdW0gLyB0b3RhbFBvcHVsYXRpb25cclxuXHJcbiAgICByZXR1cm4gbmV3IFN3YXRjaChhcHByb3hpbWF0ZVRvUmdiODg4KHJlZE1lYW4sIGdyZWVuTWVhbiwgYmx1ZU1lYW4pLCB0b3RhbFBvcHVsYXRpb24pXHJcbiIsIiMgU0lHQklUUyA9IDVcclxuIyBSU0hJRlQgPSA4IC0gU0lHQklUU1xyXG4jXHJcbiMgZ2V0Q29sb3JJbmRleCA9IChyLCBnLCBiKSAtPlxyXG4jICAgKHI8PCgyKlNJR0JJVFMpKSArIChnIDw8IFNJR0JJVFMpICsgYlxyXG5cclxue2dldENvbG9ySW5kZXgsIFNJR0JJVFMsIFJTSElGVH0gPSB1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXHJcblN3YXRjaCA9IHJlcXVpcmUoJy4uLy4uL3N3YXRjaCcpXHJcblZCb3ggPSByZXF1aXJlKCcuL3Zib3gnKVxyXG5QUXVldWUgPSByZXF1aXJlKCcuL3BxdWV1ZScpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbmNsYXNzIE1NQ1FcclxuICBARGVmYXVsdE9wdHM6XHJcbiAgICBtYXhJdGVyYXRpb25zOiAxMDAwXHJcbiAgICBmcmFjdEJ5UG9wdWxhdGlvbnM6IDAuNzVcclxuXHJcbiAgY29uc3RydWN0b3I6IChvcHRzKSAtPlxyXG4gICAgQG9wdHMgPSB1dGlsLmRlZmF1bHRzIG9wdHMsIEBjb25zdHJ1Y3Rvci5EZWZhdWx0T3B0c1xyXG4gIHF1YW50aXplOiAocGl4ZWxzLCBvcHRzKSAtPlxyXG4gICAgaWYgcGl4ZWxzLmxlbmd0aCA9PSAwIG9yIG9wdHMuY29sb3JDb3VudCA8IDIgb3Igb3B0cy5jb2xvckNvdW50ID4gMjU2XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIE1NQ1EgcGFyYW1ldGVyc1wiKVxyXG5cclxuICAgIHNob3VsZElnbm9yZSA9IC0+IGZhbHNlXHJcblxyXG4gICAgaWYgQXJyYXkuaXNBcnJheShvcHRzLmZpbHRlcnMpIGFuZCBvcHRzLmZpbHRlcnMubGVuZ3RoID4gMFxyXG4gICAgICBzaG91bGRJZ25vcmUgPSAociwgZywgYiwgYSkgLT5cclxuICAgICAgICBmb3IgZiBpbiBvcHRzLmZpbHRlcnNcclxuICAgICAgICAgIGlmIG5vdCBmKHIsIGcsIGIsIGEpIHRoZW4gcmV0dXJuIHRydWVcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcblxyXG4gICAgdmJveCA9IFZCb3guYnVpbGQocGl4ZWxzLCBzaG91bGRJZ25vcmUpXHJcbiAgICBoaXN0ID0gdmJveC5oaXN0XHJcbiAgICBjb2xvckNvdW50ID0gT2JqZWN0LmtleXMoaGlzdCkubGVuZ3RoXHJcbiAgICBwcSA9IG5ldyBQUXVldWUgKGEsIGIpIC0+IGEuY291bnQoKSAtIGIuY291bnQoKVxyXG5cclxuICAgIHBxLnB1c2godmJveClcclxuXHJcbiAgICAjIGZpcnN0IHNldCBvZiBjb2xvcnMsIHNvcnRlZCBieSBwb3B1bGF0aW9uXHJcbiAgICBAX3NwbGl0Qm94ZXMocHEsIEBvcHRzLmZyYWN0QnlQb3B1bGF0aW9ucyAqIG9wdHMuY29sb3JDb3VudClcclxuXHJcbiAgICAjIFJlLW9yZGVyXHJcbiAgICBwcTIgPSBuZXcgUFF1ZXVlIChhLCBiKSAtPiBhLmNvdW50KCkgKiBhLnZvbHVtZSgpIC0gYi5jb3VudCgpICogYi52b2x1bWUoKVxyXG4gICAgcHEyLmNvbnRlbnRzID0gcHEuY29udGVudHNcclxuXHJcbiAgICAjIG5leHQgc2V0IC0gZ2VuZXJhdGUgdGhlIG1lZGlhbiBjdXRzIHVzaW5nIHRoZSAobnBpeCAqIHZvbCkgc29ydGluZy5cclxuICAgIEBfc3BsaXRCb3hlcyhwcTIsIG9wdHMuY29sb3JDb3VudCAtIHBxMi5zaXplKCkpXHJcblxyXG4gICAgIyBjYWxjdWxhdGUgdGhlIGFjdHVhbCBjb2xvcnNcclxuICAgIHN3YXRjaGVzID0gW11cclxuICAgIEB2Ym94ZXMgPSBbXVxyXG4gICAgd2hpbGUgcHEyLnNpemUoKVxyXG4gICAgICB2ID0gcHEyLnBvcCgpXHJcbiAgICAgIGNvbG9yID0gdi5hdmcoKVxyXG4gICAgICBpZiBub3Qgc2hvdWxkSWdub3JlPyhjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCAyNTUpXHJcbiAgICAgICAgQHZib3hlcy5wdXNoIHZcclxuICAgICAgICBzd2F0Y2hlcy5wdXNoIG5ldyBTd2F0Y2ggY29sb3IsIHYuY291bnQoKVxyXG5cclxuICAgIHN3YXRjaGVzXHJcblxyXG4gIF9zcGxpdEJveGVzOiAocHEsIHRhcmdldCkgLT5cclxuICAgIGNvbG9yQ291bnQgPSAxXHJcbiAgICBpdGVyYXRpb24gPSAwXHJcbiAgICBtYXhJdGVyYXRpb25zID0gQG9wdHMubWF4SXRlcmF0aW9uc1xyXG4gICAgd2hpbGUgaXRlcmF0aW9uIDwgbWF4SXRlcmF0aW9uc1xyXG4gICAgICBpdGVyYXRpb24rK1xyXG4gICAgICB2Ym94ID0gcHEucG9wKClcclxuICAgICAgaWYgIXZib3guY291bnQoKVxyXG4gICAgICAgIGNvbnRpbnVlXHJcblxyXG4gICAgICBbdmJveDEsIHZib3gyXSA9IHZib3guc3BsaXQoKVxyXG5cclxuICAgICAgcHEucHVzaCh2Ym94MSlcclxuICAgICAgaWYgdmJveDJcclxuICAgICAgICBwcS5wdXNoKHZib3gyKVxyXG4gICAgICAgIGNvbG9yQ291bnQrK1xyXG4gICAgICBpZiBjb2xvckNvdW50ID49IHRhcmdldCBvciBpdGVyYXRpb24gPiBtYXhJdGVyYXRpb25zXHJcbiAgICAgICAgcmV0dXJuXHJcbiIsIm1vZHVsZS5leHBvcnRzID1cclxuY2xhc3MgUFF1ZXVlXHJcbiAgY29uc3RydWN0b3I6IChAY29tcGFyYXRvcikgLT5cclxuICAgIEBjb250ZW50cyA9IFtdXHJcbiAgICBAc29ydGVkID0gZmFsc2VcclxuXHJcbiAgX3NvcnQ6IC0+XHJcbiAgICBAY29udGVudHMuc29ydChAY29tcGFyYXRvcilcclxuICAgIEBzb3J0ZWQgPSB0cnVlXHJcblxyXG4gIHB1c2g6IChvKSAtPlxyXG4gICAgQGNvbnRlbnRzLnB1c2ggb1xyXG4gICAgQHNvcnRlZCA9IGZhbHNlXHJcblxyXG4gIHBlZWs6IChpbmRleCkgLT5cclxuICAgIGlmIG5vdCBAc29ydGVkXHJcbiAgICAgIEBfc29ydCgpXHJcbiAgICBpbmRleCA/PSBAY29udGVudHMubGVuZ3RoIC0gMVxyXG4gICAgQGNvbnRlbnRzW2luZGV4XVxyXG5cclxuICBwb3A6IC0+XHJcbiAgICBpZiBub3QgQHNvcnRlZFxyXG4gICAgICBAX3NvcnQoKVxyXG4gICAgQGNvbnRlbnRzLnBvcCgpXHJcblxyXG4gIHNpemU6IC0+XHJcbiAgICBAY29udGVudHMubGVuZ3RoXHJcblxyXG4gIG1hcDogKGYpIC0+XHJcbiAgICBpZiBub3QgQHNvcnRlZFxyXG4gICAgICBAX3NvcnQoKVxyXG4gICAgQGNvbnRlbnRzLm1hcChmKVxyXG4iLCJ7Z2V0Q29sb3JJbmRleCwgU0lHQklUUywgUlNISUZUfSA9IHV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlsJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuY2xhc3MgVkJveFxyXG4gIEBidWlsZDogKHBpeGVscywgc2hvdWxkSWdub3JlKSAtPlxyXG4gICAgaG4gPSAxPDwoMypTSUdCSVRTKVxyXG4gICAgaGlzdCA9IG5ldyBVaW50MzJBcnJheShobilcclxuICAgIHJtYXggPSBnbWF4ID0gYm1heCA9IDBcclxuICAgIHJtaW4gPSBnbWluID0gYm1pbiA9IE51bWJlci5NQVhfVkFMVUVcclxuICAgIG4gPSBwaXhlbHMubGVuZ3RoIC8gNFxyXG4gICAgaSA9IDBcclxuXHJcbiAgICB3aGlsZSBpIDwgblxyXG4gICAgICBvZmZzZXQgPSBpICogNFxyXG4gICAgICBpKytcclxuICAgICAgciA9IHBpeGVsc1tvZmZzZXQgKyAwXVxyXG4gICAgICBnID0gcGl4ZWxzW29mZnNldCArIDFdXHJcbiAgICAgIGIgPSBwaXhlbHNbb2Zmc2V0ICsgMl1cclxuICAgICAgYSA9IHBpeGVsc1tvZmZzZXQgKyAzXVxyXG4gICAgICAjIFRPRE86IHVzZSByZXN1bHQgZnJvbSBoaXN0XHJcbiAgICAgIGlmIHNob3VsZElnbm9yZShyLCBnLCBiLCBhKSB0aGVuIGNvbnRpbnVlXHJcblxyXG4gICAgICByID0gciA+PiBSU0hJRlRcclxuICAgICAgZyA9IGcgPj4gUlNISUZUXHJcbiAgICAgIGIgPSBiID4+IFJTSElGVFxyXG5cclxuXHJcbiAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChyLCBnLCBiKVxyXG4gICAgICBoaXN0W2luZGV4XSArPSAxXHJcblxyXG4gICAgICBpZiByID4gcm1heFxyXG4gICAgICAgIHJtYXggPSByXHJcbiAgICAgIGlmIHIgPCBybWluXHJcbiAgICAgICAgcm1pbiA9IHJcclxuICAgICAgaWYgZyA+IGdtYXhcclxuICAgICAgICBnbWF4ID0gZ1xyXG4gICAgICBpZiBnIDwgZ21pblxyXG4gICAgICAgIGdtaW4gPSBnXHJcbiAgICAgIGlmIGIgPiBibWF4XHJcbiAgICAgICAgYm1heCA9IGJcclxuICAgICAgaWYgYiA8IGJtaW5cclxuICAgICAgICBibWluID0gYlxyXG5cclxuICAgIG5ldyBWQm94KHJtaW4sIHJtYXgsIGdtaW4sIGdtYXgsIGJtaW4sIGJtYXgsIGhpc3QpXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQHIxLCBAcjIsIEBnMSwgQGcyLCBAYjEsIEBiMiwgQGhpc3QpIC0+XHJcbiAgICAjIEBfaW5pdEJveCgpXHJcblxyXG4gIGludmFsaWRhdGU6IC0+XHJcbiAgICBkZWxldGUgQF9jb3VudFxyXG4gICAgZGVsZXRlIEBfYXZnXHJcbiAgICBkZWxldGUgQF92b2x1bWVcclxuXHJcbiAgdm9sdW1lOiAtPlxyXG4gICAgaWYgbm90IEBfdm9sdW1lP1xyXG4gICAgICBAX3ZvbHVtZSA9IChAcjIgLSBAcjEgKyAxKSAqIChAZzIgLSBAZzEgKyAxKSAqIChAYjIgLSBAYjEgKyAxKVxyXG4gICAgQF92b2x1bWVcclxuXHJcbiAgY291bnQ6IC0+XHJcbiAgICBpZiBub3QgQF9jb3VudD9cclxuICAgICAgaGlzdCA9IEBoaXN0XHJcbiAgICAgIGMgPSAwXHJcbiAgICAgIGBcclxuICAgICAgZm9yICh2YXIgciA9IHRoaXMucjE7IHIgPD0gdGhpcy5yMjsgcisrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgZyA9IHRoaXMuZzE7IGcgPD0gdGhpcy5nMjsgZysrKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBiID0gdGhpcy5iMTsgYiA8PSB0aGlzLmIyOyBiKyspIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gZ2V0Q29sb3JJbmRleChyLCBnLCBiKTtcclxuICAgICAgICAgICAgYyArPSBoaXN0W2luZGV4XTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgYFxyXG4gICAgICAjIGZvciByIGluIFtAcjEuLkByMl1cclxuICAgICAgIyAgIGZvciBnIGluIFtAZzEuLkBnMl1cclxuICAgICAgIyAgICAgZm9yIGIgaW4gW0BiMS4uQGIyXVxyXG4gICAgICAjICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChyLCBnLCBiKVxyXG4gICAgICAjICAgICAgIGMgKz0gaGlzdFtpbmRleF1cclxuICAgICAgQF9jb3VudCA9IGNcclxuICAgIEBfY291bnRcclxuXHJcbiAgY2xvbmU6IC0+XHJcbiAgICBuZXcgVkJveChAcjEsIEByMiwgQGcxLCBAZzIsIEBiMSwgQGIyLCBAaGlzdClcclxuXHJcbiAgYXZnOiAtPlxyXG4gICAgaWYgbm90IEBfYXZnP1xyXG4gICAgICBoaXN0ID0gQGhpc3RcclxuICAgICAgbnRvdCA9IDBcclxuICAgICAgbXVsdCA9IDEgPDwgKDggLSBTSUdCSVRTKVxyXG4gICAgICByc3VtID0gZ3N1bSA9IGJzdW0gPSAwXHJcbiAgICAgIGBcclxuICAgICAgZm9yICh2YXIgciA9IHRoaXMucjE7IHIgPD0gdGhpcy5yMjsgcisrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgZyA9IHRoaXMuZzE7IGcgPD0gdGhpcy5nMjsgZysrKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBiID0gdGhpcy5iMTsgYiA8PSB0aGlzLmIyOyBiKyspIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gZ2V0Q29sb3JJbmRleChyLCBnLCBiKTtcclxuICAgICAgICAgICAgdmFyIGggPSBoaXN0W2luZGV4XTtcclxuICAgICAgICAgICAgbnRvdCArPSBoO1xyXG4gICAgICAgICAgICByc3VtICs9IChoICogKHIgKyAwLjUpICogbXVsdCk7XHJcbiAgICAgICAgICAgIGdzdW0gKz0gKGggKiAoZyArIDAuNSkgKiBtdWx0KTtcclxuICAgICAgICAgICAgYnN1bSArPSAoaCAqIChiICsgMC41KSAqIG11bHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBgXHJcbiAgICAgICMgTk9URTogQ29mZmVlU2NyaXB0IHdpbGwgc2NyZXcgdGhpbmdzIHVwIHdoZW4gQHIxID4gQHIyXHJcbiAgICAgICMgZm9yIHIgaW4gW0ByMS4uQHIyXVxyXG4gICAgICAjICAgZm9yIGcgaW4gW0BnMS4uQGcyXVxyXG4gICAgICAjICAgICBmb3IgYiBpbiBbQGIxLi5AYjJdXHJcbiAgICAgICMgICAgICAgaW5kZXggPSBnZXRDb2xvckluZGV4KHIsIGcsIGIpXHJcbiAgICAgICMgICAgICAgaCA9IGhpc3RbaW5kZXhdXHJcbiAgICAgICMgICAgICAgbnRvdCArPSBoXHJcbiAgICAgICMgICAgICAgcnN1bSArPSAoaCAqIChyICsgMC41KSAqIG11bHQpXHJcbiAgICAgICMgICAgICAgZ3N1bSArPSAoaCAqIChnICsgMC41KSAqIG11bHQpXHJcbiAgICAgICMgICAgICAgYnN1bSArPSAoaCAqIChiICsgMC41KSAqIG11bHQpXHJcblxyXG4gICAgICBpZiBudG90XHJcbiAgICAgICAgQF9hdmcgPSBbXHJcbiAgICAgICAgICB+fihyc3VtIC8gbnRvdClcclxuICAgICAgICAgIH5+KGdzdW0gLyBudG90KVxyXG4gICAgICAgICAgfn4oYnN1bSAvIG50b3QpXHJcbiAgICAgICAgXVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQF9hdmcgPSBbXHJcbiAgICAgICAgICB+fihtdWx0ICogKEByMSArIEByMiArIDEpIC8gMilcclxuICAgICAgICAgIH5+KG11bHQgKiAoQGcxICsgQGcyICsgMSkgLyAyKVxyXG4gICAgICAgICAgfn4obXVsdCAqIChAYjEgKyBAYjIgKyAxKSAvIDIpXHJcbiAgICAgICAgXVxyXG4gICAgQF9hdmdcclxuXHJcbiAgc3BsaXQ6IC0+XHJcbiAgICBoaXN0ID0gQGhpc3RcclxuICAgIGlmICFAY291bnQoKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgaWYgQGNvdW50KCkgPT0gMVxyXG4gICAgICByZXR1cm4gW0BjbG9uZSgpXVxyXG5cclxuICAgIHJ3ID0gQHIyIC0gQHIxICsgMVxyXG4gICAgZ3cgPSBAZzIgLSBAZzEgKyAxXHJcbiAgICBidyA9IEBiMiAtIEBiMSArIDFcclxuXHJcbiAgICBtYXh3ID0gTWF0aC5tYXgocncsIGd3LCBidylcclxuICAgIGFjY1N1bSA9IG51bGxcclxuICAgIHN1bSA9IHRvdGFsID0gMFxyXG5cclxuICAgIG1heGQgPSBudWxsXHJcbiAgICBzd2l0Y2ggbWF4d1xyXG4gICAgICB3aGVuIHJ3XHJcbiAgICAgICAgbWF4ZCA9ICdyJ1xyXG4gICAgICAgIGFjY1N1bSA9IG5ldyBVaW50MzJBcnJheShAcjIgKyAxKVxyXG4gICAgICAgIGBcclxuICAgICAgICBmb3IgKHZhciByID0gdGhpcy5yMTsgciA8PSB0aGlzLnIyOyByKyspIHtcclxuICAgICAgICAgIHN1bSA9IDBcclxuICAgICAgICAgIGZvciAodmFyIGcgPSB0aGlzLmcxOyBnIDw9IHRoaXMuZzI7IGcrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBiID0gdGhpcy5iMTsgYiA8PSB0aGlzLmIyOyBiKyspIHtcclxuICAgICAgICAgICAgICB2YXIgaW5kZXggPSBnZXRDb2xvckluZGV4KHIsIGcsIGIpO1xyXG4gICAgICAgICAgICAgIHN1bSArPSBoaXN0W2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdG90YWwgKz0gc3VtO1xyXG4gICAgICAgICAgYWNjU3VtW3JdID0gdG90YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGBcclxuICAgICAgICAjIGZvciByIGluIFtAcjEuLkByMl1cclxuICAgICAgICAjICAgc3VtID0gMFxyXG4gICAgICAgICMgICBmb3IgZyBpbiBbQGcxLi5AZzJdXHJcbiAgICAgICAgIyAgICAgZm9yIGIgaW4gW0BiMS4uQGIyXVxyXG4gICAgICAgICMgICAgICAgaW5kZXggPSBnZXRDb2xvckluZGV4KHIsIGcsIGIpXHJcbiAgICAgICAgIyAgICAgICBzdW0gKz0gaGlzdFtpbmRleF1cclxuICAgICAgICAjICAgdG90YWwgKz0gc3VtXHJcbiAgICAgICAgIyAgIGFjY1N1bVtyXSA9IHRvdGFsXHJcbiAgICAgIHdoZW4gZ3dcclxuICAgICAgICBtYXhkID0gJ2cnXHJcbiAgICAgICAgYWNjU3VtID0gbmV3IFVpbnQzMkFycmF5KEBnMiArIDEpXHJcbiAgICAgICAgYFxyXG4gICAgICAgIGZvciAodmFyIGcgPSB0aGlzLmcxOyBnIDw9IHRoaXMuZzI7IGcrKykge1xyXG4gICAgICAgICAgc3VtID0gMFxyXG4gICAgICAgICAgZm9yICh2YXIgciA9IHRoaXMucjE7IHIgPD0gdGhpcy5yMjsgcisrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGIgPSB0aGlzLmIxOyBiIDw9IHRoaXMuYjI7IGIrKykge1xyXG4gICAgICAgICAgICAgIHZhciBpbmRleCA9IGdldENvbG9ySW5kZXgociwgZywgYik7XHJcbiAgICAgICAgICAgICAgc3VtICs9IGhpc3RbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0b3RhbCArPSBzdW07XHJcbiAgICAgICAgICBhY2NTdW1bZ10gPSB0b3RhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgYFxyXG4gICAgICAgICMgZm9yIGcgaW4gW0BnMS4uQGcyXVxyXG4gICAgICAgICMgICBzdW0gPSAwXHJcbiAgICAgICAgIyAgIGZvciByIGluIFtAcjEuLkByMl1cclxuICAgICAgICAjICAgICBmb3IgYiBpbiBbQGIxLi5AYjJdXHJcbiAgICAgICAgIyAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgociwgZywgYilcclxuICAgICAgICAjICAgICAgIHN1bSArPSBoaXN0W2luZGV4XVxyXG4gICAgICAgICMgICB0b3RhbCArPSBzdW1cclxuICAgICAgICAjICAgYWNjU3VtW2ddID0gdG90YWxcclxuICAgICAgd2hlbiBid1xyXG4gICAgICAgIG1heGQgPSAnYidcclxuICAgICAgICBhY2NTdW0gPSBuZXcgVWludDMyQXJyYXkoQGIyICsgMSlcclxuICAgICAgICBgXHJcbiAgICAgICAgZm9yICh2YXIgYiA9IHRoaXMuYjE7IGIgPD0gdGhpcy5iMjsgYisrKSB7XHJcbiAgICAgICAgICBzdW0gPSAwXHJcbiAgICAgICAgICBmb3IgKHZhciByID0gdGhpcy5yMTsgciA8PSB0aGlzLnIyOyByKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgZyA9IHRoaXMuZzE7IGcgPD0gdGhpcy5nMjsgZysrKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZ2V0Q29sb3JJbmRleChyLCBnLCBiKTtcclxuICAgICAgICAgICAgICBzdW0gKz0gaGlzdFtpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRvdGFsICs9IHN1bTtcclxuICAgICAgICAgIGFjY1N1bVtiXSA9IHRvdGFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBgXHJcbiAgICAgICAgIyBmb3IgYiBpbiBbQGIxLi5AYjJdXHJcbiAgICAgICAgIyAgIHN1bSA9IDBcclxuICAgICAgICAjICAgZm9yIHIgaW4gW0ByMS4uQHIyXVxyXG4gICAgICAgICMgICAgIGZvciBnIGluIFtAZzEuLkBnMl1cclxuICAgICAgICAjICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChyLCBnLCBiKVxyXG4gICAgICAgICMgICAgICAgc3VtICs9IGhpc3RbaW5kZXhdXHJcbiAgICAgICAgIyAgIHRvdGFsICs9IHN1bVxyXG4gICAgICAgICMgICBhY2NTdW1bYl0gPSB0b3RhbFxyXG5cclxuICAgIHNwbGl0UG9pbnQgPSAtMVxyXG4gICAgcmV2ZXJzZVN1bSA9IG5ldyBVaW50MzJBcnJheShhY2NTdW0ubGVuZ3RoKVxyXG4gICAgZm9yIGkgaW4gWzAuLmFjY1N1bS5sZW5ndGgtMV1cclxuICAgICAgZCA9IGFjY1N1bVtpXVxyXG4gICAgICBpZiBzcGxpdFBvaW50IDwgMCAmJiBkID4gdG90YWwgLyAyXHJcbiAgICAgICAgc3BsaXRQb2ludCA9IGlcclxuICAgICAgcmV2ZXJzZVN1bVtpXSA9IHRvdGFsIC0gZFxyXG5cclxuICAgIHZib3ggPSB0aGlzXHJcbiAgICBkb0N1dCA9IChkKSAtPlxyXG4gICAgICBkaW0xID0gZCArIFwiMVwiXHJcbiAgICAgIGRpbTIgPSBkICsgXCIyXCJcclxuICAgICAgZDEgPSB2Ym94W2RpbTFdXHJcbiAgICAgIGQyID0gdmJveFtkaW0yXVxyXG4gICAgICB2Ym94MSA9IHZib3guY2xvbmUoKVxyXG4gICAgICB2Ym94MiA9IHZib3guY2xvbmUoKVxyXG4gICAgICBsZWZ0ID0gc3BsaXRQb2ludCAtIGQxXHJcbiAgICAgIHJpZ2h0ID0gZDIgLSBzcGxpdFBvaW50XHJcbiAgICAgIGlmIGxlZnQgPD0gcmlnaHRcclxuICAgICAgICBkMiA9IE1hdGgubWluKGQyIC0gMSwgfn4gKHNwbGl0UG9pbnQgKyByaWdodCAvIDIpKVxyXG4gICAgICAgIGQyID0gTWF0aC5tYXgoMCwgZDIpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkMiA9IE1hdGgubWF4KGQxLCB+fiAoc3BsaXRQb2ludCAtIDEgLSBsZWZ0IC8gMikpXHJcbiAgICAgICAgZDIgPSBNYXRoLm1pbih2Ym94W2RpbTJdLCBkMilcclxuXHJcblxyXG4gICAgICB3aGlsZSAhYWNjU3VtW2QyXVxyXG4gICAgICAgIGQyKytcclxuXHJcblxyXG4gICAgICBjMiA9IHJldmVyc2VTdW1bZDJdXHJcbiAgICAgIHdoaWxlICFjMiBhbmQgYWNjU3VtW2QyIC0gMV1cclxuICAgICAgICBjMiA9IHJldmVyc2VTdW1bLS1kMl1cclxuXHJcbiAgICAgIHZib3gxW2RpbTJdID0gZDJcclxuICAgICAgdmJveDJbZGltMV0gPSBkMiArIDFcclxuICAgICAgIyB2Ym94LmludmFsaWRhdGUoKVxyXG5cclxuICAgICAgcmV0dXJuIFt2Ym94MSwgdmJveDJdXHJcblxyXG4gICAgZG9DdXQgbWF4ZFxyXG5cclxuICBjb250YWluczogKHApIC0+XHJcbiAgICByID0gcFswXT4+UlNISUZUXHJcbiAgICBnID0gcFsxXT4+UlNISUZUXHJcbiAgICBiID0gcFsyXT4+UlNISUZUXHJcblxyXG4gICAgciA+PSBAcjEgYW5kIHIgPD0gQHIyIGFuZCBnID49IEBnMSBhbmQgZyA8PSBAZzIgYW5kIGIgPj0gQGIxIGFuZCBiIDw9IEBiMlxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9XHJcbmNsYXNzIFF1YW50aXplclxyXG4gIGluaXRpYWxpemU6IChwaXhlbHMsIG9wdHMpIC0+XHJcblxyXG4gIGdldFF1YW50aXplZENvbG9yczogLT5cclxuXHJcbm1vZHVsZS5leHBvcnRzLkJhc2VsaW5lID0gcmVxdWlyZSgnLi9iYXNlbGluZScpXHJcbm1vZHVsZS5leHBvcnRzLk5vQ29weSA9IHJlcXVpcmUoJy4vbm9jb3B5JylcclxubW9kdWxlLmV4cG9ydHMuQ29sb3JDdXQgPSByZXF1aXJlKCcuL2NvbG9yLWN1dCcpXHJcbm1vZHVsZS5leHBvcnRzLk1NQ1EgPSByZXF1aXJlKCcuL21tY3EnKVxyXG4iLCJTd2F0Y2ggPSByZXF1aXJlKCcuLi9zd2F0Y2gnKVxyXG5RdWFudGl6ZXIgPSByZXF1aXJlKCcuL2luZGV4JylcclxuTU1DUUltcGwgPSByZXF1aXJlKCcuL2ltcGwvbW1jcScpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbmNsYXNzIE1NQ1EgZXh0ZW5kcyBRdWFudGl6ZXJcclxuICBpbml0aWFsaXplOiAocGl4ZWxzLCBAb3B0cykgLT5cclxuICAgIG1tY3EgPSBuZXcgTU1DUUltcGwoKVxyXG4gICAgQHN3YXRjaGVzID0gbW1jcS5xdWFudGl6ZSBwaXhlbHMsIEBvcHRzXHJcblxyXG4gIGdldFF1YW50aXplZENvbG9yczogLT5cclxuICAgIEBzd2F0Y2hlc1xyXG4iLCJTd2F0Y2ggPSByZXF1aXJlKCcuLi9zd2F0Y2gnKVxyXG5RdWFudGl6ZXIgPSByZXF1aXJlKCcuL2luZGV4JylcclxucXVhbnRpemUgPSByZXF1aXJlKCcuLi8uLi92ZW5kb3ItbW9kL3F1YW50aXplJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuY2xhc3MgTm9Db3B5UXVhbnRpemVyIGV4dGVuZHMgUXVhbnRpemVyXHJcbiAgaW5pdGlhbGl6ZTogKHBpeGVscywgQG9wdHMpIC0+XHJcbiAgICBjbWFwID0gcXVhbnRpemUgcGl4ZWxzLCBAb3B0c1xyXG4gICAgQHN3YXRjaGVzID0gY21hcC52Ym94ZXMubWFwICh2Ym94KSA9PlxyXG4gICAgICBuZXcgU3dhdGNoIHZib3guY29sb3IsIHZib3gudmJveC5jb3VudCgpXHJcblxyXG4gIGdldFF1YW50aXplZENvbG9yczogLT5cclxuICAgIEBzd2F0Y2hlc1xyXG4iLCJ1dGlsID0gcmVxdWlyZSgnLi91dGlsJylcbiMjI1xuICBGcm9tIFZpYnJhbnQuanMgYnkgSmFyaSBad2FydHNcbiAgUG9ydGVkIHRvIG5vZGUuanMgYnkgQUtGaXNoXG5cbiAgU3dhdGNoIGNsYXNzXG4jIyNcbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN3YXRjaFxuICBoc2w6IHVuZGVmaW5lZFxuICByZ2I6IHVuZGVmaW5lZFxuICBwb3B1bGF0aW9uOiAxXG4gIHlpcTogMFxuXG4gIGNvbnN0cnVjdG9yOiAocmdiLCBwb3B1bGF0aW9uKSAtPlxuICAgIEByZ2IgPSByZ2JcbiAgICBAcG9wdWxhdGlvbiA9IHBvcHVsYXRpb25cblxuICBnZXRIc2w6IC0+XG4gICAgaWYgbm90IEBoc2xcbiAgICAgIEBoc2wgPSB1dGlsLnJnYlRvSHNsIEByZ2JbMF0sIEByZ2JbMV0sIEByZ2JbMl1cbiAgICBlbHNlIEBoc2xcblxuICBnZXRQb3B1bGF0aW9uOiAtPlxuICAgIEBwb3B1bGF0aW9uXG5cbiAgZ2V0UmdiOiAtPlxuICAgIEByZ2JcblxuICBnZXRIZXg6IC0+XG4gICAgdXRpbC5yZ2JUb0hleChAcmdiWzBdLCBAcmdiWzFdLCBAcmdiWzJdKVxuXG4gIGdldFRpdGxlVGV4dENvbG9yOiAtPlxuICAgIEBfZW5zdXJlVGV4dENvbG9ycygpXG4gICAgaWYgQHlpcSA8IDIwMCB0aGVuIFwiI2ZmZlwiIGVsc2UgXCIjMDAwXCJcblxuICBnZXRCb2R5VGV4dENvbG9yOiAtPlxuICAgIEBfZW5zdXJlVGV4dENvbG9ycygpXG4gICAgaWYgQHlpcSA8IDE1MCB0aGVuIFwiI2ZmZlwiIGVsc2UgXCIjMDAwXCJcblxuICBfZW5zdXJlVGV4dENvbG9yczogLT5cbiAgICBpZiBub3QgQHlpcSB0aGVuIEB5aXEgPSAoQHJnYlswXSAqIDI5OSArIEByZ2JbMV0gKiA1ODcgKyBAcmdiWzJdICogMTE0KSAvIDEwMDBcbiIsIkRFTFRBRTk0ID1cbiAgTkE6IDBcbiAgUEVSRkVDVDogMVxuICBDTE9TRTogMlxuICBHT09EOiAxMFxuICBTSU1JTEFSOiA1MFxuXG5TSUdCSVRTID0gNVxuUlNISUZUID0gOCAtIFNJR0JJVFNcblxuXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY2xvbmU6IChvKSAtPlxuICAgIGlmIHR5cGVvZiBvID09ICdvYmplY3QnXG4gICAgICBpZiBBcnJheS5pc0FycmF5IG9cbiAgICAgICAgcmV0dXJuIG8ubWFwICh2KSA9PiB0aGlzLmNsb25lIHZcbiAgICAgIGVsc2VcbiAgICAgICAgX28gPSB7fVxuICAgICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBvXG4gICAgICAgICAgX29ba2V5XSA9IHRoaXMuY2xvbmUgdmFsdWVcbiAgICAgICAgcmV0dXJuIF9vXG4gICAgb1xuXG4gIGRlZmF1bHRzOiAoKSAtPlxuICAgIG8gPSB7fVxuICAgIGZvciBfbyBpbiBhcmd1bWVudHNcbiAgICAgIGZvciBrZXksIHZhbHVlIG9mIF9vXG4gICAgICAgIGlmIG5vdCBvW2tleV0/IHRoZW4gb1trZXldID0gdGhpcy5jbG9uZSB2YWx1ZVxuXG4gICAgb1xuXG4gIGhleFRvUmdiOiAoaGV4KSAtPlxuICAgIG0gPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KVxuICAgIGlmIG0/XG4gICAgICByZXR1cm4gW21bMV0sIG1bMl0sIG1bM11dLm1hcCAocykgLT4gcGFyc2VJbnQocywgMTYpXG4gICAgcmV0dXJuIG51bGxcblxuICByZ2JUb0hleDogKHIsIGcsIGIpIC0+XG4gICAgXCIjXCIgKyAoKDEgPDwgMjQpICsgKHIgPDwgMTYpICsgKGcgPDwgOCkgKyBiKS50b1N0cmluZygxNikuc2xpY2UoMSwgNylcblxuICByZ2JUb0hzbDogKHIsIGcsIGIpIC0+XG4gICAgciAvPSAyNTVcbiAgICBnIC89IDI1NVxuICAgIGIgLz0gMjU1XG4gICAgbWF4ID0gTWF0aC5tYXgociwgZywgYilcbiAgICBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKVxuICAgIGggPSB1bmRlZmluZWRcbiAgICBzID0gdW5kZWZpbmVkXG4gICAgbCA9IChtYXggKyBtaW4pIC8gMlxuICAgIGlmIG1heCA9PSBtaW5cbiAgICAgIGggPSBzID0gMFxuICAgICAgIyBhY2hyb21hdGljXG4gICAgZWxzZVxuICAgICAgZCA9IG1heCAtIG1pblxuICAgICAgcyA9IGlmIGwgPiAwLjUgdGhlbiBkIC8gKDIgLSBtYXggLSBtaW4pIGVsc2UgZCAvIChtYXggKyBtaW4pXG4gICAgICBzd2l0Y2ggbWF4XG4gICAgICAgIHdoZW4gclxuICAgICAgICAgIGggPSAoZyAtIGIpIC8gZCArIChpZiBnIDwgYiB0aGVuIDYgZWxzZSAwKVxuICAgICAgICB3aGVuIGdcbiAgICAgICAgICBoID0gKGIgLSByKSAvIGQgKyAyXG4gICAgICAgIHdoZW4gYlxuICAgICAgICAgIGggPSAociAtIGcpIC8gZCArIDRcbiAgICAgIGggLz0gNlxuICAgIFtoLCBzLCBsXVxuXG4gIGhzbFRvUmdiOiAoaCwgcywgbCkgLT5cbiAgICByID0gdW5kZWZpbmVkXG4gICAgZyA9IHVuZGVmaW5lZFxuICAgIGIgPSB1bmRlZmluZWRcblxuICAgIGh1ZTJyZ2IgPSAocCwgcSwgdCkgLT5cbiAgICAgIGlmIHQgPCAwXG4gICAgICAgIHQgKz0gMVxuICAgICAgaWYgdCA+IDFcbiAgICAgICAgdCAtPSAxXG4gICAgICBpZiB0IDwgMSAvIDZcbiAgICAgICAgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHRcbiAgICAgIGlmIHQgPCAxIC8gMlxuICAgICAgICByZXR1cm4gcVxuICAgICAgaWYgdCA8IDIgLyAzXG4gICAgICAgIHJldHVybiBwICsgKHEgLSBwKSAqICgyIC8gMyAtIHQpICogNlxuICAgICAgcFxuXG4gICAgaWYgcyA9PSAwXG4gICAgICByID0gZyA9IGIgPSBsXG4gICAgICAjIGFjaHJvbWF0aWNcbiAgICBlbHNlXG4gICAgICBxID0gaWYgbCA8IDAuNSB0aGVuIGwgKiAoMSArIHMpIGVsc2UgbCArIHMgLSAobCAqIHMpXG4gICAgICBwID0gMiAqIGwgLSBxXG4gICAgICByID0gaHVlMnJnYihwLCBxLCBoICsgMSAvIDMpXG4gICAgICBnID0gaHVlMnJnYihwLCBxLCBoKVxuICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtICgxIC8gMykpXG4gICAgW1xuICAgICAgciAqIDI1NVxuICAgICAgZyAqIDI1NVxuICAgICAgYiAqIDI1NVxuICAgIF1cblxuICByZ2JUb1h5ejogKHIsIGcsIGIpIC0+XG4gICAgciAvPSAyNTVcbiAgICBnIC89IDI1NVxuICAgIGIgLz0gMjU1XG4gICAgciA9IGlmIHIgPiAwLjA0MDQ1IHRoZW4gTWF0aC5wb3coKHIgKyAwLjAwNSkgLyAxLjA1NSwgMi40KSBlbHNlIHIgLyAxMi45MlxuICAgIGcgPSBpZiBnID4gMC4wNDA0NSB0aGVuIE1hdGgucG93KChnICsgMC4wMDUpIC8gMS4wNTUsIDIuNCkgZWxzZSBnIC8gMTIuOTJcbiAgICBiID0gaWYgYiA+IDAuMDQwNDUgdGhlbiBNYXRoLnBvdygoYiArIDAuMDA1KSAvIDEuMDU1LCAyLjQpIGVsc2UgYiAvIDEyLjkyXG5cbiAgICByICo9IDEwMFxuICAgIGcgKj0gMTAwXG4gICAgYiAqPSAxMDBcblxuICAgIHggPSByICogMC40MTI0ICsgZyAqIDAuMzU3NiArIGIgKiAwLjE4MDVcbiAgICB5ID0gciAqIDAuMjEyNiArIGcgKiAwLjcxNTIgKyBiICogMC4wNzIyXG4gICAgeiA9IHIgKiAwLjAxOTMgKyBnICogMC4xMTkyICsgYiAqIDAuOTUwNVxuXG4gICAgW3gsIHksIHpdXG5cbiAgeHl6VG9DSUVMYWI6ICh4LCB5LCB6KSAtPlxuICAgIFJFRl9YID0gOTUuMDQ3XG4gICAgUkVGX1kgPSAxMDBcbiAgICBSRUZfWiA9IDEwOC44ODNcblxuICAgIHggLz0gUkVGX1hcbiAgICB5IC89IFJFRl9ZXG4gICAgeiAvPSBSRUZfWlxuXG4gICAgeCA9IGlmIHggPiAwLjAwODg1NiB0aGVuIE1hdGgucG93KHgsIDEvMykgZWxzZSA3Ljc4NyAqIHggKyAxNiAvIDExNlxuICAgIHkgPSBpZiB5ID4gMC4wMDg4NTYgdGhlbiBNYXRoLnBvdyh5LCAxLzMpIGVsc2UgNy43ODcgKiB5ICsgMTYgLyAxMTZcbiAgICB6ID0gaWYgeiA+IDAuMDA4ODU2IHRoZW4gTWF0aC5wb3coeiwgMS8zKSBlbHNlIDcuNzg3ICogeiArIDE2IC8gMTE2XG5cbiAgICBMID0gMTE2ICogeSAtIDE2XG4gICAgYSA9IDUwMCAqICh4IC0geSlcbiAgICBiID0gMjAwICogKHkgLSB6KVxuXG4gICAgW0wsIGEsIGJdXG5cbiAgcmdiVG9DSUVMYWI6IChyLCBnLCBiKSAtPlxuICAgIFt4LCB5LCB6XSA9IHRoaXMucmdiVG9YeXogciwgZywgYlxuICAgIHRoaXMueHl6VG9DSUVMYWIgeCwgeSwgelxuXG4gIGRlbHRhRTk0OiAobGFiMSwgbGFiMikgLT5cbiAgICAjIFdlaWdodHNcbiAgICBXRUlHSFRfTCA9IDFcbiAgICBXRUlHSFRfQyA9IDFcbiAgICBXRUlHSFRfSCA9IDFcblxuICAgIFtMMSwgYTEsIGIxXSA9IGxhYjFcbiAgICBbTDIsIGEyLCBiMl0gPSBsYWIyXG4gICAgZEwgPSBMMSAtIEwyXG4gICAgZGEgPSBhMSAtIGEyXG4gICAgZGIgPSBiMSAtIGIyXG5cbiAgICB4QzEgPSBNYXRoLnNxcnQgYTEgKiBhMSArIGIxICogYjFcbiAgICB4QzIgPSBNYXRoLnNxcnQgYTIgKiBhMiArIGIyICogYjJcblxuICAgIHhETCA9IEwyIC0gTDFcbiAgICB4REMgPSB4QzIgLSB4QzFcbiAgICB4REUgPSBNYXRoLnNxcnQgZEwgKiBkTCArIGRhICogZGEgKyBkYiAqIGRiXG5cbiAgICBpZiBNYXRoLnNxcnQoeERFKSA+IE1hdGguc3FydChNYXRoLmFicyh4REwpKSArIE1hdGguc3FydChNYXRoLmFicyh4REMpKVxuICAgICAgeERIID0gTWF0aC5zcXJ0IHhERSAqIHhERSAtIHhETCAqIHhETCAtIHhEQyAqIHhEQ1xuICAgIGVsc2VcbiAgICAgIHhESCA9IDBcblxuICAgIHhTQyA9IDEgKyAwLjA0NSAqIHhDMVxuICAgIHhTSCA9IDEgKyAwLjAxNSAqIHhDMVxuXG4gICAgeERMIC89IFdFSUdIVF9MXG4gICAgeERDIC89IFdFSUdIVF9DICogeFNDXG4gICAgeERIIC89IFdFSUdIVF9IICogeFNIXG5cbiAgICBNYXRoLnNxcnQgeERMICogeERMICsgeERDICogeERDICsgeERIICogeERIXG5cbiAgcmdiRGlmZjogKHJnYjEsIHJnYjIpIC0+XG4gICAgbGFiMSA9IEByZ2JUb0NJRUxhYi5hcHBseSBALCByZ2IxXG4gICAgbGFiMiA9IEByZ2JUb0NJRUxhYi5hcHBseSBALCByZ2IyXG4gICAgQGRlbHRhRTk0IGxhYjEsIGxhYjJcblxuICBoZXhEaWZmOiAoaGV4MSwgaGV4MikgLT5cbiAgICAjIGNvbnNvbGUubG9nIFwiQ29tcGFyZSAje2hleDF9ICN7aGV4Mn1cIlxuICAgIHJnYjEgPSBAaGV4VG9SZ2IgaGV4MVxuICAgIHJnYjIgPSBAaGV4VG9SZ2IgaGV4MlxuICAgICMgY29uc29sZS5sb2cgcmdiMVxuICAgICMgY29uc29sZS5sb2cgcmdiMlxuICAgIEByZ2JEaWZmIHJnYjEsIHJnYjJcblxuICBERUxUQUU5NF9ESUZGX1NUQVRVUzogREVMVEFFOTRcblxuICBnZXRDb2xvckRpZmZTdGF0dXM6IChkKSAtPlxuICAgIGlmIGQgPCBERUxUQUU5NC5OQVxuICAgICAgcmV0dXJuIFwiTi9BXCJcbiAgICAjIE5vdCBwZXJjZXB0aWJsZSBieSBodW1hbiBleWVzXG4gICAgaWYgZCA8PSBERUxUQUU5NC5QRVJGRUNUXG4gICAgICByZXR1cm4gXCJQZXJmZWN0XCJcbiAgICAjIFBlcmNlcHRpYmxlIHRocm91Z2ggY2xvc2Ugb2JzZXJ2YXRpb25cbiAgICBpZiBkIDw9IERFTFRBRTk0LkNMT1NFXG4gICAgICByZXR1cm4gXCJDbG9zZVwiXG4gICAgIyBQZXJjZXB0aWJsZSBhdCBhIGdsYW5jZVxuICAgIGlmIGQgPD0gREVMVEFFOTQuR09PRFxuICAgICAgcmV0dXJuIFwiR29vZFwiXG4gICAgIyBDb2xvcnMgYXJlIG1vcmUgc2ltaWxhciB0aGFuIG9wcG9zaXRlXG4gICAgaWYgZCA8IERFTFRBRTk0LlNJTUlMQVJcbiAgICAgIHJldHVybiBcIlNpbWlsYXJcIlxuICAgIHJldHVybiBcIldyb25nXCJcblxuICBTSUdCSVRTOiBTSUdCSVRTXG4gIFJTSElGVDogUlNISUZUXG4gIGdldENvbG9ySW5kZXg6IChyLCBnLCBiKSAtPlxuICAgIChyPDwoMipTSUdCSVRTKSkgKyAoZyA8PCBTSUdCSVRTKSArIGJcbiIsIiMjI1xuICBGcm9tIFZpYnJhbnQuanMgYnkgSmFyaSBad2FydHNcbiAgUG9ydGVkIHRvIG5vZGUuanMgYnkgQUtGaXNoXG5cbiAgQ29sb3IgYWxnb3JpdGhtIGNsYXNzIHRoYXQgZmluZHMgdmFyaWF0aW9ucyBvbiBjb2xvcnMgaW4gYW4gaW1hZ2UuXG5cbiAgQ3JlZGl0c1xuICAtLS0tLS0tLVxuICBMb2tlc2ggRGhha2FyIChodHRwOi8vd3d3Lmxva2VzaGRoYWthci5jb20pIC0gQ3JlYXRlZCBDb2xvclRoaWVmXG4gIEdvb2dsZSAtIFBhbGV0dGUgc3VwcG9ydCBsaWJyYXJ5IGluIEFuZHJvaWRcbiMjI1xuU3dhdGNoID0gcmVxdWlyZSgnLi9zd2F0Y2gnKVxudXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpXG5EZWZhdWx0R2VuZXJhdG9yID0gcmVxdWlyZSgnLi9nZW5lcmF0b3InKS5EZWZhdWx0XG5GaWx0ZXIgPSByZXF1aXJlKCcuL2ZpbHRlcicpXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFZpYnJhbnRcbiAgQERlZmF1bHRPcHRzOlxuICAgIGNvbG9yQ291bnQ6IDY0XG4gICAgcXVhbGl0eTogNVxuICAgIGdlbmVyYXRvcjogbmV3IERlZmF1bHRHZW5lcmF0b3IoKVxuICAgIEltYWdlOiBudWxsXG4gICAgUXVhbnRpemVyOiByZXF1aXJlKCcuL3F1YW50aXplcicpLk1NQ1FcbiAgICBmaWx0ZXJzOiBbXVxuXG4gIEBmcm9tOiAoc3JjKSAtPlxuICAgIG5ldyBCdWlsZGVyKHNyYylcblxuICBxdWFudGl6ZTogcmVxdWlyZSgncXVhbnRpemUnKVxuXG4gIF9zd2F0Y2hlczogW11cblxuICBjb25zdHJ1Y3RvcjogKEBzb3VyY2VJbWFnZSwgb3B0cyA9IHt9KSAtPlxuICAgIEBvcHRzID0gdXRpbC5kZWZhdWx0cyhvcHRzLCBAY29uc3RydWN0b3IuRGVmYXVsdE9wdHMpXG4gICAgQGdlbmVyYXRvciA9IEBvcHRzLmdlbmVyYXRvclxuXG4gIGdldFBhbGV0dGU6IChjYikgLT5cbiAgICBpbWFnZSA9IG5ldyBAb3B0cy5JbWFnZSBAc291cmNlSW1hZ2UsIChlcnIsIGltYWdlKSA9PlxuICAgICAgaWYgZXJyPyB0aGVuIHJldHVybiBjYihlcnIpXG4gICAgICB0cnlcbiAgICAgICAgQF9wcm9jZXNzIGltYWdlLCBAb3B0c1xuICAgICAgICBjYiBudWxsLCBAc3dhdGNoZXMoKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgcmV0dXJuIGNiKGVycm9yKVxuXG4gIGdldFN3YXRjaGVzOiAoY2IpIC0+XG4gICAgQGdldFBhbGV0dGUgY2JcblxuICBfcHJvY2VzczogKGltYWdlLCBvcHRzKSAtPlxuICAgIGltYWdlLnNjYWxlRG93bihAb3B0cylcbiAgICBpbWFnZURhdGEgPSBpbWFnZS5nZXRJbWFnZURhdGEoKVxuXG4gICAgcXVhbnRpemVyID0gbmV3IEBvcHRzLlF1YW50aXplcigpXG4gICAgcXVhbnRpemVyLmluaXRpYWxpemUoaW1hZ2VEYXRhLmRhdGEsIEBvcHRzKVxuXG4gICAgc3dhdGNoZXMgPSBxdWFudGl6ZXIuZ2V0UXVhbnRpemVkQ29sb3JzKClcblxuICAgIEBnZW5lcmF0b3IuZ2VuZXJhdGUoc3dhdGNoZXMpXG4gICAgIyBDbGVhbiB1cFxuICAgIGltYWdlLnJlbW92ZUNhbnZhcygpXG5cbiAgc3dhdGNoZXM6ID0+XG4gICAgVmlicmFudDogICAgICBAZ2VuZXJhdG9yLmdldFZpYnJhbnRTd2F0Y2goKVxuICAgIE11dGVkOiAgICAgICAgQGdlbmVyYXRvci5nZXRNdXRlZFN3YXRjaCgpXG4gICAgRGFya1ZpYnJhbnQ6ICBAZ2VuZXJhdG9yLmdldERhcmtWaWJyYW50U3dhdGNoKClcbiAgICBEYXJrTXV0ZWQ6ICAgIEBnZW5lcmF0b3IuZ2V0RGFya011dGVkU3dhdGNoKClcbiAgICBMaWdodFZpYnJhbnQ6IEBnZW5lcmF0b3IuZ2V0TGlnaHRWaWJyYW50U3dhdGNoKClcbiAgICBMaWdodE11dGVkOiAgIEBnZW5lcmF0b3IuZ2V0TGlnaHRNdXRlZFN3YXRjaCgpXG5cbm1vZHVsZS5leHBvcnRzLkJ1aWxkZXIgPVxuY2xhc3MgQnVpbGRlclxuICBjb25zdHJ1Y3RvcjogKEBzcmMsIEBvcHRzID0ge30pIC0+XG4gICAgQG9wdHMuZmlsdGVycyA9IHV0aWwuY2xvbmUgVmlicmFudC5EZWZhdWx0T3B0cy5maWx0ZXJzXG5cbiAgbWF4Q29sb3JDb3VudDogKG4pIC0+XG4gICAgQG9wdHMuY29sb3JDb3VudCA9IG5cbiAgICBAXG5cbiAgbWF4RGltZW5zaW9uOiAoZCkgLT5cbiAgICBAb3B0cy5tYXhEaW1lbnNpb24gPSBkXG4gICAgQFxuXG4gIGFkZEZpbHRlcjogKGYpIC0+XG4gICAgaWYgdHlwZW9mIGYgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgQG9wdHMuZmlsdGVycy5wdXNoIGZcbiAgICBAXG5cbiAgcmVtb3ZlRmlsdGVyOiAoZikgLT5cbiAgICBpZiAoaSA9IEBvcHRzLmZpbHRlcnMuaW5kZXhPZihmKSkgPiAwXG4gICAgICBAb3B0cy5maWx0ZXJzLnNwbGljZShpKVxuICAgIEBcblxuICBjbGVhckZpbHRlcnM6IC0+XG4gICAgQG9wdHMuZmlsdGVycyA9IFtdXG4gICAgQFxuXG4gIHF1YWxpdHk6IChxKSAtPlxuICAgIEBvcHRzLnF1YWxpdHkgPSBxXG4gICAgQFxuXG4gIHVzZUltYWdlOiAoaW1hZ2UpIC0+XG4gICAgQG9wdHMuSW1hZ2UgPSBpbWFnZVxuICAgIEBcblxuICB1c2VHZW5lcmF0b3I6IChnZW5lcmF0b3IpIC0+XG4gICAgQG9wdHMuZ2VuZXJhdG9yID0gZ2VuZXJhdG9yXG4gICAgQFxuXG4gIHVzZVF1YW50aXplcjogKHF1YW50aXplcikgLT5cbiAgICBAb3B0cy5RdWFudGl6ZXIgPSBxdWFudGl6ZXJcbiAgICBAXG5cbiAgYnVpbGQ6IC0+XG4gICAgaWYgbm90IEB2P1xuICAgICAgQHYgPSBuZXcgVmlicmFudChAc3JjLCBAb3B0cylcbiAgICBAdlxuXG4gIGdldFN3YXRjaGVzOiAoY2IpIC0+XG4gICAgQGJ1aWxkKCkuZ2V0UGFsZXR0ZSBjYlxuXG4gIGdldFBhbGV0dGU6IChjYikgLT5cbiAgICBAYnVpbGQoKS5nZXRQYWxldHRlIGNiXG5cbiAgZnJvbTogKHNyYykgLT5cbiAgICBuZXcgVmlicmFudChzcmMsIEBvcHRzKVxuXG5tb2R1bGUuZXhwb3J0cy5VdGlsID0gdXRpbFxubW9kdWxlLmV4cG9ydHMuU3dhdGNoID0gU3dhdGNoXG5tb2R1bGUuZXhwb3J0cy5RdWFudGl6ZXIgPSByZXF1aXJlKCcuL3F1YW50aXplci8nKVxubW9kdWxlLmV4cG9ydHMuR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9nZW5lcmF0b3IvJylcbm1vZHVsZS5leHBvcnRzLkZpbHRlciA9IHJlcXVpcmUoJy4vZmlsdGVyLycpXG4iLCIvKlxyXG4gKiBxdWFudGl6ZS5qcyBDb3B5cmlnaHQgMjAwOCBOaWNrIFJhYmlub3dpdHpcclxuICogUG9ydGVkIHRvIG5vZGUuanMgYnkgT2xpdmllciBMZXNuaWNraVxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2U6IGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcbiAqL1xyXG5cclxuLy8gZmlsbCBvdXQgYSBjb3VwbGUgcHJvdG92aXMgZGVwZW5kZW5jaWVzXHJcbi8qXHJcbiAqIEJsb2NrIGJlbG93IGNvcGllZCBmcm9tIFByb3RvdmlzOiBodHRwOi8vbWJvc3RvY2suZ2l0aHViLmNvbS9wcm90b3Zpcy9cclxuICogQ29weXJpZ2h0IDIwMTAgU3RhbmZvcmQgVmlzdWFsaXphdGlvbiBHcm91cFxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2U6IGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvYnNkLWxpY2Vuc2UucGhwXHJcbiAqL1xyXG5pZiAoIXB2KSB7XHJcbiAgICB2YXIgcHYgPSB7XHJcbiAgICAgICAgbWFwOiBmdW5jdGlvbihhcnJheSwgZikge1xyXG4gICAgICAgICAgICB2YXIgbyA9IHt9O1xyXG4gICAgICAgICAgICByZXR1cm4gZiA/IGFycmF5Lm1hcChmdW5jdGlvbihkLCBpKSB7XHJcbiAgICAgICAgICAgICAgICBvLmluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmLmNhbGwobywgZCk7XHJcbiAgICAgICAgICAgIH0pIDogYXJyYXkuc2xpY2UoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hdHVyYWxPcmRlcjogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gYSAtIGI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdW06IGZ1bmN0aW9uKGFycmF5LCBmKSB7XHJcbiAgICAgICAgICAgIHZhciBvID0ge307XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5yZWR1Y2UoZiA/IGZ1bmN0aW9uKHAsIGQsIGkpIHtcclxuICAgICAgICAgICAgICAgIG8uaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHAgKyBmLmNhbGwobywgZCk7XHJcbiAgICAgICAgICAgIH0gOiBmdW5jdGlvbihwLCBkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcCArIGQ7XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWF4OiBmdW5jdGlvbihhcnJheSwgZikge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgZiA/IHB2Lm1hcChhcnJheSwgZikgOiBhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQmFzaWMgSmF2YXNjcmlwdCBwb3J0IG9mIHRoZSBNTUNRIChtb2RpZmllZCBtZWRpYW4gY3V0IHF1YW50aXphdGlvbilcclxuICogYWxnb3JpdGhtIGZyb20gdGhlIExlcHRvbmljYSBsaWJyYXJ5IChodHRwOi8vd3d3LmxlcHRvbmljYS5jb20vKS5cclxuICogUmV0dXJucyBhIGNvbG9yIG1hcCB5b3UgY2FuIHVzZSB0byBtYXAgb3JpZ2luYWwgcGl4ZWxzIHRvIHRoZSByZWR1Y2VkXHJcbiAqIHBhbGV0dGUuIFN0aWxsIGEgd29yayBpbiBwcm9ncmVzcy5cclxuICpcclxuICogQGF1dGhvciBOaWNrIFJhYmlub3dpdHpcclxuICogQGV4YW1wbGVcclxuXHJcbi8vIGFycmF5IG9mIHBpeGVscyBhcyBbUixHLEJdIGFycmF5c1xyXG52YXIgbXlQaXhlbHMgPSBbWzE5MCwxOTcsMTkwXSwgWzIwMiwyMDQsMjAwXSwgWzIwNywyMTQsMjEwXSwgWzIxMSwyMTQsMjExXSwgWzIwNSwyMDcsMjA3XVxyXG4gICAgICAgICAgICAgICAgLy8gZXRjXHJcbiAgICAgICAgICAgICAgICBdO1xyXG52YXIgbWF4Q29sb3JzID0gNDtcclxuXHJcbnZhciBjbWFwID0gTU1DUS5xdWFudGl6ZShteVBpeGVscywgbWF4Q29sb3JzKTtcclxudmFyIG5ld1BhbGV0dGUgPSBjbWFwLnBhbGV0dGUoKTtcclxudmFyIG5ld1BpeGVscyA9IG15UGl4ZWxzLm1hcChmdW5jdGlvbihwKSB7XHJcbiAgICByZXR1cm4gY21hcC5tYXAocCk7XHJcbn0pO1xyXG5cclxuICovXHJcbnZhciBNTUNRID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gcHJpdmF0ZSBjb25zdGFudHNcclxuICAgIHZhciBzaWdiaXRzID0gNSxcclxuICAgICAgICByc2hpZnQgPSA4IC0gc2lnYml0cyxcclxuICAgICAgICBtYXhJdGVyYXRpb25zID0gMTAwMCxcclxuICAgICAgICBmcmFjdEJ5UG9wdWxhdGlvbnMgPSAwLjc1O1xyXG5cclxuICAgIC8vIGdldCByZWR1Y2VkLXNwYWNlIGNvbG9yIGluZGV4IGZvciBhIHBpeGVsXHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q29sb3JJbmRleChyLCBnLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIChyIDw8ICgyICogc2lnYml0cykpICsgKGcgPDwgc2lnYml0cykgKyBiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNpbXBsZSBwcmlvcml0eSBxdWV1ZVxyXG5cclxuICAgIGZ1bmN0aW9uIFBRdWV1ZShjb21wYXJhdG9yKSB7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRzID0gW10sXHJcbiAgICAgICAgICAgIHNvcnRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzb3J0KCkge1xyXG4gICAgICAgICAgICBjb250ZW50cy5zb3J0KGNvbXBhcmF0b3IpO1xyXG4gICAgICAgICAgICBzb3J0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcHVzaDogZnVuY3Rpb24obykge1xyXG4gICAgICAgICAgICAgICAgY29udGVudHMucHVzaChvKTtcclxuICAgICAgICAgICAgICAgIHNvcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwZWVrOiBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzb3J0ZWQpIHNvcnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkKSBpbmRleCA9IGNvbnRlbnRzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzb3J0ZWQpIHNvcnQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50cy5wb3AoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudHMubGVuZ3RoO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtYXA6IGZ1bmN0aW9uKGYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50cy5tYXAoZik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlYnVnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICghc29ydGVkKSBzb3J0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDNkIGNvbG9yIHNwYWNlIGJveFxyXG5cclxuICAgIGZ1bmN0aW9uIFZCb3gocjEsIHIyLCBnMSwgZzIsIGIxLCBiMiwgaGlzdG8pIHtcclxuICAgICAgICB2YXIgdmJveCA9IHRoaXM7XHJcbiAgICAgICAgdmJveC5yMSA9IHIxO1xyXG4gICAgICAgIHZib3gucjIgPSByMjtcclxuICAgICAgICB2Ym94LmcxID0gZzE7XHJcbiAgICAgICAgdmJveC5nMiA9IGcyO1xyXG4gICAgICAgIHZib3guYjEgPSBiMTtcclxuICAgICAgICB2Ym94LmIyID0gYjI7XHJcbiAgICAgICAgdmJveC5oaXN0byA9IGhpc3RvO1xyXG4gICAgfVxyXG4gICAgVkJveC5wcm90b3R5cGUgPSB7XHJcbiAgICAgICAgdm9sdW1lOiBmdW5jdGlvbihmb3JjZSkge1xyXG4gICAgICAgICAgICB2YXIgdmJveCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICghdmJveC5fdm9sdW1lIHx8IGZvcmNlKSB7XHJcbiAgICAgICAgICAgICAgICB2Ym94Ll92b2x1bWUgPSAoKHZib3gucjIgLSB2Ym94LnIxICsgMSkgKiAodmJveC5nMiAtIHZib3guZzEgKyAxKSAqICh2Ym94LmIyIC0gdmJveC5iMSArIDEpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmJveC5fdm9sdW1lO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY291bnQ6IGZ1bmN0aW9uKGZvcmNlKSB7XHJcbiAgICAgICAgICAgIHZhciB2Ym94ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGhpc3RvID0gdmJveC5oaXN0bztcclxuICAgICAgICAgICAgaWYgKCF2Ym94Ll9jb3VudF9zZXQgfHwgZm9yY2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBucGl4ID0gMCxcclxuICAgICAgICAgICAgICAgICAgICBpLCBqLCBrO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gdmJveC5yMTsgaSA8PSB2Ym94LnIyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSB2Ym94LmcxOyBqIDw9IHZib3guZzI7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSB2Ym94LmIxOyBrIDw9IHZib3guYjI7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBnZXRDb2xvckluZGV4KGksIGosIGspO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnBpeCArPSBoaXN0b1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2Ym94Ll9jb3VudCA9IG5waXg7XHJcbiAgICAgICAgICAgICAgICB2Ym94Ll9jb3VudF9zZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2Ym94Ll9jb3VudDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvcHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdmJveCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVkJveCh2Ym94LnIxLCB2Ym94LnIyLCB2Ym94LmcxLCB2Ym94LmcyLCB2Ym94LmIxLCB2Ym94LmIyLCB2Ym94Lmhpc3RvKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGF2ZzogZnVuY3Rpb24oZm9yY2UpIHtcclxuICAgICAgICAgICAgdmFyIHZib3ggPSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgaGlzdG8gPSB2Ym94Lmhpc3RvO1xyXG4gICAgICAgICAgICBpZiAoIXZib3guX2F2ZyB8fCBmb3JjZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG50b3QgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG11bHQgPSAxIDw8ICg4IC0gc2lnYml0cyksXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbXVsdCA9ICg4IC0gc2lnYml0cyksXHJcbiAgICAgICAgICAgICAgICAgICAgcnN1bSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3N1bSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYnN1bSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgaHZhbCxcclxuICAgICAgICAgICAgICAgICAgICBpLCBqLCBrLCBoaXN0b2luZGV4O1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gdmJveC5yMTsgaSA8PSB2Ym94LnIyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSB2Ym94LmcxOyBqIDw9IHZib3guZzI7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSB2Ym94LmIxOyBrIDw9IHZib3guYjI7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9pbmRleCA9IGdldENvbG9ySW5kZXgoaSwgaiwgayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodmFsID0gaGlzdG9baGlzdG9pbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudG90ICs9IGh2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByc3VtICs9IChodmFsICogKGkgKyAwLjUpICogbXVsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnc3VtICs9IChodmFsICogKGogKyAwLjUpICogbXVsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBic3VtICs9IChodmFsICogKGsgKyAwLjUpICogbXVsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobnRvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZib3guX2F2ZyA9IFt+fihyc3VtIC8gbnRvdCksIH5+IChnc3VtIC8gbnRvdCksIH5+IChic3VtIC8gbnRvdCldO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdlbXB0eSBib3gnKTtcclxuICAgICAgICAgICAgICAgICAgICB2Ym94Ll9hdmcgPSBbfn4obXVsdCAqICh2Ym94LnIxICsgdmJveC5yMiArIDEpIC8gMiksIH5+IChtdWx0ICogKHZib3guZzEgKyB2Ym94LmcyICsgMSkgLyAyKSwgfn4gKG11bHQgKiAodmJveC5iMSArIHZib3guYjIgKyAxKSAvIDIpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmJveC5fYXZnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uKHBpeGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB2Ym94ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIHJ2YWwgPSBwaXhlbFswXSA+PiByc2hpZnQ7XHJcbiAgICAgICAgICAgIGd2YWwgPSBwaXhlbFsxXSA+PiByc2hpZnQ7XHJcbiAgICAgICAgICAgIGJ2YWwgPSBwaXhlbFsyXSA+PiByc2hpZnQ7XHJcbiAgICAgICAgICAgIHJldHVybiAocnZhbCA+PSB2Ym94LnIxICYmIHJ2YWwgPD0gdmJveC5yMiAmJlxyXG4gICAgICAgICAgICAgICAgZ3ZhbCA+PSB2Ym94LmcxICYmIGd2YWwgPD0gdmJveC5nMiAmJlxyXG4gICAgICAgICAgICAgICAgYnZhbCA+PSB2Ym94LmIxICYmIGJ2YWwgPD0gdmJveC5iMik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDb2xvciBtYXBcclxuXHJcbiAgICBmdW5jdGlvbiBDTWFwKCkge1xyXG4gICAgICAgIHRoaXMudmJveGVzID0gbmV3IFBRdWV1ZShmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwdi5uYXR1cmFsT3JkZXIoXHJcbiAgICAgICAgICAgICAgICBhLnZib3guY291bnQoKSAqIGEudmJveC52b2x1bWUoKSxcclxuICAgICAgICAgICAgICAgIGIudmJveC5jb3VudCgpICogYi52Ym94LnZvbHVtZSgpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9KTs7XHJcbiAgICB9XHJcbiAgICBDTWFwLnByb3RvdHlwZSA9IHtcclxuICAgICAgICBwdXNoOiBmdW5jdGlvbih2Ym94KSB7XHJcbiAgICAgICAgICAgIHRoaXMudmJveGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdmJveDogdmJveCxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2Ym94LmF2ZygpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGFsZXR0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZib3hlcy5tYXAoZnVuY3Rpb24odmIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2Yi5jb2xvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNpemU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52Ym94ZXMuc2l6ZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWFwOiBmdW5jdGlvbihjb2xvcikge1xyXG4gICAgICAgICAgICB2YXIgdmJveGVzID0gdGhpcy52Ym94ZXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmJveGVzLnNpemUoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmJveGVzLnBlZWsoaSkudmJveC5jb250YWlucyhjb2xvcikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmJveGVzLnBlZWsoaSkuY29sb3I7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmVhcmVzdChjb2xvcik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBuZWFyZXN0OiBmdW5jdGlvbihjb2xvcikge1xyXG4gICAgICAgICAgICB2YXIgdmJveGVzID0gdGhpcy52Ym94ZXMsXHJcbiAgICAgICAgICAgICAgICBkMSwgZDIsIHBDb2xvcjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Ym94ZXMuc2l6ZSgpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGQyID0gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KGNvbG9yWzBdIC0gdmJveGVzLnBlZWsoaSkuY29sb3JbMF0sIDIpICtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhjb2xvclsxXSAtIHZib3hlcy5wZWVrKGkpLmNvbG9yWzFdLCAyKSArXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coY29sb3JbMl0gLSB2Ym94ZXMucGVlayhpKS5jb2xvclsyXSwgMilcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZDIgPCBkMSB8fCBkMSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZDEgPSBkMjtcclxuICAgICAgICAgICAgICAgICAgICBwQ29sb3IgPSB2Ym94ZXMucGVlayhpKS5jb2xvcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcENvbG9yO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yY2VidzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIFhYWDogd29uJ3QgIHdvcmsgeWV0XHJcbiAgICAgICAgICAgIHZhciB2Ym94ZXMgPSB0aGlzLnZib3hlcztcclxuICAgICAgICAgICAgdmJveGVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHB2Lm5hdHVyYWxPcmRlcihwdi5zdW0oYS5jb2xvciksIHB2LnN1bShiLmNvbG9yKSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBmb3JjZSBkYXJrZXN0IGNvbG9yIHRvIGJsYWNrIGlmIGV2ZXJ5dGhpbmcgPCA1XHJcbiAgICAgICAgICAgIHZhciBsb3dlc3QgPSB2Ym94ZXNbMF0uY29sb3I7XHJcbiAgICAgICAgICAgIGlmIChsb3dlc3RbMF0gPCA1ICYmIGxvd2VzdFsxXSA8IDUgJiYgbG93ZXN0WzJdIDwgNSlcclxuICAgICAgICAgICAgICAgIHZib3hlc1swXS5jb2xvciA9IFswLCAwLCAwXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvcmNlIGxpZ2h0ZXN0IGNvbG9yIHRvIHdoaXRlIGlmIGV2ZXJ5dGhpbmcgPiAyNTFcclxuICAgICAgICAgICAgdmFyIGlkeCA9IHZib3hlcy5sZW5ndGggLSAxLFxyXG4gICAgICAgICAgICAgICAgaGlnaGVzdCA9IHZib3hlc1tpZHhdLmNvbG9yO1xyXG4gICAgICAgICAgICBpZiAoaGlnaGVzdFswXSA+IDI1MSAmJiBoaWdoZXN0WzFdID4gMjUxICYmIGhpZ2hlc3RbMl0gPiAyNTEpXHJcbiAgICAgICAgICAgICAgICB2Ym94ZXNbaWR4XS5jb2xvciA9IFsyNTUsIDI1NSwgMjU1XTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRBbGwocGl4ZWxzLCBzaG91bGRJZ25vcmUpIHtcclxuICAgICAgICB2YXIgaGlzdG9zaXplID0gMSA8PCAoMyAqIHNpZ2JpdHMpLFxyXG4gICAgICAgICAgICBoaXN0byA9IG5ldyBVaW50MzJBcnJheShoaXN0b3NpemUpLFxyXG4gICAgICAgICAgICBpbmRleCwgcnZhbCwgZ3ZhbCwgYnZhbDtcclxuICAgICAgICB2YXIgcm1pbiA9IDEwMDAwMDAsXHJcbiAgICAgICAgICAgIHJtYXggPSAwLFxyXG4gICAgICAgICAgICBnbWluID0gMTAwMDAwMCxcclxuICAgICAgICAgICAgZ21heCA9IDAsXHJcbiAgICAgICAgICAgIGJtaW4gPSAxMDAwMDAwLFxyXG4gICAgICAgICAgICBibWF4ID0gMDtcclxuXHJcbiAgICAgICAgdmFyIHBpeGVsQ291bnQgPSBwaXhlbHMubGVuZ3RoIC8gNCxcclxuICAgICAgICAgICAgaSA9IDA7XHJcblxyXG4gICAgICAgIC8vIFllcywgaXQgbWF0dGVyc1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2hvdWxkSWdub3JlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICB3aGlsZSAoaSA8IHBpeGVsQ291bnQpIHtcclxuICAgICAgICAgICAgICBvZmZzZXQgPSBpICogNDtcclxuICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgciA9IHBpeGVsc1tvZmZzZXQgKyAwXTtcclxuICAgICAgICAgICAgICBnID0gcGl4ZWxzW29mZnNldCArIDFdO1xyXG4gICAgICAgICAgICAgIGIgPSBwaXhlbHNbb2Zmc2V0ICsgMl07XHJcbiAgICAgICAgICAgICAgYSA9IHBpeGVsc1tvZmZzZXQgKyAzXTtcclxuICAgICAgICAgICAgICBpZiAoc2hvdWxkSWdub3JlKHIsIGcsIGIsIGEpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICBydmFsID0gciA+PiByc2hpZnQ7XHJcbiAgICAgICAgICAgICAgZ3ZhbCA9IGcgPj4gcnNoaWZ0O1xyXG4gICAgICAgICAgICAgIGJ2YWwgPSBiID4+IHJzaGlmdDtcclxuICAgICAgICAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgocnZhbCwgZ3ZhbCwgYnZhbCk7XHJcbiAgICAgICAgICAgICAgaGlzdG9baW5kZXhdKys7XHJcbiAgICAgICAgICAgICAgaWYgKHJ2YWwgPCBybWluKSBybWluID0gcnZhbDtcclxuICAgICAgICAgICAgICBlbHNlIGlmIChydmFsID4gcm1heCkgcm1heCA9IHJ2YWw7XHJcbiAgICAgICAgICAgICAgaWYgKGd2YWwgPCBnbWluKSBnbWluID0gZ3ZhbDtcclxuICAgICAgICAgICAgICBlbHNlIGlmIChndmFsID4gZ21heCkgZ21heCA9IGd2YWw7XHJcbiAgICAgICAgICAgICAgaWYgKGJ2YWwgPCBibWluKSBibWluID0gYnZhbDtcclxuICAgICAgICAgICAgICBlbHNlIGlmIChidmFsID4gYm1heCkgYm1heCA9IGJ2YWw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHdoaWxlIChpIDwgcGl4ZWxDb3VudCkge1xyXG4gICAgICAgICAgICAgIG9mZnNldCA9IGkgKiA0O1xyXG4gICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICByID0gcGl4ZWxzW29mZnNldCArIDBdO1xyXG4gICAgICAgICAgICAgIGcgPSBwaXhlbHNbb2Zmc2V0ICsgMV07XHJcbiAgICAgICAgICAgICAgYiA9IHBpeGVsc1tvZmZzZXQgKyAyXTtcclxuICAgICAgICAgICAgICBhID0gcGl4ZWxzW29mZnNldCArIDNdO1xyXG4gICAgICAgICAgICAgIHJ2YWwgPSByID4+IHJzaGlmdDtcclxuICAgICAgICAgICAgICBndmFsID0gZyA+PiByc2hpZnQ7XHJcbiAgICAgICAgICAgICAgYnZhbCA9IGIgPj4gcnNoaWZ0O1xyXG4gICAgICAgICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChydmFsLCBndmFsLCBidmFsKTtcclxuICAgICAgICAgICAgICBoaXN0b1tpbmRleF0rKztcclxuICAgICAgICAgICAgICBpZiAocnZhbCA8IHJtaW4pIHJtaW4gPSBydmFsO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKHJ2YWwgPiBybWF4KSBybWF4ID0gcnZhbDtcclxuICAgICAgICAgICAgICBpZiAoZ3ZhbCA8IGdtaW4pIGdtaW4gPSBndmFsO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGd2YWwgPiBnbWF4KSBnbWF4ID0gZ3ZhbDtcclxuICAgICAgICAgICAgICBpZiAoYnZhbCA8IGJtaW4pIGJtaW4gPSBidmFsO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGJ2YWwgPiBibWF4KSBibWF4ID0gYnZhbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBoaXN0bzogaGlzdG8sXHJcbiAgICAgICAgICB2Ym94OiBuZXcgVkJveChybWluLCBybWF4LCBnbWluLCBnbWF4LCBibWluLCBibWF4LCBoaXN0bylcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGhpc3RvICgxLWQgYXJyYXksIGdpdmluZyB0aGUgbnVtYmVyIG9mIHBpeGVscyBpblxyXG4gICAgLy8gZWFjaCBxdWFudGl6ZWQgcmVnaW9uIG9mIGNvbG9yIHNwYWNlKSwgb3IgbnVsbCBvbiBlcnJvclxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEhpc3RvKHBpeGVscywgc2hvdWxkSWdub3JlKSB7XHJcbiAgICAgICAgdmFyIGhpc3Rvc2l6ZSA9IDEgPDwgKDMgKiBzaWdiaXRzKSxcclxuICAgICAgICAgICAgaGlzdG8gPSBuZXcgVWludDMyQXJyYXkoaGlzdG9zaXplKSxcclxuICAgICAgICAgICAgaW5kZXgsIHJ2YWwsIGd2YWwsIGJ2YWw7XHJcblxyXG4gICAgICAgIHZhciBwaXhlbENvdW50ID0gcGl4ZWxzLmxlbmd0aCAvIDQsXHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG5cclxuICAgICAgICAvLyBZZXMsIGl0IG1hdHRlcnNcclxuICAgICAgICBpZiAodHlwZW9mIHNob3VsZElnbm9yZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgd2hpbGUgKGkgPCBwaXhlbENvdW50KSB7XHJcbiAgICAgICAgICAgICAgb2Zmc2V0ID0gaSAqIDQ7XHJcbiAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgIHIgPSBwaXhlbHNbb2Zmc2V0ICsgMF07XHJcbiAgICAgICAgICAgICAgZyA9IHBpeGVsc1tvZmZzZXQgKyAxXTtcclxuICAgICAgICAgICAgICBiID0gcGl4ZWxzW29mZnNldCArIDJdO1xyXG4gICAgICAgICAgICAgIGEgPSBwaXhlbHNbb2Zmc2V0ICsgM107XHJcbiAgICAgICAgICAgICAgaWYgKHNob3VsZElnbm9yZShyLCBnLCBiLCBhKSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgcnZhbCA9IHIgPj4gcnNoaWZ0O1xyXG4gICAgICAgICAgICAgIGd2YWwgPSBnID4+IHJzaGlmdDtcclxuICAgICAgICAgICAgICBidmFsID0gYiA+PiByc2hpZnQ7XHJcbiAgICAgICAgICAgICAgaW5kZXggPSBnZXRDb2xvckluZGV4KHJ2YWwsIGd2YWwsIGJ2YWwpO1xyXG4gICAgICAgICAgICAgIGhpc3RvW2luZGV4XSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB3aGlsZSAoaSA8IHBpeGVsQ291bnQpIHtcclxuICAgICAgICAgICAgICBvZmZzZXQgPSBpICogNDtcclxuICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgciA9IHBpeGVsc1tvZmZzZXQgKyAwXTtcclxuICAgICAgICAgICAgICBnID0gcGl4ZWxzW29mZnNldCArIDFdO1xyXG4gICAgICAgICAgICAgIGIgPSBwaXhlbHNbb2Zmc2V0ICsgMl07XHJcbiAgICAgICAgICAgICAgYSA9IHBpeGVsc1tvZmZzZXQgKyAzXTtcclxuICAgICAgICAgICAgICBydmFsID0gciA+PiByc2hpZnQ7XHJcbiAgICAgICAgICAgICAgZ3ZhbCA9IGcgPj4gcnNoaWZ0O1xyXG4gICAgICAgICAgICAgIGJ2YWwgPSBiID4+IHJzaGlmdDtcclxuICAgICAgICAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgocnZhbCwgZ3ZhbCwgYnZhbCk7XHJcbiAgICAgICAgICAgICAgaGlzdG9baW5kZXhdKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaGlzdG87XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmJveEZyb21QaXhlbHMocGl4ZWxzLCBoaXN0bywgc2hvdWxkSWdub3JlKSB7XHJcbiAgICAgICAgdmFyIHJtaW4gPSAxMDAwMDAwLFxyXG4gICAgICAgICAgICBybWF4ID0gMCxcclxuICAgICAgICAgICAgZ21pbiA9IDEwMDAwMDAsXHJcbiAgICAgICAgICAgIGdtYXggPSAwLFxyXG4gICAgICAgICAgICBibWluID0gMTAwMDAwMCxcclxuICAgICAgICAgICAgYm1heCA9IDAsXHJcbiAgICAgICAgICAgIHJ2YWwsIGd2YWwsIGJ2YWw7XHJcbiAgICAgICAgLy8gZmluZCBtaW4vbWF4XHJcbiAgICAgICAgdmFyIHBpeGVsQ291bnQgPSBwaXhlbHMubGVuZ3RoIC8gNCxcclxuICAgICAgICAgICAgaSA9IDA7XHJcblxyXG4gICAgICAgIC8vIFllcywgaXQgbWF0dGVyc1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2hvdWxkSWdub3JlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICB3aGlsZSAoaSA8IHBpeGVsQ291bnQpIHtcclxuICAgICAgICAgICAgICBvZmZzZXQgPSBpICogNDtcclxuICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgciA9IHBpeGVsc1tvZmZzZXQgKyAwXTtcclxuICAgICAgICAgICAgICBnID0gcGl4ZWxzW29mZnNldCArIDFdO1xyXG4gICAgICAgICAgICAgIGIgPSBwaXhlbHNbb2Zmc2V0ICsgMl07XHJcbiAgICAgICAgICAgICAgYSA9IHBpeGVsc1tvZmZzZXQgKyAzXTtcclxuICAgICAgICAgICAgICBpZiAoc2hvdWxkSWdub3JlKHIsIGcsIGIsIGEpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICBydmFsID0gciA+PiByc2hpZnQ7XHJcbiAgICAgICAgICAgICAgZ3ZhbCA9IGcgPj4gcnNoaWZ0O1xyXG4gICAgICAgICAgICAgIGJ2YWwgPSBiID4+IHJzaGlmdDtcclxuICAgICAgICAgICAgICBpZiAocnZhbCA8IHJtaW4pIHJtaW4gPSBydmFsO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKHJ2YWwgPiBybWF4KSBybWF4ID0gcnZhbDtcclxuICAgICAgICAgICAgICBpZiAoZ3ZhbCA8IGdtaW4pIGdtaW4gPSBndmFsO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGd2YWwgPiBnbWF4KSBnbWF4ID0gZ3ZhbDtcclxuICAgICAgICAgICAgICBpZiAoYnZhbCA8IGJtaW4pIGJtaW4gPSBidmFsO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGJ2YWwgPiBibWF4KSBibWF4ID0gYnZhbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IHBpeGVsQ291bnQpIHtcclxuICAgICAgICAgICAgICBvZmZzZXQgPSBpICogNDtcclxuICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgciA9IHBpeGVsc1tvZmZzZXQgKyAwXTtcclxuICAgICAgICAgICAgICBnID0gcGl4ZWxzW29mZnNldCArIDFdO1xyXG4gICAgICAgICAgICAgIGIgPSBwaXhlbHNbb2Zmc2V0ICsgMl07XHJcbiAgICAgICAgICAgICAgYSA9IHBpeGVsc1tvZmZzZXQgKyAzXTtcclxuICAgICAgICAgICAgICBydmFsID0gciA+PiByc2hpZnQ7XHJcbiAgICAgICAgICAgICAgZ3ZhbCA9IGcgPj4gcnNoaWZ0O1xyXG4gICAgICAgICAgICAgIGJ2YWwgPSBiID4+IHJzaGlmdDtcclxuICAgICAgICAgICAgICBpZiAocnZhbCA8IHJtaW4pIHJtaW4gPSBydmFsO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKHJ2YWwgPiBybWF4KSBybWF4ID0gcnZhbDtcclxuICAgICAgICAgICAgICBpZiAoZ3ZhbCA8IGdtaW4pIGdtaW4gPSBndmFsO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGd2YWwgPiBnbWF4KSBnbWF4ID0gZ3ZhbDtcclxuICAgICAgICAgICAgICBpZiAoYnZhbCA8IGJtaW4pIGJtaW4gPSBidmFsO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGJ2YWwgPiBibWF4KSBibWF4ID0gYnZhbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWQm94KHJtaW4sIHJtYXgsIGdtaW4sIGdtYXgsIGJtaW4sIGJtYXgsIGhpc3RvKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtZWRpYW5DdXRBcHBseShoaXN0bywgdmJveCkge1xyXG4gICAgICAgIGlmICghdmJveC5jb3VudCgpKSByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciBydyA9IHZib3gucjIgLSB2Ym94LnIxICsgMSxcclxuICAgICAgICAgICAgZ3cgPSB2Ym94LmcyIC0gdmJveC5nMSArIDEsXHJcbiAgICAgICAgICAgIGJ3ID0gdmJveC5iMiAtIHZib3guYjEgKyAxLFxyXG4gICAgICAgICAgICBtYXh3ID0gcHYubWF4KFtydywgZ3csIGJ3XSk7XHJcbiAgICAgICAgLy8gb25seSBvbmUgcGl4ZWwsIG5vIHNwbGl0XHJcbiAgICAgICAgaWYgKHZib3guY291bnQoKSA9PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbdmJveC5jb3B5KCldXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIEZpbmQgdGhlIHBhcnRpYWwgc3VtIGFycmF5cyBhbG9uZyB0aGUgc2VsZWN0ZWQgYXhpcy4gKi9cclxuICAgICAgICB2YXIgdG90YWwgPSAwLFxyXG4gICAgICAgICAgICBwYXJ0aWFsc3VtLFxyXG4gICAgICAgICAgICBsb29rYWhlYWRzdW0sXHJcbiAgICAgICAgICAgIGksIGosIGssIHN1bSwgaW5kZXg7XHJcbiAgICAgICAgLy8gdmFyIEQgPSBbJ3InLCAnZycsICdiJ10sXHJcbiAgICAgICAgLy8gICBpbmRleGVyID0gZ2V0Q29sb3JJbmRleDtcclxuICAgICAgICAvLyBpZiAobWF4dyA9PSBndykge1xyXG4gICAgICAgIC8vICAgRCA9IFsnZycsICdyJywgJ2InXTtcclxuICAgICAgICAvLyAgIGluZGV4ZXIgPSBmdW5jdGlvbihnLCByLCBiKSB7IHJldHVybiBnZXRDb2xvckluZGV4KHIsIGcsIGIpOyB9O1xyXG4gICAgICAgIC8vIH0gZWxzZSBpZiAobWF4dyA9PSBidykge1xyXG4gICAgICAgIC8vICAgaW5kZXhlciA9IGZ1bmN0aW9uKGIsIHIsIGcpIHsgcmV0dXJuIGdldENvbG9ySW5kZXgociwgZywgYik7IH07XHJcbiAgICAgICAgLy8gICBEID0gWydiJywgJ3InLCAnZyddO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBwYXJ0aWFsc3VtID0gbmV3IFVpbnQzMkFycmF5KHZib3hbRFswXSArIFwiMlwiXSArIDEpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZib3hbRFswXSArIFwiMlwiXSlcclxuICAgICAgICAvLyBmb3IgKGkgPSB2Ym94W0RbMF0gKyBcIjFcIl07IGkgPD0gdmJveFtEWzBdICsgXCIyXCJdOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgc3VtID0gMDtcclxuICAgICAgICAvLyAgICAgZm9yIChqID0gdmJveFtEWzFdICsgXCIxXCJdOyBqIDw9IHZib3hbRFsxXSArIFwiMlwiXTsgaisrKSB7XHJcbiAgICAgICAgLy8gICAgICAgICBmb3IgKGsgPSB2Ym94W0RbMl0gKyBcIjFcIl07IGsgPD0gdmJveFtEWzJdICsgXCIyXCJdOyBrKyspIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICBpbmRleCA9IGluZGV4ZXIoaSwgaiwgayk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgc3VtICs9IGhpc3RvW2luZGV4XTtcclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vICAgICB0b3RhbCArPSBzdW07XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGkgKyBcIi0+XCIgKyB0b3RhbClcclxuICAgICAgICAvLyAgICAgcGFydGlhbHN1bVtpXSA9IHRvdGFsO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICB2YXIgbWF4ZCA9ICdiJztcclxuICAgICAgICBpZiAobWF4dyA9PSBydykge1xyXG4gICAgICAgICAgICBtYXhkID0gJ3InO1xyXG4gICAgICAgICAgICBwYXJ0aWFsc3VtID0gbmV3IFVpbnQzMkFycmF5KHZib3gucjIgKyAxKTtcclxuICAgICAgICAgICAgZm9yIChpID0gdmJveC5yMTsgaSA8PSB2Ym94LnIyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGogPSB2Ym94LmcxOyBqIDw9IHZib3guZzI7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IHZib3guYjE7IGsgPD0gdmJveC5iMjsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChpLCBqLCBrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtICs9IGhpc3RvW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0b3RhbCArPSBzdW07XHJcbiAgICAgICAgICAgICAgICBwYXJ0aWFsc3VtW2ldID0gdG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG1heHcgPT0gZ3cpIHtcclxuICAgICAgICAgICAgbWF4ZCA9ICdnJztcclxuICAgICAgICAgICAgcGFydGlhbHN1bSA9IG5ldyBVaW50MzJBcnJheSh2Ym94LmcyICsgMSk7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IHZib3guZzE7IGkgPD0gdmJveC5nMjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBzdW0gPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChqID0gdmJveC5yMTsgaiA8PSB2Ym94LnIyOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSB2Ym94LmIxOyBrIDw9IHZib3guYjI7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgoaiwgaSwgayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bSArPSBoaXN0b1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdG90YWwgKz0gc3VtO1xyXG4gICAgICAgICAgICAgICAgcGFydGlhbHN1bVtpXSA9IHRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHsgLyogbWF4dyA9PSBidyAqL1xyXG4gICAgICAgICAgICAvLyBtYXhkID0gJ2InO1xyXG4gICAgICAgICAgICBwYXJ0aWFsc3VtID0gbmV3IFVpbnQzMkFycmF5KHZib3guYjIgKyAxKTtcclxuICAgICAgICAgICAgZm9yIChpID0gdmJveC5iMTsgaSA8PSB2Ym94LmIyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGogPSB2Ym94LnIxOyBqIDw9IHZib3gucjI7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IHZib3guZzE7IGsgPD0gdmJveC5nMjsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChqLCBrLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtICs9IGhpc3RvW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0b3RhbCArPSBzdW07XHJcbiAgICAgICAgICAgICAgICBwYXJ0aWFsc3VtW2ldID0gdG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNwbGl0UG9pbnQgPSAtMTtcclxuICAgICAgICBsb29rYWhlYWRzdW0gPSBuZXcgVWludDMyQXJyYXkocGFydGlhbHN1bS5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJ0aWFsc3VtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgZCA9IHBhcnRpYWxzdW1baV07XHJcbiAgICAgICAgICBpZiAoc3BsaXRQb2ludCA8IDAgJiYgZCA+ICh0b3RhbCAvIDIpKSBzcGxpdFBvaW50ID0gaTtcclxuICAgICAgICAgIGxvb2thaGVhZHN1bVtpXSA9IHRvdGFsIC0gZFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBwYXJ0aWFsc3VtLmZvckVhY2goZnVuY3Rpb24oZCwgaSkge1xyXG4gICAgICAgIC8vICAgaWYgKHNwbGl0UG9pbnQgPCAwICYmIGQgPiAodG90YWwgLyAyKSkgc3BsaXRQb2ludCA9IGlcclxuICAgICAgICAvLyAgICAgbG9va2FoZWFkc3VtW2ldID0gdG90YWwgLSBkXHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjdXQnKVxyXG4gICAgICAgIGZ1bmN0aW9uIGRvQ3V0KGNvbG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBkaW0xID0gY29sb3IgKyAnMScsXHJcbiAgICAgICAgICAgICAgICBkaW0yID0gY29sb3IgKyAnMicsXHJcbiAgICAgICAgICAgICAgICBsZWZ0LCByaWdodCwgdmJveDEsIHZib3gyLCBkMiwgY291bnQyID0gMCxcclxuICAgICAgICAgICAgICAgIGkgPSBzcGxpdFBvaW50O1xyXG4gICAgICAgICAgICB2Ym94MSA9IHZib3guY29weSgpO1xyXG4gICAgICAgICAgICB2Ym94MiA9IHZib3guY29weSgpO1xyXG4gICAgICAgICAgICBsZWZ0ID0gaSAtIHZib3hbZGltMV07XHJcbiAgICAgICAgICAgIHJpZ2h0ID0gdmJveFtkaW0yXSAtIGk7XHJcbiAgICAgICAgICAgIGlmIChsZWZ0IDw9IHJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBkMiA9IE1hdGgubWluKHZib3hbZGltMl0gLSAxLCB+fiAoaSArIHJpZ2h0IC8gMikpO1xyXG4gICAgICAgICAgICAgICAgZDIgPSBNYXRoLm1heCgwLCBkMik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkMiA9IE1hdGgubWF4KHZib3hbZGltMV0sIH5+IChpIC0gMSAtIGxlZnQgLyAyKSk7XHJcbiAgICAgICAgICAgICAgICBkMiA9IE1hdGgubWluKHZib3hbZGltMl0sIGQyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwYXJ0aWFsc3VtW2QyXSlcclxuICAgICAgICAgICAgLy8gYXZvaWQgMC1jb3VudCBib3hlc1xyXG4gICAgICAgICAgICB3aGlsZSAoIXBhcnRpYWxzdW1bZDJdKSBkMisrO1xyXG4gICAgICAgICAgICBjb3VudDIgPSBsb29rYWhlYWRzdW1bZDJdO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnLV8tJylcclxuICAgICAgICAgICAgd2hpbGUgKCFjb3VudDIgJiYgcGFydGlhbHN1bVtkMiAtIDFdKSBjb3VudDIgPSBsb29rYWhlYWRzdW1bLS1kMl07XHJcbiAgICAgICAgICAgIC8vIHNldCBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIHZib3gxW2RpbTJdID0gZDI7XHJcbiAgICAgICAgICAgIHZib3gyW2RpbTFdID0gdmJveDFbZGltMl0gKyAxO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmJveCBjb3VudHM6JywgdmJveC5jb3VudCgpLCB2Ym94MS5jb3VudCgpLCB2Ym94Mi5jb3VudCgpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFt2Ym94MSwgdmJveDJdO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBjdXQgcGxhbmVzXHJcbiAgICAgICAgcmV0dXJuIGRvQ3V0KG1heGQpO1xyXG4gICAgICAgIC8vIHJldHVybiBtYXh3ID09IHJ3ID8gZG9DdXQoJ3InKSA6XHJcbiAgICAgICAgLy8gICAgIG1heHcgPT0gZ3cgPyBkb0N1dCgnZycpIDpcclxuICAgICAgICAvLyAgICAgZG9DdXQoJ2InKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBxdWFudGl6ZShwaXhlbHMsIG9wdHMpIHtcclxuICAgICAgICB2YXIgbWF4Y29sb3JzID0gb3B0cy5jb2xvckNvdW50O1xyXG4gICAgICAgIC8vIHNob3J0LWNpcmN1aXRcclxuICAgICAgICBpZiAoIXBpeGVscy5sZW5ndGggfHwgbWF4Y29sb3JzIDwgMiB8fCBtYXhjb2xvcnMgPiAyNTYpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3dyb25nIG51bWJlciBvZiBtYXhjb2xvcnMnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhhc0ZpbHRlcnMgPSBBcnJheS5pc0FycmF5KG9wdHMuZmlsdGVycykgJiYgb3B0cy5maWx0ZXJzLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgZnVuY3Rpb24gc2hvdWxkSWdub3JlKHIsIGcsIGIsIGEpIHtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3B0cy5maWx0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBmID0gb3B0cy5maWx0ZXJzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIWYociwgZywgYiwgYSkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHIgPSBnZXRBbGwocGl4ZWxzLCBoYXNGaWx0ZXJzID8gaG91bGRJZ25vcmUgOiBudWxsKTtcclxuICAgICAgICAvLyBYWFg6IGNoZWNrIGNvbG9yIGNvbnRlbnQgYW5kIGNvbnZlcnQgdG8gZ3JheXNjYWxlIGlmIGluc3VmZmljaWVudFxyXG5cclxuICAgICAgICAvLyB2YXIgaGlzdG8gPSBnZXRIaXN0byhwaXhlbHMsIGhhc0ZpbHRlcnMgPyBzaG91bGRJZ25vcmUgOiBudWxsKSxcclxuICAgICAgICB2YXIgaGlzdG8gPSByLmhpc3RvLFxyXG4gICAgICAgICAgICBoaXN0b3NpemUgPSAxIDw8ICgzICogc2lnYml0cyk7XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIHRoYXQgd2UgYXJlbid0IGJlbG93IG1heGNvbG9ycyBhbHJlYWR5XHJcbiAgICAgICAgdmFyIG5Db2xvcnMgPSBPYmplY3Qua2V5cyhoaXN0bykubGVuZ3RoO1xyXG4gICAgICAgIGlmIChuQ29sb3JzIDw9IG1heGNvbG9ycykge1xyXG4gICAgICAgICAgICAvLyBYWFg6IGdlbmVyYXRlIHRoZSBuZXcgY29sb3JzIGZyb20gdGhlIGhpc3RvIGFuZCByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgYmVnaW5uaW5nIHZib3ggZnJvbSB0aGUgY29sb3JzXHJcbiAgICAgICAgLy8gdmFyIHZib3ggPSB2Ym94RnJvbVBpeGVscyhwaXhlbHMsIGhpc3RvLCBoYXNGaWx0ZXJzID8gc2hvdWxkSWdub3JlIDogbnVsbCksXHJcbiAgICAgICAgdmFyIHZib3ggPSByLnZib3gsXHJcbiAgICAgICAgICAgIHBxID0gbmV3IFBRdWV1ZShmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHYubmF0dXJhbE9yZGVyKGEuY291bnQoKSwgYi5jb3VudCgpKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBwcS5wdXNoKHZib3gpO1xyXG5cclxuICAgICAgICAvLyBpbm5lciBmdW5jdGlvbiB0byBkbyB0aGUgaXRlcmF0aW9uXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGl0ZXIobGgsIHRhcmdldCkge1xyXG4gICAgICAgICAgICB2YXIgbmNvbG9ycyA9IDEsXHJcbiAgICAgICAgICAgICAgICBuaXRlcnMgPSAwLFxyXG4gICAgICAgICAgICAgICAgdmJveDtcclxuICAgICAgICAgICAgd2hpbGUgKG5pdGVycyA8IG1heEl0ZXJhdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHZib3ggPSBsaC5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmICghdmJveC5jb3VudCgpKSB7IC8qIGp1c3QgcHV0IGl0IGJhY2sgKi9cclxuICAgICAgICAgICAgICAgICAgICAvLyBsaC5wdXNoKHZib3gpOyAvLyBNYXliZSBub3RcclxuICAgICAgICAgICAgICAgICAgICBuaXRlcnMrKztcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGRvIHRoZSBjdXRcclxuICAgICAgICAgICAgICAgIHZhciB2Ym94ZXMgPSBtZWRpYW5DdXRBcHBseShoaXN0bywgdmJveCksXHJcbiAgICAgICAgICAgICAgICAgICAgdmJveDEgPSB2Ym94ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdmJveDIgPSB2Ym94ZXNbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF2Ym94MSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidmJveDEgbm90IGRlZmluZWQ7IHNob3VsZG4ndCBoYXBwZW4hXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxoLnB1c2godmJveDEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZib3gyKSB7IC8qIHZib3gyIGNhbiBiZSBudWxsICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGgucHVzaCh2Ym94Mik7XHJcbiAgICAgICAgICAgICAgICAgICAgbmNvbG9ycysrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5jb2xvcnMgPj0gdGFyZ2V0KSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAobml0ZXJzKysgPiBtYXhJdGVyYXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaXJzdCBzZXQgb2YgY29sb3JzLCBzb3J0ZWQgYnkgcG9wdWxhdGlvblxyXG4gICAgICAgIGl0ZXIocHEsIGZyYWN0QnlQb3B1bGF0aW9ucyAqIG1heGNvbG9ycyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocHEuc2l6ZSgpLCBwcS5kZWJ1ZygpLmxlbmd0aCwgcHEuZGVidWcoKS5zbGljZSgpKTtcclxuXHJcbiAgICAgICAgLy8gUmUtc29ydCBieSB0aGUgcHJvZHVjdCBvZiBwaXhlbCBvY2N1cGFuY3kgdGltZXMgdGhlIHNpemUgaW4gY29sb3Igc3BhY2UuXHJcbiAgICAgICAgdmFyIHBxMiA9IG5ldyBQUXVldWUoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gcHYubmF0dXJhbE9yZGVyKGEuY291bnQoKSAqIGEudm9sdW1lKCksIGIuY291bnQoKSAqIGIudm9sdW1lKCkpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd2hpbGUgKHBxLnNpemUoKSkge1xyXG4gICAgICAgICAgICBwcTIucHVzaChwcS5wb3AoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBuZXh0IHNldCAtIGdlbmVyYXRlIHRoZSBtZWRpYW4gY3V0cyB1c2luZyB0aGUgKG5waXggKiB2b2wpIHNvcnRpbmcuXHJcbiAgICAgICAgaXRlcihwcTIsIG1heGNvbG9ycyAtIHBxMi5zaXplKCkpO1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGFjdHVhbCBjb2xvcnNcclxuICAgICAgICB2YXIgY21hcCA9IG5ldyBDTWFwKCk7XHJcbiAgICAgICAgd2hpbGUgKHBxMi5zaXplKCkpIHtcclxuICAgICAgICAgICAgdmFyIHYgPSBwcTIucG9wKCksXHJcbiAgICAgICAgICAgICAgYyA9IHZib3guYXZnKCk7XHJcbiAgICAgICAgICAgIGlmICghaGFzRmlsdGVycyB8fCAhc2hvdWxkSWdub3JlKGNbMF0sIGNbMV0sIGNbMl0sIDI1NSkpIHtcclxuICAgICAgICAgICAgICBjbWFwLnB1c2godik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjbWFwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcXVhbnRpemU6IHF1YW50aXplLFxyXG4gICAgICAgIGdldEFsbDogZ2V0QWxsLFxyXG4gICAgICAgIG1lZGlhbkN1dEFwcGx5OiBtZWRpYW5DdXRBcHBseVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNTUNRLnF1YW50aXplXHJcbm1vZHVsZS5leHBvcnRzLmdldEFsbCA9IE1NQ1EuZ2V0QWxsXHJcbm1vZHVsZS5leHBvcnRzLnNwbGl0Qm94ID0gTU1DUS5tZWRpYW5DdXRBcHBseVxyXG4iXX0=
