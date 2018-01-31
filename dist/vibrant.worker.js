/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 194);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(43);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(105),
    getValue = __webpack_require__(108);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(42),
    baseKeys = __webpack_require__(90),
    isArrayLike = __webpack_require__(12);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6),
    getRawTag = __webpack_require__(84),
    objectToString = __webpack_require__(85);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(1);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(62),
    baseAssignValue = __webpack_require__(63);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Bluebird = __webpack_require__(14);
exports.DELTAE94_DIFF_STATUS = {
    NA: 0,
    PERFECT: 1,
    CLOSE: 2,
    GOOD: 10,
    SIMILAR: 50
};
exports.SIGBITS = 5;
exports.RSHIFT = 8 - exports.SIGBITS;
function defer() {
    var resolve;
    var reject;
    var promise = new Bluebird(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });
    return { resolve: resolve, reject: reject, promise: promise };
}
exports.defer = defer;
function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m === null ? null : [m[1], m[2], m[3]].map(function (s) { return parseInt(s, 16); });
}
exports.hexToRgb = hexToRgb;
function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
}
exports.rgbToHex = rgbToHex;
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var s;
    var l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    }
    else {
        var d = max - min;
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
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}
exports.rgbToHsl = rgbToHsl;
function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    function hue2rgb(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    if (s === 0) {
        r = g = b = l;
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - (1 / 3));
    }
    return [
        r * 255,
        g * 255,
        b * 255
    ];
}
exports.hslToRgb = hslToRgb;
function rgbToXyz(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    r = r > 0.04045 ? Math.pow((r + 0.005) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.005) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.005) / 1.055, 2.4) : b / 12.92;
    r *= 100;
    g *= 100;
    b *= 100;
    var x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    var y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    var z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x, y, z];
}
exports.rgbToXyz = rgbToXyz;
function xyzToCIELab(x, y, z) {
    var REF_X = 95.047;
    var REF_Y = 100;
    var REF_Z = 108.883;
    x /= REF_X;
    y /= REF_Y;
    z /= REF_Z;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    var L = 116 * y - 16;
    var a = 500 * (x - y);
    var b = 200 * (y - z);
    return [L, a, b];
}
exports.xyzToCIELab = xyzToCIELab;
function rgbToCIELab(r, g, b) {
    var _a = rgbToXyz(r, g, b), x = _a[0], y = _a[1], z = _a[2];
    return xyzToCIELab(x, y, z);
}
exports.rgbToCIELab = rgbToCIELab;
function deltaE94(lab1, lab2) {
    var WEIGHT_L = 1;
    var WEIGHT_C = 1;
    var WEIGHT_H = 1;
    var L1 = lab1[0], a1 = lab1[1], b1 = lab1[2];
    var L2 = lab2[0], a2 = lab2[1], b2 = lab2[2];
    var dL = L1 - L2;
    var da = a1 - a2;
    var db = b1 - b2;
    var xC1 = Math.sqrt(a1 * a1 + b1 * b1);
    var xC2 = Math.sqrt(a2 * a2 + b2 * b2);
    var xDL = L2 - L1;
    var xDC = xC2 - xC1;
    var xDE = Math.sqrt(dL * dL + da * da + db * db);
    var xDH = (Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC)))
        ? Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC)
        : 0;
    var xSC = 1 + 0.045 * xC1;
    var xSH = 1 + 0.015 * xC1;
    xDL /= WEIGHT_L;
    xDC /= WEIGHT_C * xSC;
    xDH /= WEIGHT_H * xSH;
    return Math.sqrt(xDL * xDL + xDC * xDC + xDH * xDH);
}
exports.deltaE94 = deltaE94;
function rgbDiff(rgb1, rgb2) {
    var lab1 = rgbToCIELab.apply(undefined, rgb1);
    var lab2 = rgbToCIELab.apply(undefined, rgb2);
    return deltaE94(lab1, lab2);
}
exports.rgbDiff = rgbDiff;
function hexDiff(hex1, hex2) {
    var rgb1 = hexToRgb(hex1);
    var rgb2 = hexToRgb(hex2);
    return rgbDiff(rgb1, rgb2);
}
exports.hexDiff = hexDiff;
function getColorDiffStatus(d) {
    if (d < exports.DELTAE94_DIFF_STATUS.NA)
        return 'N/A';
    // Not perceptible by human eyes
    if (d <= exports.DELTAE94_DIFF_STATUS.PERFECT)
        return 'Perfect';
    // Perceptible through close observation
    if (d <= exports.DELTAE94_DIFF_STATUS.CLOSE)
        return 'Close';
    // Perceptible at a glance
    if (d <= exports.DELTAE94_DIFF_STATUS.GOOD)
        return 'Good';
    // Colors are more similar than opposite
    if (d < exports.DELTAE94_DIFF_STATUS.SIMILAR)
        return 'Similar';
    return 'Wrong';
}
exports.getColorDiffStatus = getColorDiffStatus;
function getColorIndex(r, g, b) {
    return (r << (2 * exports.SIGBITS)) + (g << exports.SIGBITS) + b;
}
exports.getColorIndex = getColorIndex;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(46),
    isLength = __webpack_require__(24);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2017 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
/**
 * bluebird build version 3.5.1
 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
*/
!function(e){if(true)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Promise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(1);
    ret.setUnwrap();
    ret.init();
    return promise;
}

Promise.any = function (promises) {
    return any(promises);
};

Promise.prototype.any = function () {
    return any(this);
};

};

},{}],2:[function(_dereq_,module,exports){
"use strict";
var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = _dereq_("./schedule");
var Queue = _dereq_("./queue");
var util = _dereq_("./util");

function Async() {
    this._customScheduler = false;
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._haveDrainedQueues = false;
    this._trampolineEnabled = true;
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();
    };
    this._schedule = schedule;
}

Async.prototype.setScheduler = function(fn) {
    var prev = this._schedule;
    this._schedule = fn;
    this._customScheduler = true;
    return prev;
};

Async.prototype.hasCustomScheduler = function() {
    return this._customScheduler;
};

Async.prototype.enableTrampoline = function() {
    this._trampolineEnabled = true;
};

Async.prototype.disableTrampolineIfNecessary = function() {
    if (util.hasDevTools) {
        this._trampolineEnabled = false;
    }
};

Async.prototype.haveItemsQueued = function () {
    return this._isTickUsed || this._haveDrainedQueues;
};


Async.prototype.fatalError = function(e, isNode) {
    if (isNode) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
            "\n");
        process.exit(2);
    } else {
        this.throwLater(e);
    }
};

Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
        arg = fn;
        fn = function () { throw arg; };
    }
    if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
            fn(arg);
        }, 0);
    } else try {
        this._schedule(function() {
            fn(arg);
        });
    } catch (e) {
        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
};

function AsyncInvokeLater(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncInvoke(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncSettlePromises(promise) {
    this._normalQueue._pushOne(promise);
    this._queueTick();
}

if (!util.hasDevTools) {
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
} else {
    Async.prototype.invokeLater = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvokeLater.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                setTimeout(function() {
                    fn.call(receiver, arg);
                }, 100);
            });
        }
    };

    Async.prototype.invoke = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvoke.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                fn.call(receiver, arg);
            });
        }
    };

    Async.prototype.settlePromises = function(promise) {
        if (this._trampolineEnabled) {
            AsyncSettlePromises.call(this, promise);
        } else {
            this._schedule(function() {
                promise._settlePromises();
            });
        }
    };
}

Async.prototype._drainQueue = function(queue) {
    while (queue.length() > 0) {
        var fn = queue.shift();
        if (typeof fn !== "function") {
            fn._settlePromises();
            continue;
        }
        var receiver = queue.shift();
        var arg = queue.shift();
        fn.call(receiver, arg);
    }
};

Async.prototype._drainQueues = function () {
    this._drainQueue(this._normalQueue);
    this._reset();
    this._haveDrainedQueues = true;
    this._drainQueue(this._lateQueue);
};

Async.prototype._queueTick = function () {
    if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
    }
};

Async.prototype._reset = function () {
    this._isTickUsed = false;
};

module.exports = Async;
module.exports.firstLineError = firstLineError;

},{"./queue":26,"./schedule":29,"./util":36}],3:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
var calledBind = false;
var rejectThis = function(_, e) {
    this._reject(e);
};

var targetRejected = function(e, context) {
    context.promiseRejectionQueued = true;
    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
};

var bindingResolved = function(thisArg, context) {
    if (((this._bitField & 50397184) === 0)) {
        this._resolveCallback(context.target);
    }
};

var bindingRejected = function(e, context) {
    if (!context.promiseRejectionQueued) this._reject(e);
};

Promise.prototype.bind = function (thisArg) {
    if (!calledBind) {
        calledBind = true;
        Promise.prototype._propagateFrom = debug.propagateFromFunction();
        Promise.prototype._boundValue = debug.boundValueFunction();
    }
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 1);
    var target = this._target();
    ret._setBoundTo(maybePromise);
    if (maybePromise instanceof Promise) {
        var context = {
            promiseRejectionQueued: false,
            promise: ret,
            target: target,
            bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, undefined, ret, context);
        maybePromise._then(
            bindingResolved, bindingRejected, undefined, ret, context);
        ret._setOnCancel(maybePromise);
    } else {
        ret._resolveCallback(target);
    }
    return ret;
};

Promise.prototype._setBoundTo = function (obj) {
    if (obj !== undefined) {
        this._bitField = this._bitField | 2097152;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~2097152);
    }
};

Promise.prototype._isBound = function () {
    return (this._bitField & 2097152) === 2097152;
};

Promise.bind = function (thisArg, value) {
    return Promise.resolve(value).bind(thisArg);
};
};

},{}],4:[function(_dereq_,module,exports){
"use strict";
var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict() {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
var bluebird = _dereq_("./promise")();
bluebird.noConflict = noConflict;
module.exports = bluebird;

},{"./promise":22}],5:[function(_dereq_,module,exports){
"use strict";
var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = _dereq_("./util");
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

var getMethodCaller;
var getGetter;
if (false) {
var makeMethodCaller = function (methodName) {
    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
};

var makeGetter = function (propertyName) {
    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
};

var getCompiled = function(name, compiler, cache) {
    var ret = cache[name];
    if (typeof ret !== "function") {
        if (!isIdentifier(name)) {
            return null;
        }
        ret = compiler(name);
        cache[name] = ret;
        cache[" size"]++;
        if (cache[" size"] > 512) {
            var keys = Object.keys(cache);
            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
            cache[" size"] = keys.length - 256;
        }
    }
    return ret;
};

getMethodCaller = function(name) {
    return getCompiled(name, makeMethodCaller, callerCache);
};

getGetter = function(name) {
    return getCompiled(name, makeGetter, getterCache);
};
}

function ensureMethod(obj, methodName) {
    var fn;
    if (obj != null) fn = obj[methodName];
    if (typeof fn !== "function") {
        var message = "Object " + util.classString(obj) + " has no method '" +
            util.toString(methodName) + "'";
        throw new Promise.TypeError(message);
    }
    return fn;
}

function caller(obj) {
    var methodName = this.pop();
    var fn = ensureMethod(obj, methodName);
    return fn.apply(obj, this);
}
Promise.prototype.call = function (methodName) {
    var args = [].slice.call(arguments, 1);;
    if (false) {
        if (canEvaluate) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
                return this._then(
                    maybeCaller, undefined, undefined, args, undefined);
            }
        }
    }
    args.push(methodName);
    return this._then(caller, undefined, undefined, args, undefined);
};

function namedGetter(obj) {
    return obj[this];
}
function indexedGetter(obj) {
    var index = +this;
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}
Promise.prototype.get = function (propertyName) {
    var isIndex = (typeof propertyName === "number");
    var getter;
    if (!isIndex) {
        if (canEvaluate) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
        } else {
            getter = namedGetter;
        }
    } else {
        getter = indexedGetter;
    }
    return this._then(getter, undefined, undefined, propertyName, undefined);
};
};

},{"./util":36}],6:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, PromiseArray, apiRejection, debug) {
var util = _dereq_("./util");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

Promise.prototype["break"] = Promise.prototype.cancel = function() {
    if (!debug.cancellation()) return this._warn("cancellation is disabled");

    var promise = this;
    var child = promise;
    while (promise._isCancellable()) {
        if (!promise._cancelBy(child)) {
            if (child._isFollowing()) {
                child._followee().cancel();
            } else {
                child._cancelBranched();
            }
            break;
        }

        var parent = promise._cancellationParent;
        if (parent == null || !parent._isCancellable()) {
            if (promise._isFollowing()) {
                promise._followee().cancel();
            } else {
                promise._cancelBranched();
            }
            break;
        } else {
            if (promise._isFollowing()) promise._followee().cancel();
            promise._setWillBeCancelled();
            child = promise;
            promise = parent;
        }
    }
};

Promise.prototype._branchHasCancelled = function() {
    this._branchesRemainingToCancel--;
};

Promise.prototype._enoughBranchesHaveCancelled = function() {
    return this._branchesRemainingToCancel === undefined ||
           this._branchesRemainingToCancel <= 0;
};

Promise.prototype._cancelBy = function(canceller) {
    if (canceller === this) {
        this._branchesRemainingToCancel = 0;
        this._invokeOnCancel();
        return true;
    } else {
        this._branchHasCancelled();
        if (this._enoughBranchesHaveCancelled()) {
            this._invokeOnCancel();
            return true;
        }
    }
    return false;
};

Promise.prototype._cancelBranched = function() {
    if (this._enoughBranchesHaveCancelled()) {
        this._cancel();
    }
};

Promise.prototype._cancel = function() {
    if (!this._isCancellable()) return;
    this._setCancelled();
    async.invoke(this._cancelPromises, this, undefined);
};

Promise.prototype._cancelPromises = function() {
    if (this._length() > 0) this._settlePromises();
};

Promise.prototype._unsetOnCancel = function() {
    this._onCancelField = undefined;
};

Promise.prototype._isCancellable = function() {
    return this.isPending() && !this._isCancelled();
};

Promise.prototype.isCancellable = function() {
    return this.isPending() && !this.isCancelled();
};

Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
    if (util.isArray(onCancelCallback)) {
        for (var i = 0; i < onCancelCallback.length; ++i) {
            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
        }
    } else if (onCancelCallback !== undefined) {
        if (typeof onCancelCallback === "function") {
            if (!internalOnly) {
                var e = tryCatch(onCancelCallback).call(this._boundValue());
                if (e === errorObj) {
                    this._attachExtraTrace(e.e);
                    async.throwLater(e.e);
                }
            }
        } else {
            onCancelCallback._resultCancelled(this);
        }
    }
};

Promise.prototype._invokeOnCancel = function() {
    var onCancelCallback = this._onCancel();
    this._unsetOnCancel();
    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
};

Promise.prototype._invokeInternalOnCancel = function() {
    if (this._isCancellable()) {
        this._doInvokeOnCancel(this._onCancel(), true);
        this._unsetOnCancel();
    }
};

Promise.prototype._resultCancelled = function() {
    this.cancel();
};

};

},{"./util":36}],7:[function(_dereq_,module,exports){
"use strict";
module.exports = function(NEXT_FILTER) {
var util = _dereq_("./util");
var getKeys = _dereq_("./es5").keys;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function catchFilter(instances, cb, promise) {
    return function(e) {
        var boundTo = promise._boundValue();
        predicateLoop: for (var i = 0; i < instances.length; ++i) {
            var item = instances[i];

            if (item === Error ||
                (item != null && item.prototype instanceof Error)) {
                if (e instanceof item) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (typeof item === "function") {
                var matchesPredicate = tryCatch(item).call(boundTo, e);
                if (matchesPredicate === errorObj) {
                    return matchesPredicate;
                } else if (matchesPredicate) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (util.isObject(e)) {
                var keys = getKeys(item);
                for (var j = 0; j < keys.length; ++j) {
                    var key = keys[j];
                    if (item[key] != e[key]) {
                        continue predicateLoop;
                    }
                }
                return tryCatch(cb).call(boundTo, e);
            }
        }
        return NEXT_FILTER;
    };
}

return catchFilter;
};

},{"./es5":13,"./util":36}],8:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var longStackTraces = false;
var contextStack = [];

Promise.prototype._promiseCreated = function() {};
Promise.prototype._pushContext = function() {};
Promise.prototype._popContext = function() {return null;};
Promise._peekContext = Promise.prototype._peekContext = function() {};

function Context() {
    this._trace = new Context.CapturedTrace(peekContext());
}
Context.prototype._pushContext = function () {
    if (this._trace !== undefined) {
        this._trace._promiseCreated = null;
        contextStack.push(this._trace);
    }
};

Context.prototype._popContext = function () {
    if (this._trace !== undefined) {
        var trace = contextStack.pop();
        var ret = trace._promiseCreated;
        trace._promiseCreated = null;
        return ret;
    }
    return null;
};

function createContext() {
    if (longStackTraces) return new Context();
}

function peekContext() {
    var lastIndex = contextStack.length - 1;
    if (lastIndex >= 0) {
        return contextStack[lastIndex];
    }
    return undefined;
}
Context.CapturedTrace = null;
Context.create = createContext;
Context.deactivateLongStackTraces = function() {};
Context.activateLongStackTraces = function() {
    var Promise_pushContext = Promise.prototype._pushContext;
    var Promise_popContext = Promise.prototype._popContext;
    var Promise_PeekContext = Promise._peekContext;
    var Promise_peekContext = Promise.prototype._peekContext;
    var Promise_promiseCreated = Promise.prototype._promiseCreated;
    Context.deactivateLongStackTraces = function() {
        Promise.prototype._pushContext = Promise_pushContext;
        Promise.prototype._popContext = Promise_popContext;
        Promise._peekContext = Promise_PeekContext;
        Promise.prototype._peekContext = Promise_peekContext;
        Promise.prototype._promiseCreated = Promise_promiseCreated;
        longStackTraces = false;
    };
    longStackTraces = true;
    Promise.prototype._pushContext = Context.prototype._pushContext;
    Promise.prototype._popContext = Context.prototype._popContext;
    Promise._peekContext = Promise.prototype._peekContext = peekContext;
    Promise.prototype._promiseCreated = function() {
        var ctx = this._peekContext();
        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
    };
};
return Context;
};

},{}],9:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, Context) {
var getDomain = Promise._getDomain;
var async = Promise._async;
var Warning = _dereq_("./errors").Warning;
var util = _dereq_("./util");
var canAttachTrace = util.canAttachTrace;
var unhandledRejectionHandled;
var possiblyUnhandledRejection;
var bluebirdFramePattern =
    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
var stackFramePattern = null;
var formatStack = null;
var indentStackFrames = false;
var printWarning;
var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 &&
                        (true ||
                         util.env("BLUEBIRD_DEBUG") ||
                         util.env("NODE_ENV") === "development"));

var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 &&
    (debugging || util.env("BLUEBIRD_WARNINGS")));

var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
    (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

Promise.prototype.suppressUnhandledRejections = function() {
    var target = this._target();
    target._bitField = ((target._bitField & (~1048576)) |
                      524288);
};

Promise.prototype._ensurePossibleRejectionHandled = function () {
    if ((this._bitField & 524288) !== 0) return;
    this._setRejectionIsUnhandled();
    var self = this;
    setTimeout(function() {
        self._notifyUnhandledRejection();
    }, 1);
};

Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
    fireRejectionEvent("rejectionHandled",
                                  unhandledRejectionHandled, undefined, this);
};

Promise.prototype._setReturnedNonUndefined = function() {
    this._bitField = this._bitField | 268435456;
};

Promise.prototype._returnedNonUndefined = function() {
    return (this._bitField & 268435456) !== 0;
};

Promise.prototype._notifyUnhandledRejection = function () {
    if (this._isRejectionUnhandled()) {
        var reason = this._settledValue();
        this._setUnhandledRejectionIsNotified();
        fireRejectionEvent("unhandledRejection",
                                      possiblyUnhandledRejection, reason, this);
    }
};

Promise.prototype._setUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField | 262144;
};

Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField & (~262144);
};

Promise.prototype._isUnhandledRejectionNotified = function () {
    return (this._bitField & 262144) > 0;
};

Promise.prototype._setRejectionIsUnhandled = function () {
    this._bitField = this._bitField | 1048576;
};

Promise.prototype._unsetRejectionIsUnhandled = function () {
    this._bitField = this._bitField & (~1048576);
    if (this._isUnhandledRejectionNotified()) {
        this._unsetUnhandledRejectionIsNotified();
        this._notifyUnhandledRejectionIsHandled();
    }
};

Promise.prototype._isRejectionUnhandled = function () {
    return (this._bitField & 1048576) > 0;
};

Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
    return warn(message, shouldUseOwnTrace, promise || this);
};

Promise.onPossiblyUnhandledRejection = function (fn) {
    var domain = getDomain();
    possiblyUnhandledRejection =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

Promise.onUnhandledRejectionHandled = function (fn) {
    var domain = getDomain();
    unhandledRejectionHandled =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

var disableLongStackTraces = function() {};
Promise.longStackTraces = function () {
    if (async.haveItemsQueued() && !config.longStackTraces) {
        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (!config.longStackTraces && longStackTracesIsSupported()) {
        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
        config.longStackTraces = true;
        disableLongStackTraces = function() {
            if (async.haveItemsQueued() && !config.longStackTraces) {
                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
            }
            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
            Context.deactivateLongStackTraces();
            async.enableTrampoline();
            config.longStackTraces = false;
        };
        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
        Context.activateLongStackTraces();
        async.disableTrampolineIfNecessary();
    }
};

Promise.hasLongStackTraces = function () {
    return config.longStackTraces && longStackTracesIsSupported();
};

var fireDomEvent = (function() {
    try {
        if (typeof CustomEvent === "function") {
            var event = new CustomEvent("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new CustomEvent(name.toLowerCase(), {
                    detail: event,
                    cancelable: true
                });
                return !util.global.dispatchEvent(domEvent);
            };
        } else if (typeof Event === "function") {
            var event = new Event("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new Event(name.toLowerCase(), {
                    cancelable: true
                });
                domEvent.detail = event;
                return !util.global.dispatchEvent(domEvent);
            };
        } else {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("testingtheevent", false, true, {});
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = document.createEvent("CustomEvent");
                domEvent.initCustomEvent(name.toLowerCase(), false, true,
                    event);
                return !util.global.dispatchEvent(domEvent);
            };
        }
    } catch (e) {}
    return function() {
        return false;
    };
})();

var fireGlobalEvent = (function() {
    if (util.isNode) {
        return function() {
            return process.emit.apply(process, arguments);
        };
    } else {
        if (!util.global) {
            return function() {
                return false;
            };
        }
        return function(name) {
            var methodName = "on" + name.toLowerCase();
            var method = util.global[methodName];
            if (!method) return false;
            method.apply(util.global, [].slice.call(arguments, 1));
            return true;
        };
    }
})();

function generatePromiseLifecycleEventObject(name, promise) {
    return {promise: promise};
}

var eventToObjectGenerator = {
    promiseCreated: generatePromiseLifecycleEventObject,
    promiseFulfilled: generatePromiseLifecycleEventObject,
    promiseRejected: generatePromiseLifecycleEventObject,
    promiseResolved: generatePromiseLifecycleEventObject,
    promiseCancelled: generatePromiseLifecycleEventObject,
    promiseChained: function(name, promise, child) {
        return {promise: promise, child: child};
    },
    warning: function(name, warning) {
        return {warning: warning};
    },
    unhandledRejection: function (name, reason, promise) {
        return {reason: reason, promise: promise};
    },
    rejectionHandled: generatePromiseLifecycleEventObject
};

var activeFireEvent = function (name) {
    var globalEventFired = false;
    try {
        globalEventFired = fireGlobalEvent.apply(null, arguments);
    } catch (e) {
        async.throwLater(e);
        globalEventFired = true;
    }

    var domEventFired = false;
    try {
        domEventFired = fireDomEvent(name,
                    eventToObjectGenerator[name].apply(null, arguments));
    } catch (e) {
        async.throwLater(e);
        domEventFired = true;
    }

    return domEventFired || globalEventFired;
};

Promise.config = function(opts) {
    opts = Object(opts);
    if ("longStackTraces" in opts) {
        if (opts.longStackTraces) {
            Promise.longStackTraces();
        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
            disableLongStackTraces();
        }
    }
    if ("warnings" in opts) {
        var warningsOption = opts.warnings;
        config.warnings = !!warningsOption;
        wForgottenReturn = config.warnings;

        if (util.isObject(warningsOption)) {
            if ("wForgottenReturn" in warningsOption) {
                wForgottenReturn = !!warningsOption.wForgottenReturn;
            }
        }
    }
    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
        if (async.haveItemsQueued()) {
            throw new Error(
                "cannot enable cancellation after promises are in use");
        }
        Promise.prototype._clearCancellationData =
            cancellationClearCancellationData;
        Promise.prototype._propagateFrom = cancellationPropagateFrom;
        Promise.prototype._onCancel = cancellationOnCancel;
        Promise.prototype._setOnCancel = cancellationSetOnCancel;
        Promise.prototype._attachCancellationCallback =
            cancellationAttachCancellationCallback;
        Promise.prototype._execute = cancellationExecute;
        propagateFromFunction = cancellationPropagateFrom;
        config.cancellation = true;
    }
    if ("monitoring" in opts) {
        if (opts.monitoring && !config.monitoring) {
            config.monitoring = true;
            Promise.prototype._fireEvent = activeFireEvent;
        } else if (!opts.monitoring && config.monitoring) {
            config.monitoring = false;
            Promise.prototype._fireEvent = defaultFireEvent;
        }
    }
    return Promise;
};

function defaultFireEvent() { return false; }

Promise.prototype._fireEvent = defaultFireEvent;
Promise.prototype._execute = function(executor, resolve, reject) {
    try {
        executor(resolve, reject);
    } catch (e) {
        return e;
    }
};
Promise.prototype._onCancel = function () {};
Promise.prototype._setOnCancel = function (handler) { ; };
Promise.prototype._attachCancellationCallback = function(onCancel) {
    ;
};
Promise.prototype._captureStackTrace = function () {};
Promise.prototype._attachExtraTrace = function () {};
Promise.prototype._clearCancellationData = function() {};
Promise.prototype._propagateFrom = function (parent, flags) {
    ;
    ;
};

function cancellationExecute(executor, resolve, reject) {
    var promise = this;
    try {
        executor(resolve, reject, function(onCancel) {
            if (typeof onCancel !== "function") {
                throw new TypeError("onCancel must be a function, got: " +
                                    util.toString(onCancel));
            }
            promise._attachCancellationCallback(onCancel);
        });
    } catch (e) {
        return e;
    }
}

function cancellationAttachCancellationCallback(onCancel) {
    if (!this._isCancellable()) return this;

    var previousOnCancel = this._onCancel();
    if (previousOnCancel !== undefined) {
        if (util.isArray(previousOnCancel)) {
            previousOnCancel.push(onCancel);
        } else {
            this._setOnCancel([previousOnCancel, onCancel]);
        }
    } else {
        this._setOnCancel(onCancel);
    }
}

function cancellationOnCancel() {
    return this._onCancelField;
}

function cancellationSetOnCancel(onCancel) {
    this._onCancelField = onCancel;
}

function cancellationClearCancellationData() {
    this._cancellationParent = undefined;
    this._onCancelField = undefined;
}

function cancellationPropagateFrom(parent, flags) {
    if ((flags & 1) !== 0) {
        this._cancellationParent = parent;
        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
        if (branchesRemainingToCancel === undefined) {
            branchesRemainingToCancel = 0;
        }
        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
    }
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}

function bindingPropagateFrom(parent, flags) {
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}
var propagateFromFunction = bindingPropagateFrom;

function boundValueFunction() {
    var ret = this._boundTo;
    if (ret !== undefined) {
        if (ret instanceof Promise) {
            if (ret.isFulfilled()) {
                return ret.value();
            } else {
                return undefined;
            }
        }
    }
    return ret;
}

function longStackTracesCaptureStackTrace() {
    this._trace = new CapturedTrace(this._peekContext());
}

function longStackTracesAttachExtraTrace(error, ignoreSelf) {
    if (canAttachTrace(error)) {
        var trace = this._trace;
        if (trace !== undefined) {
            if (ignoreSelf) trace = trace._parent;
        }
        if (trace !== undefined) {
            trace.attachExtraTrace(error);
        } else if (!error.__stackCleaned__) {
            var parsed = parseStackAndMessage(error);
            util.notEnumerableProp(error, "stack",
                parsed.message + "\n" + parsed.stack.join("\n"));
            util.notEnumerableProp(error, "__stackCleaned__", true);
        }
    }
}

function checkForgottenReturns(returnValue, promiseCreated, name, promise,
                               parent) {
    if (returnValue === undefined && promiseCreated !== null &&
        wForgottenReturn) {
        if (parent !== undefined && parent._returnedNonUndefined()) return;
        if ((promise._bitField & 65535) === 0) return;

        if (name) name = name + " ";
        var handlerLine = "";
        var creatorLine = "";
        if (promiseCreated._trace) {
            var traceLines = promiseCreated._trace.stack.split("\n");
            var stack = cleanStack(traceLines);
            for (var i = stack.length - 1; i >= 0; --i) {
                var line = stack[i];
                if (!nodeFramePattern.test(line)) {
                    var lineMatches = line.match(parseLinePattern);
                    if (lineMatches) {
                        handlerLine  = "at " + lineMatches[1] +
                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                    }
                    break;
                }
            }

            if (stack.length > 0) {
                var firstUserLine = stack[0];
                for (var i = 0; i < traceLines.length; ++i) {

                    if (traceLines[i] === firstUserLine) {
                        if (i > 0) {
                            creatorLine = "\n" + traceLines[i - 1];
                        }
                        break;
                    }
                }

            }
        }
        var msg = "a promise was created in a " + name +
            "handler " + handlerLine + "but was not returned from it, " +
            "see http://goo.gl/rRqMUw" +
            creatorLine;
        promise._warn(msg, true, promiseCreated);
    }
}

function deprecated(name, replacement) {
    var message = name +
        " is deprecated and will be removed in a future version.";
    if (replacement) message += " Use " + replacement + " instead.";
    return warn(message);
}

function warn(message, shouldUseOwnTrace, promise) {
    if (!config.warnings) return;
    var warning = new Warning(message);
    var ctx;
    if (shouldUseOwnTrace) {
        promise._attachExtraTrace(warning);
    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
        ctx.attachExtraTrace(warning);
    } else {
        var parsed = parseStackAndMessage(warning);
        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
    }

    if (!activeFireEvent("warning", warning)) {
        formatAndLogError(warning, "", true);
    }
}

function reconstructStack(message, stacks) {
    for (var i = 0; i < stacks.length - 1; ++i) {
        stacks[i].push("From previous event:");
        stacks[i] = stacks[i].join("\n");
    }
    if (i < stacks.length) {
        stacks[i] = stacks[i].join("\n");
    }
    return message + "\n" + stacks.join("\n");
}

function removeDuplicateOrEmptyJumps(stacks) {
    for (var i = 0; i < stacks.length; ++i) {
        if (stacks[i].length === 0 ||
            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
            stacks.splice(i, 1);
            i--;
        }
    }
}

function removeCommonRoots(stacks) {
    var current = stacks[0];
    for (var i = 1; i < stacks.length; ++i) {
        var prev = stacks[i];
        var currentLastIndex = current.length - 1;
        var currentLastLine = current[currentLastIndex];
        var commonRootMeetPoint = -1;

        for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
                commonRootMeetPoint = j;
                break;
            }
        }

        for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
                current.pop();
                currentLastIndex--;
            } else {
                break;
            }
        }
        current = prev;
    }
}

function cleanStack(stack) {
    var ret = [];
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        var isTraceLine = "    (No stack trace)" === line ||
            stackFramePattern.test(line);
        var isInternalFrame = isTraceLine && shouldIgnore(line);
        if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
                line = "    " + line;
            }
            ret.push(line);
        }
    }
    return ret;
}

function stackFramesAsArray(error) {
    var stack = error.stack.replace(/\s+$/g, "").split("\n");
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
        }
    }
    if (i > 0 && error.name != "SyntaxError") {
        stack = stack.slice(i);
    }
    return stack;
}

function parseStackAndMessage(error) {
    var stack = error.stack;
    var message = error.toString();
    stack = typeof stack === "string" && stack.length > 0
                ? stackFramesAsArray(error) : ["    (No stack trace)"];
    return {
        message: message,
        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
    };
}

function formatAndLogError(error, title, isSoft) {
    if (typeof console !== "undefined") {
        var message;
        if (util.isObject(error)) {
            var stack = error.stack;
            message = title + formatStack(stack, error);
        } else {
            message = title + String(error);
        }
        if (typeof printWarning === "function") {
            printWarning(message, isSoft);
        } else if (typeof console.log === "function" ||
            typeof console.log === "object") {
            console.log(message);
        }
    }
}

function fireRejectionEvent(name, localHandler, reason, promise) {
    var localEventFired = false;
    try {
        if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
                localHandler(promise);
            } else {
                localHandler(reason, promise);
            }
        }
    } catch (e) {
        async.throwLater(e);
    }

    if (name === "unhandledRejection") {
        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
            formatAndLogError(reason, "Unhandled rejection ");
        }
    } else {
        activeFireEvent(name, promise);
    }
}

function formatNonError(obj) {
    var str;
    if (typeof obj === "function") {
        str = "[function " +
            (obj.name || "anonymous") +
            "]";
    } else {
        str = obj && typeof obj.toString === "function"
            ? obj.toString() : util.toString(obj);
        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
        if (ruselessToString.test(str)) {
            try {
                var newStr = JSON.stringify(obj);
                str = newStr;
            }
            catch(e) {

            }
        }
        if (str.length === 0) {
            str = "(empty array)";
        }
    }
    return ("(<" + snip(str) + ">, no stack trace)");
}

function snip(str) {
    var maxChars = 41;
    if (str.length < maxChars) {
        return str;
    }
    return str.substr(0, maxChars - 3) + "...";
}

function longStackTracesIsSupported() {
    return typeof captureStackTrace === "function";
}

var shouldIgnore = function() { return false; };
var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
function parseLineInfo(line) {
    var matches = line.match(parseLineInfoRegex);
    if (matches) {
        return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
        };
    }
}

function setBounds(firstLineError, lastLineError) {
    if (!longStackTracesIsSupported()) return;
    var firstStackLines = firstLineError.stack.split("\n");
    var lastStackLines = lastLineError.stack.split("\n");
    var firstIndex = -1;
    var lastIndex = -1;
    var firstFileName;
    var lastFileName;
    for (var i = 0; i < firstStackLines.length; ++i) {
        var result = parseLineInfo(firstStackLines[i]);
        if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
        }
    }
    for (var i = 0; i < lastStackLines.length; ++i) {
        var result = parseLineInfo(lastStackLines[i]);
        if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
        }
    }
    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
        firstFileName !== lastFileName || firstIndex >= lastIndex) {
        return;
    }

    shouldIgnore = function(line) {
        if (bluebirdFramePattern.test(line)) return true;
        var info = parseLineInfo(line);
        if (info) {
            if (info.fileName === firstFileName &&
                (firstIndex <= info.line && info.line <= lastIndex)) {
                return true;
            }
        }
        return false;
    };
}

function CapturedTrace(parent) {
    this._parent = parent;
    this._promisesCreated = 0;
    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
    captureStackTrace(this, CapturedTrace);
    if (length > 32) this.uncycle();
}
util.inherits(CapturedTrace, Error);
Context.CapturedTrace = CapturedTrace;

CapturedTrace.prototype.uncycle = function() {
    var length = this._length;
    if (length < 2) return;
    var nodes = [];
    var stackToIndex = {};

    for (var i = 0, node = this; node !== undefined; ++i) {
        nodes.push(node);
        node = node._parent;
    }
    length = this._length = i;
    for (var i = length - 1; i >= 0; --i) {
        var stack = nodes[i].stack;
        if (stackToIndex[stack] === undefined) {
            stackToIndex[stack] = i;
        }
    }
    for (var i = 0; i < length; ++i) {
        var currentStack = nodes[i].stack;
        var index = stackToIndex[currentStack];
        if (index !== undefined && index !== i) {
            if (index > 0) {
                nodes[index - 1]._parent = undefined;
                nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = undefined;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

            if (index < length - 1) {
                cycleEdgeNode._parent = nodes[index + 1];
                cycleEdgeNode._parent.uncycle();
                cycleEdgeNode._length =
                    cycleEdgeNode._parent._length + 1;
            } else {
                cycleEdgeNode._parent = undefined;
                cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
                nodes[j]._length = currentChildLength;
                currentChildLength++;
            }
            return;
        }
    }
};

CapturedTrace.prototype.attachExtraTrace = function(error) {
    if (error.__stackCleaned__) return;
    this.uncycle();
    var parsed = parseStackAndMessage(error);
    var message = parsed.message;
    var stacks = [parsed.stack];

    var trace = this;
    while (trace !== undefined) {
        stacks.push(cleanStack(trace.stack.split("\n")));
        trace = trace._parent;
    }
    removeCommonRoots(stacks);
    removeDuplicateOrEmptyJumps(stacks);
    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
    util.notEnumerableProp(error, "__stackCleaned__", true);
};

var captureStackTrace = (function stackDetection() {
    var v8stackFramePattern = /^\s*at\s*/;
    var v8stackFormatter = function(stack, error) {
        if (typeof stack === "string") return stack;

        if (error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    if (typeof Error.stackTraceLimit === "number" &&
        typeof Error.captureStackTrace === "function") {
        Error.stackTraceLimit += 6;
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        var captureStackTrace = Error.captureStackTrace;

        shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
        };
        return function(receiver, ignoreUntil) {
            Error.stackTraceLimit += 6;
            captureStackTrace(receiver, ignoreUntil);
            Error.stackTraceLimit -= 6;
        };
    }
    var err = new Error();

    if (typeof err.stack === "string" &&
        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
        stackFramePattern = /@/;
        formatStack = v8stackFormatter;
        indentStackFrames = true;
        return function captureStackTrace(o) {
            o.stack = new Error().stack;
        };
    }

    var hasStackAfterThrow;
    try { throw new Error(); }
    catch(e) {
        hasStackAfterThrow = ("stack" in e);
    }
    if (!("stack" in err) && hasStackAfterThrow &&
        typeof Error.stackTraceLimit === "number") {
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        return function captureStackTrace(o) {
            Error.stackTraceLimit += 6;
            try { throw new Error(); }
            catch(e) { o.stack = e.stack; }
            Error.stackTraceLimit -= 6;
        };
    }

    formatStack = function(stack, error) {
        if (typeof stack === "string") return stack;

        if ((typeof error === "object" ||
            typeof error === "function") &&
            error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    return null;

})([]);

if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
    printWarning = function (message) {
        console.warn(message);
    };
    if (util.isNode && process.stderr.isTTY) {
        printWarning = function(message, isSoft) {
            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
            console.warn(color + message + "\u001b[0m\n");
        };
    } else if (!util.isNode && typeof (new Error().stack) === "string") {
        printWarning = function(message, isSoft) {
            console.warn("%c" + message,
                        isSoft ? "color: darkorange" : "color: red");
        };
    }
}

var config = {
    warnings: warnings,
    longStackTraces: false,
    cancellation: false,
    monitoring: false
};

if (longStackTraces) Promise.longStackTraces();

return {
    longStackTraces: function() {
        return config.longStackTraces;
    },
    warnings: function() {
        return config.warnings;
    },
    cancellation: function() {
        return config.cancellation;
    },
    monitoring: function() {
        return config.monitoring;
    },
    propagateFromFunction: function() {
        return propagateFromFunction;
    },
    boundValueFunction: function() {
        return boundValueFunction;
    },
    checkForgottenReturns: checkForgottenReturns,
    setBounds: setBounds,
    warn: warn,
    deprecated: deprecated,
    CapturedTrace: CapturedTrace,
    fireDomEvent: fireDomEvent,
    fireGlobalEvent: fireGlobalEvent
};
};

},{"./errors":12,"./util":36}],10:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
function returner() {
    return this.value;
}
function thrower() {
    throw this.reason;
}

Promise.prototype["return"] =
Promise.prototype.thenReturn = function (value) {
    if (value instanceof Promise) value.suppressUnhandledRejections();
    return this._then(
        returner, undefined, undefined, {value: value}, undefined);
};

Promise.prototype["throw"] =
Promise.prototype.thenThrow = function (reason) {
    return this._then(
        thrower, undefined, undefined, {reason: reason}, undefined);
};

Promise.prototype.catchThrow = function (reason) {
    if (arguments.length <= 1) {
        return this._then(
            undefined, thrower, undefined, {reason: reason}, undefined);
    } else {
        var _reason = arguments[1];
        var handler = function() {throw _reason;};
        return this.caught(reason, handler);
    }
};

Promise.prototype.catchReturn = function (value) {
    if (arguments.length <= 1) {
        if (value instanceof Promise) value.suppressUnhandledRejections();
        return this._then(
            undefined, returner, undefined, {value: value}, undefined);
    } else {
        var _value = arguments[1];
        if (_value instanceof Promise) _value.suppressUnhandledRejections();
        var handler = function() {return _value;};
        return this.caught(value, handler);
    }
};
};

},{}],11:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var PromiseReduce = Promise.reduce;
var PromiseAll = Promise.all;

function promiseAllThis() {
    return PromiseAll(this);
}

function PromiseMapSeries(promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
}

Promise.prototype.each = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, this, undefined);
};

Promise.prototype.mapSeries = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
};

Promise.each = function (promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, promises, undefined);
};

Promise.mapSeries = PromiseMapSeries;
};


},{}],12:[function(_dereq_,module,exports){
"use strict";
var es5 = _dereq_("./es5");
var Objectfreeze = es5.freeze;
var util = _dereq_("./util");
var inherits = util.inherits;
var notEnumerableProp = util.notEnumerableProp;

function subError(nameProperty, defaultMessage) {
    function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        notEnumerableProp(this, "message",
            typeof message === "string" ? message : defaultMessage);
        notEnumerableProp(this, "name", nameProperty);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            Error.call(this);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var Warning = subError("Warning", "warning");
var CancellationError = subError("CancellationError", "cancellation error");
var TimeoutError = subError("TimeoutError", "timeout error");
var AggregateError = subError("AggregateError", "aggregate error");
try {
    _TypeError = TypeError;
    _RangeError = RangeError;
} catch(e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
}

var methods = ("join pop push shift unshift slice filter forEach some " +
    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
}

es5.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: false,
    writable: true,
    enumerable: true
});
AggregateError.prototype["isOperational"] = true;
var level = 0;
AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:" + "\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret += str + "\n";
    }
    level--;
    return ret;
};

function OperationalError(message) {
    if (!(this instanceof OperationalError))
        return new OperationalError(message);
    notEnumerableProp(this, "name", "OperationalError");
    notEnumerableProp(this, "message", message);
    this.cause = message;
    this["isOperational"] = true;

    if (message instanceof Error) {
        notEnumerableProp(this, "message", message.message);
        notEnumerableProp(this, "stack", message.stack);
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

}
inherits(OperationalError, Error);

var errorTypes = Error["__BluebirdErrorTypes__"];
if (!errorTypes) {
    errorTypes = Objectfreeze({
        CancellationError: CancellationError,
        TimeoutError: TimeoutError,
        OperationalError: OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError
    });
    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
    });
}

module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    Warning: Warning
};

},{"./es5":13,"./util":36}],13:[function(_dereq_,module,exports){
var isES5 = (function(){
    "use strict";
    return this === undefined;
})();

if (isES5) {
    module.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5: isES5,
        propertyIsWritable: function(obj, prop) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            return !!(!descriptor || descriptor.writable || descriptor.set);
        }
    };
} else {
    var has = {}.hasOwnProperty;
    var str = {}.toString;
    var proto = {}.constructor.prototype;

    var ObjectKeys = function (o) {
        var ret = [];
        for (var key in o) {
            if (has.call(o, key)) {
                ret.push(key);
            }
        }
        return ret;
    };

    var ObjectGetDescriptor = function(o, key) {
        return {value: o[key]};
    };

    var ObjectDefineProperty = function (o, key, desc) {
        o[key] = desc.value;
        return o;
    };

    var ObjectFreeze = function (obj) {
        return obj;
    };

    var ObjectGetPrototypeOf = function (obj) {
        try {
            return Object(obj).constructor.prototype;
        }
        catch (e) {
            return proto;
        }
    };

    var ArrayIsArray = function (obj) {
        try {
            return str.call(obj) === "[object Array]";
        }
        catch(e) {
            return false;
        }
    };

    module.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5: isES5,
        propertyIsWritable: function() {
            return true;
        }
    };
}

},{}],14:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var PromiseMap = Promise.map;

Promise.prototype.filter = function (fn, options) {
    return PromiseMap(this, fn, options, INTERNAL);
};

Promise.filter = function (promises, fn, options) {
    return PromiseMap(promises, fn, options, INTERNAL);
};
};

},{}],15:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
var util = _dereq_("./util");
var CancellationError = Promise.CancellationError;
var errorObj = util.errorObj;
var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);

function PassThroughHandlerContext(promise, type, handler) {
    this.promise = promise;
    this.type = type;
    this.handler = handler;
    this.called = false;
    this.cancelPromise = null;
}

PassThroughHandlerContext.prototype.isFinallyHandler = function() {
    return this.type === 0;
};

function FinallyHandlerCancelReaction(finallyHandler) {
    this.finallyHandler = finallyHandler;
}

FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
    checkCancel(this.finallyHandler);
};

function checkCancel(ctx, reason) {
    if (ctx.cancelPromise != null) {
        if (arguments.length > 1) {
            ctx.cancelPromise._reject(reason);
        } else {
            ctx.cancelPromise._cancel();
        }
        ctx.cancelPromise = null;
        return true;
    }
    return false;
}

function succeed() {
    return finallyHandler.call(this, this.promise._target()._settledValue());
}
function fail(reason) {
    if (checkCancel(this, reason)) return;
    errorObj.e = reason;
    return errorObj;
}
function finallyHandler(reasonOrValue) {
    var promise = this.promise;
    var handler = this.handler;

    if (!this.called) {
        this.called = true;
        var ret = this.isFinallyHandler()
            ? handler.call(promise._boundValue())
            : handler.call(promise._boundValue(), reasonOrValue);
        if (ret === NEXT_FILTER) {
            return ret;
        } else if (ret !== undefined) {
            promise._setReturnedNonUndefined();
            var maybePromise = tryConvertToPromise(ret, promise);
            if (maybePromise instanceof Promise) {
                if (this.cancelPromise != null) {
                    if (maybePromise._isCancelled()) {
                        var reason =
                            new CancellationError("late cancellation observer");
                        promise._attachExtraTrace(reason);
                        errorObj.e = reason;
                        return errorObj;
                    } else if (maybePromise.isPending()) {
                        maybePromise._attachCancellationCallback(
                            new FinallyHandlerCancelReaction(this));
                    }
                }
                return maybePromise._then(
                    succeed, fail, undefined, this, undefined);
            }
        }
    }

    if (promise.isRejected()) {
        checkCancel(this);
        errorObj.e = reasonOrValue;
        return errorObj;
    } else {
        checkCancel(this);
        return reasonOrValue;
    }
}

Promise.prototype._passThrough = function(handler, type, success, fail) {
    if (typeof handler !== "function") return this.then();
    return this._then(success,
                      fail,
                      undefined,
                      new PassThroughHandlerContext(this, type, handler),
                      undefined);
};

Promise.prototype.lastly =
Promise.prototype["finally"] = function (handler) {
    return this._passThrough(handler,
                             0,
                             finallyHandler,
                             finallyHandler);
};


Promise.prototype.tap = function (handler) {
    return this._passThrough(handler, 1, finallyHandler);
};

Promise.prototype.tapCatch = function (handlerOrPredicate) {
    var len = arguments.length;
    if(len === 1) {
        return this._passThrough(handlerOrPredicate,
                                 1,
                                 undefined,
                                 finallyHandler);
    } else {
         var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return Promise.reject(new TypeError(
                    "tapCatch statement predicate: "
                    + "expecting an object but got " + util.classString(item)
                ));
            }
        }
        catchInstances.length = j;
        var handler = arguments[i];
        return this._passThrough(catchFilter(catchInstances, handler, this),
                                 1,
                                 undefined,
                                 finallyHandler);
    }

};

return PassThroughHandlerContext;
};

},{"./catch_filter":7,"./util":36}],16:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          apiRejection,
                          INTERNAL,
                          tryConvertToPromise,
                          Proxyable,
                          debug) {
var errors = _dereq_("./errors");
var TypeError = errors.TypeError;
var util = _dereq_("./util");
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
var yieldHandlers = [];

function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
    for (var i = 0; i < yieldHandlers.length; ++i) {
        traceParent._pushContext();
        var result = tryCatch(yieldHandlers[i])(value);
        traceParent._popContext();
        if (result === errorObj) {
            traceParent._pushContext();
            var ret = Promise.reject(errorObj.e);
            traceParent._popContext();
            return ret;
        }
        var maybePromise = tryConvertToPromise(result, traceParent);
        if (maybePromise instanceof Promise) return maybePromise;
    }
    return null;
}

function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
    if (debug.cancellation()) {
        var internal = new Promise(INTERNAL);
        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
        this._promise = internal.lastly(function() {
            return _finallyPromise;
        });
        internal._captureStackTrace();
        internal._setOnCancel(this);
    } else {
        var promise = this._promise = new Promise(INTERNAL);
        promise._captureStackTrace();
    }
    this._stack = stack;
    this._generatorFunction = generatorFunction;
    this._receiver = receiver;
    this._generator = undefined;
    this._yieldHandlers = typeof yieldHandler === "function"
        ? [yieldHandler].concat(yieldHandlers)
        : yieldHandlers;
    this._yieldedPromise = null;
    this._cancellationPhase = false;
}
util.inherits(PromiseSpawn, Proxyable);

PromiseSpawn.prototype._isResolved = function() {
    return this._promise === null;
};

PromiseSpawn.prototype._cleanup = function() {
    this._promise = this._generator = null;
    if (debug.cancellation() && this._finallyPromise !== null) {
        this._finallyPromise._fulfill();
        this._finallyPromise = null;
    }
};

PromiseSpawn.prototype._promiseCancelled = function() {
    if (this._isResolved()) return;
    var implementsReturn = typeof this._generator["return"] !== "undefined";

    var result;
    if (!implementsReturn) {
        var reason = new Promise.CancellationError(
            "generator .return() sentinel");
        Promise.coroutine.returnSentinel = reason;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        result = tryCatch(this._generator["throw"]).call(this._generator,
                                                         reason);
        this._promise._popContext();
    } else {
        this._promise._pushContext();
        result = tryCatch(this._generator["return"]).call(this._generator,
                                                          undefined);
        this._promise._popContext();
    }
    this._cancellationPhase = true;
    this._yieldedPromise = null;
    this._continue(result);
};

PromiseSpawn.prototype._promiseFulfilled = function(value) {
    this._yieldedPromise = null;
    this._promise._pushContext();
    var result = tryCatch(this._generator.next).call(this._generator, value);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._promiseRejected = function(reason) {
    this._yieldedPromise = null;
    this._promise._attachExtraTrace(reason);
    this._promise._pushContext();
    var result = tryCatch(this._generator["throw"])
        .call(this._generator, reason);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._resultCancelled = function() {
    if (this._yieldedPromise instanceof Promise) {
        var promise = this._yieldedPromise;
        this._yieldedPromise = null;
        promise.cancel();
    }
};

PromiseSpawn.prototype.promise = function () {
    return this._promise;
};

PromiseSpawn.prototype._run = function () {
    this._generator = this._generatorFunction.call(this._receiver);
    this._receiver =
        this._generatorFunction = undefined;
    this._promiseFulfilled(undefined);
};

PromiseSpawn.prototype._continue = function (result) {
    var promise = this._promise;
    if (result === errorObj) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._rejectCallback(result.e, false);
        }
    }

    var value = result.value;
    if (result.done === true) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._resolveCallback(value);
        }
    } else {
        var maybePromise = tryConvertToPromise(value, this._promise);
        if (!(maybePromise instanceof Promise)) {
            maybePromise =
                promiseFromYieldHandler(maybePromise,
                                        this._yieldHandlers,
                                        this._promise);
            if (maybePromise === null) {
                this._promiseRejected(
                    new TypeError(
                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", String(value)) +
                        "From coroutine:\u000a" +
                        this._stack.split("\n").slice(1, -7).join("\n")
                    )
                );
                return;
            }
        }
        maybePromise = maybePromise._target();
        var bitField = maybePromise._bitField;
        ;
        if (((bitField & 50397184) === 0)) {
            this._yieldedPromise = maybePromise;
            maybePromise._proxy(this, null);
        } else if (((bitField & 33554432) !== 0)) {
            Promise._async.invoke(
                this._promiseFulfilled, this, maybePromise._value()
            );
        } else if (((bitField & 16777216) !== 0)) {
            Promise._async.invoke(
                this._promiseRejected, this, maybePromise._reason()
            );
        } else {
            this._promiseCancelled();
        }
    }
};

Promise.coroutine = function (generatorFunction, options) {
    if (typeof generatorFunction !== "function") {
        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var yieldHandler = Object(options).yieldHandler;
    var PromiseSpawn$ = PromiseSpawn;
    var stack = new Error().stack;
    return function () {
        var generator = generatorFunction.apply(this, arguments);
        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
                                      stack);
        var ret = spawn.promise();
        spawn._generator = generator;
        spawn._promiseFulfilled(undefined);
        return ret;
    };
};

Promise.coroutine.addYieldHandler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    yieldHandlers.push(fn);
};

Promise.spawn = function (generatorFunction) {
    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
    if (typeof generatorFunction !== "function") {
        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var spawn = new PromiseSpawn(generatorFunction, this);
    var ret = spawn.promise();
    spawn._run(Promise.spawn);
    return ret;
};
};

},{"./errors":12,"./util":36}],17:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,
         getDomain) {
var util = _dereq_("./util");
var canEvaluate = util.canEvaluate;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var reject;

if (false) {
if (canEvaluate) {
    var thenCallback = function(i) {
        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
    };

    var promiseSetter = function(i) {
        return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
    };

    var generateHolderClass = function(total) {
        var props = new Array(total);
        for (var i = 0; i < props.length; ++i) {
            props[i] = "this.p" + (i+1);
        }
        var assignment = props.join(" = ") + " = null;";
        var cancellationCode= "var promise;\n" + props.map(function(prop) {
            return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
        }).join("\n");
        var passedArguments = props.join(", ");
        var name = "Holder$" + total;


        var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.asyncNeeded = true;                                     \n\
                this.now = 0;                                                \n\
            }                                                                \n\
                                                                             \n\
            [TheName].prototype._callFunction = function(promise) {          \n\
                promise._pushContext();                                      \n\
                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
                promise._popContext();                                       \n\
                if (ret === errorObj) {                                      \n\
                    promise._rejectCallback(ret.e, false);                   \n\
                } else {                                                     \n\
                    promise._resolveCallback(ret);                           \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    if (this.asyncNeeded) {                                  \n\
                        async.invoke(this._callFunction, this, promise);     \n\
                    } else {                                                 \n\
                        this._callFunction(promise);                         \n\
                    }                                                        \n\
                                                                             \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise, async);                               \n\
        ";

        code = code.replace(/\[TheName\]/g, name)
            .replace(/\[TheTotal\]/g, total)
            .replace(/\[ThePassedArguments\]/g, passedArguments)
            .replace(/\[TheProperties\]/g, assignment)
            .replace(/\[CancellationCode\]/g, cancellationCode);

        return new Function("tryCatch", "errorObj", "Promise", "async", code)
                           (tryCatch, errorObj, Promise, async);
    };

    var holderClasses = [];
    var thenCallbacks = [];
    var promiseSetters = [];

    for (var i = 0; i < 8; ++i) {
        holderClasses.push(generateHolderClass(i + 1));
        thenCallbacks.push(thenCallback(i + 1));
        promiseSetters.push(promiseSetter(i + 1));
    }

    reject = function (reason) {
        this._reject(reason);
    };
}}

Promise.join = function () {
    var last = arguments.length - 1;
    var fn;
    if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        if (false) {
            if (last <= 8 && canEvaluate) {
                var ret = new Promise(INTERNAL);
                ret._captureStackTrace();
                var HolderClass = holderClasses[last - 1];
                var holder = new HolderClass(fn);
                var callbacks = thenCallbacks;

                for (var i = 0; i < last; ++i) {
                    var maybePromise = tryConvertToPromise(arguments[i], ret);
                    if (maybePromise instanceof Promise) {
                        maybePromise = maybePromise._target();
                        var bitField = maybePromise._bitField;
                        ;
                        if (((bitField & 50397184) === 0)) {
                            maybePromise._then(callbacks[i], reject,
                                               undefined, ret, holder);
                            promiseSetters[i](maybePromise, holder);
                            holder.asyncNeeded = false;
                        } else if (((bitField & 33554432) !== 0)) {
                            callbacks[i].call(ret,
                                              maybePromise._value(), holder);
                        } else if (((bitField & 16777216) !== 0)) {
                            ret._reject(maybePromise._reason());
                        } else {
                            ret._cancel();
                        }
                    } else {
                        callbacks[i].call(ret, maybePromise, holder);
                    }
                }

                if (!ret._isFateSealed()) {
                    if (holder.asyncNeeded) {
                        var domain = getDomain();
                        if (domain !== null) {
                            holder.fn = util.domainBind(domain, holder.fn);
                        }
                    }
                    ret._setAsyncGuaranteed();
                    ret._setOnCancel(holder);
                }
                return ret;
            }
        }
    }
    var args = [].slice.call(arguments);;
    if (fn) args.pop();
    var ret = new PromiseArray(args).promise();
    return fn !== undefined ? ret.spread(fn) : ret;
};

};

},{"./util":36}],18:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = _dereq_("./util");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

function MappingPromiseArray(promises, fn, limit, _filter) {
    this.constructor$(promises);
    this._promise._captureStackTrace();
    var domain = getDomain();
    this._callback = domain === null ? fn : util.domainBind(domain, fn);
    this._preservedValues = _filter === INTERNAL
        ? new Array(this.length())
        : null;
    this._limit = limit;
    this._inFlight = 0;
    this._queue = [];
    async.invoke(this._asyncInit, this, undefined);
}
util.inherits(MappingPromiseArray, PromiseArray);

MappingPromiseArray.prototype._asyncInit = function() {
    this._init$(undefined, -2);
};

MappingPromiseArray.prototype._init = function () {};

MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var values = this._values;
    var length = this.length();
    var preservedValues = this._preservedValues;
    var limit = this._limit;

    if (index < 0) {
        index = (index * -1) - 1;
        values[index] = value;
        if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved()) return true;
        }
    } else {
        if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return false;
        }
        if (preservedValues !== null) preservedValues[index] = value;

        var promise = this._promise;
        var callback = this._callback;
        var receiver = promise._boundValue();
        promise._pushContext();
        var ret = tryCatch(callback).call(receiver, value, index, length);
        var promiseCreated = promise._popContext();
        debug.checkForgottenReturns(
            ret,
            promiseCreated,
            preservedValues !== null ? "Promise.filter" : "Promise.map",
            promise
        );
        if (ret === errorObj) {
            this._reject(ret.e);
            return true;
        }

        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            ;
            if (((bitField & 50397184) === 0)) {
                if (limit >= 1) this._inFlight++;
                values[index] = maybePromise;
                maybePromise._proxy(this, (index + 1) * -1);
                return false;
            } else if (((bitField & 33554432) !== 0)) {
                ret = maybePromise._value();
            } else if (((bitField & 16777216) !== 0)) {
                this._reject(maybePromise._reason());
                return true;
            } else {
                this._cancel();
                return true;
            }
        }
        values[index] = ret;
    }
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= length) {
        if (preservedValues !== null) {
            this._filter(values, preservedValues);
        } else {
            this._resolve(values);
        }
        return true;
    }
    return false;
};

MappingPromiseArray.prototype._drainQueue = function () {
    var queue = this._queue;
    var limit = this._limit;
    var values = this._values;
    while (queue.length > 0 && this._inFlight < limit) {
        if (this._isResolved()) return;
        var index = queue.pop();
        this._promiseFulfilled(values[index], index);
    }
};

MappingPromiseArray.prototype._filter = function (booleans, values) {
    var len = values.length;
    var ret = new Array(len);
    var j = 0;
    for (var i = 0; i < len; ++i) {
        if (booleans[i]) ret[j++] = values[i];
    }
    ret.length = j;
    this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues = function () {
    return this._preservedValues;
};

function map(promises, fn, options, _filter) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }

    var limit = 0;
    if (options !== undefined) {
        if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
                return Promise.reject(
                    new TypeError("'concurrency' must be a number but it is " +
                                    util.classString(options.concurrency)));
            }
            limit = options.concurrency;
        } else {
            return Promise.reject(new TypeError(
                            "options argument must be an object but it is " +
                             util.classString(options)));
        }
    }
    limit = typeof limit === "number" &&
        isFinite(limit) && limit >= 1 ? limit : 0;
    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
}

Promise.prototype.map = function (fn, options) {
    return map(this, fn, options, null);
};

Promise.map = function (promises, fn, options, _filter) {
    return map(promises, fn, options, _filter);
};


};

},{"./util":36}],19:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = _dereq_("./util");
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
            value, promiseCreated, "Promise.method", ret);
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value;
    if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
                                  : tryCatch(fn).call(ctx, arg);
    } else {
        value = tryCatch(fn)();
    }
    var promiseCreated = ret._popContext();
    debug.checkForgottenReturns(
        value, promiseCreated, "Promise.try", ret);
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === util.errorObj) {
        this._rejectCallback(value.e, false);
    } else {
        this._resolveCallback(value, true);
    }
};
};

},{"./util":36}],20:[function(_dereq_,module,exports){
"use strict";
var util = _dereq_("./util");
var maybeWrapAsError = util.maybeWrapAsError;
var errors = _dereq_("./errors");
var OperationalError = errors.OperationalError;
var es5 = _dereq_("./es5");

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);
        ret.name = obj.name;
        ret.message = obj.message;
        ret.stack = obj.stack;
        var keys = es5.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!rErrorKey.test(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    util.markAsOriginatingFromRejection(obj);
    return obj;
}

function nodebackForPromise(promise, multiArgs) {
    return function(err, value) {
        if (promise === null) return;
        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (!multiArgs) {
            promise._fulfill(value);
        } else {
            var args = [].slice.call(arguments, 1);;
            promise._fulfill(args);
        }
        promise = null;
    };
}

module.exports = nodebackForPromise;

},{"./errors":12,"./es5":13,"./util":36}],21:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var util = _dereq_("./util");
var async = Promise._async;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function spreadAdapter(val, nodeback) {
    var promise = this;
    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
    var ret =
        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

function successAdapter(val, nodeback) {
    var promise = this;
    var receiver = promise._boundValue();
    var ret = val === undefined
        ? tryCatch(nodeback).call(receiver, null)
        : tryCatch(nodeback).call(receiver, null, val);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}
function errorAdapter(reason, nodeback) {
    var promise = this;
    if (!reason) {
        var newReason = new Error(reason + "");
        newReason.cause = reason;
        reason = newReason;
    }
    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
                                                                     options) {
    if (typeof nodeback == "function") {
        var adapter = successAdapter;
        if (options !== undefined && Object(options).spread) {
            adapter = spreadAdapter;
        }
        this._then(
            adapter,
            errorAdapter,
            undefined,
            this,
            nodeback
        );
    }
    return this;
};
};

},{"./util":36}],22:[function(_dereq_,module,exports){
"use strict";
module.exports = function() {
var makeSelfResolutionError = function () {
    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var reflectHandler = function() {
    return new Promise.PromiseInspection(this._target());
};
var apiRejection = function(msg) {
    return Promise.reject(new TypeError(msg));
};
function Proxyable() {}
var UNDEFINED_BINDING = {};
var util = _dereq_("./util");

var getDomain;
if (util.isNode) {
    getDomain = function() {
        var ret = process.domain;
        if (ret === undefined) ret = null;
        return ret;
    };
} else {
    getDomain = function() {
        return null;
    };
}
util.notEnumerableProp(Promise, "_getDomain", getDomain);

var es5 = _dereq_("./es5");
var Async = _dereq_("./async");
var async = new Async();
es5.defineProperty(Promise, "_async", {value: async});
var errors = _dereq_("./errors");
var TypeError = Promise.TypeError = errors.TypeError;
Promise.RangeError = errors.RangeError;
var CancellationError = Promise.CancellationError = errors.CancellationError;
Promise.TimeoutError = errors.TimeoutError;
Promise.OperationalError = errors.OperationalError;
Promise.RejectionError = errors.OperationalError;
Promise.AggregateError = errors.AggregateError;
var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {};
var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
var PromiseArray =
    _dereq_("./promise_array")(Promise, INTERNAL,
                               tryConvertToPromise, apiRejection, Proxyable);
var Context = _dereq_("./context")(Promise);
 /*jshint unused:false*/
var createContext = Context.create;
var debug = _dereq_("./debuggability")(Promise, Context);
var CapturedTrace = debug.CapturedTrace;
var PassThroughHandlerContext =
    _dereq_("./finally")(Promise, tryConvertToPromise, NEXT_FILTER);
var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
var nodebackForPromise = _dereq_("./nodeback");
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
function check(self, executor) {
    if (self == null || self.constructor !== Promise) {
        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (typeof executor !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(executor));
    }

}

function Promise(executor) {
    if (executor !== INTERNAL) {
        check(this, executor);
    }
    this._bitField = 0;
    this._fulfillmentHandler0 = undefined;
    this._rejectionHandler0 = undefined;
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._resolveFromExecutor(executor);
    this._promiseCreated();
    this._fireEvent("promiseCreated", this);
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
    var len = arguments.length;
    if (len > 1) {
        var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return apiRejection("Catch statement predicate: " +
                    "expecting an object but got " + util.classString(item));
            }
        }
        catchInstances.length = j;
        fn = arguments[i];
        return this.then(undefined, catchFilter(catchInstances, fn, this));
    }
    return this.then(undefined, fn);
};

Promise.prototype.reflect = function () {
    return this._then(reflectHandler,
        reflectHandler, undefined, this, undefined);
};

Promise.prototype.then = function (didFulfill, didReject) {
    if (debug.warnings() && arguments.length > 0 &&
        typeof didFulfill !== "function" &&
        typeof didReject !== "function") {
        var msg = ".then() only accepts functions but was passed: " +
                util.classString(didFulfill);
        if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
        }
        this._warn(msg);
    }
    return this._then(didFulfill, didReject, undefined, undefined, undefined);
};

Promise.prototype.done = function (didFulfill, didReject) {
    var promise =
        this._then(didFulfill, didReject, undefined, undefined, undefined);
    promise._setIsFinal();
};

Promise.prototype.spread = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
};

Promise.prototype.toJSON = function () {
    var ret = {
        isFulfilled: false,
        isRejected: false,
        fulfillmentValue: undefined,
        rejectionReason: undefined
    };
    if (this.isFulfilled()) {
        ret.fulfillmentValue = this.value();
        ret.isFulfilled = true;
    } else if (this.isRejected()) {
        ret.rejectionReason = this.reason();
        ret.isRejected = true;
    }
    return ret;
};

Promise.prototype.all = function () {
    if (arguments.length > 0) {
        this._warn(".all() was passed arguments but it does not take any");
    }
    return new PromiseArray(this).promise();
};

Promise.prototype.error = function (fn) {
    return this.caught(util.originatesFromRejection, fn);
};

Promise.getNewLibraryCopy = module.exports;

Promise.is = function (val) {
    return val instanceof Promise;
};

Promise.fromNode = Promise.fromCallback = function(fn) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
                                         : false;
    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
    if (result === errorObj) {
        ret._rejectCallback(result.e, true);
    }
    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
    return ret;
};

Promise.all = function (promises) {
    return new PromiseArray(promises).promise();
};

Promise.cast = function (obj) {
    var ret = tryConvertToPromise(obj);
    if (!(ret instanceof Promise)) {
        ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._setFulfilled();
        ret._rejectionHandler0 = obj;
    }
    return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function (reason) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._rejectCallback(reason, true);
    return ret;
};

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    return async.setScheduler(fn);
};

Promise.prototype._then = function (
    didFulfill,
    didReject,
    _,    receiver,
    internalData
) {
    var haveInternalData = internalData !== undefined;
    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
    var target = this._target();
    var bitField = target._bitField;

    if (!haveInternalData) {
        promise._propagateFrom(this, 3);
        promise._captureStackTrace();
        if (receiver === undefined &&
            ((this._bitField & 2097152) !== 0)) {
            if (!((bitField & 50397184) === 0)) {
                receiver = this._boundValue();
            } else {
                receiver = target === this ? undefined : this._boundTo;
            }
        }
        this._fireEvent("promiseChained", this, promise);
    }

    var domain = getDomain();
    if (!((bitField & 50397184) === 0)) {
        var handler, value, settler = target._settlePromiseCtx;
        if (((bitField & 33554432) !== 0)) {
            value = target._rejectionHandler0;
            handler = didFulfill;
        } else if (((bitField & 16777216) !== 0)) {
            value = target._fulfillmentHandler0;
            handler = didReject;
            target._unsetRejectionIsUnhandled();
        } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler = didReject;
        }

        async.invoke(settler, target, {
            handler: domain === null ? handler
                : (typeof handler === "function" &&
                    util.domainBind(domain, handler)),
            promise: promise,
            receiver: receiver,
            value: value
        });
    } else {
        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
    }

    return promise;
};

Promise.prototype._length = function () {
    return this._bitField & 65535;
};

Promise.prototype._isFateSealed = function () {
    return (this._bitField & 117506048) !== 0;
};

Promise.prototype._isFollowing = function () {
    return (this._bitField & 67108864) === 67108864;
};

Promise.prototype._setLength = function (len) {
    this._bitField = (this._bitField & -65536) |
        (len & 65535);
};

Promise.prototype._setFulfilled = function () {
    this._bitField = this._bitField | 33554432;
    this._fireEvent("promiseFulfilled", this);
};

Promise.prototype._setRejected = function () {
    this._bitField = this._bitField | 16777216;
    this._fireEvent("promiseRejected", this);
};

Promise.prototype._setFollowing = function () {
    this._bitField = this._bitField | 67108864;
    this._fireEvent("promiseResolved", this);
};

Promise.prototype._setIsFinal = function () {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._isFinal = function () {
    return (this._bitField & 4194304) > 0;
};

Promise.prototype._unsetCancelled = function() {
    this._bitField = this._bitField & (~65536);
};

Promise.prototype._setCancelled = function() {
    this._bitField = this._bitField | 65536;
    this._fireEvent("promiseCancelled", this);
};

Promise.prototype._setWillBeCancelled = function() {
    this._bitField = this._bitField | 8388608;
};

Promise.prototype._setAsyncGuaranteed = function() {
    if (async.hasCustomScheduler()) return;
    this._bitField = this._bitField | 134217728;
};

Promise.prototype._receiverAt = function (index) {
    var ret = index === 0 ? this._receiver0 : this[
            index * 4 - 4 + 3];
    if (ret === UNDEFINED_BINDING) {
        return undefined;
    } else if (ret === undefined && this._isBound()) {
        return this._boundValue();
    }
    return ret;
};

Promise.prototype._promiseAt = function (index) {
    return this[
            index * 4 - 4 + 2];
};

Promise.prototype._fulfillmentHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 0];
};

Promise.prototype._rejectionHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 1];
};

Promise.prototype._boundValue = function() {};

Promise.prototype._migrateCallback0 = function (follower) {
    var bitField = follower._bitField;
    var fulfill = follower._fulfillmentHandler0;
    var reject = follower._rejectionHandler0;
    var promise = follower._promise0;
    var receiver = follower._receiverAt(0);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._migrateCallbackAt = function (follower, index) {
    var fulfill = follower._fulfillmentHandlerAt(index);
    var reject = follower._rejectionHandlerAt(index);
    var promise = follower._promiseAt(index);
    var receiver = follower._receiverAt(index);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._addCallbacks = function (
    fulfill,
    reject,
    promise,
    receiver,
    domain
) {
    var index = this._length();

    if (index >= 65535 - 4) {
        index = 0;
        this._setLength(0);
    }

    if (index === 0) {
        this._promise0 = promise;
        this._receiver0 = receiver;
        if (typeof fulfill === "function") {
            this._fulfillmentHandler0 =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this._rejectionHandler0 =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    } else {
        var base = index * 4 - 4;
        this[base + 2] = promise;
        this[base + 3] = receiver;
        if (typeof fulfill === "function") {
            this[base + 0] =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this[base + 1] =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    }
    this._setLength(index + 1);
    return index;
};

Promise.prototype._proxy = function (proxyable, arg) {
    this._addCallbacks(undefined, undefined, arg, proxyable, null);
};

Promise.prototype._resolveCallback = function(value, shouldBind) {
    if (((this._bitField & 117506048) !== 0)) return;
    if (value === this)
        return this._rejectCallback(makeSelfResolutionError(), false);
    var maybePromise = tryConvertToPromise(value, this);
    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

    if (shouldBind) this._propagateFrom(maybePromise, 2);

    var promise = maybePromise._target();

    if (promise === this) {
        this._reject(makeSelfResolutionError());
        return;
    }

    var bitField = promise._bitField;
    if (((bitField & 50397184) === 0)) {
        var len = this._length();
        if (len > 0) promise._migrateCallback0(this);
        for (var i = 1; i < len; ++i) {
            promise._migrateCallbackAt(this, i);
        }
        this._setFollowing();
        this._setLength(0);
        this._setFollowee(promise);
    } else if (((bitField & 33554432) !== 0)) {
        this._fulfill(promise._value());
    } else if (((bitField & 16777216) !== 0)) {
        this._reject(promise._reason());
    } else {
        var reason = new CancellationError("late cancellation observer");
        promise._attachExtraTrace(reason);
        this._reject(reason);
    }
};

Promise.prototype._rejectCallback =
function(reason, synchronous, ignoreNonErrorWarnings) {
    var trace = util.ensureErrorObject(reason);
    var hasStack = trace === reason;
    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
        var message = "a promise was rejected with a non-error: " +
            util.classString(reason);
        this._warn(message, true);
    }
    this._attachExtraTrace(trace, synchronous ? hasStack : false);
    this._reject(reason);
};

Promise.prototype._resolveFromExecutor = function (executor) {
    if (executor === INTERNAL) return;
    var promise = this;
    this._captureStackTrace();
    this._pushContext();
    var synchronous = true;
    var r = this._execute(executor, function(value) {
        promise._resolveCallback(value);
    }, function (reason) {
        promise._rejectCallback(reason, synchronous);
    });
    synchronous = false;
    this._popContext();

    if (r !== undefined) {
        promise._rejectCallback(r, true);
    }
};

Promise.prototype._settlePromiseFromHandler = function (
    handler, receiver, value, promise
) {
    var bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;
    promise._pushContext();
    var x;
    if (receiver === APPLY) {
        if (!value || typeof value.length !== "number") {
            x = errorObj;
            x.e = new TypeError("cannot .spread() a non-array: " +
                                    util.classString(value));
        } else {
            x = tryCatch(handler).apply(this._boundValue(), value);
        }
    } else {
        x = tryCatch(handler).call(receiver, value);
    }
    var promiseCreated = promise._popContext();
    bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;

    if (x === NEXT_FILTER) {
        promise._reject(value);
    } else if (x === errorObj) {
        promise._rejectCallback(x.e, false);
    } else {
        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
        promise._resolveCallback(x);
    }
};

Promise.prototype._target = function() {
    var ret = this;
    while (ret._isFollowing()) ret = ret._followee();
    return ret;
};

Promise.prototype._followee = function() {
    return this._rejectionHandler0;
};

Promise.prototype._setFollowee = function(promise) {
    this._rejectionHandler0 = promise;
};

Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
    var isPromise = promise instanceof Promise;
    var bitField = this._bitField;
    var asyncGuaranteed = ((bitField & 134217728) !== 0);
    if (((bitField & 65536) !== 0)) {
        if (isPromise) promise._invokeInternalOnCancel();

        if (receiver instanceof PassThroughHandlerContext &&
            receiver.isFinallyHandler()) {
            receiver.cancelPromise = promise;
            if (tryCatch(handler).call(receiver, value) === errorObj) {
                promise._reject(errorObj.e);
            }
        } else if (handler === reflectHandler) {
            promise._fulfill(reflectHandler.call(receiver));
        } else if (receiver instanceof Proxyable) {
            receiver._promiseCancelled(promise);
        } else if (isPromise || promise instanceof PromiseArray) {
            promise._cancel();
        } else {
            receiver.cancel();
        }
    } else if (typeof handler === "function") {
        if (!isPromise) {
            handler.call(receiver, value, promise);
        } else {
            if (asyncGuaranteed) promise._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (receiver instanceof Proxyable) {
        if (!receiver._isResolved()) {
            if (((bitField & 33554432) !== 0)) {
                receiver._promiseFulfilled(value, promise);
            } else {
                receiver._promiseRejected(value, promise);
            }
        }
    } else if (isPromise) {
        if (asyncGuaranteed) promise._setAsyncGuaranteed();
        if (((bitField & 33554432) !== 0)) {
            promise._fulfill(value);
        } else {
            promise._reject(value);
        }
    }
};

Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
    var handler = ctx.handler;
    var promise = ctx.promise;
    var receiver = ctx.receiver;
    var value = ctx.value;
    if (typeof handler === "function") {
        if (!(promise instanceof Promise)) {
            handler.call(receiver, value, promise);
        } else {
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (promise instanceof Promise) {
        promise._reject(value);
    }
};

Promise.prototype._settlePromiseCtx = function(ctx) {
    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
};

Promise.prototype._settlePromise0 = function(handler, value, bitField) {
    var promise = this._promise0;
    var receiver = this._receiverAt(0);
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._settlePromise(promise, handler, receiver, value);
};

Promise.prototype._clearCallbackDataAtIndex = function(index) {
    var base = index * 4 - 4;
    this[base + 2] =
    this[base + 3] =
    this[base + 0] =
    this[base + 1] = undefined;
};

Promise.prototype._fulfill = function (value) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    if (value === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._reject(err);
    }
    this._setFulfilled();
    this._rejectionHandler0 = value;

    if ((bitField & 65535) > 0) {
        if (((bitField & 134217728) !== 0)) {
            this._settlePromises();
        } else {
            async.settlePromises(this);
        }
    }
};

Promise.prototype._reject = function (reason) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    this._setRejected();
    this._fulfillmentHandler0 = reason;

    if (this._isFinal()) {
        return async.fatalError(reason, util.isNode);
    }

    if ((bitField & 65535) > 0) {
        async.settlePromises(this);
    } else {
        this._ensurePossibleRejectionHandled();
    }
};

Promise.prototype._fulfillPromises = function (len, value) {
    for (var i = 1; i < len; i++) {
        var handler = this._fulfillmentHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, value);
    }
};

Promise.prototype._rejectPromises = function (len, reason) {
    for (var i = 1; i < len; i++) {
        var handler = this._rejectionHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, reason);
    }
};

Promise.prototype._settlePromises = function () {
    var bitField = this._bitField;
    var len = (bitField & 65535);

    if (len > 0) {
        if (((bitField & 16842752) !== 0)) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
        } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
        }
        this._setLength(0);
    }
    this._clearCancellationData();
};

Promise.prototype._settledValue = function() {
    var bitField = this._bitField;
    if (((bitField & 33554432) !== 0)) {
        return this._rejectionHandler0;
    } else if (((bitField & 16777216) !== 0)) {
        return this._fulfillmentHandler0;
    }
};

function deferResolve(v) {this.promise._resolveCallback(v);}
function deferReject(v) {this.promise._rejectCallback(v, false);}

Promise.defer = Promise.pending = function() {
    debug.deprecated("Promise.defer", "new Promise");
    var promise = new Promise(INTERNAL);
    return {
        promise: promise,
        resolve: deferResolve,
        reject: deferReject
    };
};

util.notEnumerableProp(Promise,
                       "_makeSelfResolutionError",
                       makeSelfResolutionError);

_dereq_("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection,
    debug);
_dereq_("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
_dereq_("./cancel")(Promise, PromiseArray, apiRejection, debug);
_dereq_("./direct_resolve")(Promise);
_dereq_("./synchronous_inspection")(Promise);
_dereq_("./join")(
    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
Promise.Promise = Promise;
Promise.version = "3.5.1";
_dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
_dereq_('./call_get.js')(Promise);
_dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
_dereq_('./timers.js')(Promise, INTERNAL, debug);
_dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
_dereq_('./nodeify.js')(Promise);
_dereq_('./promisify.js')(Promise, INTERNAL);
_dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
_dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
_dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
_dereq_('./settle.js')(Promise, PromiseArray, debug);
_dereq_('./some.js')(Promise, PromiseArray, apiRejection);
_dereq_('./filter.js')(Promise, INTERNAL);
_dereq_('./each.js')(Promise, INTERNAL);
_dereq_('./any.js')(Promise);
                                                         
    util.toFastProperties(Promise);                                          
    util.toFastProperties(Promise.prototype);                                
    function fillTypes(value) {                                              
        var p = new Promise(INTERNAL);                                       
        p._fulfillmentHandler0 = value;                                      
        p._rejectionHandler0 = value;                                        
        p._promise0 = value;                                                 
        p._receiver0 = value;                                                
    }                                                                        
    // Complete slack tracking, opt out of field-type tracking and           
    // stabilize map                                                         
    fillTypes({a: 1});                                                       
    fillTypes({b: 2});                                                       
    fillTypes({c: 3});                                                       
    fillTypes(1);                                                            
    fillTypes(function(){});                                                 
    fillTypes(undefined);                                                    
    fillTypes(false);                                                        
    fillTypes(new Promise(INTERNAL));                                        
    debug.setBounds(Async.firstLineError, util.lastLineError);               
    return Promise;                                                          

};

},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise,
    apiRejection, Proxyable) {
var util = _dereq_("./util");
var isArray = util.isArray;

function toResolutionValue(val) {
    switch(val) {
    case -2: return [];
    case -3: return {};
    case -6: return new Map();
    }
}

function PromiseArray(values) {
    var promise = this._promise = new Promise(INTERNAL);
    if (values instanceof Promise) {
        promise._propagateFrom(values, 3);
    }
    promise._setOnCancel(this);
    this._values = values;
    this._length = 0;
    this._totalResolved = 0;
    this._init(undefined, -2);
}
util.inherits(PromiseArray, Proxyable);

PromiseArray.prototype.length = function () {
    return this._length;
};

PromiseArray.prototype.promise = function () {
    return this._promise;
};

PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
    var values = tryConvertToPromise(this._values, this._promise);
    if (values instanceof Promise) {
        values = values._target();
        var bitField = values._bitField;
        ;
        this._values = values;

        if (((bitField & 50397184) === 0)) {
            this._promise._setAsyncGuaranteed();
            return values._then(
                init,
                this._reject,
                undefined,
                this,
                resolveValueIfEmpty
           );
        } else if (((bitField & 33554432) !== 0)) {
            values = values._value();
        } else if (((bitField & 16777216) !== 0)) {
            return this._reject(values._reason());
        } else {
            return this._cancel();
        }
    }
    values = util.asArray(values);
    if (values === null) {
        var err = apiRejection(
            "expecting an array or an iterable object but got " + util.classString(values)).reason();
        this._promise._rejectCallback(err, false);
        return;
    }

    if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
        }
        else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
    }
    this._iterate(values);
};

PromiseArray.prototype._iterate = function(values) {
    var len = this.getActualLength(values.length);
    this._length = len;
    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
    var result = this._promise;
    var isResolved = false;
    var bitField = null;
    for (var i = 0; i < len; ++i) {
        var maybePromise = tryConvertToPromise(values[i], result);

        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            bitField = maybePromise._bitField;
        } else {
            bitField = null;
        }

        if (isResolved) {
            if (bitField !== null) {
                maybePromise.suppressUnhandledRejections();
            }
        } else if (bitField !== null) {
            if (((bitField & 50397184) === 0)) {
                maybePromise._proxy(this, i);
                this._values[i] = maybePromise;
            } else if (((bitField & 33554432) !== 0)) {
                isResolved = this._promiseFulfilled(maybePromise._value(), i);
            } else if (((bitField & 16777216) !== 0)) {
                isResolved = this._promiseRejected(maybePromise._reason(), i);
            } else {
                isResolved = this._promiseCancelled(i);
            }
        } else {
            isResolved = this._promiseFulfilled(maybePromise, i);
        }
    }
    if (!isResolved) result._setAsyncGuaranteed();
};

PromiseArray.prototype._isResolved = function () {
    return this._values === null;
};

PromiseArray.prototype._resolve = function (value) {
    this._values = null;
    this._promise._fulfill(value);
};

PromiseArray.prototype._cancel = function() {
    if (this._isResolved() || !this._promise._isCancellable()) return;
    this._values = null;
    this._promise._cancel();
};

PromiseArray.prototype._reject = function (reason) {
    this._values = null;
    this._promise._rejectCallback(reason, false);
};

PromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

PromiseArray.prototype._promiseCancelled = function() {
    this._cancel();
    return true;
};

PromiseArray.prototype._promiseRejected = function (reason) {
    this._totalResolved++;
    this._reject(reason);
    return true;
};

PromiseArray.prototype._resultCancelled = function() {
    if (this._isResolved()) return;
    var values = this._values;
    this._cancel();
    if (values instanceof Promise) {
        values.cancel();
    } else {
        for (var i = 0; i < values.length; ++i) {
            if (values[i] instanceof Promise) {
                values[i].cancel();
            }
        }
    }
};

PromiseArray.prototype.shouldCopyValues = function () {
    return true;
};

PromiseArray.prototype.getActualLength = function (len) {
    return len;
};

return PromiseArray;
};

},{"./util":36}],24:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var THIS = {};
var util = _dereq_("./util");
var nodebackForPromise = _dereq_("./nodeback");
var withAppended = util.withAppended;
var maybeWrapAsError = util.maybeWrapAsError;
var canEvaluate = util.canEvaluate;
var TypeError = _dereq_("./errors").TypeError;
var defaultSuffix = "Async";
var defaultPromisified = {__isPromisified__: true};
var noCopyProps = [
    "arity",    "length",
    "name",
    "arguments",
    "caller",
    "callee",
    "prototype",
    "__isPromisified__"
];
var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

var defaultFilter = function(name) {
    return util.isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        name !== "constructor";
};

function propsFilter(key) {
    return !noCopyPropsPattern.test(key);
}

function isPromisified(fn) {
    try {
        return fn.__isPromisified__ === true;
    }
    catch (e) {
        return false;
    }
}

function hasPromisified(obj, key, suffix) {
    var val = util.getDataPropertyOrDefault(obj, key + suffix,
                                            defaultPromisified);
    return val ? isPromisified(val) : false;
}
function checkValid(ret, suffix, suffixRegexp) {
    for (var i = 0; i < ret.length; i += 2) {
        var key = ret[i];
        if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret.length; j += 2) {
                if (ret[j] === keyWithoutAsyncSuffix) {
                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
                        .replace("%s", suffix));
                }
            }
        }
    }
}

function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
    var keys = util.inheritedDataKeys(obj);
    var ret = [];
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = obj[key];
        var passesDefaultFilter = filter === defaultFilter
            ? true : defaultFilter(key, value, obj);
        if (typeof value === "function" &&
            !isPromisified(value) &&
            !hasPromisified(obj, key, suffix) &&
            filter(key, value, obj, passesDefaultFilter)) {
            ret.push(key, value);
        }
    }
    checkValid(ret, suffix, suffixRegexp);
    return ret;
}

var escapeIdentRegex = function(str) {
    return str.replace(/([$])/, "\\$");
};

var makeNodePromisifiedEval;
if (false) {
var switchCaseArgumentOrder = function(likelyArgumentCount) {
    var ret = [likelyArgumentCount];
    var min = Math.max(0, likelyArgumentCount - 1 - 3);
    for(var i = likelyArgumentCount - 1; i >= min; --i) {
        ret.push(i);
    }
    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
        ret.push(i);
    }
    return ret;
};

var argumentSequence = function(argumentCount) {
    return util.filledRange(argumentCount, "_arg", "");
};

var parameterDeclaration = function(parameterCount) {
    return util.filledRange(
        Math.max(parameterCount, 3), "_arg", "");
};

var parameterCount = function(fn) {
    if (typeof fn.length === "number") {
        return Math.max(Math.min(fn.length, 1023 + 1), 0);
    }
    return 0;
};

makeNodePromisifiedEval =
function(callback, receiver, originalName, fn, _, multiArgs) {
    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

    function generateCallForArgumentCount(count) {
        var args = argumentSequence(count).join(", ");
        var comma = count > 0 ? ", " : "";
        var ret;
        if (shouldProxyThis) {
            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
        } else {
            ret = receiver === undefined
                ? "ret = callback({{args}}, nodeback); break;\n"
                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
        }
        return ret.replace("{{args}}", args).replace(", ", comma);
    }

    function generateArgumentSwitchCase() {
        var ret = "";
        for (var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] +":" +
                generateCallForArgumentCount(argumentOrder[i]);
        }

        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
                                ? "ret = callback.apply(this, args);\n"
                                : "ret = callback.apply(receiver, args);\n"));
        return ret;
    }

    var getFunctionCode = typeof callback === "string"
                                ? ("this != null ? this['"+callback+"'] : fn")
                                : "fn";
    var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
        .replace("[GetFunctionCode]", getFunctionCode);
    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
    return new Function("Promise",
                        "fn",
                        "receiver",
                        "withAppended",
                        "maybeWrapAsError",
                        "nodebackForPromise",
                        "tryCatch",
                        "errorObj",
                        "notEnumerableProp",
                        "INTERNAL",
                        body)(
                    Promise,
                    fn,
                    receiver,
                    withAppended,
                    maybeWrapAsError,
                    nodebackForPromise,
                    util.tryCatch,
                    util.errorObj,
                    util.notEnumerableProp,
                    INTERNAL);
};
}

function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
    var defaultThis = (function() {return this;})();
    var method = callback;
    if (typeof method === "string") {
        callback = fn;
    }
    function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        var cb = typeof method === "string" && this !== defaultThis
            ? this[method] : callback;
        var fn = nodebackForPromise(promise, multiArgs);
        try {
            cb.apply(_receiver, withAppended(arguments, fn));
        } catch(e) {
            promise._rejectCallback(maybeWrapAsError(e), true, true);
        }
        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
        return promise;
    }
    util.notEnumerableProp(promisified, "__isPromisified__", true);
    return promisified;
}

var makeNodePromisified = canEvaluate
    ? makeNodePromisifiedEval
    : makeNodePromisifiedClosure;

function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
    var methods =
        promisifiableMethods(obj, suffix, suffixRegexp, filter);

    for (var i = 0, len = methods.length; i < len; i+= 2) {
        var key = methods[i];
        var fn = methods[i+1];
        var promisifiedKey = key + suffix;
        if (promisifier === makeNodePromisified) {
            obj[promisifiedKey] =
                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
        } else {
            var promisified = promisifier(fn, function() {
                return makeNodePromisified(key, THIS, key,
                                           fn, suffix, multiArgs);
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj[promisifiedKey] = promisified;
        }
    }
    util.toFastProperties(obj);
    return obj;
}

function promisify(callback, receiver, multiArgs) {
    return makeNodePromisified(callback, receiver, undefined,
                                callback, null, multiArgs);
}

Promise.promisify = function (fn, options) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    if (isPromisified(fn)) {
        return fn;
    }
    options = Object(options);
    var receiver = options.context === undefined ? THIS : options.context;
    var multiArgs = !!options.multiArgs;
    var ret = promisify(fn, receiver, multiArgs);
    util.copyDescriptors(fn, ret, propsFilter);
    return ret;
};

Promise.promisifyAll = function (target, options) {
    if (typeof target !== "function" && typeof target !== "object") {
        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    options = Object(options);
    var multiArgs = !!options.multiArgs;
    var suffix = options.suffix;
    if (typeof suffix !== "string") suffix = defaultSuffix;
    var filter = options.filter;
    if (typeof filter !== "function") filter = defaultFilter;
    var promisifier = options.promisifier;
    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

    if (!util.isIdentifier(suffix)) {
        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }

    var keys = util.inheritedDataKeys(target);
    for (var i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        if (keys[i] !== "constructor" &&
            util.isClass(value)) {
            promisifyAll(value.prototype, suffix, filter, promisifier,
                multiArgs);
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
        }
    }

    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
};
};


},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(_dereq_,module,exports){
"use strict";
module.exports = function(
    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
var util = _dereq_("./util");
var isObject = util.isObject;
var es5 = _dereq_("./es5");
var Es6Map;
if (typeof Map === "function") Es6Map = Map;

var mapToEntries = (function() {
    var index = 0;
    var size = 0;

    function extractEntry(value, key) {
        this[index] = value;
        this[index + size] = key;
        index++;
    }

    return function mapToEntries(map) {
        size = map.size;
        index = 0;
        var ret = new Array(map.size * 2);
        map.forEach(extractEntry, ret);
        return ret;
    };
})();

var entriesToMap = function(entries) {
    var ret = new Es6Map();
    var length = entries.length / 2 | 0;
    for (var i = 0; i < length; ++i) {
        var key = entries[length + i];
        var value = entries[i];
        ret.set(key, value);
    }
    return ret;
};

function PropertiesPromiseArray(obj) {
    var isMap = false;
    var entries;
    if (Es6Map !== undefined && obj instanceof Es6Map) {
        entries = mapToEntries(obj);
        isMap = true;
    } else {
        var keys = es5.keys(obj);
        var len = keys.length;
        entries = new Array(len * 2);
        for (var i = 0; i < len; ++i) {
            var key = keys[i];
            entries[i] = obj[key];
            entries[i + len] = key;
        }
    }
    this.constructor$(entries);
    this._isMap = isMap;
    this._init$(undefined, isMap ? -6 : -3);
}
util.inherits(PropertiesPromiseArray, PromiseArray);

PropertiesPromiseArray.prototype._init = function () {};

PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        var val;
        if (this._isMap) {
            val = entriesToMap(this._values);
        } else {
            val = {};
            var keyOffset = this.length();
            for (var i = 0, len = this.length(); i < len; ++i) {
                val[this._values[i + keyOffset]] = this._values[i];
            }
        }
        this._resolve(val);
        return true;
    }
    return false;
};

PropertiesPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

PropertiesPromiseArray.prototype.getActualLength = function (len) {
    return len >> 1;
};

function props(promises) {
    var ret;
    var castValue = tryConvertToPromise(promises);

    if (!isObject(castValue)) {
        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    } else if (castValue instanceof Promise) {
        ret = castValue._then(
            Promise.props, undefined, undefined, undefined, undefined);
    } else {
        ret = new PropertiesPromiseArray(castValue).promise();
    }

    if (castValue instanceof Promise) {
        ret._propagateFrom(castValue, 2);
    }
    return ret;
}

Promise.prototype.props = function () {
    return props(this);
};

Promise.props = function (promises) {
    return props(promises);
};
};

},{"./es5":13,"./util":36}],26:[function(_dereq_,module,exports){
"use strict";
function arrayMove(src, srcIndex, dst, dstIndex, len) {
    for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
    }
}

function Queue(capacity) {
    this._capacity = capacity;
    this._length = 0;
    this._front = 0;
}

Queue.prototype._willBeOverCapacity = function (size) {
    return this._capacity < size;
};

Queue.prototype._pushOne = function (arg) {
    var length = this.length();
    this._checkCapacity(length + 1);
    var i = (this._front + length) & (this._capacity - 1);
    this[i] = arg;
    this._length = length + 1;
};

Queue.prototype.push = function (fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver);
        this._pushOne(arg);
        return;
    }
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[(j + 0) & wrapMask] = fn;
    this[(j + 1) & wrapMask] = receiver;
    this[(j + 2) & wrapMask] = arg;
    this._length = length;
};

Queue.prototype.shift = function () {
    var front = this._front,
        ret = this[front];

    this[front] = undefined;
    this._front = (front + 1) & (this._capacity - 1);
    this._length--;
    return ret;
};

Queue.prototype.length = function () {
    return this._length;
};

Queue.prototype._checkCapacity = function (size) {
    if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
    }
};

Queue.prototype._resizeTo = function (capacity) {
    var oldCapacity = this._capacity;
    this._capacity = capacity;
    var front = this._front;
    var length = this._length;
    var moveItemsCount = (front + length) & (oldCapacity - 1);
    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
};

module.exports = Queue;

},{}],27:[function(_dereq_,module,exports){
"use strict";
module.exports = function(
    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var util = _dereq_("./util");

var raceLater = function (promise) {
    return promise.then(function(array) {
        return race(array, promise);
    });
};

function race(promises, parent) {
    var maybePromise = tryConvertToPromise(promises);

    if (maybePromise instanceof Promise) {
        return raceLater(maybePromise);
    } else {
        promises = util.asArray(promises);
        if (promises === null)
            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
    }

    var ret = new Promise(INTERNAL);
    if (parent !== undefined) {
        ret._propagateFrom(parent, 3);
    }
    var fulfill = ret._fulfill;
    var reject = ret._reject;
    for (var i = 0, len = promises.length; i < len; ++i) {
        var val = promises[i];

        if (val === undefined && !(i in promises)) {
            continue;
        }

        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
    }
    return ret;
}

Promise.race = function (promises) {
    return race(promises, undefined);
};

Promise.prototype.race = function () {
    return race(this, undefined);
};

};

},{"./util":36}],28:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = _dereq_("./util");
var tryCatch = util.tryCatch;

function ReductionPromiseArray(promises, fn, initialValue, _each) {
    this.constructor$(promises);
    var domain = getDomain();
    this._fn = domain === null ? fn : util.domainBind(domain, fn);
    if (initialValue !== undefined) {
        initialValue = Promise.resolve(initialValue);
        initialValue._attachCancellationCallback(this);
    }
    this._initialValue = initialValue;
    this._currentCancellable = null;
    if(_each === INTERNAL) {
        this._eachValues = Array(this._length);
    } else if (_each === 0) {
        this._eachValues = null;
    } else {
        this._eachValues = undefined;
    }
    this._promise._captureStackTrace();
    this._init$(undefined, -5);
}
util.inherits(ReductionPromiseArray, PromiseArray);

ReductionPromiseArray.prototype._gotAccum = function(accum) {
    if (this._eachValues !== undefined && 
        this._eachValues !== null && 
        accum !== INTERNAL) {
        this._eachValues.push(accum);
    }
};

ReductionPromiseArray.prototype._eachComplete = function(value) {
    if (this._eachValues !== null) {
        this._eachValues.push(value);
    }
    return this._eachValues;
};

ReductionPromiseArray.prototype._init = function() {};

ReductionPromiseArray.prototype._resolveEmptyArray = function() {
    this._resolve(this._eachValues !== undefined ? this._eachValues
                                                 : this._initialValue);
};

ReductionPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

ReductionPromiseArray.prototype._resolve = function(value) {
    this._promise._resolveCallback(value);
    this._values = null;
};

ReductionPromiseArray.prototype._resultCancelled = function(sender) {
    if (sender === this._initialValue) return this._cancel();
    if (this._isResolved()) return;
    this._resultCancelled$();
    if (this._currentCancellable instanceof Promise) {
        this._currentCancellable.cancel();
    }
    if (this._initialValue instanceof Promise) {
        this._initialValue.cancel();
    }
};

ReductionPromiseArray.prototype._iterate = function (values) {
    this._values = values;
    var value;
    var i;
    var length = values.length;
    if (this._initialValue !== undefined) {
        value = this._initialValue;
        i = 0;
    } else {
        value = Promise.resolve(values[0]);
        i = 1;
    }

    this._currentCancellable = value;

    if (!value.isRejected()) {
        for (; i < length; ++i) {
            var ctx = {
                accum: null,
                value: values[i],
                index: i,
                length: length,
                array: this
            };
            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
        }
    }

    if (this._eachValues !== undefined) {
        value = value
            ._then(this._eachComplete, undefined, undefined, this, undefined);
    }
    value._then(completed, completed, undefined, value, this);
};

Promise.prototype.reduce = function (fn, initialValue) {
    return reduce(this, fn, initialValue, null);
};

Promise.reduce = function (promises, fn, initialValue, _each) {
    return reduce(promises, fn, initialValue, _each);
};

function completed(valueOrReason, array) {
    if (this.isFulfilled()) {
        array._resolve(valueOrReason);
    } else {
        array._reject(valueOrReason);
    }
}

function reduce(promises, fn, initialValue, _each) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
    return array.promise();
}

function gotAccum(accum) {
    this.accum = accum;
    this.array._gotAccum(accum);
    var value = tryConvertToPromise(this.value, this.array._promise);
    if (value instanceof Promise) {
        this.array._currentCancellable = value;
        return value._then(gotValue, undefined, undefined, this, undefined);
    } else {
        return gotValue.call(this, value);
    }
}

function gotValue(value) {
    var array = this.array;
    var promise = array._promise;
    var fn = tryCatch(array._fn);
    promise._pushContext();
    var ret;
    if (array._eachValues !== undefined) {
        ret = fn.call(promise._boundValue(), value, this.index, this.length);
    } else {
        ret = fn.call(promise._boundValue(),
                              this.accum, value, this.index, this.length);
    }
    if (ret instanceof Promise) {
        array._currentCancellable = ret;
    }
    var promiseCreated = promise._popContext();
    debug.checkForgottenReturns(
        ret,
        promiseCreated,
        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
        promise
    );
    return ret;
}
};

},{"./util":36}],29:[function(_dereq_,module,exports){
"use strict";
var util = _dereq_("./util");
var schedule;
var noAsyncScheduler = function() {
    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var NativePromise = util.getNativePromise();
if (util.isNode && typeof MutationObserver === "undefined") {
    var GlobalSetImmediate = global.setImmediate;
    var ProcessNextTick = process.nextTick;
    schedule = util.isRecentNode
                ? function(fn) { GlobalSetImmediate.call(global, fn); }
                : function(fn) { ProcessNextTick.call(process, fn); };
} else if (typeof NativePromise === "function" &&
           typeof NativePromise.resolve === "function") {
    var nativePromise = NativePromise.resolve();
    schedule = function(fn) {
        nativePromise.then(fn);
    };
} else if ((typeof MutationObserver !== "undefined") &&
          !(typeof window !== "undefined" &&
            window.navigator &&
            (window.navigator.standalone || window.cordova))) {
    schedule = (function() {
        var div = document.createElement("div");
        var opts = {attributes: true};
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
            div.classList.toggle("foo");
            toggleScheduled = false;
        });
        o2.observe(div2, opts);

        var scheduleToggle = function() {
            if (toggleScheduled) return;
            toggleScheduled = true;
            div2.classList.toggle("foo");
        };

        return function schedule(fn) {
            var o = new MutationObserver(function() {
                o.disconnect();
                fn();
            });
            o.observe(div, opts);
            scheduleToggle();
        };
    })();
} else if (typeof setImmediate !== "undefined") {
    schedule = function (fn) {
        setImmediate(fn);
    };
} else if (typeof setTimeout !== "undefined") {
    schedule = function (fn) {
        setTimeout(fn, 0);
    };
} else {
    schedule = noAsyncScheduler;
}
module.exports = schedule;

},{"./util":36}],30:[function(_dereq_,module,exports){
"use strict";
module.exports =
    function(Promise, PromiseArray, debug) {
var PromiseInspection = Promise.PromiseInspection;
var util = _dereq_("./util");

function SettledPromiseArray(values) {
    this.constructor$(values);
}
util.inherits(SettledPromiseArray, PromiseArray);

SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
    this._values[index] = inspection;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var ret = new PromiseInspection();
    ret._bitField = 33554432;
    ret._settledValueField = value;
    return this._promiseResolved(index, ret);
};
SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
    var ret = new PromiseInspection();
    ret._bitField = 16777216;
    ret._settledValueField = reason;
    return this._promiseResolved(index, ret);
};

Promise.settle = function (promises) {
    debug.deprecated(".settle()", ".reflect()");
    return new SettledPromiseArray(promises).promise();
};

Promise.prototype.settle = function () {
    return Promise.settle(this);
};
};

},{"./util":36}],31:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, apiRejection) {
var util = _dereq_("./util");
var RangeError = _dereq_("./errors").RangeError;
var AggregateError = _dereq_("./errors").AggregateError;
var isArray = util.isArray;
var CANCELLATION = {};


function SomePromiseArray(values) {
    this.constructor$(values);
    this._howMany = 0;
    this._unwrap = false;
    this._initialized = false;
}
util.inherits(SomePromiseArray, PromiseArray);

SomePromiseArray.prototype._init = function () {
    if (!this._initialized) {
        return;
    }
    if (this._howMany === 0) {
        this._resolve([]);
        return;
    }
    this._init$(undefined, -5);
    var isArrayResolved = isArray(this._values);
    if (!this._isResolved() &&
        isArrayResolved &&
        this._howMany > this._canPossiblyFulfill()) {
        this._reject(this._getRangeError(this.length()));
    }
};

SomePromiseArray.prototype.init = function () {
    this._initialized = true;
    this._init();
};

SomePromiseArray.prototype.setUnwrap = function () {
    this._unwrap = true;
};

SomePromiseArray.prototype.howMany = function () {
    return this._howMany;
};

SomePromiseArray.prototype.setHowMany = function (count) {
    this._howMany = count;
};

SomePromiseArray.prototype._promiseFulfilled = function (value) {
    this._addFulfilled(value);
    if (this._fulfilled() === this.howMany()) {
        this._values.length = this.howMany();
        if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
        } else {
            this._resolve(this._values);
        }
        return true;
    }
    return false;

};
SomePromiseArray.prototype._promiseRejected = function (reason) {
    this._addRejected(reason);
    return this._checkOutcome();
};

SomePromiseArray.prototype._promiseCancelled = function () {
    if (this._values instanceof Promise || this._values == null) {
        return this._cancel();
    }
    this._addRejected(CANCELLATION);
    return this._checkOutcome();
};

SomePromiseArray.prototype._checkOutcome = function() {
    if (this.howMany() > this._canPossiblyFulfill()) {
        var e = new AggregateError();
        for (var i = this.length(); i < this._values.length; ++i) {
            if (this._values[i] !== CANCELLATION) {
                e.push(this._values[i]);
            }
        }
        if (e.length > 0) {
            this._reject(e);
        } else {
            this._cancel();
        }
        return true;
    }
    return false;
};

SomePromiseArray.prototype._fulfilled = function () {
    return this._totalResolved;
};

SomePromiseArray.prototype._rejected = function () {
    return this._values.length - this.length();
};

SomePromiseArray.prototype._addRejected = function (reason) {
    this._values.push(reason);
};

SomePromiseArray.prototype._addFulfilled = function (value) {
    this._values[this._totalResolved++] = value;
};

SomePromiseArray.prototype._canPossiblyFulfill = function () {
    return this.length() - this._rejected();
};

SomePromiseArray.prototype._getRangeError = function (count) {
    var message = "Input array must contain at least " +
            this._howMany + " items but contains only " + count + " items";
    return new RangeError(message);
};

SomePromiseArray.prototype._resolveEmptyArray = function () {
    this._reject(this._getRangeError(0));
};

function some(promises, howMany) {
    if ((howMany | 0) !== howMany || howMany < 0) {
        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(howMany);
    ret.init();
    return promise;
}

Promise.some = function (promises, howMany) {
    return some(promises, howMany);
};

Promise.prototype.some = function (howMany) {
    return some(this, howMany);
};

Promise._SomePromiseArray = SomePromiseArray;
};

},{"./errors":12,"./util":36}],32:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
function PromiseInspection(promise) {
    if (promise !== undefined) {
        promise = promise._target();
        this._bitField = promise._bitField;
        this._settledValueField = promise._isFateSealed()
            ? promise._settledValue() : undefined;
    }
    else {
        this._bitField = 0;
        this._settledValueField = undefined;
    }
}

PromiseInspection.prototype._settledValue = function() {
    return this._settledValueField;
};

var value = PromiseInspection.prototype.value = function () {
    if (!this.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var reason = PromiseInspection.prototype.error =
PromiseInspection.prototype.reason = function () {
    if (!this.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
    return (this._bitField & 33554432) !== 0;
};

var isRejected = PromiseInspection.prototype.isRejected = function () {
    return (this._bitField & 16777216) !== 0;
};

var isPending = PromiseInspection.prototype.isPending = function () {
    return (this._bitField & 50397184) === 0;
};

var isResolved = PromiseInspection.prototype.isResolved = function () {
    return (this._bitField & 50331648) !== 0;
};

PromiseInspection.prototype.isCancelled = function() {
    return (this._bitField & 8454144) !== 0;
};

Promise.prototype.__isCancelled = function() {
    return (this._bitField & 65536) === 65536;
};

Promise.prototype._isCancelled = function() {
    return this._target().__isCancelled();
};

Promise.prototype.isCancelled = function() {
    return (this._target()._bitField & 8454144) !== 0;
};

Promise.prototype.isPending = function() {
    return isPending.call(this._target());
};

Promise.prototype.isRejected = function() {
    return isRejected.call(this._target());
};

Promise.prototype.isFulfilled = function() {
    return isFulfilled.call(this._target());
};

Promise.prototype.isResolved = function() {
    return isResolved.call(this._target());
};

Promise.prototype.value = function() {
    return value.call(this._target());
};

Promise.prototype.reason = function() {
    var target = this._target();
    target._unsetRejectionIsUnhandled();
    return reason.call(target);
};

Promise.prototype._value = function() {
    return this._settledValue();
};

Promise.prototype._reason = function() {
    this._unsetRejectionIsUnhandled();
    return this._settledValue();
};

Promise.PromiseInspection = PromiseInspection;
};

},{}],33:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var util = _dereq_("./util");
var errorObj = util.errorObj;
var isObject = util.isObject;

function tryConvertToPromise(obj, context) {
    if (isObject(obj)) {
        if (obj instanceof Promise) return obj;
        var then = getThen(obj);
        if (then === errorObj) {
            if (context) context._pushContext();
            var ret = Promise.reject(then.e);
            if (context) context._popContext();
            return ret;
        } else if (typeof then === "function") {
            if (isAnyBluebirdPromise(obj)) {
                var ret = new Promise(INTERNAL);
                obj._then(
                    ret._fulfill,
                    ret._reject,
                    undefined,
                    ret,
                    null
                );
                return ret;
            }
            return doThenable(obj, then, context);
        }
    }
    return obj;
}

function doGetThen(obj) {
    return obj.then;
}

function getThen(obj) {
    try {
        return doGetThen(obj);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

var hasProp = {}.hasOwnProperty;
function isAnyBluebirdPromise(obj) {
    try {
        return hasProp.call(obj, "_promise0");
    } catch (e) {
        return false;
    }
}

function doThenable(x, then, context) {
    var promise = new Promise(INTERNAL);
    var ret = promise;
    if (context) context._pushContext();
    promise._captureStackTrace();
    if (context) context._popContext();
    var synchronous = true;
    var result = util.tryCatch(then).call(x, resolve, reject);
    synchronous = false;

    if (promise && result === errorObj) {
        promise._rejectCallback(result.e, true, true);
        promise = null;
    }

    function resolve(value) {
        if (!promise) return;
        promise._resolveCallback(value);
        promise = null;
    }

    function reject(reason) {
        if (!promise) return;
        promise._rejectCallback(reason, synchronous, true);
        promise = null;
    }
    return ret;
}

return tryConvertToPromise;
};

},{"./util":36}],34:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, debug) {
var util = _dereq_("./util");
var TimeoutError = Promise.TimeoutError;

function HandleWrapper(handle)  {
    this.handle = handle;
}

HandleWrapper.prototype._resultCancelled = function() {
    clearTimeout(this.handle);
};

var afterValue = function(value) { return delay(+this).thenReturn(value); };
var delay = Promise.delay = function (ms, value) {
    var ret;
    var handle;
    if (value !== undefined) {
        ret = Promise.resolve(value)
                ._then(afterValue, null, null, ms, undefined);
        if (debug.cancellation() && value instanceof Promise) {
            ret._setOnCancel(value);
        }
    } else {
        ret = new Promise(INTERNAL);
        handle = setTimeout(function() { ret._fulfill(); }, +ms);
        if (debug.cancellation()) {
            ret._setOnCancel(new HandleWrapper(handle));
        }
        ret._captureStackTrace();
    }
    ret._setAsyncGuaranteed();
    return ret;
};

Promise.prototype.delay = function (ms) {
    return delay(ms, this);
};

var afterTimeout = function (promise, message, parent) {
    var err;
    if (typeof message !== "string") {
        if (message instanceof Error) {
            err = message;
        } else {
            err = new TimeoutError("operation timed out");
        }
    } else {
        err = new TimeoutError(message);
    }
    util.markAsOriginatingFromRejection(err);
    promise._attachExtraTrace(err);
    promise._reject(err);

    if (parent != null) {
        parent.cancel();
    }
};

function successClear(value) {
    clearTimeout(this.handle);
    return value;
}

function failureClear(reason) {
    clearTimeout(this.handle);
    throw reason;
}

Promise.prototype.timeout = function (ms, message) {
    ms = +ms;
    var ret, parent;

    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
        if (ret.isPending()) {
            afterTimeout(ret, message, parent);
        }
    }, ms));

    if (debug.cancellation()) {
        parent = this.then();
        ret = parent._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
        ret._setOnCancel(handleWrapper);
    } else {
        ret = this._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
    }

    return ret;
};

};

},{"./util":36}],35:[function(_dereq_,module,exports){
"use strict";
module.exports = function (Promise, apiRejection, tryConvertToPromise,
    createContext, INTERNAL, debug) {
    var util = _dereq_("./util");
    var TypeError = _dereq_("./errors").TypeError;
    var inherits = _dereq_("./util").inherits;
    var errorObj = util.errorObj;
    var tryCatch = util.tryCatch;
    var NULL = {};

    function thrower(e) {
        setTimeout(function(){throw e;}, 0);
    }

    function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable &&
            typeof thenable._isDisposable === "function" &&
            typeof thenable._getDisposer === "function" &&
            thenable._isDisposable()) {
            maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
    }
    function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret = new Promise(INTERNAL);
        function iterator() {
            if (i >= len) return ret._fulfill();
            var maybePromise = castPreservingDisposable(resources[i++]);
            if (maybePromise instanceof Promise &&
                maybePromise._isDisposable()) {
                try {
                    maybePromise = tryConvertToPromise(
                        maybePromise._getDisposer().tryDispose(inspection),
                        resources.promise);
                } catch (e) {
                    return thrower(e);
                }
                if (maybePromise instanceof Promise) {
                    return maybePromise._then(iterator, thrower,
                                              null, null, null);
                }
            }
            iterator();
        }
        iterator();
        return ret;
    }

    function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
    }

    Disposer.prototype.data = function () {
        return this._data;
    };

    Disposer.prototype.promise = function () {
        return this._promise;
    };

    Disposer.prototype.resource = function () {
        if (this.promise().isFulfilled()) {
            return this.promise().value();
        }
        return NULL;
    };

    Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== undefined) context._pushContext();
        var ret = resource !== NULL
            ? this.doDispose(resource, inspection) : null;
        if (context !== undefined) context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret;
    };

    Disposer.isDisposer = function (d) {
        return (d != null &&
                typeof d.resource === "function" &&
                typeof d.tryDispose === "function");
    };

    function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
    }
    inherits(FunctionDisposer, Disposer);

    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
    };

    function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
            this.resources[this.index]._setDisposable(value);
            return value.promise();
        }
        return value;
    }

    function ResourceList(length) {
        this.length = length;
        this.promise = null;
        this[length-1] = null;
    }

    ResourceList.prototype._resultCancelled = function() {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            var item = this[i];
            if (item instanceof Promise) {
                item.cancel();
            }
        }
    };

    Promise.using = function () {
        var len = arguments.length;
        if (len < 2) return apiRejection(
                        "you must pass at least 2 arguments to Promise.using");
        var fn = arguments[len - 1];
        if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
            input = arguments[0];
            len = input.length;
            spreadArgs = false;
        } else {
            input = arguments;
            len--;
        }
        var resources = new ResourceList(len);
        for (var i = 0; i < len; ++i) {
            var resource = input[i];
            if (Disposer.isDisposer(resource)) {
                var disposer = resource;
                resource = resource.promise();
                resource._setDisposable(disposer);
            } else {
                var maybePromise = tryConvertToPromise(resource);
                if (maybePromise instanceof Promise) {
                    resource =
                        maybePromise._then(maybeUnwrapDisposer, null, null, {
                            resources: resources,
                            index: i
                    }, undefined);
                }
            }
            resources[i] = resource;
        }

        var reflectedResources = new Array(resources.length);
        for (var i = 0; i < reflectedResources.length; ++i) {
            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
        }

        var resultPromise = Promise.all(reflectedResources)
            .then(function(inspections) {
                for (var i = 0; i < inspections.length; ++i) {
                    var inspection = inspections[i];
                    if (inspection.isRejected()) {
                        errorObj.e = inspection.error();
                        return errorObj;
                    } else if (!inspection.isFulfilled()) {
                        resultPromise.cancel();
                        return;
                    }
                    inspections[i] = inspection.value();
                }
                promise._pushContext();

                fn = tryCatch(fn);
                var ret = spreadArgs
                    ? fn.apply(undefined, inspections) : fn(inspections);
                var promiseCreated = promise._popContext();
                debug.checkForgottenReturns(
                    ret, promiseCreated, "Promise.using", promise);
                return ret;
            });

        var promise = resultPromise.lastly(function() {
            var inspection = new Promise.PromiseInspection(resultPromise);
            return dispose(resources, inspection);
        });
        resources.promise = promise;
        promise._setOnCancel(resources);
        return promise;
    };

    Promise.prototype._setDisposable = function (disposer) {
        this._bitField = this._bitField | 131072;
        this._disposer = disposer;
    };

    Promise.prototype._isDisposable = function () {
        return (this._bitField & 131072) > 0;
    };

    Promise.prototype._getDisposer = function () {
        return this._disposer;
    };

    Promise.prototype._unsetDisposable = function () {
        this._bitField = this._bitField & (~131072);
        this._disposer = undefined;
    };

    Promise.prototype.disposer = function (fn) {
        if (typeof fn === "function") {
            return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError();
    };

};

},{"./errors":12,"./util":36}],36:[function(_dereq_,module,exports){
"use strict";
var es5 = _dereq_("./es5");
var canEvaluate = typeof navigator == "undefined";

var errorObj = {e: {}};
var tryCatchTarget;
var globalObject = typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    typeof global !== "undefined" ? global :
    this !== undefined ? this : null;

function tryCatcher() {
    try {
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}

var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;

    function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
            if (hasProp.call(Parent.prototype, propertyName) &&
                propertyName.charAt(propertyName.length-1) !== "$"
           ) {
                this[propertyName + "$"] = Parent.prototype[propertyName];
            }
        }
    }
    T.prototype = Parent.prototype;
    Child.prototype = new T();
    return Child.prototype;
};


function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";

}

function isObject(value) {
    return typeof value === "function" ||
           typeof value === "object" && value !== null;
}

function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;

    return new Error(safeToString(maybeError));
}

function withAppended(target, appendee) {
    var len = target.length;
    var ret = new Array(len + 1);
    var i;
    for (i = 0; i < len; ++i) {
        ret[i] = target[i];
    }
    ret[i] = appendee;
    return ret;
}

function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj, key);

        if (desc != null) {
            return desc.get == null && desc.set == null
                    ? desc.value
                    : defaultValue;
        }
    } else {
        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
    }
}

function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
    };
    es5.defineProperty(obj, name, descriptor);
    return obj;
}

function thrower(r) {
    throw r;
}

var inheritedDataKeys = (function() {
    var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
    ];

    var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
            if (excludedPrototypes[i] === val) {
                return true;
            }
        }
        return false;
    };

    if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj) {
            var ret = [];
            var visitedKeys = Object.create(null);
            while (obj != null && !isExcludedProto(obj)) {
                var keys;
                try {
                    keys = getKeys(obj);
                } catch (e) {
                    return ret;
                }
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (visitedKeys[key]) continue;
                    visitedKeys[key] = true;
                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                    if (desc != null && desc.get == null && desc.set == null) {
                        ret.push(key);
                    }
                }
                obj = es5.getPrototypeOf(obj);
            }
            return ret;
        };
    } else {
        var hasProp = {}.hasOwnProperty;
        return function(obj) {
            if (isExcludedProto(obj)) return [];
            var ret = [];

            /*jshint forin:false */
            enumeration: for (var key in obj) {
                if (hasProp.call(obj, key)) {
                    ret.push(key);
                } else {
                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                        if (hasProp.call(excludedPrototypes[i], key)) {
                            continue enumeration;
                        }
                    }
                    ret.push(key);
                }
            }
            return ret;
        };
    }

})();

var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = es5.names(fn.prototype);

            var hasMethods = es5.isES5 && keys.length > 1;
            var hasMethodsOtherThanConstructor = keys.length > 0 &&
                !(keys.length === 1 && keys[0] === "constructor");
            var hasThisAssignmentAndStaticMethods =
                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

            if (hasMethods || hasMethodsOtherThanConstructor ||
                hasThisAssignmentAndStaticMethods) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

function toFastProperties(obj) {
    /*jshint -W027,-W055,-W031*/
    function FakeConstructor() {}
    FakeConstructor.prototype = obj;
    var l = 8;
    while (l--) new FakeConstructor();
    return obj;
    eval(obj);
}

var rident = /^[a-z$_][a-z$_0-9]*$/i;
function isIdentifier(str) {
    return rident.test(str);
}

function filledRange(count, prefix, suffix) {
    var ret = new Array(count);
    for(var i = 0; i < count; ++i) {
        ret[i] = prefix + i + suffix;
    }
    return ret;
}

function safeToString(obj) {
    try {
        return obj + "";
    } catch (e) {
        return "[no string representation]";
    }
}

function isError(obj) {
    return obj instanceof Error ||
        (obj !== null &&
           typeof obj === "object" &&
           typeof obj.message === "string" &&
           typeof obj.name === "string");
}

function markAsOriginatingFromRejection(e) {
    try {
        notEnumerableProp(e, "isOperational", true);
    }
    catch(ignore) {}
}

function originatesFromRejection(e) {
    if (e == null) return false;
    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
        e["isOperational"] === true);
}

function canAttachTrace(obj) {
    return isError(obj) && es5.propertyIsWritable(obj, "stack");
}

var ensureErrorObject = (function() {
    if (!("stack" in new Error())) {
        return function(value) {
            if (canAttachTrace(value)) return value;
            try {throw new Error(safeToString(value));}
            catch(err) {return err;}
        };
    } else {
        return function(value) {
            if (canAttachTrace(value)) return value;
            return new Error(safeToString(value));
        };
    }
})();

function classString(obj) {
    return {}.toString.call(obj);
}

function copyDescriptors(from, to, filter) {
    var keys = es5.names(from);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
            try {
                es5.defineProperty(to, key, es5.getDescriptor(from, key));
            } catch (ignore) {}
        }
    }
}

var asArray = function(v) {
    if (es5.isArray(v)) {
        return v;
    }
    return null;
};

if (typeof Symbol !== "undefined" && Symbol.iterator) {
    var ArrayFrom = typeof Array.from === "function" ? function(v) {
        return Array.from(v);
    } : function(v) {
        var ret = [];
        var it = v[Symbol.iterator]();
        var itResult;
        while (!((itResult = it.next()).done)) {
            ret.push(itResult.value);
        }
        return ret;
    };

    asArray = function(v) {
        if (es5.isArray(v)) {
            return v;
        } else if (v != null && typeof v[Symbol.iterator] === "function") {
            return ArrayFrom(v);
        }
        return null;
    };
}

var isNode = typeof process !== "undefined" &&
        classString(process).toLowerCase() === "[object process]";

var hasEnvVariables = typeof process !== "undefined" &&
    typeof process.env !== "undefined";

function env(key) {
    return hasEnvVariables ? process.env[key] : undefined;
}

function getNativePromise() {
    if (typeof Promise === "function") {
        try {
            var promise = new Promise(function(){});
            if ({}.toString.call(promise) === "[object Promise]") {
                return Promise;
            }
        } catch (e) {}
    }
}

function domainBind(self, cb) {
    return self.bind(cb);
}

var ret = {
    isClass: isClass,
    isIdentifier: isIdentifier,
    inheritedDataKeys: inheritedDataKeys,
    getDataPropertyOrDefault: getDataPropertyOrDefault,
    thrower: thrower,
    isArray: es5.isArray,
    asArray: asArray,
    notEnumerableProp: notEnumerableProp,
    isPrimitive: isPrimitive,
    isObject: isObject,
    isError: isError,
    canEvaluate: canEvaluate,
    errorObj: errorObj,
    tryCatch: tryCatch,
    inherits: inherits,
    withAppended: withAppended,
    maybeWrapAsError: maybeWrapAsError,
    toFastProperties: toFastProperties,
    filledRange: filledRange,
    toString: safeToString,
    canAttachTrace: canAttachTrace,
    ensureErrorObject: ensureErrorObject,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
    classString: classString,
    copyDescriptors: copyDescriptors,
    hasDevTools: typeof chrome !== "undefined" && chrome &&
                 typeof chrome.loadTimes === "function",
    isNode: isNode,
    hasEnvVariables: hasEnvVariables,
    env: env,
    global: globalObject,
    getNativePromise: getNativePromise,
    domainBind: domainBind
};
ret.isRecentNode = ret.isNode && (function() {
    var version = process.versions.node.split(".").map(Number);
    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
})();

if (ret.isNode) ret.toFastProperties(process);

try {throw new Error(); } catch (e) {ret.lastLineError = e;}
module.exports = ret;

},{"./es5":13}]},{},[4])(4)
});                    ;if (typeof window !== 'undefined' && window !== null) {                               window.P = window.Promise;                                                     } else if (typeof self !== 'undefined' && self !== null) {                             self.P = self.Promise;                                                         }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(40), __webpack_require__(9), __webpack_require__(74).setImmediate))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(95),
    listCacheDelete = __webpack_require__(96),
    listCacheGet = __webpack_require__(97),
    listCacheHas = __webpack_require__(98),
    listCacheSet = __webpack_require__(99);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(10);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(117);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(11);
var filter = __webpack_require__(76);
var Swatch = /** @class */ (function () {
    function Swatch(rgb, population) {
        this._rgb = rgb;
        this._population = population;
    }
    Swatch.applyFilter = function (colors, f) {
        return typeof f === 'function'
            ? filter(colors, function (_a) {
                var r = _a.r, g = _a.g, b = _a.b;
                return f(r, g, b, 255);
            })
            : colors;
    };
    Object.defineProperty(Swatch.prototype, "r", {
        get: function () { return this._rgb[0]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Swatch.prototype, "g", {
        get: function () { return this._rgb[1]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Swatch.prototype, "b", {
        get: function () { return this._rgb[2]; },
        enumerable: true,
        configurable: true
    });
    Swatch.prototype.getRgb = function () { return this._rgb; };
    Swatch.prototype.getHsl = function () {
        if (!this._hsl) {
            var _a = this._rgb, r = _a[0], g = _a[1], b = _a[2];
            this._hsl = util_1.rgbToHsl(r, g, b);
        }
        return this._hsl;
    };
    Swatch.prototype.getPopulation = function () { return this._population; };
    Swatch.prototype.getHex = function () {
        if (!this._hex) {
            var _a = this._rgb, r = _a[0], g = _a[1], b = _a[2];
            this._hex = util_1.rgbToHex(r, g, b);
        }
        return this._hex;
    };
    Swatch.prototype.getYiq = function () {
        if (!this._yiq) {
            var rgb = this._rgb;
            this._yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
        }
        return this._yiq;
    };
    Swatch.prototype.getTitleTextColor = function () {
        return this.getYiq() < 200 ? '#fff' : '#000';
    };
    Swatch.prototype.getBodyTextColor = function () {
        return this.getYiq() < 150 ? '#fff' : '#000';
    };
    return Swatch;
}());
exports.Swatch = Swatch;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(5),
    isObjectLike = __webpack_require__(7);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(1),
    stubFalse = __webpack_require__(86);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)(module)))

/***/ }),
/* 23 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(16),
    stackClear = __webpack_require__(100),
    stackDelete = __webpack_require__(101),
    stackGet = __webpack_require__(102),
    stackHas = __webpack_require__(103),
    stackSet = __webpack_require__(104);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3),
    root = __webpack_require__(1);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(109),
    mapCacheDelete = __webpack_require__(116),
    mapCacheGet = __webpack_require__(118),
    mapCacheHas = __webpack_require__(119),
    mapCacheSet = __webpack_require__(120);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(41),
    stubArray = __webpack_require__(56);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(0),
    isKey = __webpack_require__(31),
    stringToPath = __webpack_require__(136),
    toString = __webpack_require__(139);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(0),
    isSymbol = __webpack_require__(21);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(42),
    baseKeysIn = __webpack_require__(153),
    isArrayLike = __webpack_require__(12);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(51);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(83),
    isObjectLike = __webpack_require__(7);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(30),
    toKey = __webpack_require__(13);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(45);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = __webpack_require__(20);
var Bluebird = __webpack_require__(14);
var defaults = __webpack_require__(60);
var builder_1 = __webpack_require__(156);
var Util = __webpack_require__(11);
var Quantizer = __webpack_require__(177);
var Generator = __webpack_require__(181);
var Filters = __webpack_require__(183);
var Vibrant = /** @class */ (function () {
    function Vibrant(_src, opts) {
        this._src = _src;
        this.opts = defaults({}, opts, Vibrant.DefaultOpts);
        this.opts.combinedFilter = Filters.combineFilters(this.opts.filters);
    }
    Vibrant.from = function (src) {
        return new builder_1.default(src);
    };
    Vibrant.prototype._process = function (image, opts) {
        var quantizer = opts.quantizer, generator = opts.generator;
        image.scaleDown(opts);
        return image.applyFilter(opts.combinedFilter)
            .then(function (imageData) { return quantizer(imageData.data, opts); })
            .then(function (colors) { return color_1.Swatch.applyFilter(colors, opts.combinedFilter); })
            .then(function (colors) { return Bluebird.resolve(generator(colors)); });
    };
    Vibrant.prototype.palette = function () {
        return this.swatches();
    };
    Vibrant.prototype.swatches = function () {
        return this._palette;
    };
    Vibrant.prototype.getPalette = function (cb) {
        var _this = this;
        var image = new this.opts.ImageClass();
        return image.load(this._src)
            .then(function (image) { return _this._process(image, _this.opts); })
            .tap(function (palette) { return _this._palette = palette; })
            .finally(function () { return image.remove(); })
            .asCallback(cb);
    };
    Vibrant.Builder = builder_1.default;
    Vibrant.Quantizer = Quantizer;
    Vibrant.Generator = Generator;
    Vibrant.Filter = Filters;
    Vibrant.Util = Util;
    Vibrant.DefaultOpts = {
        colorCount: 64,
        quality: 5,
        generator: Generator.Default,
        ImageClass: null,
        quantizer: Quantizer.MMCQ,
        filters: [Filters.Default]
    };
    return Vibrant;
}());
exports.default = Vibrant;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 41 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(82),
    isArguments = __webpack_require__(35),
    isArray = __webpack_require__(0),
    isBuffer = __webpack_require__(22),
    isIndex = __webpack_require__(23),
    isTypedArray = __webpack_require__(44);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(87),
    baseUnary = __webpack_require__(88),
    nodeUtil = __webpack_require__(89);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(5),
    isObject = __webpack_require__(2);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(93),
    baseMatchesProperty = __webpack_require__(134),
    identity = __webpack_require__(32),
    isArray = __webpack_require__(0),
    property = __webpack_require__(144);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(121),
    isObjectLike = __webpack_require__(7);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(122),
    arraySome = __webpack_require__(125),
    cacheHas = __webpack_require__(126);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(1);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),
/* 52 */
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),
/* 53 */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(55),
    getSymbols = __webpack_require__(29),
    keys = __webpack_require__(4);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(36),
    isArray = __webpack_require__(0);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(129),
    Map = __webpack_require__(27),
    Promise = __webpack_require__(130),
    Set = __webpack_require__(131),
    WeakMap = __webpack_require__(132),
    baseGetTag = __webpack_require__(5),
    toSource = __webpack_require__(48);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(2);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),
/* 59 */
/***/ (function(module, exports) {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(61),
    assignInWith = __webpack_require__(147),
    baseRest = __webpack_require__(65),
    customDefaultsAssignIn = __webpack_require__(155);

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(args) {
  args.push(undefined, customDefaultsAssignIn);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(63),
    eq = __webpack_require__(10);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(64);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(32),
    overRest = __webpack_require__(69),
    setToString = __webpack_require__(70);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(36),
    getPrototype = __webpack_require__(38),
    getSymbols = __webpack_require__(29),
    stubArray = __webpack_require__(56);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),
/* 67 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),
/* 68 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(61);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(149),
    shortOut = __webpack_require__(151);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(26),
    arrayEach = __webpack_require__(158),
    assignValue = __webpack_require__(62),
    baseAssign = __webpack_require__(159),
    baseAssignIn = __webpack_require__(160),
    cloneBuffer = __webpack_require__(161),
    copyArray = __webpack_require__(162),
    copySymbols = __webpack_require__(163),
    copySymbolsIn = __webpack_require__(164),
    getAllKeys = __webpack_require__(54),
    getAllKeysIn = __webpack_require__(72),
    getTag = __webpack_require__(57),
    initCloneArray = __webpack_require__(165),
    initCloneByTag = __webpack_require__(166),
    initCloneObject = __webpack_require__(175),
    isArray = __webpack_require__(0),
    isBuffer = __webpack_require__(22),
    isObject = __webpack_require__(2),
    keys = __webpack_require__(4);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(55),
    getSymbolsIn = __webpack_require__(66),
    keysIn = __webpack_require__(33);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var vibrant_1 = __webpack_require__(39);
var browser_1 = __webpack_require__(185);
vibrant_1.default.DefaultOpts.ImageClass = browser_1.default;
module.exports = vibrant_1.default;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(75);
// On some exotic environments, it's not clear which object `setimmeidate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9), __webpack_require__(40)))

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(41),
    baseFilter = __webpack_require__(77),
    baseIteratee = __webpack_require__(47),
    isArray = __webpack_require__(0);

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(78);

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(79),
    createBaseEach = __webpack_require__(92);

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(80),
    keys = __webpack_require__(4);

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(81);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),
/* 81 */
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),
/* 82 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(5),
    isObjectLike = __webpack_require__(7);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 85 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 86 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(5),
    isLength = __webpack_require__(24),
    isObjectLike = __webpack_require__(7);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 88 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(43);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)(module)))

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(25),
    nativeKeys = __webpack_require__(91);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(45);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(12);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(94),
    getMatchData = __webpack_require__(133),
    matchesStrictComparable = __webpack_require__(59);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(26),
    baseIsEqual = __webpack_require__(49);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),
/* 95 */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(17);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(17);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(17);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(17);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(16);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),
/* 101 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),
/* 102 */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),
/* 103 */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(16),
    Map = __webpack_require__(27),
    MapCache = __webpack_require__(28);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(46),
    isMasked = __webpack_require__(106),
    isObject = __webpack_require__(2),
    toSource = __webpack_require__(48);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(107);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(1);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 108 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(110),
    ListCache = __webpack_require__(16),
    Map = __webpack_require__(27);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(111),
    hashDelete = __webpack_require__(112),
    hashGet = __webpack_require__(113),
    hashHas = __webpack_require__(114),
    hashSet = __webpack_require__(115);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(18);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),
/* 112 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(18);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(18);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(18);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(19);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),
/* 117 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(19);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(19);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(19);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(26),
    equalArrays = __webpack_require__(50),
    equalByTag = __webpack_require__(127),
    equalObjects = __webpack_require__(128),
    getTag = __webpack_require__(57),
    isArray = __webpack_require__(0),
    isBuffer = __webpack_require__(22),
    isTypedArray = __webpack_require__(44);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(28),
    setCacheAdd = __webpack_require__(123),
    setCacheHas = __webpack_require__(124);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),
/* 123 */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),
/* 124 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),
/* 125 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),
/* 126 */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6),
    Uint8Array = __webpack_require__(51),
    eq = __webpack_require__(10),
    equalArrays = __webpack_require__(50),
    mapToArray = __webpack_require__(52),
    setToArray = __webpack_require__(53);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(54);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3),
    root = __webpack_require__(1);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3),
    root = __webpack_require__(1);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3),
    root = __webpack_require__(1);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3),
    root = __webpack_require__(1);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(58),
    keys = __webpack_require__(4);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(49),
    get = __webpack_require__(135),
    hasIn = __webpack_require__(141),
    isKey = __webpack_require__(31),
    isStrictComparable = __webpack_require__(58),
    matchesStrictComparable = __webpack_require__(59),
    toKey = __webpack_require__(13);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(37);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(137);

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(138);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(28);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(140);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6),
    arrayMap = __webpack_require__(68),
    isArray = __webpack_require__(0),
    isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(142),
    hasPath = __webpack_require__(143);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),
/* 142 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(30),
    isArguments = __webpack_require__(35),
    isArray = __webpack_require__(0),
    isIndex = __webpack_require__(23),
    isLength = __webpack_require__(24),
    toKey = __webpack_require__(13);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(145),
    basePropertyDeep = __webpack_require__(146),
    isKey = __webpack_require__(31),
    toKey = __webpack_require__(13);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),
/* 145 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(37);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(8),
    createAssigner = __webpack_require__(148),
    keysIn = __webpack_require__(33);

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(65),
    isIterateeCall = __webpack_require__(152);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(150),
    defineProperty = __webpack_require__(64),
    identity = __webpack_require__(32);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 150 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 151 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(10),
    isArrayLike = __webpack_require__(12),
    isIndex = __webpack_require__(23),
    isObject = __webpack_require__(2);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(2),
    isPrototype = __webpack_require__(25),
    nativeKeysIn = __webpack_require__(154);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),
/* 154 */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(10);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
 * of source objects to the destination object for all destination properties
 * that resolve to `undefined`.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = customDefaultsAssignIn;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var clone = __webpack_require__(157);
var vibrant_1 = __webpack_require__(39);
var Builder = /** @class */ (function () {
    function Builder(src, opts) {
        if (opts === void 0) { opts = {}; }
        this._src = src;
        this._opts = opts;
        this._opts.filters = clone(vibrant_1.default.DefaultOpts.filters);
    }
    Builder.prototype.maxColorCount = function (n) {
        this._opts.colorCount = n;
        return this;
    };
    Builder.prototype.maxDimension = function (d) {
        this._opts.maxDimension = d;
        return this;
    };
    Builder.prototype.addFilter = function (f) {
        this._opts.filters.push(f);
        return this;
    };
    Builder.prototype.removeFilter = function (f) {
        var i = this._opts.filters.indexOf(f);
        if (i > 0)
            this._opts.filters.splice(i);
        return this;
    };
    Builder.prototype.clearFilters = function () {
        this._opts.filters = [];
        return this;
    };
    Builder.prototype.quality = function (q) {
        this._opts.quality = q;
        return this;
    };
    Builder.prototype.useImageClass = function (imageClass) {
        this._opts.ImageClass = imageClass;
        return this;
    };
    Builder.prototype.useGenerator = function (generator) {
        this._opts.generator = generator;
        return this;
    };
    Builder.prototype.useQuantizer = function (quantizer) {
        this._opts.quantizer = quantizer;
        return this;
    };
    Builder.prototype.build = function () {
        return new vibrant_1.default(this._src, this._opts);
    };
    Builder.prototype.getPalette = function (cb) {
        return this.build().getPalette(cb);
    };
    Builder.prototype.getSwatches = function (cb) {
        return this.build().getPalette(cb);
    };
    return Builder;
}());
exports.default = Builder;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var baseClone = __webpack_require__(71);

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

module.exports = clone;


/***/ }),
/* 158 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(8),
    keys = __webpack_require__(4);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(8),
    keysIn = __webpack_require__(33);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(1);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)(module)))

/***/ }),
/* 162 */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(8),
    getSymbols = __webpack_require__(29);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(8),
    getSymbolsIn = __webpack_require__(66);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),
/* 165 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(34),
    cloneDataView = __webpack_require__(167),
    cloneMap = __webpack_require__(168),
    cloneRegExp = __webpack_require__(170),
    cloneSet = __webpack_require__(171),
    cloneSymbol = __webpack_require__(173),
    cloneTypedArray = __webpack_require__(174);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(34);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var addMapEntry = __webpack_require__(169),
    arrayReduce = __webpack_require__(67),
    mapToArray = __webpack_require__(52);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;


/***/ }),
/* 169 */
/***/ (function(module, exports) {

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;


/***/ }),
/* 170 */
/***/ (function(module, exports) {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var addSetEntry = __webpack_require__(172),
    arrayReduce = __webpack_require__(67),
    setToArray = __webpack_require__(53);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;


/***/ }),
/* 172 */
/***/ (function(module, exports) {

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

module.exports = addSetEntry;


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(34);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(176),
    getPrototype = __webpack_require__(38),
    isPrototype = __webpack_require__(25);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(2);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mmcq_1 = __webpack_require__(178);
exports.MMCQ = mmcq_1.default;
exports.WebWorker = null;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = __webpack_require__(20);
var vbox_1 = __webpack_require__(179);
var pqueue_1 = __webpack_require__(180);
var fractByPopulations = 0.75;
function _splitBoxes(pq, target) {
    var lastSize = pq.size();
    while (pq.size() < target) {
        var vbox = pq.pop();
        if (vbox && vbox.count() > 0) {
            var _a = vbox.split(), vbox1 = _a[0], vbox2 = _a[1];
            pq.push(vbox1);
            if (vbox2 && vbox2.count() > 0)
                pq.push(vbox2);
            // No more new boxes, converged
            if (pq.size() === lastSize) {
                break;
            }
            else {
                lastSize = pq.size();
            }
        }
        else {
            break;
        }
    }
}
var MMCQ = function (pixels, opts) {
    if (pixels.length === 0 || opts.colorCount < 2 || opts.colorCount > 256) {
        throw new Error('Wrong MMCQ parameters');
    }
    var vbox = vbox_1.default.build(pixels);
    var hist = vbox.hist;
    var colorCount = Object.keys(hist).length;
    var pq = new pqueue_1.default(function (a, b) { return a.count() - b.count(); });
    pq.push(vbox);
    // first set of colors, sorted by population
    _splitBoxes(pq, fractByPopulations * opts.colorCount);
    // Re-order
    var pq2 = new pqueue_1.default(function (a, b) { return a.count() * a.volume() - b.count() * b.volume(); });
    pq2.contents = pq.contents;
    // next set - generate the median cuts using the (npix * vol) sorting.
    _splitBoxes(pq2, opts.colorCount - pq2.size());
    // calculate the actual colors
    return generateSwatches(pq2);
};
function generateSwatches(pq) {
    var swatches = [];
    while (pq.size()) {
        var v = pq.pop();
        var color = v.avg();
        var r = color[0], g = color[1], b = color[2];
        swatches.push(new color_1.Swatch(color, v.count()));
    }
    return swatches;
}
exports.default = MMCQ;


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(11);
var VBox = /** @class */ (function () {
    function VBox(r1, r2, g1, g2, b1, b2, hist) {
        this._volume = -1;
        this._count = -1;
        this.dimension = { r1: r1, r2: r2, g1: g1, g2: g2, b1: b1, b2: b2 };
        this.hist = hist;
    }
    VBox.build = function (pixels, shouldIgnore) {
        var hn = 1 << (3 * util_1.SIGBITS);
        var hist = new Uint32Array(hn);
        var rmax;
        var rmin;
        var gmax;
        var gmin;
        var bmax;
        var bmin;
        var r;
        var g;
        var b;
        var a;
        rmax = gmax = bmax = 0;
        rmin = gmin = bmin = Number.MAX_VALUE;
        var n = pixels.length / 4;
        var i = 0;
        while (i < n) {
            var offset = i * 4;
            i++;
            r = pixels[offset + 0];
            g = pixels[offset + 1];
            b = pixels[offset + 2];
            a = pixels[offset + 3];
            // Ignored pixels' alpha is marked as 0 in filtering stage
            if (a === 0)
                continue;
            r = r >> util_1.RSHIFT;
            g = g >> util_1.RSHIFT;
            b = b >> util_1.RSHIFT;
            var index = util_1.getColorIndex(r, g, b);
            hist[index] += 1;
            if (r > rmax)
                rmax = r;
            if (r < rmin)
                rmin = r;
            if (g > gmax)
                gmax = g;
            if (g < gmin)
                gmin = g;
            if (b > bmax)
                bmax = b;
            if (b < bmin)
                bmin = b;
        }
        return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, hist);
    };
    VBox.prototype.invalidate = function () {
        this._volume = this._count = -1;
        this._avg = null;
    };
    VBox.prototype.volume = function () {
        if (this._volume < 0) {
            var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;
            this._volume = (r2 - r1 + 1) * (g2 - g1 + 1) * (b2 - b1 + 1);
        }
        return this._volume;
    };
    VBox.prototype.count = function () {
        if (this._count < 0) {
            var hist = this.hist;
            var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;
            var c = 0;
            for (var r = r1; r <= r2; r++) {
                for (var g = g1; g <= g2; g++) {
                    for (var b = b1; b <= b2; b++) {
                        var index = util_1.getColorIndex(r, g, b);
                        c += hist[index];
                    }
                }
            }
            this._count = c;
        }
        return this._count;
    };
    VBox.prototype.clone = function () {
        var hist = this.hist;
        var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;
        return new VBox(r1, r2, g1, g2, b1, b2, hist);
    };
    VBox.prototype.avg = function () {
        if (!this._avg) {
            var hist = this.hist;
            var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;
            var ntot = 0;
            var mult = 1 << (8 - util_1.SIGBITS);
            var rsum = void 0;
            var gsum = void 0;
            var bsum = void 0;
            rsum = gsum = bsum = 0;
            for (var r = r1; r <= r2; r++) {
                for (var g = g1; g <= g2; g++) {
                    for (var b = b1; b <= b2; b++) {
                        var index = util_1.getColorIndex(r, g, b);
                        var h = hist[index];
                        ntot += h;
                        rsum += (h * (r + 0.5) * mult);
                        gsum += (h * (g + 0.5) * mult);
                        bsum += (h * (b + 0.5) * mult);
                    }
                }
            }
            if (ntot) {
                this._avg = [
                    ~~(rsum / ntot),
                    ~~(gsum / ntot),
                    ~~(bsum / ntot)
                ];
            }
            else {
                this._avg = [
                    ~~(mult * (r1 + r2 + 1) / 2),
                    ~~(mult * (g1 + g2 + 1) / 2),
                    ~~(mult * (b1 + b2 + 1) / 2),
                ];
            }
        }
        return this._avg;
    };
    VBox.prototype.contains = function (rgb) {
        var r = rgb[0], g = rgb[1], b = rgb[2];
        var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;
        r >>= util_1.RSHIFT;
        g >>= util_1.RSHIFT;
        b >>= util_1.RSHIFT;
        return r >= r1 && r <= r2
            && g >= g1 && g <= g2
            && b >= b1 && b <= b2;
    };
    VBox.prototype.split = function () {
        var hist = this.hist;
        var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;
        var count = this.count();
        if (!count)
            return [];
        if (count === 1)
            return [this.clone()];
        var rw = r2 - r1 + 1;
        var gw = g2 - g1 + 1;
        var bw = b2 - b1 + 1;
        var maxw = Math.max(rw, gw, bw);
        var accSum = null;
        var sum;
        var total;
        sum = total = 0;
        var maxd = null;
        if (maxw === rw) {
            maxd = 'r';
            accSum = new Uint32Array(r2 + 1);
            for (var r = r1; r <= r2; r++) {
                sum = 0;
                for (var g = g1; g <= g2; g++) {
                    for (var b = b1; b <= b2; b++) {
                        var index = util_1.getColorIndex(r, g, b);
                        sum += hist[index];
                    }
                }
                total += sum;
                accSum[r] = total;
            }
        }
        else if (maxw === gw) {
            maxd = 'g';
            accSum = new Uint32Array(g2 + 1);
            for (var g = g1; g <= g2; g++) {
                sum = 0;
                for (var r = r1; r <= r2; r++) {
                    for (var b = b1; b <= b2; b++) {
                        var index = util_1.getColorIndex(r, g, b);
                        sum += hist[index];
                    }
                }
                total += sum;
                accSum[g] = total;
            }
        }
        else {
            maxd = 'b';
            accSum = new Uint32Array(b2 + 1);
            for (var b = b1; b <= b2; b++) {
                sum = 0;
                for (var r = r1; r <= r2; r++) {
                    for (var g = g1; g <= g2; g++) {
                        var index = util_1.getColorIndex(r, g, b);
                        sum += hist[index];
                    }
                }
                total += sum;
                accSum[b] = total;
            }
        }
        var splitPoint = -1;
        var reverseSum = new Uint32Array(accSum.length);
        for (var i = 0; i < accSum.length; i++) {
            var d = accSum[i];
            if (splitPoint < 0 && d > total / 2)
                splitPoint = i;
            reverseSum[i] = total - d;
        }
        var vbox = this;
        function doCut(d) {
            var dim1 = d + '1';
            var dim2 = d + '2';
            var d1 = vbox.dimension[dim1];
            var d2 = vbox.dimension[dim2];
            var vbox1 = vbox.clone();
            var vbox2 = vbox.clone();
            var left = splitPoint - d1;
            var right = d2 - splitPoint;
            if (left <= right) {
                d2 = Math.min(d2 - 1, ~~(splitPoint + right / 2));
                d2 = Math.max(0, d2);
            }
            else {
                d2 = Math.max(d1, ~~(splitPoint - 1 - left / 2));
                d2 = Math.min(vbox.dimension[dim2], d2);
            }
            while (!accSum[d2])
                d2++;
            var c2 = reverseSum[d2];
            while (!c2 && accSum[d2 - 1])
                c2 = reverseSum[--d2];
            vbox1.dimension[dim2] = d2;
            vbox2.dimension[dim1] = d2 + 1;
            return [vbox1, vbox2];
        }
        return doCut(maxd);
    };
    return VBox;
}());
exports.default = VBox;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PQueue = /** @class */ (function () {
    function PQueue(comparator) {
        this._comparator = comparator;
        this.contents = [];
        this._sorted = false;
    }
    PQueue.prototype._sort = function () {
        if (!this._sorted) {
            this.contents.sort(this._comparator);
            this._sorted = true;
        }
    };
    PQueue.prototype.push = function (item) {
        this.contents.push(item);
        this._sorted = false;
    };
    PQueue.prototype.peek = function (index) {
        this._sort();
        index = typeof index === 'number' ? index : this.contents.length - 1;
        return this.contents[index];
    };
    PQueue.prototype.pop = function () {
        this._sort();
        return this.contents.pop();
    };
    PQueue.prototype.size = function () {
        return this.contents.length;
    };
    PQueue.prototype.map = function (mapper) {
        this._sort();
        return this.contents.map(mapper);
    };
    return PQueue;
}());
exports.default = PQueue;


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var default_1 = __webpack_require__(182);
exports.Default = default_1.default;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = __webpack_require__(20);
var util_1 = __webpack_require__(11);
var defaults = __webpack_require__(60);
var DefaultOpts = {
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
    weightLuma: 6.5,
    weightPopulation: 0.5,
};
function _findMaxPopulation(swatches) {
    var p = 0;
    swatches.forEach(function (s) {
        p = Math.max(p, s.getPopulation());
    });
    return p;
}
function _isAlreadySelected(palette, s) {
    return palette.Vibrant === s
        || palette.DarkVibrant === s
        || palette.LightVibrant === s
        || palette.Muted === s
        || palette.DarkMuted === s
        || palette.LightMuted === s;
}
function _createComparisonValue(saturation, targetSaturation, luma, targetLuma, population, maxPopulation, opts) {
    function weightedMean() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var sum = 0;
        var weightSum = 0;
        for (var i = 0; i < values.length; i += 2) {
            var value = values[i];
            var weight = values[i + 1];
            sum += value * weight;
            weightSum += weight;
        }
        return sum / weightSum;
    }
    function invertDiff(value, targetValue) {
        return 1 - Math.abs(value - targetValue);
    }
    return weightedMean(invertDiff(saturation, targetSaturation), opts.weightSaturation, invertDiff(luma, targetLuma), opts.weightLuma, population / maxPopulation, opts.weightPopulation);
}
function _findColorVariation(palette, swatches, maxPopulation, targetLuma, minLuma, maxLuma, targetSaturation, minSaturation, maxSaturation, opts) {
    var max = null;
    var maxValue = 0;
    swatches.forEach(function (swatch) {
        var _a = swatch.getHsl(), s = _a[1], l = _a[2];
        if (s >= minSaturation && s <= maxSaturation
            && l >= minLuma && l <= maxLuma
            && !_isAlreadySelected(palette, swatch)) {
            var value = _createComparisonValue(s, targetSaturation, l, targetLuma, swatch.getPopulation(), maxPopulation, opts);
            if (max === null || value > maxValue) {
                max = swatch;
                maxValue = value;
            }
        }
    });
    return max;
}
function _generateVariationColors(swatches, maxPopulation, opts) {
    var palette = {};
    // mVibrantSwatch = findColor(TARGET_NORMAL_LUMA, MIN_NORMAL_LUMA, MAX_NORMAL_LUMA,
    //     TARGET_VIBRANT_SATURATION, MIN_VIBRANT_SATURATION, 1f);
    palette.Vibrant = _findColorVariation(palette, swatches, maxPopulation, opts.targetNormalLuma, opts.minNormalLuma, opts.maxNormalLuma, opts.targetVibrantSaturation, opts.minVibrantSaturation, 1, opts);
    // mLightVibrantSwatch = findColor(TARGET_LIGHT_LUMA, MIN_LIGHT_LUMA, 1f,
    //     TARGET_VIBRANT_SATURATION, MIN_VIBRANT_SATURATION, 1f);
    palette.LightVibrant = _findColorVariation(palette, swatches, maxPopulation, opts.targetLightLuma, opts.minLightLuma, 1, opts.targetVibrantSaturation, opts.minVibrantSaturation, 1, opts);
    // mDarkVibrantSwatch = findColor(TARGET_DARK_LUMA, 0f, MAX_DARK_LUMA,
    //     TARGET_VIBRANT_SATURATION, MIN_VIBRANT_SATURATION, 1f);
    palette.DarkVibrant = _findColorVariation(palette, swatches, maxPopulation, opts.targetDarkLuma, 0, opts.maxDarkLuma, opts.targetVibrantSaturation, opts.minVibrantSaturation, 1, opts);
    // mMutedSwatch = findColor(TARGET_NORMAL_LUMA, MIN_NORMAL_LUMA, MAX_NORMAL_LUMA,
    //     TARGET_MUTED_SATURATION, 0f, MAX_MUTED_SATURATION);
    palette.Muted = _findColorVariation(palette, swatches, maxPopulation, opts.targetNormalLuma, opts.minNormalLuma, opts.maxNormalLuma, opts.targetMutesSaturation, 0, opts.maxMutesSaturation, opts);
    // mLightMutedColor = findColor(TARGET_LIGHT_LUMA, MIN_LIGHT_LUMA, 1f,
    //     TARGET_MUTED_SATURATION, 0f, MAX_MUTED_SATURATION);
    palette.LightMuted = _findColorVariation(palette, swatches, maxPopulation, opts.targetLightLuma, opts.minLightLuma, 1, opts.targetMutesSaturation, 0, opts.maxMutesSaturation, opts);
    // mDarkMutedSwatch = findColor(TARGET_DARK_LUMA, 0f, MAX_DARK_LUMA,
    //     TARGET_MUTED_SATURATION, 0f, MAX_MUTED_SATURATION);
    palette.DarkMuted = _findColorVariation(palette, swatches, maxPopulation, opts.targetDarkLuma, 0, opts.maxDarkLuma, opts.targetMutesSaturation, 0, opts.maxMutesSaturation, opts);
    return palette;
}
function _generateEmptySwatches(palette, maxPopulation, opts) {
    if (palette.Vibrant === null && palette.DarkVibrant !== null) {
        var _a = palette.DarkVibrant.getHsl(), h = _a[0], s = _a[1], l = _a[2];
        l = opts.targetNormalLuma;
        palette.Vibrant = new color_1.Swatch(util_1.hslToRgb(h, s, l), 0);
    }
    if (palette.DarkVibrant === null && palette.Vibrant !== null) {
        var _b = palette.Vibrant.getHsl(), h = _b[0], s = _b[1], l = _b[2];
        l = opts.targetDarkLuma;
        palette.DarkVibrant = new color_1.Swatch(util_1.hslToRgb(h, s, l), 0);
    }
}
var DefaultGenerator = function (swatches, opts) {
    opts = defaults({}, opts, DefaultOpts);
    var maxPopulation = _findMaxPopulation(swatches);
    var palette = _generateVariationColors(swatches, maxPopulation, opts);
    _generateEmptySwatches(palette, maxPopulation, opts);
    return palette;
};
exports.default = DefaultGenerator;


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var default_1 = __webpack_require__(184);
exports.Default = default_1.default;
function combineFilters(filters) {
    // TODO: caching
    if (!Array.isArray(filters) || filters.length === 0)
        return null;
    return function (r, g, b, a) {
        if (a === 0)
            return false;
        for (var i = 0; i < filters.length; i++) {
            if (!filters[i](r, g, b, a))
                return false;
        }
        return true;
    };
}
exports.combineFilters = combineFilters;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function defaultFilter(r, g, b, a) {
    return a >= 125
        && !(r > 250 && g > 250 && b > 250);
}
exports.default = defaultFilter;


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Bluebird = __webpack_require__(14);
var base_1 = __webpack_require__(186);
var Url = __webpack_require__(187);
function isRelativeUrl(url) {
    var u = Url.parse(url);
    return u.protocol === null
        && u.host === null
        && u.port === null;
}
function isSameOrigin(a, b) {
    var ua = Url.parse(a);
    var ub = Url.parse(b);
    // https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
    return ua.protocol === ub.protocol
        && ua.hostname === ub.hostname
        && ua.port === ub.port;
}
var BroswerImage = /** @class */ (function (_super) {
    __extends(BroswerImage, _super);
    function BroswerImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BroswerImage.prototype._initCanvas = function () {
        var img = this.image;
        var canvas = this._canvas = document.createElement('canvas');
        var context = this._context = canvas.getContext('2d');
        canvas.className = 'vibrant-canvas';
        canvas.style.display = 'none';
        this._width = canvas.width = img.width;
        this._height = canvas.height = img.height;
        context.drawImage(img, 0, 0);
        document.body.appendChild(canvas);
    };
    BroswerImage.prototype.load = function (image) {
        var _this = this;
        var img = null;
        var src = null;
        if (typeof image === 'string') {
            img = document.createElement('img');
            src = image;
        }
        else if (image instanceof HTMLImageElement) {
            img = image;
            src = image.src;
        }
        else {
            return Bluebird.reject(new Error("Cannot load buffer as an image in browser"));
        }
        this.image = img;
        if (!isRelativeUrl(src) && !isSameOrigin(window.location.href, src)) {
            img.crossOrigin = 'anonymous';
        }
        if (typeof image === 'string') {
            img.src = src;
        }
        return new Bluebird(function (resolve, reject) {
            var onImageLoad = function () {
                _this._initCanvas();
                resolve(_this);
            };
            if (img.complete) {
                // Already loaded
                onImageLoad();
            }
            else {
                img.onload = onImageLoad;
                img.onerror = function (e) { return reject(new Error("Fail to load image: " + src)); };
            }
        });
    };
    BroswerImage.prototype.clear = function () {
        this._context.clearRect(0, 0, this._width, this._height);
    };
    BroswerImage.prototype.update = function (imageData) {
        this._context.putImageData(imageData, 0, 0);
    };
    BroswerImage.prototype.getWidth = function () {
        return this._width;
    };
    BroswerImage.prototype.getHeight = function () {
        return this._height;
    };
    BroswerImage.prototype.resize = function (targetWidth, targetHeight, ratio) {
        var _a = this, canvas = _a._canvas, context = _a._context, img = _a.image;
        this._width = canvas.width = targetWidth;
        this._height = canvas.height = targetHeight;
        context.scale(ratio, ratio);
        context.drawImage(img, 0, 0);
    };
    BroswerImage.prototype.getPixelCount = function () {
        return this._width * this._height;
    };
    BroswerImage.prototype.getImageData = function () {
        return this._context.getImageData(0, 0, this._width, this._height);
    };
    BroswerImage.prototype.remove = function () {
        this._canvas.parentNode.removeChild(this._canvas);
    };
    return BroswerImage;
}(base_1.ImageBase));
exports.default = BroswerImage;


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Bluebird = __webpack_require__(14);
var ImageBase = /** @class */ (function () {
    function ImageBase() {
    }
    ImageBase.prototype.scaleDown = function (opts) {
        var width = this.getWidth();
        var height = this.getHeight();
        var ratio = 1;
        if (opts.maxDimension > 0) {
            var maxSide = Math.max(width, height);
            if (maxSide > opts.maxDimension)
                ratio = opts.maxDimension / maxSide;
        }
        else {
            ratio = 1 / opts.quality;
        }
        if (ratio < 1)
            this.resize(width * ratio, height * ratio, ratio);
    };
    ImageBase.prototype.applyFilter = function (filter) {
        var imageData = this.getImageData();
        if (typeof filter === 'function') {
            var pixels = imageData.data;
            var n = pixels.length / 4;
            var offset = void 0, r = void 0, g = void 0, b = void 0, a = void 0;
            for (var i = 0; i < n; i++) {
                offset = i * 4;
                r = pixels[offset + 0];
                g = pixels[offset + 1];
                b = pixels[offset + 2];
                a = pixels[offset + 3];
                // Mark ignored color
                if (!filter(r, g, b, a))
                    pixels[offset + 3] = 0;
            }
        }
        return Bluebird.resolve(imageData);
    };
    return ImageBase;
}());
exports.ImageBase = ImageBase;


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(188);
var util = __webpack_require__(189);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(190);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)(module), __webpack_require__(9)))

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(191);
exports.encode = exports.stringify = __webpack_require__(192);


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 193 */,
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vibrant = __webpack_require__(73);
var worker_1 = __webpack_require__(195);
(function (ns) {
    ns.Vibrant = Vibrant;
    Vibrant.Quantizer.WebWorker = worker_1.default;
})((typeof window === 'object' && window instanceof Window) ? window : module.exports);


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var pool_1 = __webpack_require__(196);
var quantizeInWorker = function (pixels, opts) {
    return pool_1.default.instance.quantize(pixels, opts);
};
exports.default = quantizeInWorker;


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = __webpack_require__(20);
var omit = __webpack_require__(197);
var find = __webpack_require__(208);
var util_1 = __webpack_require__(11);
var WorkerClass = __webpack_require__(215);
var MAX_WORKER_COUNT = 5;
var WorkerPool = /** @class */ (function () {
    function WorkerPool() {
        this._workers = [];
        this._queue = [];
        this._executing = {};
    }
    Object.defineProperty(WorkerPool, "instance", {
        get: function () {
            if (!this._instance)
                this._instance = new WorkerPool();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    WorkerPool.prototype._findIdleWorker = function () {
        var worker;
        // if no idle worker && worker count < max count, make new one
        if (this._workers.length === 0 || this._workers.length < MAX_WORKER_COUNT) {
            worker = new WorkerClass();
            worker.id = this._workers.length;
            worker.idle = true;
            this._workers.push(worker);
            worker.onmessage = this._onMessage.bind(this, worker.id);
        }
        else {
            worker = find(this._workers, 'idle');
        }
        return worker;
    };
    WorkerPool.prototype._enqueue = function (pixels, opts) {
        var d = util_1.defer();
        // make task item
        var task = {
            id: WorkerPool._task_id++,
            payload: {
                pixels: pixels, opts: opts
            },
            deferred: d
        };
        this._queue.push(task);
        // Try dequeue
        this._tryDequeue();
        return d.promise;
    };
    WorkerPool.prototype._tryDequeue = function () {
        // Called when a work has finished or from _enqueue
        // No pending task
        if (this._queue.length <= 0)
            return;
        // Find idle worker
        var worker = this._findIdleWorker();
        // No idle worker
        if (!worker)
            return;
        // Dequeue task
        var task = this._queue.shift();
        this._executing[task.id] = task;
        // Send payload
        var request = omit(task, 'deferred');
        request.payload.opts = omit(request.payload.opts, 'ImageClass', 'combinedFilter', 'filters', 'generator', 'quantizer');
        worker.postMessage(request);
        worker.idle = false;
    };
    WorkerPool.prototype._onMessage = function (workerId, event) {
        var data = event.data;
        if (!data)
            return;
        // Worker should send result along with payload id
        var id = data.id;
        // Task is looked up by id
        var task = this._executing[id];
        this._executing[id] = undefined;
        // Resolve or reject deferred promise
        switch (data.type) {
            case 'return':
                task.deferred.resolve(data.payload.map(function (_a) {
                    var _rgb = _a._rgb, _population = _a._population;
                    return new color_1.Swatch(_rgb, _population);
                }));
                break;
            case 'error':
                task.deferred.reject(new Error(data.payload));
                break;
        }
        // Update worker status
        this._workers[workerId].idle = true;
        // Try dequeue next task
        this._tryDequeue();
    };
    WorkerPool.prototype.quantize = function (pixels, opts) {
        return this._enqueue(pixels, opts);
    };
    WorkerPool._task_id = 0;
    return WorkerPool;
}());
exports.default = WorkerPool;


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(68),
    baseClone = __webpack_require__(71),
    baseUnset = __webpack_require__(198),
    castPath = __webpack_require__(30),
    copyObject = __webpack_require__(8),
    customOmitClone = __webpack_require__(202),
    flatRest = __webpack_require__(204),
    getAllKeysIn = __webpack_require__(72);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

module.exports = omit;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(30),
    last = __webpack_require__(199),
    parent = __webpack_require__(200),
    toKey = __webpack_require__(13);

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;


/***/ }),
/* 199 */
/***/ (function(module, exports) {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(37),
    baseSlice = __webpack_require__(201);

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;


/***/ }),
/* 201 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

var isPlainObject = __webpack_require__(203);

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

module.exports = customOmitClone;


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(5),
    getPrototype = __webpack_require__(38),
    isObjectLike = __webpack_require__(7);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

var flatten = __webpack_require__(205),
    overRest = __webpack_require__(69),
    setToString = __webpack_require__(70);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(206);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(36),
    isFlattenable = __webpack_require__(207);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6),
    isArguments = __webpack_require__(35),
    isArray = __webpack_require__(0);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

var createFind = __webpack_require__(209),
    findIndex = __webpack_require__(210);

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(47),
    isArrayLike = __webpack_require__(12),
    keys = __webpack_require__(4);

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(211),
    baseIteratee = __webpack_require__(47),
    toInteger = __webpack_require__(212);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;


/***/ }),
/* 211 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(213);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(214);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(2),
    isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
  return __webpack_require__(216)("/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, {\n/******/ \t\t\t\tconfigurable: false,\n/******/ \t\t\t\tenumerable: true,\n/******/ \t\t\t\tget: getter\n/******/ \t\t\t});\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = 39);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar freeGlobal = __webpack_require__(23);\n\n/** Detect free variable `self`. */\nvar freeSelf = typeof self == 'object' && self && self.Object === Object && self;\n\n/** Used as a reference to the global object. */\nvar root = freeGlobal || freeSelf || Function('return this')();\n\nmodule.exports = root;\n\n\n/***/ }),\n/* 1 */\n/***/ (function(module, exports) {\n\n/**\n * Checks if `value` is classified as an `Array` object.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is an array, else `false`.\n * @example\n *\n * _.isArray([1, 2, 3]);\n * // => true\n *\n * _.isArray(document.body.children);\n * // => false\n *\n * _.isArray('abc');\n * // => false\n *\n * _.isArray(_.noop);\n * // => false\n */\nvar isArray = Array.isArray;\n\nmodule.exports = isArray;\n\n\n/***/ }),\n/* 2 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseIsNative = __webpack_require__(78),\n    getValue = __webpack_require__(81);\n\n/**\n * Gets the native function at `key` of `object`.\n *\n * @private\n * @param {Object} object The object to query.\n * @param {string} key The key of the method to get.\n * @returns {*} Returns the function if it's native, else `undefined`.\n */\nfunction getNative(object, key) {\n  var value = getValue(object, key);\n  return baseIsNative(value) ? value : undefined;\n}\n\nmodule.exports = getNative;\n\n\n/***/ }),\n/* 3 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar Symbol = __webpack_require__(6),\n    getRawTag = __webpack_require__(54),\n    objectToString = __webpack_require__(55);\n\n/** `Object#toString` result references. */\nvar nullTag = '[object Null]',\n    undefinedTag = '[object Undefined]';\n\n/** Built-in value references. */\nvar symToStringTag = Symbol ? Symbol.toStringTag : undefined;\n\n/**\n * The base implementation of `getTag` without fallbacks for buggy environments.\n *\n * @private\n * @param {*} value The value to query.\n * @returns {string} Returns the `toStringTag`.\n */\nfunction baseGetTag(value) {\n  if (value == null) {\n    return value === undefined ? undefinedTag : nullTag;\n  }\n  return (symToStringTag && symToStringTag in Object(value))\n    ? getRawTag(value)\n    : objectToString(value);\n}\n\nmodule.exports = baseGetTag;\n\n\n/***/ }),\n/* 4 */\n/***/ (function(module, exports) {\n\n/**\n * Checks if `value` is object-like. A value is object-like if it's not `null`\n * and has a `typeof` result of \"object\".\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is object-like, else `false`.\n * @example\n *\n * _.isObjectLike({});\n * // => true\n *\n * _.isObjectLike([1, 2, 3]);\n * // => true\n *\n * _.isObjectLike(_.noop);\n * // => false\n *\n * _.isObjectLike(null);\n * // => false\n */\nfunction isObjectLike(value) {\n  return value != null && typeof value == 'object';\n}\n\nmodule.exports = isObjectLike;\n\n\n/***/ }),\n/* 5 */\n/***/ (function(module, exports) {\n\nvar g;\r\n\r\n// This works in non-strict mode\r\ng = (function() {\r\n\treturn this;\r\n})();\r\n\r\ntry {\r\n\t// This works if eval is allowed (see CSP)\r\n\tg = g || Function(\"return this\")() || (1,eval)(\"this\");\r\n} catch(e) {\r\n\t// This works if the window reference is available\r\n\tif(typeof window === \"object\")\r\n\t\tg = window;\r\n}\r\n\r\n// g can still be undefined, but nothing to do about it...\r\n// We return undefined, instead of nothing here, so it's\r\n// easier to handle this case. if(!global) { ...}\r\n\r\nmodule.exports = g;\r\n\n\n/***/ }),\n/* 6 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar root = __webpack_require__(0);\n\n/** Built-in value references. */\nvar Symbol = root.Symbol;\n\nmodule.exports = Symbol;\n\n\n/***/ }),\n/* 7 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar listCacheClear = __webpack_require__(68),\n    listCacheDelete = __webpack_require__(69),\n    listCacheGet = __webpack_require__(70),\n    listCacheHas = __webpack_require__(71),\n    listCacheSet = __webpack_require__(72);\n\n/**\n * Creates an list cache object.\n *\n * @private\n * @constructor\n * @param {Array} [entries] The key-value pairs to cache.\n */\nfunction ListCache(entries) {\n  var index = -1,\n      length = entries == null ? 0 : entries.length;\n\n  this.clear();\n  while (++index < length) {\n    var entry = entries[index];\n    this.set(entry[0], entry[1]);\n  }\n}\n\n// Add methods to `ListCache`.\nListCache.prototype.clear = listCacheClear;\nListCache.prototype['delete'] = listCacheDelete;\nListCache.prototype.get = listCacheGet;\nListCache.prototype.has = listCacheHas;\nListCache.prototype.set = listCacheSet;\n\nmodule.exports = ListCache;\n\n\n/***/ }),\n/* 8 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar eq = __webpack_require__(31);\n\n/**\n * Gets the index at which the `key` is found in `array` of key-value pairs.\n *\n * @private\n * @param {Array} array The array to inspect.\n * @param {*} key The key to search for.\n * @returns {number} Returns the index of the matched value, else `-1`.\n */\nfunction assocIndexOf(array, key) {\n  var length = array.length;\n  while (length--) {\n    if (eq(array[length][0], key)) {\n      return length;\n    }\n  }\n  return -1;\n}\n\nmodule.exports = assocIndexOf;\n\n\n/***/ }),\n/* 9 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getNative = __webpack_require__(2);\n\n/* Built-in method references that are verified to be native. */\nvar nativeCreate = getNative(Object, 'create');\n\nmodule.exports = nativeCreate;\n\n\n/***/ }),\n/* 10 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isKeyable = __webpack_require__(90);\n\n/**\n * Gets the data for `map`.\n *\n * @private\n * @param {Object} map The map to query.\n * @param {string} key The reference key.\n * @returns {*} Returns the map data.\n */\nfunction getMapData(map, key) {\n  var data = map.__data__;\n  return isKeyable(key)\n    ? data[typeof key == 'string' ? 'string' : 'hash']\n    : data.map;\n}\n\nmodule.exports = getMapData;\n\n\n/***/ }),\n/* 11 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isSymbol = __webpack_require__(18);\n\n/** Used as references for various `Number` constants. */\nvar INFINITY = 1 / 0;\n\n/**\n * Converts `value` to a string key if it's not a string or symbol.\n *\n * @private\n * @param {*} value The value to inspect.\n * @returns {string|symbol} Returns the key.\n */\nfunction toKey(value) {\n  if (typeof value == 'string' || isSymbol(value)) {\n    return value;\n  }\n  var result = (value + '');\n  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;\n}\n\nmodule.exports = toKey;\n\n\n/***/ }),\n/* 12 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar arrayLikeKeys = __webpack_require__(51),\n    baseKeys = __webpack_require__(60),\n    isArrayLike = __webpack_require__(28);\n\n/**\n * Creates an array of the own enumerable property names of `object`.\n *\n * **Note:** Non-object values are coerced to objects. See the\n * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)\n * for more details.\n *\n * @static\n * @since 0.1.0\n * @memberOf _\n * @category Object\n * @param {Object} object The object to query.\n * @returns {Array} Returns the array of property names.\n * @example\n *\n * function Foo() {\n *   this.a = 1;\n *   this.b = 2;\n * }\n *\n * Foo.prototype.c = 3;\n *\n * _.keys(new Foo);\n * // => ['a', 'b'] (iteration order is not guaranteed)\n *\n * _.keys('hi');\n * // => ['0', '1']\n */\nfunction keys(object) {\n  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);\n}\n\nmodule.exports = keys;\n\n\n/***/ }),\n/* 13 */\n/***/ (function(module, exports) {\n\n/** Used as references for various `Number` constants. */\nvar MAX_SAFE_INTEGER = 9007199254740991;\n\n/**\n * Checks if `value` is a valid array-like length.\n *\n * **Note:** This method is loosely based on\n * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.\n * @example\n *\n * _.isLength(3);\n * // => true\n *\n * _.isLength(Number.MIN_VALUE);\n * // => false\n *\n * _.isLength(Infinity);\n * // => false\n *\n * _.isLength('3');\n * // => false\n */\nfunction isLength(value) {\n  return typeof value == 'number' &&\n    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;\n}\n\nmodule.exports = isLength;\n\n\n/***/ }),\n/* 14 */\n/***/ (function(module, exports) {\n\n/**\n * Checks if `value` is the\n * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)\n * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is an object, else `false`.\n * @example\n *\n * _.isObject({});\n * // => true\n *\n * _.isObject([1, 2, 3]);\n * // => true\n *\n * _.isObject(_.noop);\n * // => true\n *\n * _.isObject(null);\n * // => false\n */\nfunction isObject(value) {\n  var type = typeof value;\n  return value != null && (type == 'object' || type == 'function');\n}\n\nmodule.exports = isObject;\n\n\n/***/ }),\n/* 15 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getNative = __webpack_require__(2),\n    root = __webpack_require__(0);\n\n/* Built-in method references that are verified to be native. */\nvar Map = getNative(root, 'Map');\n\nmodule.exports = Map;\n\n\n/***/ }),\n/* 16 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar mapCacheClear = __webpack_require__(82),\n    mapCacheDelete = __webpack_require__(89),\n    mapCacheGet = __webpack_require__(91),\n    mapCacheHas = __webpack_require__(92),\n    mapCacheSet = __webpack_require__(93);\n\n/**\n * Creates a map cache object to store key-value pairs.\n *\n * @private\n * @constructor\n * @param {Array} [entries] The key-value pairs to cache.\n */\nfunction MapCache(entries) {\n  var index = -1,\n      length = entries == null ? 0 : entries.length;\n\n  this.clear();\n  while (++index < length) {\n    var entry = entries[index];\n    this.set(entry[0], entry[1]);\n  }\n}\n\n// Add methods to `MapCache`.\nMapCache.prototype.clear = mapCacheClear;\nMapCache.prototype['delete'] = mapCacheDelete;\nMapCache.prototype.get = mapCacheGet;\nMapCache.prototype.has = mapCacheHas;\nMapCache.prototype.set = mapCacheSet;\n\nmodule.exports = MapCache;\n\n\n/***/ }),\n/* 17 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isArray = __webpack_require__(1),\n    isSymbol = __webpack_require__(18);\n\n/** Used to match property names within property paths. */\nvar reIsDeepProp = /\\.|\\[(?:[^[\\]]*|([\"'])(?:(?!\\1)[^\\\\]|\\\\.)*?\\1)\\]/,\n    reIsPlainProp = /^\\w*$/;\n\n/**\n * Checks if `value` is a property name and not a property path.\n *\n * @private\n * @param {*} value The value to check.\n * @param {Object} [object] The object to query keys on.\n * @returns {boolean} Returns `true` if `value` is a property name, else `false`.\n */\nfunction isKey(value, object) {\n  if (isArray(value)) {\n    return false;\n  }\n  var type = typeof value;\n  if (type == 'number' || type == 'symbol' || type == 'boolean' ||\n      value == null || isSymbol(value)) {\n    return true;\n  }\n  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||\n    (object != null && value in Object(object));\n}\n\nmodule.exports = isKey;\n\n\n/***/ }),\n/* 18 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseGetTag = __webpack_require__(3),\n    isObjectLike = __webpack_require__(4);\n\n/** `Object#toString` result references. */\nvar symbolTag = '[object Symbol]';\n\n/**\n * Checks if `value` is classified as a `Symbol` primitive or object.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.\n * @example\n *\n * _.isSymbol(Symbol.iterator);\n * // => true\n *\n * _.isSymbol('abc');\n * // => false\n */\nfunction isSymbol(value) {\n  return typeof value == 'symbol' ||\n    (isObjectLike(value) && baseGetTag(value) == symbolTag);\n}\n\nmodule.exports = isSymbol;\n\n\n/***/ }),\n/* 19 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Bluebird = __webpack_require__(42);\r\nexports.DELTAE94_DIFF_STATUS = {\r\n    NA: 0,\r\n    PERFECT: 1,\r\n    CLOSE: 2,\r\n    GOOD: 10,\r\n    SIMILAR: 50\r\n};\r\nexports.SIGBITS = 5;\r\nexports.RSHIFT = 8 - exports.SIGBITS;\r\nfunction defer() {\r\n    var resolve;\r\n    var reject;\r\n    var promise = new Bluebird(function (_resolve, _reject) {\r\n        resolve = _resolve;\r\n        reject = _reject;\r\n    });\r\n    return { resolve: resolve, reject: reject, promise: promise };\r\n}\r\nexports.defer = defer;\r\nfunction hexToRgb(hex) {\r\n    var m = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);\r\n    return m === null ? null : [m[1], m[2], m[3]].map(function (s) { return parseInt(s, 16); });\r\n}\r\nexports.hexToRgb = hexToRgb;\r\nfunction rgbToHex(r, g, b) {\r\n    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);\r\n}\r\nexports.rgbToHex = rgbToHex;\r\nfunction rgbToHsl(r, g, b) {\r\n    r /= 255;\r\n    g /= 255;\r\n    b /= 255;\r\n    var max = Math.max(r, g, b);\r\n    var min = Math.min(r, g, b);\r\n    var h;\r\n    var s;\r\n    var l = (max + min) / 2;\r\n    if (max === min) {\r\n        h = s = 0;\r\n    }\r\n    else {\r\n        var d = max - min;\r\n        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);\r\n        switch (max) {\r\n            case r:\r\n                h = (g - b) / d + (g < b ? 6 : 0);\r\n                break;\r\n            case g:\r\n                h = (b - r) / d + 2;\r\n                break;\r\n            case b:\r\n                h = (r - g) / d + 4;\r\n                break;\r\n        }\r\n        h /= 6;\r\n    }\r\n    return [h, s, l];\r\n}\r\nexports.rgbToHsl = rgbToHsl;\r\nfunction hslToRgb(h, s, l) {\r\n    var r;\r\n    var g;\r\n    var b;\r\n    function hue2rgb(p, q, t) {\r\n        if (t < 0)\r\n            t += 1;\r\n        if (t > 1)\r\n            t -= 1;\r\n        if (t < 1 / 6)\r\n            return p + (q - p) * 6 * t;\r\n        if (t < 1 / 2)\r\n            return q;\r\n        if (t < 2 / 3)\r\n            return p + (q - p) * (2 / 3 - t) * 6;\r\n        return p;\r\n    }\r\n    if (s === 0) {\r\n        r = g = b = l;\r\n    }\r\n    else {\r\n        var q = l < 0.5 ? l * (1 + s) : l + s - (l * s);\r\n        var p = 2 * l - q;\r\n        r = hue2rgb(p, q, h + 1 / 3);\r\n        g = hue2rgb(p, q, h);\r\n        b = hue2rgb(p, q, h - (1 / 3));\r\n    }\r\n    return [\r\n        r * 255,\r\n        g * 255,\r\n        b * 255\r\n    ];\r\n}\r\nexports.hslToRgb = hslToRgb;\r\nfunction rgbToXyz(r, g, b) {\r\n    r /= 255;\r\n    g /= 255;\r\n    b /= 255;\r\n    r = r > 0.04045 ? Math.pow((r + 0.005) / 1.055, 2.4) : r / 12.92;\r\n    g = g > 0.04045 ? Math.pow((g + 0.005) / 1.055, 2.4) : g / 12.92;\r\n    b = b > 0.04045 ? Math.pow((b + 0.005) / 1.055, 2.4) : b / 12.92;\r\n    r *= 100;\r\n    g *= 100;\r\n    b *= 100;\r\n    var x = r * 0.4124 + g * 0.3576 + b * 0.1805;\r\n    var y = r * 0.2126 + g * 0.7152 + b * 0.0722;\r\n    var z = r * 0.0193 + g * 0.1192 + b * 0.9505;\r\n    return [x, y, z];\r\n}\r\nexports.rgbToXyz = rgbToXyz;\r\nfunction xyzToCIELab(x, y, z) {\r\n    var REF_X = 95.047;\r\n    var REF_Y = 100;\r\n    var REF_Z = 108.883;\r\n    x /= REF_X;\r\n    y /= REF_Y;\r\n    z /= REF_Z;\r\n    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;\r\n    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;\r\n    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;\r\n    var L = 116 * y - 16;\r\n    var a = 500 * (x - y);\r\n    var b = 200 * (y - z);\r\n    return [L, a, b];\r\n}\r\nexports.xyzToCIELab = xyzToCIELab;\r\nfunction rgbToCIELab(r, g, b) {\r\n    var _a = rgbToXyz(r, g, b), x = _a[0], y = _a[1], z = _a[2];\r\n    return xyzToCIELab(x, y, z);\r\n}\r\nexports.rgbToCIELab = rgbToCIELab;\r\nfunction deltaE94(lab1, lab2) {\r\n    var WEIGHT_L = 1;\r\n    var WEIGHT_C = 1;\r\n    var WEIGHT_H = 1;\r\n    var L1 = lab1[0], a1 = lab1[1], b1 = lab1[2];\r\n    var L2 = lab2[0], a2 = lab2[1], b2 = lab2[2];\r\n    var dL = L1 - L2;\r\n    var da = a1 - a2;\r\n    var db = b1 - b2;\r\n    var xC1 = Math.sqrt(a1 * a1 + b1 * b1);\r\n    var xC2 = Math.sqrt(a2 * a2 + b2 * b2);\r\n    var xDL = L2 - L1;\r\n    var xDC = xC2 - xC1;\r\n    var xDE = Math.sqrt(dL * dL + da * da + db * db);\r\n    var xDH = (Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC)))\r\n        ? Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC)\r\n        : 0;\r\n    var xSC = 1 + 0.045 * xC1;\r\n    var xSH = 1 + 0.015 * xC1;\r\n    xDL /= WEIGHT_L;\r\n    xDC /= WEIGHT_C * xSC;\r\n    xDH /= WEIGHT_H * xSH;\r\n    return Math.sqrt(xDL * xDL + xDC * xDC + xDH * xDH);\r\n}\r\nexports.deltaE94 = deltaE94;\r\nfunction rgbDiff(rgb1, rgb2) {\r\n    var lab1 = rgbToCIELab.apply(undefined, rgb1);\r\n    var lab2 = rgbToCIELab.apply(undefined, rgb2);\r\n    return deltaE94(lab1, lab2);\r\n}\r\nexports.rgbDiff = rgbDiff;\r\nfunction hexDiff(hex1, hex2) {\r\n    var rgb1 = hexToRgb(hex1);\r\n    var rgb2 = hexToRgb(hex2);\r\n    return rgbDiff(rgb1, rgb2);\r\n}\r\nexports.hexDiff = hexDiff;\r\nfunction getColorDiffStatus(d) {\r\n    if (d < exports.DELTAE94_DIFF_STATUS.NA)\r\n        return 'N/A';\r\n    // Not perceptible by human eyes\r\n    if (d <= exports.DELTAE94_DIFF_STATUS.PERFECT)\r\n        return 'Perfect';\r\n    // Perceptible through close observation\r\n    if (d <= exports.DELTAE94_DIFF_STATUS.CLOSE)\r\n        return 'Close';\r\n    // Perceptible at a glance\r\n    if (d <= exports.DELTAE94_DIFF_STATUS.GOOD)\r\n        return 'Good';\r\n    // Colors are more similar than opposite\r\n    if (d < exports.DELTAE94_DIFF_STATUS.SIMILAR)\r\n        return 'Similar';\r\n    return 'Wrong';\r\n}\r\nexports.getColorDiffStatus = getColorDiffStatus;\r\nfunction getColorIndex(r, g, b) {\r\n    return (r << (2 * exports.SIGBITS)) + (g << exports.SIGBITS) + b;\r\n}\r\nexports.getColorIndex = getColorIndex;\r\n\n\n/***/ }),\n/* 20 */\n/***/ (function(module, exports) {\n\n// shim for using process in browser\nvar process = module.exports = {};\n\n// cached from whatever global is present so that test runners that stub it\n// don't break things.  But we need to wrap it in a try catch in case it is\n// wrapped in strict mode code which doesn't define any globals.  It's inside a\n// function because try/catches deoptimize in certain engines.\n\nvar cachedSetTimeout;\nvar cachedClearTimeout;\n\nfunction defaultSetTimout() {\n    throw new Error('setTimeout has not been defined');\n}\nfunction defaultClearTimeout () {\n    throw new Error('clearTimeout has not been defined');\n}\n(function () {\n    try {\n        if (typeof setTimeout === 'function') {\n            cachedSetTimeout = setTimeout;\n        } else {\n            cachedSetTimeout = defaultSetTimout;\n        }\n    } catch (e) {\n        cachedSetTimeout = defaultSetTimout;\n    }\n    try {\n        if (typeof clearTimeout === 'function') {\n            cachedClearTimeout = clearTimeout;\n        } else {\n            cachedClearTimeout = defaultClearTimeout;\n        }\n    } catch (e) {\n        cachedClearTimeout = defaultClearTimeout;\n    }\n} ())\nfunction runTimeout(fun) {\n    if (cachedSetTimeout === setTimeout) {\n        //normal enviroments in sane situations\n        return setTimeout(fun, 0);\n    }\n    // if setTimeout wasn't available but was latter defined\n    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {\n        cachedSetTimeout = setTimeout;\n        return setTimeout(fun, 0);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedSetTimeout(fun, 0);\n    } catch(e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally\n            return cachedSetTimeout.call(null, fun, 0);\n        } catch(e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error\n            return cachedSetTimeout.call(this, fun, 0);\n        }\n    }\n\n\n}\nfunction runClearTimeout(marker) {\n    if (cachedClearTimeout === clearTimeout) {\n        //normal enviroments in sane situations\n        return clearTimeout(marker);\n    }\n    // if clearTimeout wasn't available but was latter defined\n    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {\n        cachedClearTimeout = clearTimeout;\n        return clearTimeout(marker);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedClearTimeout(marker);\n    } catch (e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally\n            return cachedClearTimeout.call(null, marker);\n        } catch (e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.\n            // Some versions of I.E. have different rules for clearTimeout vs setTimeout\n            return cachedClearTimeout.call(this, marker);\n        }\n    }\n\n\n\n}\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    if (!draining || !currentQueue) {\n        return;\n    }\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = runTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    runClearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        runTimeout(drainQueue);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\nprocess.prependListener = noop;\nprocess.prependOnceListener = noop;\n\nprocess.listeners = function (name) { return [] }\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n/***/ }),\n/* 21 */\n/***/ (function(module, exports) {\n\n/**\n * A specialized version of `_.filter` for arrays without support for\n * iteratee shorthands.\n *\n * @private\n * @param {Array} [array] The array to iterate over.\n * @param {Function} predicate The function invoked per iteration.\n * @returns {Array} Returns the new filtered array.\n */\nfunction arrayFilter(array, predicate) {\n  var index = -1,\n      length = array == null ? 0 : array.length,\n      resIndex = 0,\n      result = [];\n\n  while (++index < length) {\n    var value = array[index];\n    if (predicate(value, index, array)) {\n      result[resIndex++] = value;\n    }\n  }\n  return result;\n}\n\nmodule.exports = arrayFilter;\n\n\n/***/ }),\n/* 22 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseIsArguments = __webpack_require__(53),\n    isObjectLike = __webpack_require__(4);\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/** Built-in value references. */\nvar propertyIsEnumerable = objectProto.propertyIsEnumerable;\n\n/**\n * Checks if `value` is likely an `arguments` object.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is an `arguments` object,\n *  else `false`.\n * @example\n *\n * _.isArguments(function() { return arguments; }());\n * // => true\n *\n * _.isArguments([1, 2, 3]);\n * // => false\n */\nvar isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {\n  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&\n    !propertyIsEnumerable.call(value, 'callee');\n};\n\nmodule.exports = isArguments;\n\n\n/***/ }),\n/* 23 */\n/***/ (function(module, exports, __webpack_require__) {\n\n/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */\nvar freeGlobal = typeof global == 'object' && global && global.Object === Object && global;\n\nmodule.exports = freeGlobal;\n\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))\n\n/***/ }),\n/* 24 */\n/***/ (function(module, exports, __webpack_require__) {\n\n/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(0),\n    stubFalse = __webpack_require__(56);\n\n/** Detect free variable `exports`. */\nvar freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;\n\n/** Detect free variable `module`. */\nvar freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;\n\n/** Detect the popular CommonJS extension `module.exports`. */\nvar moduleExports = freeModule && freeModule.exports === freeExports;\n\n/** Built-in value references. */\nvar Buffer = moduleExports ? root.Buffer : undefined;\n\n/* Built-in method references for those with the same name as other `lodash` methods. */\nvar nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;\n\n/**\n * Checks if `value` is a buffer.\n *\n * @static\n * @memberOf _\n * @since 4.3.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.\n * @example\n *\n * _.isBuffer(new Buffer(2));\n * // => true\n *\n * _.isBuffer(new Uint8Array(2));\n * // => false\n */\nvar isBuffer = nativeIsBuffer || stubFalse;\n\nmodule.exports = isBuffer;\n\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25)(module)))\n\n/***/ }),\n/* 25 */\n/***/ (function(module, exports) {\n\nmodule.exports = function(module) {\r\n\tif(!module.webpackPolyfill) {\r\n\t\tmodule.deprecate = function() {};\r\n\t\tmodule.paths = [];\r\n\t\t// module.parent = undefined by default\r\n\t\tif(!module.children) module.children = [];\r\n\t\tObject.defineProperty(module, \"loaded\", {\r\n\t\t\tenumerable: true,\r\n\t\t\tget: function() {\r\n\t\t\t\treturn module.l;\r\n\t\t\t}\r\n\t\t});\r\n\t\tObject.defineProperty(module, \"id\", {\r\n\t\t\tenumerable: true,\r\n\t\t\tget: function() {\r\n\t\t\t\treturn module.i;\r\n\t\t\t}\r\n\t\t});\r\n\t\tmodule.webpackPolyfill = 1;\r\n\t}\r\n\treturn module;\r\n};\r\n\n\n/***/ }),\n/* 26 */\n/***/ (function(module, exports) {\n\n/** Used as references for various `Number` constants. */\nvar MAX_SAFE_INTEGER = 9007199254740991;\n\n/** Used to detect unsigned integer values. */\nvar reIsUint = /^(?:0|[1-9]\\d*)$/;\n\n/**\n * Checks if `value` is a valid array-like index.\n *\n * @private\n * @param {*} value The value to check.\n * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.\n * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.\n */\nfunction isIndex(value, length) {\n  length = length == null ? MAX_SAFE_INTEGER : length;\n  return !!length &&\n    (typeof value == 'number' || reIsUint.test(value)) &&\n    (value > -1 && value % 1 == 0 && value < length);\n}\n\nmodule.exports = isIndex;\n\n\n/***/ }),\n/* 27 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseIsTypedArray = __webpack_require__(57),\n    baseUnary = __webpack_require__(58),\n    nodeUtil = __webpack_require__(59);\n\n/* Node.js helper references. */\nvar nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;\n\n/**\n * Checks if `value` is classified as a typed array.\n *\n * @static\n * @memberOf _\n * @since 3.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.\n * @example\n *\n * _.isTypedArray(new Uint8Array);\n * // => true\n *\n * _.isTypedArray([]);\n * // => false\n */\nvar isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;\n\nmodule.exports = isTypedArray;\n\n\n/***/ }),\n/* 28 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isFunction = __webpack_require__(29),\n    isLength = __webpack_require__(13);\n\n/**\n * Checks if `value` is array-like. A value is considered array-like if it's\n * not a function and has a `value.length` that's an integer greater than or\n * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is array-like, else `false`.\n * @example\n *\n * _.isArrayLike([1, 2, 3]);\n * // => true\n *\n * _.isArrayLike(document.body.children);\n * // => true\n *\n * _.isArrayLike('abc');\n * // => true\n *\n * _.isArrayLike(_.noop);\n * // => false\n */\nfunction isArrayLike(value) {\n  return value != null && isLength(value.length) && !isFunction(value);\n}\n\nmodule.exports = isArrayLike;\n\n\n/***/ }),\n/* 29 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseGetTag = __webpack_require__(3),\n    isObject = __webpack_require__(14);\n\n/** `Object#toString` result references. */\nvar asyncTag = '[object AsyncFunction]',\n    funcTag = '[object Function]',\n    genTag = '[object GeneratorFunction]',\n    proxyTag = '[object Proxy]';\n\n/**\n * Checks if `value` is classified as a `Function` object.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a function, else `false`.\n * @example\n *\n * _.isFunction(_);\n * // => true\n *\n * _.isFunction(/abc/);\n * // => false\n */\nfunction isFunction(value) {\n  if (!isObject(value)) {\n    return false;\n  }\n  // The use of `Object#toString` avoids issues with the `typeof` operator\n  // in Safari 9 which returns 'object' for typed arrays and other constructors.\n  var tag = baseGetTag(value);\n  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;\n}\n\nmodule.exports = isFunction;\n\n\n/***/ }),\n/* 30 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar ListCache = __webpack_require__(7),\n    stackClear = __webpack_require__(73),\n    stackDelete = __webpack_require__(74),\n    stackGet = __webpack_require__(75),\n    stackHas = __webpack_require__(76),\n    stackSet = __webpack_require__(77);\n\n/**\n * Creates a stack cache object to store key-value pairs.\n *\n * @private\n * @constructor\n * @param {Array} [entries] The key-value pairs to cache.\n */\nfunction Stack(entries) {\n  var data = this.__data__ = new ListCache(entries);\n  this.size = data.size;\n}\n\n// Add methods to `Stack`.\nStack.prototype.clear = stackClear;\nStack.prototype['delete'] = stackDelete;\nStack.prototype.get = stackGet;\nStack.prototype.has = stackHas;\nStack.prototype.set = stackSet;\n\nmodule.exports = Stack;\n\n\n/***/ }),\n/* 31 */\n/***/ (function(module, exports) {\n\n/**\n * Performs a\n * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n * comparison between two values to determine if they are equivalent.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to compare.\n * @param {*} other The other value to compare.\n * @returns {boolean} Returns `true` if the values are equivalent, else `false`.\n * @example\n *\n * var object = { 'a': 1 };\n * var other = { 'a': 1 };\n *\n * _.eq(object, object);\n * // => true\n *\n * _.eq(object, other);\n * // => false\n *\n * _.eq('a', 'a');\n * // => true\n *\n * _.eq('a', Object('a'));\n * // => false\n *\n * _.eq(NaN, NaN);\n * // => true\n */\nfunction eq(value, other) {\n  return value === other || (value !== value && other !== other);\n}\n\nmodule.exports = eq;\n\n\n/***/ }),\n/* 32 */\n/***/ (function(module, exports) {\n\n/** Used for built-in method references. */\nvar funcProto = Function.prototype;\n\n/** Used to resolve the decompiled source of functions. */\nvar funcToString = funcProto.toString;\n\n/**\n * Converts `func` to its source code.\n *\n * @private\n * @param {Function} func The function to convert.\n * @returns {string} Returns the source code.\n */\nfunction toSource(func) {\n  if (func != null) {\n    try {\n      return funcToString.call(func);\n    } catch (e) {}\n    try {\n      return (func + '');\n    } catch (e) {}\n  }\n  return '';\n}\n\nmodule.exports = toSource;\n\n\n/***/ }),\n/* 33 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseIsEqualDeep = __webpack_require__(94),\n    isObjectLike = __webpack_require__(4);\n\n/**\n * The base implementation of `_.isEqual` which supports partial comparisons\n * and tracks traversed objects.\n *\n * @private\n * @param {*} value The value to compare.\n * @param {*} other The other value to compare.\n * @param {boolean} bitmask The bitmask flags.\n *  1 - Unordered comparison\n *  2 - Partial comparison\n * @param {Function} [customizer] The function to customize comparisons.\n * @param {Object} [stack] Tracks traversed `value` and `other` objects.\n * @returns {boolean} Returns `true` if the values are equivalent, else `false`.\n */\nfunction baseIsEqual(value, other, bitmask, customizer, stack) {\n  if (value === other) {\n    return true;\n  }\n  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {\n    return value !== value && other !== other;\n  }\n  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);\n}\n\nmodule.exports = baseIsEqual;\n\n\n/***/ }),\n/* 34 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar SetCache = __webpack_require__(95),\n    arraySome = __webpack_require__(98),\n    cacheHas = __webpack_require__(99);\n\n/** Used to compose bitmasks for value comparisons. */\nvar COMPARE_PARTIAL_FLAG = 1,\n    COMPARE_UNORDERED_FLAG = 2;\n\n/**\n * A specialized version of `baseIsEqualDeep` for arrays with support for\n * partial deep comparisons.\n *\n * @private\n * @param {Array} array The array to compare.\n * @param {Array} other The other array to compare.\n * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\n * @param {Function} customizer The function to customize comparisons.\n * @param {Function} equalFunc The function to determine equivalents of values.\n * @param {Object} stack Tracks traversed `array` and `other` objects.\n * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.\n */\nfunction equalArrays(array, other, bitmask, customizer, equalFunc, stack) {\n  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,\n      arrLength = array.length,\n      othLength = other.length;\n\n  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {\n    return false;\n  }\n  // Assume cyclic values are equal.\n  var stacked = stack.get(array);\n  if (stacked && stack.get(other)) {\n    return stacked == other;\n  }\n  var index = -1,\n      result = true,\n      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;\n\n  stack.set(array, other);\n  stack.set(other, array);\n\n  // Ignore non-index properties.\n  while (++index < arrLength) {\n    var arrValue = array[index],\n        othValue = other[index];\n\n    if (customizer) {\n      var compared = isPartial\n        ? customizer(othValue, arrValue, index, other, array, stack)\n        : customizer(arrValue, othValue, index, array, other, stack);\n    }\n    if (compared !== undefined) {\n      if (compared) {\n        continue;\n      }\n      result = false;\n      break;\n    }\n    // Recursively compare arrays (susceptible to call stack limits).\n    if (seen) {\n      if (!arraySome(other, function(othValue, othIndex) {\n            if (!cacheHas(seen, othIndex) &&\n                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {\n              return seen.push(othIndex);\n            }\n          })) {\n        result = false;\n        break;\n      }\n    } else if (!(\n          arrValue === othValue ||\n            equalFunc(arrValue, othValue, bitmask, customizer, stack)\n        )) {\n      result = false;\n      break;\n    }\n  }\n  stack['delete'](array);\n  stack['delete'](other);\n  return result;\n}\n\nmodule.exports = equalArrays;\n\n\n/***/ }),\n/* 35 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isObject = __webpack_require__(14);\n\n/**\n * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` if suitable for strict\n *  equality comparisons, else `false`.\n */\nfunction isStrictComparable(value) {\n  return value === value && !isObject(value);\n}\n\nmodule.exports = isStrictComparable;\n\n\n/***/ }),\n/* 36 */\n/***/ (function(module, exports) {\n\n/**\n * A specialized version of `matchesProperty` for source values suitable\n * for strict equality comparisons, i.e. `===`.\n *\n * @private\n * @param {string} key The key of the property to get.\n * @param {*} srcValue The value to match.\n * @returns {Function} Returns the new spec function.\n */\nfunction matchesStrictComparable(key, srcValue) {\n  return function(object) {\n    if (object == null) {\n      return false;\n    }\n    return object[key] === srcValue &&\n      (srcValue !== undefined || (key in Object(object)));\n  };\n}\n\nmodule.exports = matchesStrictComparable;\n\n\n/***/ }),\n/* 37 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar castPath = __webpack_require__(38),\n    toKey = __webpack_require__(11);\n\n/**\n * The base implementation of `_.get` without support for default values.\n *\n * @private\n * @param {Object} object The object to query.\n * @param {Array|string} path The path of the property to get.\n * @returns {*} Returns the resolved value.\n */\nfunction baseGet(object, path) {\n  path = castPath(path, object);\n\n  var index = 0,\n      length = path.length;\n\n  while (object != null && index < length) {\n    object = object[toKey(path[index++])];\n  }\n  return (index && index == length) ? object : undefined;\n}\n\nmodule.exports = baseGet;\n\n\n/***/ }),\n/* 38 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isArray = __webpack_require__(1),\n    isKey = __webpack_require__(17),\n    stringToPath = __webpack_require__(118),\n    toString = __webpack_require__(121);\n\n/**\n * Casts `value` to a path array if it's not one.\n *\n * @private\n * @param {*} value The value to inspect.\n * @param {Object} [object] The object to query keys on.\n * @returns {Array} Returns the cast property path array.\n */\nfunction castPath(value, object) {\n  if (isArray(value)) {\n    return value;\n  }\n  return isKey(value, object) ? [value] : stringToPath(toString(value));\n}\n\nmodule.exports = castPath;\n\n\n/***/ }),\n/* 39 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar mmcq_1 = __webpack_require__(40);\r\nself.onmessage = function (event) {\r\n    var data = event.data;\r\n    var id = data.id, payload = data.payload;\r\n    var response;\r\n    try {\r\n        var swatches = mmcq_1.default(payload.pixels, payload.opts);\r\n        response = {\r\n            id: id,\r\n            type: 'return',\r\n            payload: swatches\r\n        };\r\n    }\r\n    catch (e) {\r\n        response = {\r\n            id: id,\r\n            type: 'error',\r\n            payload: e.message\r\n        };\r\n    }\r\n    self.postMessage(response);\r\n};\r\n\n\n/***/ }),\n/* 40 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar color_1 = __webpack_require__(41);\r\nvar vbox_1 = __webpack_require__(131);\r\nvar pqueue_1 = __webpack_require__(132);\r\nvar fractByPopulations = 0.75;\r\nfunction _splitBoxes(pq, target) {\r\n    var lastSize = pq.size();\r\n    while (pq.size() < target) {\r\n        var vbox = pq.pop();\r\n        if (vbox && vbox.count() > 0) {\r\n            var _a = vbox.split(), vbox1 = _a[0], vbox2 = _a[1];\r\n            pq.push(vbox1);\r\n            if (vbox2 && vbox2.count() > 0)\r\n                pq.push(vbox2);\r\n            // No more new boxes, converged\r\n            if (pq.size() === lastSize) {\r\n                break;\r\n            }\r\n            else {\r\n                lastSize = pq.size();\r\n            }\r\n        }\r\n        else {\r\n            break;\r\n        }\r\n    }\r\n}\r\nvar MMCQ = function (pixels, opts) {\r\n    if (pixels.length === 0 || opts.colorCount < 2 || opts.colorCount > 256) {\r\n        throw new Error('Wrong MMCQ parameters');\r\n    }\r\n    var vbox = vbox_1.default.build(pixels);\r\n    var hist = vbox.hist;\r\n    var colorCount = Object.keys(hist).length;\r\n    var pq = new pqueue_1.default(function (a, b) { return a.count() - b.count(); });\r\n    pq.push(vbox);\r\n    // first set of colors, sorted by population\r\n    _splitBoxes(pq, fractByPopulations * opts.colorCount);\r\n    // Re-order\r\n    var pq2 = new pqueue_1.default(function (a, b) { return a.count() * a.volume() - b.count() * b.volume(); });\r\n    pq2.contents = pq.contents;\r\n    // next set - generate the median cuts using the (npix * vol) sorting.\r\n    _splitBoxes(pq2, opts.colorCount - pq2.size());\r\n    // calculate the actual colors\r\n    return generateSwatches(pq2);\r\n};\r\nfunction generateSwatches(pq) {\r\n    var swatches = [];\r\n    while (pq.size()) {\r\n        var v = pq.pop();\r\n        var color = v.avg();\r\n        var r = color[0], g = color[1], b = color[2];\r\n        swatches.push(new color_1.Swatch(color, v.count()));\r\n    }\r\n    return swatches;\r\n}\r\nexports.default = MMCQ;\r\n\n\n/***/ }),\n/* 41 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar util_1 = __webpack_require__(19);\r\nvar filter = __webpack_require__(45);\r\nvar Swatch = /** @class */ (function () {\r\n    function Swatch(rgb, population) {\r\n        this._rgb = rgb;\r\n        this._population = population;\r\n    }\r\n    Swatch.applyFilter = function (colors, f) {\r\n        return typeof f === 'function'\r\n            ? filter(colors, function (_a) {\r\n                var r = _a.r, g = _a.g, b = _a.b;\r\n                return f(r, g, b, 255);\r\n            })\r\n            : colors;\r\n    };\r\n    Object.defineProperty(Swatch.prototype, \"r\", {\r\n        get: function () { return this._rgb[0]; },\r\n        enumerable: true,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(Swatch.prototype, \"g\", {\r\n        get: function () { return this._rgb[1]; },\r\n        enumerable: true,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(Swatch.prototype, \"b\", {\r\n        get: function () { return this._rgb[2]; },\r\n        enumerable: true,\r\n        configurable: true\r\n    });\r\n    Swatch.prototype.getRgb = function () { return this._rgb; };\r\n    Swatch.prototype.getHsl = function () {\r\n        if (!this._hsl) {\r\n            var _a = this._rgb, r = _a[0], g = _a[1], b = _a[2];\r\n            this._hsl = util_1.rgbToHsl(r, g, b);\r\n        }\r\n        return this._hsl;\r\n    };\r\n    Swatch.prototype.getPopulation = function () { return this._population; };\r\n    Swatch.prototype.getHex = function () {\r\n        if (!this._hex) {\r\n            var _a = this._rgb, r = _a[0], g = _a[1], b = _a[2];\r\n            this._hex = util_1.rgbToHex(r, g, b);\r\n        }\r\n        return this._hex;\r\n    };\r\n    Swatch.prototype.getYiq = function () {\r\n        if (!this._yiq) {\r\n            var rgb = this._rgb;\r\n            this._yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;\r\n        }\r\n        return this._yiq;\r\n    };\r\n    Swatch.prototype.getTitleTextColor = function () {\r\n        return this.getYiq() < 200 ? '#fff' : '#000';\r\n    };\r\n    Swatch.prototype.getBodyTextColor = function () {\r\n        return this.getYiq() < 150 ? '#fff' : '#000';\r\n    };\r\n    return Swatch;\r\n}());\r\nexports.Swatch = Swatch;\r\n\n\n/***/ }),\n/* 42 */\n/***/ (function(module, exports, __webpack_require__) {\n\n/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {/* @preserve\n * The MIT License (MIT)\n * \n * Copyright (c) 2013-2017 Petka Antonov\n * \n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n * \n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n * \n */\n/**\n * bluebird build version 3.5.1\n * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each\n*/\n!function(e){if(true)module.exports=e();else if(\"function\"==typeof define&&define.amd)define([],e);else{var f;\"undefined\"!=typeof window?f=window:\"undefined\"!=typeof global?f=global:\"undefined\"!=typeof self&&(f=self),f.Promise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_==\"function\"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error(\"Cannot find module '\"+o+\"'\");throw f.code=\"MODULE_NOT_FOUND\",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_==\"function\"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise) {\nvar SomePromiseArray = Promise._SomePromiseArray;\nfunction any(promises) {\n    var ret = new SomePromiseArray(promises);\n    var promise = ret.promise();\n    ret.setHowMany(1);\n    ret.setUnwrap();\n    ret.init();\n    return promise;\n}\n\nPromise.any = function (promises) {\n    return any(promises);\n};\n\nPromise.prototype.any = function () {\n    return any(this);\n};\n\n};\n\n},{}],2:[function(_dereq_,module,exports){\n\"use strict\";\nvar firstLineError;\ntry {throw new Error(); } catch (e) {firstLineError = e;}\nvar schedule = _dereq_(\"./schedule\");\nvar Queue = _dereq_(\"./queue\");\nvar util = _dereq_(\"./util\");\n\nfunction Async() {\n    this._customScheduler = false;\n    this._isTickUsed = false;\n    this._lateQueue = new Queue(16);\n    this._normalQueue = new Queue(16);\n    this._haveDrainedQueues = false;\n    this._trampolineEnabled = true;\n    var self = this;\n    this.drainQueues = function () {\n        self._drainQueues();\n    };\n    this._schedule = schedule;\n}\n\nAsync.prototype.setScheduler = function(fn) {\n    var prev = this._schedule;\n    this._schedule = fn;\n    this._customScheduler = true;\n    return prev;\n};\n\nAsync.prototype.hasCustomScheduler = function() {\n    return this._customScheduler;\n};\n\nAsync.prototype.enableTrampoline = function() {\n    this._trampolineEnabled = true;\n};\n\nAsync.prototype.disableTrampolineIfNecessary = function() {\n    if (util.hasDevTools) {\n        this._trampolineEnabled = false;\n    }\n};\n\nAsync.prototype.haveItemsQueued = function () {\n    return this._isTickUsed || this._haveDrainedQueues;\n};\n\n\nAsync.prototype.fatalError = function(e, isNode) {\n    if (isNode) {\n        process.stderr.write(\"Fatal \" + (e instanceof Error ? e.stack : e) +\n            \"\\n\");\n        process.exit(2);\n    } else {\n        this.throwLater(e);\n    }\n};\n\nAsync.prototype.throwLater = function(fn, arg) {\n    if (arguments.length === 1) {\n        arg = fn;\n        fn = function () { throw arg; };\n    }\n    if (typeof setTimeout !== \"undefined\") {\n        setTimeout(function() {\n            fn(arg);\n        }, 0);\n    } else try {\n        this._schedule(function() {\n            fn(arg);\n        });\n    } catch (e) {\n        throw new Error(\"No async scheduler available\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n};\n\nfunction AsyncInvokeLater(fn, receiver, arg) {\n    this._lateQueue.push(fn, receiver, arg);\n    this._queueTick();\n}\n\nfunction AsyncInvoke(fn, receiver, arg) {\n    this._normalQueue.push(fn, receiver, arg);\n    this._queueTick();\n}\n\nfunction AsyncSettlePromises(promise) {\n    this._normalQueue._pushOne(promise);\n    this._queueTick();\n}\n\nif (!util.hasDevTools) {\n    Async.prototype.invokeLater = AsyncInvokeLater;\n    Async.prototype.invoke = AsyncInvoke;\n    Async.prototype.settlePromises = AsyncSettlePromises;\n} else {\n    Async.prototype.invokeLater = function (fn, receiver, arg) {\n        if (this._trampolineEnabled) {\n            AsyncInvokeLater.call(this, fn, receiver, arg);\n        } else {\n            this._schedule(function() {\n                setTimeout(function() {\n                    fn.call(receiver, arg);\n                }, 100);\n            });\n        }\n    };\n\n    Async.prototype.invoke = function (fn, receiver, arg) {\n        if (this._trampolineEnabled) {\n            AsyncInvoke.call(this, fn, receiver, arg);\n        } else {\n            this._schedule(function() {\n                fn.call(receiver, arg);\n            });\n        }\n    };\n\n    Async.prototype.settlePromises = function(promise) {\n        if (this._trampolineEnabled) {\n            AsyncSettlePromises.call(this, promise);\n        } else {\n            this._schedule(function() {\n                promise._settlePromises();\n            });\n        }\n    };\n}\n\nAsync.prototype._drainQueue = function(queue) {\n    while (queue.length() > 0) {\n        var fn = queue.shift();\n        if (typeof fn !== \"function\") {\n            fn._settlePromises();\n            continue;\n        }\n        var receiver = queue.shift();\n        var arg = queue.shift();\n        fn.call(receiver, arg);\n    }\n};\n\nAsync.prototype._drainQueues = function () {\n    this._drainQueue(this._normalQueue);\n    this._reset();\n    this._haveDrainedQueues = true;\n    this._drainQueue(this._lateQueue);\n};\n\nAsync.prototype._queueTick = function () {\n    if (!this._isTickUsed) {\n        this._isTickUsed = true;\n        this._schedule(this.drainQueues);\n    }\n};\n\nAsync.prototype._reset = function () {\n    this._isTickUsed = false;\n};\n\nmodule.exports = Async;\nmodule.exports.firstLineError = firstLineError;\n\n},{\"./queue\":26,\"./schedule\":29,\"./util\":36}],3:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {\nvar calledBind = false;\nvar rejectThis = function(_, e) {\n    this._reject(e);\n};\n\nvar targetRejected = function(e, context) {\n    context.promiseRejectionQueued = true;\n    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);\n};\n\nvar bindingResolved = function(thisArg, context) {\n    if (((this._bitField & 50397184) === 0)) {\n        this._resolveCallback(context.target);\n    }\n};\n\nvar bindingRejected = function(e, context) {\n    if (!context.promiseRejectionQueued) this._reject(e);\n};\n\nPromise.prototype.bind = function (thisArg) {\n    if (!calledBind) {\n        calledBind = true;\n        Promise.prototype._propagateFrom = debug.propagateFromFunction();\n        Promise.prototype._boundValue = debug.boundValueFunction();\n    }\n    var maybePromise = tryConvertToPromise(thisArg);\n    var ret = new Promise(INTERNAL);\n    ret._propagateFrom(this, 1);\n    var target = this._target();\n    ret._setBoundTo(maybePromise);\n    if (maybePromise instanceof Promise) {\n        var context = {\n            promiseRejectionQueued: false,\n            promise: ret,\n            target: target,\n            bindingPromise: maybePromise\n        };\n        target._then(INTERNAL, targetRejected, undefined, ret, context);\n        maybePromise._then(\n            bindingResolved, bindingRejected, undefined, ret, context);\n        ret._setOnCancel(maybePromise);\n    } else {\n        ret._resolveCallback(target);\n    }\n    return ret;\n};\n\nPromise.prototype._setBoundTo = function (obj) {\n    if (obj !== undefined) {\n        this._bitField = this._bitField | 2097152;\n        this._boundTo = obj;\n    } else {\n        this._bitField = this._bitField & (~2097152);\n    }\n};\n\nPromise.prototype._isBound = function () {\n    return (this._bitField & 2097152) === 2097152;\n};\n\nPromise.bind = function (thisArg, value) {\n    return Promise.resolve(value).bind(thisArg);\n};\n};\n\n},{}],4:[function(_dereq_,module,exports){\n\"use strict\";\nvar old;\nif (typeof Promise !== \"undefined\") old = Promise;\nfunction noConflict() {\n    try { if (Promise === bluebird) Promise = old; }\n    catch (e) {}\n    return bluebird;\n}\nvar bluebird = _dereq_(\"./promise\")();\nbluebird.noConflict = noConflict;\nmodule.exports = bluebird;\n\n},{\"./promise\":22}],5:[function(_dereq_,module,exports){\n\"use strict\";\nvar cr = Object.create;\nif (cr) {\n    var callerCache = cr(null);\n    var getterCache = cr(null);\n    callerCache[\" size\"] = getterCache[\" size\"] = 0;\n}\n\nmodule.exports = function(Promise) {\nvar util = _dereq_(\"./util\");\nvar canEvaluate = util.canEvaluate;\nvar isIdentifier = util.isIdentifier;\n\nvar getMethodCaller;\nvar getGetter;\nif (false) {\nvar makeMethodCaller = function (methodName) {\n    return new Function(\"ensureMethod\", \"                                    \\n\\\n        return function(obj) {                                               \\n\\\n            'use strict'                                                     \\n\\\n            var len = this.length;                                           \\n\\\n            ensureMethod(obj, 'methodName');                                 \\n\\\n            switch(len) {                                                    \\n\\\n                case 1: return obj.methodName(this[0]);                      \\n\\\n                case 2: return obj.methodName(this[0], this[1]);             \\n\\\n                case 3: return obj.methodName(this[0], this[1], this[2]);    \\n\\\n                case 0: return obj.methodName();                             \\n\\\n                default:                                                     \\n\\\n                    return obj.methodName.apply(obj, this);                  \\n\\\n            }                                                                \\n\\\n        };                                                                   \\n\\\n        \".replace(/methodName/g, methodName))(ensureMethod);\n};\n\nvar makeGetter = function (propertyName) {\n    return new Function(\"obj\", \"                                             \\n\\\n        'use strict';                                                        \\n\\\n        return obj.propertyName;                                             \\n\\\n        \".replace(\"propertyName\", propertyName));\n};\n\nvar getCompiled = function(name, compiler, cache) {\n    var ret = cache[name];\n    if (typeof ret !== \"function\") {\n        if (!isIdentifier(name)) {\n            return null;\n        }\n        ret = compiler(name);\n        cache[name] = ret;\n        cache[\" size\"]++;\n        if (cache[\" size\"] > 512) {\n            var keys = Object.keys(cache);\n            for (var i = 0; i < 256; ++i) delete cache[keys[i]];\n            cache[\" size\"] = keys.length - 256;\n        }\n    }\n    return ret;\n};\n\ngetMethodCaller = function(name) {\n    return getCompiled(name, makeMethodCaller, callerCache);\n};\n\ngetGetter = function(name) {\n    return getCompiled(name, makeGetter, getterCache);\n};\n}\n\nfunction ensureMethod(obj, methodName) {\n    var fn;\n    if (obj != null) fn = obj[methodName];\n    if (typeof fn !== \"function\") {\n        var message = \"Object \" + util.classString(obj) + \" has no method '\" +\n            util.toString(methodName) + \"'\";\n        throw new Promise.TypeError(message);\n    }\n    return fn;\n}\n\nfunction caller(obj) {\n    var methodName = this.pop();\n    var fn = ensureMethod(obj, methodName);\n    return fn.apply(obj, this);\n}\nPromise.prototype.call = function (methodName) {\n    var args = [].slice.call(arguments, 1);;\n    if (false) {\n        if (canEvaluate) {\n            var maybeCaller = getMethodCaller(methodName);\n            if (maybeCaller !== null) {\n                return this._then(\n                    maybeCaller, undefined, undefined, args, undefined);\n            }\n        }\n    }\n    args.push(methodName);\n    return this._then(caller, undefined, undefined, args, undefined);\n};\n\nfunction namedGetter(obj) {\n    return obj[this];\n}\nfunction indexedGetter(obj) {\n    var index = +this;\n    if (index < 0) index = Math.max(0, index + obj.length);\n    return obj[index];\n}\nPromise.prototype.get = function (propertyName) {\n    var isIndex = (typeof propertyName === \"number\");\n    var getter;\n    if (!isIndex) {\n        if (canEvaluate) {\n            var maybeGetter = getGetter(propertyName);\n            getter = maybeGetter !== null ? maybeGetter : namedGetter;\n        } else {\n            getter = namedGetter;\n        }\n    } else {\n        getter = indexedGetter;\n    }\n    return this._then(getter, undefined, undefined, propertyName, undefined);\n};\n};\n\n},{\"./util\":36}],6:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, PromiseArray, apiRejection, debug) {\nvar util = _dereq_(\"./util\");\nvar tryCatch = util.tryCatch;\nvar errorObj = util.errorObj;\nvar async = Promise._async;\n\nPromise.prototype[\"break\"] = Promise.prototype.cancel = function() {\n    if (!debug.cancellation()) return this._warn(\"cancellation is disabled\");\n\n    var promise = this;\n    var child = promise;\n    while (promise._isCancellable()) {\n        if (!promise._cancelBy(child)) {\n            if (child._isFollowing()) {\n                child._followee().cancel();\n            } else {\n                child._cancelBranched();\n            }\n            break;\n        }\n\n        var parent = promise._cancellationParent;\n        if (parent == null || !parent._isCancellable()) {\n            if (promise._isFollowing()) {\n                promise._followee().cancel();\n            } else {\n                promise._cancelBranched();\n            }\n            break;\n        } else {\n            if (promise._isFollowing()) promise._followee().cancel();\n            promise._setWillBeCancelled();\n            child = promise;\n            promise = parent;\n        }\n    }\n};\n\nPromise.prototype._branchHasCancelled = function() {\n    this._branchesRemainingToCancel--;\n};\n\nPromise.prototype._enoughBranchesHaveCancelled = function() {\n    return this._branchesRemainingToCancel === undefined ||\n           this._branchesRemainingToCancel <= 0;\n};\n\nPromise.prototype._cancelBy = function(canceller) {\n    if (canceller === this) {\n        this._branchesRemainingToCancel = 0;\n        this._invokeOnCancel();\n        return true;\n    } else {\n        this._branchHasCancelled();\n        if (this._enoughBranchesHaveCancelled()) {\n            this._invokeOnCancel();\n            return true;\n        }\n    }\n    return false;\n};\n\nPromise.prototype._cancelBranched = function() {\n    if (this._enoughBranchesHaveCancelled()) {\n        this._cancel();\n    }\n};\n\nPromise.prototype._cancel = function() {\n    if (!this._isCancellable()) return;\n    this._setCancelled();\n    async.invoke(this._cancelPromises, this, undefined);\n};\n\nPromise.prototype._cancelPromises = function() {\n    if (this._length() > 0) this._settlePromises();\n};\n\nPromise.prototype._unsetOnCancel = function() {\n    this._onCancelField = undefined;\n};\n\nPromise.prototype._isCancellable = function() {\n    return this.isPending() && !this._isCancelled();\n};\n\nPromise.prototype.isCancellable = function() {\n    return this.isPending() && !this.isCancelled();\n};\n\nPromise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {\n    if (util.isArray(onCancelCallback)) {\n        for (var i = 0; i < onCancelCallback.length; ++i) {\n            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);\n        }\n    } else if (onCancelCallback !== undefined) {\n        if (typeof onCancelCallback === \"function\") {\n            if (!internalOnly) {\n                var e = tryCatch(onCancelCallback).call(this._boundValue());\n                if (e === errorObj) {\n                    this._attachExtraTrace(e.e);\n                    async.throwLater(e.e);\n                }\n            }\n        } else {\n            onCancelCallback._resultCancelled(this);\n        }\n    }\n};\n\nPromise.prototype._invokeOnCancel = function() {\n    var onCancelCallback = this._onCancel();\n    this._unsetOnCancel();\n    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);\n};\n\nPromise.prototype._invokeInternalOnCancel = function() {\n    if (this._isCancellable()) {\n        this._doInvokeOnCancel(this._onCancel(), true);\n        this._unsetOnCancel();\n    }\n};\n\nPromise.prototype._resultCancelled = function() {\n    this.cancel();\n};\n\n};\n\n},{\"./util\":36}],7:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(NEXT_FILTER) {\nvar util = _dereq_(\"./util\");\nvar getKeys = _dereq_(\"./es5\").keys;\nvar tryCatch = util.tryCatch;\nvar errorObj = util.errorObj;\n\nfunction catchFilter(instances, cb, promise) {\n    return function(e) {\n        var boundTo = promise._boundValue();\n        predicateLoop: for (var i = 0; i < instances.length; ++i) {\n            var item = instances[i];\n\n            if (item === Error ||\n                (item != null && item.prototype instanceof Error)) {\n                if (e instanceof item) {\n                    return tryCatch(cb).call(boundTo, e);\n                }\n            } else if (typeof item === \"function\") {\n                var matchesPredicate = tryCatch(item).call(boundTo, e);\n                if (matchesPredicate === errorObj) {\n                    return matchesPredicate;\n                } else if (matchesPredicate) {\n                    return tryCatch(cb).call(boundTo, e);\n                }\n            } else if (util.isObject(e)) {\n                var keys = getKeys(item);\n                for (var j = 0; j < keys.length; ++j) {\n                    var key = keys[j];\n                    if (item[key] != e[key]) {\n                        continue predicateLoop;\n                    }\n                }\n                return tryCatch(cb).call(boundTo, e);\n            }\n        }\n        return NEXT_FILTER;\n    };\n}\n\nreturn catchFilter;\n};\n\n},{\"./es5\":13,\"./util\":36}],8:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise) {\nvar longStackTraces = false;\nvar contextStack = [];\n\nPromise.prototype._promiseCreated = function() {};\nPromise.prototype._pushContext = function() {};\nPromise.prototype._popContext = function() {return null;};\nPromise._peekContext = Promise.prototype._peekContext = function() {};\n\nfunction Context() {\n    this._trace = new Context.CapturedTrace(peekContext());\n}\nContext.prototype._pushContext = function () {\n    if (this._trace !== undefined) {\n        this._trace._promiseCreated = null;\n        contextStack.push(this._trace);\n    }\n};\n\nContext.prototype._popContext = function () {\n    if (this._trace !== undefined) {\n        var trace = contextStack.pop();\n        var ret = trace._promiseCreated;\n        trace._promiseCreated = null;\n        return ret;\n    }\n    return null;\n};\n\nfunction createContext() {\n    if (longStackTraces) return new Context();\n}\n\nfunction peekContext() {\n    var lastIndex = contextStack.length - 1;\n    if (lastIndex >= 0) {\n        return contextStack[lastIndex];\n    }\n    return undefined;\n}\nContext.CapturedTrace = null;\nContext.create = createContext;\nContext.deactivateLongStackTraces = function() {};\nContext.activateLongStackTraces = function() {\n    var Promise_pushContext = Promise.prototype._pushContext;\n    var Promise_popContext = Promise.prototype._popContext;\n    var Promise_PeekContext = Promise._peekContext;\n    var Promise_peekContext = Promise.prototype._peekContext;\n    var Promise_promiseCreated = Promise.prototype._promiseCreated;\n    Context.deactivateLongStackTraces = function() {\n        Promise.prototype._pushContext = Promise_pushContext;\n        Promise.prototype._popContext = Promise_popContext;\n        Promise._peekContext = Promise_PeekContext;\n        Promise.prototype._peekContext = Promise_peekContext;\n        Promise.prototype._promiseCreated = Promise_promiseCreated;\n        longStackTraces = false;\n    };\n    longStackTraces = true;\n    Promise.prototype._pushContext = Context.prototype._pushContext;\n    Promise.prototype._popContext = Context.prototype._popContext;\n    Promise._peekContext = Promise.prototype._peekContext = peekContext;\n    Promise.prototype._promiseCreated = function() {\n        var ctx = this._peekContext();\n        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;\n    };\n};\nreturn Context;\n};\n\n},{}],9:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, Context) {\nvar getDomain = Promise._getDomain;\nvar async = Promise._async;\nvar Warning = _dereq_(\"./errors\").Warning;\nvar util = _dereq_(\"./util\");\nvar canAttachTrace = util.canAttachTrace;\nvar unhandledRejectionHandled;\nvar possiblyUnhandledRejection;\nvar bluebirdFramePattern =\n    /[\\\\\\/]bluebird[\\\\\\/]js[\\\\\\/](release|debug|instrumented)/;\nvar nodeFramePattern = /\\((?:timers\\.js):\\d+:\\d+\\)/;\nvar parseLinePattern = /[\\/<\\(](.+?):(\\d+):(\\d+)\\)?\\s*$/;\nvar stackFramePattern = null;\nvar formatStack = null;\nvar indentStackFrames = false;\nvar printWarning;\nvar debugging = !!(util.env(\"BLUEBIRD_DEBUG\") != 0 &&\n                        (true ||\n                         util.env(\"BLUEBIRD_DEBUG\") ||\n                         util.env(\"NODE_ENV\") === \"development\"));\n\nvar warnings = !!(util.env(\"BLUEBIRD_WARNINGS\") != 0 &&\n    (debugging || util.env(\"BLUEBIRD_WARNINGS\")));\n\nvar longStackTraces = !!(util.env(\"BLUEBIRD_LONG_STACK_TRACES\") != 0 &&\n    (debugging || util.env(\"BLUEBIRD_LONG_STACK_TRACES\")));\n\nvar wForgottenReturn = util.env(\"BLUEBIRD_W_FORGOTTEN_RETURN\") != 0 &&\n    (warnings || !!util.env(\"BLUEBIRD_W_FORGOTTEN_RETURN\"));\n\nPromise.prototype.suppressUnhandledRejections = function() {\n    var target = this._target();\n    target._bitField = ((target._bitField & (~1048576)) |\n                      524288);\n};\n\nPromise.prototype._ensurePossibleRejectionHandled = function () {\n    if ((this._bitField & 524288) !== 0) return;\n    this._setRejectionIsUnhandled();\n    var self = this;\n    setTimeout(function() {\n        self._notifyUnhandledRejection();\n    }, 1);\n};\n\nPromise.prototype._notifyUnhandledRejectionIsHandled = function () {\n    fireRejectionEvent(\"rejectionHandled\",\n                                  unhandledRejectionHandled, undefined, this);\n};\n\nPromise.prototype._setReturnedNonUndefined = function() {\n    this._bitField = this._bitField | 268435456;\n};\n\nPromise.prototype._returnedNonUndefined = function() {\n    return (this._bitField & 268435456) !== 0;\n};\n\nPromise.prototype._notifyUnhandledRejection = function () {\n    if (this._isRejectionUnhandled()) {\n        var reason = this._settledValue();\n        this._setUnhandledRejectionIsNotified();\n        fireRejectionEvent(\"unhandledRejection\",\n                                      possiblyUnhandledRejection, reason, this);\n    }\n};\n\nPromise.prototype._setUnhandledRejectionIsNotified = function () {\n    this._bitField = this._bitField | 262144;\n};\n\nPromise.prototype._unsetUnhandledRejectionIsNotified = function () {\n    this._bitField = this._bitField & (~262144);\n};\n\nPromise.prototype._isUnhandledRejectionNotified = function () {\n    return (this._bitField & 262144) > 0;\n};\n\nPromise.prototype._setRejectionIsUnhandled = function () {\n    this._bitField = this._bitField | 1048576;\n};\n\nPromise.prototype._unsetRejectionIsUnhandled = function () {\n    this._bitField = this._bitField & (~1048576);\n    if (this._isUnhandledRejectionNotified()) {\n        this._unsetUnhandledRejectionIsNotified();\n        this._notifyUnhandledRejectionIsHandled();\n    }\n};\n\nPromise.prototype._isRejectionUnhandled = function () {\n    return (this._bitField & 1048576) > 0;\n};\n\nPromise.prototype._warn = function(message, shouldUseOwnTrace, promise) {\n    return warn(message, shouldUseOwnTrace, promise || this);\n};\n\nPromise.onPossiblyUnhandledRejection = function (fn) {\n    var domain = getDomain();\n    possiblyUnhandledRejection =\n        typeof fn === \"function\" ? (domain === null ?\n                                            fn : util.domainBind(domain, fn))\n                                 : undefined;\n};\n\nPromise.onUnhandledRejectionHandled = function (fn) {\n    var domain = getDomain();\n    unhandledRejectionHandled =\n        typeof fn === \"function\" ? (domain === null ?\n                                            fn : util.domainBind(domain, fn))\n                                 : undefined;\n};\n\nvar disableLongStackTraces = function() {};\nPromise.longStackTraces = function () {\n    if (async.haveItemsQueued() && !config.longStackTraces) {\n        throw new Error(\"cannot enable long stack traces after promises have been created\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n    if (!config.longStackTraces && longStackTracesIsSupported()) {\n        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;\n        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;\n        config.longStackTraces = true;\n        disableLongStackTraces = function() {\n            if (async.haveItemsQueued() && !config.longStackTraces) {\n                throw new Error(\"cannot enable long stack traces after promises have been created\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n            }\n            Promise.prototype._captureStackTrace = Promise_captureStackTrace;\n            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;\n            Context.deactivateLongStackTraces();\n            async.enableTrampoline();\n            config.longStackTraces = false;\n        };\n        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;\n        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;\n        Context.activateLongStackTraces();\n        async.disableTrampolineIfNecessary();\n    }\n};\n\nPromise.hasLongStackTraces = function () {\n    return config.longStackTraces && longStackTracesIsSupported();\n};\n\nvar fireDomEvent = (function() {\n    try {\n        if (typeof CustomEvent === \"function\") {\n            var event = new CustomEvent(\"CustomEvent\");\n            util.global.dispatchEvent(event);\n            return function(name, event) {\n                var domEvent = new CustomEvent(name.toLowerCase(), {\n                    detail: event,\n                    cancelable: true\n                });\n                return !util.global.dispatchEvent(domEvent);\n            };\n        } else if (typeof Event === \"function\") {\n            var event = new Event(\"CustomEvent\");\n            util.global.dispatchEvent(event);\n            return function(name, event) {\n                var domEvent = new Event(name.toLowerCase(), {\n                    cancelable: true\n                });\n                domEvent.detail = event;\n                return !util.global.dispatchEvent(domEvent);\n            };\n        } else {\n            var event = document.createEvent(\"CustomEvent\");\n            event.initCustomEvent(\"testingtheevent\", false, true, {});\n            util.global.dispatchEvent(event);\n            return function(name, event) {\n                var domEvent = document.createEvent(\"CustomEvent\");\n                domEvent.initCustomEvent(name.toLowerCase(), false, true,\n                    event);\n                return !util.global.dispatchEvent(domEvent);\n            };\n        }\n    } catch (e) {}\n    return function() {\n        return false;\n    };\n})();\n\nvar fireGlobalEvent = (function() {\n    if (util.isNode) {\n        return function() {\n            return process.emit.apply(process, arguments);\n        };\n    } else {\n        if (!util.global) {\n            return function() {\n                return false;\n            };\n        }\n        return function(name) {\n            var methodName = \"on\" + name.toLowerCase();\n            var method = util.global[methodName];\n            if (!method) return false;\n            method.apply(util.global, [].slice.call(arguments, 1));\n            return true;\n        };\n    }\n})();\n\nfunction generatePromiseLifecycleEventObject(name, promise) {\n    return {promise: promise};\n}\n\nvar eventToObjectGenerator = {\n    promiseCreated: generatePromiseLifecycleEventObject,\n    promiseFulfilled: generatePromiseLifecycleEventObject,\n    promiseRejected: generatePromiseLifecycleEventObject,\n    promiseResolved: generatePromiseLifecycleEventObject,\n    promiseCancelled: generatePromiseLifecycleEventObject,\n    promiseChained: function(name, promise, child) {\n        return {promise: promise, child: child};\n    },\n    warning: function(name, warning) {\n        return {warning: warning};\n    },\n    unhandledRejection: function (name, reason, promise) {\n        return {reason: reason, promise: promise};\n    },\n    rejectionHandled: generatePromiseLifecycleEventObject\n};\n\nvar activeFireEvent = function (name) {\n    var globalEventFired = false;\n    try {\n        globalEventFired = fireGlobalEvent.apply(null, arguments);\n    } catch (e) {\n        async.throwLater(e);\n        globalEventFired = true;\n    }\n\n    var domEventFired = false;\n    try {\n        domEventFired = fireDomEvent(name,\n                    eventToObjectGenerator[name].apply(null, arguments));\n    } catch (e) {\n        async.throwLater(e);\n        domEventFired = true;\n    }\n\n    return domEventFired || globalEventFired;\n};\n\nPromise.config = function(opts) {\n    opts = Object(opts);\n    if (\"longStackTraces\" in opts) {\n        if (opts.longStackTraces) {\n            Promise.longStackTraces();\n        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {\n            disableLongStackTraces();\n        }\n    }\n    if (\"warnings\" in opts) {\n        var warningsOption = opts.warnings;\n        config.warnings = !!warningsOption;\n        wForgottenReturn = config.warnings;\n\n        if (util.isObject(warningsOption)) {\n            if (\"wForgottenReturn\" in warningsOption) {\n                wForgottenReturn = !!warningsOption.wForgottenReturn;\n            }\n        }\n    }\n    if (\"cancellation\" in opts && opts.cancellation && !config.cancellation) {\n        if (async.haveItemsQueued()) {\n            throw new Error(\n                \"cannot enable cancellation after promises are in use\");\n        }\n        Promise.prototype._clearCancellationData =\n            cancellationClearCancellationData;\n        Promise.prototype._propagateFrom = cancellationPropagateFrom;\n        Promise.prototype._onCancel = cancellationOnCancel;\n        Promise.prototype._setOnCancel = cancellationSetOnCancel;\n        Promise.prototype._attachCancellationCallback =\n            cancellationAttachCancellationCallback;\n        Promise.prototype._execute = cancellationExecute;\n        propagateFromFunction = cancellationPropagateFrom;\n        config.cancellation = true;\n    }\n    if (\"monitoring\" in opts) {\n        if (opts.monitoring && !config.monitoring) {\n            config.monitoring = true;\n            Promise.prototype._fireEvent = activeFireEvent;\n        } else if (!opts.monitoring && config.monitoring) {\n            config.monitoring = false;\n            Promise.prototype._fireEvent = defaultFireEvent;\n        }\n    }\n    return Promise;\n};\n\nfunction defaultFireEvent() { return false; }\n\nPromise.prototype._fireEvent = defaultFireEvent;\nPromise.prototype._execute = function(executor, resolve, reject) {\n    try {\n        executor(resolve, reject);\n    } catch (e) {\n        return e;\n    }\n};\nPromise.prototype._onCancel = function () {};\nPromise.prototype._setOnCancel = function (handler) { ; };\nPromise.prototype._attachCancellationCallback = function(onCancel) {\n    ;\n};\nPromise.prototype._captureStackTrace = function () {};\nPromise.prototype._attachExtraTrace = function () {};\nPromise.prototype._clearCancellationData = function() {};\nPromise.prototype._propagateFrom = function (parent, flags) {\n    ;\n    ;\n};\n\nfunction cancellationExecute(executor, resolve, reject) {\n    var promise = this;\n    try {\n        executor(resolve, reject, function(onCancel) {\n            if (typeof onCancel !== \"function\") {\n                throw new TypeError(\"onCancel must be a function, got: \" +\n                                    util.toString(onCancel));\n            }\n            promise._attachCancellationCallback(onCancel);\n        });\n    } catch (e) {\n        return e;\n    }\n}\n\nfunction cancellationAttachCancellationCallback(onCancel) {\n    if (!this._isCancellable()) return this;\n\n    var previousOnCancel = this._onCancel();\n    if (previousOnCancel !== undefined) {\n        if (util.isArray(previousOnCancel)) {\n            previousOnCancel.push(onCancel);\n        } else {\n            this._setOnCancel([previousOnCancel, onCancel]);\n        }\n    } else {\n        this._setOnCancel(onCancel);\n    }\n}\n\nfunction cancellationOnCancel() {\n    return this._onCancelField;\n}\n\nfunction cancellationSetOnCancel(onCancel) {\n    this._onCancelField = onCancel;\n}\n\nfunction cancellationClearCancellationData() {\n    this._cancellationParent = undefined;\n    this._onCancelField = undefined;\n}\n\nfunction cancellationPropagateFrom(parent, flags) {\n    if ((flags & 1) !== 0) {\n        this._cancellationParent = parent;\n        var branchesRemainingToCancel = parent._branchesRemainingToCancel;\n        if (branchesRemainingToCancel === undefined) {\n            branchesRemainingToCancel = 0;\n        }\n        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;\n    }\n    if ((flags & 2) !== 0 && parent._isBound()) {\n        this._setBoundTo(parent._boundTo);\n    }\n}\n\nfunction bindingPropagateFrom(parent, flags) {\n    if ((flags & 2) !== 0 && parent._isBound()) {\n        this._setBoundTo(parent._boundTo);\n    }\n}\nvar propagateFromFunction = bindingPropagateFrom;\n\nfunction boundValueFunction() {\n    var ret = this._boundTo;\n    if (ret !== undefined) {\n        if (ret instanceof Promise) {\n            if (ret.isFulfilled()) {\n                return ret.value();\n            } else {\n                return undefined;\n            }\n        }\n    }\n    return ret;\n}\n\nfunction longStackTracesCaptureStackTrace() {\n    this._trace = new CapturedTrace(this._peekContext());\n}\n\nfunction longStackTracesAttachExtraTrace(error, ignoreSelf) {\n    if (canAttachTrace(error)) {\n        var trace = this._trace;\n        if (trace !== undefined) {\n            if (ignoreSelf) trace = trace._parent;\n        }\n        if (trace !== undefined) {\n            trace.attachExtraTrace(error);\n        } else if (!error.__stackCleaned__) {\n            var parsed = parseStackAndMessage(error);\n            util.notEnumerableProp(error, \"stack\",\n                parsed.message + \"\\n\" + parsed.stack.join(\"\\n\"));\n            util.notEnumerableProp(error, \"__stackCleaned__\", true);\n        }\n    }\n}\n\nfunction checkForgottenReturns(returnValue, promiseCreated, name, promise,\n                               parent) {\n    if (returnValue === undefined && promiseCreated !== null &&\n        wForgottenReturn) {\n        if (parent !== undefined && parent._returnedNonUndefined()) return;\n        if ((promise._bitField & 65535) === 0) return;\n\n        if (name) name = name + \" \";\n        var handlerLine = \"\";\n        var creatorLine = \"\";\n        if (promiseCreated._trace) {\n            var traceLines = promiseCreated._trace.stack.split(\"\\n\");\n            var stack = cleanStack(traceLines);\n            for (var i = stack.length - 1; i >= 0; --i) {\n                var line = stack[i];\n                if (!nodeFramePattern.test(line)) {\n                    var lineMatches = line.match(parseLinePattern);\n                    if (lineMatches) {\n                        handlerLine  = \"at \" + lineMatches[1] +\n                            \":\" + lineMatches[2] + \":\" + lineMatches[3] + \" \";\n                    }\n                    break;\n                }\n            }\n\n            if (stack.length > 0) {\n                var firstUserLine = stack[0];\n                for (var i = 0; i < traceLines.length; ++i) {\n\n                    if (traceLines[i] === firstUserLine) {\n                        if (i > 0) {\n                            creatorLine = \"\\n\" + traceLines[i - 1];\n                        }\n                        break;\n                    }\n                }\n\n            }\n        }\n        var msg = \"a promise was created in a \" + name +\n            \"handler \" + handlerLine + \"but was not returned from it, \" +\n            \"see http://goo.gl/rRqMUw\" +\n            creatorLine;\n        promise._warn(msg, true, promiseCreated);\n    }\n}\n\nfunction deprecated(name, replacement) {\n    var message = name +\n        \" is deprecated and will be removed in a future version.\";\n    if (replacement) message += \" Use \" + replacement + \" instead.\";\n    return warn(message);\n}\n\nfunction warn(message, shouldUseOwnTrace, promise) {\n    if (!config.warnings) return;\n    var warning = new Warning(message);\n    var ctx;\n    if (shouldUseOwnTrace) {\n        promise._attachExtraTrace(warning);\n    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {\n        ctx.attachExtraTrace(warning);\n    } else {\n        var parsed = parseStackAndMessage(warning);\n        warning.stack = parsed.message + \"\\n\" + parsed.stack.join(\"\\n\");\n    }\n\n    if (!activeFireEvent(\"warning\", warning)) {\n        formatAndLogError(warning, \"\", true);\n    }\n}\n\nfunction reconstructStack(message, stacks) {\n    for (var i = 0; i < stacks.length - 1; ++i) {\n        stacks[i].push(\"From previous event:\");\n        stacks[i] = stacks[i].join(\"\\n\");\n    }\n    if (i < stacks.length) {\n        stacks[i] = stacks[i].join(\"\\n\");\n    }\n    return message + \"\\n\" + stacks.join(\"\\n\");\n}\n\nfunction removeDuplicateOrEmptyJumps(stacks) {\n    for (var i = 0; i < stacks.length; ++i) {\n        if (stacks[i].length === 0 ||\n            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {\n            stacks.splice(i, 1);\n            i--;\n        }\n    }\n}\n\nfunction removeCommonRoots(stacks) {\n    var current = stacks[0];\n    for (var i = 1; i < stacks.length; ++i) {\n        var prev = stacks[i];\n        var currentLastIndex = current.length - 1;\n        var currentLastLine = current[currentLastIndex];\n        var commonRootMeetPoint = -1;\n\n        for (var j = prev.length - 1; j >= 0; --j) {\n            if (prev[j] === currentLastLine) {\n                commonRootMeetPoint = j;\n                break;\n            }\n        }\n\n        for (var j = commonRootMeetPoint; j >= 0; --j) {\n            var line = prev[j];\n            if (current[currentLastIndex] === line) {\n                current.pop();\n                currentLastIndex--;\n            } else {\n                break;\n            }\n        }\n        current = prev;\n    }\n}\n\nfunction cleanStack(stack) {\n    var ret = [];\n    for (var i = 0; i < stack.length; ++i) {\n        var line = stack[i];\n        var isTraceLine = \"    (No stack trace)\" === line ||\n            stackFramePattern.test(line);\n        var isInternalFrame = isTraceLine && shouldIgnore(line);\n        if (isTraceLine && !isInternalFrame) {\n            if (indentStackFrames && line.charAt(0) !== \" \") {\n                line = \"    \" + line;\n            }\n            ret.push(line);\n        }\n    }\n    return ret;\n}\n\nfunction stackFramesAsArray(error) {\n    var stack = error.stack.replace(/\\s+$/g, \"\").split(\"\\n\");\n    for (var i = 0; i < stack.length; ++i) {\n        var line = stack[i];\n        if (\"    (No stack trace)\" === line || stackFramePattern.test(line)) {\n            break;\n        }\n    }\n    if (i > 0 && error.name != \"SyntaxError\") {\n        stack = stack.slice(i);\n    }\n    return stack;\n}\n\nfunction parseStackAndMessage(error) {\n    var stack = error.stack;\n    var message = error.toString();\n    stack = typeof stack === \"string\" && stack.length > 0\n                ? stackFramesAsArray(error) : [\"    (No stack trace)\"];\n    return {\n        message: message,\n        stack: error.name == \"SyntaxError\" ? stack : cleanStack(stack)\n    };\n}\n\nfunction formatAndLogError(error, title, isSoft) {\n    if (typeof console !== \"undefined\") {\n        var message;\n        if (util.isObject(error)) {\n            var stack = error.stack;\n            message = title + formatStack(stack, error);\n        } else {\n            message = title + String(error);\n        }\n        if (typeof printWarning === \"function\") {\n            printWarning(message, isSoft);\n        } else if (typeof console.log === \"function\" ||\n            typeof console.log === \"object\") {\n            console.log(message);\n        }\n    }\n}\n\nfunction fireRejectionEvent(name, localHandler, reason, promise) {\n    var localEventFired = false;\n    try {\n        if (typeof localHandler === \"function\") {\n            localEventFired = true;\n            if (name === \"rejectionHandled\") {\n                localHandler(promise);\n            } else {\n                localHandler(reason, promise);\n            }\n        }\n    } catch (e) {\n        async.throwLater(e);\n    }\n\n    if (name === \"unhandledRejection\") {\n        if (!activeFireEvent(name, reason, promise) && !localEventFired) {\n            formatAndLogError(reason, \"Unhandled rejection \");\n        }\n    } else {\n        activeFireEvent(name, promise);\n    }\n}\n\nfunction formatNonError(obj) {\n    var str;\n    if (typeof obj === \"function\") {\n        str = \"[function \" +\n            (obj.name || \"anonymous\") +\n            \"]\";\n    } else {\n        str = obj && typeof obj.toString === \"function\"\n            ? obj.toString() : util.toString(obj);\n        var ruselessToString = /\\[object [a-zA-Z0-9$_]+\\]/;\n        if (ruselessToString.test(str)) {\n            try {\n                var newStr = JSON.stringify(obj);\n                str = newStr;\n            }\n            catch(e) {\n\n            }\n        }\n        if (str.length === 0) {\n            str = \"(empty array)\";\n        }\n    }\n    return (\"(<\" + snip(str) + \">, no stack trace)\");\n}\n\nfunction snip(str) {\n    var maxChars = 41;\n    if (str.length < maxChars) {\n        return str;\n    }\n    return str.substr(0, maxChars - 3) + \"...\";\n}\n\nfunction longStackTracesIsSupported() {\n    return typeof captureStackTrace === \"function\";\n}\n\nvar shouldIgnore = function() { return false; };\nvar parseLineInfoRegex = /[\\/<\\(]([^:\\/]+):(\\d+):(?:\\d+)\\)?\\s*$/;\nfunction parseLineInfo(line) {\n    var matches = line.match(parseLineInfoRegex);\n    if (matches) {\n        return {\n            fileName: matches[1],\n            line: parseInt(matches[2], 10)\n        };\n    }\n}\n\nfunction setBounds(firstLineError, lastLineError) {\n    if (!longStackTracesIsSupported()) return;\n    var firstStackLines = firstLineError.stack.split(\"\\n\");\n    var lastStackLines = lastLineError.stack.split(\"\\n\");\n    var firstIndex = -1;\n    var lastIndex = -1;\n    var firstFileName;\n    var lastFileName;\n    for (var i = 0; i < firstStackLines.length; ++i) {\n        var result = parseLineInfo(firstStackLines[i]);\n        if (result) {\n            firstFileName = result.fileName;\n            firstIndex = result.line;\n            break;\n        }\n    }\n    for (var i = 0; i < lastStackLines.length; ++i) {\n        var result = parseLineInfo(lastStackLines[i]);\n        if (result) {\n            lastFileName = result.fileName;\n            lastIndex = result.line;\n            break;\n        }\n    }\n    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||\n        firstFileName !== lastFileName || firstIndex >= lastIndex) {\n        return;\n    }\n\n    shouldIgnore = function(line) {\n        if (bluebirdFramePattern.test(line)) return true;\n        var info = parseLineInfo(line);\n        if (info) {\n            if (info.fileName === firstFileName &&\n                (firstIndex <= info.line && info.line <= lastIndex)) {\n                return true;\n            }\n        }\n        return false;\n    };\n}\n\nfunction CapturedTrace(parent) {\n    this._parent = parent;\n    this._promisesCreated = 0;\n    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);\n    captureStackTrace(this, CapturedTrace);\n    if (length > 32) this.uncycle();\n}\nutil.inherits(CapturedTrace, Error);\nContext.CapturedTrace = CapturedTrace;\n\nCapturedTrace.prototype.uncycle = function() {\n    var length = this._length;\n    if (length < 2) return;\n    var nodes = [];\n    var stackToIndex = {};\n\n    for (var i = 0, node = this; node !== undefined; ++i) {\n        nodes.push(node);\n        node = node._parent;\n    }\n    length = this._length = i;\n    for (var i = length - 1; i >= 0; --i) {\n        var stack = nodes[i].stack;\n        if (stackToIndex[stack] === undefined) {\n            stackToIndex[stack] = i;\n        }\n    }\n    for (var i = 0; i < length; ++i) {\n        var currentStack = nodes[i].stack;\n        var index = stackToIndex[currentStack];\n        if (index !== undefined && index !== i) {\n            if (index > 0) {\n                nodes[index - 1]._parent = undefined;\n                nodes[index - 1]._length = 1;\n            }\n            nodes[i]._parent = undefined;\n            nodes[i]._length = 1;\n            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;\n\n            if (index < length - 1) {\n                cycleEdgeNode._parent = nodes[index + 1];\n                cycleEdgeNode._parent.uncycle();\n                cycleEdgeNode._length =\n                    cycleEdgeNode._parent._length + 1;\n            } else {\n                cycleEdgeNode._parent = undefined;\n                cycleEdgeNode._length = 1;\n            }\n            var currentChildLength = cycleEdgeNode._length + 1;\n            for (var j = i - 2; j >= 0; --j) {\n                nodes[j]._length = currentChildLength;\n                currentChildLength++;\n            }\n            return;\n        }\n    }\n};\n\nCapturedTrace.prototype.attachExtraTrace = function(error) {\n    if (error.__stackCleaned__) return;\n    this.uncycle();\n    var parsed = parseStackAndMessage(error);\n    var message = parsed.message;\n    var stacks = [parsed.stack];\n\n    var trace = this;\n    while (trace !== undefined) {\n        stacks.push(cleanStack(trace.stack.split(\"\\n\")));\n        trace = trace._parent;\n    }\n    removeCommonRoots(stacks);\n    removeDuplicateOrEmptyJumps(stacks);\n    util.notEnumerableProp(error, \"stack\", reconstructStack(message, stacks));\n    util.notEnumerableProp(error, \"__stackCleaned__\", true);\n};\n\nvar captureStackTrace = (function stackDetection() {\n    var v8stackFramePattern = /^\\s*at\\s*/;\n    var v8stackFormatter = function(stack, error) {\n        if (typeof stack === \"string\") return stack;\n\n        if (error.name !== undefined &&\n            error.message !== undefined) {\n            return error.toString();\n        }\n        return formatNonError(error);\n    };\n\n    if (typeof Error.stackTraceLimit === \"number\" &&\n        typeof Error.captureStackTrace === \"function\") {\n        Error.stackTraceLimit += 6;\n        stackFramePattern = v8stackFramePattern;\n        formatStack = v8stackFormatter;\n        var captureStackTrace = Error.captureStackTrace;\n\n        shouldIgnore = function(line) {\n            return bluebirdFramePattern.test(line);\n        };\n        return function(receiver, ignoreUntil) {\n            Error.stackTraceLimit += 6;\n            captureStackTrace(receiver, ignoreUntil);\n            Error.stackTraceLimit -= 6;\n        };\n    }\n    var err = new Error();\n\n    if (typeof err.stack === \"string\" &&\n        err.stack.split(\"\\n\")[0].indexOf(\"stackDetection@\") >= 0) {\n        stackFramePattern = /@/;\n        formatStack = v8stackFormatter;\n        indentStackFrames = true;\n        return function captureStackTrace(o) {\n            o.stack = new Error().stack;\n        };\n    }\n\n    var hasStackAfterThrow;\n    try { throw new Error(); }\n    catch(e) {\n        hasStackAfterThrow = (\"stack\" in e);\n    }\n    if (!(\"stack\" in err) && hasStackAfterThrow &&\n        typeof Error.stackTraceLimit === \"number\") {\n        stackFramePattern = v8stackFramePattern;\n        formatStack = v8stackFormatter;\n        return function captureStackTrace(o) {\n            Error.stackTraceLimit += 6;\n            try { throw new Error(); }\n            catch(e) { o.stack = e.stack; }\n            Error.stackTraceLimit -= 6;\n        };\n    }\n\n    formatStack = function(stack, error) {\n        if (typeof stack === \"string\") return stack;\n\n        if ((typeof error === \"object\" ||\n            typeof error === \"function\") &&\n            error.name !== undefined &&\n            error.message !== undefined) {\n            return error.toString();\n        }\n        return formatNonError(error);\n    };\n\n    return null;\n\n})([]);\n\nif (typeof console !== \"undefined\" && typeof console.warn !== \"undefined\") {\n    printWarning = function (message) {\n        console.warn(message);\n    };\n    if (util.isNode && process.stderr.isTTY) {\n        printWarning = function(message, isSoft) {\n            var color = isSoft ? \"\\u001b[33m\" : \"\\u001b[31m\";\n            console.warn(color + message + \"\\u001b[0m\\n\");\n        };\n    } else if (!util.isNode && typeof (new Error().stack) === \"string\") {\n        printWarning = function(message, isSoft) {\n            console.warn(\"%c\" + message,\n                        isSoft ? \"color: darkorange\" : \"color: red\");\n        };\n    }\n}\n\nvar config = {\n    warnings: warnings,\n    longStackTraces: false,\n    cancellation: false,\n    monitoring: false\n};\n\nif (longStackTraces) Promise.longStackTraces();\n\nreturn {\n    longStackTraces: function() {\n        return config.longStackTraces;\n    },\n    warnings: function() {\n        return config.warnings;\n    },\n    cancellation: function() {\n        return config.cancellation;\n    },\n    monitoring: function() {\n        return config.monitoring;\n    },\n    propagateFromFunction: function() {\n        return propagateFromFunction;\n    },\n    boundValueFunction: function() {\n        return boundValueFunction;\n    },\n    checkForgottenReturns: checkForgottenReturns,\n    setBounds: setBounds,\n    warn: warn,\n    deprecated: deprecated,\n    CapturedTrace: CapturedTrace,\n    fireDomEvent: fireDomEvent,\n    fireGlobalEvent: fireGlobalEvent\n};\n};\n\n},{\"./errors\":12,\"./util\":36}],10:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise) {\nfunction returner() {\n    return this.value;\n}\nfunction thrower() {\n    throw this.reason;\n}\n\nPromise.prototype[\"return\"] =\nPromise.prototype.thenReturn = function (value) {\n    if (value instanceof Promise) value.suppressUnhandledRejections();\n    return this._then(\n        returner, undefined, undefined, {value: value}, undefined);\n};\n\nPromise.prototype[\"throw\"] =\nPromise.prototype.thenThrow = function (reason) {\n    return this._then(\n        thrower, undefined, undefined, {reason: reason}, undefined);\n};\n\nPromise.prototype.catchThrow = function (reason) {\n    if (arguments.length <= 1) {\n        return this._then(\n            undefined, thrower, undefined, {reason: reason}, undefined);\n    } else {\n        var _reason = arguments[1];\n        var handler = function() {throw _reason;};\n        return this.caught(reason, handler);\n    }\n};\n\nPromise.prototype.catchReturn = function (value) {\n    if (arguments.length <= 1) {\n        if (value instanceof Promise) value.suppressUnhandledRejections();\n        return this._then(\n            undefined, returner, undefined, {value: value}, undefined);\n    } else {\n        var _value = arguments[1];\n        if (_value instanceof Promise) _value.suppressUnhandledRejections();\n        var handler = function() {return _value;};\n        return this.caught(value, handler);\n    }\n};\n};\n\n},{}],11:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, INTERNAL) {\nvar PromiseReduce = Promise.reduce;\nvar PromiseAll = Promise.all;\n\nfunction promiseAllThis() {\n    return PromiseAll(this);\n}\n\nfunction PromiseMapSeries(promises, fn) {\n    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);\n}\n\nPromise.prototype.each = function (fn) {\n    return PromiseReduce(this, fn, INTERNAL, 0)\n              ._then(promiseAllThis, undefined, undefined, this, undefined);\n};\n\nPromise.prototype.mapSeries = function (fn) {\n    return PromiseReduce(this, fn, INTERNAL, INTERNAL);\n};\n\nPromise.each = function (promises, fn) {\n    return PromiseReduce(promises, fn, INTERNAL, 0)\n              ._then(promiseAllThis, undefined, undefined, promises, undefined);\n};\n\nPromise.mapSeries = PromiseMapSeries;\n};\n\n\n},{}],12:[function(_dereq_,module,exports){\n\"use strict\";\nvar es5 = _dereq_(\"./es5\");\nvar Objectfreeze = es5.freeze;\nvar util = _dereq_(\"./util\");\nvar inherits = util.inherits;\nvar notEnumerableProp = util.notEnumerableProp;\n\nfunction subError(nameProperty, defaultMessage) {\n    function SubError(message) {\n        if (!(this instanceof SubError)) return new SubError(message);\n        notEnumerableProp(this, \"message\",\n            typeof message === \"string\" ? message : defaultMessage);\n        notEnumerableProp(this, \"name\", nameProperty);\n        if (Error.captureStackTrace) {\n            Error.captureStackTrace(this, this.constructor);\n        } else {\n            Error.call(this);\n        }\n    }\n    inherits(SubError, Error);\n    return SubError;\n}\n\nvar _TypeError, _RangeError;\nvar Warning = subError(\"Warning\", \"warning\");\nvar CancellationError = subError(\"CancellationError\", \"cancellation error\");\nvar TimeoutError = subError(\"TimeoutError\", \"timeout error\");\nvar AggregateError = subError(\"AggregateError\", \"aggregate error\");\ntry {\n    _TypeError = TypeError;\n    _RangeError = RangeError;\n} catch(e) {\n    _TypeError = subError(\"TypeError\", \"type error\");\n    _RangeError = subError(\"RangeError\", \"range error\");\n}\n\nvar methods = (\"join pop push shift unshift slice filter forEach some \" +\n    \"every map indexOf lastIndexOf reduce reduceRight sort reverse\").split(\" \");\n\nfor (var i = 0; i < methods.length; ++i) {\n    if (typeof Array.prototype[methods[i]] === \"function\") {\n        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];\n    }\n}\n\nes5.defineProperty(AggregateError.prototype, \"length\", {\n    value: 0,\n    configurable: false,\n    writable: true,\n    enumerable: true\n});\nAggregateError.prototype[\"isOperational\"] = true;\nvar level = 0;\nAggregateError.prototype.toString = function() {\n    var indent = Array(level * 4 + 1).join(\" \");\n    var ret = \"\\n\" + indent + \"AggregateError of:\" + \"\\n\";\n    level++;\n    indent = Array(level * 4 + 1).join(\" \");\n    for (var i = 0; i < this.length; ++i) {\n        var str = this[i] === this ? \"[Circular AggregateError]\" : this[i] + \"\";\n        var lines = str.split(\"\\n\");\n        for (var j = 0; j < lines.length; ++j) {\n            lines[j] = indent + lines[j];\n        }\n        str = lines.join(\"\\n\");\n        ret += str + \"\\n\";\n    }\n    level--;\n    return ret;\n};\n\nfunction OperationalError(message) {\n    if (!(this instanceof OperationalError))\n        return new OperationalError(message);\n    notEnumerableProp(this, \"name\", \"OperationalError\");\n    notEnumerableProp(this, \"message\", message);\n    this.cause = message;\n    this[\"isOperational\"] = true;\n\n    if (message instanceof Error) {\n        notEnumerableProp(this, \"message\", message.message);\n        notEnumerableProp(this, \"stack\", message.stack);\n    } else if (Error.captureStackTrace) {\n        Error.captureStackTrace(this, this.constructor);\n    }\n\n}\ninherits(OperationalError, Error);\n\nvar errorTypes = Error[\"__BluebirdErrorTypes__\"];\nif (!errorTypes) {\n    errorTypes = Objectfreeze({\n        CancellationError: CancellationError,\n        TimeoutError: TimeoutError,\n        OperationalError: OperationalError,\n        RejectionError: OperationalError,\n        AggregateError: AggregateError\n    });\n    es5.defineProperty(Error, \"__BluebirdErrorTypes__\", {\n        value: errorTypes,\n        writable: false,\n        enumerable: false,\n        configurable: false\n    });\n}\n\nmodule.exports = {\n    Error: Error,\n    TypeError: _TypeError,\n    RangeError: _RangeError,\n    CancellationError: errorTypes.CancellationError,\n    OperationalError: errorTypes.OperationalError,\n    TimeoutError: errorTypes.TimeoutError,\n    AggregateError: errorTypes.AggregateError,\n    Warning: Warning\n};\n\n},{\"./es5\":13,\"./util\":36}],13:[function(_dereq_,module,exports){\nvar isES5 = (function(){\n    \"use strict\";\n    return this === undefined;\n})();\n\nif (isES5) {\n    module.exports = {\n        freeze: Object.freeze,\n        defineProperty: Object.defineProperty,\n        getDescriptor: Object.getOwnPropertyDescriptor,\n        keys: Object.keys,\n        names: Object.getOwnPropertyNames,\n        getPrototypeOf: Object.getPrototypeOf,\n        isArray: Array.isArray,\n        isES5: isES5,\n        propertyIsWritable: function(obj, prop) {\n            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);\n            return !!(!descriptor || descriptor.writable || descriptor.set);\n        }\n    };\n} else {\n    var has = {}.hasOwnProperty;\n    var str = {}.toString;\n    var proto = {}.constructor.prototype;\n\n    var ObjectKeys = function (o) {\n        var ret = [];\n        for (var key in o) {\n            if (has.call(o, key)) {\n                ret.push(key);\n            }\n        }\n        return ret;\n    };\n\n    var ObjectGetDescriptor = function(o, key) {\n        return {value: o[key]};\n    };\n\n    var ObjectDefineProperty = function (o, key, desc) {\n        o[key] = desc.value;\n        return o;\n    };\n\n    var ObjectFreeze = function (obj) {\n        return obj;\n    };\n\n    var ObjectGetPrototypeOf = function (obj) {\n        try {\n            return Object(obj).constructor.prototype;\n        }\n        catch (e) {\n            return proto;\n        }\n    };\n\n    var ArrayIsArray = function (obj) {\n        try {\n            return str.call(obj) === \"[object Array]\";\n        }\n        catch(e) {\n            return false;\n        }\n    };\n\n    module.exports = {\n        isArray: ArrayIsArray,\n        keys: ObjectKeys,\n        names: ObjectKeys,\n        defineProperty: ObjectDefineProperty,\n        getDescriptor: ObjectGetDescriptor,\n        freeze: ObjectFreeze,\n        getPrototypeOf: ObjectGetPrototypeOf,\n        isES5: isES5,\n        propertyIsWritable: function() {\n            return true;\n        }\n    };\n}\n\n},{}],14:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, INTERNAL) {\nvar PromiseMap = Promise.map;\n\nPromise.prototype.filter = function (fn, options) {\n    return PromiseMap(this, fn, options, INTERNAL);\n};\n\nPromise.filter = function (promises, fn, options) {\n    return PromiseMap(promises, fn, options, INTERNAL);\n};\n};\n\n},{}],15:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {\nvar util = _dereq_(\"./util\");\nvar CancellationError = Promise.CancellationError;\nvar errorObj = util.errorObj;\nvar catchFilter = _dereq_(\"./catch_filter\")(NEXT_FILTER);\n\nfunction PassThroughHandlerContext(promise, type, handler) {\n    this.promise = promise;\n    this.type = type;\n    this.handler = handler;\n    this.called = false;\n    this.cancelPromise = null;\n}\n\nPassThroughHandlerContext.prototype.isFinallyHandler = function() {\n    return this.type === 0;\n};\n\nfunction FinallyHandlerCancelReaction(finallyHandler) {\n    this.finallyHandler = finallyHandler;\n}\n\nFinallyHandlerCancelReaction.prototype._resultCancelled = function() {\n    checkCancel(this.finallyHandler);\n};\n\nfunction checkCancel(ctx, reason) {\n    if (ctx.cancelPromise != null) {\n        if (arguments.length > 1) {\n            ctx.cancelPromise._reject(reason);\n        } else {\n            ctx.cancelPromise._cancel();\n        }\n        ctx.cancelPromise = null;\n        return true;\n    }\n    return false;\n}\n\nfunction succeed() {\n    return finallyHandler.call(this, this.promise._target()._settledValue());\n}\nfunction fail(reason) {\n    if (checkCancel(this, reason)) return;\n    errorObj.e = reason;\n    return errorObj;\n}\nfunction finallyHandler(reasonOrValue) {\n    var promise = this.promise;\n    var handler = this.handler;\n\n    if (!this.called) {\n        this.called = true;\n        var ret = this.isFinallyHandler()\n            ? handler.call(promise._boundValue())\n            : handler.call(promise._boundValue(), reasonOrValue);\n        if (ret === NEXT_FILTER) {\n            return ret;\n        } else if (ret !== undefined) {\n            promise._setReturnedNonUndefined();\n            var maybePromise = tryConvertToPromise(ret, promise);\n            if (maybePromise instanceof Promise) {\n                if (this.cancelPromise != null) {\n                    if (maybePromise._isCancelled()) {\n                        var reason =\n                            new CancellationError(\"late cancellation observer\");\n                        promise._attachExtraTrace(reason);\n                        errorObj.e = reason;\n                        return errorObj;\n                    } else if (maybePromise.isPending()) {\n                        maybePromise._attachCancellationCallback(\n                            new FinallyHandlerCancelReaction(this));\n                    }\n                }\n                return maybePromise._then(\n                    succeed, fail, undefined, this, undefined);\n            }\n        }\n    }\n\n    if (promise.isRejected()) {\n        checkCancel(this);\n        errorObj.e = reasonOrValue;\n        return errorObj;\n    } else {\n        checkCancel(this);\n        return reasonOrValue;\n    }\n}\n\nPromise.prototype._passThrough = function(handler, type, success, fail) {\n    if (typeof handler !== \"function\") return this.then();\n    return this._then(success,\n                      fail,\n                      undefined,\n                      new PassThroughHandlerContext(this, type, handler),\n                      undefined);\n};\n\nPromise.prototype.lastly =\nPromise.prototype[\"finally\"] = function (handler) {\n    return this._passThrough(handler,\n                             0,\n                             finallyHandler,\n                             finallyHandler);\n};\n\n\nPromise.prototype.tap = function (handler) {\n    return this._passThrough(handler, 1, finallyHandler);\n};\n\nPromise.prototype.tapCatch = function (handlerOrPredicate) {\n    var len = arguments.length;\n    if(len === 1) {\n        return this._passThrough(handlerOrPredicate,\n                                 1,\n                                 undefined,\n                                 finallyHandler);\n    } else {\n         var catchInstances = new Array(len - 1),\n            j = 0, i;\n        for (i = 0; i < len - 1; ++i) {\n            var item = arguments[i];\n            if (util.isObject(item)) {\n                catchInstances[j++] = item;\n            } else {\n                return Promise.reject(new TypeError(\n                    \"tapCatch statement predicate: \"\n                    + \"expecting an object but got \" + util.classString(item)\n                ));\n            }\n        }\n        catchInstances.length = j;\n        var handler = arguments[i];\n        return this._passThrough(catchFilter(catchInstances, handler, this),\n                                 1,\n                                 undefined,\n                                 finallyHandler);\n    }\n\n};\n\nreturn PassThroughHandlerContext;\n};\n\n},{\"./catch_filter\":7,\"./util\":36}],16:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise,\n                          apiRejection,\n                          INTERNAL,\n                          tryConvertToPromise,\n                          Proxyable,\n                          debug) {\nvar errors = _dereq_(\"./errors\");\nvar TypeError = errors.TypeError;\nvar util = _dereq_(\"./util\");\nvar errorObj = util.errorObj;\nvar tryCatch = util.tryCatch;\nvar yieldHandlers = [];\n\nfunction promiseFromYieldHandler(value, yieldHandlers, traceParent) {\n    for (var i = 0; i < yieldHandlers.length; ++i) {\n        traceParent._pushContext();\n        var result = tryCatch(yieldHandlers[i])(value);\n        traceParent._popContext();\n        if (result === errorObj) {\n            traceParent._pushContext();\n            var ret = Promise.reject(errorObj.e);\n            traceParent._popContext();\n            return ret;\n        }\n        var maybePromise = tryConvertToPromise(result, traceParent);\n        if (maybePromise instanceof Promise) return maybePromise;\n    }\n    return null;\n}\n\nfunction PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {\n    if (debug.cancellation()) {\n        var internal = new Promise(INTERNAL);\n        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);\n        this._promise = internal.lastly(function() {\n            return _finallyPromise;\n        });\n        internal._captureStackTrace();\n        internal._setOnCancel(this);\n    } else {\n        var promise = this._promise = new Promise(INTERNAL);\n        promise._captureStackTrace();\n    }\n    this._stack = stack;\n    this._generatorFunction = generatorFunction;\n    this._receiver = receiver;\n    this._generator = undefined;\n    this._yieldHandlers = typeof yieldHandler === \"function\"\n        ? [yieldHandler].concat(yieldHandlers)\n        : yieldHandlers;\n    this._yieldedPromise = null;\n    this._cancellationPhase = false;\n}\nutil.inherits(PromiseSpawn, Proxyable);\n\nPromiseSpawn.prototype._isResolved = function() {\n    return this._promise === null;\n};\n\nPromiseSpawn.prototype._cleanup = function() {\n    this._promise = this._generator = null;\n    if (debug.cancellation() && this._finallyPromise !== null) {\n        this._finallyPromise._fulfill();\n        this._finallyPromise = null;\n    }\n};\n\nPromiseSpawn.prototype._promiseCancelled = function() {\n    if (this._isResolved()) return;\n    var implementsReturn = typeof this._generator[\"return\"] !== \"undefined\";\n\n    var result;\n    if (!implementsReturn) {\n        var reason = new Promise.CancellationError(\n            \"generator .return() sentinel\");\n        Promise.coroutine.returnSentinel = reason;\n        this._promise._attachExtraTrace(reason);\n        this._promise._pushContext();\n        result = tryCatch(this._generator[\"throw\"]).call(this._generator,\n                                                         reason);\n        this._promise._popContext();\n    } else {\n        this._promise._pushContext();\n        result = tryCatch(this._generator[\"return\"]).call(this._generator,\n                                                          undefined);\n        this._promise._popContext();\n    }\n    this._cancellationPhase = true;\n    this._yieldedPromise = null;\n    this._continue(result);\n};\n\nPromiseSpawn.prototype._promiseFulfilled = function(value) {\n    this._yieldedPromise = null;\n    this._promise._pushContext();\n    var result = tryCatch(this._generator.next).call(this._generator, value);\n    this._promise._popContext();\n    this._continue(result);\n};\n\nPromiseSpawn.prototype._promiseRejected = function(reason) {\n    this._yieldedPromise = null;\n    this._promise._attachExtraTrace(reason);\n    this._promise._pushContext();\n    var result = tryCatch(this._generator[\"throw\"])\n        .call(this._generator, reason);\n    this._promise._popContext();\n    this._continue(result);\n};\n\nPromiseSpawn.prototype._resultCancelled = function() {\n    if (this._yieldedPromise instanceof Promise) {\n        var promise = this._yieldedPromise;\n        this._yieldedPromise = null;\n        promise.cancel();\n    }\n};\n\nPromiseSpawn.prototype.promise = function () {\n    return this._promise;\n};\n\nPromiseSpawn.prototype._run = function () {\n    this._generator = this._generatorFunction.call(this._receiver);\n    this._receiver =\n        this._generatorFunction = undefined;\n    this._promiseFulfilled(undefined);\n};\n\nPromiseSpawn.prototype._continue = function (result) {\n    var promise = this._promise;\n    if (result === errorObj) {\n        this._cleanup();\n        if (this._cancellationPhase) {\n            return promise.cancel();\n        } else {\n            return promise._rejectCallback(result.e, false);\n        }\n    }\n\n    var value = result.value;\n    if (result.done === true) {\n        this._cleanup();\n        if (this._cancellationPhase) {\n            return promise.cancel();\n        } else {\n            return promise._resolveCallback(value);\n        }\n    } else {\n        var maybePromise = tryConvertToPromise(value, this._promise);\n        if (!(maybePromise instanceof Promise)) {\n            maybePromise =\n                promiseFromYieldHandler(maybePromise,\n                                        this._yieldHandlers,\n                                        this._promise);\n            if (maybePromise === null) {\n                this._promiseRejected(\n                    new TypeError(\n                        \"A value %s was yielded that could not be treated as a promise\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\\u000a\".replace(\"%s\", String(value)) +\n                        \"From coroutine:\\u000a\" +\n                        this._stack.split(\"\\n\").slice(1, -7).join(\"\\n\")\n                    )\n                );\n                return;\n            }\n        }\n        maybePromise = maybePromise._target();\n        var bitField = maybePromise._bitField;\n        ;\n        if (((bitField & 50397184) === 0)) {\n            this._yieldedPromise = maybePromise;\n            maybePromise._proxy(this, null);\n        } else if (((bitField & 33554432) !== 0)) {\n            Promise._async.invoke(\n                this._promiseFulfilled, this, maybePromise._value()\n            );\n        } else if (((bitField & 16777216) !== 0)) {\n            Promise._async.invoke(\n                this._promiseRejected, this, maybePromise._reason()\n            );\n        } else {\n            this._promiseCancelled();\n        }\n    }\n};\n\nPromise.coroutine = function (generatorFunction, options) {\n    if (typeof generatorFunction !== \"function\") {\n        throw new TypeError(\"generatorFunction must be a function\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n    var yieldHandler = Object(options).yieldHandler;\n    var PromiseSpawn$ = PromiseSpawn;\n    var stack = new Error().stack;\n    return function () {\n        var generator = generatorFunction.apply(this, arguments);\n        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,\n                                      stack);\n        var ret = spawn.promise();\n        spawn._generator = generator;\n        spawn._promiseFulfilled(undefined);\n        return ret;\n    };\n};\n\nPromise.coroutine.addYieldHandler = function(fn) {\n    if (typeof fn !== \"function\") {\n        throw new TypeError(\"expecting a function but got \" + util.classString(fn));\n    }\n    yieldHandlers.push(fn);\n};\n\nPromise.spawn = function (generatorFunction) {\n    debug.deprecated(\"Promise.spawn()\", \"Promise.coroutine()\");\n    if (typeof generatorFunction !== \"function\") {\n        return apiRejection(\"generatorFunction must be a function\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n    var spawn = new PromiseSpawn(generatorFunction, this);\n    var ret = spawn.promise();\n    spawn._run(Promise.spawn);\n    return ret;\n};\n};\n\n},{\"./errors\":12,\"./util\":36}],17:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports =\nfunction(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,\n         getDomain) {\nvar util = _dereq_(\"./util\");\nvar canEvaluate = util.canEvaluate;\nvar tryCatch = util.tryCatch;\nvar errorObj = util.errorObj;\nvar reject;\n\nif (false) {\nif (canEvaluate) {\n    var thenCallback = function(i) {\n        return new Function(\"value\", \"holder\", \"                             \\n\\\n            'use strict';                                                    \\n\\\n            holder.pIndex = value;                                           \\n\\\n            holder.checkFulfillment(this);                                   \\n\\\n            \".replace(/Index/g, i));\n    };\n\n    var promiseSetter = function(i) {\n        return new Function(\"promise\", \"holder\", \"                           \\n\\\n            'use strict';                                                    \\n\\\n            holder.pIndex = promise;                                         \\n\\\n            \".replace(/Index/g, i));\n    };\n\n    var generateHolderClass = function(total) {\n        var props = new Array(total);\n        for (var i = 0; i < props.length; ++i) {\n            props[i] = \"this.p\" + (i+1);\n        }\n        var assignment = props.join(\" = \") + \" = null;\";\n        var cancellationCode= \"var promise;\\n\" + props.map(function(prop) {\n            return \"                                                         \\n\\\n                promise = \" + prop + \";                                      \\n\\\n                if (promise instanceof Promise) {                            \\n\\\n                    promise.cancel();                                        \\n\\\n                }                                                            \\n\\\n            \";\n        }).join(\"\\n\");\n        var passedArguments = props.join(\", \");\n        var name = \"Holder$\" + total;\n\n\n        var code = \"return function(tryCatch, errorObj, Promise, async) {    \\n\\\n            'use strict';                                                    \\n\\\n            function [TheName](fn) {                                         \\n\\\n                [TheProperties]                                              \\n\\\n                this.fn = fn;                                                \\n\\\n                this.asyncNeeded = true;                                     \\n\\\n                this.now = 0;                                                \\n\\\n            }                                                                \\n\\\n                                                                             \\n\\\n            [TheName].prototype._callFunction = function(promise) {          \\n\\\n                promise._pushContext();                                      \\n\\\n                var ret = tryCatch(this.fn)([ThePassedArguments]);           \\n\\\n                promise._popContext();                                       \\n\\\n                if (ret === errorObj) {                                      \\n\\\n                    promise._rejectCallback(ret.e, false);                   \\n\\\n                } else {                                                     \\n\\\n                    promise._resolveCallback(ret);                           \\n\\\n                }                                                            \\n\\\n            };                                                               \\n\\\n                                                                             \\n\\\n            [TheName].prototype.checkFulfillment = function(promise) {       \\n\\\n                var now = ++this.now;                                        \\n\\\n                if (now === [TheTotal]) {                                    \\n\\\n                    if (this.asyncNeeded) {                                  \\n\\\n                        async.invoke(this._callFunction, this, promise);     \\n\\\n                    } else {                                                 \\n\\\n                        this._callFunction(promise);                         \\n\\\n                    }                                                        \\n\\\n                                                                             \\n\\\n                }                                                            \\n\\\n            };                                                               \\n\\\n                                                                             \\n\\\n            [TheName].prototype._resultCancelled = function() {              \\n\\\n                [CancellationCode]                                           \\n\\\n            };                                                               \\n\\\n                                                                             \\n\\\n            return [TheName];                                                \\n\\\n        }(tryCatch, errorObj, Promise, async);                               \\n\\\n        \";\n\n        code = code.replace(/\\[TheName\\]/g, name)\n            .replace(/\\[TheTotal\\]/g, total)\n            .replace(/\\[ThePassedArguments\\]/g, passedArguments)\n            .replace(/\\[TheProperties\\]/g, assignment)\n            .replace(/\\[CancellationCode\\]/g, cancellationCode);\n\n        return new Function(\"tryCatch\", \"errorObj\", \"Promise\", \"async\", code)\n                           (tryCatch, errorObj, Promise, async);\n    };\n\n    var holderClasses = [];\n    var thenCallbacks = [];\n    var promiseSetters = [];\n\n    for (var i = 0; i < 8; ++i) {\n        holderClasses.push(generateHolderClass(i + 1));\n        thenCallbacks.push(thenCallback(i + 1));\n        promiseSetters.push(promiseSetter(i + 1));\n    }\n\n    reject = function (reason) {\n        this._reject(reason);\n    };\n}}\n\nPromise.join = function () {\n    var last = arguments.length - 1;\n    var fn;\n    if (last > 0 && typeof arguments[last] === \"function\") {\n        fn = arguments[last];\n        if (false) {\n            if (last <= 8 && canEvaluate) {\n                var ret = new Promise(INTERNAL);\n                ret._captureStackTrace();\n                var HolderClass = holderClasses[last - 1];\n                var holder = new HolderClass(fn);\n                var callbacks = thenCallbacks;\n\n                for (var i = 0; i < last; ++i) {\n                    var maybePromise = tryConvertToPromise(arguments[i], ret);\n                    if (maybePromise instanceof Promise) {\n                        maybePromise = maybePromise._target();\n                        var bitField = maybePromise._bitField;\n                        ;\n                        if (((bitField & 50397184) === 0)) {\n                            maybePromise._then(callbacks[i], reject,\n                                               undefined, ret, holder);\n                            promiseSetters[i](maybePromise, holder);\n                            holder.asyncNeeded = false;\n                        } else if (((bitField & 33554432) !== 0)) {\n                            callbacks[i].call(ret,\n                                              maybePromise._value(), holder);\n                        } else if (((bitField & 16777216) !== 0)) {\n                            ret._reject(maybePromise._reason());\n                        } else {\n                            ret._cancel();\n                        }\n                    } else {\n                        callbacks[i].call(ret, maybePromise, holder);\n                    }\n                }\n\n                if (!ret._isFateSealed()) {\n                    if (holder.asyncNeeded) {\n                        var domain = getDomain();\n                        if (domain !== null) {\n                            holder.fn = util.domainBind(domain, holder.fn);\n                        }\n                    }\n                    ret._setAsyncGuaranteed();\n                    ret._setOnCancel(holder);\n                }\n                return ret;\n            }\n        }\n    }\n    var args = [].slice.call(arguments);;\n    if (fn) args.pop();\n    var ret = new PromiseArray(args).promise();\n    return fn !== undefined ? ret.spread(fn) : ret;\n};\n\n};\n\n},{\"./util\":36}],18:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise,\n                          PromiseArray,\n                          apiRejection,\n                          tryConvertToPromise,\n                          INTERNAL,\n                          debug) {\nvar getDomain = Promise._getDomain;\nvar util = _dereq_(\"./util\");\nvar tryCatch = util.tryCatch;\nvar errorObj = util.errorObj;\nvar async = Promise._async;\n\nfunction MappingPromiseArray(promises, fn, limit, _filter) {\n    this.constructor$(promises);\n    this._promise._captureStackTrace();\n    var domain = getDomain();\n    this._callback = domain === null ? fn : util.domainBind(domain, fn);\n    this._preservedValues = _filter === INTERNAL\n        ? new Array(this.length())\n        : null;\n    this._limit = limit;\n    this._inFlight = 0;\n    this._queue = [];\n    async.invoke(this._asyncInit, this, undefined);\n}\nutil.inherits(MappingPromiseArray, PromiseArray);\n\nMappingPromiseArray.prototype._asyncInit = function() {\n    this._init$(undefined, -2);\n};\n\nMappingPromiseArray.prototype._init = function () {};\n\nMappingPromiseArray.prototype._promiseFulfilled = function (value, index) {\n    var values = this._values;\n    var length = this.length();\n    var preservedValues = this._preservedValues;\n    var limit = this._limit;\n\n    if (index < 0) {\n        index = (index * -1) - 1;\n        values[index] = value;\n        if (limit >= 1) {\n            this._inFlight--;\n            this._drainQueue();\n            if (this._isResolved()) return true;\n        }\n    } else {\n        if (limit >= 1 && this._inFlight >= limit) {\n            values[index] = value;\n            this._queue.push(index);\n            return false;\n        }\n        if (preservedValues !== null) preservedValues[index] = value;\n\n        var promise = this._promise;\n        var callback = this._callback;\n        var receiver = promise._boundValue();\n        promise._pushContext();\n        var ret = tryCatch(callback).call(receiver, value, index, length);\n        var promiseCreated = promise._popContext();\n        debug.checkForgottenReturns(\n            ret,\n            promiseCreated,\n            preservedValues !== null ? \"Promise.filter\" : \"Promise.map\",\n            promise\n        );\n        if (ret === errorObj) {\n            this._reject(ret.e);\n            return true;\n        }\n\n        var maybePromise = tryConvertToPromise(ret, this._promise);\n        if (maybePromise instanceof Promise) {\n            maybePromise = maybePromise._target();\n            var bitField = maybePromise._bitField;\n            ;\n            if (((bitField & 50397184) === 0)) {\n                if (limit >= 1) this._inFlight++;\n                values[index] = maybePromise;\n                maybePromise._proxy(this, (index + 1) * -1);\n                return false;\n            } else if (((bitField & 33554432) !== 0)) {\n                ret = maybePromise._value();\n            } else if (((bitField & 16777216) !== 0)) {\n                this._reject(maybePromise._reason());\n                return true;\n            } else {\n                this._cancel();\n                return true;\n            }\n        }\n        values[index] = ret;\n    }\n    var totalResolved = ++this._totalResolved;\n    if (totalResolved >= length) {\n        if (preservedValues !== null) {\n            this._filter(values, preservedValues);\n        } else {\n            this._resolve(values);\n        }\n        return true;\n    }\n    return false;\n};\n\nMappingPromiseArray.prototype._drainQueue = function () {\n    var queue = this._queue;\n    var limit = this._limit;\n    var values = this._values;\n    while (queue.length > 0 && this._inFlight < limit) {\n        if (this._isResolved()) return;\n        var index = queue.pop();\n        this._promiseFulfilled(values[index], index);\n    }\n};\n\nMappingPromiseArray.prototype._filter = function (booleans, values) {\n    var len = values.length;\n    var ret = new Array(len);\n    var j = 0;\n    for (var i = 0; i < len; ++i) {\n        if (booleans[i]) ret[j++] = values[i];\n    }\n    ret.length = j;\n    this._resolve(ret);\n};\n\nMappingPromiseArray.prototype.preservedValues = function () {\n    return this._preservedValues;\n};\n\nfunction map(promises, fn, options, _filter) {\n    if (typeof fn !== \"function\") {\n        return apiRejection(\"expecting a function but got \" + util.classString(fn));\n    }\n\n    var limit = 0;\n    if (options !== undefined) {\n        if (typeof options === \"object\" && options !== null) {\n            if (typeof options.concurrency !== \"number\") {\n                return Promise.reject(\n                    new TypeError(\"'concurrency' must be a number but it is \" +\n                                    util.classString(options.concurrency)));\n            }\n            limit = options.concurrency;\n        } else {\n            return Promise.reject(new TypeError(\n                            \"options argument must be an object but it is \" +\n                             util.classString(options)));\n        }\n    }\n    limit = typeof limit === \"number\" &&\n        isFinite(limit) && limit >= 1 ? limit : 0;\n    return new MappingPromiseArray(promises, fn, limit, _filter).promise();\n}\n\nPromise.prototype.map = function (fn, options) {\n    return map(this, fn, options, null);\n};\n\nPromise.map = function (promises, fn, options, _filter) {\n    return map(promises, fn, options, _filter);\n};\n\n\n};\n\n},{\"./util\":36}],19:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports =\nfunction(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {\nvar util = _dereq_(\"./util\");\nvar tryCatch = util.tryCatch;\n\nPromise.method = function (fn) {\n    if (typeof fn !== \"function\") {\n        throw new Promise.TypeError(\"expecting a function but got \" + util.classString(fn));\n    }\n    return function () {\n        var ret = new Promise(INTERNAL);\n        ret._captureStackTrace();\n        ret._pushContext();\n        var value = tryCatch(fn).apply(this, arguments);\n        var promiseCreated = ret._popContext();\n        debug.checkForgottenReturns(\n            value, promiseCreated, \"Promise.method\", ret);\n        ret._resolveFromSyncValue(value);\n        return ret;\n    };\n};\n\nPromise.attempt = Promise[\"try\"] = function (fn) {\n    if (typeof fn !== \"function\") {\n        return apiRejection(\"expecting a function but got \" + util.classString(fn));\n    }\n    var ret = new Promise(INTERNAL);\n    ret._captureStackTrace();\n    ret._pushContext();\n    var value;\n    if (arguments.length > 1) {\n        debug.deprecated(\"calling Promise.try with more than 1 argument\");\n        var arg = arguments[1];\n        var ctx = arguments[2];\n        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)\n                                  : tryCatch(fn).call(ctx, arg);\n    } else {\n        value = tryCatch(fn)();\n    }\n    var promiseCreated = ret._popContext();\n    debug.checkForgottenReturns(\n        value, promiseCreated, \"Promise.try\", ret);\n    ret._resolveFromSyncValue(value);\n    return ret;\n};\n\nPromise.prototype._resolveFromSyncValue = function (value) {\n    if (value === util.errorObj) {\n        this._rejectCallback(value.e, false);\n    } else {\n        this._resolveCallback(value, true);\n    }\n};\n};\n\n},{\"./util\":36}],20:[function(_dereq_,module,exports){\n\"use strict\";\nvar util = _dereq_(\"./util\");\nvar maybeWrapAsError = util.maybeWrapAsError;\nvar errors = _dereq_(\"./errors\");\nvar OperationalError = errors.OperationalError;\nvar es5 = _dereq_(\"./es5\");\n\nfunction isUntypedError(obj) {\n    return obj instanceof Error &&\n        es5.getPrototypeOf(obj) === Error.prototype;\n}\n\nvar rErrorKey = /^(?:name|message|stack|cause)$/;\nfunction wrapAsOperationalError(obj) {\n    var ret;\n    if (isUntypedError(obj)) {\n        ret = new OperationalError(obj);\n        ret.name = obj.name;\n        ret.message = obj.message;\n        ret.stack = obj.stack;\n        var keys = es5.keys(obj);\n        for (var i = 0; i < keys.length; ++i) {\n            var key = keys[i];\n            if (!rErrorKey.test(key)) {\n                ret[key] = obj[key];\n            }\n        }\n        return ret;\n    }\n    util.markAsOriginatingFromRejection(obj);\n    return obj;\n}\n\nfunction nodebackForPromise(promise, multiArgs) {\n    return function(err, value) {\n        if (promise === null) return;\n        if (err) {\n            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));\n            promise._attachExtraTrace(wrapped);\n            promise._reject(wrapped);\n        } else if (!multiArgs) {\n            promise._fulfill(value);\n        } else {\n            var args = [].slice.call(arguments, 1);;\n            promise._fulfill(args);\n        }\n        promise = null;\n    };\n}\n\nmodule.exports = nodebackForPromise;\n\n},{\"./errors\":12,\"./es5\":13,\"./util\":36}],21:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise) {\nvar util = _dereq_(\"./util\");\nvar async = Promise._async;\nvar tryCatch = util.tryCatch;\nvar errorObj = util.errorObj;\n\nfunction spreadAdapter(val, nodeback) {\n    var promise = this;\n    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);\n    var ret =\n        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));\n    if (ret === errorObj) {\n        async.throwLater(ret.e);\n    }\n}\n\nfunction successAdapter(val, nodeback) {\n    var promise = this;\n    var receiver = promise._boundValue();\n    var ret = val === undefined\n        ? tryCatch(nodeback).call(receiver, null)\n        : tryCatch(nodeback).call(receiver, null, val);\n    if (ret === errorObj) {\n        async.throwLater(ret.e);\n    }\n}\nfunction errorAdapter(reason, nodeback) {\n    var promise = this;\n    if (!reason) {\n        var newReason = new Error(reason + \"\");\n        newReason.cause = reason;\n        reason = newReason;\n    }\n    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);\n    if (ret === errorObj) {\n        async.throwLater(ret.e);\n    }\n}\n\nPromise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,\n                                                                     options) {\n    if (typeof nodeback == \"function\") {\n        var adapter = successAdapter;\n        if (options !== undefined && Object(options).spread) {\n            adapter = spreadAdapter;\n        }\n        this._then(\n            adapter,\n            errorAdapter,\n            undefined,\n            this,\n            nodeback\n        );\n    }\n    return this;\n};\n};\n\n},{\"./util\":36}],22:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function() {\nvar makeSelfResolutionError = function () {\n    return new TypeError(\"circular promise resolution chain\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n};\nvar reflectHandler = function() {\n    return new Promise.PromiseInspection(this._target());\n};\nvar apiRejection = function(msg) {\n    return Promise.reject(new TypeError(msg));\n};\nfunction Proxyable() {}\nvar UNDEFINED_BINDING = {};\nvar util = _dereq_(\"./util\");\n\nvar getDomain;\nif (util.isNode) {\n    getDomain = function() {\n        var ret = process.domain;\n        if (ret === undefined) ret = null;\n        return ret;\n    };\n} else {\n    getDomain = function() {\n        return null;\n    };\n}\nutil.notEnumerableProp(Promise, \"_getDomain\", getDomain);\n\nvar es5 = _dereq_(\"./es5\");\nvar Async = _dereq_(\"./async\");\nvar async = new Async();\nes5.defineProperty(Promise, \"_async\", {value: async});\nvar errors = _dereq_(\"./errors\");\nvar TypeError = Promise.TypeError = errors.TypeError;\nPromise.RangeError = errors.RangeError;\nvar CancellationError = Promise.CancellationError = errors.CancellationError;\nPromise.TimeoutError = errors.TimeoutError;\nPromise.OperationalError = errors.OperationalError;\nPromise.RejectionError = errors.OperationalError;\nPromise.AggregateError = errors.AggregateError;\nvar INTERNAL = function(){};\nvar APPLY = {};\nvar NEXT_FILTER = {};\nvar tryConvertToPromise = _dereq_(\"./thenables\")(Promise, INTERNAL);\nvar PromiseArray =\n    _dereq_(\"./promise_array\")(Promise, INTERNAL,\n                               tryConvertToPromise, apiRejection, Proxyable);\nvar Context = _dereq_(\"./context\")(Promise);\n /*jshint unused:false*/\nvar createContext = Context.create;\nvar debug = _dereq_(\"./debuggability\")(Promise, Context);\nvar CapturedTrace = debug.CapturedTrace;\nvar PassThroughHandlerContext =\n    _dereq_(\"./finally\")(Promise, tryConvertToPromise, NEXT_FILTER);\nvar catchFilter = _dereq_(\"./catch_filter\")(NEXT_FILTER);\nvar nodebackForPromise = _dereq_(\"./nodeback\");\nvar errorObj = util.errorObj;\nvar tryCatch = util.tryCatch;\nfunction check(self, executor) {\n    if (self == null || self.constructor !== Promise) {\n        throw new TypeError(\"the promise constructor cannot be invoked directly\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n    if (typeof executor !== \"function\") {\n        throw new TypeError(\"expecting a function but got \" + util.classString(executor));\n    }\n\n}\n\nfunction Promise(executor) {\n    if (executor !== INTERNAL) {\n        check(this, executor);\n    }\n    this._bitField = 0;\n    this._fulfillmentHandler0 = undefined;\n    this._rejectionHandler0 = undefined;\n    this._promise0 = undefined;\n    this._receiver0 = undefined;\n    this._resolveFromExecutor(executor);\n    this._promiseCreated();\n    this._fireEvent(\"promiseCreated\", this);\n}\n\nPromise.prototype.toString = function () {\n    return \"[object Promise]\";\n};\n\nPromise.prototype.caught = Promise.prototype[\"catch\"] = function (fn) {\n    var len = arguments.length;\n    if (len > 1) {\n        var catchInstances = new Array(len - 1),\n            j = 0, i;\n        for (i = 0; i < len - 1; ++i) {\n            var item = arguments[i];\n            if (util.isObject(item)) {\n                catchInstances[j++] = item;\n            } else {\n                return apiRejection(\"Catch statement predicate: \" +\n                    \"expecting an object but got \" + util.classString(item));\n            }\n        }\n        catchInstances.length = j;\n        fn = arguments[i];\n        return this.then(undefined, catchFilter(catchInstances, fn, this));\n    }\n    return this.then(undefined, fn);\n};\n\nPromise.prototype.reflect = function () {\n    return this._then(reflectHandler,\n        reflectHandler, undefined, this, undefined);\n};\n\nPromise.prototype.then = function (didFulfill, didReject) {\n    if (debug.warnings() && arguments.length > 0 &&\n        typeof didFulfill !== \"function\" &&\n        typeof didReject !== \"function\") {\n        var msg = \".then() only accepts functions but was passed: \" +\n                util.classString(didFulfill);\n        if (arguments.length > 1) {\n            msg += \", \" + util.classString(didReject);\n        }\n        this._warn(msg);\n    }\n    return this._then(didFulfill, didReject, undefined, undefined, undefined);\n};\n\nPromise.prototype.done = function (didFulfill, didReject) {\n    var promise =\n        this._then(didFulfill, didReject, undefined, undefined, undefined);\n    promise._setIsFinal();\n};\n\nPromise.prototype.spread = function (fn) {\n    if (typeof fn !== \"function\") {\n        return apiRejection(\"expecting a function but got \" + util.classString(fn));\n    }\n    return this.all()._then(fn, undefined, undefined, APPLY, undefined);\n};\n\nPromise.prototype.toJSON = function () {\n    var ret = {\n        isFulfilled: false,\n        isRejected: false,\n        fulfillmentValue: undefined,\n        rejectionReason: undefined\n    };\n    if (this.isFulfilled()) {\n        ret.fulfillmentValue = this.value();\n        ret.isFulfilled = true;\n    } else if (this.isRejected()) {\n        ret.rejectionReason = this.reason();\n        ret.isRejected = true;\n    }\n    return ret;\n};\n\nPromise.prototype.all = function () {\n    if (arguments.length > 0) {\n        this._warn(\".all() was passed arguments but it does not take any\");\n    }\n    return new PromiseArray(this).promise();\n};\n\nPromise.prototype.error = function (fn) {\n    return this.caught(util.originatesFromRejection, fn);\n};\n\nPromise.getNewLibraryCopy = module.exports;\n\nPromise.is = function (val) {\n    return val instanceof Promise;\n};\n\nPromise.fromNode = Promise.fromCallback = function(fn) {\n    var ret = new Promise(INTERNAL);\n    ret._captureStackTrace();\n    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs\n                                         : false;\n    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));\n    if (result === errorObj) {\n        ret._rejectCallback(result.e, true);\n    }\n    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();\n    return ret;\n};\n\nPromise.all = function (promises) {\n    return new PromiseArray(promises).promise();\n};\n\nPromise.cast = function (obj) {\n    var ret = tryConvertToPromise(obj);\n    if (!(ret instanceof Promise)) {\n        ret = new Promise(INTERNAL);\n        ret._captureStackTrace();\n        ret._setFulfilled();\n        ret._rejectionHandler0 = obj;\n    }\n    return ret;\n};\n\nPromise.resolve = Promise.fulfilled = Promise.cast;\n\nPromise.reject = Promise.rejected = function (reason) {\n    var ret = new Promise(INTERNAL);\n    ret._captureStackTrace();\n    ret._rejectCallback(reason, true);\n    return ret;\n};\n\nPromise.setScheduler = function(fn) {\n    if (typeof fn !== \"function\") {\n        throw new TypeError(\"expecting a function but got \" + util.classString(fn));\n    }\n    return async.setScheduler(fn);\n};\n\nPromise.prototype._then = function (\n    didFulfill,\n    didReject,\n    _,    receiver,\n    internalData\n) {\n    var haveInternalData = internalData !== undefined;\n    var promise = haveInternalData ? internalData : new Promise(INTERNAL);\n    var target = this._target();\n    var bitField = target._bitField;\n\n    if (!haveInternalData) {\n        promise._propagateFrom(this, 3);\n        promise._captureStackTrace();\n        if (receiver === undefined &&\n            ((this._bitField & 2097152) !== 0)) {\n            if (!((bitField & 50397184) === 0)) {\n                receiver = this._boundValue();\n            } else {\n                receiver = target === this ? undefined : this._boundTo;\n            }\n        }\n        this._fireEvent(\"promiseChained\", this, promise);\n    }\n\n    var domain = getDomain();\n    if (!((bitField & 50397184) === 0)) {\n        var handler, value, settler = target._settlePromiseCtx;\n        if (((bitField & 33554432) !== 0)) {\n            value = target._rejectionHandler0;\n            handler = didFulfill;\n        } else if (((bitField & 16777216) !== 0)) {\n            value = target._fulfillmentHandler0;\n            handler = didReject;\n            target._unsetRejectionIsUnhandled();\n        } else {\n            settler = target._settlePromiseLateCancellationObserver;\n            value = new CancellationError(\"late cancellation observer\");\n            target._attachExtraTrace(value);\n            handler = didReject;\n        }\n\n        async.invoke(settler, target, {\n            handler: domain === null ? handler\n                : (typeof handler === \"function\" &&\n                    util.domainBind(domain, handler)),\n            promise: promise,\n            receiver: receiver,\n            value: value\n        });\n    } else {\n        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);\n    }\n\n    return promise;\n};\n\nPromise.prototype._length = function () {\n    return this._bitField & 65535;\n};\n\nPromise.prototype._isFateSealed = function () {\n    return (this._bitField & 117506048) !== 0;\n};\n\nPromise.prototype._isFollowing = function () {\n    return (this._bitField & 67108864) === 67108864;\n};\n\nPromise.prototype._setLength = function (len) {\n    this._bitField = (this._bitField & -65536) |\n        (len & 65535);\n};\n\nPromise.prototype._setFulfilled = function () {\n    this._bitField = this._bitField | 33554432;\n    this._fireEvent(\"promiseFulfilled\", this);\n};\n\nPromise.prototype._setRejected = function () {\n    this._bitField = this._bitField | 16777216;\n    this._fireEvent(\"promiseRejected\", this);\n};\n\nPromise.prototype._setFollowing = function () {\n    this._bitField = this._bitField | 67108864;\n    this._fireEvent(\"promiseResolved\", this);\n};\n\nPromise.prototype._setIsFinal = function () {\n    this._bitField = this._bitField | 4194304;\n};\n\nPromise.prototype._isFinal = function () {\n    return (this._bitField & 4194304) > 0;\n};\n\nPromise.prototype._unsetCancelled = function() {\n    this._bitField = this._bitField & (~65536);\n};\n\nPromise.prototype._setCancelled = function() {\n    this._bitField = this._bitField | 65536;\n    this._fireEvent(\"promiseCancelled\", this);\n};\n\nPromise.prototype._setWillBeCancelled = function() {\n    this._bitField = this._bitField | 8388608;\n};\n\nPromise.prototype._setAsyncGuaranteed = function() {\n    if (async.hasCustomScheduler()) return;\n    this._bitField = this._bitField | 134217728;\n};\n\nPromise.prototype._receiverAt = function (index) {\n    var ret = index === 0 ? this._receiver0 : this[\n            index * 4 - 4 + 3];\n    if (ret === UNDEFINED_BINDING) {\n        return undefined;\n    } else if (ret === undefined && this._isBound()) {\n        return this._boundValue();\n    }\n    return ret;\n};\n\nPromise.prototype._promiseAt = function (index) {\n    return this[\n            index * 4 - 4 + 2];\n};\n\nPromise.prototype._fulfillmentHandlerAt = function (index) {\n    return this[\n            index * 4 - 4 + 0];\n};\n\nPromise.prototype._rejectionHandlerAt = function (index) {\n    return this[\n            index * 4 - 4 + 1];\n};\n\nPromise.prototype._boundValue = function() {};\n\nPromise.prototype._migrateCallback0 = function (follower) {\n    var bitField = follower._bitField;\n    var fulfill = follower._fulfillmentHandler0;\n    var reject = follower._rejectionHandler0;\n    var promise = follower._promise0;\n    var receiver = follower._receiverAt(0);\n    if (receiver === undefined) receiver = UNDEFINED_BINDING;\n    this._addCallbacks(fulfill, reject, promise, receiver, null);\n};\n\nPromise.prototype._migrateCallbackAt = function (follower, index) {\n    var fulfill = follower._fulfillmentHandlerAt(index);\n    var reject = follower._rejectionHandlerAt(index);\n    var promise = follower._promiseAt(index);\n    var receiver = follower._receiverAt(index);\n    if (receiver === undefined) receiver = UNDEFINED_BINDING;\n    this._addCallbacks(fulfill, reject, promise, receiver, null);\n};\n\nPromise.prototype._addCallbacks = function (\n    fulfill,\n    reject,\n    promise,\n    receiver,\n    domain\n) {\n    var index = this._length();\n\n    if (index >= 65535 - 4) {\n        index = 0;\n        this._setLength(0);\n    }\n\n    if (index === 0) {\n        this._promise0 = promise;\n        this._receiver0 = receiver;\n        if (typeof fulfill === \"function\") {\n            this._fulfillmentHandler0 =\n                domain === null ? fulfill : util.domainBind(domain, fulfill);\n        }\n        if (typeof reject === \"function\") {\n            this._rejectionHandler0 =\n                domain === null ? reject : util.domainBind(domain, reject);\n        }\n    } else {\n        var base = index * 4 - 4;\n        this[base + 2] = promise;\n        this[base + 3] = receiver;\n        if (typeof fulfill === \"function\") {\n            this[base + 0] =\n                domain === null ? fulfill : util.domainBind(domain, fulfill);\n        }\n        if (typeof reject === \"function\") {\n            this[base + 1] =\n                domain === null ? reject : util.domainBind(domain, reject);\n        }\n    }\n    this._setLength(index + 1);\n    return index;\n};\n\nPromise.prototype._proxy = function (proxyable, arg) {\n    this._addCallbacks(undefined, undefined, arg, proxyable, null);\n};\n\nPromise.prototype._resolveCallback = function(value, shouldBind) {\n    if (((this._bitField & 117506048) !== 0)) return;\n    if (value === this)\n        return this._rejectCallback(makeSelfResolutionError(), false);\n    var maybePromise = tryConvertToPromise(value, this);\n    if (!(maybePromise instanceof Promise)) return this._fulfill(value);\n\n    if (shouldBind) this._propagateFrom(maybePromise, 2);\n\n    var promise = maybePromise._target();\n\n    if (promise === this) {\n        this._reject(makeSelfResolutionError());\n        return;\n    }\n\n    var bitField = promise._bitField;\n    if (((bitField & 50397184) === 0)) {\n        var len = this._length();\n        if (len > 0) promise._migrateCallback0(this);\n        for (var i = 1; i < len; ++i) {\n            promise._migrateCallbackAt(this, i);\n        }\n        this._setFollowing();\n        this._setLength(0);\n        this._setFollowee(promise);\n    } else if (((bitField & 33554432) !== 0)) {\n        this._fulfill(promise._value());\n    } else if (((bitField & 16777216) !== 0)) {\n        this._reject(promise._reason());\n    } else {\n        var reason = new CancellationError(\"late cancellation observer\");\n        promise._attachExtraTrace(reason);\n        this._reject(reason);\n    }\n};\n\nPromise.prototype._rejectCallback =\nfunction(reason, synchronous, ignoreNonErrorWarnings) {\n    var trace = util.ensureErrorObject(reason);\n    var hasStack = trace === reason;\n    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {\n        var message = \"a promise was rejected with a non-error: \" +\n            util.classString(reason);\n        this._warn(message, true);\n    }\n    this._attachExtraTrace(trace, synchronous ? hasStack : false);\n    this._reject(reason);\n};\n\nPromise.prototype._resolveFromExecutor = function (executor) {\n    if (executor === INTERNAL) return;\n    var promise = this;\n    this._captureStackTrace();\n    this._pushContext();\n    var synchronous = true;\n    var r = this._execute(executor, function(value) {\n        promise._resolveCallback(value);\n    }, function (reason) {\n        promise._rejectCallback(reason, synchronous);\n    });\n    synchronous = false;\n    this._popContext();\n\n    if (r !== undefined) {\n        promise._rejectCallback(r, true);\n    }\n};\n\nPromise.prototype._settlePromiseFromHandler = function (\n    handler, receiver, value, promise\n) {\n    var bitField = promise._bitField;\n    if (((bitField & 65536) !== 0)) return;\n    promise._pushContext();\n    var x;\n    if (receiver === APPLY) {\n        if (!value || typeof value.length !== \"number\") {\n            x = errorObj;\n            x.e = new TypeError(\"cannot .spread() a non-array: \" +\n                                    util.classString(value));\n        } else {\n            x = tryCatch(handler).apply(this._boundValue(), value);\n        }\n    } else {\n        x = tryCatch(handler).call(receiver, value);\n    }\n    var promiseCreated = promise._popContext();\n    bitField = promise._bitField;\n    if (((bitField & 65536) !== 0)) return;\n\n    if (x === NEXT_FILTER) {\n        promise._reject(value);\n    } else if (x === errorObj) {\n        promise._rejectCallback(x.e, false);\n    } else {\n        debug.checkForgottenReturns(x, promiseCreated, \"\",  promise, this);\n        promise._resolveCallback(x);\n    }\n};\n\nPromise.prototype._target = function() {\n    var ret = this;\n    while (ret._isFollowing()) ret = ret._followee();\n    return ret;\n};\n\nPromise.prototype._followee = function() {\n    return this._rejectionHandler0;\n};\n\nPromise.prototype._setFollowee = function(promise) {\n    this._rejectionHandler0 = promise;\n};\n\nPromise.prototype._settlePromise = function(promise, handler, receiver, value) {\n    var isPromise = promise instanceof Promise;\n    var bitField = this._bitField;\n    var asyncGuaranteed = ((bitField & 134217728) !== 0);\n    if (((bitField & 65536) !== 0)) {\n        if (isPromise) promise._invokeInternalOnCancel();\n\n        if (receiver instanceof PassThroughHandlerContext &&\n            receiver.isFinallyHandler()) {\n            receiver.cancelPromise = promise;\n            if (tryCatch(handler).call(receiver, value) === errorObj) {\n                promise._reject(errorObj.e);\n            }\n        } else if (handler === reflectHandler) {\n            promise._fulfill(reflectHandler.call(receiver));\n        } else if (receiver instanceof Proxyable) {\n            receiver._promiseCancelled(promise);\n        } else if (isPromise || promise instanceof PromiseArray) {\n            promise._cancel();\n        } else {\n            receiver.cancel();\n        }\n    } else if (typeof handler === \"function\") {\n        if (!isPromise) {\n            handler.call(receiver, value, promise);\n        } else {\n            if (asyncGuaranteed) promise._setAsyncGuaranteed();\n            this._settlePromiseFromHandler(handler, receiver, value, promise);\n        }\n    } else if (receiver instanceof Proxyable) {\n        if (!receiver._isResolved()) {\n            if (((bitField & 33554432) !== 0)) {\n                receiver._promiseFulfilled(value, promise);\n            } else {\n                receiver._promiseRejected(value, promise);\n            }\n        }\n    } else if (isPromise) {\n        if (asyncGuaranteed) promise._setAsyncGuaranteed();\n        if (((bitField & 33554432) !== 0)) {\n            promise._fulfill(value);\n        } else {\n            promise._reject(value);\n        }\n    }\n};\n\nPromise.prototype._settlePromiseLateCancellationObserver = function(ctx) {\n    var handler = ctx.handler;\n    var promise = ctx.promise;\n    var receiver = ctx.receiver;\n    var value = ctx.value;\n    if (typeof handler === \"function\") {\n        if (!(promise instanceof Promise)) {\n            handler.call(receiver, value, promise);\n        } else {\n            this._settlePromiseFromHandler(handler, receiver, value, promise);\n        }\n    } else if (promise instanceof Promise) {\n        promise._reject(value);\n    }\n};\n\nPromise.prototype._settlePromiseCtx = function(ctx) {\n    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);\n};\n\nPromise.prototype._settlePromise0 = function(handler, value, bitField) {\n    var promise = this._promise0;\n    var receiver = this._receiverAt(0);\n    this._promise0 = undefined;\n    this._receiver0 = undefined;\n    this._settlePromise(promise, handler, receiver, value);\n};\n\nPromise.prototype._clearCallbackDataAtIndex = function(index) {\n    var base = index * 4 - 4;\n    this[base + 2] =\n    this[base + 3] =\n    this[base + 0] =\n    this[base + 1] = undefined;\n};\n\nPromise.prototype._fulfill = function (value) {\n    var bitField = this._bitField;\n    if (((bitField & 117506048) >>> 16)) return;\n    if (value === this) {\n        var err = makeSelfResolutionError();\n        this._attachExtraTrace(err);\n        return this._reject(err);\n    }\n    this._setFulfilled();\n    this._rejectionHandler0 = value;\n\n    if ((bitField & 65535) > 0) {\n        if (((bitField & 134217728) !== 0)) {\n            this._settlePromises();\n        } else {\n            async.settlePromises(this);\n        }\n    }\n};\n\nPromise.prototype._reject = function (reason) {\n    var bitField = this._bitField;\n    if (((bitField & 117506048) >>> 16)) return;\n    this._setRejected();\n    this._fulfillmentHandler0 = reason;\n\n    if (this._isFinal()) {\n        return async.fatalError(reason, util.isNode);\n    }\n\n    if ((bitField & 65535) > 0) {\n        async.settlePromises(this);\n    } else {\n        this._ensurePossibleRejectionHandled();\n    }\n};\n\nPromise.prototype._fulfillPromises = function (len, value) {\n    for (var i = 1; i < len; i++) {\n        var handler = this._fulfillmentHandlerAt(i);\n        var promise = this._promiseAt(i);\n        var receiver = this._receiverAt(i);\n        this._clearCallbackDataAtIndex(i);\n        this._settlePromise(promise, handler, receiver, value);\n    }\n};\n\nPromise.prototype._rejectPromises = function (len, reason) {\n    for (var i = 1; i < len; i++) {\n        var handler = this._rejectionHandlerAt(i);\n        var promise = this._promiseAt(i);\n        var receiver = this._receiverAt(i);\n        this._clearCallbackDataAtIndex(i);\n        this._settlePromise(promise, handler, receiver, reason);\n    }\n};\n\nPromise.prototype._settlePromises = function () {\n    var bitField = this._bitField;\n    var len = (bitField & 65535);\n\n    if (len > 0) {\n        if (((bitField & 16842752) !== 0)) {\n            var reason = this._fulfillmentHandler0;\n            this._settlePromise0(this._rejectionHandler0, reason, bitField);\n            this._rejectPromises(len, reason);\n        } else {\n            var value = this._rejectionHandler0;\n            this._settlePromise0(this._fulfillmentHandler0, value, bitField);\n            this._fulfillPromises(len, value);\n        }\n        this._setLength(0);\n    }\n    this._clearCancellationData();\n};\n\nPromise.prototype._settledValue = function() {\n    var bitField = this._bitField;\n    if (((bitField & 33554432) !== 0)) {\n        return this._rejectionHandler0;\n    } else if (((bitField & 16777216) !== 0)) {\n        return this._fulfillmentHandler0;\n    }\n};\n\nfunction deferResolve(v) {this.promise._resolveCallback(v);}\nfunction deferReject(v) {this.promise._rejectCallback(v, false);}\n\nPromise.defer = Promise.pending = function() {\n    debug.deprecated(\"Promise.defer\", \"new Promise\");\n    var promise = new Promise(INTERNAL);\n    return {\n        promise: promise,\n        resolve: deferResolve,\n        reject: deferReject\n    };\n};\n\nutil.notEnumerableProp(Promise,\n                       \"_makeSelfResolutionError\",\n                       makeSelfResolutionError);\n\n_dereq_(\"./method\")(Promise, INTERNAL, tryConvertToPromise, apiRejection,\n    debug);\n_dereq_(\"./bind\")(Promise, INTERNAL, tryConvertToPromise, debug);\n_dereq_(\"./cancel\")(Promise, PromiseArray, apiRejection, debug);\n_dereq_(\"./direct_resolve\")(Promise);\n_dereq_(\"./synchronous_inspection\")(Promise);\n_dereq_(\"./join\")(\n    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);\nPromise.Promise = Promise;\nPromise.version = \"3.5.1\";\n_dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);\n_dereq_('./call_get.js')(Promise);\n_dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);\n_dereq_('./timers.js')(Promise, INTERNAL, debug);\n_dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);\n_dereq_('./nodeify.js')(Promise);\n_dereq_('./promisify.js')(Promise, INTERNAL);\n_dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);\n_dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);\n_dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);\n_dereq_('./settle.js')(Promise, PromiseArray, debug);\n_dereq_('./some.js')(Promise, PromiseArray, apiRejection);\n_dereq_('./filter.js')(Promise, INTERNAL);\n_dereq_('./each.js')(Promise, INTERNAL);\n_dereq_('./any.js')(Promise);\n                                                         \n    util.toFastProperties(Promise);                                          \n    util.toFastProperties(Promise.prototype);                                \n    function fillTypes(value) {                                              \n        var p = new Promise(INTERNAL);                                       \n        p._fulfillmentHandler0 = value;                                      \n        p._rejectionHandler0 = value;                                        \n        p._promise0 = value;                                                 \n        p._receiver0 = value;                                                \n    }                                                                        \n    // Complete slack tracking, opt out of field-type tracking and           \n    // stabilize map                                                         \n    fillTypes({a: 1});                                                       \n    fillTypes({b: 2});                                                       \n    fillTypes({c: 3});                                                       \n    fillTypes(1);                                                            \n    fillTypes(function(){});                                                 \n    fillTypes(undefined);                                                    \n    fillTypes(false);                                                        \n    fillTypes(new Promise(INTERNAL));                                        \n    debug.setBounds(Async.firstLineError, util.lastLineError);               \n    return Promise;                                                          \n\n};\n\n},{\"./any.js\":1,\"./async\":2,\"./bind\":3,\"./call_get.js\":5,\"./cancel\":6,\"./catch_filter\":7,\"./context\":8,\"./debuggability\":9,\"./direct_resolve\":10,\"./each.js\":11,\"./errors\":12,\"./es5\":13,\"./filter.js\":14,\"./finally\":15,\"./generators.js\":16,\"./join\":17,\"./map.js\":18,\"./method\":19,\"./nodeback\":20,\"./nodeify.js\":21,\"./promise_array\":23,\"./promisify.js\":24,\"./props.js\":25,\"./race.js\":27,\"./reduce.js\":28,\"./settle.js\":30,\"./some.js\":31,\"./synchronous_inspection\":32,\"./thenables\":33,\"./timers.js\":34,\"./using.js\":35,\"./util\":36}],23:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, INTERNAL, tryConvertToPromise,\n    apiRejection, Proxyable) {\nvar util = _dereq_(\"./util\");\nvar isArray = util.isArray;\n\nfunction toResolutionValue(val) {\n    switch(val) {\n    case -2: return [];\n    case -3: return {};\n    case -6: return new Map();\n    }\n}\n\nfunction PromiseArray(values) {\n    var promise = this._promise = new Promise(INTERNAL);\n    if (values instanceof Promise) {\n        promise._propagateFrom(values, 3);\n    }\n    promise._setOnCancel(this);\n    this._values = values;\n    this._length = 0;\n    this._totalResolved = 0;\n    this._init(undefined, -2);\n}\nutil.inherits(PromiseArray, Proxyable);\n\nPromiseArray.prototype.length = function () {\n    return this._length;\n};\n\nPromiseArray.prototype.promise = function () {\n    return this._promise;\n};\n\nPromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {\n    var values = tryConvertToPromise(this._values, this._promise);\n    if (values instanceof Promise) {\n        values = values._target();\n        var bitField = values._bitField;\n        ;\n        this._values = values;\n\n        if (((bitField & 50397184) === 0)) {\n            this._promise._setAsyncGuaranteed();\n            return values._then(\n                init,\n                this._reject,\n                undefined,\n                this,\n                resolveValueIfEmpty\n           );\n        } else if (((bitField & 33554432) !== 0)) {\n            values = values._value();\n        } else if (((bitField & 16777216) !== 0)) {\n            return this._reject(values._reason());\n        } else {\n            return this._cancel();\n        }\n    }\n    values = util.asArray(values);\n    if (values === null) {\n        var err = apiRejection(\n            \"expecting an array or an iterable object but got \" + util.classString(values)).reason();\n        this._promise._rejectCallback(err, false);\n        return;\n    }\n\n    if (values.length === 0) {\n        if (resolveValueIfEmpty === -5) {\n            this._resolveEmptyArray();\n        }\n        else {\n            this._resolve(toResolutionValue(resolveValueIfEmpty));\n        }\n        return;\n    }\n    this._iterate(values);\n};\n\nPromiseArray.prototype._iterate = function(values) {\n    var len = this.getActualLength(values.length);\n    this._length = len;\n    this._values = this.shouldCopyValues() ? new Array(len) : this._values;\n    var result = this._promise;\n    var isResolved = false;\n    var bitField = null;\n    for (var i = 0; i < len; ++i) {\n        var maybePromise = tryConvertToPromise(values[i], result);\n\n        if (maybePromise instanceof Promise) {\n            maybePromise = maybePromise._target();\n            bitField = maybePromise._bitField;\n        } else {\n            bitField = null;\n        }\n\n        if (isResolved) {\n            if (bitField !== null) {\n                maybePromise.suppressUnhandledRejections();\n            }\n        } else if (bitField !== null) {\n            if (((bitField & 50397184) === 0)) {\n                maybePromise._proxy(this, i);\n                this._values[i] = maybePromise;\n            } else if (((bitField & 33554432) !== 0)) {\n                isResolved = this._promiseFulfilled(maybePromise._value(), i);\n            } else if (((bitField & 16777216) !== 0)) {\n                isResolved = this._promiseRejected(maybePromise._reason(), i);\n            } else {\n                isResolved = this._promiseCancelled(i);\n            }\n        } else {\n            isResolved = this._promiseFulfilled(maybePromise, i);\n        }\n    }\n    if (!isResolved) result._setAsyncGuaranteed();\n};\n\nPromiseArray.prototype._isResolved = function () {\n    return this._values === null;\n};\n\nPromiseArray.prototype._resolve = function (value) {\n    this._values = null;\n    this._promise._fulfill(value);\n};\n\nPromiseArray.prototype._cancel = function() {\n    if (this._isResolved() || !this._promise._isCancellable()) return;\n    this._values = null;\n    this._promise._cancel();\n};\n\nPromiseArray.prototype._reject = function (reason) {\n    this._values = null;\n    this._promise._rejectCallback(reason, false);\n};\n\nPromiseArray.prototype._promiseFulfilled = function (value, index) {\n    this._values[index] = value;\n    var totalResolved = ++this._totalResolved;\n    if (totalResolved >= this._length) {\n        this._resolve(this._values);\n        return true;\n    }\n    return false;\n};\n\nPromiseArray.prototype._promiseCancelled = function() {\n    this._cancel();\n    return true;\n};\n\nPromiseArray.prototype._promiseRejected = function (reason) {\n    this._totalResolved++;\n    this._reject(reason);\n    return true;\n};\n\nPromiseArray.prototype._resultCancelled = function() {\n    if (this._isResolved()) return;\n    var values = this._values;\n    this._cancel();\n    if (values instanceof Promise) {\n        values.cancel();\n    } else {\n        for (var i = 0; i < values.length; ++i) {\n            if (values[i] instanceof Promise) {\n                values[i].cancel();\n            }\n        }\n    }\n};\n\nPromiseArray.prototype.shouldCopyValues = function () {\n    return true;\n};\n\nPromiseArray.prototype.getActualLength = function (len) {\n    return len;\n};\n\nreturn PromiseArray;\n};\n\n},{\"./util\":36}],24:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, INTERNAL) {\nvar THIS = {};\nvar util = _dereq_(\"./util\");\nvar nodebackForPromise = _dereq_(\"./nodeback\");\nvar withAppended = util.withAppended;\nvar maybeWrapAsError = util.maybeWrapAsError;\nvar canEvaluate = util.canEvaluate;\nvar TypeError = _dereq_(\"./errors\").TypeError;\nvar defaultSuffix = \"Async\";\nvar defaultPromisified = {__isPromisified__: true};\nvar noCopyProps = [\n    \"arity\",    \"length\",\n    \"name\",\n    \"arguments\",\n    \"caller\",\n    \"callee\",\n    \"prototype\",\n    \"__isPromisified__\"\n];\nvar noCopyPropsPattern = new RegExp(\"^(?:\" + noCopyProps.join(\"|\") + \")$\");\n\nvar defaultFilter = function(name) {\n    return util.isIdentifier(name) &&\n        name.charAt(0) !== \"_\" &&\n        name !== \"constructor\";\n};\n\nfunction propsFilter(key) {\n    return !noCopyPropsPattern.test(key);\n}\n\nfunction isPromisified(fn) {\n    try {\n        return fn.__isPromisified__ === true;\n    }\n    catch (e) {\n        return false;\n    }\n}\n\nfunction hasPromisified(obj, key, suffix) {\n    var val = util.getDataPropertyOrDefault(obj, key + suffix,\n                                            defaultPromisified);\n    return val ? isPromisified(val) : false;\n}\nfunction checkValid(ret, suffix, suffixRegexp) {\n    for (var i = 0; i < ret.length; i += 2) {\n        var key = ret[i];\n        if (suffixRegexp.test(key)) {\n            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, \"\");\n            for (var j = 0; j < ret.length; j += 2) {\n                if (ret[j] === keyWithoutAsyncSuffix) {\n                    throw new TypeError(\"Cannot promisify an API that has normal methods with '%s'-suffix\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\"\n                        .replace(\"%s\", suffix));\n                }\n            }\n        }\n    }\n}\n\nfunction promisifiableMethods(obj, suffix, suffixRegexp, filter) {\n    var keys = util.inheritedDataKeys(obj);\n    var ret = [];\n    for (var i = 0; i < keys.length; ++i) {\n        var key = keys[i];\n        var value = obj[key];\n        var passesDefaultFilter = filter === defaultFilter\n            ? true : defaultFilter(key, value, obj);\n        if (typeof value === \"function\" &&\n            !isPromisified(value) &&\n            !hasPromisified(obj, key, suffix) &&\n            filter(key, value, obj, passesDefaultFilter)) {\n            ret.push(key, value);\n        }\n    }\n    checkValid(ret, suffix, suffixRegexp);\n    return ret;\n}\n\nvar escapeIdentRegex = function(str) {\n    return str.replace(/([$])/, \"\\\\$\");\n};\n\nvar makeNodePromisifiedEval;\nif (false) {\nvar switchCaseArgumentOrder = function(likelyArgumentCount) {\n    var ret = [likelyArgumentCount];\n    var min = Math.max(0, likelyArgumentCount - 1 - 3);\n    for(var i = likelyArgumentCount - 1; i >= min; --i) {\n        ret.push(i);\n    }\n    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {\n        ret.push(i);\n    }\n    return ret;\n};\n\nvar argumentSequence = function(argumentCount) {\n    return util.filledRange(argumentCount, \"_arg\", \"\");\n};\n\nvar parameterDeclaration = function(parameterCount) {\n    return util.filledRange(\n        Math.max(parameterCount, 3), \"_arg\", \"\");\n};\n\nvar parameterCount = function(fn) {\n    if (typeof fn.length === \"number\") {\n        return Math.max(Math.min(fn.length, 1023 + 1), 0);\n    }\n    return 0;\n};\n\nmakeNodePromisifiedEval =\nfunction(callback, receiver, originalName, fn, _, multiArgs) {\n    var newParameterCount = Math.max(0, parameterCount(fn) - 1);\n    var argumentOrder = switchCaseArgumentOrder(newParameterCount);\n    var shouldProxyThis = typeof callback === \"string\" || receiver === THIS;\n\n    function generateCallForArgumentCount(count) {\n        var args = argumentSequence(count).join(\", \");\n        var comma = count > 0 ? \", \" : \"\";\n        var ret;\n        if (shouldProxyThis) {\n            ret = \"ret = callback.call(this, {{args}}, nodeback); break;\\n\";\n        } else {\n            ret = receiver === undefined\n                ? \"ret = callback({{args}}, nodeback); break;\\n\"\n                : \"ret = callback.call(receiver, {{args}}, nodeback); break;\\n\";\n        }\n        return ret.replace(\"{{args}}\", args).replace(\", \", comma);\n    }\n\n    function generateArgumentSwitchCase() {\n        var ret = \"\";\n        for (var i = 0; i < argumentOrder.length; ++i) {\n            ret += \"case \" + argumentOrder[i] +\":\" +\n                generateCallForArgumentCount(argumentOrder[i]);\n        }\n\n        ret += \"                                                             \\n\\\n        default:                                                             \\n\\\n            var args = new Array(len + 1);                                   \\n\\\n            var i = 0;                                                       \\n\\\n            for (var i = 0; i < len; ++i) {                                  \\n\\\n               args[i] = arguments[i];                                       \\n\\\n            }                                                                \\n\\\n            args[i] = nodeback;                                              \\n\\\n            [CodeForCall]                                                    \\n\\\n            break;                                                           \\n\\\n        \".replace(\"[CodeForCall]\", (shouldProxyThis\n                                ? \"ret = callback.apply(this, args);\\n\"\n                                : \"ret = callback.apply(receiver, args);\\n\"));\n        return ret;\n    }\n\n    var getFunctionCode = typeof callback === \"string\"\n                                ? (\"this != null ? this['\"+callback+\"'] : fn\")\n                                : \"fn\";\n    var body = \"'use strict';                                                \\n\\\n        var ret = function (Parameters) {                                    \\n\\\n            'use strict';                                                    \\n\\\n            var len = arguments.length;                                      \\n\\\n            var promise = new Promise(INTERNAL);                             \\n\\\n            promise._captureStackTrace();                                    \\n\\\n            var nodeback = nodebackForPromise(promise, \" + multiArgs + \");   \\n\\\n            var ret;                                                         \\n\\\n            var callback = tryCatch([GetFunctionCode]);                      \\n\\\n            switch(len) {                                                    \\n\\\n                [CodeForSwitchCase]                                          \\n\\\n            }                                                                \\n\\\n            if (ret === errorObj) {                                          \\n\\\n                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\\n\\\n            }                                                                \\n\\\n            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \\n\\\n            return promise;                                                  \\n\\\n        };                                                                   \\n\\\n        notEnumerableProp(ret, '__isPromisified__', true);                   \\n\\\n        return ret;                                                          \\n\\\n    \".replace(\"[CodeForSwitchCase]\", generateArgumentSwitchCase())\n        .replace(\"[GetFunctionCode]\", getFunctionCode);\n    body = body.replace(\"Parameters\", parameterDeclaration(newParameterCount));\n    return new Function(\"Promise\",\n                        \"fn\",\n                        \"receiver\",\n                        \"withAppended\",\n                        \"maybeWrapAsError\",\n                        \"nodebackForPromise\",\n                        \"tryCatch\",\n                        \"errorObj\",\n                        \"notEnumerableProp\",\n                        \"INTERNAL\",\n                        body)(\n                    Promise,\n                    fn,\n                    receiver,\n                    withAppended,\n                    maybeWrapAsError,\n                    nodebackForPromise,\n                    util.tryCatch,\n                    util.errorObj,\n                    util.notEnumerableProp,\n                    INTERNAL);\n};\n}\n\nfunction makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {\n    var defaultThis = (function() {return this;})();\n    var method = callback;\n    if (typeof method === \"string\") {\n        callback = fn;\n    }\n    function promisified() {\n        var _receiver = receiver;\n        if (receiver === THIS) _receiver = this;\n        var promise = new Promise(INTERNAL);\n        promise._captureStackTrace();\n        var cb = typeof method === \"string\" && this !== defaultThis\n            ? this[method] : callback;\n        var fn = nodebackForPromise(promise, multiArgs);\n        try {\n            cb.apply(_receiver, withAppended(arguments, fn));\n        } catch(e) {\n            promise._rejectCallback(maybeWrapAsError(e), true, true);\n        }\n        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();\n        return promise;\n    }\n    util.notEnumerableProp(promisified, \"__isPromisified__\", true);\n    return promisified;\n}\n\nvar makeNodePromisified = canEvaluate\n    ? makeNodePromisifiedEval\n    : makeNodePromisifiedClosure;\n\nfunction promisifyAll(obj, suffix, filter, promisifier, multiArgs) {\n    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + \"$\");\n    var methods =\n        promisifiableMethods(obj, suffix, suffixRegexp, filter);\n\n    for (var i = 0, len = methods.length; i < len; i+= 2) {\n        var key = methods[i];\n        var fn = methods[i+1];\n        var promisifiedKey = key + suffix;\n        if (promisifier === makeNodePromisified) {\n            obj[promisifiedKey] =\n                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);\n        } else {\n            var promisified = promisifier(fn, function() {\n                return makeNodePromisified(key, THIS, key,\n                                           fn, suffix, multiArgs);\n            });\n            util.notEnumerableProp(promisified, \"__isPromisified__\", true);\n            obj[promisifiedKey] = promisified;\n        }\n    }\n    util.toFastProperties(obj);\n    return obj;\n}\n\nfunction promisify(callback, receiver, multiArgs) {\n    return makeNodePromisified(callback, receiver, undefined,\n                                callback, null, multiArgs);\n}\n\nPromise.promisify = function (fn, options) {\n    if (typeof fn !== \"function\") {\n        throw new TypeError(\"expecting a function but got \" + util.classString(fn));\n    }\n    if (isPromisified(fn)) {\n        return fn;\n    }\n    options = Object(options);\n    var receiver = options.context === undefined ? THIS : options.context;\n    var multiArgs = !!options.multiArgs;\n    var ret = promisify(fn, receiver, multiArgs);\n    util.copyDescriptors(fn, ret, propsFilter);\n    return ret;\n};\n\nPromise.promisifyAll = function (target, options) {\n    if (typeof target !== \"function\" && typeof target !== \"object\") {\n        throw new TypeError(\"the target of promisifyAll must be an object or a function\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n    options = Object(options);\n    var multiArgs = !!options.multiArgs;\n    var suffix = options.suffix;\n    if (typeof suffix !== \"string\") suffix = defaultSuffix;\n    var filter = options.filter;\n    if (typeof filter !== \"function\") filter = defaultFilter;\n    var promisifier = options.promisifier;\n    if (typeof promisifier !== \"function\") promisifier = makeNodePromisified;\n\n    if (!util.isIdentifier(suffix)) {\n        throw new RangeError(\"suffix must be a valid identifier\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n\n    var keys = util.inheritedDataKeys(target);\n    for (var i = 0; i < keys.length; ++i) {\n        var value = target[keys[i]];\n        if (keys[i] !== \"constructor\" &&\n            util.isClass(value)) {\n            promisifyAll(value.prototype, suffix, filter, promisifier,\n                multiArgs);\n            promisifyAll(value, suffix, filter, promisifier, multiArgs);\n        }\n    }\n\n    return promisifyAll(target, suffix, filter, promisifier, multiArgs);\n};\n};\n\n\n},{\"./errors\":12,\"./nodeback\":20,\"./util\":36}],25:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(\n    Promise, PromiseArray, tryConvertToPromise, apiRejection) {\nvar util = _dereq_(\"./util\");\nvar isObject = util.isObject;\nvar es5 = _dereq_(\"./es5\");\nvar Es6Map;\nif (typeof Map === \"function\") Es6Map = Map;\n\nvar mapToEntries = (function() {\n    var index = 0;\n    var size = 0;\n\n    function extractEntry(value, key) {\n        this[index] = value;\n        this[index + size] = key;\n        index++;\n    }\n\n    return function mapToEntries(map) {\n        size = map.size;\n        index = 0;\n        var ret = new Array(map.size * 2);\n        map.forEach(extractEntry, ret);\n        return ret;\n    };\n})();\n\nvar entriesToMap = function(entries) {\n    var ret = new Es6Map();\n    var length = entries.length / 2 | 0;\n    for (var i = 0; i < length; ++i) {\n        var key = entries[length + i];\n        var value = entries[i];\n        ret.set(key, value);\n    }\n    return ret;\n};\n\nfunction PropertiesPromiseArray(obj) {\n    var isMap = false;\n    var entries;\n    if (Es6Map !== undefined && obj instanceof Es6Map) {\n        entries = mapToEntries(obj);\n        isMap = true;\n    } else {\n        var keys = es5.keys(obj);\n        var len = keys.length;\n        entries = new Array(len * 2);\n        for (var i = 0; i < len; ++i) {\n            var key = keys[i];\n            entries[i] = obj[key];\n            entries[i + len] = key;\n        }\n    }\n    this.constructor$(entries);\n    this._isMap = isMap;\n    this._init$(undefined, isMap ? -6 : -3);\n}\nutil.inherits(PropertiesPromiseArray, PromiseArray);\n\nPropertiesPromiseArray.prototype._init = function () {};\n\nPropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {\n    this._values[index] = value;\n    var totalResolved = ++this._totalResolved;\n    if (totalResolved >= this._length) {\n        var val;\n        if (this._isMap) {\n            val = entriesToMap(this._values);\n        } else {\n            val = {};\n            var keyOffset = this.length();\n            for (var i = 0, len = this.length(); i < len; ++i) {\n                val[this._values[i + keyOffset]] = this._values[i];\n            }\n        }\n        this._resolve(val);\n        return true;\n    }\n    return false;\n};\n\nPropertiesPromiseArray.prototype.shouldCopyValues = function () {\n    return false;\n};\n\nPropertiesPromiseArray.prototype.getActualLength = function (len) {\n    return len >> 1;\n};\n\nfunction props(promises) {\n    var ret;\n    var castValue = tryConvertToPromise(promises);\n\n    if (!isObject(castValue)) {\n        return apiRejection(\"cannot await properties of a non-object\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    } else if (castValue instanceof Promise) {\n        ret = castValue._then(\n            Promise.props, undefined, undefined, undefined, undefined);\n    } else {\n        ret = new PropertiesPromiseArray(castValue).promise();\n    }\n\n    if (castValue instanceof Promise) {\n        ret._propagateFrom(castValue, 2);\n    }\n    return ret;\n}\n\nPromise.prototype.props = function () {\n    return props(this);\n};\n\nPromise.props = function (promises) {\n    return props(promises);\n};\n};\n\n},{\"./es5\":13,\"./util\":36}],26:[function(_dereq_,module,exports){\n\"use strict\";\nfunction arrayMove(src, srcIndex, dst, dstIndex, len) {\n    for (var j = 0; j < len; ++j) {\n        dst[j + dstIndex] = src[j + srcIndex];\n        src[j + srcIndex] = void 0;\n    }\n}\n\nfunction Queue(capacity) {\n    this._capacity = capacity;\n    this._length = 0;\n    this._front = 0;\n}\n\nQueue.prototype._willBeOverCapacity = function (size) {\n    return this._capacity < size;\n};\n\nQueue.prototype._pushOne = function (arg) {\n    var length = this.length();\n    this._checkCapacity(length + 1);\n    var i = (this._front + length) & (this._capacity - 1);\n    this[i] = arg;\n    this._length = length + 1;\n};\n\nQueue.prototype.push = function (fn, receiver, arg) {\n    var length = this.length() + 3;\n    if (this._willBeOverCapacity(length)) {\n        this._pushOne(fn);\n        this._pushOne(receiver);\n        this._pushOne(arg);\n        return;\n    }\n    var j = this._front + length - 3;\n    this._checkCapacity(length);\n    var wrapMask = this._capacity - 1;\n    this[(j + 0) & wrapMask] = fn;\n    this[(j + 1) & wrapMask] = receiver;\n    this[(j + 2) & wrapMask] = arg;\n    this._length = length;\n};\n\nQueue.prototype.shift = function () {\n    var front = this._front,\n        ret = this[front];\n\n    this[front] = undefined;\n    this._front = (front + 1) & (this._capacity - 1);\n    this._length--;\n    return ret;\n};\n\nQueue.prototype.length = function () {\n    return this._length;\n};\n\nQueue.prototype._checkCapacity = function (size) {\n    if (this._capacity < size) {\n        this._resizeTo(this._capacity << 1);\n    }\n};\n\nQueue.prototype._resizeTo = function (capacity) {\n    var oldCapacity = this._capacity;\n    this._capacity = capacity;\n    var front = this._front;\n    var length = this._length;\n    var moveItemsCount = (front + length) & (oldCapacity - 1);\n    arrayMove(this, 0, this, oldCapacity, moveItemsCount);\n};\n\nmodule.exports = Queue;\n\n},{}],27:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(\n    Promise, INTERNAL, tryConvertToPromise, apiRejection) {\nvar util = _dereq_(\"./util\");\n\nvar raceLater = function (promise) {\n    return promise.then(function(array) {\n        return race(array, promise);\n    });\n};\n\nfunction race(promises, parent) {\n    var maybePromise = tryConvertToPromise(promises);\n\n    if (maybePromise instanceof Promise) {\n        return raceLater(maybePromise);\n    } else {\n        promises = util.asArray(promises);\n        if (promises === null)\n            return apiRejection(\"expecting an array or an iterable object but got \" + util.classString(promises));\n    }\n\n    var ret = new Promise(INTERNAL);\n    if (parent !== undefined) {\n        ret._propagateFrom(parent, 3);\n    }\n    var fulfill = ret._fulfill;\n    var reject = ret._reject;\n    for (var i = 0, len = promises.length; i < len; ++i) {\n        var val = promises[i];\n\n        if (val === undefined && !(i in promises)) {\n            continue;\n        }\n\n        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);\n    }\n    return ret;\n}\n\nPromise.race = function (promises) {\n    return race(promises, undefined);\n};\n\nPromise.prototype.race = function () {\n    return race(this, undefined);\n};\n\n};\n\n},{\"./util\":36}],28:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise,\n                          PromiseArray,\n                          apiRejection,\n                          tryConvertToPromise,\n                          INTERNAL,\n                          debug) {\nvar getDomain = Promise._getDomain;\nvar util = _dereq_(\"./util\");\nvar tryCatch = util.tryCatch;\n\nfunction ReductionPromiseArray(promises, fn, initialValue, _each) {\n    this.constructor$(promises);\n    var domain = getDomain();\n    this._fn = domain === null ? fn : util.domainBind(domain, fn);\n    if (initialValue !== undefined) {\n        initialValue = Promise.resolve(initialValue);\n        initialValue._attachCancellationCallback(this);\n    }\n    this._initialValue = initialValue;\n    this._currentCancellable = null;\n    if(_each === INTERNAL) {\n        this._eachValues = Array(this._length);\n    } else if (_each === 0) {\n        this._eachValues = null;\n    } else {\n        this._eachValues = undefined;\n    }\n    this._promise._captureStackTrace();\n    this._init$(undefined, -5);\n}\nutil.inherits(ReductionPromiseArray, PromiseArray);\n\nReductionPromiseArray.prototype._gotAccum = function(accum) {\n    if (this._eachValues !== undefined && \n        this._eachValues !== null && \n        accum !== INTERNAL) {\n        this._eachValues.push(accum);\n    }\n};\n\nReductionPromiseArray.prototype._eachComplete = function(value) {\n    if (this._eachValues !== null) {\n        this._eachValues.push(value);\n    }\n    return this._eachValues;\n};\n\nReductionPromiseArray.prototype._init = function() {};\n\nReductionPromiseArray.prototype._resolveEmptyArray = function() {\n    this._resolve(this._eachValues !== undefined ? this._eachValues\n                                                 : this._initialValue);\n};\n\nReductionPromiseArray.prototype.shouldCopyValues = function () {\n    return false;\n};\n\nReductionPromiseArray.prototype._resolve = function(value) {\n    this._promise._resolveCallback(value);\n    this._values = null;\n};\n\nReductionPromiseArray.prototype._resultCancelled = function(sender) {\n    if (sender === this._initialValue) return this._cancel();\n    if (this._isResolved()) return;\n    this._resultCancelled$();\n    if (this._currentCancellable instanceof Promise) {\n        this._currentCancellable.cancel();\n    }\n    if (this._initialValue instanceof Promise) {\n        this._initialValue.cancel();\n    }\n};\n\nReductionPromiseArray.prototype._iterate = function (values) {\n    this._values = values;\n    var value;\n    var i;\n    var length = values.length;\n    if (this._initialValue !== undefined) {\n        value = this._initialValue;\n        i = 0;\n    } else {\n        value = Promise.resolve(values[0]);\n        i = 1;\n    }\n\n    this._currentCancellable = value;\n\n    if (!value.isRejected()) {\n        for (; i < length; ++i) {\n            var ctx = {\n                accum: null,\n                value: values[i],\n                index: i,\n                length: length,\n                array: this\n            };\n            value = value._then(gotAccum, undefined, undefined, ctx, undefined);\n        }\n    }\n\n    if (this._eachValues !== undefined) {\n        value = value\n            ._then(this._eachComplete, undefined, undefined, this, undefined);\n    }\n    value._then(completed, completed, undefined, value, this);\n};\n\nPromise.prototype.reduce = function (fn, initialValue) {\n    return reduce(this, fn, initialValue, null);\n};\n\nPromise.reduce = function (promises, fn, initialValue, _each) {\n    return reduce(promises, fn, initialValue, _each);\n};\n\nfunction completed(valueOrReason, array) {\n    if (this.isFulfilled()) {\n        array._resolve(valueOrReason);\n    } else {\n        array._reject(valueOrReason);\n    }\n}\n\nfunction reduce(promises, fn, initialValue, _each) {\n    if (typeof fn !== \"function\") {\n        return apiRejection(\"expecting a function but got \" + util.classString(fn));\n    }\n    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);\n    return array.promise();\n}\n\nfunction gotAccum(accum) {\n    this.accum = accum;\n    this.array._gotAccum(accum);\n    var value = tryConvertToPromise(this.value, this.array._promise);\n    if (value instanceof Promise) {\n        this.array._currentCancellable = value;\n        return value._then(gotValue, undefined, undefined, this, undefined);\n    } else {\n        return gotValue.call(this, value);\n    }\n}\n\nfunction gotValue(value) {\n    var array = this.array;\n    var promise = array._promise;\n    var fn = tryCatch(array._fn);\n    promise._pushContext();\n    var ret;\n    if (array._eachValues !== undefined) {\n        ret = fn.call(promise._boundValue(), value, this.index, this.length);\n    } else {\n        ret = fn.call(promise._boundValue(),\n                              this.accum, value, this.index, this.length);\n    }\n    if (ret instanceof Promise) {\n        array._currentCancellable = ret;\n    }\n    var promiseCreated = promise._popContext();\n    debug.checkForgottenReturns(\n        ret,\n        promiseCreated,\n        array._eachValues !== undefined ? \"Promise.each\" : \"Promise.reduce\",\n        promise\n    );\n    return ret;\n}\n};\n\n},{\"./util\":36}],29:[function(_dereq_,module,exports){\n\"use strict\";\nvar util = _dereq_(\"./util\");\nvar schedule;\nvar noAsyncScheduler = function() {\n    throw new Error(\"No async scheduler available\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n};\nvar NativePromise = util.getNativePromise();\nif (util.isNode && typeof MutationObserver === \"undefined\") {\n    var GlobalSetImmediate = global.setImmediate;\n    var ProcessNextTick = process.nextTick;\n    schedule = util.isRecentNode\n                ? function(fn) { GlobalSetImmediate.call(global, fn); }\n                : function(fn) { ProcessNextTick.call(process, fn); };\n} else if (typeof NativePromise === \"function\" &&\n           typeof NativePromise.resolve === \"function\") {\n    var nativePromise = NativePromise.resolve();\n    schedule = function(fn) {\n        nativePromise.then(fn);\n    };\n} else if ((typeof MutationObserver !== \"undefined\") &&\n          !(typeof window !== \"undefined\" &&\n            window.navigator &&\n            (window.navigator.standalone || window.cordova))) {\n    schedule = (function() {\n        var div = document.createElement(\"div\");\n        var opts = {attributes: true};\n        var toggleScheduled = false;\n        var div2 = document.createElement(\"div\");\n        var o2 = new MutationObserver(function() {\n            div.classList.toggle(\"foo\");\n            toggleScheduled = false;\n        });\n        o2.observe(div2, opts);\n\n        var scheduleToggle = function() {\n            if (toggleScheduled) return;\n            toggleScheduled = true;\n            div2.classList.toggle(\"foo\");\n        };\n\n        return function schedule(fn) {\n            var o = new MutationObserver(function() {\n                o.disconnect();\n                fn();\n            });\n            o.observe(div, opts);\n            scheduleToggle();\n        };\n    })();\n} else if (typeof setImmediate !== \"undefined\") {\n    schedule = function (fn) {\n        setImmediate(fn);\n    };\n} else if (typeof setTimeout !== \"undefined\") {\n    schedule = function (fn) {\n        setTimeout(fn, 0);\n    };\n} else {\n    schedule = noAsyncScheduler;\n}\nmodule.exports = schedule;\n\n},{\"./util\":36}],30:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports =\n    function(Promise, PromiseArray, debug) {\nvar PromiseInspection = Promise.PromiseInspection;\nvar util = _dereq_(\"./util\");\n\nfunction SettledPromiseArray(values) {\n    this.constructor$(values);\n}\nutil.inherits(SettledPromiseArray, PromiseArray);\n\nSettledPromiseArray.prototype._promiseResolved = function (index, inspection) {\n    this._values[index] = inspection;\n    var totalResolved = ++this._totalResolved;\n    if (totalResolved >= this._length) {\n        this._resolve(this._values);\n        return true;\n    }\n    return false;\n};\n\nSettledPromiseArray.prototype._promiseFulfilled = function (value, index) {\n    var ret = new PromiseInspection();\n    ret._bitField = 33554432;\n    ret._settledValueField = value;\n    return this._promiseResolved(index, ret);\n};\nSettledPromiseArray.prototype._promiseRejected = function (reason, index) {\n    var ret = new PromiseInspection();\n    ret._bitField = 16777216;\n    ret._settledValueField = reason;\n    return this._promiseResolved(index, ret);\n};\n\nPromise.settle = function (promises) {\n    debug.deprecated(\".settle()\", \".reflect()\");\n    return new SettledPromiseArray(promises).promise();\n};\n\nPromise.prototype.settle = function () {\n    return Promise.settle(this);\n};\n};\n\n},{\"./util\":36}],31:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports =\nfunction(Promise, PromiseArray, apiRejection) {\nvar util = _dereq_(\"./util\");\nvar RangeError = _dereq_(\"./errors\").RangeError;\nvar AggregateError = _dereq_(\"./errors\").AggregateError;\nvar isArray = util.isArray;\nvar CANCELLATION = {};\n\n\nfunction SomePromiseArray(values) {\n    this.constructor$(values);\n    this._howMany = 0;\n    this._unwrap = false;\n    this._initialized = false;\n}\nutil.inherits(SomePromiseArray, PromiseArray);\n\nSomePromiseArray.prototype._init = function () {\n    if (!this._initialized) {\n        return;\n    }\n    if (this._howMany === 0) {\n        this._resolve([]);\n        return;\n    }\n    this._init$(undefined, -5);\n    var isArrayResolved = isArray(this._values);\n    if (!this._isResolved() &&\n        isArrayResolved &&\n        this._howMany > this._canPossiblyFulfill()) {\n        this._reject(this._getRangeError(this.length()));\n    }\n};\n\nSomePromiseArray.prototype.init = function () {\n    this._initialized = true;\n    this._init();\n};\n\nSomePromiseArray.prototype.setUnwrap = function () {\n    this._unwrap = true;\n};\n\nSomePromiseArray.prototype.howMany = function () {\n    return this._howMany;\n};\n\nSomePromiseArray.prototype.setHowMany = function (count) {\n    this._howMany = count;\n};\n\nSomePromiseArray.prototype._promiseFulfilled = function (value) {\n    this._addFulfilled(value);\n    if (this._fulfilled() === this.howMany()) {\n        this._values.length = this.howMany();\n        if (this.howMany() === 1 && this._unwrap) {\n            this._resolve(this._values[0]);\n        } else {\n            this._resolve(this._values);\n        }\n        return true;\n    }\n    return false;\n\n};\nSomePromiseArray.prototype._promiseRejected = function (reason) {\n    this._addRejected(reason);\n    return this._checkOutcome();\n};\n\nSomePromiseArray.prototype._promiseCancelled = function () {\n    if (this._values instanceof Promise || this._values == null) {\n        return this._cancel();\n    }\n    this._addRejected(CANCELLATION);\n    return this._checkOutcome();\n};\n\nSomePromiseArray.prototype._checkOutcome = function() {\n    if (this.howMany() > this._canPossiblyFulfill()) {\n        var e = new AggregateError();\n        for (var i = this.length(); i < this._values.length; ++i) {\n            if (this._values[i] !== CANCELLATION) {\n                e.push(this._values[i]);\n            }\n        }\n        if (e.length > 0) {\n            this._reject(e);\n        } else {\n            this._cancel();\n        }\n        return true;\n    }\n    return false;\n};\n\nSomePromiseArray.prototype._fulfilled = function () {\n    return this._totalResolved;\n};\n\nSomePromiseArray.prototype._rejected = function () {\n    return this._values.length - this.length();\n};\n\nSomePromiseArray.prototype._addRejected = function (reason) {\n    this._values.push(reason);\n};\n\nSomePromiseArray.prototype._addFulfilled = function (value) {\n    this._values[this._totalResolved++] = value;\n};\n\nSomePromiseArray.prototype._canPossiblyFulfill = function () {\n    return this.length() - this._rejected();\n};\n\nSomePromiseArray.prototype._getRangeError = function (count) {\n    var message = \"Input array must contain at least \" +\n            this._howMany + \" items but contains only \" + count + \" items\";\n    return new RangeError(message);\n};\n\nSomePromiseArray.prototype._resolveEmptyArray = function () {\n    this._reject(this._getRangeError(0));\n};\n\nfunction some(promises, howMany) {\n    if ((howMany | 0) !== howMany || howMany < 0) {\n        return apiRejection(\"expecting a positive integer\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n    var ret = new SomePromiseArray(promises);\n    var promise = ret.promise();\n    ret.setHowMany(howMany);\n    ret.init();\n    return promise;\n}\n\nPromise.some = function (promises, howMany) {\n    return some(promises, howMany);\n};\n\nPromise.prototype.some = function (howMany) {\n    return some(this, howMany);\n};\n\nPromise._SomePromiseArray = SomePromiseArray;\n};\n\n},{\"./errors\":12,\"./util\":36}],32:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise) {\nfunction PromiseInspection(promise) {\n    if (promise !== undefined) {\n        promise = promise._target();\n        this._bitField = promise._bitField;\n        this._settledValueField = promise._isFateSealed()\n            ? promise._settledValue() : undefined;\n    }\n    else {\n        this._bitField = 0;\n        this._settledValueField = undefined;\n    }\n}\n\nPromiseInspection.prototype._settledValue = function() {\n    return this._settledValueField;\n};\n\nvar value = PromiseInspection.prototype.value = function () {\n    if (!this.isFulfilled()) {\n        throw new TypeError(\"cannot get fulfillment value of a non-fulfilled promise\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n    return this._settledValue();\n};\n\nvar reason = PromiseInspection.prototype.error =\nPromiseInspection.prototype.reason = function () {\n    if (!this.isRejected()) {\n        throw new TypeError(\"cannot get rejection reason of a non-rejected promise\\u000a\\u000a    See http://goo.gl/MqrFmX\\u000a\");\n    }\n    return this._settledValue();\n};\n\nvar isFulfilled = PromiseInspection.prototype.isFulfilled = function() {\n    return (this._bitField & 33554432) !== 0;\n};\n\nvar isRejected = PromiseInspection.prototype.isRejected = function () {\n    return (this._bitField & 16777216) !== 0;\n};\n\nvar isPending = PromiseInspection.prototype.isPending = function () {\n    return (this._bitField & 50397184) === 0;\n};\n\nvar isResolved = PromiseInspection.prototype.isResolved = function () {\n    return (this._bitField & 50331648) !== 0;\n};\n\nPromiseInspection.prototype.isCancelled = function() {\n    return (this._bitField & 8454144) !== 0;\n};\n\nPromise.prototype.__isCancelled = function() {\n    return (this._bitField & 65536) === 65536;\n};\n\nPromise.prototype._isCancelled = function() {\n    return this._target().__isCancelled();\n};\n\nPromise.prototype.isCancelled = function() {\n    return (this._target()._bitField & 8454144) !== 0;\n};\n\nPromise.prototype.isPending = function() {\n    return isPending.call(this._target());\n};\n\nPromise.prototype.isRejected = function() {\n    return isRejected.call(this._target());\n};\n\nPromise.prototype.isFulfilled = function() {\n    return isFulfilled.call(this._target());\n};\n\nPromise.prototype.isResolved = function() {\n    return isResolved.call(this._target());\n};\n\nPromise.prototype.value = function() {\n    return value.call(this._target());\n};\n\nPromise.prototype.reason = function() {\n    var target = this._target();\n    target._unsetRejectionIsUnhandled();\n    return reason.call(target);\n};\n\nPromise.prototype._value = function() {\n    return this._settledValue();\n};\n\nPromise.prototype._reason = function() {\n    this._unsetRejectionIsUnhandled();\n    return this._settledValue();\n};\n\nPromise.PromiseInspection = PromiseInspection;\n};\n\n},{}],33:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, INTERNAL) {\nvar util = _dereq_(\"./util\");\nvar errorObj = util.errorObj;\nvar isObject = util.isObject;\n\nfunction tryConvertToPromise(obj, context) {\n    if (isObject(obj)) {\n        if (obj instanceof Promise) return obj;\n        var then = getThen(obj);\n        if (then === errorObj) {\n            if (context) context._pushContext();\n            var ret = Promise.reject(then.e);\n            if (context) context._popContext();\n            return ret;\n        } else if (typeof then === \"function\") {\n            if (isAnyBluebirdPromise(obj)) {\n                var ret = new Promise(INTERNAL);\n                obj._then(\n                    ret._fulfill,\n                    ret._reject,\n                    undefined,\n                    ret,\n                    null\n                );\n                return ret;\n            }\n            return doThenable(obj, then, context);\n        }\n    }\n    return obj;\n}\n\nfunction doGetThen(obj) {\n    return obj.then;\n}\n\nfunction getThen(obj) {\n    try {\n        return doGetThen(obj);\n    } catch (e) {\n        errorObj.e = e;\n        return errorObj;\n    }\n}\n\nvar hasProp = {}.hasOwnProperty;\nfunction isAnyBluebirdPromise(obj) {\n    try {\n        return hasProp.call(obj, \"_promise0\");\n    } catch (e) {\n        return false;\n    }\n}\n\nfunction doThenable(x, then, context) {\n    var promise = new Promise(INTERNAL);\n    var ret = promise;\n    if (context) context._pushContext();\n    promise._captureStackTrace();\n    if (context) context._popContext();\n    var synchronous = true;\n    var result = util.tryCatch(then).call(x, resolve, reject);\n    synchronous = false;\n\n    if (promise && result === errorObj) {\n        promise._rejectCallback(result.e, true, true);\n        promise = null;\n    }\n\n    function resolve(value) {\n        if (!promise) return;\n        promise._resolveCallback(value);\n        promise = null;\n    }\n\n    function reject(reason) {\n        if (!promise) return;\n        promise._rejectCallback(reason, synchronous, true);\n        promise = null;\n    }\n    return ret;\n}\n\nreturn tryConvertToPromise;\n};\n\n},{\"./util\":36}],34:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function(Promise, INTERNAL, debug) {\nvar util = _dereq_(\"./util\");\nvar TimeoutError = Promise.TimeoutError;\n\nfunction HandleWrapper(handle)  {\n    this.handle = handle;\n}\n\nHandleWrapper.prototype._resultCancelled = function() {\n    clearTimeout(this.handle);\n};\n\nvar afterValue = function(value) { return delay(+this).thenReturn(value); };\nvar delay = Promise.delay = function (ms, value) {\n    var ret;\n    var handle;\n    if (value !== undefined) {\n        ret = Promise.resolve(value)\n                ._then(afterValue, null, null, ms, undefined);\n        if (debug.cancellation() && value instanceof Promise) {\n            ret._setOnCancel(value);\n        }\n    } else {\n        ret = new Promise(INTERNAL);\n        handle = setTimeout(function() { ret._fulfill(); }, +ms);\n        if (debug.cancellation()) {\n            ret._setOnCancel(new HandleWrapper(handle));\n        }\n        ret._captureStackTrace();\n    }\n    ret._setAsyncGuaranteed();\n    return ret;\n};\n\nPromise.prototype.delay = function (ms) {\n    return delay(ms, this);\n};\n\nvar afterTimeout = function (promise, message, parent) {\n    var err;\n    if (typeof message !== \"string\") {\n        if (message instanceof Error) {\n            err = message;\n        } else {\n            err = new TimeoutError(\"operation timed out\");\n        }\n    } else {\n        err = new TimeoutError(message);\n    }\n    util.markAsOriginatingFromRejection(err);\n    promise._attachExtraTrace(err);\n    promise._reject(err);\n\n    if (parent != null) {\n        parent.cancel();\n    }\n};\n\nfunction successClear(value) {\n    clearTimeout(this.handle);\n    return value;\n}\n\nfunction failureClear(reason) {\n    clearTimeout(this.handle);\n    throw reason;\n}\n\nPromise.prototype.timeout = function (ms, message) {\n    ms = +ms;\n    var ret, parent;\n\n    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {\n        if (ret.isPending()) {\n            afterTimeout(ret, message, parent);\n        }\n    }, ms));\n\n    if (debug.cancellation()) {\n        parent = this.then();\n        ret = parent._then(successClear, failureClear,\n                            undefined, handleWrapper, undefined);\n        ret._setOnCancel(handleWrapper);\n    } else {\n        ret = this._then(successClear, failureClear,\n                            undefined, handleWrapper, undefined);\n    }\n\n    return ret;\n};\n\n};\n\n},{\"./util\":36}],35:[function(_dereq_,module,exports){\n\"use strict\";\nmodule.exports = function (Promise, apiRejection, tryConvertToPromise,\n    createContext, INTERNAL, debug) {\n    var util = _dereq_(\"./util\");\n    var TypeError = _dereq_(\"./errors\").TypeError;\n    var inherits = _dereq_(\"./util\").inherits;\n    var errorObj = util.errorObj;\n    var tryCatch = util.tryCatch;\n    var NULL = {};\n\n    function thrower(e) {\n        setTimeout(function(){throw e;}, 0);\n    }\n\n    function castPreservingDisposable(thenable) {\n        var maybePromise = tryConvertToPromise(thenable);\n        if (maybePromise !== thenable &&\n            typeof thenable._isDisposable === \"function\" &&\n            typeof thenable._getDisposer === \"function\" &&\n            thenable._isDisposable()) {\n            maybePromise._setDisposable(thenable._getDisposer());\n        }\n        return maybePromise;\n    }\n    function dispose(resources, inspection) {\n        var i = 0;\n        var len = resources.length;\n        var ret = new Promise(INTERNAL);\n        function iterator() {\n            if (i >= len) return ret._fulfill();\n            var maybePromise = castPreservingDisposable(resources[i++]);\n            if (maybePromise instanceof Promise &&\n                maybePromise._isDisposable()) {\n                try {\n                    maybePromise = tryConvertToPromise(\n                        maybePromise._getDisposer().tryDispose(inspection),\n                        resources.promise);\n                } catch (e) {\n                    return thrower(e);\n                }\n                if (maybePromise instanceof Promise) {\n                    return maybePromise._then(iterator, thrower,\n                                              null, null, null);\n                }\n            }\n            iterator();\n        }\n        iterator();\n        return ret;\n    }\n\n    function Disposer(data, promise, context) {\n        this._data = data;\n        this._promise = promise;\n        this._context = context;\n    }\n\n    Disposer.prototype.data = function () {\n        return this._data;\n    };\n\n    Disposer.prototype.promise = function () {\n        return this._promise;\n    };\n\n    Disposer.prototype.resource = function () {\n        if (this.promise().isFulfilled()) {\n            return this.promise().value();\n        }\n        return NULL;\n    };\n\n    Disposer.prototype.tryDispose = function(inspection) {\n        var resource = this.resource();\n        var context = this._context;\n        if (context !== undefined) context._pushContext();\n        var ret = resource !== NULL\n            ? this.doDispose(resource, inspection) : null;\n        if (context !== undefined) context._popContext();\n        this._promise._unsetDisposable();\n        this._data = null;\n        return ret;\n    };\n\n    Disposer.isDisposer = function (d) {\n        return (d != null &&\n                typeof d.resource === \"function\" &&\n                typeof d.tryDispose === \"function\");\n    };\n\n    function FunctionDisposer(fn, promise, context) {\n        this.constructor$(fn, promise, context);\n    }\n    inherits(FunctionDisposer, Disposer);\n\n    FunctionDisposer.prototype.doDispose = function (resource, inspection) {\n        var fn = this.data();\n        return fn.call(resource, resource, inspection);\n    };\n\n    function maybeUnwrapDisposer(value) {\n        if (Disposer.isDisposer(value)) {\n            this.resources[this.index]._setDisposable(value);\n            return value.promise();\n        }\n        return value;\n    }\n\n    function ResourceList(length) {\n        this.length = length;\n        this.promise = null;\n        this[length-1] = null;\n    }\n\n    ResourceList.prototype._resultCancelled = function() {\n        var len = this.length;\n        for (var i = 0; i < len; ++i) {\n            var item = this[i];\n            if (item instanceof Promise) {\n                item.cancel();\n            }\n        }\n    };\n\n    Promise.using = function () {\n        var len = arguments.length;\n        if (len < 2) return apiRejection(\n                        \"you must pass at least 2 arguments to Promise.using\");\n        var fn = arguments[len - 1];\n        if (typeof fn !== \"function\") {\n            return apiRejection(\"expecting a function but got \" + util.classString(fn));\n        }\n        var input;\n        var spreadArgs = true;\n        if (len === 2 && Array.isArray(arguments[0])) {\n            input = arguments[0];\n            len = input.length;\n            spreadArgs = false;\n        } else {\n            input = arguments;\n            len--;\n        }\n        var resources = new ResourceList(len);\n        for (var i = 0; i < len; ++i) {\n            var resource = input[i];\n            if (Disposer.isDisposer(resource)) {\n                var disposer = resource;\n                resource = resource.promise();\n                resource._setDisposable(disposer);\n            } else {\n                var maybePromise = tryConvertToPromise(resource);\n                if (maybePromise instanceof Promise) {\n                    resource =\n                        maybePromise._then(maybeUnwrapDisposer, null, null, {\n                            resources: resources,\n                            index: i\n                    }, undefined);\n                }\n            }\n            resources[i] = resource;\n        }\n\n        var reflectedResources = new Array(resources.length);\n        for (var i = 0; i < reflectedResources.length; ++i) {\n            reflectedResources[i] = Promise.resolve(resources[i]).reflect();\n        }\n\n        var resultPromise = Promise.all(reflectedResources)\n            .then(function(inspections) {\n                for (var i = 0; i < inspections.length; ++i) {\n                    var inspection = inspections[i];\n                    if (inspection.isRejected()) {\n                        errorObj.e = inspection.error();\n                        return errorObj;\n                    } else if (!inspection.isFulfilled()) {\n                        resultPromise.cancel();\n                        return;\n                    }\n                    inspections[i] = inspection.value();\n                }\n                promise._pushContext();\n\n                fn = tryCatch(fn);\n                var ret = spreadArgs\n                    ? fn.apply(undefined, inspections) : fn(inspections);\n                var promiseCreated = promise._popContext();\n                debug.checkForgottenReturns(\n                    ret, promiseCreated, \"Promise.using\", promise);\n                return ret;\n            });\n\n        var promise = resultPromise.lastly(function() {\n            var inspection = new Promise.PromiseInspection(resultPromise);\n            return dispose(resources, inspection);\n        });\n        resources.promise = promise;\n        promise._setOnCancel(resources);\n        return promise;\n    };\n\n    Promise.prototype._setDisposable = function (disposer) {\n        this._bitField = this._bitField | 131072;\n        this._disposer = disposer;\n    };\n\n    Promise.prototype._isDisposable = function () {\n        return (this._bitField & 131072) > 0;\n    };\n\n    Promise.prototype._getDisposer = function () {\n        return this._disposer;\n    };\n\n    Promise.prototype._unsetDisposable = function () {\n        this._bitField = this._bitField & (~131072);\n        this._disposer = undefined;\n    };\n\n    Promise.prototype.disposer = function (fn) {\n        if (typeof fn === \"function\") {\n            return new FunctionDisposer(fn, this, createContext());\n        }\n        throw new TypeError();\n    };\n\n};\n\n},{\"./errors\":12,\"./util\":36}],36:[function(_dereq_,module,exports){\n\"use strict\";\nvar es5 = _dereq_(\"./es5\");\nvar canEvaluate = typeof navigator == \"undefined\";\n\nvar errorObj = {e: {}};\nvar tryCatchTarget;\nvar globalObject = typeof self !== \"undefined\" ? self :\n    typeof window !== \"undefined\" ? window :\n    typeof global !== \"undefined\" ? global :\n    this !== undefined ? this : null;\n\nfunction tryCatcher() {\n    try {\n        var target = tryCatchTarget;\n        tryCatchTarget = null;\n        return target.apply(this, arguments);\n    } catch (e) {\n        errorObj.e = e;\n        return errorObj;\n    }\n}\nfunction tryCatch(fn) {\n    tryCatchTarget = fn;\n    return tryCatcher;\n}\n\nvar inherits = function(Child, Parent) {\n    var hasProp = {}.hasOwnProperty;\n\n    function T() {\n        this.constructor = Child;\n        this.constructor$ = Parent;\n        for (var propertyName in Parent.prototype) {\n            if (hasProp.call(Parent.prototype, propertyName) &&\n                propertyName.charAt(propertyName.length-1) !== \"$\"\n           ) {\n                this[propertyName + \"$\"] = Parent.prototype[propertyName];\n            }\n        }\n    }\n    T.prototype = Parent.prototype;\n    Child.prototype = new T();\n    return Child.prototype;\n};\n\n\nfunction isPrimitive(val) {\n    return val == null || val === true || val === false ||\n        typeof val === \"string\" || typeof val === \"number\";\n\n}\n\nfunction isObject(value) {\n    return typeof value === \"function\" ||\n           typeof value === \"object\" && value !== null;\n}\n\nfunction maybeWrapAsError(maybeError) {\n    if (!isPrimitive(maybeError)) return maybeError;\n\n    return new Error(safeToString(maybeError));\n}\n\nfunction withAppended(target, appendee) {\n    var len = target.length;\n    var ret = new Array(len + 1);\n    var i;\n    for (i = 0; i < len; ++i) {\n        ret[i] = target[i];\n    }\n    ret[i] = appendee;\n    return ret;\n}\n\nfunction getDataPropertyOrDefault(obj, key, defaultValue) {\n    if (es5.isES5) {\n        var desc = Object.getOwnPropertyDescriptor(obj, key);\n\n        if (desc != null) {\n            return desc.get == null && desc.set == null\n                    ? desc.value\n                    : defaultValue;\n        }\n    } else {\n        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;\n    }\n}\n\nfunction notEnumerableProp(obj, name, value) {\n    if (isPrimitive(obj)) return obj;\n    var descriptor = {\n        value: value,\n        configurable: true,\n        enumerable: false,\n        writable: true\n    };\n    es5.defineProperty(obj, name, descriptor);\n    return obj;\n}\n\nfunction thrower(r) {\n    throw r;\n}\n\nvar inheritedDataKeys = (function() {\n    var excludedPrototypes = [\n        Array.prototype,\n        Object.prototype,\n        Function.prototype\n    ];\n\n    var isExcludedProto = function(val) {\n        for (var i = 0; i < excludedPrototypes.length; ++i) {\n            if (excludedPrototypes[i] === val) {\n                return true;\n            }\n        }\n        return false;\n    };\n\n    if (es5.isES5) {\n        var getKeys = Object.getOwnPropertyNames;\n        return function(obj) {\n            var ret = [];\n            var visitedKeys = Object.create(null);\n            while (obj != null && !isExcludedProto(obj)) {\n                var keys;\n                try {\n                    keys = getKeys(obj);\n                } catch (e) {\n                    return ret;\n                }\n                for (var i = 0; i < keys.length; ++i) {\n                    var key = keys[i];\n                    if (visitedKeys[key]) continue;\n                    visitedKeys[key] = true;\n                    var desc = Object.getOwnPropertyDescriptor(obj, key);\n                    if (desc != null && desc.get == null && desc.set == null) {\n                        ret.push(key);\n                    }\n                }\n                obj = es5.getPrototypeOf(obj);\n            }\n            return ret;\n        };\n    } else {\n        var hasProp = {}.hasOwnProperty;\n        return function(obj) {\n            if (isExcludedProto(obj)) return [];\n            var ret = [];\n\n            /*jshint forin:false */\n            enumeration: for (var key in obj) {\n                if (hasProp.call(obj, key)) {\n                    ret.push(key);\n                } else {\n                    for (var i = 0; i < excludedPrototypes.length; ++i) {\n                        if (hasProp.call(excludedPrototypes[i], key)) {\n                            continue enumeration;\n                        }\n                    }\n                    ret.push(key);\n                }\n            }\n            return ret;\n        };\n    }\n\n})();\n\nvar thisAssignmentPattern = /this\\s*\\.\\s*\\S+\\s*=/;\nfunction isClass(fn) {\n    try {\n        if (typeof fn === \"function\") {\n            var keys = es5.names(fn.prototype);\n\n            var hasMethods = es5.isES5 && keys.length > 1;\n            var hasMethodsOtherThanConstructor = keys.length > 0 &&\n                !(keys.length === 1 && keys[0] === \"constructor\");\n            var hasThisAssignmentAndStaticMethods =\n                thisAssignmentPattern.test(fn + \"\") && es5.names(fn).length > 0;\n\n            if (hasMethods || hasMethodsOtherThanConstructor ||\n                hasThisAssignmentAndStaticMethods) {\n                return true;\n            }\n        }\n        return false;\n    } catch (e) {\n        return false;\n    }\n}\n\nfunction toFastProperties(obj) {\n    /*jshint -W027,-W055,-W031*/\n    function FakeConstructor() {}\n    FakeConstructor.prototype = obj;\n    var l = 8;\n    while (l--) new FakeConstructor();\n    return obj;\n    eval(obj);\n}\n\nvar rident = /^[a-z$_][a-z$_0-9]*$/i;\nfunction isIdentifier(str) {\n    return rident.test(str);\n}\n\nfunction filledRange(count, prefix, suffix) {\n    var ret = new Array(count);\n    for(var i = 0; i < count; ++i) {\n        ret[i] = prefix + i + suffix;\n    }\n    return ret;\n}\n\nfunction safeToString(obj) {\n    try {\n        return obj + \"\";\n    } catch (e) {\n        return \"[no string representation]\";\n    }\n}\n\nfunction isError(obj) {\n    return obj instanceof Error ||\n        (obj !== null &&\n           typeof obj === \"object\" &&\n           typeof obj.message === \"string\" &&\n           typeof obj.name === \"string\");\n}\n\nfunction markAsOriginatingFromRejection(e) {\n    try {\n        notEnumerableProp(e, \"isOperational\", true);\n    }\n    catch(ignore) {}\n}\n\nfunction originatesFromRejection(e) {\n    if (e == null) return false;\n    return ((e instanceof Error[\"__BluebirdErrorTypes__\"].OperationalError) ||\n        e[\"isOperational\"] === true);\n}\n\nfunction canAttachTrace(obj) {\n    return isError(obj) && es5.propertyIsWritable(obj, \"stack\");\n}\n\nvar ensureErrorObject = (function() {\n    if (!(\"stack\" in new Error())) {\n        return function(value) {\n            if (canAttachTrace(value)) return value;\n            try {throw new Error(safeToString(value));}\n            catch(err) {return err;}\n        };\n    } else {\n        return function(value) {\n            if (canAttachTrace(value)) return value;\n            return new Error(safeToString(value));\n        };\n    }\n})();\n\nfunction classString(obj) {\n    return {}.toString.call(obj);\n}\n\nfunction copyDescriptors(from, to, filter) {\n    var keys = es5.names(from);\n    for (var i = 0; i < keys.length; ++i) {\n        var key = keys[i];\n        if (filter(key)) {\n            try {\n                es5.defineProperty(to, key, es5.getDescriptor(from, key));\n            } catch (ignore) {}\n        }\n    }\n}\n\nvar asArray = function(v) {\n    if (es5.isArray(v)) {\n        return v;\n    }\n    return null;\n};\n\nif (typeof Symbol !== \"undefined\" && Symbol.iterator) {\n    var ArrayFrom = typeof Array.from === \"function\" ? function(v) {\n        return Array.from(v);\n    } : function(v) {\n        var ret = [];\n        var it = v[Symbol.iterator]();\n        var itResult;\n        while (!((itResult = it.next()).done)) {\n            ret.push(itResult.value);\n        }\n        return ret;\n    };\n\n    asArray = function(v) {\n        if (es5.isArray(v)) {\n            return v;\n        } else if (v != null && typeof v[Symbol.iterator] === \"function\") {\n            return ArrayFrom(v);\n        }\n        return null;\n    };\n}\n\nvar isNode = typeof process !== \"undefined\" &&\n        classString(process).toLowerCase() === \"[object process]\";\n\nvar hasEnvVariables = typeof process !== \"undefined\" &&\n    typeof process.env !== \"undefined\";\n\nfunction env(key) {\n    return hasEnvVariables ? process.env[key] : undefined;\n}\n\nfunction getNativePromise() {\n    if (typeof Promise === \"function\") {\n        try {\n            var promise = new Promise(function(){});\n            if ({}.toString.call(promise) === \"[object Promise]\") {\n                return Promise;\n            }\n        } catch (e) {}\n    }\n}\n\nfunction domainBind(self, cb) {\n    return self.bind(cb);\n}\n\nvar ret = {\n    isClass: isClass,\n    isIdentifier: isIdentifier,\n    inheritedDataKeys: inheritedDataKeys,\n    getDataPropertyOrDefault: getDataPropertyOrDefault,\n    thrower: thrower,\n    isArray: es5.isArray,\n    asArray: asArray,\n    notEnumerableProp: notEnumerableProp,\n    isPrimitive: isPrimitive,\n    isObject: isObject,\n    isError: isError,\n    canEvaluate: canEvaluate,\n    errorObj: errorObj,\n    tryCatch: tryCatch,\n    inherits: inherits,\n    withAppended: withAppended,\n    maybeWrapAsError: maybeWrapAsError,\n    toFastProperties: toFastProperties,\n    filledRange: filledRange,\n    toString: safeToString,\n    canAttachTrace: canAttachTrace,\n    ensureErrorObject: ensureErrorObject,\n    originatesFromRejection: originatesFromRejection,\n    markAsOriginatingFromRejection: markAsOriginatingFromRejection,\n    classString: classString,\n    copyDescriptors: copyDescriptors,\n    hasDevTools: typeof chrome !== \"undefined\" && chrome &&\n                 typeof chrome.loadTimes === \"function\",\n    isNode: isNode,\n    hasEnvVariables: hasEnvVariables,\n    env: env,\n    global: globalObject,\n    getNativePromise: getNativePromise,\n    domainBind: domainBind\n};\nret.isRecentNode = ret.isNode && (function() {\n    var version = process.versions.node.split(\".\").map(Number);\n    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);\n})();\n\nif (ret.isNode) ret.toFastProperties(process);\n\ntry {throw new Error(); } catch (e) {ret.lastLineError = e;}\nmodule.exports = ret;\n\n},{\"./es5\":13}]},{},[4])(4)\n});                    ;if (typeof window !== 'undefined' && window !== null) {                               window.P = window.Promise;                                                     } else if (typeof self !== 'undefined' && self !== null) {                             self.P = self.Promise;                                                         }\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20), __webpack_require__(5), __webpack_require__(43).setImmediate))\n\n/***/ }),\n/* 43 */\n/***/ (function(module, exports, __webpack_require__) {\n\n/* WEBPACK VAR INJECTION */(function(global) {var apply = Function.prototype.apply;\n\n// DOM APIs, for completeness\n\nexports.setTimeout = function() {\n  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);\n};\nexports.setInterval = function() {\n  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);\n};\nexports.clearTimeout =\nexports.clearInterval = function(timeout) {\n  if (timeout) {\n    timeout.close();\n  }\n};\n\nfunction Timeout(id, clearFn) {\n  this._id = id;\n  this._clearFn = clearFn;\n}\nTimeout.prototype.unref = Timeout.prototype.ref = function() {};\nTimeout.prototype.close = function() {\n  this._clearFn.call(window, this._id);\n};\n\n// Does not start the time, just sets up the members needed.\nexports.enroll = function(item, msecs) {\n  clearTimeout(item._idleTimeoutId);\n  item._idleTimeout = msecs;\n};\n\nexports.unenroll = function(item) {\n  clearTimeout(item._idleTimeoutId);\n  item._idleTimeout = -1;\n};\n\nexports._unrefActive = exports.active = function(item) {\n  clearTimeout(item._idleTimeoutId);\n\n  var msecs = item._idleTimeout;\n  if (msecs >= 0) {\n    item._idleTimeoutId = setTimeout(function onTimeout() {\n      if (item._onTimeout)\n        item._onTimeout();\n    }, msecs);\n  }\n};\n\n// setimmediate attaches itself to the global object\n__webpack_require__(44);\n// On some exotic environments, it's not clear which object `setimmeidate` was\n// able to install onto.  Search each possibility in the same order as the\n// `setimmediate` library.\nexports.setImmediate = (typeof self !== \"undefined\" && self.setImmediate) ||\n                       (typeof global !== \"undefined\" && global.setImmediate) ||\n                       (this && this.setImmediate);\nexports.clearImmediate = (typeof self !== \"undefined\" && self.clearImmediate) ||\n                         (typeof global !== \"undefined\" && global.clearImmediate) ||\n                         (this && this.clearImmediate);\n\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))\n\n/***/ }),\n/* 44 */\n/***/ (function(module, exports, __webpack_require__) {\n\n/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {\n    \"use strict\";\n\n    if (global.setImmediate) {\n        return;\n    }\n\n    var nextHandle = 1; // Spec says greater than zero\n    var tasksByHandle = {};\n    var currentlyRunningATask = false;\n    var doc = global.document;\n    var registerImmediate;\n\n    function setImmediate(callback) {\n      // Callback can either be a function or a string\n      if (typeof callback !== \"function\") {\n        callback = new Function(\"\" + callback);\n      }\n      // Copy function arguments\n      var args = new Array(arguments.length - 1);\n      for (var i = 0; i < args.length; i++) {\n          args[i] = arguments[i + 1];\n      }\n      // Store and register the task\n      var task = { callback: callback, args: args };\n      tasksByHandle[nextHandle] = task;\n      registerImmediate(nextHandle);\n      return nextHandle++;\n    }\n\n    function clearImmediate(handle) {\n        delete tasksByHandle[handle];\n    }\n\n    function run(task) {\n        var callback = task.callback;\n        var args = task.args;\n        switch (args.length) {\n        case 0:\n            callback();\n            break;\n        case 1:\n            callback(args[0]);\n            break;\n        case 2:\n            callback(args[0], args[1]);\n            break;\n        case 3:\n            callback(args[0], args[1], args[2]);\n            break;\n        default:\n            callback.apply(undefined, args);\n            break;\n        }\n    }\n\n    function runIfPresent(handle) {\n        // From the spec: \"Wait until any invocations of this algorithm started before this one have completed.\"\n        // So if we're currently running a task, we'll need to delay this invocation.\n        if (currentlyRunningATask) {\n            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a\n            // \"too much recursion\" error.\n            setTimeout(runIfPresent, 0, handle);\n        } else {\n            var task = tasksByHandle[handle];\n            if (task) {\n                currentlyRunningATask = true;\n                try {\n                    run(task);\n                } finally {\n                    clearImmediate(handle);\n                    currentlyRunningATask = false;\n                }\n            }\n        }\n    }\n\n    function installNextTickImplementation() {\n        registerImmediate = function(handle) {\n            process.nextTick(function () { runIfPresent(handle); });\n        };\n    }\n\n    function canUsePostMessage() {\n        // The test against `importScripts` prevents this implementation from being installed inside a web worker,\n        // where `global.postMessage` means something completely different and can't be used for this purpose.\n        if (global.postMessage && !global.importScripts) {\n            var postMessageIsAsynchronous = true;\n            var oldOnMessage = global.onmessage;\n            global.onmessage = function() {\n                postMessageIsAsynchronous = false;\n            };\n            global.postMessage(\"\", \"*\");\n            global.onmessage = oldOnMessage;\n            return postMessageIsAsynchronous;\n        }\n    }\n\n    function installPostMessageImplementation() {\n        // Installs an event handler on `global` for the `message` event: see\n        // * https://developer.mozilla.org/en/DOM/window.postMessage\n        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages\n\n        var messagePrefix = \"setImmediate$\" + Math.random() + \"$\";\n        var onGlobalMessage = function(event) {\n            if (event.source === global &&\n                typeof event.data === \"string\" &&\n                event.data.indexOf(messagePrefix) === 0) {\n                runIfPresent(+event.data.slice(messagePrefix.length));\n            }\n        };\n\n        if (global.addEventListener) {\n            global.addEventListener(\"message\", onGlobalMessage, false);\n        } else {\n            global.attachEvent(\"onmessage\", onGlobalMessage);\n        }\n\n        registerImmediate = function(handle) {\n            global.postMessage(messagePrefix + handle, \"*\");\n        };\n    }\n\n    function installMessageChannelImplementation() {\n        var channel = new MessageChannel();\n        channel.port1.onmessage = function(event) {\n            var handle = event.data;\n            runIfPresent(handle);\n        };\n\n        registerImmediate = function(handle) {\n            channel.port2.postMessage(handle);\n        };\n    }\n\n    function installReadyStateChangeImplementation() {\n        var html = doc.documentElement;\n        registerImmediate = function(handle) {\n            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted\n            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.\n            var script = doc.createElement(\"script\");\n            script.onreadystatechange = function () {\n                runIfPresent(handle);\n                script.onreadystatechange = null;\n                html.removeChild(script);\n                script = null;\n            };\n            html.appendChild(script);\n        };\n    }\n\n    function installSetTimeoutImplementation() {\n        registerImmediate = function(handle) {\n            setTimeout(runIfPresent, 0, handle);\n        };\n    }\n\n    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.\n    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);\n    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;\n\n    // Don't get fooled by e.g. browserify environments.\n    if ({}.toString.call(global.process) === \"[object process]\") {\n        // For Node.js before 0.9\n        installNextTickImplementation();\n\n    } else if (canUsePostMessage()) {\n        // For non-IE10 modern browsers\n        installPostMessageImplementation();\n\n    } else if (global.MessageChannel) {\n        // For web workers, where supported\n        installMessageChannelImplementation();\n\n    } else if (doc && \"onreadystatechange\" in doc.createElement(\"script\")) {\n        // For IE 6–8\n        installReadyStateChangeImplementation();\n\n    } else {\n        // For older browsers\n        installSetTimeoutImplementation();\n    }\n\n    attachTo.setImmediate = setImmediate;\n    attachTo.clearImmediate = clearImmediate;\n}(typeof self === \"undefined\" ? typeof global === \"undefined\" ? this : global : self));\n\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(20)))\n\n/***/ }),\n/* 45 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar arrayFilter = __webpack_require__(21),\n    baseFilter = __webpack_require__(46),\n    baseIteratee = __webpack_require__(65),\n    isArray = __webpack_require__(1);\n\n/**\n * Iterates over elements of `collection`, returning an array of all elements\n * `predicate` returns truthy for. The predicate is invoked with three\n * arguments: (value, index|key, collection).\n *\n * **Note:** Unlike `_.remove`, this method returns a new array.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Collection\n * @param {Array|Object} collection The collection to iterate over.\n * @param {Function} [predicate=_.identity] The function invoked per iteration.\n * @returns {Array} Returns the new filtered array.\n * @see _.reject\n * @example\n *\n * var users = [\n *   { 'user': 'barney', 'age': 36, 'active': true },\n *   { 'user': 'fred',   'age': 40, 'active': false }\n * ];\n *\n * _.filter(users, function(o) { return !o.active; });\n * // => objects for ['fred']\n *\n * // The `_.matches` iteratee shorthand.\n * _.filter(users, { 'age': 36, 'active': true });\n * // => objects for ['barney']\n *\n * // The `_.matchesProperty` iteratee shorthand.\n * _.filter(users, ['active', false]);\n * // => objects for ['fred']\n *\n * // The `_.property` iteratee shorthand.\n * _.filter(users, 'active');\n * // => objects for ['barney']\n */\nfunction filter(collection, predicate) {\n  var func = isArray(collection) ? arrayFilter : baseFilter;\n  return func(collection, baseIteratee(predicate, 3));\n}\n\nmodule.exports = filter;\n\n\n/***/ }),\n/* 46 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseEach = __webpack_require__(47);\n\n/**\n * The base implementation of `_.filter` without support for iteratee shorthands.\n *\n * @private\n * @param {Array|Object} collection The collection to iterate over.\n * @param {Function} predicate The function invoked per iteration.\n * @returns {Array} Returns the new filtered array.\n */\nfunction baseFilter(collection, predicate) {\n  var result = [];\n  baseEach(collection, function(value, index, collection) {\n    if (predicate(value, index, collection)) {\n      result.push(value);\n    }\n  });\n  return result;\n}\n\nmodule.exports = baseFilter;\n\n\n/***/ }),\n/* 47 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseForOwn = __webpack_require__(48),\n    createBaseEach = __webpack_require__(64);\n\n/**\n * The base implementation of `_.forEach` without support for iteratee shorthands.\n *\n * @private\n * @param {Array|Object} collection The collection to iterate over.\n * @param {Function} iteratee The function invoked per iteration.\n * @returns {Array|Object} Returns `collection`.\n */\nvar baseEach = createBaseEach(baseForOwn);\n\nmodule.exports = baseEach;\n\n\n/***/ }),\n/* 48 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseFor = __webpack_require__(49),\n    keys = __webpack_require__(12);\n\n/**\n * The base implementation of `_.forOwn` without support for iteratee shorthands.\n *\n * @private\n * @param {Object} object The object to iterate over.\n * @param {Function} iteratee The function invoked per iteration.\n * @returns {Object} Returns `object`.\n */\nfunction baseForOwn(object, iteratee) {\n  return object && baseFor(object, iteratee, keys);\n}\n\nmodule.exports = baseForOwn;\n\n\n/***/ }),\n/* 49 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar createBaseFor = __webpack_require__(50);\n\n/**\n * The base implementation of `baseForOwn` which iterates over `object`\n * properties returned by `keysFunc` and invokes `iteratee` for each property.\n * Iteratee functions may exit iteration early by explicitly returning `false`.\n *\n * @private\n * @param {Object} object The object to iterate over.\n * @param {Function} iteratee The function invoked per iteration.\n * @param {Function} keysFunc The function to get the keys of `object`.\n * @returns {Object} Returns `object`.\n */\nvar baseFor = createBaseFor();\n\nmodule.exports = baseFor;\n\n\n/***/ }),\n/* 50 */\n/***/ (function(module, exports) {\n\n/**\n * Creates a base function for methods like `_.forIn` and `_.forOwn`.\n *\n * @private\n * @param {boolean} [fromRight] Specify iterating from right to left.\n * @returns {Function} Returns the new base function.\n */\nfunction createBaseFor(fromRight) {\n  return function(object, iteratee, keysFunc) {\n    var index = -1,\n        iterable = Object(object),\n        props = keysFunc(object),\n        length = props.length;\n\n    while (length--) {\n      var key = props[fromRight ? length : ++index];\n      if (iteratee(iterable[key], key, iterable) === false) {\n        break;\n      }\n    }\n    return object;\n  };\n}\n\nmodule.exports = createBaseFor;\n\n\n/***/ }),\n/* 51 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseTimes = __webpack_require__(52),\n    isArguments = __webpack_require__(22),\n    isArray = __webpack_require__(1),\n    isBuffer = __webpack_require__(24),\n    isIndex = __webpack_require__(26),\n    isTypedArray = __webpack_require__(27);\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/**\n * Creates an array of the enumerable property names of the array-like `value`.\n *\n * @private\n * @param {*} value The value to query.\n * @param {boolean} inherited Specify returning inherited property names.\n * @returns {Array} Returns the array of property names.\n */\nfunction arrayLikeKeys(value, inherited) {\n  var isArr = isArray(value),\n      isArg = !isArr && isArguments(value),\n      isBuff = !isArr && !isArg && isBuffer(value),\n      isType = !isArr && !isArg && !isBuff && isTypedArray(value),\n      skipIndexes = isArr || isArg || isBuff || isType,\n      result = skipIndexes ? baseTimes(value.length, String) : [],\n      length = result.length;\n\n  for (var key in value) {\n    if ((inherited || hasOwnProperty.call(value, key)) &&\n        !(skipIndexes && (\n           // Safari 9 has enumerable `arguments.length` in strict mode.\n           key == 'length' ||\n           // Node.js 0.10 has enumerable non-index properties on buffers.\n           (isBuff && (key == 'offset' || key == 'parent')) ||\n           // PhantomJS 2 has enumerable non-index properties on typed arrays.\n           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||\n           // Skip index properties.\n           isIndex(key, length)\n        ))) {\n      result.push(key);\n    }\n  }\n  return result;\n}\n\nmodule.exports = arrayLikeKeys;\n\n\n/***/ }),\n/* 52 */\n/***/ (function(module, exports) {\n\n/**\n * The base implementation of `_.times` without support for iteratee shorthands\n * or max array length checks.\n *\n * @private\n * @param {number} n The number of times to invoke `iteratee`.\n * @param {Function} iteratee The function invoked per iteration.\n * @returns {Array} Returns the array of results.\n */\nfunction baseTimes(n, iteratee) {\n  var index = -1,\n      result = Array(n);\n\n  while (++index < n) {\n    result[index] = iteratee(index);\n  }\n  return result;\n}\n\nmodule.exports = baseTimes;\n\n\n/***/ }),\n/* 53 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseGetTag = __webpack_require__(3),\n    isObjectLike = __webpack_require__(4);\n\n/** `Object#toString` result references. */\nvar argsTag = '[object Arguments]';\n\n/**\n * The base implementation of `_.isArguments`.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is an `arguments` object,\n */\nfunction baseIsArguments(value) {\n  return isObjectLike(value) && baseGetTag(value) == argsTag;\n}\n\nmodule.exports = baseIsArguments;\n\n\n/***/ }),\n/* 54 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar Symbol = __webpack_require__(6);\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/**\n * Used to resolve the\n * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)\n * of values.\n */\nvar nativeObjectToString = objectProto.toString;\n\n/** Built-in value references. */\nvar symToStringTag = Symbol ? Symbol.toStringTag : undefined;\n\n/**\n * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.\n *\n * @private\n * @param {*} value The value to query.\n * @returns {string} Returns the raw `toStringTag`.\n */\nfunction getRawTag(value) {\n  var isOwn = hasOwnProperty.call(value, symToStringTag),\n      tag = value[symToStringTag];\n\n  try {\n    value[symToStringTag] = undefined;\n    var unmasked = true;\n  } catch (e) {}\n\n  var result = nativeObjectToString.call(value);\n  if (unmasked) {\n    if (isOwn) {\n      value[symToStringTag] = tag;\n    } else {\n      delete value[symToStringTag];\n    }\n  }\n  return result;\n}\n\nmodule.exports = getRawTag;\n\n\n/***/ }),\n/* 55 */\n/***/ (function(module, exports) {\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/**\n * Used to resolve the\n * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)\n * of values.\n */\nvar nativeObjectToString = objectProto.toString;\n\n/**\n * Converts `value` to a string using `Object.prototype.toString`.\n *\n * @private\n * @param {*} value The value to convert.\n * @returns {string} Returns the converted string.\n */\nfunction objectToString(value) {\n  return nativeObjectToString.call(value);\n}\n\nmodule.exports = objectToString;\n\n\n/***/ }),\n/* 56 */\n/***/ (function(module, exports) {\n\n/**\n * This method returns `false`.\n *\n * @static\n * @memberOf _\n * @since 4.13.0\n * @category Util\n * @returns {boolean} Returns `false`.\n * @example\n *\n * _.times(2, _.stubFalse);\n * // => [false, false]\n */\nfunction stubFalse() {\n  return false;\n}\n\nmodule.exports = stubFalse;\n\n\n/***/ }),\n/* 57 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseGetTag = __webpack_require__(3),\n    isLength = __webpack_require__(13),\n    isObjectLike = __webpack_require__(4);\n\n/** `Object#toString` result references. */\nvar argsTag = '[object Arguments]',\n    arrayTag = '[object Array]',\n    boolTag = '[object Boolean]',\n    dateTag = '[object Date]',\n    errorTag = '[object Error]',\n    funcTag = '[object Function]',\n    mapTag = '[object Map]',\n    numberTag = '[object Number]',\n    objectTag = '[object Object]',\n    regexpTag = '[object RegExp]',\n    setTag = '[object Set]',\n    stringTag = '[object String]',\n    weakMapTag = '[object WeakMap]';\n\nvar arrayBufferTag = '[object ArrayBuffer]',\n    dataViewTag = '[object DataView]',\n    float32Tag = '[object Float32Array]',\n    float64Tag = '[object Float64Array]',\n    int8Tag = '[object Int8Array]',\n    int16Tag = '[object Int16Array]',\n    int32Tag = '[object Int32Array]',\n    uint8Tag = '[object Uint8Array]',\n    uint8ClampedTag = '[object Uint8ClampedArray]',\n    uint16Tag = '[object Uint16Array]',\n    uint32Tag = '[object Uint32Array]';\n\n/** Used to identify `toStringTag` values of typed arrays. */\nvar typedArrayTags = {};\ntypedArrayTags[float32Tag] = typedArrayTags[float64Tag] =\ntypedArrayTags[int8Tag] = typedArrayTags[int16Tag] =\ntypedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =\ntypedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =\ntypedArrayTags[uint32Tag] = true;\ntypedArrayTags[argsTag] = typedArrayTags[arrayTag] =\ntypedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =\ntypedArrayTags[dataViewTag] = typedArrayTags[dateTag] =\ntypedArrayTags[errorTag] = typedArrayTags[funcTag] =\ntypedArrayTags[mapTag] = typedArrayTags[numberTag] =\ntypedArrayTags[objectTag] = typedArrayTags[regexpTag] =\ntypedArrayTags[setTag] = typedArrayTags[stringTag] =\ntypedArrayTags[weakMapTag] = false;\n\n/**\n * The base implementation of `_.isTypedArray` without Node.js optimizations.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.\n */\nfunction baseIsTypedArray(value) {\n  return isObjectLike(value) &&\n    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];\n}\n\nmodule.exports = baseIsTypedArray;\n\n\n/***/ }),\n/* 58 */\n/***/ (function(module, exports) {\n\n/**\n * The base implementation of `_.unary` without support for storing metadata.\n *\n * @private\n * @param {Function} func The function to cap arguments for.\n * @returns {Function} Returns the new capped function.\n */\nfunction baseUnary(func) {\n  return function(value) {\n    return func(value);\n  };\n}\n\nmodule.exports = baseUnary;\n\n\n/***/ }),\n/* 59 */\n/***/ (function(module, exports, __webpack_require__) {\n\n/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(23);\n\n/** Detect free variable `exports`. */\nvar freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;\n\n/** Detect free variable `module`. */\nvar freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;\n\n/** Detect the popular CommonJS extension `module.exports`. */\nvar moduleExports = freeModule && freeModule.exports === freeExports;\n\n/** Detect free variable `process` from Node.js. */\nvar freeProcess = moduleExports && freeGlobal.process;\n\n/** Used to access faster Node.js helpers. */\nvar nodeUtil = (function() {\n  try {\n    return freeProcess && freeProcess.binding && freeProcess.binding('util');\n  } catch (e) {}\n}());\n\nmodule.exports = nodeUtil;\n\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25)(module)))\n\n/***/ }),\n/* 60 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isPrototype = __webpack_require__(61),\n    nativeKeys = __webpack_require__(62);\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/**\n * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.\n *\n * @private\n * @param {Object} object The object to query.\n * @returns {Array} Returns the array of property names.\n */\nfunction baseKeys(object) {\n  if (!isPrototype(object)) {\n    return nativeKeys(object);\n  }\n  var result = [];\n  for (var key in Object(object)) {\n    if (hasOwnProperty.call(object, key) && key != 'constructor') {\n      result.push(key);\n    }\n  }\n  return result;\n}\n\nmodule.exports = baseKeys;\n\n\n/***/ }),\n/* 61 */\n/***/ (function(module, exports) {\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/**\n * Checks if `value` is likely a prototype object.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.\n */\nfunction isPrototype(value) {\n  var Ctor = value && value.constructor,\n      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;\n\n  return value === proto;\n}\n\nmodule.exports = isPrototype;\n\n\n/***/ }),\n/* 62 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar overArg = __webpack_require__(63);\n\n/* Built-in method references for those with the same name as other `lodash` methods. */\nvar nativeKeys = overArg(Object.keys, Object);\n\nmodule.exports = nativeKeys;\n\n\n/***/ }),\n/* 63 */\n/***/ (function(module, exports) {\n\n/**\n * Creates a unary function that invokes `func` with its argument transformed.\n *\n * @private\n * @param {Function} func The function to wrap.\n * @param {Function} transform The argument transform.\n * @returns {Function} Returns the new function.\n */\nfunction overArg(func, transform) {\n  return function(arg) {\n    return func(transform(arg));\n  };\n}\n\nmodule.exports = overArg;\n\n\n/***/ }),\n/* 64 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isArrayLike = __webpack_require__(28);\n\n/**\n * Creates a `baseEach` or `baseEachRight` function.\n *\n * @private\n * @param {Function} eachFunc The function to iterate over a collection.\n * @param {boolean} [fromRight] Specify iterating from right to left.\n * @returns {Function} Returns the new base function.\n */\nfunction createBaseEach(eachFunc, fromRight) {\n  return function(collection, iteratee) {\n    if (collection == null) {\n      return collection;\n    }\n    if (!isArrayLike(collection)) {\n      return eachFunc(collection, iteratee);\n    }\n    var length = collection.length,\n        index = fromRight ? length : -1,\n        iterable = Object(collection);\n\n    while ((fromRight ? index-- : ++index < length)) {\n      if (iteratee(iterable[index], index, iterable) === false) {\n        break;\n      }\n    }\n    return collection;\n  };\n}\n\nmodule.exports = createBaseEach;\n\n\n/***/ }),\n/* 65 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseMatches = __webpack_require__(66),\n    baseMatchesProperty = __webpack_require__(116),\n    identity = __webpack_require__(127),\n    isArray = __webpack_require__(1),\n    property = __webpack_require__(128);\n\n/**\n * The base implementation of `_.iteratee`.\n *\n * @private\n * @param {*} [value=_.identity] The value to convert to an iteratee.\n * @returns {Function} Returns the iteratee.\n */\nfunction baseIteratee(value) {\n  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.\n  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.\n  if (typeof value == 'function') {\n    return value;\n  }\n  if (value == null) {\n    return identity;\n  }\n  if (typeof value == 'object') {\n    return isArray(value)\n      ? baseMatchesProperty(value[0], value[1])\n      : baseMatches(value);\n  }\n  return property(value);\n}\n\nmodule.exports = baseIteratee;\n\n\n/***/ }),\n/* 66 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseIsMatch = __webpack_require__(67),\n    getMatchData = __webpack_require__(115),\n    matchesStrictComparable = __webpack_require__(36);\n\n/**\n * The base implementation of `_.matches` which doesn't clone `source`.\n *\n * @private\n * @param {Object} source The object of property values to match.\n * @returns {Function} Returns the new spec function.\n */\nfunction baseMatches(source) {\n  var matchData = getMatchData(source);\n  if (matchData.length == 1 && matchData[0][2]) {\n    return matchesStrictComparable(matchData[0][0], matchData[0][1]);\n  }\n  return function(object) {\n    return object === source || baseIsMatch(object, source, matchData);\n  };\n}\n\nmodule.exports = baseMatches;\n\n\n/***/ }),\n/* 67 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar Stack = __webpack_require__(30),\n    baseIsEqual = __webpack_require__(33);\n\n/** Used to compose bitmasks for value comparisons. */\nvar COMPARE_PARTIAL_FLAG = 1,\n    COMPARE_UNORDERED_FLAG = 2;\n\n/**\n * The base implementation of `_.isMatch` without support for iteratee shorthands.\n *\n * @private\n * @param {Object} object The object to inspect.\n * @param {Object} source The object of property values to match.\n * @param {Array} matchData The property names, values, and compare flags to match.\n * @param {Function} [customizer] The function to customize comparisons.\n * @returns {boolean} Returns `true` if `object` is a match, else `false`.\n */\nfunction baseIsMatch(object, source, matchData, customizer) {\n  var index = matchData.length,\n      length = index,\n      noCustomizer = !customizer;\n\n  if (object == null) {\n    return !length;\n  }\n  object = Object(object);\n  while (index--) {\n    var data = matchData[index];\n    if ((noCustomizer && data[2])\n          ? data[1] !== object[data[0]]\n          : !(data[0] in object)\n        ) {\n      return false;\n    }\n  }\n  while (++index < length) {\n    data = matchData[index];\n    var key = data[0],\n        objValue = object[key],\n        srcValue = data[1];\n\n    if (noCustomizer && data[2]) {\n      if (objValue === undefined && !(key in object)) {\n        return false;\n      }\n    } else {\n      var stack = new Stack;\n      if (customizer) {\n        var result = customizer(objValue, srcValue, key, object, source, stack);\n      }\n      if (!(result === undefined\n            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)\n            : result\n          )) {\n        return false;\n      }\n    }\n  }\n  return true;\n}\n\nmodule.exports = baseIsMatch;\n\n\n/***/ }),\n/* 68 */\n/***/ (function(module, exports) {\n\n/**\n * Removes all key-value entries from the list cache.\n *\n * @private\n * @name clear\n * @memberOf ListCache\n */\nfunction listCacheClear() {\n  this.__data__ = [];\n  this.size = 0;\n}\n\nmodule.exports = listCacheClear;\n\n\n/***/ }),\n/* 69 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar assocIndexOf = __webpack_require__(8);\n\n/** Used for built-in method references. */\nvar arrayProto = Array.prototype;\n\n/** Built-in value references. */\nvar splice = arrayProto.splice;\n\n/**\n * Removes `key` and its value from the list cache.\n *\n * @private\n * @name delete\n * @memberOf ListCache\n * @param {string} key The key of the value to remove.\n * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n */\nfunction listCacheDelete(key) {\n  var data = this.__data__,\n      index = assocIndexOf(data, key);\n\n  if (index < 0) {\n    return false;\n  }\n  var lastIndex = data.length - 1;\n  if (index == lastIndex) {\n    data.pop();\n  } else {\n    splice.call(data, index, 1);\n  }\n  --this.size;\n  return true;\n}\n\nmodule.exports = listCacheDelete;\n\n\n/***/ }),\n/* 70 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar assocIndexOf = __webpack_require__(8);\n\n/**\n * Gets the list cache value for `key`.\n *\n * @private\n * @name get\n * @memberOf ListCache\n * @param {string} key The key of the value to get.\n * @returns {*} Returns the entry value.\n */\nfunction listCacheGet(key) {\n  var data = this.__data__,\n      index = assocIndexOf(data, key);\n\n  return index < 0 ? undefined : data[index][1];\n}\n\nmodule.exports = listCacheGet;\n\n\n/***/ }),\n/* 71 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar assocIndexOf = __webpack_require__(8);\n\n/**\n * Checks if a list cache value for `key` exists.\n *\n * @private\n * @name has\n * @memberOf ListCache\n * @param {string} key The key of the entry to check.\n * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n */\nfunction listCacheHas(key) {\n  return assocIndexOf(this.__data__, key) > -1;\n}\n\nmodule.exports = listCacheHas;\n\n\n/***/ }),\n/* 72 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar assocIndexOf = __webpack_require__(8);\n\n/**\n * Sets the list cache `key` to `value`.\n *\n * @private\n * @name set\n * @memberOf ListCache\n * @param {string} key The key of the value to set.\n * @param {*} value The value to set.\n * @returns {Object} Returns the list cache instance.\n */\nfunction listCacheSet(key, value) {\n  var data = this.__data__,\n      index = assocIndexOf(data, key);\n\n  if (index < 0) {\n    ++this.size;\n    data.push([key, value]);\n  } else {\n    data[index][1] = value;\n  }\n  return this;\n}\n\nmodule.exports = listCacheSet;\n\n\n/***/ }),\n/* 73 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar ListCache = __webpack_require__(7);\n\n/**\n * Removes all key-value entries from the stack.\n *\n * @private\n * @name clear\n * @memberOf Stack\n */\nfunction stackClear() {\n  this.__data__ = new ListCache;\n  this.size = 0;\n}\n\nmodule.exports = stackClear;\n\n\n/***/ }),\n/* 74 */\n/***/ (function(module, exports) {\n\n/**\n * Removes `key` and its value from the stack.\n *\n * @private\n * @name delete\n * @memberOf Stack\n * @param {string} key The key of the value to remove.\n * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n */\nfunction stackDelete(key) {\n  var data = this.__data__,\n      result = data['delete'](key);\n\n  this.size = data.size;\n  return result;\n}\n\nmodule.exports = stackDelete;\n\n\n/***/ }),\n/* 75 */\n/***/ (function(module, exports) {\n\n/**\n * Gets the stack value for `key`.\n *\n * @private\n * @name get\n * @memberOf Stack\n * @param {string} key The key of the value to get.\n * @returns {*} Returns the entry value.\n */\nfunction stackGet(key) {\n  return this.__data__.get(key);\n}\n\nmodule.exports = stackGet;\n\n\n/***/ }),\n/* 76 */\n/***/ (function(module, exports) {\n\n/**\n * Checks if a stack value for `key` exists.\n *\n * @private\n * @name has\n * @memberOf Stack\n * @param {string} key The key of the entry to check.\n * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n */\nfunction stackHas(key) {\n  return this.__data__.has(key);\n}\n\nmodule.exports = stackHas;\n\n\n/***/ }),\n/* 77 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar ListCache = __webpack_require__(7),\n    Map = __webpack_require__(15),\n    MapCache = __webpack_require__(16);\n\n/** Used as the size to enable large array optimizations. */\nvar LARGE_ARRAY_SIZE = 200;\n\n/**\n * Sets the stack `key` to `value`.\n *\n * @private\n * @name set\n * @memberOf Stack\n * @param {string} key The key of the value to set.\n * @param {*} value The value to set.\n * @returns {Object} Returns the stack cache instance.\n */\nfunction stackSet(key, value) {\n  var data = this.__data__;\n  if (data instanceof ListCache) {\n    var pairs = data.__data__;\n    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {\n      pairs.push([key, value]);\n      this.size = ++data.size;\n      return this;\n    }\n    data = this.__data__ = new MapCache(pairs);\n  }\n  data.set(key, value);\n  this.size = data.size;\n  return this;\n}\n\nmodule.exports = stackSet;\n\n\n/***/ }),\n/* 78 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isFunction = __webpack_require__(29),\n    isMasked = __webpack_require__(79),\n    isObject = __webpack_require__(14),\n    toSource = __webpack_require__(32);\n\n/**\n * Used to match `RegExp`\n * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).\n */\nvar reRegExpChar = /[\\\\^$.*+?()[\\]{}|]/g;\n\n/** Used to detect host constructors (Safari). */\nvar reIsHostCtor = /^\\[object .+?Constructor\\]$/;\n\n/** Used for built-in method references. */\nvar funcProto = Function.prototype,\n    objectProto = Object.prototype;\n\n/** Used to resolve the decompiled source of functions. */\nvar funcToString = funcProto.toString;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/** Used to detect if a method is native. */\nvar reIsNative = RegExp('^' +\n  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\\\$&')\n  .replace(/hasOwnProperty|(function).*?(?=\\\\\\()| for .+?(?=\\\\\\])/g, '$1.*?') + '$'\n);\n\n/**\n * The base implementation of `_.isNative` without bad shim checks.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a native function,\n *  else `false`.\n */\nfunction baseIsNative(value) {\n  if (!isObject(value) || isMasked(value)) {\n    return false;\n  }\n  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;\n  return pattern.test(toSource(value));\n}\n\nmodule.exports = baseIsNative;\n\n\n/***/ }),\n/* 79 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar coreJsData = __webpack_require__(80);\n\n/** Used to detect methods masquerading as native. */\nvar maskSrcKey = (function() {\n  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');\n  return uid ? ('Symbol(src)_1.' + uid) : '';\n}());\n\n/**\n * Checks if `func` has its source masked.\n *\n * @private\n * @param {Function} func The function to check.\n * @returns {boolean} Returns `true` if `func` is masked, else `false`.\n */\nfunction isMasked(func) {\n  return !!maskSrcKey && (maskSrcKey in func);\n}\n\nmodule.exports = isMasked;\n\n\n/***/ }),\n/* 80 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar root = __webpack_require__(0);\n\n/** Used to detect overreaching core-js shims. */\nvar coreJsData = root['__core-js_shared__'];\n\nmodule.exports = coreJsData;\n\n\n/***/ }),\n/* 81 */\n/***/ (function(module, exports) {\n\n/**\n * Gets the value at `key` of `object`.\n *\n * @private\n * @param {Object} [object] The object to query.\n * @param {string} key The key of the property to get.\n * @returns {*} Returns the property value.\n */\nfunction getValue(object, key) {\n  return object == null ? undefined : object[key];\n}\n\nmodule.exports = getValue;\n\n\n/***/ }),\n/* 82 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar Hash = __webpack_require__(83),\n    ListCache = __webpack_require__(7),\n    Map = __webpack_require__(15);\n\n/**\n * Removes all key-value entries from the map.\n *\n * @private\n * @name clear\n * @memberOf MapCache\n */\nfunction mapCacheClear() {\n  this.size = 0;\n  this.__data__ = {\n    'hash': new Hash,\n    'map': new (Map || ListCache),\n    'string': new Hash\n  };\n}\n\nmodule.exports = mapCacheClear;\n\n\n/***/ }),\n/* 83 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar hashClear = __webpack_require__(84),\n    hashDelete = __webpack_require__(85),\n    hashGet = __webpack_require__(86),\n    hashHas = __webpack_require__(87),\n    hashSet = __webpack_require__(88);\n\n/**\n * Creates a hash object.\n *\n * @private\n * @constructor\n * @param {Array} [entries] The key-value pairs to cache.\n */\nfunction Hash(entries) {\n  var index = -1,\n      length = entries == null ? 0 : entries.length;\n\n  this.clear();\n  while (++index < length) {\n    var entry = entries[index];\n    this.set(entry[0], entry[1]);\n  }\n}\n\n// Add methods to `Hash`.\nHash.prototype.clear = hashClear;\nHash.prototype['delete'] = hashDelete;\nHash.prototype.get = hashGet;\nHash.prototype.has = hashHas;\nHash.prototype.set = hashSet;\n\nmodule.exports = Hash;\n\n\n/***/ }),\n/* 84 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar nativeCreate = __webpack_require__(9);\n\n/**\n * Removes all key-value entries from the hash.\n *\n * @private\n * @name clear\n * @memberOf Hash\n */\nfunction hashClear() {\n  this.__data__ = nativeCreate ? nativeCreate(null) : {};\n  this.size = 0;\n}\n\nmodule.exports = hashClear;\n\n\n/***/ }),\n/* 85 */\n/***/ (function(module, exports) {\n\n/**\n * Removes `key` and its value from the hash.\n *\n * @private\n * @name delete\n * @memberOf Hash\n * @param {Object} hash The hash to modify.\n * @param {string} key The key of the value to remove.\n * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n */\nfunction hashDelete(key) {\n  var result = this.has(key) && delete this.__data__[key];\n  this.size -= result ? 1 : 0;\n  return result;\n}\n\nmodule.exports = hashDelete;\n\n\n/***/ }),\n/* 86 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar nativeCreate = __webpack_require__(9);\n\n/** Used to stand-in for `undefined` hash values. */\nvar HASH_UNDEFINED = '__lodash_hash_undefined__';\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/**\n * Gets the hash value for `key`.\n *\n * @private\n * @name get\n * @memberOf Hash\n * @param {string} key The key of the value to get.\n * @returns {*} Returns the entry value.\n */\nfunction hashGet(key) {\n  var data = this.__data__;\n  if (nativeCreate) {\n    var result = data[key];\n    return result === HASH_UNDEFINED ? undefined : result;\n  }\n  return hasOwnProperty.call(data, key) ? data[key] : undefined;\n}\n\nmodule.exports = hashGet;\n\n\n/***/ }),\n/* 87 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar nativeCreate = __webpack_require__(9);\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/**\n * Checks if a hash value for `key` exists.\n *\n * @private\n * @name has\n * @memberOf Hash\n * @param {string} key The key of the entry to check.\n * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n */\nfunction hashHas(key) {\n  var data = this.__data__;\n  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);\n}\n\nmodule.exports = hashHas;\n\n\n/***/ }),\n/* 88 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar nativeCreate = __webpack_require__(9);\n\n/** Used to stand-in for `undefined` hash values. */\nvar HASH_UNDEFINED = '__lodash_hash_undefined__';\n\n/**\n * Sets the hash `key` to `value`.\n *\n * @private\n * @name set\n * @memberOf Hash\n * @param {string} key The key of the value to set.\n * @param {*} value The value to set.\n * @returns {Object} Returns the hash instance.\n */\nfunction hashSet(key, value) {\n  var data = this.__data__;\n  this.size += this.has(key) ? 0 : 1;\n  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;\n  return this;\n}\n\nmodule.exports = hashSet;\n\n\n/***/ }),\n/* 89 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getMapData = __webpack_require__(10);\n\n/**\n * Removes `key` and its value from the map.\n *\n * @private\n * @name delete\n * @memberOf MapCache\n * @param {string} key The key of the value to remove.\n * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n */\nfunction mapCacheDelete(key) {\n  var result = getMapData(this, key)['delete'](key);\n  this.size -= result ? 1 : 0;\n  return result;\n}\n\nmodule.exports = mapCacheDelete;\n\n\n/***/ }),\n/* 90 */\n/***/ (function(module, exports) {\n\n/**\n * Checks if `value` is suitable for use as unique object key.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is suitable, else `false`.\n */\nfunction isKeyable(value) {\n  var type = typeof value;\n  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')\n    ? (value !== '__proto__')\n    : (value === null);\n}\n\nmodule.exports = isKeyable;\n\n\n/***/ }),\n/* 91 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getMapData = __webpack_require__(10);\n\n/**\n * Gets the map value for `key`.\n *\n * @private\n * @name get\n * @memberOf MapCache\n * @param {string} key The key of the value to get.\n * @returns {*} Returns the entry value.\n */\nfunction mapCacheGet(key) {\n  return getMapData(this, key).get(key);\n}\n\nmodule.exports = mapCacheGet;\n\n\n/***/ }),\n/* 92 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getMapData = __webpack_require__(10);\n\n/**\n * Checks if a map value for `key` exists.\n *\n * @private\n * @name has\n * @memberOf MapCache\n * @param {string} key The key of the entry to check.\n * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n */\nfunction mapCacheHas(key) {\n  return getMapData(this, key).has(key);\n}\n\nmodule.exports = mapCacheHas;\n\n\n/***/ }),\n/* 93 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getMapData = __webpack_require__(10);\n\n/**\n * Sets the map `key` to `value`.\n *\n * @private\n * @name set\n * @memberOf MapCache\n * @param {string} key The key of the value to set.\n * @param {*} value The value to set.\n * @returns {Object} Returns the map cache instance.\n */\nfunction mapCacheSet(key, value) {\n  var data = getMapData(this, key),\n      size = data.size;\n\n  data.set(key, value);\n  this.size += data.size == size ? 0 : 1;\n  return this;\n}\n\nmodule.exports = mapCacheSet;\n\n\n/***/ }),\n/* 94 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar Stack = __webpack_require__(30),\n    equalArrays = __webpack_require__(34),\n    equalByTag = __webpack_require__(100),\n    equalObjects = __webpack_require__(104),\n    getTag = __webpack_require__(110),\n    isArray = __webpack_require__(1),\n    isBuffer = __webpack_require__(24),\n    isTypedArray = __webpack_require__(27);\n\n/** Used to compose bitmasks for value comparisons. */\nvar COMPARE_PARTIAL_FLAG = 1;\n\n/** `Object#toString` result references. */\nvar argsTag = '[object Arguments]',\n    arrayTag = '[object Array]',\n    objectTag = '[object Object]';\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/**\n * A specialized version of `baseIsEqual` for arrays and objects which performs\n * deep comparisons and tracks traversed objects enabling objects with circular\n * references to be compared.\n *\n * @private\n * @param {Object} object The object to compare.\n * @param {Object} other The other object to compare.\n * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\n * @param {Function} customizer The function to customize comparisons.\n * @param {Function} equalFunc The function to determine equivalents of values.\n * @param {Object} [stack] Tracks traversed `object` and `other` objects.\n * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.\n */\nfunction baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {\n  var objIsArr = isArray(object),\n      othIsArr = isArray(other),\n      objTag = objIsArr ? arrayTag : getTag(object),\n      othTag = othIsArr ? arrayTag : getTag(other);\n\n  objTag = objTag == argsTag ? objectTag : objTag;\n  othTag = othTag == argsTag ? objectTag : othTag;\n\n  var objIsObj = objTag == objectTag,\n      othIsObj = othTag == objectTag,\n      isSameTag = objTag == othTag;\n\n  if (isSameTag && isBuffer(object)) {\n    if (!isBuffer(other)) {\n      return false;\n    }\n    objIsArr = true;\n    objIsObj = false;\n  }\n  if (isSameTag && !objIsObj) {\n    stack || (stack = new Stack);\n    return (objIsArr || isTypedArray(object))\n      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)\n      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);\n  }\n  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {\n    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),\n        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');\n\n    if (objIsWrapped || othIsWrapped) {\n      var objUnwrapped = objIsWrapped ? object.value() : object,\n          othUnwrapped = othIsWrapped ? other.value() : other;\n\n      stack || (stack = new Stack);\n      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);\n    }\n  }\n  if (!isSameTag) {\n    return false;\n  }\n  stack || (stack = new Stack);\n  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);\n}\n\nmodule.exports = baseIsEqualDeep;\n\n\n/***/ }),\n/* 95 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar MapCache = __webpack_require__(16),\n    setCacheAdd = __webpack_require__(96),\n    setCacheHas = __webpack_require__(97);\n\n/**\n *\n * Creates an array cache object to store unique values.\n *\n * @private\n * @constructor\n * @param {Array} [values] The values to cache.\n */\nfunction SetCache(values) {\n  var index = -1,\n      length = values == null ? 0 : values.length;\n\n  this.__data__ = new MapCache;\n  while (++index < length) {\n    this.add(values[index]);\n  }\n}\n\n// Add methods to `SetCache`.\nSetCache.prototype.add = SetCache.prototype.push = setCacheAdd;\nSetCache.prototype.has = setCacheHas;\n\nmodule.exports = SetCache;\n\n\n/***/ }),\n/* 96 */\n/***/ (function(module, exports) {\n\n/** Used to stand-in for `undefined` hash values. */\nvar HASH_UNDEFINED = '__lodash_hash_undefined__';\n\n/**\n * Adds `value` to the array cache.\n *\n * @private\n * @name add\n * @memberOf SetCache\n * @alias push\n * @param {*} value The value to cache.\n * @returns {Object} Returns the cache instance.\n */\nfunction setCacheAdd(value) {\n  this.__data__.set(value, HASH_UNDEFINED);\n  return this;\n}\n\nmodule.exports = setCacheAdd;\n\n\n/***/ }),\n/* 97 */\n/***/ (function(module, exports) {\n\n/**\n * Checks if `value` is in the array cache.\n *\n * @private\n * @name has\n * @memberOf SetCache\n * @param {*} value The value to search for.\n * @returns {number} Returns `true` if `value` is found, else `false`.\n */\nfunction setCacheHas(value) {\n  return this.__data__.has(value);\n}\n\nmodule.exports = setCacheHas;\n\n\n/***/ }),\n/* 98 */\n/***/ (function(module, exports) {\n\n/**\n * A specialized version of `_.some` for arrays without support for iteratee\n * shorthands.\n *\n * @private\n * @param {Array} [array] The array to iterate over.\n * @param {Function} predicate The function invoked per iteration.\n * @returns {boolean} Returns `true` if any element passes the predicate check,\n *  else `false`.\n */\nfunction arraySome(array, predicate) {\n  var index = -1,\n      length = array == null ? 0 : array.length;\n\n  while (++index < length) {\n    if (predicate(array[index], index, array)) {\n      return true;\n    }\n  }\n  return false;\n}\n\nmodule.exports = arraySome;\n\n\n/***/ }),\n/* 99 */\n/***/ (function(module, exports) {\n\n/**\n * Checks if a `cache` value for `key` exists.\n *\n * @private\n * @param {Object} cache The cache to query.\n * @param {string} key The key of the entry to check.\n * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n */\nfunction cacheHas(cache, key) {\n  return cache.has(key);\n}\n\nmodule.exports = cacheHas;\n\n\n/***/ }),\n/* 100 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar Symbol = __webpack_require__(6),\n    Uint8Array = __webpack_require__(101),\n    eq = __webpack_require__(31),\n    equalArrays = __webpack_require__(34),\n    mapToArray = __webpack_require__(102),\n    setToArray = __webpack_require__(103);\n\n/** Used to compose bitmasks for value comparisons. */\nvar COMPARE_PARTIAL_FLAG = 1,\n    COMPARE_UNORDERED_FLAG = 2;\n\n/** `Object#toString` result references. */\nvar boolTag = '[object Boolean]',\n    dateTag = '[object Date]',\n    errorTag = '[object Error]',\n    mapTag = '[object Map]',\n    numberTag = '[object Number]',\n    regexpTag = '[object RegExp]',\n    setTag = '[object Set]',\n    stringTag = '[object String]',\n    symbolTag = '[object Symbol]';\n\nvar arrayBufferTag = '[object ArrayBuffer]',\n    dataViewTag = '[object DataView]';\n\n/** Used to convert symbols to primitives and strings. */\nvar symbolProto = Symbol ? Symbol.prototype : undefined,\n    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;\n\n/**\n * A specialized version of `baseIsEqualDeep` for comparing objects of\n * the same `toStringTag`.\n *\n * **Note:** This function only supports comparing values with tags of\n * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.\n *\n * @private\n * @param {Object} object The object to compare.\n * @param {Object} other The other object to compare.\n * @param {string} tag The `toStringTag` of the objects to compare.\n * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\n * @param {Function} customizer The function to customize comparisons.\n * @param {Function} equalFunc The function to determine equivalents of values.\n * @param {Object} stack Tracks traversed `object` and `other` objects.\n * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.\n */\nfunction equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {\n  switch (tag) {\n    case dataViewTag:\n      if ((object.byteLength != other.byteLength) ||\n          (object.byteOffset != other.byteOffset)) {\n        return false;\n      }\n      object = object.buffer;\n      other = other.buffer;\n\n    case arrayBufferTag:\n      if ((object.byteLength != other.byteLength) ||\n          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {\n        return false;\n      }\n      return true;\n\n    case boolTag:\n    case dateTag:\n    case numberTag:\n      // Coerce booleans to `1` or `0` and dates to milliseconds.\n      // Invalid dates are coerced to `NaN`.\n      return eq(+object, +other);\n\n    case errorTag:\n      return object.name == other.name && object.message == other.message;\n\n    case regexpTag:\n    case stringTag:\n      // Coerce regexes to strings and treat strings, primitives and objects,\n      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring\n      // for more details.\n      return object == (other + '');\n\n    case mapTag:\n      var convert = mapToArray;\n\n    case setTag:\n      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;\n      convert || (convert = setToArray);\n\n      if (object.size != other.size && !isPartial) {\n        return false;\n      }\n      // Assume cyclic values are equal.\n      var stacked = stack.get(object);\n      if (stacked) {\n        return stacked == other;\n      }\n      bitmask |= COMPARE_UNORDERED_FLAG;\n\n      // Recursively compare objects (susceptible to call stack limits).\n      stack.set(object, other);\n      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);\n      stack['delete'](object);\n      return result;\n\n    case symbolTag:\n      if (symbolValueOf) {\n        return symbolValueOf.call(object) == symbolValueOf.call(other);\n      }\n  }\n  return false;\n}\n\nmodule.exports = equalByTag;\n\n\n/***/ }),\n/* 101 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar root = __webpack_require__(0);\n\n/** Built-in value references. */\nvar Uint8Array = root.Uint8Array;\n\nmodule.exports = Uint8Array;\n\n\n/***/ }),\n/* 102 */\n/***/ (function(module, exports) {\n\n/**\n * Converts `map` to its key-value pairs.\n *\n * @private\n * @param {Object} map The map to convert.\n * @returns {Array} Returns the key-value pairs.\n */\nfunction mapToArray(map) {\n  var index = -1,\n      result = Array(map.size);\n\n  map.forEach(function(value, key) {\n    result[++index] = [key, value];\n  });\n  return result;\n}\n\nmodule.exports = mapToArray;\n\n\n/***/ }),\n/* 103 */\n/***/ (function(module, exports) {\n\n/**\n * Converts `set` to an array of its values.\n *\n * @private\n * @param {Object} set The set to convert.\n * @returns {Array} Returns the values.\n */\nfunction setToArray(set) {\n  var index = -1,\n      result = Array(set.size);\n\n  set.forEach(function(value) {\n    result[++index] = value;\n  });\n  return result;\n}\n\nmodule.exports = setToArray;\n\n\n/***/ }),\n/* 104 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getAllKeys = __webpack_require__(105);\n\n/** Used to compose bitmasks for value comparisons. */\nvar COMPARE_PARTIAL_FLAG = 1;\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/**\n * A specialized version of `baseIsEqualDeep` for objects with support for\n * partial deep comparisons.\n *\n * @private\n * @param {Object} object The object to compare.\n * @param {Object} other The other object to compare.\n * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\n * @param {Function} customizer The function to customize comparisons.\n * @param {Function} equalFunc The function to determine equivalents of values.\n * @param {Object} stack Tracks traversed `object` and `other` objects.\n * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.\n */\nfunction equalObjects(object, other, bitmask, customizer, equalFunc, stack) {\n  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,\n      objProps = getAllKeys(object),\n      objLength = objProps.length,\n      othProps = getAllKeys(other),\n      othLength = othProps.length;\n\n  if (objLength != othLength && !isPartial) {\n    return false;\n  }\n  var index = objLength;\n  while (index--) {\n    var key = objProps[index];\n    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {\n      return false;\n    }\n  }\n  // Assume cyclic values are equal.\n  var stacked = stack.get(object);\n  if (stacked && stack.get(other)) {\n    return stacked == other;\n  }\n  var result = true;\n  stack.set(object, other);\n  stack.set(other, object);\n\n  var skipCtor = isPartial;\n  while (++index < objLength) {\n    key = objProps[index];\n    var objValue = object[key],\n        othValue = other[key];\n\n    if (customizer) {\n      var compared = isPartial\n        ? customizer(othValue, objValue, key, other, object, stack)\n        : customizer(objValue, othValue, key, object, other, stack);\n    }\n    // Recursively compare objects (susceptible to call stack limits).\n    if (!(compared === undefined\n          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))\n          : compared\n        )) {\n      result = false;\n      break;\n    }\n    skipCtor || (skipCtor = key == 'constructor');\n  }\n  if (result && !skipCtor) {\n    var objCtor = object.constructor,\n        othCtor = other.constructor;\n\n    // Non `Object` object instances with different constructors are not equal.\n    if (objCtor != othCtor &&\n        ('constructor' in object && 'constructor' in other) &&\n        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&\n          typeof othCtor == 'function' && othCtor instanceof othCtor)) {\n      result = false;\n    }\n  }\n  stack['delete'](object);\n  stack['delete'](other);\n  return result;\n}\n\nmodule.exports = equalObjects;\n\n\n/***/ }),\n/* 105 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseGetAllKeys = __webpack_require__(106),\n    getSymbols = __webpack_require__(108),\n    keys = __webpack_require__(12);\n\n/**\n * Creates an array of own enumerable property names and symbols of `object`.\n *\n * @private\n * @param {Object} object The object to query.\n * @returns {Array} Returns the array of property names and symbols.\n */\nfunction getAllKeys(object) {\n  return baseGetAllKeys(object, keys, getSymbols);\n}\n\nmodule.exports = getAllKeys;\n\n\n/***/ }),\n/* 106 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar arrayPush = __webpack_require__(107),\n    isArray = __webpack_require__(1);\n\n/**\n * The base implementation of `getAllKeys` and `getAllKeysIn` which uses\n * `keysFunc` and `symbolsFunc` to get the enumerable property names and\n * symbols of `object`.\n *\n * @private\n * @param {Object} object The object to query.\n * @param {Function} keysFunc The function to get the keys of `object`.\n * @param {Function} symbolsFunc The function to get the symbols of `object`.\n * @returns {Array} Returns the array of property names and symbols.\n */\nfunction baseGetAllKeys(object, keysFunc, symbolsFunc) {\n  var result = keysFunc(object);\n  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));\n}\n\nmodule.exports = baseGetAllKeys;\n\n\n/***/ }),\n/* 107 */\n/***/ (function(module, exports) {\n\n/**\n * Appends the elements of `values` to `array`.\n *\n * @private\n * @param {Array} array The array to modify.\n * @param {Array} values The values to append.\n * @returns {Array} Returns `array`.\n */\nfunction arrayPush(array, values) {\n  var index = -1,\n      length = values.length,\n      offset = array.length;\n\n  while (++index < length) {\n    array[offset + index] = values[index];\n  }\n  return array;\n}\n\nmodule.exports = arrayPush;\n\n\n/***/ }),\n/* 108 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar arrayFilter = __webpack_require__(21),\n    stubArray = __webpack_require__(109);\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Built-in value references. */\nvar propertyIsEnumerable = objectProto.propertyIsEnumerable;\n\n/* Built-in method references for those with the same name as other `lodash` methods. */\nvar nativeGetSymbols = Object.getOwnPropertySymbols;\n\n/**\n * Creates an array of the own enumerable symbols of `object`.\n *\n * @private\n * @param {Object} object The object to query.\n * @returns {Array} Returns the array of symbols.\n */\nvar getSymbols = !nativeGetSymbols ? stubArray : function(object) {\n  if (object == null) {\n    return [];\n  }\n  object = Object(object);\n  return arrayFilter(nativeGetSymbols(object), function(symbol) {\n    return propertyIsEnumerable.call(object, symbol);\n  });\n};\n\nmodule.exports = getSymbols;\n\n\n/***/ }),\n/* 109 */\n/***/ (function(module, exports) {\n\n/**\n * This method returns a new empty array.\n *\n * @static\n * @memberOf _\n * @since 4.13.0\n * @category Util\n * @returns {Array} Returns the new empty array.\n * @example\n *\n * var arrays = _.times(2, _.stubArray);\n *\n * console.log(arrays);\n * // => [[], []]\n *\n * console.log(arrays[0] === arrays[1]);\n * // => false\n */\nfunction stubArray() {\n  return [];\n}\n\nmodule.exports = stubArray;\n\n\n/***/ }),\n/* 110 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar DataView = __webpack_require__(111),\n    Map = __webpack_require__(15),\n    Promise = __webpack_require__(112),\n    Set = __webpack_require__(113),\n    WeakMap = __webpack_require__(114),\n    baseGetTag = __webpack_require__(3),\n    toSource = __webpack_require__(32);\n\n/** `Object#toString` result references. */\nvar mapTag = '[object Map]',\n    objectTag = '[object Object]',\n    promiseTag = '[object Promise]',\n    setTag = '[object Set]',\n    weakMapTag = '[object WeakMap]';\n\nvar dataViewTag = '[object DataView]';\n\n/** Used to detect maps, sets, and weakmaps. */\nvar dataViewCtorString = toSource(DataView),\n    mapCtorString = toSource(Map),\n    promiseCtorString = toSource(Promise),\n    setCtorString = toSource(Set),\n    weakMapCtorString = toSource(WeakMap);\n\n/**\n * Gets the `toStringTag` of `value`.\n *\n * @private\n * @param {*} value The value to query.\n * @returns {string} Returns the `toStringTag`.\n */\nvar getTag = baseGetTag;\n\n// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.\nif ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||\n    (Map && getTag(new Map) != mapTag) ||\n    (Promise && getTag(Promise.resolve()) != promiseTag) ||\n    (Set && getTag(new Set) != setTag) ||\n    (WeakMap && getTag(new WeakMap) != weakMapTag)) {\n  getTag = function(value) {\n    var result = baseGetTag(value),\n        Ctor = result == objectTag ? value.constructor : undefined,\n        ctorString = Ctor ? toSource(Ctor) : '';\n\n    if (ctorString) {\n      switch (ctorString) {\n        case dataViewCtorString: return dataViewTag;\n        case mapCtorString: return mapTag;\n        case promiseCtorString: return promiseTag;\n        case setCtorString: return setTag;\n        case weakMapCtorString: return weakMapTag;\n      }\n    }\n    return result;\n  };\n}\n\nmodule.exports = getTag;\n\n\n/***/ }),\n/* 111 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getNative = __webpack_require__(2),\n    root = __webpack_require__(0);\n\n/* Built-in method references that are verified to be native. */\nvar DataView = getNative(root, 'DataView');\n\nmodule.exports = DataView;\n\n\n/***/ }),\n/* 112 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getNative = __webpack_require__(2),\n    root = __webpack_require__(0);\n\n/* Built-in method references that are verified to be native. */\nvar Promise = getNative(root, 'Promise');\n\nmodule.exports = Promise;\n\n\n/***/ }),\n/* 113 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getNative = __webpack_require__(2),\n    root = __webpack_require__(0);\n\n/* Built-in method references that are verified to be native. */\nvar Set = getNative(root, 'Set');\n\nmodule.exports = Set;\n\n\n/***/ }),\n/* 114 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getNative = __webpack_require__(2),\n    root = __webpack_require__(0);\n\n/* Built-in method references that are verified to be native. */\nvar WeakMap = getNative(root, 'WeakMap');\n\nmodule.exports = WeakMap;\n\n\n/***/ }),\n/* 115 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isStrictComparable = __webpack_require__(35),\n    keys = __webpack_require__(12);\n\n/**\n * Gets the property names, values, and compare flags of `object`.\n *\n * @private\n * @param {Object} object The object to query.\n * @returns {Array} Returns the match data of `object`.\n */\nfunction getMatchData(object) {\n  var result = keys(object),\n      length = result.length;\n\n  while (length--) {\n    var key = result[length],\n        value = object[key];\n\n    result[length] = [key, value, isStrictComparable(value)];\n  }\n  return result;\n}\n\nmodule.exports = getMatchData;\n\n\n/***/ }),\n/* 116 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseIsEqual = __webpack_require__(33),\n    get = __webpack_require__(117),\n    hasIn = __webpack_require__(124),\n    isKey = __webpack_require__(17),\n    isStrictComparable = __webpack_require__(35),\n    matchesStrictComparable = __webpack_require__(36),\n    toKey = __webpack_require__(11);\n\n/** Used to compose bitmasks for value comparisons. */\nvar COMPARE_PARTIAL_FLAG = 1,\n    COMPARE_UNORDERED_FLAG = 2;\n\n/**\n * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.\n *\n * @private\n * @param {string} path The path of the property to get.\n * @param {*} srcValue The value to match.\n * @returns {Function} Returns the new spec function.\n */\nfunction baseMatchesProperty(path, srcValue) {\n  if (isKey(path) && isStrictComparable(srcValue)) {\n    return matchesStrictComparable(toKey(path), srcValue);\n  }\n  return function(object) {\n    var objValue = get(object, path);\n    return (objValue === undefined && objValue === srcValue)\n      ? hasIn(object, path)\n      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);\n  };\n}\n\nmodule.exports = baseMatchesProperty;\n\n\n/***/ }),\n/* 117 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseGet = __webpack_require__(37);\n\n/**\n * Gets the value at `path` of `object`. If the resolved value is\n * `undefined`, the `defaultValue` is returned in its place.\n *\n * @static\n * @memberOf _\n * @since 3.7.0\n * @category Object\n * @param {Object} object The object to query.\n * @param {Array|string} path The path of the property to get.\n * @param {*} [defaultValue] The value returned for `undefined` resolved values.\n * @returns {*} Returns the resolved value.\n * @example\n *\n * var object = { 'a': [{ 'b': { 'c': 3 } }] };\n *\n * _.get(object, 'a[0].b.c');\n * // => 3\n *\n * _.get(object, ['a', '0', 'b', 'c']);\n * // => 3\n *\n * _.get(object, 'a.b.c', 'default');\n * // => 'default'\n */\nfunction get(object, path, defaultValue) {\n  var result = object == null ? undefined : baseGet(object, path);\n  return result === undefined ? defaultValue : result;\n}\n\nmodule.exports = get;\n\n\n/***/ }),\n/* 118 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar memoizeCapped = __webpack_require__(119);\n\n/** Used to match property names within property paths. */\nvar reLeadingDot = /^\\./,\n    rePropName = /[^.[\\]]+|\\[(?:(-?\\d+(?:\\.\\d+)?)|([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))/g;\n\n/** Used to match backslashes in property paths. */\nvar reEscapeChar = /\\\\(\\\\)?/g;\n\n/**\n * Converts `string` to a property path array.\n *\n * @private\n * @param {string} string The string to convert.\n * @returns {Array} Returns the property path array.\n */\nvar stringToPath = memoizeCapped(function(string) {\n  var result = [];\n  if (reLeadingDot.test(string)) {\n    result.push('');\n  }\n  string.replace(rePropName, function(match, number, quote, string) {\n    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));\n  });\n  return result;\n});\n\nmodule.exports = stringToPath;\n\n\n/***/ }),\n/* 119 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar memoize = __webpack_require__(120);\n\n/** Used as the maximum memoize cache size. */\nvar MAX_MEMOIZE_SIZE = 500;\n\n/**\n * A specialized version of `_.memoize` which clears the memoized function's\n * cache when it exceeds `MAX_MEMOIZE_SIZE`.\n *\n * @private\n * @param {Function} func The function to have its output memoized.\n * @returns {Function} Returns the new memoized function.\n */\nfunction memoizeCapped(func) {\n  var result = memoize(func, function(key) {\n    if (cache.size === MAX_MEMOIZE_SIZE) {\n      cache.clear();\n    }\n    return key;\n  });\n\n  var cache = result.cache;\n  return result;\n}\n\nmodule.exports = memoizeCapped;\n\n\n/***/ }),\n/* 120 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar MapCache = __webpack_require__(16);\n\n/** Error message constants. */\nvar FUNC_ERROR_TEXT = 'Expected a function';\n\n/**\n * Creates a function that memoizes the result of `func`. If `resolver` is\n * provided, it determines the cache key for storing the result based on the\n * arguments provided to the memoized function. By default, the first argument\n * provided to the memoized function is used as the map cache key. The `func`\n * is invoked with the `this` binding of the memoized function.\n *\n * **Note:** The cache is exposed as the `cache` property on the memoized\n * function. Its creation may be customized by replacing the `_.memoize.Cache`\n * constructor with one whose instances implement the\n * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)\n * method interface of `clear`, `delete`, `get`, `has`, and `set`.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Function\n * @param {Function} func The function to have its output memoized.\n * @param {Function} [resolver] The function to resolve the cache key.\n * @returns {Function} Returns the new memoized function.\n * @example\n *\n * var object = { 'a': 1, 'b': 2 };\n * var other = { 'c': 3, 'd': 4 };\n *\n * var values = _.memoize(_.values);\n * values(object);\n * // => [1, 2]\n *\n * values(other);\n * // => [3, 4]\n *\n * object.a = 2;\n * values(object);\n * // => [1, 2]\n *\n * // Modify the result cache.\n * values.cache.set(object, ['a', 'b']);\n * values(object);\n * // => ['a', 'b']\n *\n * // Replace `_.memoize.Cache`.\n * _.memoize.Cache = WeakMap;\n */\nfunction memoize(func, resolver) {\n  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {\n    throw new TypeError(FUNC_ERROR_TEXT);\n  }\n  var memoized = function() {\n    var args = arguments,\n        key = resolver ? resolver.apply(this, args) : args[0],\n        cache = memoized.cache;\n\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    var result = func.apply(this, args);\n    memoized.cache = cache.set(key, result) || cache;\n    return result;\n  };\n  memoized.cache = new (memoize.Cache || MapCache);\n  return memoized;\n}\n\n// Expose `MapCache`.\nmemoize.Cache = MapCache;\n\nmodule.exports = memoize;\n\n\n/***/ }),\n/* 121 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseToString = __webpack_require__(122);\n\n/**\n * Converts `value` to a string. An empty string is returned for `null`\n * and `undefined` values. The sign of `-0` is preserved.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to convert.\n * @returns {string} Returns the converted string.\n * @example\n *\n * _.toString(null);\n * // => ''\n *\n * _.toString(-0);\n * // => '-0'\n *\n * _.toString([1, 2, 3]);\n * // => '1,2,3'\n */\nfunction toString(value) {\n  return value == null ? '' : baseToString(value);\n}\n\nmodule.exports = toString;\n\n\n/***/ }),\n/* 122 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar Symbol = __webpack_require__(6),\n    arrayMap = __webpack_require__(123),\n    isArray = __webpack_require__(1),\n    isSymbol = __webpack_require__(18);\n\n/** Used as references for various `Number` constants. */\nvar INFINITY = 1 / 0;\n\n/** Used to convert symbols to primitives and strings. */\nvar symbolProto = Symbol ? Symbol.prototype : undefined,\n    symbolToString = symbolProto ? symbolProto.toString : undefined;\n\n/**\n * The base implementation of `_.toString` which doesn't convert nullish\n * values to empty strings.\n *\n * @private\n * @param {*} value The value to process.\n * @returns {string} Returns the string.\n */\nfunction baseToString(value) {\n  // Exit early for strings to avoid a performance hit in some environments.\n  if (typeof value == 'string') {\n    return value;\n  }\n  if (isArray(value)) {\n    // Recursively convert values (susceptible to call stack limits).\n    return arrayMap(value, baseToString) + '';\n  }\n  if (isSymbol(value)) {\n    return symbolToString ? symbolToString.call(value) : '';\n  }\n  var result = (value + '');\n  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;\n}\n\nmodule.exports = baseToString;\n\n\n/***/ }),\n/* 123 */\n/***/ (function(module, exports) {\n\n/**\n * A specialized version of `_.map` for arrays without support for iteratee\n * shorthands.\n *\n * @private\n * @param {Array} [array] The array to iterate over.\n * @param {Function} iteratee The function invoked per iteration.\n * @returns {Array} Returns the new mapped array.\n */\nfunction arrayMap(array, iteratee) {\n  var index = -1,\n      length = array == null ? 0 : array.length,\n      result = Array(length);\n\n  while (++index < length) {\n    result[index] = iteratee(array[index], index, array);\n  }\n  return result;\n}\n\nmodule.exports = arrayMap;\n\n\n/***/ }),\n/* 124 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseHasIn = __webpack_require__(125),\n    hasPath = __webpack_require__(126);\n\n/**\n * Checks if `path` is a direct or inherited property of `object`.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Object\n * @param {Object} object The object to query.\n * @param {Array|string} path The path to check.\n * @returns {boolean} Returns `true` if `path` exists, else `false`.\n * @example\n *\n * var object = _.create({ 'a': _.create({ 'b': 2 }) });\n *\n * _.hasIn(object, 'a');\n * // => true\n *\n * _.hasIn(object, 'a.b');\n * // => true\n *\n * _.hasIn(object, ['a', 'b']);\n * // => true\n *\n * _.hasIn(object, 'b');\n * // => false\n */\nfunction hasIn(object, path) {\n  return object != null && hasPath(object, path, baseHasIn);\n}\n\nmodule.exports = hasIn;\n\n\n/***/ }),\n/* 125 */\n/***/ (function(module, exports) {\n\n/**\n * The base implementation of `_.hasIn` without support for deep paths.\n *\n * @private\n * @param {Object} [object] The object to query.\n * @param {Array|string} key The key to check.\n * @returns {boolean} Returns `true` if `key` exists, else `false`.\n */\nfunction baseHasIn(object, key) {\n  return object != null && key in Object(object);\n}\n\nmodule.exports = baseHasIn;\n\n\n/***/ }),\n/* 126 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar castPath = __webpack_require__(38),\n    isArguments = __webpack_require__(22),\n    isArray = __webpack_require__(1),\n    isIndex = __webpack_require__(26),\n    isLength = __webpack_require__(13),\n    toKey = __webpack_require__(11);\n\n/**\n * Checks if `path` exists on `object`.\n *\n * @private\n * @param {Object} object The object to query.\n * @param {Array|string} path The path to check.\n * @param {Function} hasFunc The function to check properties.\n * @returns {boolean} Returns `true` if `path` exists, else `false`.\n */\nfunction hasPath(object, path, hasFunc) {\n  path = castPath(path, object);\n\n  var index = -1,\n      length = path.length,\n      result = false;\n\n  while (++index < length) {\n    var key = toKey(path[index]);\n    if (!(result = object != null && hasFunc(object, key))) {\n      break;\n    }\n    object = object[key];\n  }\n  if (result || ++index != length) {\n    return result;\n  }\n  length = object == null ? 0 : object.length;\n  return !!length && isLength(length) && isIndex(key, length) &&\n    (isArray(object) || isArguments(object));\n}\n\nmodule.exports = hasPath;\n\n\n/***/ }),\n/* 127 */\n/***/ (function(module, exports) {\n\n/**\n * This method returns the first argument it receives.\n *\n * @static\n * @since 0.1.0\n * @memberOf _\n * @category Util\n * @param {*} value Any value.\n * @returns {*} Returns `value`.\n * @example\n *\n * var object = { 'a': 1 };\n *\n * console.log(_.identity(object) === object);\n * // => true\n */\nfunction identity(value) {\n  return value;\n}\n\nmodule.exports = identity;\n\n\n/***/ }),\n/* 128 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseProperty = __webpack_require__(129),\n    basePropertyDeep = __webpack_require__(130),\n    isKey = __webpack_require__(17),\n    toKey = __webpack_require__(11);\n\n/**\n * Creates a function that returns the value at `path` of a given object.\n *\n * @static\n * @memberOf _\n * @since 2.4.0\n * @category Util\n * @param {Array|string} path The path of the property to get.\n * @returns {Function} Returns the new accessor function.\n * @example\n *\n * var objects = [\n *   { 'a': { 'b': 2 } },\n *   { 'a': { 'b': 1 } }\n * ];\n *\n * _.map(objects, _.property('a.b'));\n * // => [2, 1]\n *\n * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');\n * // => [1, 2]\n */\nfunction property(path) {\n  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);\n}\n\nmodule.exports = property;\n\n\n/***/ }),\n/* 129 */\n/***/ (function(module, exports) {\n\n/**\n * The base implementation of `_.property` without support for deep paths.\n *\n * @private\n * @param {string} key The key of the property to get.\n * @returns {Function} Returns the new accessor function.\n */\nfunction baseProperty(key) {\n  return function(object) {\n    return object == null ? undefined : object[key];\n  };\n}\n\nmodule.exports = baseProperty;\n\n\n/***/ }),\n/* 130 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar baseGet = __webpack_require__(37);\n\n/**\n * A specialized version of `baseProperty` which supports deep paths.\n *\n * @private\n * @param {Array|string} path The path of the property to get.\n * @returns {Function} Returns the new accessor function.\n */\nfunction basePropertyDeep(path) {\n  return function(object) {\n    return baseGet(object, path);\n  };\n}\n\nmodule.exports = basePropertyDeep;\n\n\n/***/ }),\n/* 131 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar util_1 = __webpack_require__(19);\r\nvar VBox = /** @class */ (function () {\r\n    function VBox(r1, r2, g1, g2, b1, b2, hist) {\r\n        this._volume = -1;\r\n        this._count = -1;\r\n        this.dimension = { r1: r1, r2: r2, g1: g1, g2: g2, b1: b1, b2: b2 };\r\n        this.hist = hist;\r\n    }\r\n    VBox.build = function (pixels, shouldIgnore) {\r\n        var hn = 1 << (3 * util_1.SIGBITS);\r\n        var hist = new Uint32Array(hn);\r\n        var rmax;\r\n        var rmin;\r\n        var gmax;\r\n        var gmin;\r\n        var bmax;\r\n        var bmin;\r\n        var r;\r\n        var g;\r\n        var b;\r\n        var a;\r\n        rmax = gmax = bmax = 0;\r\n        rmin = gmin = bmin = Number.MAX_VALUE;\r\n        var n = pixels.length / 4;\r\n        var i = 0;\r\n        while (i < n) {\r\n            var offset = i * 4;\r\n            i++;\r\n            r = pixels[offset + 0];\r\n            g = pixels[offset + 1];\r\n            b = pixels[offset + 2];\r\n            a = pixels[offset + 3];\r\n            // Ignored pixels' alpha is marked as 0 in filtering stage\r\n            if (a === 0)\r\n                continue;\r\n            r = r >> util_1.RSHIFT;\r\n            g = g >> util_1.RSHIFT;\r\n            b = b >> util_1.RSHIFT;\r\n            var index = util_1.getColorIndex(r, g, b);\r\n            hist[index] += 1;\r\n            if (r > rmax)\r\n                rmax = r;\r\n            if (r < rmin)\r\n                rmin = r;\r\n            if (g > gmax)\r\n                gmax = g;\r\n            if (g < gmin)\r\n                gmin = g;\r\n            if (b > bmax)\r\n                bmax = b;\r\n            if (b < bmin)\r\n                bmin = b;\r\n        }\r\n        return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, hist);\r\n    };\r\n    VBox.prototype.invalidate = function () {\r\n        this._volume = this._count = -1;\r\n        this._avg = null;\r\n    };\r\n    VBox.prototype.volume = function () {\r\n        if (this._volume < 0) {\r\n            var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;\r\n            this._volume = (r2 - r1 + 1) * (g2 - g1 + 1) * (b2 - b1 + 1);\r\n        }\r\n        return this._volume;\r\n    };\r\n    VBox.prototype.count = function () {\r\n        if (this._count < 0) {\r\n            var hist = this.hist;\r\n            var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;\r\n            var c = 0;\r\n            for (var r = r1; r <= r2; r++) {\r\n                for (var g = g1; g <= g2; g++) {\r\n                    for (var b = b1; b <= b2; b++) {\r\n                        var index = util_1.getColorIndex(r, g, b);\r\n                        c += hist[index];\r\n                    }\r\n                }\r\n            }\r\n            this._count = c;\r\n        }\r\n        return this._count;\r\n    };\r\n    VBox.prototype.clone = function () {\r\n        var hist = this.hist;\r\n        var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;\r\n        return new VBox(r1, r2, g1, g2, b1, b2, hist);\r\n    };\r\n    VBox.prototype.avg = function () {\r\n        if (!this._avg) {\r\n            var hist = this.hist;\r\n            var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;\r\n            var ntot = 0;\r\n            var mult = 1 << (8 - util_1.SIGBITS);\r\n            var rsum = void 0;\r\n            var gsum = void 0;\r\n            var bsum = void 0;\r\n            rsum = gsum = bsum = 0;\r\n            for (var r = r1; r <= r2; r++) {\r\n                for (var g = g1; g <= g2; g++) {\r\n                    for (var b = b1; b <= b2; b++) {\r\n                        var index = util_1.getColorIndex(r, g, b);\r\n                        var h = hist[index];\r\n                        ntot += h;\r\n                        rsum += (h * (r + 0.5) * mult);\r\n                        gsum += (h * (g + 0.5) * mult);\r\n                        bsum += (h * (b + 0.5) * mult);\r\n                    }\r\n                }\r\n            }\r\n            if (ntot) {\r\n                this._avg = [\r\n                    ~~(rsum / ntot),\r\n                    ~~(gsum / ntot),\r\n                    ~~(bsum / ntot)\r\n                ];\r\n            }\r\n            else {\r\n                this._avg = [\r\n                    ~~(mult * (r1 + r2 + 1) / 2),\r\n                    ~~(mult * (g1 + g2 + 1) / 2),\r\n                    ~~(mult * (b1 + b2 + 1) / 2),\r\n                ];\r\n            }\r\n        }\r\n        return this._avg;\r\n    };\r\n    VBox.prototype.contains = function (rgb) {\r\n        var r = rgb[0], g = rgb[1], b = rgb[2];\r\n        var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;\r\n        r >>= util_1.RSHIFT;\r\n        g >>= util_1.RSHIFT;\r\n        b >>= util_1.RSHIFT;\r\n        return r >= r1 && r <= r2\r\n            && g >= g1 && g <= g2\r\n            && b >= b1 && b <= b2;\r\n    };\r\n    VBox.prototype.split = function () {\r\n        var hist = this.hist;\r\n        var _a = this.dimension, r1 = _a.r1, r2 = _a.r2, g1 = _a.g1, g2 = _a.g2, b1 = _a.b1, b2 = _a.b2;\r\n        var count = this.count();\r\n        if (!count)\r\n            return [];\r\n        if (count === 1)\r\n            return [this.clone()];\r\n        var rw = r2 - r1 + 1;\r\n        var gw = g2 - g1 + 1;\r\n        var bw = b2 - b1 + 1;\r\n        var maxw = Math.max(rw, gw, bw);\r\n        var accSum = null;\r\n        var sum;\r\n        var total;\r\n        sum = total = 0;\r\n        var maxd = null;\r\n        if (maxw === rw) {\r\n            maxd = 'r';\r\n            accSum = new Uint32Array(r2 + 1);\r\n            for (var r = r1; r <= r2; r++) {\r\n                sum = 0;\r\n                for (var g = g1; g <= g2; g++) {\r\n                    for (var b = b1; b <= b2; b++) {\r\n                        var index = util_1.getColorIndex(r, g, b);\r\n                        sum += hist[index];\r\n                    }\r\n                }\r\n                total += sum;\r\n                accSum[r] = total;\r\n            }\r\n        }\r\n        else if (maxw === gw) {\r\n            maxd = 'g';\r\n            accSum = new Uint32Array(g2 + 1);\r\n            for (var g = g1; g <= g2; g++) {\r\n                sum = 0;\r\n                for (var r = r1; r <= r2; r++) {\r\n                    for (var b = b1; b <= b2; b++) {\r\n                        var index = util_1.getColorIndex(r, g, b);\r\n                        sum += hist[index];\r\n                    }\r\n                }\r\n                total += sum;\r\n                accSum[g] = total;\r\n            }\r\n        }\r\n        else {\r\n            maxd = 'b';\r\n            accSum = new Uint32Array(b2 + 1);\r\n            for (var b = b1; b <= b2; b++) {\r\n                sum = 0;\r\n                for (var r = r1; r <= r2; r++) {\r\n                    for (var g = g1; g <= g2; g++) {\r\n                        var index = util_1.getColorIndex(r, g, b);\r\n                        sum += hist[index];\r\n                    }\r\n                }\r\n                total += sum;\r\n                accSum[b] = total;\r\n            }\r\n        }\r\n        var splitPoint = -1;\r\n        var reverseSum = new Uint32Array(accSum.length);\r\n        for (var i = 0; i < accSum.length; i++) {\r\n            var d = accSum[i];\r\n            if (splitPoint < 0 && d > total / 2)\r\n                splitPoint = i;\r\n            reverseSum[i] = total - d;\r\n        }\r\n        var vbox = this;\r\n        function doCut(d) {\r\n            var dim1 = d + '1';\r\n            var dim2 = d + '2';\r\n            var d1 = vbox.dimension[dim1];\r\n            var d2 = vbox.dimension[dim2];\r\n            var vbox1 = vbox.clone();\r\n            var vbox2 = vbox.clone();\r\n            var left = splitPoint - d1;\r\n            var right = d2 - splitPoint;\r\n            if (left <= right) {\r\n                d2 = Math.min(d2 - 1, ~~(splitPoint + right / 2));\r\n                d2 = Math.max(0, d2);\r\n            }\r\n            else {\r\n                d2 = Math.max(d1, ~~(splitPoint - 1 - left / 2));\r\n                d2 = Math.min(vbox.dimension[dim2], d2);\r\n            }\r\n            while (!accSum[d2])\r\n                d2++;\r\n            var c2 = reverseSum[d2];\r\n            while (!c2 && accSum[d2 - 1])\r\n                c2 = reverseSum[--d2];\r\n            vbox1.dimension[dim2] = d2;\r\n            vbox2.dimension[dim1] = d2 + 1;\r\n            return [vbox1, vbox2];\r\n        }\r\n        return doCut(maxd);\r\n    };\r\n    return VBox;\r\n}());\r\nexports.default = VBox;\r\n\n\n/***/ }),\n/* 132 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar PQueue = /** @class */ (function () {\r\n    function PQueue(comparator) {\r\n        this._comparator = comparator;\r\n        this.contents = [];\r\n        this._sorted = false;\r\n    }\r\n    PQueue.prototype._sort = function () {\r\n        if (!this._sorted) {\r\n            this.contents.sort(this._comparator);\r\n            this._sorted = true;\r\n        }\r\n    };\r\n    PQueue.prototype.push = function (item) {\r\n        this.contents.push(item);\r\n        this._sorted = false;\r\n    };\r\n    PQueue.prototype.peek = function (index) {\r\n        this._sort();\r\n        index = typeof index === 'number' ? index : this.contents.length - 1;\r\n        return this.contents[index];\r\n    };\r\n    PQueue.prototype.pop = function () {\r\n        this._sort();\r\n        return this.contents.pop();\r\n    };\r\n    PQueue.prototype.size = function () {\r\n        return this.contents.length;\r\n    };\r\n    PQueue.prototype.map = function (mapper) {\r\n        this._sort();\r\n        return this.contents.map(mapper);\r\n    };\r\n    return PQueue;\r\n}());\r\nexports.default = PQueue;\r\n\n\n/***/ })\n/******/ ]);\n//# sourceMappingURL=5bf725be934615fda52b.worker.js.map", __webpack_require__.p + "5bf725be934615fda52b.worker.js");
};

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

var URL = window.URL || window.webkitURL;

module.exports = function (content, url) {
  try {
    try {
      var blob;

      try {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      } catch (e) {
        // The proposed API
        blob = new Blob([content]);
      }

      return new Worker(URL.createObjectURL(blob));
    } catch (e) {
      return new Worker('data:application/javascript,' + encodeURIComponent(content));
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return new Worker(url);
  }
};

/***/ })
/******/ ]);
//# sourceMappingURL=vibrant.worker.js.map