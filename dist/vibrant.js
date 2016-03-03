(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var punycode = require('punycode');

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
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
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
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

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
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
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
  if (isString(obj)) obj = urlParse(obj);
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
      isObject(this.query) &&
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
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

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
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

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
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
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
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
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
    if (!isNull(result.pathname) || !isNull(result.search)) {
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
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
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
    //this especialy happens in cases like
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
  if (!isNull(result.pathname) || !isNull(result.search)) {
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

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

},{"punycode":2,"querystring":6}],2:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.3.2 by @mathias */
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
		throw RangeError(errors[type]);
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
	 * http://tools.ietf.org/html/rfc3492#section-3.4
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
		'version': '1.3.2',
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
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

'use strict';

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

},{}],5:[function(require,module,exports){
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

'use strict';

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

},{}],6:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":4,"./encode":5}],7:[function(require,module,exports){
var Vibrant;

Vibrant = require('./vibrant');

Vibrant.DefaultOpts.Image = require('./image/browser');

module.exports = Vibrant;


},{"./image/browser":13,"./vibrant":22}],8:[function(require,module,exports){
var Vibrant;

window.Vibrant = Vibrant = require('./browser');


},{"./browser":7}],9:[function(require,module,exports){
module.exports = function(r, g, b, a) {
  return a >= 125 && !(r > 250 && g > 250 && b > 250);
};


},{}],10:[function(require,module,exports){
module.exports.Default = require('./default');


},{"./default":9}],11:[function(require,module,exports){
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


},{"../swatch":20,"../util":21,"./index":12}],12:[function(require,module,exports){
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


},{"./default":11}],13:[function(require,module,exports){
var BrowserImage, Image, Url, isRelativeUrl, isSameOrigin,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Image = require('./index');

Url = require('url');

isRelativeUrl = function(url) {
  var u;
  u = Url.parse(url);
  return u.protocol === null && u.host === null && u.port === null;
};

isSameOrigin = function(a, b) {
  var ua, ub;
  ua = Url.parse(a);
  ub = Url.parse(b);
  return ua.protocol === ub.protocol && ua.hostname === ub.hostname && ua.port === ub.port;
};

module.exports = BrowserImage = (function(superClass) {
  extend(BrowserImage, superClass);

  function BrowserImage(path, cb) {
    if (typeof path === 'object' && path instanceof HTMLImageElement) {
      this.img = path;
      path = this.img.src;
    } else {
      this.img = document.createElement('img');
      this.img.src = path;
    }
    if (!isRelativeUrl(path) && !isSameOrigin(window.location.href, path)) {
      this.img.crossOrigin = 'anonymous';
    }
    this.img.onload = (function(_this) {
      return function() {
        _this._initCanvas();
        return typeof cb === "function" ? cb(null, _this) : void 0;
      };
    })(this);
    if (this.img.complete) {
      this.img.onload();
    }
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


},{"./index":14,"url":1}],14:[function(require,module,exports){
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


},{}],15:[function(require,module,exports){
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


},{"../../swatch":20,"../../util":21,"./pqueue":16,"./vbox":17}],16:[function(require,module,exports){
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


},{}],17:[function(require,module,exports){
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


},{"../../util":21}],18:[function(require,module,exports){
var Quantizer;

module.exports = Quantizer = (function() {
  function Quantizer() {}

  Quantizer.prototype.initialize = function(pixels, opts) {};

  Quantizer.prototype.getQuantizedColors = function() {};

  return Quantizer;

})();

module.exports.MMCQ = require('./mmcq');


},{"./mmcq":19}],19:[function(require,module,exports){
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


},{"../swatch":20,"./impl/mmcq":15,"./index":18}],20:[function(require,module,exports){
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


},{"./util":21}],21:[function(require,module,exports){
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


},{}],22:[function(require,module,exports){

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
        var error, error1;
        if (err != null) {
          return cb(err);
        }
        try {
          _this._process(image, _this.opts);
          return cb(null, _this.swatches());
        } catch (error1) {
          error = error1;
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


},{"./filter":10,"./filter/":10,"./generator":12,"./generator/":12,"./quantizer":18,"./quantizer/":18,"./swatch":20,"./util":21,"quantize":3}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXJsL3VybC5qcyIsIm5vZGVfbW9kdWxlcy9wdW55Y29kZS9wdW55Y29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWFudGl6ZS9xdWFudGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFxicm93c2VyLmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xcYnVuZGxlLmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xcZmlsdGVyXFxkZWZhdWx0LmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xcZmlsdGVyXFxpbmRleC5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXGdlbmVyYXRvclxcZGVmYXVsdC5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXGdlbmVyYXRvclxcaW5kZXguY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFxpbWFnZVxcYnJvd3Nlci5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXGltYWdlXFxpbmRleC5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHF1YW50aXplclxcaW1wbFxcbW1jcS5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHF1YW50aXplclxcaW1wbFxccHF1ZXVlLmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xccXVhbnRpemVyXFxpbXBsXFx2Ym94LmNvZmZlZSIsIkY6XFxkZXZcXGpzXFxub2RlLXZpYnJhbnRcXHNyY1xccXVhbnRpemVyXFxpbmRleC5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHF1YW50aXplclxcbW1jcS5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHN3YXRjaC5jb2ZmZWUiLCJGOlxcZGV2XFxqc1xcbm9kZS12aWJyYW50XFxzcmNcXHV0aWwuY29mZmVlIiwiRjpcXGRldlxcanNcXG5vZGUtdmlicmFudFxcc3JjXFx2aWJyYW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbnNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBLElBQUE7O0FBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztBQUNWLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBcEIsR0FBNEIsT0FBQSxDQUFRLGlCQUFSOztBQUU1QixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0hqQixJQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7OztBQ0EzQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7U0FDZixDQUFBLElBQUssR0FBTCxJQUFhLENBQUksQ0FBQyxDQUFBLEdBQUksR0FBSixJQUFZLENBQUEsR0FBSSxHQUFoQixJQUF3QixDQUFBLEdBQUksR0FBN0I7QUFERjs7OztBQ0FqQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWYsR0FBeUIsT0FBQSxDQUFRLFdBQVI7Ozs7QUNBekIsSUFBQSxzREFBQTtFQUFBOzs7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztBQUNULElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUjs7QUFDUCxTQUFBLEdBQVksT0FBQSxDQUFRLFNBQVI7O0FBRVosV0FBQSxHQUNFO0VBQUEsY0FBQSxFQUFnQixJQUFoQjtFQUNBLFdBQUEsRUFBYSxJQURiO0VBRUEsWUFBQSxFQUFjLElBRmQ7RUFHQSxlQUFBLEVBQWlCLElBSGpCO0VBSUEsYUFBQSxFQUFlLEdBSmY7RUFLQSxnQkFBQSxFQUFrQixHQUxsQjtFQU1BLGFBQUEsRUFBZSxHQU5mO0VBT0EscUJBQUEsRUFBdUIsR0FQdkI7RUFRQSxrQkFBQSxFQUFvQixHQVJwQjtFQVNBLHVCQUFBLEVBQXlCLEdBVHpCO0VBVUEsb0JBQUEsRUFBc0IsSUFWdEI7RUFXQSxnQkFBQSxFQUFrQixDQVhsQjtFQVlBLFVBQUEsRUFBWSxDQVpaO0VBYUEsZ0JBQUEsRUFBa0IsQ0FibEI7OztBQWVGLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs2QkFDSixpQkFBQSxHQUFtQjs7RUFDTiwwQkFBQyxJQUFEO0lBQ1gsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsRUFBb0IsV0FBcEI7SUFDUixJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUNqQixJQUFDLENBQUEsa0JBQUQsR0FBc0I7SUFDdEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBQ3JCLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFDcEIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7RUFQUjs7NkJBU2IsUUFBQSxHQUFVLFNBQUMsUUFBRDtJQUFDLElBQUMsQ0FBQSxXQUFEO0lBQ1QsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBO0lBRWxCLElBQUMsQ0FBQSxzQkFBRCxDQUFBO1dBQ0EsSUFBQyxDQUFBLHFCQUFELENBQUE7RUFKUTs7NkJBTVYsZ0JBQUEsR0FBa0IsU0FBQTtXQUNoQixJQUFDLENBQUE7RUFEZTs7NkJBR2xCLHFCQUFBLEdBQXVCLFNBQUE7V0FDckIsSUFBQyxDQUFBO0VBRG9COzs2QkFHdkIsb0JBQUEsR0FBc0IsU0FBQTtXQUNwQixJQUFDLENBQUE7RUFEbUI7OzZCQUd0QixjQUFBLEdBQWdCLFNBQUE7V0FDZCxJQUFDLENBQUE7RUFEYTs7NkJBR2hCLG1CQUFBLEdBQXFCLFNBQUE7V0FDbkIsSUFBQyxDQUFBO0VBRGtCOzs2QkFHckIsa0JBQUEsR0FBb0IsU0FBQTtXQUNsQixJQUFDLENBQUE7RUFEaUI7OzZCQUdwQixzQkFBQSxHQUF3QixTQUFBO0lBQ3RCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUExQixFQUE0QyxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQWxELEVBQWlFLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBdkUsRUFDZixJQUFDLENBQUEsSUFBSSxDQUFDLHVCQURTLEVBQ2dCLElBQUMsQ0FBQSxJQUFJLENBQUMsb0JBRHRCLEVBQzRDLENBRDVDO0lBR2pCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBQyxDQUFBLElBQUksQ0FBQyxlQUExQixFQUEyQyxJQUFDLENBQUEsSUFBSSxDQUFDLFlBQWpELEVBQStELENBQS9ELEVBQ3BCLElBQUMsQ0FBQSxJQUFJLENBQUMsdUJBRGMsRUFDVyxJQUFDLENBQUEsSUFBSSxDQUFDLG9CQURqQixFQUN1QyxDQUR2QztJQUd0QixJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQUMsQ0FBQSxJQUFJLENBQUMsY0FBMUIsRUFBMEMsQ0FBMUMsRUFBNkMsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFuRCxFQUNuQixJQUFDLENBQUEsSUFBSSxDQUFDLHVCQURhLEVBQ1ksSUFBQyxDQUFBLElBQUksQ0FBQyxvQkFEbEIsRUFDd0MsQ0FEeEM7SUFHckIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBMUIsRUFBNEMsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFsRCxFQUFpRSxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQXZFLEVBQ2IsSUFBQyxDQUFBLElBQUksQ0FBQyxxQkFETyxFQUNnQixDQURoQixFQUNtQixJQUFDLENBQUEsSUFBSSxDQUFDLGtCQUR6QjtJQUdmLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBQyxDQUFBLElBQUksQ0FBQyxlQUExQixFQUEyQyxJQUFDLENBQUEsSUFBSSxDQUFDLFlBQWpELEVBQStELENBQS9ELEVBQ2xCLElBQUMsQ0FBQSxJQUFJLENBQUMscUJBRFksRUFDVyxDQURYLEVBQ2MsSUFBQyxDQUFBLElBQUksQ0FBQyxrQkFEcEI7V0FHcEIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQUMsQ0FBQSxJQUFJLENBQUMsY0FBMUIsRUFBMEMsQ0FBMUMsRUFBNkMsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFuRCxFQUNqQixJQUFDLENBQUEsSUFBSSxDQUFDLHFCQURXLEVBQ1ksQ0FEWixFQUNlLElBQUMsQ0FBQSxJQUFJLENBQUMsa0JBRHJCO0VBaEJHOzs2QkFtQnhCLHFCQUFBLEdBQXVCLFNBQUE7QUFDckIsUUFBQTtJQUFBLElBQUcsSUFBQyxDQUFBLGFBQUQsS0FBa0IsSUFBckI7TUFFRSxJQUFHLElBQUMsQ0FBQSxpQkFBRCxLQUF3QixJQUEzQjtRQUVFLEdBQUEsR0FBTSxJQUFDLENBQUEsaUJBQWlCLENBQUMsTUFBbkIsQ0FBQTtRQUNOLEdBQUksQ0FBQSxDQUFBLENBQUosR0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDO1FBQ2YsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxHQUFJLENBQUEsQ0FBQSxDQUFsQixFQUFzQixHQUFJLENBQUEsQ0FBQSxDQUExQixFQUE4QixHQUFJLENBQUEsQ0FBQSxDQUFsQyxDQUFQLEVBQThDLENBQTlDLEVBSnZCO09BRkY7O0lBUUEsSUFBRyxJQUFDLENBQUEsaUJBQUQsS0FBc0IsSUFBekI7TUFFRSxJQUFHLElBQUMsQ0FBQSxhQUFELEtBQW9CLElBQXZCO1FBRUUsR0FBQSxHQUFNLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixDQUFBO1FBQ04sR0FBSSxDQUFBLENBQUEsQ0FBSixHQUFTLElBQUMsQ0FBQSxJQUFJLENBQUM7ZUFDZixJQUFDLENBQUEsaUJBQUQsR0FBeUIsSUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxHQUFJLENBQUEsQ0FBQSxDQUFsQixFQUFzQixHQUFJLENBQUEsQ0FBQSxDQUExQixFQUE4QixHQUFJLENBQUEsQ0FBQSxDQUFsQyxDQUFQLEVBQThDLENBQTlDLEVBSjNCO09BRkY7O0VBVHFCOzs2QkFpQnZCLGlCQUFBLEdBQW1CLFNBQUE7QUFDakIsUUFBQTtJQUFBLFVBQUEsR0FBYTtBQUNiO0FBQUEsU0FBQSxxQ0FBQTs7TUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxVQUFULEVBQXFCLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBckI7QUFBYjtXQUNBO0VBSGlCOzs2QkFLbkIsa0JBQUEsR0FBb0IsU0FBQyxVQUFELEVBQWEsT0FBYixFQUFzQixPQUF0QixFQUErQixnQkFBL0IsRUFBaUQsYUFBakQsRUFBZ0UsYUFBaEU7QUFDbEIsUUFBQTtJQUFBLEdBQUEsR0FBTTtJQUNOLFFBQUEsR0FBVztBQUVYO0FBQUEsU0FBQSxxQ0FBQTs7TUFDRSxHQUFBLEdBQU0sTUFBTSxDQUFDLE1BQVAsQ0FBQSxDQUFnQixDQUFBLENBQUE7TUFDdEIsSUFBQSxHQUFPLE1BQU0sQ0FBQyxNQUFQLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBO01BRXZCLElBQUcsR0FBQSxJQUFPLGFBQVAsSUFBeUIsR0FBQSxJQUFPLGFBQWhDLElBQ0QsSUFBQSxJQUFRLE9BRFAsSUFDbUIsSUFBQSxJQUFRLE9BRDNCLElBRUQsQ0FBSSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsTUFBbkIsQ0FGTjtRQUdJLEtBQUEsR0FBUSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsR0FBdkIsRUFBNEIsZ0JBQTVCLEVBQThDLElBQTlDLEVBQW9ELFVBQXBELEVBQ04sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQURNLEVBQ2tCLElBQUMsQ0FBQSxpQkFEbkI7UUFFUixJQUFHLEdBQUEsS0FBTyxJQUFQLElBQWUsS0FBQSxHQUFRLFFBQTFCO1VBQ0UsR0FBQSxHQUFNO1VBQ04sUUFBQSxHQUFXLE1BRmI7U0FMSjs7QUFKRjtXQWFBO0VBakJrQjs7NkJBbUJwQixxQkFBQSxHQUF1QixTQUFDLFVBQUQsRUFBYSxnQkFBYixFQUNuQixJQURtQixFQUNiLFVBRGEsRUFDRCxVQURDLEVBQ1csYUFEWDtXQUVyQixJQUFDLENBQUEsWUFBRCxDQUNFLElBQUMsQ0FBQSxVQUFELENBQVksVUFBWixFQUF3QixnQkFBeEIsQ0FERixFQUM2QyxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQURuRCxFQUVFLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWixFQUFrQixVQUFsQixDQUZGLEVBRWlDLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFGdkMsRUFHRSxVQUFBLEdBQWEsYUFIZixFQUc4QixJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUhwQztFQUZxQjs7NkJBUXZCLFVBQUEsR0FBWSxTQUFDLEtBQUQsRUFBUSxXQUFSO1dBQ1YsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBQSxHQUFRLFdBQWpCO0VBRE07OzZCQUdaLFlBQUEsR0FBYyxTQUFBO0FBQ1osUUFBQTtJQURhO0lBQ2IsR0FBQSxHQUFNO0lBQ04sU0FBQSxHQUFZO0lBQ1osQ0FBQSxHQUFJO0FBQ0osV0FBTSxDQUFBLEdBQUksTUFBTSxDQUFDLE1BQWpCO01BQ0UsS0FBQSxHQUFRLE1BQU8sQ0FBQSxDQUFBO01BQ2YsTUFBQSxHQUFTLE1BQU8sQ0FBQSxDQUFBLEdBQUksQ0FBSjtNQUNoQixHQUFBLElBQU8sS0FBQSxHQUFRO01BQ2YsU0FBQSxJQUFhO01BQ2IsQ0FBQSxJQUFLO0lBTFA7V0FNQSxHQUFBLEdBQU07RUFWTTs7NkJBWWQsaUJBQUEsR0FBbUIsU0FBQyxNQUFEO1dBQ2pCLElBQUMsQ0FBQSxhQUFELEtBQWtCLE1BQWxCLElBQTRCLElBQUMsQ0FBQSxpQkFBRCxLQUFzQixNQUFsRCxJQUNFLElBQUMsQ0FBQSxrQkFBRCxLQUF1QixNQUR6QixJQUNtQyxJQUFDLENBQUEsV0FBRCxLQUFnQixNQURuRCxJQUVFLElBQUMsQ0FBQSxlQUFELEtBQW9CLE1BRnRCLElBRWdDLElBQUMsQ0FBQSxnQkFBRCxLQUFxQjtFQUhwQzs7OztHQXRIVTs7OztBQ3JCL0IsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzs7c0JBQ0osUUFBQSxHQUFVLFNBQUMsUUFBRCxHQUFBOztzQkFFVixnQkFBQSxHQUFrQixTQUFBLEdBQUE7O3NCQUVsQixxQkFBQSxHQUF1QixTQUFBLEdBQUE7O3NCQUV2QixvQkFBQSxHQUFzQixTQUFBLEdBQUE7O3NCQUV0QixjQUFBLEdBQWdCLFNBQUEsR0FBQTs7c0JBRWhCLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTs7c0JBRXJCLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTs7Ozs7O0FBRXRCLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixHQUF5QixPQUFBLENBQVEsV0FBUjs7OztBQ2hCekIsSUFBQSxxREFBQTtFQUFBOzs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7O0FBQ1IsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSOztBQUVOLGFBQUEsR0FBZ0IsU0FBQyxHQUFEO0FBQ2QsTUFBQTtFQUFBLENBQUEsR0FBSSxHQUFHLENBQUMsS0FBSixDQUFVLEdBQVY7U0FFSixDQUFDLENBQUMsUUFBRixLQUFjLElBQWQsSUFBc0IsQ0FBQyxDQUFDLElBQUYsS0FBVSxJQUFoQyxJQUF3QyxDQUFDLENBQUMsSUFBRixLQUFVO0FBSHBDOztBQUtoQixZQUFBLEdBQWUsU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNiLE1BQUE7RUFBQSxFQUFBLEdBQUssR0FBRyxDQUFDLEtBQUosQ0FBVSxDQUFWO0VBQ0wsRUFBQSxHQUFLLEdBQUcsQ0FBQyxLQUFKLENBQVUsQ0FBVjtTQUdMLEVBQUUsQ0FBQyxRQUFILEtBQWUsRUFBRSxDQUFDLFFBQWxCLElBQThCLEVBQUUsQ0FBQyxRQUFILEtBQWUsRUFBRSxDQUFDLFFBQWhELElBQTRELEVBQUUsQ0FBQyxJQUFILEtBQVcsRUFBRSxDQUFDO0FBTDdEOztBQU9mLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztFQUVTLHNCQUFDLElBQUQsRUFBTyxFQUFQO0lBQ1gsSUFBRyxPQUFPLElBQVAsS0FBZSxRQUFmLElBQTRCLElBQUEsWUFBZ0IsZ0JBQS9DO01BQ0UsSUFBQyxDQUFBLEdBQUQsR0FBTztNQUNQLElBQUEsR0FBTyxJQUFDLENBQUEsR0FBRyxDQUFDLElBRmQ7S0FBQSxNQUFBO01BSUUsSUFBQyxDQUFBLEdBQUQsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNQLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxHQUFXLEtBTGI7O0lBT0EsSUFBRyxDQUFJLGFBQUEsQ0FBYyxJQUFkLENBQUosSUFBMkIsQ0FBSSxZQUFBLENBQWEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUE3QixFQUFtQyxJQUFuQyxDQUFsQztNQUNFLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxHQUFtQixZQURyQjs7SUFHQSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsR0FBYyxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDWixLQUFDLENBQUEsV0FBRCxDQUFBOzBDQUNBLEdBQUksTUFBTTtNQUZFO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtJQUtkLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxRQUFSO01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQUEsRUFERjs7SUFHQSxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsR0FBZSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsQ0FBRDtBQUNiLFlBQUE7UUFBQSxHQUFBLEdBQVUsSUFBQSxLQUFBLENBQU0sc0JBQUEsR0FBeUIsSUFBL0I7UUFDVixHQUFHLENBQUMsR0FBSixHQUFVOzBDQUNWLEdBQUk7TUFIUztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7RUFuQko7O3lCQXlCYixXQUFBLEdBQWEsU0FBQTtJQUNYLElBQUMsQ0FBQSxNQUFELEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkI7SUFDVixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNYLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixJQUFDLENBQUEsTUFBM0I7SUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixJQUFDLENBQUEsR0FBRyxDQUFDO0lBQzlCLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQUMsQ0FBQSxHQUFHLENBQUM7V0FDaEMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQW1CLElBQUMsQ0FBQSxHQUFwQixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixJQUFDLENBQUEsS0FBaEMsRUFBdUMsSUFBQyxDQUFBLE1BQXhDO0VBTlc7O3lCQVFiLEtBQUEsR0FBTyxTQUFBO1dBQ0wsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLElBQUMsQ0FBQSxLQUExQixFQUFpQyxJQUFDLENBQUEsTUFBbEM7RUFESzs7eUJBR1AsUUFBQSxHQUFVLFNBQUE7V0FDUixJQUFDLENBQUE7RUFETzs7eUJBR1YsU0FBQSxHQUFXLFNBQUE7V0FDVCxJQUFDLENBQUE7RUFEUTs7eUJBR1gsTUFBQSxHQUFRLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO0lBQ04sSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0I7SUFDekIsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUI7SUFDM0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQWUsQ0FBZixFQUFrQixDQUFsQjtXQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFtQixJQUFDLENBQUEsR0FBcEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUI7RUFKTTs7eUJBTVIsTUFBQSxHQUFRLFNBQUMsU0FBRDtXQUNOLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixTQUF0QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQztFQURNOzt5QkFHUixhQUFBLEdBQWUsU0FBQTtXQUNiLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBO0VBREc7O3lCQUdmLFlBQUEsR0FBYyxTQUFBO1dBQ1osSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCLElBQUMsQ0FBQSxLQUE3QixFQUFvQyxJQUFDLENBQUEsTUFBckM7RUFEWTs7eUJBR2QsWUFBQSxHQUFjLFNBQUE7V0FDWixJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFuQixDQUErQixJQUFDLENBQUEsTUFBaEM7RUFEWTs7OztHQTNEVzs7OztBQ2hCM0IsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzs7a0JBQ0osS0FBQSxHQUFPLFNBQUEsR0FBQTs7a0JBRVAsTUFBQSxHQUFRLFNBQUMsU0FBRCxHQUFBOztrQkFFUixRQUFBLEdBQVUsU0FBQSxHQUFBOztrQkFFVixTQUFBLEdBQVcsU0FBQSxHQUFBOztrQkFFWCxTQUFBLEdBQVcsU0FBQyxJQUFEO0FBQ1QsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsUUFBRCxDQUFBO0lBQ1IsTUFBQSxHQUFTLElBQUMsQ0FBQSxTQUFELENBQUE7SUFFVCxLQUFBLEdBQVE7SUFDUixJQUFHLHlCQUFIO01BQ0UsT0FBQSxHQUFVLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxFQUFnQixNQUFoQjtNQUNWLElBQUcsT0FBQSxHQUFVLElBQUksQ0FBQyxZQUFsQjtRQUNFLEtBQUEsR0FBUSxJQUFJLENBQUMsWUFBTCxHQUFvQixRQUQ5QjtPQUZGO0tBQUEsTUFBQTtNQUtFLEtBQUEsR0FBUSxDQUFBLEdBQUksSUFBSSxDQUFDLFFBTG5COztJQU9BLElBQUcsS0FBQSxHQUFRLENBQVg7YUFDRSxJQUFDLENBQUEsTUFBRCxDQUFRLEtBQUEsR0FBUSxLQUFoQixFQUF1QixNQUFBLEdBQVMsS0FBaEMsRUFBdUMsS0FBdkMsRUFERjs7RUFaUzs7a0JBZVgsTUFBQSxHQUFRLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEdBQUE7O2tCQUdSLGFBQUEsR0FBZSxTQUFBLEdBQUE7O2tCQUVmLFlBQUEsR0FBYyxTQUFBLEdBQUE7O2tCQUVkLFlBQUEsR0FBYyxTQUFBLEdBQUE7Ozs7Ozs7O0FDMUJoQixJQUFBOztBQUFBLE1BQW1DLElBQUEsR0FBTyxPQUFBLENBQVEsWUFBUixDQUExQyxFQUFDLG9CQUFBLGFBQUQsRUFBZ0IsY0FBQSxPQUFoQixFQUF5QixhQUFBOztBQUN6QixNQUFBLEdBQVMsT0FBQSxDQUFRLGNBQVI7O0FBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztBQUNQLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFFVCxNQUFNLENBQUMsT0FBUCxHQUNNO0VBQ0osSUFBQyxDQUFBLFdBQUQsR0FDRTtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBQ0Esa0JBQUEsRUFBb0IsSUFEcEI7OztFQUdXLGNBQUMsSUFBRDtJQUNYLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLElBQUMsQ0FBQSxXQUFXLENBQUMsV0FBakM7RUFERzs7aUJBRWIsUUFBQSxHQUFVLFNBQUMsTUFBRCxFQUFTLElBQVQ7QUFDUixRQUFBO0lBQUEsSUFBRyxNQUFNLENBQUMsTUFBUCxLQUFpQixDQUFqQixJQUFzQixJQUFJLENBQUMsVUFBTCxHQUFrQixDQUF4QyxJQUE2QyxJQUFJLENBQUMsVUFBTCxHQUFrQixHQUFsRTtBQUNFLFlBQVUsSUFBQSxLQUFBLENBQU0sdUJBQU4sRUFEWjs7SUFHQSxZQUFBLEdBQWUsU0FBQTthQUFHO0lBQUg7SUFFZixJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBSSxDQUFDLE9BQW5CLENBQUEsSUFBZ0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFiLEdBQXNCLENBQXpEO01BQ0UsWUFBQSxHQUFlLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVjtBQUNiLFlBQUE7QUFBQTtBQUFBLGFBQUEsc0NBQUE7O1VBQ0UsSUFBRyxDQUFJLENBQUEsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsRUFBVyxDQUFYLENBQVA7QUFBMEIsbUJBQU8sS0FBakM7O0FBREY7QUFFQSxlQUFPO01BSE0sRUFEakI7O0lBT0EsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsTUFBWCxFQUFtQixZQUFuQjtJQUNQLElBQUEsR0FBTyxJQUFJLENBQUM7SUFDWixVQUFBLEdBQWEsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaLENBQWlCLENBQUM7SUFDL0IsRUFBQSxHQUFTLElBQUEsTUFBQSxDQUFPLFNBQUMsQ0FBRCxFQUFJLENBQUo7YUFBVSxDQUFDLENBQUMsS0FBRixDQUFBLENBQUEsR0FBWSxDQUFDLENBQUMsS0FBRixDQUFBO0lBQXRCLENBQVA7SUFFVCxFQUFFLENBQUMsSUFBSCxDQUFRLElBQVI7SUFHQSxJQUFDLENBQUEsV0FBRCxDQUFhLEVBQWIsRUFBaUIsSUFBQyxDQUFBLElBQUksQ0FBQyxrQkFBTixHQUEyQixJQUFJLENBQUMsVUFBakQ7SUFHQSxHQUFBLEdBQVUsSUFBQSxNQUFBLENBQU8sU0FBQyxDQUFELEVBQUksQ0FBSjthQUFVLENBQUMsQ0FBQyxLQUFGLENBQUEsQ0FBQSxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQUEsQ0FBWixHQUF5QixDQUFDLENBQUMsS0FBRixDQUFBLENBQUEsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFBO0lBQS9DLENBQVA7SUFDVixHQUFHLENBQUMsUUFBSixHQUFlLEVBQUUsQ0FBQztJQUdsQixJQUFDLENBQUEsV0FBRCxDQUFhLEdBQWIsRUFBa0IsSUFBSSxDQUFDLFVBQUwsR0FBa0IsR0FBRyxDQUFDLElBQUosQ0FBQSxDQUFwQztJQUdBLFFBQUEsR0FBVztJQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7QUFDVixXQUFNLEdBQUcsQ0FBQyxJQUFKLENBQUEsQ0FBTjtNQUNFLENBQUEsR0FBSSxHQUFHLENBQUMsR0FBSixDQUFBO01BQ0osS0FBQSxHQUFRLENBQUMsQ0FBQyxHQUFGLENBQUE7TUFDUixJQUFHLHVDQUFJLGFBQWMsS0FBTSxDQUFBLENBQUEsR0FBSSxLQUFNLENBQUEsQ0FBQSxHQUFJLEtBQU0sQ0FBQSxDQUFBLEdBQUksY0FBbkQ7UUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxDQUFiO1FBQ0EsUUFBUSxDQUFDLElBQVQsQ0FBa0IsSUFBQSxNQUFBLENBQU8sS0FBUCxFQUFjLENBQUMsQ0FBQyxLQUFGLENBQUEsQ0FBZCxDQUFsQixFQUZGOztJQUhGO1dBT0E7RUF4Q1E7O2lCQTBDVixXQUFBLEdBQWEsU0FBQyxFQUFELEVBQUssTUFBTDtBQUNYLFFBQUE7SUFBQSxVQUFBLEdBQWE7SUFDYixTQUFBLEdBQVk7SUFDWixhQUFBLEdBQWdCLElBQUMsQ0FBQSxJQUFJLENBQUM7QUFDdEIsV0FBTSxTQUFBLEdBQVksYUFBbEI7TUFDRSxTQUFBO01BQ0EsSUFBQSxHQUFPLEVBQUUsQ0FBQyxHQUFILENBQUE7TUFDUCxJQUFHLENBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBQSxDQUFKO0FBQ0UsaUJBREY7O01BR0EsT0FBaUIsSUFBSSxDQUFDLEtBQUwsQ0FBQSxDQUFqQixFQUFDLGVBQUQsRUFBUTtNQUVSLEVBQUUsQ0FBQyxJQUFILENBQVEsS0FBUjtNQUNBLElBQUcsS0FBSDtRQUNFLEVBQUUsQ0FBQyxJQUFILENBQVEsS0FBUjtRQUNBLFVBQUEsR0FGRjs7TUFHQSxJQUFHLFVBQUEsSUFBYyxNQUFkLElBQXdCLFNBQUEsR0FBWSxhQUF2QztBQUNFLGVBREY7O0lBWkY7RUFKVzs7Ozs7Ozs7QUM3RGYsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0VBQ1MsZ0JBQUMsVUFBRDtJQUFDLElBQUMsQ0FBQSxhQUFEO0lBQ1osSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxNQUFELEdBQVU7RUFGQzs7bUJBSWIsS0FBQSxHQUFPLFNBQUE7SUFDTCxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsVUFBaEI7V0FDQSxJQUFDLENBQUEsTUFBRCxHQUFVO0VBRkw7O21CQUlQLElBQUEsR0FBTSxTQUFDLENBQUQ7SUFDSixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxDQUFmO1dBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVTtFQUZOOzttQkFJTixJQUFBLEdBQU0sU0FBQyxLQUFEO0lBQ0osSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFSO01BQ0UsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQURGOzs7TUFFQSxRQUFTLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixHQUFtQjs7V0FDNUIsSUFBQyxDQUFBLFFBQVMsQ0FBQSxLQUFBO0VBSk47O21CQU1OLEdBQUEsR0FBSyxTQUFBO0lBQ0gsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFSO01BQ0UsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQURGOztXQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFBO0VBSEc7O21CQUtMLElBQUEsR0FBTSxTQUFBO1dBQ0osSUFBQyxDQUFBLFFBQVEsQ0FBQztFQUROOzttQkFHTixHQUFBLEdBQUssU0FBQyxDQUFEO0lBQ0gsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFSO01BQ0UsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQURGOztXQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFjLENBQWQ7RUFIRzs7Ozs7Ozs7QUM1QlAsSUFBQTs7QUFBQSxNQUFtQyxJQUFBLEdBQU8sT0FBQSxDQUFRLFlBQVIsQ0FBMUMsRUFBQyxvQkFBQSxhQUFELEVBQWdCLGNBQUEsT0FBaEIsRUFBeUIsYUFBQTs7QUFFekIsTUFBTSxDQUFDLE9BQVAsR0FDTTtFQUNKLElBQUMsQ0FBQSxLQUFELEdBQVEsU0FBQyxNQUFELEVBQVMsWUFBVDtBQUNOLFFBQUE7SUFBQSxFQUFBLEdBQUssQ0FBQSxJQUFHLENBQUMsQ0FBQSxHQUFFLE9BQUg7SUFDUixJQUFBLEdBQVcsSUFBQSxXQUFBLENBQVksRUFBWjtJQUNYLElBQUEsR0FBTyxJQUFBLEdBQU8sSUFBQSxHQUFPO0lBQ3JCLElBQUEsR0FBTyxJQUFBLEdBQU8sSUFBQSxHQUFPLE1BQU0sQ0FBQztJQUM1QixDQUFBLEdBQUksTUFBTSxDQUFDLE1BQVAsR0FBZ0I7SUFDcEIsQ0FBQSxHQUFJO0FBRUosV0FBTSxDQUFBLEdBQUksQ0FBVjtNQUNFLE1BQUEsR0FBUyxDQUFBLEdBQUk7TUFDYixDQUFBO01BQ0EsQ0FBQSxHQUFJLE1BQU8sQ0FBQSxNQUFBLEdBQVMsQ0FBVDtNQUNYLENBQUEsR0FBSSxNQUFPLENBQUEsTUFBQSxHQUFTLENBQVQ7TUFDWCxDQUFBLEdBQUksTUFBTyxDQUFBLE1BQUEsR0FBUyxDQUFUO01BQ1gsQ0FBQSxHQUFJLE1BQU8sQ0FBQSxNQUFBLEdBQVMsQ0FBVDtNQUVYLElBQUcsWUFBQSxDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBSDtBQUFpQyxpQkFBakM7O01BRUEsQ0FBQSxHQUFJLENBQUEsSUFBSztNQUNULENBQUEsR0FBSSxDQUFBLElBQUs7TUFDVCxDQUFBLEdBQUksQ0FBQSxJQUFLO01BR1QsS0FBQSxHQUFRLGFBQUEsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLENBQXBCO01BQ1IsSUFBSyxDQUFBLEtBQUEsQ0FBTCxJQUFlO01BRWYsSUFBRyxDQUFBLEdBQUksSUFBUDtRQUNFLElBQUEsR0FBTyxFQURUOztNQUVBLElBQUcsQ0FBQSxHQUFJLElBQVA7UUFDRSxJQUFBLEdBQU8sRUFEVDs7TUFFQSxJQUFHLENBQUEsR0FBSSxJQUFQO1FBQ0UsSUFBQSxHQUFPLEVBRFQ7O01BRUEsSUFBRyxDQUFBLEdBQUksSUFBUDtRQUNFLElBQUEsR0FBTyxFQURUOztNQUVBLElBQUcsQ0FBQSxHQUFJLElBQVA7UUFDRSxJQUFBLEdBQU8sRUFEVDs7TUFFQSxJQUFHLENBQUEsR0FBSSxJQUFQO1FBQ0UsSUFBQSxHQUFPLEVBRFQ7O0lBNUJGO1dBK0JJLElBQUEsSUFBQSxDQUFLLElBQUwsRUFBVyxJQUFYLEVBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBQXlDLElBQXpDO0VBdkNFOztFQXlDSyxjQUFDLEVBQUQsRUFBTSxFQUFOLEVBQVcsRUFBWCxFQUFnQixFQUFoQixFQUFxQixFQUFyQixFQUEwQixFQUExQixFQUErQixLQUEvQjtJQUFDLElBQUMsQ0FBQSxLQUFEO0lBQUssSUFBQyxDQUFBLEtBQUQ7SUFBSyxJQUFDLENBQUEsS0FBRDtJQUFLLElBQUMsQ0FBQSxLQUFEO0lBQUssSUFBQyxDQUFBLEtBQUQ7SUFBSyxJQUFDLENBQUEsS0FBRDtJQUFLLElBQUMsQ0FBQSxPQUFEO0VBQS9COztpQkFHYixVQUFBLEdBQVksU0FBQTtJQUNWLE9BQU8sSUFBQyxDQUFBO0lBQ1IsT0FBTyxJQUFDLENBQUE7V0FDUixPQUFPLElBQUMsQ0FBQTtFQUhFOztpQkFLWixNQUFBLEdBQVEsU0FBQTtJQUNOLElBQU8sb0JBQVA7TUFDRSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQUMsSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFDLENBQUEsRUFBUCxHQUFZLENBQWIsQ0FBQSxHQUFrQixDQUFDLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQVAsR0FBWSxDQUFiLENBQWxCLEdBQW9DLENBQUMsSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFDLENBQUEsRUFBUCxHQUFZLENBQWIsRUFEakQ7O1dBRUEsSUFBQyxDQUFBO0VBSEs7O2lCQUtSLEtBQUEsR0FBTyxTQUFBO0FBQ0wsUUFBQTtJQUFBLElBQU8sbUJBQVA7TUFDRSxJQUFBLEdBQU8sSUFBQyxDQUFBO01BQ1IsQ0FBQSxHQUFJO01BQ0o7Ozs7Ozs7Ozs7TUFlQSxJQUFDLENBQUEsTUFBRCxHQUFVLEVBbEJaOztXQW1CQSxJQUFDLENBQUE7RUFwQkk7O2lCQXNCUCxLQUFBLEdBQU8sU0FBQTtXQUNELElBQUEsSUFBQSxDQUFLLElBQUMsQ0FBQSxFQUFOLEVBQVUsSUFBQyxDQUFBLEVBQVgsRUFBZSxJQUFDLENBQUEsRUFBaEIsRUFBb0IsSUFBQyxDQUFBLEVBQXJCLEVBQXlCLElBQUMsQ0FBQSxFQUExQixFQUE4QixJQUFDLENBQUEsRUFBL0IsRUFBbUMsSUFBQyxDQUFBLElBQXBDO0VBREM7O2lCQUdQLEdBQUEsR0FBSyxTQUFBO0FBQ0gsUUFBQTtJQUFBLElBQU8saUJBQVA7TUFDRSxJQUFBLEdBQU8sSUFBQyxDQUFBO01BQ1IsSUFBQSxHQUFPO01BQ1AsSUFBQSxHQUFPLENBQUEsSUFBSyxDQUFDLENBQUEsR0FBSSxPQUFMO01BQ1osSUFBQSxHQUFPLElBQUEsR0FBTyxJQUFBLEdBQU87TUFDckI7Ozs7Ozs7Ozs7Ozs7O01BeUJBLElBQUcsSUFBSDtRQUNFLElBQUMsQ0FBQSxJQUFELEdBQVEsQ0FDTixDQUFDLENBQUMsQ0FBQyxJQUFBLEdBQU8sSUFBUixDQURJLEVBRU4sQ0FBQyxDQUFDLENBQUMsSUFBQSxHQUFPLElBQVIsQ0FGSSxFQUdOLENBQUMsQ0FBQyxDQUFDLElBQUEsR0FBTyxJQUFSLENBSEksRUFEVjtPQUFBLE1BQUE7UUFPRSxJQUFDLENBQUEsSUFBRCxHQUFRLENBQ04sQ0FBQyxDQUFDLENBQUMsSUFBQSxHQUFPLENBQUMsSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFDLENBQUEsRUFBUCxHQUFZLENBQWIsQ0FBUCxHQUF5QixDQUExQixDQURJLEVBRU4sQ0FBQyxDQUFDLENBQUMsSUFBQSxHQUFPLENBQUMsSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFDLENBQUEsRUFBUCxHQUFZLENBQWIsQ0FBUCxHQUF5QixDQUExQixDQUZJLEVBR04sQ0FBQyxDQUFDLENBQUMsSUFBQSxHQUFPLENBQUMsSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFDLENBQUEsRUFBUCxHQUFZLENBQWIsQ0FBUCxHQUF5QixDQUExQixDQUhJLEVBUFY7T0E5QkY7O1dBMENBLElBQUMsQ0FBQTtFQTNDRTs7aUJBNkNMLEtBQUEsR0FBTyxTQUFBO0FBQ0wsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFDLENBQUE7SUFDUixJQUFHLENBQUMsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFKO0FBQ0UsYUFBTyxLQURUOztJQUVBLElBQUcsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLEtBQVksQ0FBZjtBQUNFLGFBQU8sQ0FBQyxJQUFDLENBQUEsS0FBRCxDQUFBLENBQUQsRUFEVDs7SUFHQSxFQUFBLEdBQUssSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFDLENBQUEsRUFBUCxHQUFZO0lBQ2pCLEVBQUEsR0FBSyxJQUFDLENBQUEsRUFBRCxHQUFNLElBQUMsQ0FBQSxFQUFQLEdBQVk7SUFDakIsRUFBQSxHQUFLLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQVAsR0FBWTtJQUVqQixJQUFBLEdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBQWEsRUFBYixFQUFpQixFQUFqQjtJQUNQLE1BQUEsR0FBUztJQUNULEdBQUEsR0FBTSxLQUFBLEdBQVE7SUFFZCxJQUFBLEdBQU87QUFDUCxZQUFPLElBQVA7QUFBQSxXQUNPLEVBRFA7UUFFSSxJQUFBLEdBQU87UUFDUCxNQUFBLEdBQWEsSUFBQSxXQUFBLENBQVksSUFBQyxDQUFBLEVBQUQsR0FBTSxDQUFsQjtRQUNiOzs7Ozs7Ozs7Ozs7O0FBSEc7QUFEUCxXQXlCTyxFQXpCUDtRQTBCSSxJQUFBLEdBQU87UUFDUCxNQUFBLEdBQWEsSUFBQSxXQUFBLENBQVksSUFBQyxDQUFBLEVBQUQsR0FBTSxDQUFsQjtRQUNiOzs7Ozs7Ozs7Ozs7O0FBSEc7QUF6QlAsV0FpRE8sRUFqRFA7UUFrREksSUFBQSxHQUFPO1FBQ1AsTUFBQSxHQUFhLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxFQUFELEdBQU0sQ0FBbEI7UUFDYjs7Ozs7Ozs7Ozs7OztBQXBESjtJQTBFQSxVQUFBLEdBQWEsQ0FBQztJQUNkLFVBQUEsR0FBaUIsSUFBQSxXQUFBLENBQVksTUFBTSxDQUFDLE1BQW5CO0FBQ2pCLFNBQVMsaUdBQVQ7TUFDRSxDQUFBLEdBQUksTUFBTyxDQUFBLENBQUE7TUFDWCxJQUFHLFVBQUEsR0FBYSxDQUFiLElBQWtCLENBQUEsR0FBSSxLQUFBLEdBQVEsQ0FBakM7UUFDRSxVQUFBLEdBQWEsRUFEZjs7TUFFQSxVQUFXLENBQUEsQ0FBQSxDQUFYLEdBQWdCLEtBQUEsR0FBUTtBQUoxQjtJQU1BLElBQUEsR0FBTztJQUNQLEtBQUEsR0FBUSxTQUFDLENBQUQ7QUFDTixVQUFBO01BQUEsSUFBQSxHQUFPLENBQUEsR0FBSTtNQUNYLElBQUEsR0FBTyxDQUFBLEdBQUk7TUFDWCxFQUFBLEdBQUssSUFBSyxDQUFBLElBQUE7TUFDVixFQUFBLEdBQUssSUFBSyxDQUFBLElBQUE7TUFDVixLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBQTtNQUNSLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFBO01BQ1IsSUFBQSxHQUFPLFVBQUEsR0FBYTtNQUNwQixLQUFBLEdBQVEsRUFBQSxHQUFLO01BQ2IsSUFBRyxJQUFBLElBQVEsS0FBWDtRQUNFLEVBQUEsR0FBSyxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUEsR0FBSyxDQUFkLEVBQWlCLENBQUMsQ0FBRSxDQUFDLFVBQUEsR0FBYSxLQUFBLEdBQVEsQ0FBdEIsQ0FBcEI7UUFDTCxFQUFBLEdBQUssSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksRUFBWixFQUZQO09BQUEsTUFBQTtRQUlFLEVBQUEsR0FBSyxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQVQsRUFBYSxDQUFDLENBQUUsQ0FBQyxVQUFBLEdBQWEsQ0FBYixHQUFpQixJQUFBLEdBQU8sQ0FBekIsQ0FBaEI7UUFDTCxFQUFBLEdBQUssSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFLLENBQUEsSUFBQSxDQUFkLEVBQXFCLEVBQXJCLEVBTFA7O0FBUUEsYUFBTSxDQUFDLE1BQU8sQ0FBQSxFQUFBLENBQWQ7UUFDRSxFQUFBO01BREY7TUFJQSxFQUFBLEdBQUssVUFBVyxDQUFBLEVBQUE7QUFDaEIsYUFBTSxDQUFDLEVBQUQsSUFBUSxNQUFPLENBQUEsRUFBQSxHQUFLLENBQUwsQ0FBckI7UUFDRSxFQUFBLEdBQUssVUFBVyxDQUFBLEVBQUUsRUFBRjtNQURsQjtNQUdBLEtBQU0sQ0FBQSxJQUFBLENBQU4sR0FBYztNQUNkLEtBQU0sQ0FBQSxJQUFBLENBQU4sR0FBYyxFQUFBLEdBQUs7QUFHbkIsYUFBTyxDQUFDLEtBQUQsRUFBUSxLQUFSO0lBN0JEO1dBK0JSLEtBQUEsQ0FBTSxJQUFOO0VBbElLOztpQkFvSVAsUUFBQSxHQUFVLFNBQUMsQ0FBRDtBQUNSLFFBQUE7SUFBQSxDQUFBLEdBQUksQ0FBRSxDQUFBLENBQUEsQ0FBRixJQUFNO0lBQ1YsQ0FBQSxHQUFJLENBQUUsQ0FBQSxDQUFBLENBQUYsSUFBTTtJQUNWLENBQUEsR0FBSSxDQUFFLENBQUEsQ0FBQSxDQUFGLElBQU07V0FFVixDQUFBLElBQUssSUFBQyxDQUFBLEVBQU4sSUFBYSxDQUFBLElBQUssSUFBQyxDQUFBLEVBQW5CLElBQTBCLENBQUEsSUFBSyxJQUFDLENBQUEsRUFBaEMsSUFBdUMsQ0FBQSxJQUFLLElBQUMsQ0FBQSxFQUE3QyxJQUFvRCxDQUFBLElBQUssSUFBQyxDQUFBLEVBQTFELElBQWlFLENBQUEsSUFBSyxJQUFDLENBQUE7RUFML0Q7Ozs7Ozs7O0FDcFFaLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O3NCQUNKLFVBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxJQUFULEdBQUE7O3NCQUVaLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTs7Ozs7O0FBRXRCLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBZixHQUFzQixPQUFBLENBQVEsUUFBUjs7OztBQ050QixJQUFBLGlDQUFBO0VBQUE7OztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7QUFDVCxTQUFBLEdBQVksT0FBQSxDQUFRLFNBQVI7O0FBQ1osUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztBQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7aUJBQ0osVUFBQSxHQUFZLFNBQUMsTUFBRCxFQUFTLElBQVQ7QUFDVixRQUFBO0lBRG1CLElBQUMsQ0FBQSxPQUFEO0lBQ25CLElBQUEsR0FBVyxJQUFBLFFBQUEsQ0FBQTtXQUNYLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFkLEVBQXNCLElBQUMsQ0FBQSxJQUF2QjtFQUZGOztpQkFJWixrQkFBQSxHQUFvQixTQUFBO1dBQ2xCLElBQUMsQ0FBQTtFQURpQjs7OztHQUxIOzs7O0FDTG5CLElBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOzs7QUFDUDs7Ozs7OztBQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007bUJBQ0osR0FBQSxHQUFLOzttQkFDTCxHQUFBLEdBQUs7O21CQUNMLFVBQUEsR0FBWTs7bUJBQ1osR0FBQSxHQUFLOztFQUVRLGdCQUFDLEdBQUQsRUFBTSxVQUFOO0lBQ1gsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUNQLElBQUMsQ0FBQSxVQUFELEdBQWM7RUFGSDs7bUJBSWIsTUFBQSxHQUFRLFNBQUE7SUFDTixJQUFHLENBQUksSUFBQyxDQUFBLEdBQVI7YUFDRSxJQUFDLENBQUEsR0FBRCxHQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQW5CLEVBQXVCLElBQUMsQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUE1QixFQUFnQyxJQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBckMsRUFEVDtLQUFBLE1BQUE7YUFFSyxJQUFDLENBQUEsSUFGTjs7RUFETTs7bUJBS1IsYUFBQSxHQUFlLFNBQUE7V0FDYixJQUFDLENBQUE7RUFEWTs7bUJBR2YsTUFBQSxHQUFRLFNBQUE7V0FDTixJQUFDLENBQUE7RUFESzs7bUJBR1IsTUFBQSxHQUFRLFNBQUE7V0FDTixJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUFuQixFQUF1QixJQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBNUIsRUFBZ0MsSUFBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQXJDO0VBRE07O21CQUdSLGlCQUFBLEdBQW1CLFNBQUE7SUFDakIsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFDQSxJQUFHLElBQUMsQ0FBQSxHQUFELEdBQU8sR0FBVjthQUFtQixPQUFuQjtLQUFBLE1BQUE7YUFBK0IsT0FBL0I7O0VBRmlCOzttQkFJbkIsZ0JBQUEsR0FBa0IsU0FBQTtJQUNoQixJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUNBLElBQUcsSUFBQyxDQUFBLEdBQUQsR0FBTyxHQUFWO2FBQW1CLE9BQW5CO0tBQUEsTUFBQTthQUErQixPQUEvQjs7RUFGZ0I7O21CQUlsQixpQkFBQSxHQUFtQixTQUFBO0lBQ2pCLElBQUcsQ0FBSSxJQUFDLENBQUEsR0FBUjthQUFpQixJQUFDLENBQUEsR0FBRCxHQUFPLENBQUMsSUFBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQUwsR0FBVSxHQUFWLEdBQWdCLElBQUMsQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUFMLEdBQVUsR0FBMUIsR0FBZ0MsSUFBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQUwsR0FBVSxHQUEzQyxDQUFBLEdBQWtELEtBQTFFOztFQURpQjs7Ozs7Ozs7QUN4Q3JCLElBQUE7O0FBQUEsUUFBQSxHQUNFO0VBQUEsRUFBQSxFQUFJLENBQUo7RUFDQSxPQUFBLEVBQVMsQ0FEVDtFQUVBLEtBQUEsRUFBTyxDQUZQO0VBR0EsSUFBQSxFQUFNLEVBSE47RUFJQSxPQUFBLEVBQVMsRUFKVDs7O0FBTUYsT0FBQSxHQUFVOztBQUNWLE1BQUEsR0FBUyxDQUFBLEdBQUk7O0FBSWIsTUFBTSxDQUFDLE9BQVAsR0FDRTtFQUFBLEtBQUEsRUFBTyxTQUFDLENBQUQ7QUFDTCxRQUFBO0lBQUEsSUFBRyxPQUFPLENBQVAsS0FBWSxRQUFmO01BQ0UsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLENBQWQsQ0FBSDtBQUNFLGVBQU8sQ0FBQyxDQUFDLEdBQUYsQ0FBTSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7bUJBQU8sS0FBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYO1VBQVA7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQU4sRUFEVDtPQUFBLE1BQUE7UUFHRSxFQUFBLEdBQUs7QUFDTCxhQUFBLFFBQUE7O1VBQ0UsRUFBRyxDQUFBLEdBQUEsQ0FBSCxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBWDtBQURaO0FBRUEsZUFBTyxHQU5UO09BREY7O1dBUUE7RUFUSyxDQUFQO0VBV0EsUUFBQSxFQUFVLFNBQUE7QUFDUixRQUFBO0lBQUEsQ0FBQSxHQUFJO0FBQ0osU0FBQSwyQ0FBQTs7QUFDRSxXQUFBLFNBQUE7O1FBQ0UsSUFBTyxjQUFQO1VBQW9CLENBQUUsQ0FBQSxHQUFBLENBQUYsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsRUFBN0I7O0FBREY7QUFERjtXQUlBO0VBTlEsQ0FYVjtFQW1CQSxRQUFBLEVBQVUsU0FBQyxHQUFEO0FBQ1IsUUFBQTtJQUFBLENBQUEsR0FBSSwyQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxHQUFqRDtJQUNKLElBQUcsU0FBSDtBQUNFLGFBQU8sQ0FBQyxDQUFFLENBQUEsQ0FBQSxDQUFILEVBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBVCxFQUFhLENBQUUsQ0FBQSxDQUFBLENBQWYsQ0FBa0IsQ0FBQyxHQUFuQixDQUF1QixTQUFDLENBQUQ7ZUFBTyxRQUFBLENBQVMsQ0FBVCxFQUFZLEVBQVo7TUFBUCxDQUF2QixFQURUOztBQUVBLFdBQU87RUFKQyxDQW5CVjtFQXlCQSxRQUFBLEVBQVUsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7V0FDUixHQUFBLEdBQU0sQ0FBQyxDQUFDLENBQUEsSUFBSyxFQUFOLENBQUEsR0FBWSxDQUFDLENBQUEsSUFBSyxFQUFOLENBQVosR0FBd0IsQ0FBQyxDQUFBLElBQUssQ0FBTixDQUF4QixHQUFtQyxDQUFwQyxDQUFzQyxDQUFDLFFBQXZDLENBQWdELEVBQWhELENBQW1ELENBQUMsS0FBcEQsQ0FBMEQsQ0FBMUQsRUFBNkQsQ0FBN0Q7RUFERSxDQXpCVjtFQTRCQSxRQUFBLEVBQVUsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFDUixRQUFBO0lBQUEsQ0FBQSxJQUFLO0lBQ0wsQ0FBQSxJQUFLO0lBQ0wsQ0FBQSxJQUFLO0lBQ0wsR0FBQSxHQUFNLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmO0lBQ04sR0FBQSxHQUFNLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmO0lBQ04sQ0FBQSxHQUFJO0lBQ0osQ0FBQSxHQUFJO0lBQ0osQ0FBQSxHQUFJLENBQUMsR0FBQSxHQUFNLEdBQVAsQ0FBQSxHQUFjO0lBQ2xCLElBQUcsR0FBQSxLQUFPLEdBQVY7TUFDRSxDQUFBLEdBQUksQ0FBQSxHQUFJLEVBRFY7S0FBQSxNQUFBO01BSUUsQ0FBQSxHQUFJLEdBQUEsR0FBTTtNQUNWLENBQUEsR0FBTyxDQUFBLEdBQUksR0FBUCxHQUFnQixDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksR0FBSixHQUFVLEdBQVgsQ0FBcEIsR0FBeUMsQ0FBQSxHQUFJLENBQUMsR0FBQSxHQUFNLEdBQVA7QUFDakQsY0FBTyxHQUFQO0FBQUEsYUFDTyxDQURQO1VBRUksQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVYsR0FBYyxDQUFJLENBQUEsR0FBSSxDQUFQLEdBQWMsQ0FBZCxHQUFxQixDQUF0QjtBQURmO0FBRFAsYUFHTyxDQUhQO1VBSUksQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVYsR0FBYztBQURmO0FBSFAsYUFLTyxDQUxQO1VBTUksQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVYsR0FBYztBQU50QjtNQU9BLENBQUEsSUFBSyxFQWJQOztXQWNBLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO0VBdkJRLENBNUJWO0VBcURBLFFBQUEsRUFBVSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUNSLFFBQUE7SUFBQSxDQUFBLEdBQUk7SUFDSixDQUFBLEdBQUk7SUFDSixDQUFBLEdBQUk7SUFFSixPQUFBLEdBQVUsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7TUFDUixJQUFHLENBQUEsR0FBSSxDQUFQO1FBQ0UsQ0FBQSxJQUFLLEVBRFA7O01BRUEsSUFBRyxDQUFBLEdBQUksQ0FBUDtRQUNFLENBQUEsSUFBSyxFQURQOztNQUVBLElBQUcsQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFYO0FBQ0UsZUFBTyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBVixHQUFjLEVBRDNCOztNQUVBLElBQUcsQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFYO0FBQ0UsZUFBTyxFQURUOztNQUVBLElBQUcsQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFYO0FBQ0UsZUFBTyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBQyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVQsQ0FBVixHQUF3QixFQURyQzs7YUFFQTtJQVhRO0lBYVYsSUFBRyxDQUFBLEtBQUssQ0FBUjtNQUNFLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBQSxHQUFJLEVBRGQ7S0FBQSxNQUFBO01BSUUsQ0FBQSxHQUFPLENBQUEsR0FBSSxHQUFQLEdBQWdCLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQXBCLEdBQWlDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBQyxDQUFBLEdBQUksQ0FBTDtNQUM3QyxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQUosR0FBUTtNQUNaLENBQUEsR0FBSSxPQUFBLENBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQXRCO01BQ0osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLENBQWQ7TUFDSixDQUFBLEdBQUksT0FBQSxDQUFRLENBQVIsRUFBVyxDQUFYLEVBQWMsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBbEIsRUFSTjs7V0FTQSxDQUNFLENBQUEsR0FBSSxHQUROLEVBRUUsQ0FBQSxHQUFJLEdBRk4sRUFHRSxDQUFBLEdBQUksR0FITjtFQTNCUSxDQXJEVjtFQXNGQSxRQUFBLEVBQVUsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFDUixRQUFBO0lBQUEsQ0FBQSxJQUFLO0lBQ0wsQ0FBQSxJQUFLO0lBQ0wsQ0FBQSxJQUFLO0lBQ0wsQ0FBQSxHQUFPLENBQUEsR0FBSSxPQUFQLEdBQW9CLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQyxDQUFBLEdBQUksS0FBTCxDQUFBLEdBQWMsS0FBdkIsRUFBOEIsR0FBOUIsQ0FBcEIsR0FBNEQsQ0FBQSxHQUFJO0lBQ3BFLENBQUEsR0FBTyxDQUFBLEdBQUksT0FBUCxHQUFvQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQUMsQ0FBQSxHQUFJLEtBQUwsQ0FBQSxHQUFjLEtBQXZCLEVBQThCLEdBQTlCLENBQXBCLEdBQTRELENBQUEsR0FBSTtJQUNwRSxDQUFBLEdBQU8sQ0FBQSxHQUFJLE9BQVAsR0FBb0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFDLENBQUEsR0FBSSxLQUFMLENBQUEsR0FBYyxLQUF2QixFQUE4QixHQUE5QixDQUFwQixHQUE0RCxDQUFBLEdBQUk7SUFFcEUsQ0FBQSxJQUFLO0lBQ0wsQ0FBQSxJQUFLO0lBQ0wsQ0FBQSxJQUFLO0lBRUwsQ0FBQSxHQUFJLENBQUEsR0FBSSxNQUFKLEdBQWEsQ0FBQSxHQUFJLE1BQWpCLEdBQTBCLENBQUEsR0FBSTtJQUNsQyxDQUFBLEdBQUksQ0FBQSxHQUFJLE1BQUosR0FBYSxDQUFBLEdBQUksTUFBakIsR0FBMEIsQ0FBQSxHQUFJO0lBQ2xDLENBQUEsR0FBSSxDQUFBLEdBQUksTUFBSixHQUFhLENBQUEsR0FBSSxNQUFqQixHQUEwQixDQUFBLEdBQUk7V0FFbEMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7RUFoQlEsQ0F0RlY7RUF3R0EsV0FBQSxFQUFhLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO0FBQ1gsUUFBQTtJQUFBLEtBQUEsR0FBUTtJQUNSLEtBQUEsR0FBUTtJQUNSLEtBQUEsR0FBUTtJQUVSLENBQUEsSUFBSztJQUNMLENBQUEsSUFBSztJQUNMLENBQUEsSUFBSztJQUVMLENBQUEsR0FBTyxDQUFBLEdBQUksUUFBUCxHQUFxQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFBLEdBQUUsQ0FBZCxDQUFyQixHQUEyQyxLQUFBLEdBQVEsQ0FBUixHQUFZLEVBQUEsR0FBSztJQUNoRSxDQUFBLEdBQU8sQ0FBQSxHQUFJLFFBQVAsR0FBcUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBQSxHQUFFLENBQWQsQ0FBckIsR0FBMkMsS0FBQSxHQUFRLENBQVIsR0FBWSxFQUFBLEdBQUs7SUFDaEUsQ0FBQSxHQUFPLENBQUEsR0FBSSxRQUFQLEdBQXFCLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUEsR0FBRSxDQUFkLENBQXJCLEdBQTJDLEtBQUEsR0FBUSxDQUFSLEdBQVksRUFBQSxHQUFLO0lBRWhFLENBQUEsR0FBSSxHQUFBLEdBQU0sQ0FBTixHQUFVO0lBQ2QsQ0FBQSxHQUFJLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxDQUFMO0lBQ1YsQ0FBQSxHQUFJLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxDQUFMO1dBRVYsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7RUFqQlcsQ0F4R2I7RUEySEEsV0FBQSxFQUFhLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO0FBQ1gsUUFBQTtJQUFBLE1BQVksSUFBSSxDQUFDLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQVosRUFBQyxVQUFELEVBQUksVUFBSixFQUFPO1dBQ1AsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUIsQ0FBdkI7RUFGVyxDQTNIYjtFQStIQSxRQUFBLEVBQVUsU0FBQyxJQUFELEVBQU8sSUFBUDtBQUVSLFFBQUE7SUFBQSxRQUFBLEdBQVc7SUFDWCxRQUFBLEdBQVc7SUFDWCxRQUFBLEdBQVc7SUFFVixZQUFELEVBQUssWUFBTCxFQUFTO0lBQ1IsWUFBRCxFQUFLLFlBQUwsRUFBUztJQUNULEVBQUEsR0FBSyxFQUFBLEdBQUs7SUFDVixFQUFBLEdBQUssRUFBQSxHQUFLO0lBQ1YsRUFBQSxHQUFLLEVBQUEsR0FBSztJQUVWLEdBQUEsR0FBTSxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUEsR0FBSyxFQUFMLEdBQVUsRUFBQSxHQUFLLEVBQXpCO0lBQ04sR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBQSxHQUFLLEVBQUwsR0FBVSxFQUFBLEdBQUssRUFBekI7SUFFTixHQUFBLEdBQU0sRUFBQSxHQUFLO0lBQ1gsR0FBQSxHQUFNLEdBQUEsR0FBTTtJQUNaLEdBQUEsR0FBTSxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUEsR0FBSyxFQUFMLEdBQVUsRUFBQSxHQUFLLEVBQWYsR0FBb0IsRUFBQSxHQUFLLEVBQW5DO0lBRU4sSUFBRyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsQ0FBQSxHQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxHQUFMLENBQVMsR0FBVCxDQUFWLENBQUEsR0FBMkIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQVQsQ0FBVixDQUEvQztNQUNFLEdBQUEsR0FBTSxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQUEsR0FBTSxHQUFOLEdBQVksR0FBQSxHQUFNLEdBQWxCLEdBQXdCLEdBQUEsR0FBTSxHQUF4QyxFQURSO0tBQUEsTUFBQTtNQUdFLEdBQUEsR0FBTSxFQUhSOztJQUtBLEdBQUEsR0FBTSxDQUFBLEdBQUksS0FBQSxHQUFRO0lBQ2xCLEdBQUEsR0FBTSxDQUFBLEdBQUksS0FBQSxHQUFRO0lBRWxCLEdBQUEsSUFBTztJQUNQLEdBQUEsSUFBTyxRQUFBLEdBQVc7SUFDbEIsR0FBQSxJQUFPLFFBQUEsR0FBVztXQUVsQixJQUFJLENBQUMsSUFBTCxDQUFVLEdBQUEsR0FBTSxHQUFOLEdBQVksR0FBQSxHQUFNLEdBQWxCLEdBQXdCLEdBQUEsR0FBTSxHQUF4QztFQS9CUSxDQS9IVjtFQWdLQSxPQUFBLEVBQVMsU0FBQyxJQUFELEVBQU8sSUFBUDtBQUNQLFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQW1CLElBQW5CLEVBQXNCLElBQXRCO0lBQ1AsSUFBQSxHQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBYixDQUFtQixJQUFuQixFQUFzQixJQUF0QjtXQUNQLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFnQixJQUFoQjtFQUhPLENBaEtUO0VBcUtBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxJQUFQO0FBRVAsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7SUFDUCxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWO1dBR1AsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFULEVBQWUsSUFBZjtFQU5PLENBcktUO0VBNktBLG9CQUFBLEVBQXNCLFFBN0t0QjtFQStLQSxrQkFBQSxFQUFvQixTQUFDLENBQUQ7SUFDbEIsSUFBRyxDQUFBLEdBQUksUUFBUSxDQUFDLEVBQWhCO0FBQ0UsYUFBTyxNQURUOztJQUdBLElBQUcsQ0FBQSxJQUFLLFFBQVEsQ0FBQyxPQUFqQjtBQUNFLGFBQU8sVUFEVDs7SUFHQSxJQUFHLENBQUEsSUFBSyxRQUFRLENBQUMsS0FBakI7QUFDRSxhQUFPLFFBRFQ7O0lBR0EsSUFBRyxDQUFBLElBQUssUUFBUSxDQUFDLElBQWpCO0FBQ0UsYUFBTyxPQURUOztJQUdBLElBQUcsQ0FBQSxHQUFJLFFBQVEsQ0FBQyxPQUFoQjtBQUNFLGFBQU8sVUFEVDs7QUFFQSxXQUFPO0VBZlcsQ0EvS3BCO0VBZ01BLE9BQUEsRUFBUyxPQWhNVDtFQWlNQSxNQUFBLEVBQVEsTUFqTVI7RUFrTUEsYUFBQSxFQUFlLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO1dBQ2IsQ0FBQyxDQUFBLElBQUcsQ0FBQyxDQUFBLEdBQUUsT0FBSCxDQUFKLENBQUEsR0FBbUIsQ0FBQyxDQUFBLElBQUssT0FBTixDQUFuQixHQUFvQztFQUR2QixDQWxNZjs7Ozs7O0FDYkY7Ozs7Ozs7Ozs7O0FBQUEsSUFBQSx3REFBQTtFQUFBOztBQVdBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0FBQ1AsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQzs7QUFDMUMsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULE1BQU0sQ0FBQyxPQUFQLEdBQ007RUFDSixPQUFDLENBQUEsV0FBRCxHQUNFO0lBQUEsVUFBQSxFQUFZLEVBQVo7SUFDQSxPQUFBLEVBQVMsQ0FEVDtJQUVBLFNBQUEsRUFBZSxJQUFBLGdCQUFBLENBQUEsQ0FGZjtJQUdBLEtBQUEsRUFBTyxJQUhQO0lBSUEsU0FBQSxFQUFXLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUMsSUFKbEM7SUFLQSxPQUFBLEVBQVMsRUFMVDs7O0VBT0YsT0FBQyxDQUFBLElBQUQsR0FBTyxTQUFDLEdBQUQ7V0FDRCxJQUFBLE9BQUEsQ0FBUSxHQUFSO0VBREM7O29CQUdQLFFBQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7b0JBRVYsU0FBQSxHQUFXOztFQUVFLGlCQUFDLFdBQUQsRUFBZSxJQUFmO0lBQUMsSUFBQyxDQUFBLGNBQUQ7O01BQWMsT0FBTzs7O0lBQ2pDLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLElBQUMsQ0FBQSxXQUFXLENBQUMsV0FBakM7SUFDUixJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxJQUFJLENBQUM7RUFGUjs7b0JBSWIsVUFBQSxHQUFZLFNBQUMsRUFBRDtBQUNWLFFBQUE7V0FBQSxLQUFBLEdBQVksSUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFDLENBQUEsV0FBYixFQUEwQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsR0FBRCxFQUFNLEtBQU47QUFDcEMsWUFBQTtRQUFBLElBQUcsV0FBSDtBQUFhLGlCQUFPLEVBQUEsQ0FBRyxHQUFILEVBQXBCOztBQUNBO1VBQ0UsS0FBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWLEVBQWlCLEtBQUMsQ0FBQSxJQUFsQjtpQkFDQSxFQUFBLENBQUcsSUFBSCxFQUFTLEtBQUMsQ0FBQSxRQUFELENBQUEsQ0FBVCxFQUZGO1NBQUEsY0FBQTtVQUdNO0FBQ0osaUJBQU8sRUFBQSxDQUFHLEtBQUgsRUFKVDs7TUFGb0M7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCO0VBREY7O29CQVNaLFdBQUEsR0FBYSxTQUFDLEVBQUQ7V0FDWCxJQUFDLENBQUEsVUFBRCxDQUFZLEVBQVo7RUFEVzs7b0JBR2IsUUFBQSxHQUFVLFNBQUMsS0FBRCxFQUFRLElBQVI7QUFDUixRQUFBO0lBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLElBQWpCO0lBQ0EsU0FBQSxHQUFZLEtBQUssQ0FBQyxZQUFOLENBQUE7SUFFWixTQUFBLEdBQWdCLElBQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUE7SUFDaEIsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsU0FBUyxDQUFDLElBQS9CLEVBQXFDLElBQUMsQ0FBQSxJQUF0QztJQUVBLFFBQUEsR0FBVyxTQUFTLENBQUMsa0JBQVYsQ0FBQTtJQUVYLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBWCxDQUFvQixRQUFwQjtXQUVBLEtBQUssQ0FBQyxZQUFOLENBQUE7RUFYUTs7b0JBYVYsUUFBQSxHQUFVLFNBQUE7V0FDUjtNQUFBLE9BQUEsRUFBYyxJQUFDLENBQUEsU0FBUyxDQUFDLGdCQUFYLENBQUEsQ0FBZDtNQUNBLEtBQUEsRUFBYyxJQUFDLENBQUEsU0FBUyxDQUFDLGNBQVgsQ0FBQSxDQURkO01BRUEsV0FBQSxFQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMsb0JBQVgsQ0FBQSxDQUZkO01BR0EsU0FBQSxFQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMsa0JBQVgsQ0FBQSxDQUhkO01BSUEsWUFBQSxFQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMscUJBQVgsQ0FBQSxDQUpkO01BS0EsVUFBQSxFQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMsbUJBQVgsQ0FBQSxDQUxkOztFQURROzs7Ozs7QUFRWixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWYsR0FDTTtFQUNTLGlCQUFDLElBQUQsRUFBTyxLQUFQO0lBQUMsSUFBQyxDQUFBLE1BQUQ7SUFBTSxJQUFDLENBQUEsdUJBQUQsUUFBUTtJQUMxQixJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sR0FBZ0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQS9CO0VBREw7O29CQUdiLGFBQUEsR0FBZSxTQUFDLENBQUQ7SUFDYixJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sR0FBbUI7V0FDbkI7RUFGYTs7b0JBSWYsWUFBQSxHQUFjLFNBQUMsQ0FBRDtJQUNaLElBQUMsQ0FBQSxJQUFJLENBQUMsWUFBTixHQUFxQjtXQUNyQjtFQUZZOztvQkFJZCxTQUFBLEdBQVcsU0FBQyxDQUFEO0lBQ1QsSUFBRyxPQUFPLENBQVAsS0FBWSxVQUFmO01BQ0UsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBZCxDQUFtQixDQUFuQixFQURGOztXQUVBO0VBSFM7O29CQUtYLFlBQUEsR0FBYyxTQUFDLENBQUQ7QUFDWixRQUFBO0lBQUEsSUFBRyxDQUFDLENBQUEsR0FBSSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFkLENBQXNCLENBQXRCLENBQUwsQ0FBQSxHQUFpQyxDQUFwQztNQUNFLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQWQsQ0FBcUIsQ0FBckIsRUFERjs7V0FFQTtFQUhZOztvQkFLZCxZQUFBLEdBQWMsU0FBQTtJQUNaLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixHQUFnQjtXQUNoQjtFQUZZOztvQkFJZCxPQUFBLEdBQVMsU0FBQyxDQUFEO0lBQ1AsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLEdBQWdCO1dBQ2hCO0VBRk87O29CQUlULFFBQUEsR0FBVSxTQUFDLEtBQUQ7SUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sR0FBYztXQUNkO0VBRlE7O29CQUlWLFlBQUEsR0FBYyxTQUFDLFNBQUQ7SUFDWixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0I7V0FDbEI7RUFGWTs7b0JBSWQsWUFBQSxHQUFjLFNBQUMsU0FBRDtJQUNaLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtXQUNsQjtFQUZZOztvQkFJZCxLQUFBLEdBQU8sU0FBQTtJQUNMLElBQU8sY0FBUDtNQUNFLElBQUMsQ0FBQSxDQUFELEdBQVMsSUFBQSxPQUFBLENBQVEsSUFBQyxDQUFBLEdBQVQsRUFBYyxJQUFDLENBQUEsSUFBZixFQURYOztXQUVBLElBQUMsQ0FBQTtFQUhJOztvQkFLUCxXQUFBLEdBQWEsU0FBQyxFQUFEO1dBQ1gsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFRLENBQUMsVUFBVCxDQUFvQixFQUFwQjtFQURXOztvQkFHYixVQUFBLEdBQVksU0FBQyxFQUFEO1dBQ1YsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFRLENBQUMsVUFBVCxDQUFvQixFQUFwQjtFQURVOztvQkFHWixJQUFBLEdBQU0sU0FBQyxHQUFEO1dBQ0EsSUFBQSxPQUFBLENBQVEsR0FBUixFQUFhLElBQUMsQ0FBQSxJQUFkO0VBREE7Ozs7OztBQUdSLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBZixHQUFzQjs7QUFDdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFmLEdBQXdCOztBQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQWYsR0FBMkIsT0FBQSxDQUFRLGNBQVI7O0FBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBZixHQUEyQixPQUFBLENBQVEsY0FBUjs7QUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFmLEdBQXdCLE9BQUEsQ0FBUSxXQUFSIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgcHVueWNvZGUgPSByZXF1aXJlKCdwdW55Y29kZScpO1xuXG5leHBvcnRzLnBhcnNlID0gdXJsUGFyc2U7XG5leHBvcnRzLnJlc29sdmUgPSB1cmxSZXNvbHZlO1xuZXhwb3J0cy5yZXNvbHZlT2JqZWN0ID0gdXJsUmVzb2x2ZU9iamVjdDtcbmV4cG9ydHMuZm9ybWF0ID0gdXJsRm9ybWF0O1xuXG5leHBvcnRzLlVybCA9IFVybDtcblxuZnVuY3Rpb24gVXJsKCkge1xuICB0aGlzLnByb3RvY29sID0gbnVsbDtcbiAgdGhpcy5zbGFzaGVzID0gbnVsbDtcbiAgdGhpcy5hdXRoID0gbnVsbDtcbiAgdGhpcy5ob3N0ID0gbnVsbDtcbiAgdGhpcy5wb3J0ID0gbnVsbDtcbiAgdGhpcy5ob3N0bmFtZSA9IG51bGw7XG4gIHRoaXMuaGFzaCA9IG51bGw7XG4gIHRoaXMuc2VhcmNoID0gbnVsbDtcbiAgdGhpcy5xdWVyeSA9IG51bGw7XG4gIHRoaXMucGF0aG5hbWUgPSBudWxsO1xuICB0aGlzLnBhdGggPSBudWxsO1xuICB0aGlzLmhyZWYgPSBudWxsO1xufVxuXG4vLyBSZWZlcmVuY2U6IFJGQyAzOTg2LCBSRkMgMTgwOCwgUkZDIDIzOTZcblxuLy8gZGVmaW5lIHRoZXNlIGhlcmUgc28gYXQgbGVhc3QgdGhleSBvbmx5IGhhdmUgdG8gYmVcbi8vIGNvbXBpbGVkIG9uY2Ugb24gdGhlIGZpcnN0IG1vZHVsZSBsb2FkLlxudmFyIHByb3RvY29sUGF0dGVybiA9IC9eKFthLXowLTkuKy1dKzopL2ksXG4gICAgcG9ydFBhdHRlcm4gPSAvOlswLTldKiQvLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgcmVzZXJ2ZWQgZm9yIGRlbGltaXRpbmcgVVJMcy5cbiAgICAvLyBXZSBhY3R1YWxseSBqdXN0IGF1dG8tZXNjYXBlIHRoZXNlLlxuICAgIGRlbGltcyA9IFsnPCcsICc+JywgJ1wiJywgJ2AnLCAnICcsICdcXHInLCAnXFxuJywgJ1xcdCddLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgbm90IGFsbG93ZWQgZm9yIHZhcmlvdXMgcmVhc29ucy5cbiAgICB1bndpc2UgPSBbJ3snLCAnfScsICd8JywgJ1xcXFwnLCAnXicsICdgJ10uY29uY2F0KGRlbGltcyksXG5cbiAgICAvLyBBbGxvd2VkIGJ5IFJGQ3MsIGJ1dCBjYXVzZSBvZiBYU1MgYXR0YWNrcy4gIEFsd2F5cyBlc2NhcGUgdGhlc2UuXG4gICAgYXV0b0VzY2FwZSA9IFsnXFwnJ10uY29uY2F0KHVud2lzZSksXG4gICAgLy8gQ2hhcmFjdGVycyB0aGF0IGFyZSBuZXZlciBldmVyIGFsbG93ZWQgaW4gYSBob3N0bmFtZS5cbiAgICAvLyBOb3RlIHRoYXQgYW55IGludmFsaWQgY2hhcnMgYXJlIGFsc28gaGFuZGxlZCwgYnV0IHRoZXNlXG4gICAgLy8gYXJlIHRoZSBvbmVzIHRoYXQgYXJlICpleHBlY3RlZCogdG8gYmUgc2Vlbiwgc28gd2UgZmFzdC1wYXRoXG4gICAgLy8gdGhlbS5cbiAgICBub25Ib3N0Q2hhcnMgPSBbJyUnLCAnLycsICc/JywgJzsnLCAnIyddLmNvbmNhdChhdXRvRXNjYXBlKSxcbiAgICBob3N0RW5kaW5nQ2hhcnMgPSBbJy8nLCAnPycsICcjJ10sXG4gICAgaG9zdG5hbWVNYXhMZW4gPSAyNTUsXG4gICAgaG9zdG5hbWVQYXJ0UGF0dGVybiA9IC9eW2EtejAtOUEtWl8tXXswLDYzfSQvLFxuICAgIGhvc3RuYW1lUGFydFN0YXJ0ID0gL14oW2EtejAtOUEtWl8tXXswLDYzfSkoLiopJC8sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgY2FuIGFsbG93IFwidW5zYWZlXCIgYW5kIFwidW53aXNlXCIgY2hhcnMuXG4gICAgdW5zYWZlUHJvdG9jb2wgPSB7XG4gICAgICAnamF2YXNjcmlwdCc6IHRydWUsXG4gICAgICAnamF2YXNjcmlwdDonOiB0cnVlXG4gICAgfSxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBuZXZlciBoYXZlIGEgaG9zdG5hbWUuXG4gICAgaG9zdGxlc3NQcm90b2NvbCA9IHtcbiAgICAgICdqYXZhc2NyaXB0JzogdHJ1ZSxcbiAgICAgICdqYXZhc2NyaXB0Oic6IHRydWVcbiAgICB9LFxuICAgIC8vIHByb3RvY29scyB0aGF0IGFsd2F5cyBjb250YWluIGEgLy8gYml0LlxuICAgIHNsYXNoZWRQcm90b2NvbCA9IHtcbiAgICAgICdodHRwJzogdHJ1ZSxcbiAgICAgICdodHRwcyc6IHRydWUsXG4gICAgICAnZnRwJzogdHJ1ZSxcbiAgICAgICdnb3BoZXInOiB0cnVlLFxuICAgICAgJ2ZpbGUnOiB0cnVlLFxuICAgICAgJ2h0dHA6JzogdHJ1ZSxcbiAgICAgICdodHRwczonOiB0cnVlLFxuICAgICAgJ2Z0cDonOiB0cnVlLFxuICAgICAgJ2dvcGhlcjonOiB0cnVlLFxuICAgICAgJ2ZpbGU6JzogdHJ1ZVxuICAgIH0sXG4gICAgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuXG5mdW5jdGlvbiB1cmxQYXJzZSh1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KSB7XG4gIGlmICh1cmwgJiYgaXNPYmplY3QodXJsKSAmJiB1cmwgaW5zdGFuY2VvZiBVcmwpIHJldHVybiB1cmw7XG5cbiAgdmFyIHUgPSBuZXcgVXJsO1xuICB1LnBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpO1xuICByZXR1cm4gdTtcbn1cblxuVXJsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKCFpc1N0cmluZyh1cmwpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlBhcmFtZXRlciAndXJsJyBtdXN0IGJlIGEgc3RyaW5nLCBub3QgXCIgKyB0eXBlb2YgdXJsKTtcbiAgfVxuXG4gIHZhciByZXN0ID0gdXJsO1xuXG4gIC8vIHRyaW0gYmVmb3JlIHByb2NlZWRpbmcuXG4gIC8vIFRoaXMgaXMgdG8gc3VwcG9ydCBwYXJzZSBzdHVmZiBsaWtlIFwiICBodHRwOi8vZm9vLmNvbSAgXFxuXCJcbiAgcmVzdCA9IHJlc3QudHJpbSgpO1xuXG4gIHZhciBwcm90byA9IHByb3RvY29sUGF0dGVybi5leGVjKHJlc3QpO1xuICBpZiAocHJvdG8pIHtcbiAgICBwcm90byA9IHByb3RvWzBdO1xuICAgIHZhciBsb3dlclByb3RvID0gcHJvdG8udG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnByb3RvY29sID0gbG93ZXJQcm90bztcbiAgICByZXN0ID0gcmVzdC5zdWJzdHIocHJvdG8ubGVuZ3RoKTtcbiAgfVxuXG4gIC8vIGZpZ3VyZSBvdXQgaWYgaXQncyBnb3QgYSBob3N0XG4gIC8vIHVzZXJAc2VydmVyIGlzICphbHdheXMqIGludGVycHJldGVkIGFzIGEgaG9zdG5hbWUsIGFuZCB1cmxcbiAgLy8gcmVzb2x1dGlvbiB3aWxsIHRyZWF0IC8vZm9vL2JhciBhcyBob3N0PWZvbyxwYXRoPWJhciBiZWNhdXNlIHRoYXQnc1xuICAvLyBob3cgdGhlIGJyb3dzZXIgcmVzb2x2ZXMgcmVsYXRpdmUgVVJMcy5cbiAgaWYgKHNsYXNoZXNEZW5vdGVIb3N0IHx8IHByb3RvIHx8IHJlc3QubWF0Y2goL15cXC9cXC9bXkBcXC9dK0BbXkBcXC9dKy8pKSB7XG4gICAgdmFyIHNsYXNoZXMgPSByZXN0LnN1YnN0cigwLCAyKSA9PT0gJy8vJztcbiAgICBpZiAoc2xhc2hlcyAmJiAhKHByb3RvICYmIGhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dKSkge1xuICAgICAgcmVzdCA9IHJlc3Quc3Vic3RyKDIpO1xuICAgICAgdGhpcy5zbGFzaGVzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dICYmXG4gICAgICAoc2xhc2hlcyB8fCAocHJvdG8gJiYgIXNsYXNoZWRQcm90b2NvbFtwcm90b10pKSkge1xuXG4gICAgLy8gdGhlcmUncyBhIGhvc3RuYW1lLlxuICAgIC8vIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiAvLCA/LCA7LCBvciAjIGVuZHMgdGhlIGhvc3QuXG4gICAgLy9cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBAIGluIHRoZSBob3N0bmFtZSwgdGhlbiBub24taG9zdCBjaGFycyAqYXJlKiBhbGxvd2VkXG4gICAgLy8gdG8gdGhlIGxlZnQgb2YgdGhlIGxhc3QgQCBzaWduLCB1bmxlc3Mgc29tZSBob3N0LWVuZGluZyBjaGFyYWN0ZXJcbiAgICAvLyBjb21lcyAqYmVmb3JlKiB0aGUgQC1zaWduLlxuICAgIC8vIFVSTHMgYXJlIG9ibm94aW91cy5cbiAgICAvL1xuICAgIC8vIGV4OlxuICAgIC8vIGh0dHA6Ly9hQGJAYy8gPT4gdXNlcjphQGIgaG9zdDpjXG4gICAgLy8gaHR0cDovL2FAYj9AYyA9PiB1c2VyOmEgaG9zdDpjIHBhdGg6Lz9AY1xuXG4gICAgLy8gdjAuMTIgVE9ETyhpc2FhY3MpOiBUaGlzIGlzIG5vdCBxdWl0ZSBob3cgQ2hyb21lIGRvZXMgdGhpbmdzLlxuICAgIC8vIFJldmlldyBvdXIgdGVzdCBjYXNlIGFnYWluc3QgYnJvd3NlcnMgbW9yZSBjb21wcmVoZW5zaXZlbHkuXG5cbiAgICAvLyBmaW5kIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhbnkgaG9zdEVuZGluZ0NoYXJzXG4gICAgdmFyIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhvc3RFbmRpbmdDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihob3N0RW5kaW5nQ2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cblxuICAgIC8vIGF0IHRoaXMgcG9pbnQsIGVpdGhlciB3ZSBoYXZlIGFuIGV4cGxpY2l0IHBvaW50IHdoZXJlIHRoZVxuICAgIC8vIGF1dGggcG9ydGlvbiBjYW5ub3QgZ28gcGFzdCwgb3IgdGhlIGxhc3QgQCBjaGFyIGlzIHRoZSBkZWNpZGVyLlxuICAgIHZhciBhdXRoLCBhdFNpZ247XG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKSB7XG4gICAgICAvLyBhdFNpZ24gY2FuIGJlIGFueXdoZXJlLlxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhdFNpZ24gbXVzdCBiZSBpbiBhdXRoIHBvcnRpb24uXG4gICAgICAvLyBodHRwOi8vYUBiL2NAZCA9PiBob3N0OmIgYXV0aDphIHBhdGg6L2NAZFxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcsIGhvc3RFbmQpO1xuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBoYXZlIGEgcG9ydGlvbiB3aGljaCBpcyBkZWZpbml0ZWx5IHRoZSBhdXRoLlxuICAgIC8vIFB1bGwgdGhhdCBvZmYuXG4gICAgaWYgKGF0U2lnbiAhPT0gLTEpIHtcbiAgICAgIGF1dGggPSByZXN0LnNsaWNlKDAsIGF0U2lnbik7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZShhdFNpZ24gKyAxKTtcbiAgICAgIHRoaXMuYXV0aCA9IGRlY29kZVVSSUNvbXBvbmVudChhdXRoKTtcbiAgICB9XG5cbiAgICAvLyB0aGUgaG9zdCBpcyB0aGUgcmVtYWluaW5nIHRvIHRoZSBsZWZ0IG9mIHRoZSBmaXJzdCBub24taG9zdCBjaGFyXG4gICAgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9uSG9zdENoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGVjID0gcmVzdC5pbmRleE9mKG5vbkhvc3RDaGFyc1tpXSk7XG4gICAgICBpZiAoaGVjICE9PSAtMSAmJiAoaG9zdEVuZCA9PT0gLTEgfHwgaGVjIDwgaG9zdEVuZCkpXG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgfVxuICAgIC8vIGlmIHdlIHN0aWxsIGhhdmUgbm90IGhpdCBpdCwgdGhlbiB0aGUgZW50aXJlIHRoaW5nIGlzIGEgaG9zdC5cbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpXG4gICAgICBob3N0RW5kID0gcmVzdC5sZW5ndGg7XG5cbiAgICB0aGlzLmhvc3QgPSByZXN0LnNsaWNlKDAsIGhvc3RFbmQpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKGhvc3RFbmQpO1xuXG4gICAgLy8gcHVsbCBvdXQgcG9ydC5cbiAgICB0aGlzLnBhcnNlSG9zdCgpO1xuXG4gICAgLy8gd2UndmUgaW5kaWNhdGVkIHRoYXQgdGhlcmUgaXMgYSBob3N0bmFtZSxcbiAgICAvLyBzbyBldmVuIGlmIGl0J3MgZW1wdHksIGl0IGhhcyB0byBiZSBwcmVzZW50LlxuICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuXG4gICAgLy8gaWYgaG9zdG5hbWUgYmVnaW5zIHdpdGggWyBhbmQgZW5kcyB3aXRoIF1cbiAgICAvLyBhc3N1bWUgdGhhdCBpdCdzIGFuIElQdjYgYWRkcmVzcy5cbiAgICB2YXIgaXB2Nkhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVswXSA9PT0gJ1snICYmXG4gICAgICAgIHRoaXMuaG9zdG5hbWVbdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAxXSA9PT0gJ10nO1xuXG4gICAgLy8gdmFsaWRhdGUgYSBsaXR0bGUuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHZhciBob3N0cGFydHMgPSB0aGlzLmhvc3RuYW1lLnNwbGl0KC9cXC4vKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gaG9zdHBhcnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IGhvc3RwYXJ0c1tpXTtcbiAgICAgICAgaWYgKCFwYXJ0KSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgdmFyIG5ld3BhcnQgPSAnJztcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgayA9IHBhcnQubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgICBpZiAocGFydC5jaGFyQ29kZUF0KGopID4gMTI3KSB7XG4gICAgICAgICAgICAgIC8vIHdlIHJlcGxhY2Ugbm9uLUFTQ0lJIGNoYXIgd2l0aCBhIHRlbXBvcmFyeSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRoaXMgdG8gbWFrZSBzdXJlIHNpemUgb2YgaG9zdG5hbWUgaXMgbm90XG4gICAgICAgICAgICAgIC8vIGJyb2tlbiBieSByZXBsYWNpbmcgbm9uLUFTQ0lJIGJ5IG5vdGhpbmdcbiAgICAgICAgICAgICAgbmV3cGFydCArPSAneCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9IHBhcnRbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHdlIHRlc3QgYWdhaW4gd2l0aCBBU0NJSSBjaGFyIG9ubHlcbiAgICAgICAgICBpZiAoIW5ld3BhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZFBhcnRzID0gaG9zdHBhcnRzLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgdmFyIG5vdEhvc3QgPSBob3N0cGFydHMuc2xpY2UoaSArIDEpO1xuICAgICAgICAgICAgdmFyIGJpdCA9IHBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0U3RhcnQpO1xuICAgICAgICAgICAgaWYgKGJpdCkge1xuICAgICAgICAgICAgICB2YWxpZFBhcnRzLnB1c2goYml0WzFdKTtcbiAgICAgICAgICAgICAgbm90SG9zdC51bnNoaWZ0KGJpdFsyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm90SG9zdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVzdCA9ICcvJyArIG5vdEhvc3Quam9pbignLicpICsgcmVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaG9zdG5hbWUgPSB2YWxpZFBhcnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3RuYW1lLmxlbmd0aCA+IGhvc3RuYW1lTWF4TGVuKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGhvc3RuYW1lcyBhcmUgYWx3YXlzIGxvd2VyIGNhc2UuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICAvLyBJRE5BIFN1cHBvcnQ6IFJldHVybnMgYSBwdW55IGNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIFwiZG9tYWluXCIuXG4gICAgICAvLyBJdCBvbmx5IGNvbnZlcnRzIHRoZSBwYXJ0IG9mIHRoZSBkb21haW4gbmFtZSB0aGF0XG4gICAgICAvLyBoYXMgbm9uIEFTQ0lJIGNoYXJhY3RlcnMuIEkuZS4gaXQgZG9zZW50IG1hdHRlciBpZlxuICAgICAgLy8geW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0IGFscmVhZHkgaXMgaW4gQVNDSUkuXG4gICAgICB2YXIgZG9tYWluQXJyYXkgPSB0aGlzLmhvc3RuYW1lLnNwbGl0KCcuJyk7XG4gICAgICB2YXIgbmV3T3V0ID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRvbWFpbkFycmF5Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBzID0gZG9tYWluQXJyYXlbaV07XG4gICAgICAgIG5ld091dC5wdXNoKHMubWF0Y2goL1teQS1aYS16MC05Xy1dLykgP1xuICAgICAgICAgICAgJ3huLS0nICsgcHVueWNvZGUuZW5jb2RlKHMpIDogcyk7XG4gICAgICB9XG4gICAgICB0aGlzLmhvc3RuYW1lID0gbmV3T3V0LmpvaW4oJy4nKTtcbiAgICB9XG5cbiAgICB2YXIgcCA9IHRoaXMucG9ydCA/ICc6JyArIHRoaXMucG9ydCA6ICcnO1xuICAgIHZhciBoID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcbiAgICB0aGlzLmhvc3QgPSBoICsgcDtcbiAgICB0aGlzLmhyZWYgKz0gdGhpcy5ob3N0O1xuXG4gICAgLy8gc3RyaXAgWyBhbmQgXSBmcm9tIHRoZSBob3N0bmFtZVxuICAgIC8vIHRoZSBob3N0IGZpZWxkIHN0aWxsIHJldGFpbnMgdGhlbSwgdGhvdWdoXG4gICAgaWYgKGlwdjZIb3N0bmFtZSkge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUuc3Vic3RyKDEsIHRoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBpZiAocmVzdFswXSAhPT0gJy8nKSB7XG4gICAgICAgIHJlc3QgPSAnLycgKyByZXN0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vdyByZXN0IGlzIHNldCB0byB0aGUgcG9zdC1ob3N0IHN0dWZmLlxuICAvLyBjaG9wIG9mZiBhbnkgZGVsaW0gY2hhcnMuXG4gIGlmICghdW5zYWZlUHJvdG9jb2xbbG93ZXJQcm90b10pIHtcblxuICAgIC8vIEZpcnN0LCBtYWtlIDEwMCUgc3VyZSB0aGF0IGFueSBcImF1dG9Fc2NhcGVcIiBjaGFycyBnZXRcbiAgICAvLyBlc2NhcGVkLCBldmVuIGlmIGVuY29kZVVSSUNvbXBvbmVudCBkb2Vzbid0IHRoaW5rIHRoZXlcbiAgICAvLyBuZWVkIHRvIGJlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXV0b0VzY2FwZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBhZSA9IGF1dG9Fc2NhcGVbaV07XG4gICAgICB2YXIgZXNjID0gZW5jb2RlVVJJQ29tcG9uZW50KGFlKTtcbiAgICAgIGlmIChlc2MgPT09IGFlKSB7XG4gICAgICAgIGVzYyA9IGVzY2FwZShhZSk7XG4gICAgICB9XG4gICAgICByZXN0ID0gcmVzdC5zcGxpdChhZSkuam9pbihlc2MpO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gY2hvcCBvZmYgZnJvbSB0aGUgdGFpbCBmaXJzdC5cbiAgdmFyIGhhc2ggPSByZXN0LmluZGV4T2YoJyMnKTtcbiAgaWYgKGhhc2ggIT09IC0xKSB7XG4gICAgLy8gZ290IGEgZnJhZ21lbnQgc3RyaW5nLlxuICAgIHRoaXMuaGFzaCA9IHJlc3Quc3Vic3RyKGhhc2gpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKDAsIGhhc2gpO1xuICB9XG4gIHZhciBxbSA9IHJlc3QuaW5kZXhPZignPycpO1xuICBpZiAocW0gIT09IC0xKSB7XG4gICAgdGhpcy5zZWFyY2ggPSByZXN0LnN1YnN0cihxbSk7XG4gICAgdGhpcy5xdWVyeSA9IHJlc3Quc3Vic3RyKHFtICsgMSk7XG4gICAgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAgIHRoaXMucXVlcnkgPSBxdWVyeXN0cmluZy5wYXJzZSh0aGlzLnF1ZXJ5KTtcbiAgICB9XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoMCwgcW0pO1xuICB9IGVsc2UgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAvLyBubyBxdWVyeSBzdHJpbmcsIGJ1dCBwYXJzZVF1ZXJ5U3RyaW5nIHN0aWxsIHJlcXVlc3RlZFxuICAgIHRoaXMuc2VhcmNoID0gJyc7XG4gICAgdGhpcy5xdWVyeSA9IHt9O1xuICB9XG4gIGlmIChyZXN0KSB0aGlzLnBhdGhuYW1lID0gcmVzdDtcbiAgaWYgKHNsYXNoZWRQcm90b2NvbFtsb3dlclByb3RvXSAmJlxuICAgICAgdGhpcy5ob3N0bmFtZSAmJiAhdGhpcy5wYXRobmFtZSkge1xuICAgIHRoaXMucGF0aG5hbWUgPSAnLyc7XG4gIH1cblxuICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gIGlmICh0aGlzLnBhdGhuYW1lIHx8IHRoaXMuc2VhcmNoKSB7XG4gICAgdmFyIHAgPSB0aGlzLnBhdGhuYW1lIHx8ICcnO1xuICAgIHZhciBzID0gdGhpcy5zZWFyY2ggfHwgJyc7XG4gICAgdGhpcy5wYXRoID0gcCArIHM7XG4gIH1cblxuICAvLyBmaW5hbGx5LCByZWNvbnN0cnVjdCB0aGUgaHJlZiBiYXNlZCBvbiB3aGF0IGhhcyBiZWVuIHZhbGlkYXRlZC5cbiAgdGhpcy5ocmVmID0gdGhpcy5mb3JtYXQoKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBmb3JtYXQgYSBwYXJzZWQgb2JqZWN0IGludG8gYSB1cmwgc3RyaW5nXG5mdW5jdGlvbiB1cmxGb3JtYXQob2JqKSB7XG4gIC8vIGVuc3VyZSBpdCdzIGFuIG9iamVjdCwgYW5kIG5vdCBhIHN0cmluZyB1cmwuXG4gIC8vIElmIGl0J3MgYW4gb2JqLCB0aGlzIGlzIGEgbm8tb3AuXG4gIC8vIHRoaXMgd2F5LCB5b3UgY2FuIGNhbGwgdXJsX2Zvcm1hdCgpIG9uIHN0cmluZ3NcbiAgLy8gdG8gY2xlYW4gdXAgcG90ZW50aWFsbHkgd29ua3kgdXJscy5cbiAgaWYgKGlzU3RyaW5nKG9iaikpIG9iaiA9IHVybFBhcnNlKG9iaik7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIFVybCkpIHJldHVybiBVcmwucHJvdG90eXBlLmZvcm1hdC5jYWxsKG9iaik7XG4gIHJldHVybiBvYmouZm9ybWF0KCk7XG59XG5cblVybC5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhdXRoID0gdGhpcy5hdXRoIHx8ICcnO1xuICBpZiAoYXV0aCkge1xuICAgIGF1dGggPSBlbmNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgYXV0aCA9IGF1dGgucmVwbGFjZSgvJTNBL2ksICc6Jyk7XG4gICAgYXV0aCArPSAnQCc7XG4gIH1cblxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLnByb3RvY29sIHx8ICcnLFxuICAgICAgcGF0aG5hbWUgPSB0aGlzLnBhdGhuYW1lIHx8ICcnLFxuICAgICAgaGFzaCA9IHRoaXMuaGFzaCB8fCAnJyxcbiAgICAgIGhvc3QgPSBmYWxzZSxcbiAgICAgIHF1ZXJ5ID0gJyc7XG5cbiAgaWYgKHRoaXMuaG9zdCkge1xuICAgIGhvc3QgPSBhdXRoICsgdGhpcy5ob3N0O1xuICB9IGVsc2UgaWYgKHRoaXMuaG9zdG5hbWUpIHtcbiAgICBob3N0ID0gYXV0aCArICh0aGlzLmhvc3RuYW1lLmluZGV4T2YoJzonKSA9PT0gLTEgP1xuICAgICAgICB0aGlzLmhvc3RuYW1lIDpcbiAgICAgICAgJ1snICsgdGhpcy5ob3N0bmFtZSArICddJyk7XG4gICAgaWYgKHRoaXMucG9ydCkge1xuICAgICAgaG9zdCArPSAnOicgKyB0aGlzLnBvcnQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMucXVlcnkgJiZcbiAgICAgIGlzT2JqZWN0KHRoaXMucXVlcnkpICYmXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJ5KS5sZW5ndGgpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh0aGlzLnF1ZXJ5KTtcbiAgfVxuXG4gIHZhciBzZWFyY2ggPSB0aGlzLnNlYXJjaCB8fCAocXVlcnkgJiYgKCc/JyArIHF1ZXJ5KSkgfHwgJyc7XG5cbiAgaWYgKHByb3RvY29sICYmIHByb3RvY29sLnN1YnN0cigtMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIC8vIG9ubHkgdGhlIHNsYXNoZWRQcm90b2NvbHMgZ2V0IHRoZSAvLy4gIE5vdCBtYWlsdG86LCB4bXBwOiwgZXRjLlxuICAvLyB1bmxlc3MgdGhleSBoYWQgdGhlbSB0byBiZWdpbiB3aXRoLlxuICBpZiAodGhpcy5zbGFzaGVzIHx8XG4gICAgICAoIXByb3RvY29sIHx8IHNsYXNoZWRQcm90b2NvbFtwcm90b2NvbF0pICYmIGhvc3QgIT09IGZhbHNlKSB7XG4gICAgaG9zdCA9ICcvLycgKyAoaG9zdCB8fCAnJyk7XG4gICAgaWYgKHBhdGhuYW1lICYmIHBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nKSBwYXRobmFtZSA9ICcvJyArIHBhdGhuYW1lO1xuICB9IGVsc2UgaWYgKCFob3N0KSB7XG4gICAgaG9zdCA9ICcnO1xuICB9XG5cbiAgaWYgKGhhc2ggJiYgaGFzaC5jaGFyQXQoMCkgIT09ICcjJykgaGFzaCA9ICcjJyArIGhhc2g7XG4gIGlmIChzZWFyY2ggJiYgc2VhcmNoLmNoYXJBdCgwKSAhPT0gJz8nKSBzZWFyY2ggPSAnPycgKyBzZWFyY2g7XG5cbiAgcGF0aG5hbWUgPSBwYXRobmFtZS5yZXBsYWNlKC9bPyNdL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChtYXRjaCk7XG4gIH0pO1xuICBzZWFyY2ggPSBzZWFyY2gucmVwbGFjZSgnIycsICclMjMnKTtcblxuICByZXR1cm4gcHJvdG9jb2wgKyBob3N0ICsgcGF0aG5hbWUgKyBzZWFyY2ggKyBoYXNoO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZShzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlKHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgcmV0dXJuIHRoaXMucmVzb2x2ZU9iamVjdCh1cmxQYXJzZShyZWxhdGl2ZSwgZmFsc2UsIHRydWUpKS5mb3JtYXQoKTtcbn07XG5cbmZ1bmN0aW9uIHVybFJlc29sdmVPYmplY3Qoc291cmNlLCByZWxhdGl2ZSkge1xuICBpZiAoIXNvdXJjZSkgcmV0dXJuIHJlbGF0aXZlO1xuICByZXR1cm4gdXJsUGFyc2Uoc291cmNlLCBmYWxzZSwgdHJ1ZSkucmVzb2x2ZU9iamVjdChyZWxhdGl2ZSk7XG59XG5cblVybC5wcm90b3R5cGUucmVzb2x2ZU9iamVjdCA9IGZ1bmN0aW9uKHJlbGF0aXZlKSB7XG4gIGlmIChpc1N0cmluZyhyZWxhdGl2ZSkpIHtcbiAgICB2YXIgcmVsID0gbmV3IFVybCgpO1xuICAgIHJlbC5wYXJzZShyZWxhdGl2ZSwgZmFsc2UsIHRydWUpO1xuICAgIHJlbGF0aXZlID0gcmVsO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IG5ldyBVcmwoKTtcbiAgT2JqZWN0LmtleXModGhpcykuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgcmVzdWx0W2tdID0gdGhpc1trXTtcbiAgfSwgdGhpcyk7XG5cbiAgLy8gaGFzaCBpcyBhbHdheXMgb3ZlcnJpZGRlbiwgbm8gbWF0dGVyIHdoYXQuXG4gIC8vIGV2ZW4gaHJlZj1cIlwiIHdpbGwgcmVtb3ZlIGl0LlxuICByZXN1bHQuaGFzaCA9IHJlbGF0aXZlLmhhc2g7XG5cbiAgLy8gaWYgdGhlIHJlbGF0aXZlIHVybCBpcyBlbXB0eSwgdGhlbiB0aGVyZSdzIG5vdGhpbmcgbGVmdCB0byBkbyBoZXJlLlxuICBpZiAocmVsYXRpdmUuaHJlZiA9PT0gJycpIHtcbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gaHJlZnMgbGlrZSAvL2Zvby9iYXIgYWx3YXlzIGN1dCB0byB0aGUgcHJvdG9jb2wuXG4gIGlmIChyZWxhdGl2ZS5zbGFzaGVzICYmICFyZWxhdGl2ZS5wcm90b2NvbCkge1xuICAgIC8vIHRha2UgZXZlcnl0aGluZyBleGNlcHQgdGhlIHByb3RvY29sIGZyb20gcmVsYXRpdmVcbiAgICBPYmplY3Qua2V5cyhyZWxhdGl2ZSkuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgICBpZiAoayAhPT0gJ3Byb3RvY29sJylcbiAgICAgICAgcmVzdWx0W2tdID0gcmVsYXRpdmVba107XG4gICAgfSk7XG5cbiAgICAvL3VybFBhcnNlIGFwcGVuZHMgdHJhaWxpbmcgLyB0byB1cmxzIGxpa2UgaHR0cDovL3d3dy5leGFtcGxlLmNvbVxuICAgIGlmIChzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXSAmJlxuICAgICAgICByZXN1bHQuaG9zdG5hbWUgJiYgIXJlc3VsdC5wYXRobmFtZSkge1xuICAgICAgcmVzdWx0LnBhdGggPSByZXN1bHQucGF0aG5hbWUgPSAnLyc7XG4gICAgfVxuXG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmIChyZWxhdGl2ZS5wcm90b2NvbCAmJiByZWxhdGl2ZS5wcm90b2NvbCAhPT0gcmVzdWx0LnByb3RvY29sKSB7XG4gICAgLy8gaWYgaXQncyBhIGtub3duIHVybCBwcm90b2NvbCwgdGhlbiBjaGFuZ2luZ1xuICAgIC8vIHRoZSBwcm90b2NvbCBkb2VzIHdlaXJkIHRoaW5nc1xuICAgIC8vIGZpcnN0LCBpZiBpdCdzIG5vdCBmaWxlOiwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBob3N0LFxuICAgIC8vIGFuZCBpZiB0aGVyZSB3YXMgYSBwYXRoXG4gICAgLy8gdG8gYmVnaW4gd2l0aCwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBwYXRoLlxuICAgIC8vIGlmIGl0IGlzIGZpbGU6LCB0aGVuIHRoZSBob3N0IGlzIGRyb3BwZWQsXG4gICAgLy8gYmVjYXVzZSB0aGF0J3Mga25vd24gdG8gYmUgaG9zdGxlc3MuXG4gICAgLy8gYW55dGhpbmcgZWxzZSBpcyBhc3N1bWVkIHRvIGJlIGFic29sdXRlLlxuICAgIGlmICghc2xhc2hlZFByb3RvY29sW3JlbGF0aXZlLnByb3RvY29sXSkge1xuICAgICAgT2JqZWN0LmtleXMocmVsYXRpdmUpLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgICByZXN1bHRba10gPSByZWxhdGl2ZVtrXTtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJlc3VsdC5wcm90b2NvbCA9IHJlbGF0aXZlLnByb3RvY29sO1xuICAgIGlmICghcmVsYXRpdmUuaG9zdCAmJiAhaG9zdGxlc3NQcm90b2NvbFtyZWxhdGl2ZS5wcm90b2NvbF0pIHtcbiAgICAgIHZhciByZWxQYXRoID0gKHJlbGF0aXZlLnBhdGhuYW1lIHx8ICcnKS5zcGxpdCgnLycpO1xuICAgICAgd2hpbGUgKHJlbFBhdGgubGVuZ3RoICYmICEocmVsYXRpdmUuaG9zdCA9IHJlbFBhdGguc2hpZnQoKSkpO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0KSByZWxhdGl2ZS5ob3N0ID0gJyc7XG4gICAgICBpZiAoIXJlbGF0aXZlLmhvc3RuYW1lKSByZWxhdGl2ZS5ob3N0bmFtZSA9ICcnO1xuICAgICAgaWYgKHJlbFBhdGhbMF0gIT09ICcnKSByZWxQYXRoLnVuc2hpZnQoJycpO1xuICAgICAgaWYgKHJlbFBhdGgubGVuZ3RoIDwgMikgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIHJlc3VsdC5wYXRobmFtZSA9IHJlbFBhdGguam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxhdGl2ZS5wYXRobmFtZTtcbiAgICB9XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICByZXN1bHQuaG9zdCA9IHJlbGF0aXZlLmhvc3QgfHwgJyc7XG4gICAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoO1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3Q7XG4gICAgcmVzdWx0LnBvcnQgPSByZWxhdGl2ZS5wb3J0O1xuICAgIC8vIHRvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5wYXRobmFtZSB8fCByZXN1bHQuc2VhcmNoKSB7XG4gICAgICB2YXIgcCA9IHJlc3VsdC5wYXRobmFtZSB8fCAnJztcbiAgICAgIHZhciBzID0gcmVzdWx0LnNlYXJjaCB8fCAnJztcbiAgICAgIHJlc3VsdC5wYXRoID0gcCArIHM7XG4gICAgfVxuICAgIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdmFyIGlzU291cmNlQWJzID0gKHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpLFxuICAgICAgaXNSZWxBYnMgPSAoXG4gICAgICAgICAgcmVsYXRpdmUuaG9zdCB8fFxuICAgICAgICAgIHJlbGF0aXZlLnBhdGhuYW1lICYmIHJlbGF0aXZlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nXG4gICAgICApLFxuICAgICAgbXVzdEVuZEFicyA9IChpc1JlbEFicyB8fCBpc1NvdXJjZUFicyB8fFxuICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhvc3QgJiYgcmVsYXRpdmUucGF0aG5hbWUpKSxcbiAgICAgIHJlbW92ZUFsbERvdHMgPSBtdXN0RW5kQWJzLFxuICAgICAgc3JjUGF0aCA9IHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHJlbFBhdGggPSByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdLFxuICAgICAgcHN5Y2hvdGljID0gcmVzdWx0LnByb3RvY29sICYmICFzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXTtcblxuICAvLyBpZiB0aGUgdXJsIGlzIGEgbm9uLXNsYXNoZWQgdXJsLCB0aGVuIHJlbGF0aXZlXG4gIC8vIGxpbmtzIGxpa2UgLi4vLi4gc2hvdWxkIGJlIGFibGVcbiAgLy8gdG8gY3Jhd2wgdXAgdG8gdGhlIGhvc3RuYW1lLCBhcyB3ZWxsLiAgVGhpcyBpcyBzdHJhbmdlLlxuICAvLyByZXN1bHQucHJvdG9jb2wgaGFzIGFscmVhZHkgYmVlbiBzZXQgYnkgbm93LlxuICAvLyBMYXRlciBvbiwgcHV0IHRoZSBmaXJzdCBwYXRoIHBhcnQgaW50byB0aGUgaG9zdCBmaWVsZC5cbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9ICcnO1xuICAgIHJlc3VsdC5wb3J0ID0gbnVsbDtcbiAgICBpZiAocmVzdWx0Lmhvc3QpIHtcbiAgICAgIGlmIChzcmNQYXRoWzBdID09PSAnJykgc3JjUGF0aFswXSA9IHJlc3VsdC5ob3N0O1xuICAgICAgZWxzZSBzcmNQYXRoLnVuc2hpZnQocmVzdWx0Lmhvc3QpO1xuICAgIH1cbiAgICByZXN1bHQuaG9zdCA9ICcnO1xuICAgIGlmIChyZWxhdGl2ZS5wcm90b2NvbCkge1xuICAgICAgcmVsYXRpdmUuaG9zdG5hbWUgPSBudWxsO1xuICAgICAgcmVsYXRpdmUucG9ydCA9IG51bGw7XG4gICAgICBpZiAocmVsYXRpdmUuaG9zdCkge1xuICAgICAgICBpZiAocmVsUGF0aFswXSA9PT0gJycpIHJlbFBhdGhbMF0gPSByZWxhdGl2ZS5ob3N0O1xuICAgICAgICBlbHNlIHJlbFBhdGgudW5zaGlmdChyZWxhdGl2ZS5ob3N0KTtcbiAgICAgIH1cbiAgICAgIHJlbGF0aXZlLmhvc3QgPSBudWxsO1xuICAgIH1cbiAgICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyAmJiAocmVsUGF0aFswXSA9PT0gJycgfHwgc3JjUGF0aFswXSA9PT0gJycpO1xuICB9XG5cbiAgaWYgKGlzUmVsQWJzKSB7XG4gICAgLy8gaXQncyBhYnNvbHV0ZS5cbiAgICByZXN1bHQuaG9zdCA9IChyZWxhdGl2ZS5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgPT09ICcnKSA/XG4gICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0IDogcmVzdWx0Lmhvc3Q7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gKHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3RuYW1lID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLmhvc3RuYW1lIDogcmVzdWx0Lmhvc3RuYW1lO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgc3JjUGF0aCA9IHJlbFBhdGg7XG4gICAgLy8gZmFsbCB0aHJvdWdoIHRvIHRoZSBkb3QtaGFuZGxpbmcgYmVsb3cuXG4gIH0gZWxzZSBpZiAocmVsUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBpdCdzIHJlbGF0aXZlXG4gICAgLy8gdGhyb3cgYXdheSB0aGUgZXhpc3RpbmcgZmlsZSwgYW5kIHRha2UgdGhlIG5ldyBwYXRoIGluc3RlYWQuXG4gICAgaWYgKCFzcmNQYXRoKSBzcmNQYXRoID0gW107XG4gICAgc3JjUGF0aC5wb3AoKTtcbiAgICBzcmNQYXRoID0gc3JjUGF0aC5jb25jYXQocmVsUGF0aCk7XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgfSBlbHNlIGlmICghaXNOdWxsT3JVbmRlZmluZWQocmVsYXRpdmUuc2VhcmNoKSkge1xuICAgIC8vIGp1c3QgcHVsbCBvdXQgdGhlIHNlYXJjaC5cbiAgICAvLyBsaWtlIGhyZWY9Jz9mb28nLlxuICAgIC8vIFB1dCB0aGlzIGFmdGVyIHRoZSBvdGhlciB0d28gY2FzZXMgYmVjYXVzZSBpdCBzaW1wbGlmaWVzIHRoZSBib29sZWFuc1xuICAgIGlmIChwc3ljaG90aWMpIHtcbiAgICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0ID0gc3JjUGF0aC5zaGlmdCgpO1xuICAgICAgLy9vY2NhdGlvbmFseSB0aGUgYXV0aCBjYW4gZ2V0IHN0dWNrIG9ubHkgaW4gaG9zdFxuICAgICAgLy90aGlzIGVzcGVjaWFseSBoYXBwZW5zIGluIGNhc2VzIGxpa2VcbiAgICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuaG9zdC5zcGxpdCgnQCcpIDogZmFsc2U7XG4gICAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdG5hbWUgPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmICghaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIWlzTnVsbChyZXN1bHQuc2VhcmNoKSkge1xuICAgICAgcmVzdWx0LnBhdGggPSAocmVzdWx0LnBhdGhuYW1lID8gcmVzdWx0LnBhdGhuYW1lIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5zZWFyY2ggPyByZXN1bHQuc2VhcmNoIDogJycpO1xuICAgIH1cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKCFzcmNQYXRoLmxlbmd0aCkge1xuICAgIC8vIG5vIHBhdGggYXQgYWxsLiAgZWFzeS5cbiAgICAvLyB3ZSd2ZSBhbHJlYWR5IGhhbmRsZWQgdGhlIG90aGVyIHN0dWZmIGFib3ZlLlxuICAgIHJlc3VsdC5wYXRobmFtZSA9IG51bGw7XG4gICAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmIChyZXN1bHQuc2VhcmNoKSB7XG4gICAgICByZXN1bHQucGF0aCA9ICcvJyArIHJlc3VsdC5zZWFyY2g7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gbnVsbDtcbiAgICB9XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGlmIGEgdXJsIEVORHMgaW4gLiBvciAuLiwgdGhlbiBpdCBtdXN0IGdldCBhIHRyYWlsaW5nIHNsYXNoLlxuICAvLyBob3dldmVyLCBpZiBpdCBlbmRzIGluIGFueXRoaW5nIGVsc2Ugbm9uLXNsYXNoeSxcbiAgLy8gdGhlbiBpdCBtdXN0IE5PVCBnZXQgYSB0cmFpbGluZyBzbGFzaC5cbiAgdmFyIGxhc3QgPSBzcmNQYXRoLnNsaWNlKC0xKVswXTtcbiAgdmFyIGhhc1RyYWlsaW5nU2xhc2ggPSAoXG4gICAgICAocmVzdWx0Lmhvc3QgfHwgcmVsYXRpdmUuaG9zdCkgJiYgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSB8fFxuICAgICAgbGFzdCA9PT0gJycpO1xuXG4gIC8vIHN0cmlwIHNpbmdsZSBkb3RzLCByZXNvbHZlIGRvdWJsZSBkb3RzIHRvIHBhcmVudCBkaXJcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHNyY1BhdGgubGVuZ3RoOyBpID49IDA7IGktLSkge1xuICAgIGxhc3QgPSBzcmNQYXRoW2ldO1xuICAgIGlmIChsYXN0ID09ICcuJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKCFtdXN0RW5kQWJzICYmICFyZW1vdmVBbGxEb3RzKSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBzcmNQYXRoLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgc3JjUGF0aFswXSAhPT0gJycgJiZcbiAgICAgICghc3JjUGF0aFswXSB8fCBzcmNQYXRoWzBdLmNoYXJBdCgwKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgudW5zaGlmdCgnJyk7XG4gIH1cblxuICBpZiAoaGFzVHJhaWxpbmdTbGFzaCAmJiAoc3JjUGF0aC5qb2luKCcvJykuc3Vic3RyKC0xKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgucHVzaCgnJyk7XG4gIH1cblxuICB2YXIgaXNBYnNvbHV0ZSA9IHNyY1BhdGhbMF0gPT09ICcnIHx8XG4gICAgICAoc3JjUGF0aFswXSAmJiBzcmNQYXRoWzBdLmNoYXJBdCgwKSA9PT0gJy8nKTtcblxuICAvLyBwdXQgdGhlIGhvc3QgYmFja1xuICBpZiAocHN5Y2hvdGljKSB7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBpc0Fic29sdXRlID8gJycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGF0aC5sZW5ndGggPyBzcmNQYXRoLnNoaWZ0KCkgOiAnJztcbiAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgLy90aGlzIGVzcGVjaWFseSBoYXBwZW5zIGluIGNhc2VzIGxpa2VcbiAgICAvL3VybC5yZXNvbHZlT2JqZWN0KCdtYWlsdG86bG9jYWwxQGRvbWFpbjEnLCAnbG9jYWwyQGRvbWFpbjInKVxuICAgIHZhciBhdXRoSW5Ib3N0ID0gcmVzdWx0Lmhvc3QgJiYgcmVzdWx0Lmhvc3QuaW5kZXhPZignQCcpID4gMCA/XG4gICAgICAgICAgICAgICAgICAgICByZXN1bHQuaG9zdC5zcGxpdCgnQCcpIDogZmFsc2U7XG4gICAgaWYgKGF1dGhJbkhvc3QpIHtcbiAgICAgIHJlc3VsdC5hdXRoID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdG5hbWUgPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgfVxuICB9XG5cbiAgbXVzdEVuZEFicyA9IG11c3RFbmRBYnMgfHwgKHJlc3VsdC5ob3N0ICYmIHNyY1BhdGgubGVuZ3RoKTtcblxuICBpZiAobXVzdEVuZEFicyAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHNyY1BhdGgudW5zaGlmdCgnJyk7XG4gIH1cblxuICBpZiAoIXNyY1BhdGgubGVuZ3RoKSB7XG4gICAgcmVzdWx0LnBhdGhuYW1lID0gbnVsbDtcbiAgICByZXN1bHQucGF0aCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0LnBhdGhuYW1lID0gc3JjUGF0aC5qb2luKCcvJyk7XG4gIH1cblxuICAvL3RvIHN1cHBvcnQgcmVxdWVzdC5odHRwXG4gIGlmICghaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIWlzTnVsbChyZXN1bHQuc2VhcmNoKSkge1xuICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gIH1cbiAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoIHx8IHJlc3VsdC5hdXRoO1xuICByZXN1bHQuc2xhc2hlcyA9IHJlc3VsdC5zbGFzaGVzIHx8IHJlbGF0aXZlLnNsYXNoZXM7XG4gIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuVXJsLnByb3RvdHlwZS5wYXJzZUhvc3QgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhvc3QgPSB0aGlzLmhvc3Q7XG4gIHZhciBwb3J0ID0gcG9ydFBhdHRlcm4uZXhlYyhob3N0KTtcbiAgaWYgKHBvcnQpIHtcbiAgICBwb3J0ID0gcG9ydFswXTtcbiAgICBpZiAocG9ydCAhPT0gJzonKSB7XG4gICAgICB0aGlzLnBvcnQgPSBwb3J0LnN1YnN0cigxKTtcbiAgICB9XG4gICAgaG9zdCA9IGhvc3Quc3Vic3RyKDAsIGhvc3QubGVuZ3RoIC0gcG9ydC5sZW5ndGgpO1xuICB9XG4gIGlmIChob3N0KSB0aGlzLmhvc3RuYW1lID0gaG9zdDtcbn07XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gXCJzdHJpbmdcIjtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gIGFyZyA9PSBudWxsO1xufVxuIiwiLyohIGh0dHBzOi8vbXRocy5iZS9wdW55Y29kZSB2MS4zLjIgYnkgQG1hdGhpYXMgKi9cbjsoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZXMgKi9cblx0dmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJlxuXHRcdCFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cdHZhciBmcmVlTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiZcblx0XHQhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblx0dmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcblx0aWYgKFxuXHRcdGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8XG5cdFx0ZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWxcblx0KSB7XG5cdFx0cm9vdCA9IGZyZWVHbG9iYWw7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwdW55Y29kZWAgb2JqZWN0LlxuXHQgKiBAbmFtZSBwdW55Y29kZVxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICovXG5cdHZhciBwdW55Y29kZSxcblxuXHQvKiogSGlnaGVzdCBwb3NpdGl2ZSBzaWduZWQgMzItYml0IGZsb2F0IHZhbHVlICovXG5cdG1heEludCA9IDIxNDc0ODM2NDcsIC8vIGFrYS4gMHg3RkZGRkZGRiBvciAyXjMxLTFcblxuXHQvKiogQm9vdHN0cmluZyBwYXJhbWV0ZXJzICovXG5cdGJhc2UgPSAzNixcblx0dE1pbiA9IDEsXG5cdHRNYXggPSAyNixcblx0c2tldyA9IDM4LFxuXHRkYW1wID0gNzAwLFxuXHRpbml0aWFsQmlhcyA9IDcyLFxuXHRpbml0aWFsTiA9IDEyOCwgLy8gMHg4MFxuXHRkZWxpbWl0ZXIgPSAnLScsIC8vICdcXHgyRCdcblxuXHQvKiogUmVndWxhciBleHByZXNzaW9ucyAqL1xuXHRyZWdleFB1bnljb2RlID0gL154bi0tLyxcblx0cmVnZXhOb25BU0NJSSA9IC9bXlxceDIwLVxceDdFXS8sIC8vIHVucHJpbnRhYmxlIEFTQ0lJIGNoYXJzICsgbm9uLUFTQ0lJIGNoYXJzXG5cdHJlZ2V4U2VwYXJhdG9ycyA9IC9bXFx4MkVcXHUzMDAyXFx1RkYwRVxcdUZGNjFdL2csIC8vIFJGQyAzNDkwIHNlcGFyYXRvcnNcblxuXHQvKiogRXJyb3IgbWVzc2FnZXMgKi9cblx0ZXJyb3JzID0ge1xuXHRcdCdvdmVyZmxvdyc6ICdPdmVyZmxvdzogaW5wdXQgbmVlZHMgd2lkZXIgaW50ZWdlcnMgdG8gcHJvY2VzcycsXG5cdFx0J25vdC1iYXNpYyc6ICdJbGxlZ2FsIGlucHV0ID49IDB4ODAgKG5vdCBhIGJhc2ljIGNvZGUgcG9pbnQpJyxcblx0XHQnaW52YWxpZC1pbnB1dCc6ICdJbnZhbGlkIGlucHV0J1xuXHR9LFxuXG5cdC8qKiBDb252ZW5pZW5jZSBzaG9ydGN1dHMgKi9cblx0YmFzZU1pbnVzVE1pbiA9IGJhc2UgLSB0TWluLFxuXHRmbG9vciA9IE1hdGguZmxvb3IsXG5cdHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUsXG5cblx0LyoqIFRlbXBvcmFyeSB2YXJpYWJsZSAqL1xuXHRrZXk7XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBlcnJvciB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZXJyb3IgdHlwZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaHJvd3MgYSBgUmFuZ2VFcnJvcmAgd2l0aCB0aGUgYXBwbGljYWJsZSBlcnJvciBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZXJyb3IodHlwZSkge1xuXHRcdHRocm93IFJhbmdlRXJyb3IoZXJyb3JzW3R5cGVdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgYEFycmF5I21hcGAgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5IGFycmF5XG5cdCAqIGl0ZW0uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcChhcnJheSwgZm4pIHtcblx0XHR2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcdHZhciByZXN1bHQgPSBbXTtcblx0XHR3aGlsZSAobGVuZ3RoLS0pIHtcblx0XHRcdHJlc3VsdFtsZW5ndGhdID0gZm4oYXJyYXlbbGVuZ3RoXSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogQSBzaW1wbGUgYEFycmF5I21hcGAtbGlrZSB3cmFwcGVyIHRvIHdvcmsgd2l0aCBkb21haW4gbmFtZSBzdHJpbmdzIG9yIGVtYWlsXG5cdCAqIGFkZHJlc3Nlcy5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5XG5cdCAqIGNoYXJhY3Rlci5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBzdHJpbmcgb2YgY2hhcmFjdGVycyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcblx0ICogZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXBEb21haW4oc3RyaW5nLCBmbikge1xuXHRcdHZhciBwYXJ0cyA9IHN0cmluZy5zcGxpdCgnQCcpO1xuXHRcdHZhciByZXN1bHQgPSAnJztcblx0XHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdFx0Ly8gSW4gZW1haWwgYWRkcmVzc2VzLCBvbmx5IHRoZSBkb21haW4gbmFtZSBzaG91bGQgYmUgcHVueWNvZGVkLiBMZWF2ZVxuXHRcdFx0Ly8gdGhlIGxvY2FsIHBhcnQgKGkuZS4gZXZlcnl0aGluZyB1cCB0byBgQGApIGludGFjdC5cblx0XHRcdHJlc3VsdCA9IHBhcnRzWzBdICsgJ0AnO1xuXHRcdFx0c3RyaW5nID0gcGFydHNbMV07XG5cdFx0fVxuXHRcdC8vIEF2b2lkIGBzcGxpdChyZWdleClgIGZvciBJRTggY29tcGF0aWJpbGl0eS4gU2VlICMxNy5cblx0XHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShyZWdleFNlcGFyYXRvcnMsICdcXHgyRScpO1xuXHRcdHZhciBsYWJlbHMgPSBzdHJpbmcuc3BsaXQoJy4nKTtcblx0XHR2YXIgZW5jb2RlZCA9IG1hcChsYWJlbHMsIGZuKS5qb2luKCcuJyk7XG5cdFx0cmV0dXJuIHJlc3VsdCArIGVuY29kZWQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1lcmljIGNvZGUgcG9pbnRzIG9mIGVhY2ggVW5pY29kZVxuXHQgKiBjaGFyYWN0ZXIgaW4gdGhlIHN0cmluZy4gV2hpbGUgSmF2YVNjcmlwdCB1c2VzIFVDUy0yIGludGVybmFsbHksXG5cdCAqIHRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoXG5cdCAqIFVDUy0yIGV4cG9zZXMgYXMgc2VwYXJhdGUgY2hhcmFjdGVycykgaW50byBhIHNpbmdsZSBjb2RlIHBvaW50LFxuXHQgKiBtYXRjaGluZyBVVEYtMTYuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZW5jb2RlYFxuXHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZGVjb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIFVuaWNvZGUgaW5wdXQgc3RyaW5nIChVQ1MtMikuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIG5ldyBhcnJheSBvZiBjb2RlIHBvaW50cy5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJkZWNvZGUoc3RyaW5nKSB7XG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBjb3VudGVyID0gMCxcblx0XHQgICAgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcblx0XHQgICAgdmFsdWUsXG5cdFx0ICAgIGV4dHJhO1xuXHRcdHdoaWxlIChjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHR2YWx1ZSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHRcdC8vIGhpZ2ggc3Vycm9nYXRlLCBhbmQgdGhlcmUgaXMgYSBuZXh0IGNoYXJhY3RlclxuXHRcdFx0XHRleHRyYSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRcdGlmICgoZXh0cmEgJiAweEZDMDApID09IDB4REMwMCkgeyAvLyBsb3cgc3Vycm9nYXRlXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goKCh2YWx1ZSAmIDB4M0ZGKSA8PCAxMCkgKyAoZXh0cmEgJiAweDNGRikgKyAweDEwMDAwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyB1bm1hdGNoZWQgc3Vycm9nYXRlOyBvbmx5IGFwcGVuZCB0aGlzIGNvZGUgdW5pdCwgaW4gY2FzZSB0aGUgbmV4dFxuXHRcdFx0XHRcdC8vIGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgc3RyaW5nIGJhc2VkIG9uIGFuIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZGVjb2RlYFxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBlbmNvZGVcblx0ICogQHBhcmFtIHtBcnJheX0gY29kZVBvaW50cyBUaGUgYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIG5ldyBVbmljb2RlIHN0cmluZyAoVUNTLTIpLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmVuY29kZShhcnJheSkge1xuXHRcdHJldHVybiBtYXAoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgb3V0cHV0ID0gJyc7XG5cdFx0XHRpZiAodmFsdWUgPiAweEZGRkYpIHtcblx0XHRcdFx0dmFsdWUgLT0gMHgxMDAwMDtcblx0XHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG5cdFx0XHRcdHZhbHVlID0gMHhEQzAwIHwgdmFsdWUgJiAweDNGRjtcblx0XHRcdH1cblx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGJhc2ljIGNvZGUgcG9pbnQgaW50byBhIGRpZ2l0L2ludGVnZXIuXG5cdCAqIEBzZWUgYGRpZ2l0VG9CYXNpYygpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gY29kZVBvaW50IFRoZSBiYXNpYyBudW1lcmljIGNvZGUgcG9pbnQgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludCAoZm9yIHVzZSBpblxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGluIHRoZSByYW5nZSBgMGAgdG8gYGJhc2UgLSAxYCwgb3IgYGJhc2VgIGlmXG5cdCAqIHRoZSBjb2RlIHBvaW50IGRvZXMgbm90IHJlcHJlc2VudCBhIHZhbHVlLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzaWNUb0RpZ2l0KGNvZGVQb2ludCkge1xuXHRcdGlmIChjb2RlUG9pbnQgLSA0OCA8IDEwKSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gMjI7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA2NSA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gNjU7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA5NyA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gOTc7XG5cdFx0fVxuXHRcdHJldHVybiBiYXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgZGlnaXQvaW50ZWdlciBpbnRvIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHNlZSBgYmFzaWNUb0RpZ2l0KClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBkaWdpdCBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNpYyBjb2RlIHBvaW50IHdob3NlIHZhbHVlICh3aGVuIHVzZWQgZm9yXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaXMgYGRpZ2l0YCwgd2hpY2ggbmVlZHMgdG8gYmUgaW4gdGhlIHJhbmdlXG5cdCAqIGAwYCB0byBgYmFzZSAtIDFgLiBJZiBgZmxhZ2AgaXMgbm9uLXplcm8sIHRoZSB1cHBlcmNhc2UgZm9ybSBpc1xuXHQgKiB1c2VkOyBlbHNlLCB0aGUgbG93ZXJjYXNlIGZvcm0gaXMgdXNlZC4gVGhlIGJlaGF2aW9yIGlzIHVuZGVmaW5lZFxuXHQgKiBpZiBgZmxhZ2AgaXMgbm9uLXplcm8gYW5kIGBkaWdpdGAgaGFzIG5vIHVwcGVyY2FzZSBmb3JtLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlnaXRUb0Jhc2ljKGRpZ2l0LCBmbGFnKSB7XG5cdFx0Ly8gIDAuLjI1IG1hcCB0byBBU0NJSSBhLi56IG9yIEEuLlpcblx0XHQvLyAyNi4uMzUgbWFwIHRvIEFTQ0lJIDAuLjlcblx0XHRyZXR1cm4gZGlnaXQgKyAyMiArIDc1ICogKGRpZ2l0IDwgMjYpIC0gKChmbGFnICE9IDApIDw8IDUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpYXMgYWRhcHRhdGlvbiBmdW5jdGlvbiBhcyBwZXIgc2VjdGlvbiAzLjQgb2YgUkZDIDM0OTIuXG5cdCAqIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM0OTIjc2VjdGlvbi0zLjRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGFkYXB0KGRlbHRhLCBudW1Qb2ludHMsIGZpcnN0VGltZSkge1xuXHRcdHZhciBrID0gMDtcblx0XHRkZWx0YSA9IGZpcnN0VGltZSA/IGZsb29yKGRlbHRhIC8gZGFtcCkgOiBkZWx0YSA+PiAxO1xuXHRcdGRlbHRhICs9IGZsb29yKGRlbHRhIC8gbnVtUG9pbnRzKTtcblx0XHRmb3IgKC8qIG5vIGluaXRpYWxpemF0aW9uICovOyBkZWx0YSA+IGJhc2VNaW51c1RNaW4gKiB0TWF4ID4+IDE7IGsgKz0gYmFzZSkge1xuXHRcdFx0ZGVsdGEgPSBmbG9vcihkZWx0YSAvIGJhc2VNaW51c1RNaW4pO1xuXHRcdH1cblx0XHRyZXR1cm4gZmxvb3IoayArIChiYXNlTWludXNUTWluICsgMSkgKiBkZWx0YSAvIChkZWx0YSArIHNrZXcpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMgdG8gYSBzdHJpbmcgb2YgVW5pY29kZVxuXHQgKiBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcblx0XHQvLyBEb24ndCB1c2UgVUNTLTJcblx0XHR2YXIgb3V0cHV0ID0gW10sXG5cdFx0ICAgIGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoLFxuXHRcdCAgICBvdXQsXG5cdFx0ICAgIGkgPSAwLFxuXHRcdCAgICBuID0gaW5pdGlhbE4sXG5cdFx0ICAgIGJpYXMgPSBpbml0aWFsQmlhcyxcblx0XHQgICAgYmFzaWMsXG5cdFx0ICAgIGosXG5cdFx0ICAgIGluZGV4LFxuXHRcdCAgICBvbGRpLFxuXHRcdCAgICB3LFxuXHRcdCAgICBrLFxuXHRcdCAgICBkaWdpdCxcblx0XHQgICAgdCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGJhc2VNaW51c1Q7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzOiBsZXQgYGJhc2ljYCBiZSB0aGUgbnVtYmVyIG9mIGlucHV0IGNvZGVcblx0XHQvLyBwb2ludHMgYmVmb3JlIHRoZSBsYXN0IGRlbGltaXRlciwgb3IgYDBgIGlmIHRoZXJlIGlzIG5vbmUsIHRoZW4gY29weVxuXHRcdC8vIHRoZSBmaXJzdCBiYXNpYyBjb2RlIHBvaW50cyB0byB0aGUgb3V0cHV0LlxuXG5cdFx0YmFzaWMgPSBpbnB1dC5sYXN0SW5kZXhPZihkZWxpbWl0ZXIpO1xuXHRcdGlmIChiYXNpYyA8IDApIHtcblx0XHRcdGJhc2ljID0gMDtcblx0XHR9XG5cblx0XHRmb3IgKGogPSAwOyBqIDwgYmFzaWM7ICsraikge1xuXHRcdFx0Ly8gaWYgaXQncyBub3QgYSBiYXNpYyBjb2RlIHBvaW50XG5cdFx0XHRpZiAoaW5wdXQuY2hhckNvZGVBdChqKSA+PSAweDgwKSB7XG5cdFx0XHRcdGVycm9yKCdub3QtYmFzaWMnKTtcblx0XHRcdH1cblx0XHRcdG91dHB1dC5wdXNoKGlucHV0LmNoYXJDb2RlQXQoaikpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZGVjb2RpbmcgbG9vcDogc3RhcnQganVzdCBhZnRlciB0aGUgbGFzdCBkZWxpbWl0ZXIgaWYgYW55IGJhc2ljIGNvZGVcblx0XHQvLyBwb2ludHMgd2VyZSBjb3BpZWQ7IHN0YXJ0IGF0IHRoZSBiZWdpbm5pbmcgb3RoZXJ3aXNlLlxuXG5cdFx0Zm9yIChpbmRleCA9IGJhc2ljID4gMCA/IGJhc2ljICsgMSA6IDA7IGluZGV4IDwgaW5wdXRMZW5ndGg7IC8qIG5vIGZpbmFsIGV4cHJlc3Npb24gKi8pIHtcblxuXHRcdFx0Ly8gYGluZGV4YCBpcyB0aGUgaW5kZXggb2YgdGhlIG5leHQgY2hhcmFjdGVyIHRvIGJlIGNvbnN1bWVkLlxuXHRcdFx0Ly8gRGVjb2RlIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXIgaW50byBgZGVsdGFgLFxuXHRcdFx0Ly8gd2hpY2ggZ2V0cyBhZGRlZCB0byBgaWAuIFRoZSBvdmVyZmxvdyBjaGVja2luZyBpcyBlYXNpZXJcblx0XHRcdC8vIGlmIHdlIGluY3JlYXNlIGBpYCBhcyB3ZSBnbywgdGhlbiBzdWJ0cmFjdCBvZmYgaXRzIHN0YXJ0aW5nXG5cdFx0XHQvLyB2YWx1ZSBhdCB0aGUgZW5kIHRvIG9idGFpbiBgZGVsdGFgLlxuXHRcdFx0Zm9yIChvbGRpID0gaSwgdyA9IDEsIGsgPSBiYXNlOyAvKiBubyBjb25kaXRpb24gKi87IGsgKz0gYmFzZSkge1xuXG5cdFx0XHRcdGlmIChpbmRleCA+PSBpbnB1dExlbmd0aCkge1xuXHRcdFx0XHRcdGVycm9yKCdpbnZhbGlkLWlucHV0Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkaWdpdCA9IGJhc2ljVG9EaWdpdChpbnB1dC5jaGFyQ29kZUF0KGluZGV4KyspKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPj0gYmFzZSB8fCBkaWdpdCA+IGZsb29yKChtYXhJbnQgLSBpKSAvIHcpKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpICs9IGRpZ2l0ICogdztcblx0XHRcdFx0dCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0IDwgdCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRpZiAodyA+IGZsb29yKG1heEludCAvIGJhc2VNaW51c1QpKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR3ICo9IGJhc2VNaW51c1Q7XG5cblx0XHRcdH1cblxuXHRcdFx0b3V0ID0gb3V0cHV0Lmxlbmd0aCArIDE7XG5cdFx0XHRiaWFzID0gYWRhcHQoaSAtIG9sZGksIG91dCwgb2xkaSA9PSAwKTtcblxuXHRcdFx0Ly8gYGlgIHdhcyBzdXBwb3NlZCB0byB3cmFwIGFyb3VuZCBmcm9tIGBvdXRgIHRvIGAwYCxcblx0XHRcdC8vIGluY3JlbWVudGluZyBgbmAgZWFjaCB0aW1lLCBzbyB3ZSdsbCBmaXggdGhhdCBub3c6XG5cdFx0XHRpZiAoZmxvb3IoaSAvIG91dCkgPiBtYXhJbnQgLSBuKSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXG5cdFx0XHRuICs9IGZsb29yKGkgLyBvdXQpO1xuXHRcdFx0aSAlPSBvdXQ7XG5cblx0XHRcdC8vIEluc2VydCBgbmAgYXQgcG9zaXRpb24gYGlgIG9mIHRoZSBvdXRwdXRcblx0XHRcdG91dHB1dC5zcGxpY2UoaSsrLCAwLCBuKTtcblxuXHRcdH1cblxuXHRcdHJldHVybiB1Y3MyZW5jb2RlKG91dHB1dCk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzIChlLmcuIGEgZG9tYWluIG5hbWUgbGFiZWwpIHRvIGFcblx0ICogUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZW5jb2RlKGlucHV0KSB7XG5cdFx0dmFyIG4sXG5cdFx0ICAgIGRlbHRhLFxuXHRcdCAgICBoYW5kbGVkQ1BDb3VudCxcblx0XHQgICAgYmFzaWNMZW5ndGgsXG5cdFx0ICAgIGJpYXMsXG5cdFx0ICAgIGosXG5cdFx0ICAgIG0sXG5cdFx0ICAgIHEsXG5cdFx0ICAgIGssXG5cdFx0ICAgIHQsXG5cdFx0ICAgIGN1cnJlbnRWYWx1ZSxcblx0XHQgICAgb3V0cHV0ID0gW10sXG5cdFx0ICAgIC8qKiBgaW5wdXRMZW5ndGhgIHdpbGwgaG9sZCB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIGluIGBpbnB1dGAuICovXG5cdFx0ICAgIGlucHV0TGVuZ3RoLFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgaGFuZGxlZENQQ291bnRQbHVzT25lLFxuXHRcdCAgICBiYXNlTWludXNULFxuXHRcdCAgICBxTWludXNUO1xuXG5cdFx0Ly8gQ29udmVydCB0aGUgaW5wdXQgaW4gVUNTLTIgdG8gVW5pY29kZVxuXHRcdGlucHV0ID0gdWNzMmRlY29kZShpbnB1dCk7XG5cblx0XHQvLyBDYWNoZSB0aGUgbGVuZ3RoXG5cdFx0aW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cblx0XHQvLyBJbml0aWFsaXplIHRoZSBzdGF0ZVxuXHRcdG4gPSBpbml0aWFsTjtcblx0XHRkZWx0YSA9IDA7XG5cdFx0YmlhcyA9IGluaXRpYWxCaWFzO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50c1xuXHRcdGZvciAoaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPCAweDgwKSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShjdXJyZW50VmFsdWUpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRoYW5kbGVkQ1BDb3VudCA9IGJhc2ljTGVuZ3RoID0gb3V0cHV0Lmxlbmd0aDtcblxuXHRcdC8vIGBoYW5kbGVkQ1BDb3VudGAgaXMgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyB0aGF0IGhhdmUgYmVlbiBoYW5kbGVkO1xuXHRcdC8vIGBiYXNpY0xlbmd0aGAgaXMgdGhlIG51bWJlciBvZiBiYXNpYyBjb2RlIHBvaW50cy5cblxuXHRcdC8vIEZpbmlzaCB0aGUgYmFzaWMgc3RyaW5nIC0gaWYgaXQgaXMgbm90IGVtcHR5IC0gd2l0aCBhIGRlbGltaXRlclxuXHRcdGlmIChiYXNpY0xlbmd0aCkge1xuXHRcdFx0b3V0cHV0LnB1c2goZGVsaW1pdGVyKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGVuY29kaW5nIGxvb3A6XG5cdFx0d2hpbGUgKGhhbmRsZWRDUENvdW50IDwgaW5wdXRMZW5ndGgpIHtcblxuXHRcdFx0Ly8gQWxsIG5vbi1iYXNpYyBjb2RlIHBvaW50cyA8IG4gaGF2ZSBiZWVuIGhhbmRsZWQgYWxyZWFkeS4gRmluZCB0aGUgbmV4dFxuXHRcdFx0Ly8gbGFyZ2VyIG9uZTpcblx0XHRcdGZvciAobSA9IG1heEludCwgaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID49IG4gJiYgY3VycmVudFZhbHVlIDwgbSkge1xuXHRcdFx0XHRcdG0gPSBjdXJyZW50VmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSW5jcmVhc2UgYGRlbHRhYCBlbm91Z2ggdG8gYWR2YW5jZSB0aGUgZGVjb2RlcidzIDxuLGk+IHN0YXRlIHRvIDxtLDA+LFxuXHRcdFx0Ly8gYnV0IGd1YXJkIGFnYWluc3Qgb3ZlcmZsb3dcblx0XHRcdGhhbmRsZWRDUENvdW50UGx1c09uZSA9IGhhbmRsZWRDUENvdW50ICsgMTtcblx0XHRcdGlmIChtIC0gbiA+IGZsb29yKChtYXhJbnQgLSBkZWx0YSkgLyBoYW5kbGVkQ1BDb3VudFBsdXNPbmUpKSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXG5cdFx0XHRkZWx0YSArPSAobSAtIG4pICogaGFuZGxlZENQQ291bnRQbHVzT25lO1xuXHRcdFx0biA9IG07XG5cblx0XHRcdGZvciAoaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPCBuICYmICsrZGVsdGEgPiBtYXhJbnQpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT0gbikge1xuXHRcdFx0XHRcdC8vIFJlcHJlc2VudCBkZWx0YSBhcyBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyXG5cdFx0XHRcdFx0Zm9yIChxID0gZGVsdGEsIGsgPSBiYXNlOyAvKiBubyBjb25kaXRpb24gKi87IGsgKz0gYmFzZSkge1xuXHRcdFx0XHRcdFx0dCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cdFx0XHRcdFx0XHRpZiAocSA8IHQpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRxTWludXNUID0gcSAtIHQ7XG5cdFx0XHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdFx0XHRvdXRwdXQucHVzaChcblx0XHRcdFx0XHRcdFx0c3RyaW5nRnJvbUNoYXJDb2RlKGRpZ2l0VG9CYXNpYyh0ICsgcU1pbnVzVCAlIGJhc2VNaW51c1QsIDApKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHEgPSBmbG9vcihxTWludXNUIC8gYmFzZU1pbnVzVCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGRpZ2l0VG9CYXNpYyhxLCAwKSkpO1xuXHRcdFx0XHRcdGJpYXMgPSBhZGFwdChkZWx0YSwgaGFuZGxlZENQQ291bnRQbHVzT25lLCBoYW5kbGVkQ1BDb3VudCA9PSBiYXNpY0xlbmd0aCk7XG5cdFx0XHRcdFx0ZGVsdGEgPSAwO1xuXHRcdFx0XHRcdCsraGFuZGxlZENQQ291bnQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0KytkZWx0YTtcblx0XHRcdCsrbjtcblxuXHRcdH1cblx0XHRyZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIGRvbWFpbiBuYW1lIG9yIGFuIGVtYWlsIGFkZHJlc3Ncblx0ICogdG8gVW5pY29kZS4gT25seSB0aGUgUHVueWNvZGVkIHBhcnRzIG9mIHRoZSBpbnB1dCB3aWxsIGJlIGNvbnZlcnRlZCwgaS5lLlxuXHQgKiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCBvbiBhIHN0cmluZyB0aGF0IGhhcyBhbHJlYWR5IGJlZW5cblx0ICogY29udmVydGVkIHRvIFVuaWNvZGUuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlZCBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvXG5cdCAqIGNvbnZlcnQgdG8gVW5pY29kZS5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFVuaWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIFB1bnljb2RlXG5cdCAqIHN0cmluZy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvVW5pY29kZShpbnB1dCkge1xuXHRcdHJldHVybiBtYXBEb21haW4oaW5wdXQsIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4UHVueWNvZGUudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gZGVjb2RlKHN0cmluZy5zbGljZSg0KS50b0xvd2VyQ2FzZSgpKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFVuaWNvZGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIGRvbWFpbiBuYW1lIG9yIGFuIGVtYWlsIGFkZHJlc3MgdG9cblx0ICogUHVueWNvZGUuIE9ubHkgdGhlIG5vbi1BU0NJSSBwYXJ0cyBvZiB0aGUgZG9tYWluIG5hbWUgd2lsbCBiZSBjb252ZXJ0ZWQsXG5cdCAqIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0J3MgYWxyZWFkeSBpblxuXHQgKiBBU0NJSS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0byBjb252ZXJ0LCBhcyBhXG5cdCAqIFVuaWNvZGUgc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgUHVueWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIGRvbWFpbiBuYW1lIG9yXG5cdCAqIGVtYWlsIGFkZHJlc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b0FTQ0lJKGlucHV0KSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhOb25BU0NJSS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyAneG4tLScgKyBlbmNvZGUoc3RyaW5nKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8qKiBEZWZpbmUgdGhlIHB1YmxpYyBBUEkgKi9cblx0cHVueWNvZGUgPSB7XG5cdFx0LyoqXG5cdFx0ICogQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IFB1bnljb2RlLmpzIHZlcnNpb24gbnVtYmVyLlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIFN0cmluZ1xuXHRcdCAqL1xuXHRcdCd2ZXJzaW9uJzogJzEuMy4yJyxcblx0XHQvKipcblx0XHQgKiBBbiBvYmplY3Qgb2YgbWV0aG9kcyB0byBjb252ZXJ0IGZyb20gSmF2YVNjcmlwdCdzIGludGVybmFsIGNoYXJhY3RlclxuXHRcdCAqIHJlcHJlc2VudGF0aW9uIChVQ1MtMikgdG8gVW5pY29kZSBjb2RlIHBvaW50cywgYW5kIGJhY2suXG5cdFx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgT2JqZWN0XG5cdFx0ICovXG5cdFx0J3VjczInOiB7XG5cdFx0XHQnZGVjb2RlJzogdWNzMmRlY29kZSxcblx0XHRcdCdlbmNvZGUnOiB1Y3MyZW5jb2RlXG5cdFx0fSxcblx0XHQnZGVjb2RlJzogZGVjb2RlLFxuXHRcdCdlbmNvZGUnOiBlbmNvZGUsXG5cdFx0J3RvQVNDSUknOiB0b0FTQ0lJLFxuXHRcdCd0b1VuaWNvZGUnOiB0b1VuaWNvZGVcblx0fTtcblxuXHQvKiogRXhwb3NlIGBwdW55Y29kZWAgKi9cblx0Ly8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3Igc3BlY2lmaWMgY29uZGl0aW9uIHBhdHRlcm5zXG5cdC8vIGxpa2UgdGhlIGZvbGxvd2luZzpcblx0aWYgKFxuXHRcdHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmXG5cdFx0ZGVmaW5lLmFtZFxuXHQpIHtcblx0XHRkZWZpbmUoJ3B1bnljb2RlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gcHVueWNvZGU7XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSkge1xuXHRcdGlmIChtb2R1bGUuZXhwb3J0cyA9PSBmcmVlRXhwb3J0cykgeyAvLyBpbiBOb2RlLmpzIG9yIFJpbmdvSlMgdjAuOC4wK1xuXHRcdFx0ZnJlZU1vZHVsZS5leHBvcnRzID0gcHVueWNvZGU7XG5cdFx0fSBlbHNlIHsgLy8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cblx0XHRcdGZvciAoa2V5IGluIHB1bnljb2RlKSB7XG5cdFx0XHRcdHB1bnljb2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgKGZyZWVFeHBvcnRzW2tleV0gPSBwdW55Y29kZVtrZXldKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7IC8vIGluIFJoaW5vIG9yIGEgd2ViIGJyb3dzZXJcblx0XHRyb290LnB1bnljb2RlID0gcHVueWNvZGU7XG5cdH1cblxufSh0aGlzKSk7XG4iLCIvKlxuICogcXVhbnRpemUuanMgQ29weXJpZ2h0IDIwMDggTmljayBSYWJpbm93aXR6XG4gKiBQb3J0ZWQgdG8gbm9kZS5qcyBieSBPbGl2aWVyIExlc25pY2tpXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2U6IGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cblxuLy8gZmlsbCBvdXQgYSBjb3VwbGUgcHJvdG92aXMgZGVwZW5kZW5jaWVzXG4vKlxuICogQmxvY2sgYmVsb3cgY29waWVkIGZyb20gUHJvdG92aXM6IGh0dHA6Ly9tYm9zdG9jay5naXRodWIuY29tL3Byb3RvdmlzL1xuICogQ29weXJpZ2h0IDIwMTAgU3RhbmZvcmQgVmlzdWFsaXphdGlvbiBHcm91cFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEJTRCBMaWNlbnNlOiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL2JzZC1saWNlbnNlLnBocFxuICovXG5pZiAoIXB2KSB7XG4gICAgdmFyIHB2ID0ge1xuICAgICAgICBtYXA6IGZ1bmN0aW9uKGFycmF5LCBmKSB7XG4gICAgICAgICAgICB2YXIgbyA9IHt9O1xuICAgICAgICAgICAgcmV0dXJuIGYgPyBhcnJheS5tYXAoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgICAgICAgIG8uaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmLmNhbGwobywgZCk7XG4gICAgICAgICAgICB9KSA6IGFycmF5LnNsaWNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hdHVyYWxPcmRlcjogZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIChhIDwgYikgPyAtMSA6ICgoYSA+IGIpID8gMSA6IDApO1xuICAgICAgICB9LFxuICAgICAgICBzdW06IGZ1bmN0aW9uKGFycmF5LCBmKSB7XG4gICAgICAgICAgICB2YXIgbyA9IHt9O1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5LnJlZHVjZShmID8gZnVuY3Rpb24ocCwgZCwgaSkge1xuICAgICAgICAgICAgICAgIG8uaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwICsgZi5jYWxsKG8sIGQpO1xuICAgICAgICAgICAgfSA6IGZ1bmN0aW9uKHAsIGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcCArIGQ7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWF4OiBmdW5jdGlvbihhcnJheSwgZikge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIGYgPyBwdi5tYXAoYXJyYXksIGYpIDogYXJyYXkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEJhc2ljIEphdmFzY3JpcHQgcG9ydCBvZiB0aGUgTU1DUSAobW9kaWZpZWQgbWVkaWFuIGN1dCBxdWFudGl6YXRpb24pXG4gKiBhbGdvcml0aG0gZnJvbSB0aGUgTGVwdG9uaWNhIGxpYnJhcnkgKGh0dHA6Ly93d3cubGVwdG9uaWNhLmNvbS8pLlxuICogUmV0dXJucyBhIGNvbG9yIG1hcCB5b3UgY2FuIHVzZSB0byBtYXAgb3JpZ2luYWwgcGl4ZWxzIHRvIHRoZSByZWR1Y2VkXG4gKiBwYWxldHRlLiBTdGlsbCBhIHdvcmsgaW4gcHJvZ3Jlc3MuXG4gKiBcbiAqIEBhdXRob3IgTmljayBSYWJpbm93aXR6XG4gKiBAZXhhbXBsZVxuIFxuLy8gYXJyYXkgb2YgcGl4ZWxzIGFzIFtSLEcsQl0gYXJyYXlzXG52YXIgbXlQaXhlbHMgPSBbWzE5MCwxOTcsMTkwXSwgWzIwMiwyMDQsMjAwXSwgWzIwNywyMTQsMjEwXSwgWzIxMSwyMTQsMjExXSwgWzIwNSwyMDcsMjA3XVxuICAgICAgICAgICAgICAgIC8vIGV0Y1xuICAgICAgICAgICAgICAgIF07XG52YXIgbWF4Q29sb3JzID0gNDtcbiBcbnZhciBjbWFwID0gTU1DUS5xdWFudGl6ZShteVBpeGVscywgbWF4Q29sb3JzKTtcbnZhciBuZXdQYWxldHRlID0gY21hcC5wYWxldHRlKCk7XG52YXIgbmV3UGl4ZWxzID0gbXlQaXhlbHMubWFwKGZ1bmN0aW9uKHApIHsgXG4gICAgcmV0dXJuIGNtYXAubWFwKHApOyBcbn0pO1xuIFxuICovXG52YXIgTU1DUSA9IChmdW5jdGlvbigpIHtcbiAgICAvLyBwcml2YXRlIGNvbnN0YW50c1xuICAgIHZhciBzaWdiaXRzID0gNSxcbiAgICAgICAgcnNoaWZ0ID0gOCAtIHNpZ2JpdHMsXG4gICAgICAgIG1heEl0ZXJhdGlvbnMgPSAxMDAwLFxuICAgICAgICBmcmFjdEJ5UG9wdWxhdGlvbnMgPSAwLjc1O1xuXG4gICAgLy8gZ2V0IHJlZHVjZWQtc3BhY2UgY29sb3IgaW5kZXggZm9yIGEgcGl4ZWxcblxuICAgIGZ1bmN0aW9uIGdldENvbG9ySW5kZXgociwgZywgYikge1xuICAgICAgICByZXR1cm4gKHIgPDwgKDIgKiBzaWdiaXRzKSkgKyAoZyA8PCBzaWdiaXRzKSArIGI7XG4gICAgfVxuXG4gICAgLy8gU2ltcGxlIHByaW9yaXR5IHF1ZXVlXG5cbiAgICBmdW5jdGlvbiBQUXVldWUoY29tcGFyYXRvcikge1xuICAgICAgICB2YXIgY29udGVudHMgPSBbXSxcbiAgICAgICAgICAgIHNvcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNvcnQoKSB7XG4gICAgICAgICAgICBjb250ZW50cy5zb3J0KGNvbXBhcmF0b3IpO1xuICAgICAgICAgICAgc29ydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgICAgY29udGVudHMucHVzaChvKTtcbiAgICAgICAgICAgICAgICBzb3J0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwZWVrOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmICghc29ydGVkKSBzb3J0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQpIGluZGV4ID0gY29udGVudHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudHNbaW5kZXhdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzb3J0ZWQpIHNvcnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudHMucG9wKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXA6IGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudHMubWFwKGYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlYnVnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNvcnRlZCkgc29ydCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyAzZCBjb2xvciBzcGFjZSBib3hcblxuICAgIGZ1bmN0aW9uIFZCb3gocjEsIHIyLCBnMSwgZzIsIGIxLCBiMiwgaGlzdG8pIHtcbiAgICAgICAgdmFyIHZib3ggPSB0aGlzO1xuICAgICAgICB2Ym94LnIxID0gcjE7XG4gICAgICAgIHZib3gucjIgPSByMjtcbiAgICAgICAgdmJveC5nMSA9IGcxO1xuICAgICAgICB2Ym94LmcyID0gZzI7XG4gICAgICAgIHZib3guYjEgPSBiMTtcbiAgICAgICAgdmJveC5iMiA9IGIyO1xuICAgICAgICB2Ym94Lmhpc3RvID0gaGlzdG87XG4gICAgfVxuICAgIFZCb3gucHJvdG90eXBlID0ge1xuICAgICAgICB2b2x1bWU6IGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgICAgICAgICB2YXIgdmJveCA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoIXZib3guX3ZvbHVtZSB8fCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIHZib3guX3ZvbHVtZSA9ICgodmJveC5yMiAtIHZib3gucjEgKyAxKSAqICh2Ym94LmcyIC0gdmJveC5nMSArIDEpICogKHZib3guYjIgLSB2Ym94LmIxICsgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZib3guX3ZvbHVtZTtcbiAgICAgICAgfSxcbiAgICAgICAgY291bnQ6IGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgICAgICAgICB2YXIgdmJveCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaGlzdG8gPSB2Ym94Lmhpc3RvO1xuICAgICAgICAgICAgaWYgKCF2Ym94Ll9jb3VudF9zZXQgfHwgZm9yY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgbnBpeCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGksIGosIGs7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gdmJveC5yMTsgaSA8PSB2Ym94LnIyOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gdmJveC5nMTsgaiA8PSB2Ym94LmcyOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoayA9IHZib3guYjE7IGsgPD0gdmJveC5iMjsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBnZXRDb2xvckluZGV4KGksIGosIGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5waXggKz0gKGhpc3RvW2luZGV4XSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2Ym94Ll9jb3VudCA9IG5waXg7XG4gICAgICAgICAgICAgICAgdmJveC5fY291bnRfc2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2Ym94Ll9jb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgY29weTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdmJveCA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZCb3godmJveC5yMSwgdmJveC5yMiwgdmJveC5nMSwgdmJveC5nMiwgdmJveC5iMSwgdmJveC5iMiwgdmJveC5oaXN0byk7XG4gICAgICAgIH0sXG4gICAgICAgIGF2ZzogZnVuY3Rpb24oZm9yY2UpIHtcbiAgICAgICAgICAgIHZhciB2Ym94ID0gdGhpcyxcbiAgICAgICAgICAgICAgICBoaXN0byA9IHZib3guaGlzdG87XG4gICAgICAgICAgICBpZiAoIXZib3guX2F2ZyB8fCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIHZhciBudG90ID0gMCxcbiAgICAgICAgICAgICAgICAgICAgbXVsdCA9IDEgPDwgKDggLSBzaWdiaXRzKSxcbiAgICAgICAgICAgICAgICAgICAgcnN1bSA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGdzdW0gPSAwLFxuICAgICAgICAgICAgICAgICAgICBic3VtID0gMCxcbiAgICAgICAgICAgICAgICAgICAgaHZhbCxcbiAgICAgICAgICAgICAgICAgICAgaSwgaiwgaywgaGlzdG9pbmRleDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSB2Ym94LnIxOyBpIDw9IHZib3gucjI7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSB2Ym94LmcxOyBqIDw9IHZib3guZzI7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gdmJveC5iMTsgayA8PSB2Ym94LmIyOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaXN0b2luZGV4ID0gZ2V0Q29sb3JJbmRleChpLCBqLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodmFsID0gaGlzdG9baGlzdG9pbmRleF0gfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudG90ICs9IGh2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnN1bSArPSAoaHZhbCAqIChpICsgMC41KSAqIG11bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdzdW0gKz0gKGh2YWwgKiAoaiArIDAuNSkgKiBtdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBic3VtICs9IChodmFsICogKGsgKyAwLjUpICogbXVsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG50b3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmJveC5fYXZnID0gW35+KHJzdW0gLyBudG90KSwgfn4gKGdzdW0gLyBudG90KSwgfn4gKGJzdW0gLyBudG90KV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZW1wdHkgYm94Jyk7XG4gICAgICAgICAgICAgICAgICAgIHZib3guX2F2ZyA9IFt+fihtdWx0ICogKHZib3gucjEgKyB2Ym94LnIyICsgMSkgLyAyKSwgfn4gKG11bHQgKiAodmJveC5nMSArIHZib3guZzIgKyAxKSAvIDIpLCB+fiAobXVsdCAqICh2Ym94LmIxICsgdmJveC5iMiArIDEpIC8gMildO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2Ym94Ll9hdmc7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbihwaXhlbCkge1xuICAgICAgICAgICAgdmFyIHZib3ggPSB0aGlzLFxuICAgICAgICAgICAgICAgIHJ2YWwgPSBwaXhlbFswXSA+PiByc2hpZnQ7XG4gICAgICAgICAgICBndmFsID0gcGl4ZWxbMV0gPj4gcnNoaWZ0O1xuICAgICAgICAgICAgYnZhbCA9IHBpeGVsWzJdID4+IHJzaGlmdDtcbiAgICAgICAgICAgIHJldHVybiAocnZhbCA+PSB2Ym94LnIxICYmIHJ2YWwgPD0gdmJveC5yMiAmJlxuICAgICAgICAgICAgICAgIGd2YWwgPj0gdmJveC5nMSAmJiBndmFsIDw9IHZib3guZzIgJiZcbiAgICAgICAgICAgICAgICBidmFsID49IHZib3guYjEgJiYgYnZhbCA8PSB2Ym94LmIyKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDb2xvciBtYXBcblxuICAgIGZ1bmN0aW9uIENNYXAoKSB7XG4gICAgICAgIHRoaXMudmJveGVzID0gbmV3IFBRdWV1ZShmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gcHYubmF0dXJhbE9yZGVyKFxuICAgICAgICAgICAgICAgIGEudmJveC5jb3VudCgpICogYS52Ym94LnZvbHVtZSgpLFxuICAgICAgICAgICAgICAgIGIudmJveC5jb3VudCgpICogYi52Ym94LnZvbHVtZSgpXG4gICAgICAgICAgICApXG4gICAgICAgIH0pOztcbiAgICB9XG4gICAgQ01hcC5wcm90b3R5cGUgPSB7XG4gICAgICAgIHB1c2g6IGZ1bmN0aW9uKHZib3gpIHtcbiAgICAgICAgICAgIHRoaXMudmJveGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIHZib3g6IHZib3gsXG4gICAgICAgICAgICAgICAgY29sb3I6IHZib3guYXZnKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBwYWxldHRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZib3hlcy5tYXAoZnVuY3Rpb24odmIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmIuY29sb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZib3hlcy5zaXplKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1hcDogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHZhciB2Ym94ZXMgPSB0aGlzLnZib3hlcztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmJveGVzLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZib3hlcy5wZWVrKGkpLnZib3guY29udGFpbnMoY29sb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2Ym94ZXMucGVlayhpKS5jb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZWFyZXN0KGNvbG9yKTtcbiAgICAgICAgfSxcbiAgICAgICAgbmVhcmVzdDogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHZhciB2Ym94ZXMgPSB0aGlzLnZib3hlcyxcbiAgICAgICAgICAgICAgICBkMSwgZDIsIHBDb2xvcjtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmJveGVzLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZDIgPSBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KGNvbG9yWzBdIC0gdmJveGVzLnBlZWsoaSkuY29sb3JbMF0sIDIpICtcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coY29sb3JbMV0gLSB2Ym94ZXMucGVlayhpKS5jb2xvclsxXSwgMikgK1xuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhjb2xvclsyXSAtIHZib3hlcy5wZWVrKGkpLmNvbG9yWzJdLCAyKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKGQyIDwgZDEgfHwgZDEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBkMSA9IGQyO1xuICAgICAgICAgICAgICAgICAgICBwQ29sb3IgPSB2Ym94ZXMucGVlayhpKS5jb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcENvbG9yO1xuICAgICAgICB9LFxuICAgICAgICBmb3JjZWJ3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFhYWDogd29uJ3QgIHdvcmsgeWV0XG4gICAgICAgICAgICB2YXIgdmJveGVzID0gdGhpcy52Ym94ZXM7XG4gICAgICAgICAgICB2Ym94ZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHB2Lm5hdHVyYWxPcmRlcihwdi5zdW0oYS5jb2xvciksIHB2LnN1bShiLmNvbG9yKSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBmb3JjZSBkYXJrZXN0IGNvbG9yIHRvIGJsYWNrIGlmIGV2ZXJ5dGhpbmcgPCA1XG4gICAgICAgICAgICB2YXIgbG93ZXN0ID0gdmJveGVzWzBdLmNvbG9yO1xuICAgICAgICAgICAgaWYgKGxvd2VzdFswXSA8IDUgJiYgbG93ZXN0WzFdIDwgNSAmJiBsb3dlc3RbMl0gPCA1KVxuICAgICAgICAgICAgICAgIHZib3hlc1swXS5jb2xvciA9IFswLCAwLCAwXTtcblxuICAgICAgICAgICAgLy8gZm9yY2UgbGlnaHRlc3QgY29sb3IgdG8gd2hpdGUgaWYgZXZlcnl0aGluZyA+IDI1MVxuICAgICAgICAgICAgdmFyIGlkeCA9IHZib3hlcy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgICAgIGhpZ2hlc3QgPSB2Ym94ZXNbaWR4XS5jb2xvcjtcbiAgICAgICAgICAgIGlmIChoaWdoZXN0WzBdID4gMjUxICYmIGhpZ2hlc3RbMV0gPiAyNTEgJiYgaGlnaGVzdFsyXSA+IDI1MSlcbiAgICAgICAgICAgICAgICB2Ym94ZXNbaWR4XS5jb2xvciA9IFsyNTUsIDI1NSwgMjU1XTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBoaXN0byAoMS1kIGFycmF5LCBnaXZpbmcgdGhlIG51bWJlciBvZiBwaXhlbHMgaW5cbiAgICAvLyBlYWNoIHF1YW50aXplZCByZWdpb24gb2YgY29sb3Igc3BhY2UpLCBvciBudWxsIG9uIGVycm9yXG5cbiAgICBmdW5jdGlvbiBnZXRIaXN0byhwaXhlbHMpIHtcbiAgICAgICAgdmFyIGhpc3Rvc2l6ZSA9IDEgPDwgKDMgKiBzaWdiaXRzKSxcbiAgICAgICAgICAgIGhpc3RvID0gbmV3IEFycmF5KGhpc3Rvc2l6ZSksXG4gICAgICAgICAgICBpbmRleCwgcnZhbCwgZ3ZhbCwgYnZhbDtcbiAgICAgICAgcGl4ZWxzLmZvckVhY2goZnVuY3Rpb24ocGl4ZWwpIHtcbiAgICAgICAgICAgIHJ2YWwgPSBwaXhlbFswXSA+PiByc2hpZnQ7XG4gICAgICAgICAgICBndmFsID0gcGl4ZWxbMV0gPj4gcnNoaWZ0O1xuICAgICAgICAgICAgYnZhbCA9IHBpeGVsWzJdID4+IHJzaGlmdDtcbiAgICAgICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChydmFsLCBndmFsLCBidmFsKTtcbiAgICAgICAgICAgIGhpc3RvW2luZGV4XSA9IChoaXN0b1tpbmRleF0gfHwgMCkgKyAxO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGhpc3RvO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZib3hGcm9tUGl4ZWxzKHBpeGVscywgaGlzdG8pIHtcbiAgICAgICAgdmFyIHJtaW4gPSAxMDAwMDAwLFxuICAgICAgICAgICAgcm1heCA9IDAsXG4gICAgICAgICAgICBnbWluID0gMTAwMDAwMCxcbiAgICAgICAgICAgIGdtYXggPSAwLFxuICAgICAgICAgICAgYm1pbiA9IDEwMDAwMDAsXG4gICAgICAgICAgICBibWF4ID0gMCxcbiAgICAgICAgICAgIHJ2YWwsIGd2YWwsIGJ2YWw7XG4gICAgICAgIC8vIGZpbmQgbWluL21heFxuICAgICAgICBwaXhlbHMuZm9yRWFjaChmdW5jdGlvbihwaXhlbCkge1xuICAgICAgICAgICAgcnZhbCA9IHBpeGVsWzBdID4+IHJzaGlmdDtcbiAgICAgICAgICAgIGd2YWwgPSBwaXhlbFsxXSA+PiByc2hpZnQ7XG4gICAgICAgICAgICBidmFsID0gcGl4ZWxbMl0gPj4gcnNoaWZ0O1xuICAgICAgICAgICAgaWYgKHJ2YWwgPCBybWluKSBybWluID0gcnZhbDtcbiAgICAgICAgICAgIGVsc2UgaWYgKHJ2YWwgPiBybWF4KSBybWF4ID0gcnZhbDtcbiAgICAgICAgICAgIGlmIChndmFsIDwgZ21pbikgZ21pbiA9IGd2YWw7XG4gICAgICAgICAgICBlbHNlIGlmIChndmFsID4gZ21heCkgZ21heCA9IGd2YWw7XG4gICAgICAgICAgICBpZiAoYnZhbCA8IGJtaW4pIGJtaW4gPSBidmFsO1xuICAgICAgICAgICAgZWxzZSBpZiAoYnZhbCA+IGJtYXgpIGJtYXggPSBidmFsO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBWQm94KHJtaW4sIHJtYXgsIGdtaW4sIGdtYXgsIGJtaW4sIGJtYXgsIGhpc3RvKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZWRpYW5DdXRBcHBseShoaXN0bywgdmJveCkge1xuICAgICAgICBpZiAoIXZib3guY291bnQoKSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBydyA9IHZib3gucjIgLSB2Ym94LnIxICsgMSxcbiAgICAgICAgICAgIGd3ID0gdmJveC5nMiAtIHZib3guZzEgKyAxLFxuICAgICAgICAgICAgYncgPSB2Ym94LmIyIC0gdmJveC5iMSArIDEsXG4gICAgICAgICAgICBtYXh3ID0gcHYubWF4KFtydywgZ3csIGJ3XSk7XG4gICAgICAgIC8vIG9ubHkgb25lIHBpeGVsLCBubyBzcGxpdFxuICAgICAgICBpZiAodmJveC5jb3VudCgpID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBbdmJveC5jb3B5KCldXG4gICAgICAgIH1cbiAgICAgICAgLyogRmluZCB0aGUgcGFydGlhbCBzdW0gYXJyYXlzIGFsb25nIHRoZSBzZWxlY3RlZCBheGlzLiAqL1xuICAgICAgICB2YXIgdG90YWwgPSAwLFxuICAgICAgICAgICAgcGFydGlhbHN1bSA9IFtdLFxuICAgICAgICAgICAgbG9va2FoZWFkc3VtID0gW10sXG4gICAgICAgICAgICBpLCBqLCBrLCBzdW0sIGluZGV4O1xuICAgICAgICBpZiAobWF4dyA9PSBydykge1xuICAgICAgICAgICAgZm9yIChpID0gdmJveC5yMTsgaSA8PSB2Ym94LnIyOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzdW0gPSAwO1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IHZib3guZzE7IGogPD0gdmJveC5nMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IHZib3guYjE7IGsgPD0gdmJveC5iMjsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgoaSwgaiwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdW0gKz0gKGhpc3RvW2luZGV4XSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0b3RhbCArPSBzdW07XG4gICAgICAgICAgICAgICAgcGFydGlhbHN1bVtpXSA9IHRvdGFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1heHcgPT0gZ3cpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IHZib3guZzE7IGkgPD0gdmJveC5nMjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3VtID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKGogPSB2Ym94LnIxOyBqIDw9IHZib3gucjI7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSB2Ym94LmIxOyBrIDw9IHZib3guYjI7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBnZXRDb2xvckluZGV4KGosIGksIGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VtICs9IChoaXN0b1tpbmRleF0gfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdG90YWwgKz0gc3VtO1xuICAgICAgICAgICAgICAgIHBhcnRpYWxzdW1baV0gPSB0b3RhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLyogbWF4dyA9PSBidyAqL1xuICAgICAgICAgICAgZm9yIChpID0gdmJveC5iMTsgaSA8PSB2Ym94LmIyOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzdW0gPSAwO1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IHZib3gucjE7IGogPD0gdmJveC5yMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IHZib3guZzE7IGsgPD0gdmJveC5nMjsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgoaiwgaywgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdW0gKz0gKGhpc3RvW2luZGV4XSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0b3RhbCArPSBzdW07XG4gICAgICAgICAgICAgICAgcGFydGlhbHN1bVtpXSA9IHRvdGFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhcnRpYWxzdW0uZm9yRWFjaChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgICBsb29rYWhlYWRzdW1baV0gPSB0b3RhbCAtIGRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gZG9DdXQoY29sb3IpIHtcbiAgICAgICAgICAgIHZhciBkaW0xID0gY29sb3IgKyAnMScsXG4gICAgICAgICAgICAgICAgZGltMiA9IGNvbG9yICsgJzInLFxuICAgICAgICAgICAgICAgIGxlZnQsIHJpZ2h0LCB2Ym94MSwgdmJveDIsIGQyLCBjb3VudDIgPSAwO1xuICAgICAgICAgICAgZm9yIChpID0gdmJveFtkaW0xXTsgaSA8PSB2Ym94W2RpbTJdOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydGlhbHN1bVtpXSA+IHRvdGFsIC8gMikge1xuICAgICAgICAgICAgICAgICAgICB2Ym94MSA9IHZib3guY29weSgpO1xuICAgICAgICAgICAgICAgICAgICB2Ym94MiA9IHZib3guY29weSgpO1xuICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gaSAtIHZib3hbZGltMV07XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gdmJveFtkaW0yXSAtIGk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0IDw9IHJpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgZDIgPSBNYXRoLm1pbih2Ym94W2RpbTJdIC0gMSwgfn4gKGkgKyByaWdodCAvIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBkMiA9IE1hdGgubWF4KHZib3hbZGltMV0sIH5+IChpIC0gMSAtIGxlZnQgLyAyKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF2b2lkIDAtY291bnQgYm94ZXNcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCFwYXJ0aWFsc3VtW2QyXSkgZDIrKztcbiAgICAgICAgICAgICAgICAgICAgY291bnQyID0gbG9va2FoZWFkc3VtW2QyXTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCFjb3VudDIgJiYgcGFydGlhbHN1bVtkMiAtIDFdKSBjb3VudDIgPSBsb29rYWhlYWRzdW1bLS1kMl07XG4gICAgICAgICAgICAgICAgICAgIC8vIHNldCBkaW1lbnNpb25zXG4gICAgICAgICAgICAgICAgICAgIHZib3gxW2RpbTJdID0gZDI7XG4gICAgICAgICAgICAgICAgICAgIHZib3gyW2RpbTFdID0gdmJveDFbZGltMl0gKyAxO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmJveCBjb3VudHM6JywgdmJveC5jb3VudCgpLCB2Ym94MS5jb3VudCgpLCB2Ym94Mi5jb3VudCgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt2Ym94MSwgdmJveDJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIC8vIGRldGVybWluZSB0aGUgY3V0IHBsYW5lc1xuICAgICAgICByZXR1cm4gbWF4dyA9PSBydyA/IGRvQ3V0KCdyJykgOlxuICAgICAgICAgICAgbWF4dyA9PSBndyA/IGRvQ3V0KCdnJykgOlxuICAgICAgICAgICAgZG9DdXQoJ2InKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBxdWFudGl6ZShwaXhlbHMsIG1heGNvbG9ycykge1xuICAgICAgICAvLyBzaG9ydC1jaXJjdWl0XG4gICAgICAgIGlmICghcGl4ZWxzLmxlbmd0aCB8fCBtYXhjb2xvcnMgPCAyIHx8IG1heGNvbG9ycyA+IDI1Nikge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3dyb25nIG51bWJlciBvZiBtYXhjb2xvcnMnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFhYWDogY2hlY2sgY29sb3IgY29udGVudCBhbmQgY29udmVydCB0byBncmF5c2NhbGUgaWYgaW5zdWZmaWNpZW50XG5cbiAgICAgICAgdmFyIGhpc3RvID0gZ2V0SGlzdG8ocGl4ZWxzKSxcbiAgICAgICAgICAgIGhpc3Rvc2l6ZSA9IDEgPDwgKDMgKiBzaWdiaXRzKTtcblxuICAgICAgICAvLyBjaGVjayB0aGF0IHdlIGFyZW4ndCBiZWxvdyBtYXhjb2xvcnMgYWxyZWFkeVxuICAgICAgICB2YXIgbkNvbG9ycyA9IDA7XG4gICAgICAgIGhpc3RvLmZvckVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBuQ29sb3JzKytcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChuQ29sb3JzIDw9IG1heGNvbG9ycykge1xuICAgICAgICAgICAgLy8gWFhYOiBnZW5lcmF0ZSB0aGUgbmV3IGNvbG9ycyBmcm9tIHRoZSBoaXN0byBhbmQgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgdGhlIGJlZ2lubmluZyB2Ym94IGZyb20gdGhlIGNvbG9yc1xuICAgICAgICB2YXIgdmJveCA9IHZib3hGcm9tUGl4ZWxzKHBpeGVscywgaGlzdG8pLFxuICAgICAgICAgICAgcHEgPSBuZXcgUFF1ZXVlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHYubmF0dXJhbE9yZGVyKGEuY291bnQoKSwgYi5jb3VudCgpKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIHBxLnB1c2godmJveCk7XG5cbiAgICAgICAgLy8gaW5uZXIgZnVuY3Rpb24gdG8gZG8gdGhlIGl0ZXJhdGlvblxuXG4gICAgICAgIGZ1bmN0aW9uIGl0ZXIobGgsIHRhcmdldCkge1xuICAgICAgICAgICAgdmFyIG5jb2xvcnMgPSAxLFxuICAgICAgICAgICAgICAgIG5pdGVycyA9IDAsXG4gICAgICAgICAgICAgICAgdmJveDtcbiAgICAgICAgICAgIHdoaWxlIChuaXRlcnMgPCBtYXhJdGVyYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgdmJveCA9IGxoLnBvcCgpO1xuICAgICAgICAgICAgICAgIGlmICghdmJveC5jb3VudCgpKSB7IC8qIGp1c3QgcHV0IGl0IGJhY2sgKi9cbiAgICAgICAgICAgICAgICAgICAgbGgucHVzaCh2Ym94KTtcbiAgICAgICAgICAgICAgICAgICAgbml0ZXJzKys7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBkbyB0aGUgY3V0XG4gICAgICAgICAgICAgICAgdmFyIHZib3hlcyA9IG1lZGlhbkN1dEFwcGx5KGhpc3RvLCB2Ym94KSxcbiAgICAgICAgICAgICAgICAgICAgdmJveDEgPSB2Ym94ZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgIHZib3gyID0gdmJveGVzWzFdO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF2Ym94MSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZib3gxIG5vdCBkZWZpbmVkOyBzaG91bGRuJ3QgaGFwcGVuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsaC5wdXNoKHZib3gxKTtcbiAgICAgICAgICAgICAgICBpZiAodmJveDIpIHsgLyogdmJveDIgY2FuIGJlIG51bGwgKi9cbiAgICAgICAgICAgICAgICAgICAgbGgucHVzaCh2Ym94Mik7XG4gICAgICAgICAgICAgICAgICAgIG5jb2xvcnMrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5jb2xvcnMgPj0gdGFyZ2V0KSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKG5pdGVycysrID4gbWF4SXRlcmF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImluZmluaXRlIGxvb3A7IHBlcmhhcHMgdG9vIGZldyBwaXhlbHMhXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmlyc3Qgc2V0IG9mIGNvbG9ycywgc29ydGVkIGJ5IHBvcHVsYXRpb25cbiAgICAgICAgaXRlcihwcSwgZnJhY3RCeVBvcHVsYXRpb25zICogbWF4Y29sb3JzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocHEuc2l6ZSgpLCBwcS5kZWJ1ZygpLmxlbmd0aCwgcHEuZGVidWcoKS5zbGljZSgpKTtcblxuICAgICAgICAvLyBSZS1zb3J0IGJ5IHRoZSBwcm9kdWN0IG9mIHBpeGVsIG9jY3VwYW5jeSB0aW1lcyB0aGUgc2l6ZSBpbiBjb2xvciBzcGFjZS5cbiAgICAgICAgdmFyIHBxMiA9IG5ldyBQUXVldWUoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIHB2Lm5hdHVyYWxPcmRlcihhLmNvdW50KCkgKiBhLnZvbHVtZSgpLCBiLmNvdW50KCkgKiBiLnZvbHVtZSgpKVxuICAgICAgICB9KTtcbiAgICAgICAgd2hpbGUgKHBxLnNpemUoKSkge1xuICAgICAgICAgICAgcHEyLnB1c2gocHEucG9wKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbmV4dCBzZXQgLSBnZW5lcmF0ZSB0aGUgbWVkaWFuIGN1dHMgdXNpbmcgdGhlIChucGl4ICogdm9sKSBzb3J0aW5nLlxuICAgICAgICBpdGVyKHBxMiwgbWF4Y29sb3JzIC0gcHEyLnNpemUoKSk7XG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBhY3R1YWwgY29sb3JzXG4gICAgICAgIHZhciBjbWFwID0gbmV3IENNYXAoKTtcbiAgICAgICAgd2hpbGUgKHBxMi5zaXplKCkpIHtcbiAgICAgICAgICAgIGNtYXAucHVzaChwcTIucG9wKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNtYXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcXVhbnRpemU6IHF1YW50aXplXG4gICAgfVxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNTUNRLnF1YW50aXplXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1hcChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBtYXAob2JqW2tdLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgIH0pLmpvaW4oc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqW2tdKSk7XG4gICAgICB9XG4gICAgfSkuam9pbihzZXApO1xuXG4gIH1cblxuICBpZiAoIW5hbWUpIHJldHVybiAnJztcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUobmFtZSkpICsgZXEgK1xuICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmopKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gIGlmICh4cy5tYXApIHJldHVybiB4cy5tYXAoZik7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy5wdXNoKGYoeHNbaV0sIGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJlcy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuZGVjb2RlID0gZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vZGVjb2RlJyk7XG5leHBvcnRzLmVuY29kZSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9lbmNvZGUnKTtcbiIsIlZpYnJhbnQgPSByZXF1aXJlKCcuL3ZpYnJhbnQnKVxuVmlicmFudC5EZWZhdWx0T3B0cy5JbWFnZSA9IHJlcXVpcmUoJy4vaW1hZ2UvYnJvd3NlcicpXG5cbm1vZHVsZS5leHBvcnRzID0gVmlicmFudFxuIiwid2luZG93LlZpYnJhbnQgPSBWaWJyYW50ID0gcmVxdWlyZSgnLi9icm93c2VyJylcbiIsIm1vZHVsZS5leHBvcnRzID0gKHIsIGcsIGIsIGEpIC0+XHJcbiAgYSA+PSAxMjUgYW5kIG5vdCAociA+IDI1MCBhbmQgZyA+IDI1MCBhbmQgYiA+IDI1MClcclxuIiwibW9kdWxlLmV4cG9ydHMuRGVmYXVsdCA9IHJlcXVpcmUoJy4vZGVmYXVsdCcpXHJcbiIsIlN3YXRjaCA9IHJlcXVpcmUoJy4uL3N3YXRjaCcpXHJcbnV0aWwgPSByZXF1aXJlKCcuLi91dGlsJylcclxuR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9pbmRleCcpXHJcblxyXG5EZWZhdWx0T3B0cyA9XHJcbiAgdGFyZ2V0RGFya0x1bWE6IDAuMjZcclxuICBtYXhEYXJrTHVtYTogMC40NVxyXG4gIG1pbkxpZ2h0THVtYTogMC41NVxyXG4gIHRhcmdldExpZ2h0THVtYTogMC43NFxyXG4gIG1pbk5vcm1hbEx1bWE6IDAuM1xyXG4gIHRhcmdldE5vcm1hbEx1bWE6IDAuNVxyXG4gIG1heE5vcm1hbEx1bWE6IDAuN1xyXG4gIHRhcmdldE11dGVzU2F0dXJhdGlvbjogMC4zXHJcbiAgbWF4TXV0ZXNTYXR1cmF0aW9uOiAwLjRcclxuICB0YXJnZXRWaWJyYW50U2F0dXJhdGlvbjogMS4wXHJcbiAgbWluVmlicmFudFNhdHVyYXRpb246IDAuMzVcclxuICB3ZWlnaHRTYXR1cmF0aW9uOiAzXHJcbiAgd2VpZ2h0THVtYTogNlxyXG4gIHdlaWdodFBvcHVsYXRpb246IDFcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuY2xhc3MgRGVmYXVsdEdlbmVyYXRvciBleHRlbmRzIEdlbmVyYXRvclxyXG4gIEhpZ2hlc3RQb3B1bGF0aW9uOiAwXHJcbiAgY29uc3RydWN0b3I6IChvcHRzKSAtPlxyXG4gICAgQG9wdHMgPSB1dGlsLmRlZmF1bHRzKG9wdHMsIERlZmF1bHRPcHRzKVxyXG4gICAgQFZpYnJhbnRTd2F0Y2ggPSBudWxsXHJcbiAgICBATGlnaHRWaWJyYW50U3dhdGNoID0gbnVsbFxyXG4gICAgQERhcmtWaWJyYW50U3dhdGNoID0gbnVsbFxyXG4gICAgQE11dGVkU3dhdGNoID0gbnVsbFxyXG4gICAgQExpZ2h0TXV0ZWRTd2F0Y2ggPSBudWxsXHJcbiAgICBARGFya011dGVkU3dhdGNoID0gbnVsbFxyXG5cclxuICBnZW5lcmF0ZTogKEBzd2F0Y2hlcykgLT5cclxuICAgIEBtYXhQb3B1bGF0aW9uID0gQGZpbmRNYXhQb3B1bGF0aW9uXHJcblxyXG4gICAgQGdlbmVyYXRlVmFyYXRpb25Db2xvcnMoKVxyXG4gICAgQGdlbmVyYXRlRW1wdHlTd2F0Y2hlcygpXHJcblxyXG4gIGdldFZpYnJhbnRTd2F0Y2g6IC0+XHJcbiAgICBAVmlicmFudFN3YXRjaFxyXG5cclxuICBnZXRMaWdodFZpYnJhbnRTd2F0Y2g6IC0+XHJcbiAgICBATGlnaHRWaWJyYW50U3dhdGNoXHJcblxyXG4gIGdldERhcmtWaWJyYW50U3dhdGNoOiAtPlxyXG4gICAgQERhcmtWaWJyYW50U3dhdGNoXHJcblxyXG4gIGdldE11dGVkU3dhdGNoOiAtPlxyXG4gICAgQE11dGVkU3dhdGNoXHJcblxyXG4gIGdldExpZ2h0TXV0ZWRTd2F0Y2g6IC0+XHJcbiAgICBATGlnaHRNdXRlZFN3YXRjaFxyXG5cclxuICBnZXREYXJrTXV0ZWRTd2F0Y2g6IC0+XHJcbiAgICBARGFya011dGVkU3dhdGNoXHJcblxyXG4gIGdlbmVyYXRlVmFyYXRpb25Db2xvcnM6IC0+XHJcbiAgICBAVmlicmFudFN3YXRjaCA9IEBmaW5kQ29sb3JWYXJpYXRpb24oQG9wdHMudGFyZ2V0Tm9ybWFsTHVtYSwgQG9wdHMubWluTm9ybWFsTHVtYSwgQG9wdHMubWF4Tm9ybWFsTHVtYSxcclxuICAgICAgQG9wdHMudGFyZ2V0VmlicmFudFNhdHVyYXRpb24sIEBvcHRzLm1pblZpYnJhbnRTYXR1cmF0aW9uLCAxKTtcclxuXHJcbiAgICBATGlnaHRWaWJyYW50U3dhdGNoID0gQGZpbmRDb2xvclZhcmlhdGlvbihAb3B0cy50YXJnZXRMaWdodEx1bWEsIEBvcHRzLm1pbkxpZ2h0THVtYSwgMSxcclxuICAgICAgQG9wdHMudGFyZ2V0VmlicmFudFNhdHVyYXRpb24sIEBvcHRzLm1pblZpYnJhbnRTYXR1cmF0aW9uLCAxKTtcclxuXHJcbiAgICBARGFya1ZpYnJhbnRTd2F0Y2ggPSBAZmluZENvbG9yVmFyaWF0aW9uKEBvcHRzLnRhcmdldERhcmtMdW1hLCAwLCBAb3B0cy5tYXhEYXJrTHVtYSxcclxuICAgICAgQG9wdHMudGFyZ2V0VmlicmFudFNhdHVyYXRpb24sIEBvcHRzLm1pblZpYnJhbnRTYXR1cmF0aW9uLCAxKTtcclxuXHJcbiAgICBATXV0ZWRTd2F0Y2ggPSBAZmluZENvbG9yVmFyaWF0aW9uKEBvcHRzLnRhcmdldE5vcm1hbEx1bWEsIEBvcHRzLm1pbk5vcm1hbEx1bWEsIEBvcHRzLm1heE5vcm1hbEx1bWEsXHJcbiAgICAgIEBvcHRzLnRhcmdldE11dGVzU2F0dXJhdGlvbiwgMCwgQG9wdHMubWF4TXV0ZXNTYXR1cmF0aW9uKTtcclxuXHJcbiAgICBATGlnaHRNdXRlZFN3YXRjaCA9IEBmaW5kQ29sb3JWYXJpYXRpb24oQG9wdHMudGFyZ2V0TGlnaHRMdW1hLCBAb3B0cy5taW5MaWdodEx1bWEsIDEsXHJcbiAgICAgIEBvcHRzLnRhcmdldE11dGVzU2F0dXJhdGlvbiwgMCwgQG9wdHMubWF4TXV0ZXNTYXR1cmF0aW9uKTtcclxuXHJcbiAgICBARGFya011dGVkU3dhdGNoID0gQGZpbmRDb2xvclZhcmlhdGlvbihAb3B0cy50YXJnZXREYXJrTHVtYSwgMCwgQG9wdHMubWF4RGFya0x1bWEsXHJcbiAgICAgIEBvcHRzLnRhcmdldE11dGVzU2F0dXJhdGlvbiwgMCwgQG9wdHMubWF4TXV0ZXNTYXR1cmF0aW9uKTtcclxuXHJcbiAgZ2VuZXJhdGVFbXB0eVN3YXRjaGVzOiAtPlxyXG4gICAgaWYgQFZpYnJhbnRTd2F0Y2ggaXMgbnVsbFxyXG4gICAgICAjIElmIHdlIGRvIG5vdCBoYXZlIGEgdmlicmFudCBjb2xvci4uLlxyXG4gICAgICBpZiBARGFya1ZpYnJhbnRTd2F0Y2ggaXNudCBudWxsXHJcbiAgICAgICAgIyAuLi5idXQgd2UgZG8gaGF2ZSBhIGRhcmsgdmlicmFudCwgZ2VuZXJhdGUgdGhlIHZhbHVlIGJ5IG1vZGlmeWluZyB0aGUgbHVtYVxyXG4gICAgICAgIGhzbCA9IEBEYXJrVmlicmFudFN3YXRjaC5nZXRIc2woKVxyXG4gICAgICAgIGhzbFsyXSA9IEBvcHRzLnRhcmdldE5vcm1hbEx1bWFcclxuICAgICAgICBAVmlicmFudFN3YXRjaCA9IG5ldyBTd2F0Y2ggdXRpbC5oc2xUb1JnYihoc2xbMF0sIGhzbFsxXSwgaHNsWzJdKSwgMFxyXG5cclxuICAgIGlmIEBEYXJrVmlicmFudFN3YXRjaCBpcyBudWxsXHJcbiAgICAgICMgSWYgd2UgZG8gbm90IGhhdmUgYSB2aWJyYW50IGNvbG9yLi4uXHJcbiAgICAgIGlmIEBWaWJyYW50U3dhdGNoIGlzbnQgbnVsbFxyXG4gICAgICAgICMgLi4uYnV0IHdlIGRvIGhhdmUgYSBkYXJrIHZpYnJhbnQsIGdlbmVyYXRlIHRoZSB2YWx1ZSBieSBtb2RpZnlpbmcgdGhlIGx1bWFcclxuICAgICAgICBoc2wgPSBAVmlicmFudFN3YXRjaC5nZXRIc2woKVxyXG4gICAgICAgIGhzbFsyXSA9IEBvcHRzLnRhcmdldERhcmtMdW1hXHJcbiAgICAgICAgQERhcmtWaWJyYW50U3dhdGNoID0gbmV3IFN3YXRjaCB1dGlsLmhzbFRvUmdiKGhzbFswXSwgaHNsWzFdLCBoc2xbMl0pLCAwXHJcblxyXG4gIGZpbmRNYXhQb3B1bGF0aW9uOiAtPlxyXG4gICAgcG9wdWxhdGlvbiA9IDBcclxuICAgIHBvcHVsYXRpb24gPSBNYXRoLm1heChwb3B1bGF0aW9uLCBzd2F0Y2guZ2V0UG9wdWxhdGlvbigpKSBmb3Igc3dhdGNoIGluIEBzd2F0Y2hlc1xyXG4gICAgcG9wdWxhdGlvblxyXG5cclxuICBmaW5kQ29sb3JWYXJpYXRpb246ICh0YXJnZXRMdW1hLCBtaW5MdW1hLCBtYXhMdW1hLCB0YXJnZXRTYXR1cmF0aW9uLCBtaW5TYXR1cmF0aW9uLCBtYXhTYXR1cmF0aW9uKSAtPlxyXG4gICAgbWF4ID0gbnVsbFxyXG4gICAgbWF4VmFsdWUgPSAwXHJcblxyXG4gICAgZm9yIHN3YXRjaCBpbiBAc3dhdGNoZXNcclxuICAgICAgc2F0ID0gc3dhdGNoLmdldEhzbCgpWzFdO1xyXG4gICAgICBsdW1hID0gc3dhdGNoLmdldEhzbCgpWzJdXHJcblxyXG4gICAgICBpZiBzYXQgPj0gbWluU2F0dXJhdGlvbiBhbmQgc2F0IDw9IG1heFNhdHVyYXRpb24gYW5kXHJcbiAgICAgICAgbHVtYSA+PSBtaW5MdW1hIGFuZCBsdW1hIDw9IG1heEx1bWEgYW5kXHJcbiAgICAgICAgbm90IEBpc0FscmVhZHlTZWxlY3RlZChzd2F0Y2gpXHJcbiAgICAgICAgICB2YWx1ZSA9IEBjcmVhdGVDb21wYXJpc29uVmFsdWUgc2F0LCB0YXJnZXRTYXR1cmF0aW9uLCBsdW1hLCB0YXJnZXRMdW1hLFxyXG4gICAgICAgICAgICBzd2F0Y2guZ2V0UG9wdWxhdGlvbigpLCBASGlnaGVzdFBvcHVsYXRpb25cclxuICAgICAgICAgIGlmIG1heCBpcyBudWxsIG9yIHZhbHVlID4gbWF4VmFsdWVcclxuICAgICAgICAgICAgbWF4ID0gc3dhdGNoXHJcbiAgICAgICAgICAgIG1heFZhbHVlID0gdmFsdWVcclxuXHJcbiAgICBtYXhcclxuXHJcbiAgY3JlYXRlQ29tcGFyaXNvblZhbHVlOiAoc2F0dXJhdGlvbiwgdGFyZ2V0U2F0dXJhdGlvbixcclxuICAgICAgbHVtYSwgdGFyZ2V0THVtYSwgcG9wdWxhdGlvbiwgbWF4UG9wdWxhdGlvbikgLT5cclxuICAgIEB3ZWlnaHRlZE1lYW4oXHJcbiAgICAgIEBpbnZlcnREaWZmKHNhdHVyYXRpb24sIHRhcmdldFNhdHVyYXRpb24pLCBAb3B0cy53ZWlnaHRTYXR1cmF0aW9uLFxyXG4gICAgICBAaW52ZXJ0RGlmZihsdW1hLCB0YXJnZXRMdW1hKSwgQG9wdHMud2VpZ2h0THVtYSxcclxuICAgICAgcG9wdWxhdGlvbiAvIG1heFBvcHVsYXRpb24sIEBvcHRzLndlaWdodFBvcHVsYXRpb25cclxuICAgIClcclxuXHJcbiAgaW52ZXJ0RGlmZjogKHZhbHVlLCB0YXJnZXRWYWx1ZSkgLT5cclxuICAgIDEgLSBNYXRoLmFicyB2YWx1ZSAtIHRhcmdldFZhbHVlXHJcblxyXG4gIHdlaWdodGVkTWVhbjogKHZhbHVlcy4uLikgLT5cclxuICAgIHN1bSA9IDBcclxuICAgIHN1bVdlaWdodCA9IDBcclxuICAgIGkgPSAwXHJcbiAgICB3aGlsZSBpIDwgdmFsdWVzLmxlbmd0aFxyXG4gICAgICB2YWx1ZSA9IHZhbHVlc1tpXVxyXG4gICAgICB3ZWlnaHQgPSB2YWx1ZXNbaSArIDFdXHJcbiAgICAgIHN1bSArPSB2YWx1ZSAqIHdlaWdodFxyXG4gICAgICBzdW1XZWlnaHQgKz0gd2VpZ2h0XHJcbiAgICAgIGkgKz0gMlxyXG4gICAgc3VtIC8gc3VtV2VpZ2h0XHJcblxyXG4gIGlzQWxyZWFkeVNlbGVjdGVkOiAoc3dhdGNoKSAtPlxyXG4gICAgQFZpYnJhbnRTd2F0Y2ggaXMgc3dhdGNoIG9yIEBEYXJrVmlicmFudFN3YXRjaCBpcyBzd2F0Y2ggb3JcclxuICAgICAgQExpZ2h0VmlicmFudFN3YXRjaCBpcyBzd2F0Y2ggb3IgQE11dGVkU3dhdGNoIGlzIHN3YXRjaCBvclxyXG4gICAgICBARGFya011dGVkU3dhdGNoIGlzIHN3YXRjaCBvciBATGlnaHRNdXRlZFN3YXRjaCBpcyBzd2F0Y2hcclxuIiwibW9kdWxlLmV4cG9ydHMgPVxyXG5jbGFzcyBHZW5lcmF0b3JcclxuICBnZW5lcmF0ZTogKHN3YXRjaGVzKSAtPlxyXG5cclxuICBnZXRWaWJyYW50U3dhdGNoOiAtPlxyXG5cclxuICBnZXRMaWdodFZpYnJhbnRTd2F0Y2g6IC0+XHJcblxyXG4gIGdldERhcmtWaWJyYW50U3dhdGNoOiAtPlxyXG5cclxuICBnZXRNdXRlZFN3YXRjaDogLT5cclxuXHJcbiAgZ2V0TGlnaHRNdXRlZFN3YXRjaDogLT5cclxuXHJcbiAgZ2V0RGFya011dGVkU3dhdGNoOiAtPlxyXG5cclxubW9kdWxlLmV4cG9ydHMuRGVmYXVsdCA9IHJlcXVpcmUoJy4vZGVmYXVsdCcpXHJcbiIsIkltYWdlID0gcmVxdWlyZSgnLi9pbmRleCcpXG5VcmwgPSByZXF1aXJlKCd1cmwnKVxuXG5pc1JlbGF0aXZlVXJsID0gKHVybCkgLT5cbiAgdSA9IFVybC5wYXJzZSh1cmwpXG5cbiAgdS5wcm90b2NvbCA9PSBudWxsICYmIHUuaG9zdCA9PSBudWxsICYmIHUucG9ydCA9PSBudWxsXG5cbmlzU2FtZU9yaWdpbiA9IChhLCBiKSAtPlxuICB1YSA9IFVybC5wYXJzZShhKVxuICB1YiA9IFVybC5wYXJzZShiKVxuXG4gICMgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU2VjdXJpdHkvU2FtZS1vcmlnaW5fcG9saWN5XG4gIHVhLnByb3RvY29sID09IHViLnByb3RvY29sICYmIHVhLmhvc3RuYW1lID09IHViLmhvc3RuYW1lICYmIHVhLnBvcnQgPT0gdWIucG9ydFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBCcm93c2VySW1hZ2UgZXh0ZW5kcyBJbWFnZVxuXG4gIGNvbnN0cnVjdG9yOiAocGF0aCwgY2IpIC0+XG4gICAgaWYgdHlwZW9mIHBhdGggPT0gJ29iamVjdCcgYW5kIHBhdGggaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50XG4gICAgICBAaW1nID0gcGF0aFxuICAgICAgcGF0aCA9IEBpbWcuc3JjXG4gICAgZWxzZVxuICAgICAgQGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG4gICAgICBAaW1nLnNyYyA9IHBhdGhcblxuICAgIGlmIG5vdCBpc1JlbGF0aXZlVXJsKHBhdGgpICYmIG5vdCBpc1NhbWVPcmlnaW4od2luZG93LmxvY2F0aW9uLmhyZWYsIHBhdGgpXG4gICAgICBAaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cydcblxuICAgIEBpbWcub25sb2FkID0gPT5cbiAgICAgIEBfaW5pdENhbnZhcygpXG4gICAgICBjYj8obnVsbCwgQClcblxuICAgICMgQWxyZWF5ZCBsb2FkZWRcbiAgICBpZiBAaW1nLmNvbXBsZXRlXG4gICAgICBAaW1nLm9ubG9hZCgpXG5cbiAgICBAaW1nLm9uZXJyb3IgPSAoZSkgPT5cbiAgICAgIGVyciA9IG5ldyBFcnJvcihcIkZhaWwgdG8gbG9hZCBpbWFnZTogXCIgKyBwYXRoKTtcbiAgICAgIGVyci5yYXcgPSBlO1xuICAgICAgY2I/KGVycilcblxuXG4gIF9pbml0Q2FudmFzOiAtPlxuICAgIEBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuICAgIEBjb250ZXh0ID0gQGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBAY2FudmFzXG4gICAgQHdpZHRoID0gQGNhbnZhcy53aWR0aCA9IEBpbWcud2lkdGhcbiAgICBAaGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgPSBAaW1nLmhlaWdodFxuICAgIEBjb250ZXh0LmRyYXdJbWFnZSBAaW1nLCAwLCAwLCBAd2lkdGgsIEBoZWlnaHRcblxuICBjbGVhcjogLT5cbiAgICBAY29udGV4dC5jbGVhclJlY3QgMCwgMCwgQHdpZHRoLCBAaGVpZ2h0XG5cbiAgZ2V0V2lkdGg6IC0+XG4gICAgQHdpZHRoXG5cbiAgZ2V0SGVpZ2h0OiAtPlxuICAgIEBoZWlnaHRcblxuICByZXNpemU6ICh3LCBoLCByKSAtPlxuICAgIEB3aWR0aCA9IEBjYW52YXMud2lkdGggPSB3XG4gICAgQGhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ID0gaFxuICAgIEBjb250ZXh0LnNjYWxlKHIsIHIpXG4gICAgQGNvbnRleHQuZHJhd0ltYWdlIEBpbWcsIDAsIDBcblxuICB1cGRhdGU6IChpbWFnZURhdGEpIC0+XG4gICAgQGNvbnRleHQucHV0SW1hZ2VEYXRhIGltYWdlRGF0YSwgMCwgMFxuXG4gIGdldFBpeGVsQ291bnQ6IC0+XG4gICAgQHdpZHRoICogQGhlaWdodFxuXG4gIGdldEltYWdlRGF0YTogLT5cbiAgICBAY29udGV4dC5nZXRJbWFnZURhdGEgMCwgMCwgQHdpZHRoLCBAaGVpZ2h0XG5cbiAgcmVtb3ZlQ2FudmFzOiAtPlxuICAgIEBjYW52YXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCBAY2FudmFzXG4iLCJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJbWFnZVxuICBjbGVhcjogLT5cblxuICB1cGRhdGU6IChpbWFnZURhdGEpIC0+XG5cbiAgZ2V0V2lkdGg6IC0+XG5cbiAgZ2V0SGVpZ2h0OiAtPlxuXG4gIHNjYWxlRG93bjogKG9wdHMpIC0+XG4gICAgd2lkdGggPSBAZ2V0V2lkdGgoKVxuICAgIGhlaWdodCA9IEBnZXRIZWlnaHQoKVxuXG4gICAgcmF0aW8gPSAxXG4gICAgaWYgb3B0cy5tYXhEaW1lbnNpb24/XG4gICAgICBtYXhTaWRlID0gTWF0aC5tYXgod2lkdGgsIGhlaWdodClcbiAgICAgIGlmIG1heFNpZGUgPiBvcHRzLm1heERpbWVuc2lvblxuICAgICAgICByYXRpbyA9IG9wdHMubWF4RGltZW5zaW9uIC8gbWF4U2lkZVxuICAgIGVsc2VcbiAgICAgIHJhdGlvID0gMSAvIG9wdHMucXVhbGl0eVxuXG4gICAgaWYgcmF0aW8gPCAxXG4gICAgICBAcmVzaXplIHdpZHRoICogcmF0aW8sIGhlaWdodCAqIHJhdGlvLCByYXRpb1xuXG4gIHJlc2l6ZTogKHcsIGgsIHIpIC0+XG5cblxuICBnZXRQaXhlbENvdW50OiAtPlxuXG4gIGdldEltYWdlRGF0YTogLT5cblxuICByZW1vdmVDYW52YXM6IC0+XG4iLCIjIFNJR0JJVFMgPSA1XHJcbiMgUlNISUZUID0gOCAtIFNJR0JJVFNcclxuI1xyXG4jIGdldENvbG9ySW5kZXggPSAociwgZywgYikgLT5cclxuIyAgIChyPDwoMipTSUdCSVRTKSkgKyAoZyA8PCBTSUdCSVRTKSArIGJcclxuXHJcbntnZXRDb2xvckluZGV4LCBTSUdCSVRTLCBSU0hJRlR9ID0gdXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxyXG5Td2F0Y2ggPSByZXF1aXJlKCcuLi8uLi9zd2F0Y2gnKVxyXG5WQm94ID0gcmVxdWlyZSgnLi92Ym94JylcclxuUFF1ZXVlID0gcmVxdWlyZSgnLi9wcXVldWUnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG5jbGFzcyBNTUNRXHJcbiAgQERlZmF1bHRPcHRzOlxyXG4gICAgbWF4SXRlcmF0aW9uczogMTAwMFxyXG4gICAgZnJhY3RCeVBvcHVsYXRpb25zOiAwLjc1XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAob3B0cykgLT5cclxuICAgIEBvcHRzID0gdXRpbC5kZWZhdWx0cyBvcHRzLCBAY29uc3RydWN0b3IuRGVmYXVsdE9wdHNcclxuICBxdWFudGl6ZTogKHBpeGVscywgb3B0cykgLT5cclxuICAgIGlmIHBpeGVscy5sZW5ndGggPT0gMCBvciBvcHRzLmNvbG9yQ291bnQgPCAyIG9yIG9wdHMuY29sb3JDb3VudCA+IDI1NlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyBNTUNRIHBhcmFtZXRlcnNcIilcclxuXHJcbiAgICBzaG91bGRJZ25vcmUgPSAtPiBmYWxzZVxyXG5cclxuICAgIGlmIEFycmF5LmlzQXJyYXkob3B0cy5maWx0ZXJzKSBhbmQgb3B0cy5maWx0ZXJzLmxlbmd0aCA+IDBcclxuICAgICAgc2hvdWxkSWdub3JlID0gKHIsIGcsIGIsIGEpIC0+XHJcbiAgICAgICAgZm9yIGYgaW4gb3B0cy5maWx0ZXJzXHJcbiAgICAgICAgICBpZiBub3QgZihyLCBnLCBiLCBhKSB0aGVuIHJldHVybiB0cnVlXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG5cclxuICAgIHZib3ggPSBWQm94LmJ1aWxkKHBpeGVscywgc2hvdWxkSWdub3JlKVxyXG4gICAgaGlzdCA9IHZib3guaGlzdFxyXG4gICAgY29sb3JDb3VudCA9IE9iamVjdC5rZXlzKGhpc3QpLmxlbmd0aFxyXG4gICAgcHEgPSBuZXcgUFF1ZXVlIChhLCBiKSAtPiBhLmNvdW50KCkgLSBiLmNvdW50KClcclxuXHJcbiAgICBwcS5wdXNoKHZib3gpXHJcblxyXG4gICAgIyBmaXJzdCBzZXQgb2YgY29sb3JzLCBzb3J0ZWQgYnkgcG9wdWxhdGlvblxyXG4gICAgQF9zcGxpdEJveGVzKHBxLCBAb3B0cy5mcmFjdEJ5UG9wdWxhdGlvbnMgKiBvcHRzLmNvbG9yQ291bnQpXHJcblxyXG4gICAgIyBSZS1vcmRlclxyXG4gICAgcHEyID0gbmV3IFBRdWV1ZSAoYSwgYikgLT4gYS5jb3VudCgpICogYS52b2x1bWUoKSAtIGIuY291bnQoKSAqIGIudm9sdW1lKClcclxuICAgIHBxMi5jb250ZW50cyA9IHBxLmNvbnRlbnRzXHJcblxyXG4gICAgIyBuZXh0IHNldCAtIGdlbmVyYXRlIHRoZSBtZWRpYW4gY3V0cyB1c2luZyB0aGUgKG5waXggKiB2b2wpIHNvcnRpbmcuXHJcbiAgICBAX3NwbGl0Qm94ZXMocHEyLCBvcHRzLmNvbG9yQ291bnQgLSBwcTIuc2l6ZSgpKVxyXG5cclxuICAgICMgY2FsY3VsYXRlIHRoZSBhY3R1YWwgY29sb3JzXHJcbiAgICBzd2F0Y2hlcyA9IFtdXHJcbiAgICBAdmJveGVzID0gW11cclxuICAgIHdoaWxlIHBxMi5zaXplKClcclxuICAgICAgdiA9IHBxMi5wb3AoKVxyXG4gICAgICBjb2xvciA9IHYuYXZnKClcclxuICAgICAgaWYgbm90IHNob3VsZElnbm9yZT8oY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgMjU1KVxyXG4gICAgICAgIEB2Ym94ZXMucHVzaCB2XHJcbiAgICAgICAgc3dhdGNoZXMucHVzaCBuZXcgU3dhdGNoIGNvbG9yLCB2LmNvdW50KClcclxuXHJcbiAgICBzd2F0Y2hlc1xyXG5cclxuICBfc3BsaXRCb3hlczogKHBxLCB0YXJnZXQpIC0+XHJcbiAgICBjb2xvckNvdW50ID0gMVxyXG4gICAgaXRlcmF0aW9uID0gMFxyXG4gICAgbWF4SXRlcmF0aW9ucyA9IEBvcHRzLm1heEl0ZXJhdGlvbnNcclxuICAgIHdoaWxlIGl0ZXJhdGlvbiA8IG1heEl0ZXJhdGlvbnNcclxuICAgICAgaXRlcmF0aW9uKytcclxuICAgICAgdmJveCA9IHBxLnBvcCgpXHJcbiAgICAgIGlmICF2Ym94LmNvdW50KClcclxuICAgICAgICBjb250aW51ZVxyXG5cclxuICAgICAgW3Zib3gxLCB2Ym94Ml0gPSB2Ym94LnNwbGl0KClcclxuXHJcbiAgICAgIHBxLnB1c2godmJveDEpXHJcbiAgICAgIGlmIHZib3gyXHJcbiAgICAgICAgcHEucHVzaCh2Ym94MilcclxuICAgICAgICBjb2xvckNvdW50KytcclxuICAgICAgaWYgY29sb3JDb3VudCA+PSB0YXJnZXQgb3IgaXRlcmF0aW9uID4gbWF4SXRlcmF0aW9uc1xyXG4gICAgICAgIHJldHVyblxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9XHJcbmNsYXNzIFBRdWV1ZVxyXG4gIGNvbnN0cnVjdG9yOiAoQGNvbXBhcmF0b3IpIC0+XHJcbiAgICBAY29udGVudHMgPSBbXVxyXG4gICAgQHNvcnRlZCA9IGZhbHNlXHJcblxyXG4gIF9zb3J0OiAtPlxyXG4gICAgQGNvbnRlbnRzLnNvcnQoQGNvbXBhcmF0b3IpXHJcbiAgICBAc29ydGVkID0gdHJ1ZVxyXG5cclxuICBwdXNoOiAobykgLT5cclxuICAgIEBjb250ZW50cy5wdXNoIG9cclxuICAgIEBzb3J0ZWQgPSBmYWxzZVxyXG5cclxuICBwZWVrOiAoaW5kZXgpIC0+XHJcbiAgICBpZiBub3QgQHNvcnRlZFxyXG4gICAgICBAX3NvcnQoKVxyXG4gICAgaW5kZXggPz0gQGNvbnRlbnRzLmxlbmd0aCAtIDFcclxuICAgIEBjb250ZW50c1tpbmRleF1cclxuXHJcbiAgcG9wOiAtPlxyXG4gICAgaWYgbm90IEBzb3J0ZWRcclxuICAgICAgQF9zb3J0KClcclxuICAgIEBjb250ZW50cy5wb3AoKVxyXG5cclxuICBzaXplOiAtPlxyXG4gICAgQGNvbnRlbnRzLmxlbmd0aFxyXG5cclxuICBtYXA6IChmKSAtPlxyXG4gICAgaWYgbm90IEBzb3J0ZWRcclxuICAgICAgQF9zb3J0KClcclxuICAgIEBjb250ZW50cy5tYXAoZilcclxuIiwie2dldENvbG9ySW5kZXgsIFNJR0JJVFMsIFJTSElGVH0gPSB1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbmNsYXNzIFZCb3hcclxuICBAYnVpbGQ6IChwaXhlbHMsIHNob3VsZElnbm9yZSkgLT5cclxuICAgIGhuID0gMTw8KDMqU0lHQklUUylcclxuICAgIGhpc3QgPSBuZXcgVWludDMyQXJyYXkoaG4pXHJcbiAgICBybWF4ID0gZ21heCA9IGJtYXggPSAwXHJcbiAgICBybWluID0gZ21pbiA9IGJtaW4gPSBOdW1iZXIuTUFYX1ZBTFVFXHJcbiAgICBuID0gcGl4ZWxzLmxlbmd0aCAvIDRcclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IG5cclxuICAgICAgb2Zmc2V0ID0gaSAqIDRcclxuICAgICAgaSsrXHJcbiAgICAgIHIgPSBwaXhlbHNbb2Zmc2V0ICsgMF1cclxuICAgICAgZyA9IHBpeGVsc1tvZmZzZXQgKyAxXVxyXG4gICAgICBiID0gcGl4ZWxzW29mZnNldCArIDJdXHJcbiAgICAgIGEgPSBwaXhlbHNbb2Zmc2V0ICsgM11cclxuICAgICAgIyBUT0RPOiB1c2UgcmVzdWx0IGZyb20gaGlzdFxyXG4gICAgICBpZiBzaG91bGRJZ25vcmUociwgZywgYiwgYSkgdGhlbiBjb250aW51ZVxyXG5cclxuICAgICAgciA9IHIgPj4gUlNISUZUXHJcbiAgICAgIGcgPSBnID4+IFJTSElGVFxyXG4gICAgICBiID0gYiA+PiBSU0hJRlRcclxuXHJcblxyXG4gICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgociwgZywgYilcclxuICAgICAgaGlzdFtpbmRleF0gKz0gMVxyXG5cclxuICAgICAgaWYgciA+IHJtYXhcclxuICAgICAgICBybWF4ID0gclxyXG4gICAgICBpZiByIDwgcm1pblxyXG4gICAgICAgIHJtaW4gPSByXHJcbiAgICAgIGlmIGcgPiBnbWF4XHJcbiAgICAgICAgZ21heCA9IGdcclxuICAgICAgaWYgZyA8IGdtaW5cclxuICAgICAgICBnbWluID0gZ1xyXG4gICAgICBpZiBiID4gYm1heFxyXG4gICAgICAgIGJtYXggPSBiXHJcbiAgICAgIGlmIGIgPCBibWluXHJcbiAgICAgICAgYm1pbiA9IGJcclxuXHJcbiAgICBuZXcgVkJveChybWluLCBybWF4LCBnbWluLCBnbWF4LCBibWluLCBibWF4LCBoaXN0KVxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEByMSwgQHIyLCBAZzEsIEBnMiwgQGIxLCBAYjIsIEBoaXN0KSAtPlxyXG4gICAgIyBAX2luaXRCb3goKVxyXG5cclxuICBpbnZhbGlkYXRlOiAtPlxyXG4gICAgZGVsZXRlIEBfY291bnRcclxuICAgIGRlbGV0ZSBAX2F2Z1xyXG4gICAgZGVsZXRlIEBfdm9sdW1lXHJcblxyXG4gIHZvbHVtZTogLT5cclxuICAgIGlmIG5vdCBAX3ZvbHVtZT9cclxuICAgICAgQF92b2x1bWUgPSAoQHIyIC0gQHIxICsgMSkgKiAoQGcyIC0gQGcxICsgMSkgKiAoQGIyIC0gQGIxICsgMSlcclxuICAgIEBfdm9sdW1lXHJcblxyXG4gIGNvdW50OiAtPlxyXG4gICAgaWYgbm90IEBfY291bnQ/XHJcbiAgICAgIGhpc3QgPSBAaGlzdFxyXG4gICAgICBjID0gMFxyXG4gICAgICBgXHJcbiAgICAgIGZvciAodmFyIHIgPSB0aGlzLnIxOyByIDw9IHRoaXMucjI7IHIrKykge1xyXG4gICAgICAgIGZvciAodmFyIGcgPSB0aGlzLmcxOyBnIDw9IHRoaXMuZzI7IGcrKykge1xyXG4gICAgICAgICAgZm9yICh2YXIgYiA9IHRoaXMuYjE7IGIgPD0gdGhpcy5iMjsgYisrKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGdldENvbG9ySW5kZXgociwgZywgYik7XHJcbiAgICAgICAgICAgIGMgKz0gaGlzdFtpbmRleF07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGBcclxuICAgICAgIyBmb3IgciBpbiBbQHIxLi5AcjJdXHJcbiAgICAgICMgICBmb3IgZyBpbiBbQGcxLi5AZzJdXHJcbiAgICAgICMgICAgIGZvciBiIGluIFtAYjEuLkBiMl1cclxuICAgICAgIyAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgociwgZywgYilcclxuICAgICAgIyAgICAgICBjICs9IGhpc3RbaW5kZXhdXHJcbiAgICAgIEBfY291bnQgPSBjXHJcbiAgICBAX2NvdW50XHJcblxyXG4gIGNsb25lOiAtPlxyXG4gICAgbmV3IFZCb3goQHIxLCBAcjIsIEBnMSwgQGcyLCBAYjEsIEBiMiwgQGhpc3QpXHJcblxyXG4gIGF2ZzogLT5cclxuICAgIGlmIG5vdCBAX2F2Zz9cclxuICAgICAgaGlzdCA9IEBoaXN0XHJcbiAgICAgIG50b3QgPSAwXHJcbiAgICAgIG11bHQgPSAxIDw8ICg4IC0gU0lHQklUUylcclxuICAgICAgcnN1bSA9IGdzdW0gPSBic3VtID0gMFxyXG4gICAgICBgXHJcbiAgICAgIGZvciAodmFyIHIgPSB0aGlzLnIxOyByIDw9IHRoaXMucjI7IHIrKykge1xyXG4gICAgICAgIGZvciAodmFyIGcgPSB0aGlzLmcxOyBnIDw9IHRoaXMuZzI7IGcrKykge1xyXG4gICAgICAgICAgZm9yICh2YXIgYiA9IHRoaXMuYjE7IGIgPD0gdGhpcy5iMjsgYisrKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGdldENvbG9ySW5kZXgociwgZywgYik7XHJcbiAgICAgICAgICAgIHZhciBoID0gaGlzdFtpbmRleF07XHJcbiAgICAgICAgICAgIG50b3QgKz0gaDtcclxuICAgICAgICAgICAgcnN1bSArPSAoaCAqIChyICsgMC41KSAqIG11bHQpO1xyXG4gICAgICAgICAgICBnc3VtICs9IChoICogKGcgKyAwLjUpICogbXVsdCk7XHJcbiAgICAgICAgICAgIGJzdW0gKz0gKGggKiAoYiArIDAuNSkgKiBtdWx0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgYFxyXG4gICAgICAjIE5PVEU6IENvZmZlZVNjcmlwdCB3aWxsIHNjcmV3IHRoaW5ncyB1cCB3aGVuIEByMSA+IEByMlxyXG4gICAgICAjIGZvciByIGluIFtAcjEuLkByMl1cclxuICAgICAgIyAgIGZvciBnIGluIFtAZzEuLkBnMl1cclxuICAgICAgIyAgICAgZm9yIGIgaW4gW0BiMS4uQGIyXVxyXG4gICAgICAjICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChyLCBnLCBiKVxyXG4gICAgICAjICAgICAgIGggPSBoaXN0W2luZGV4XVxyXG4gICAgICAjICAgICAgIG50b3QgKz0gaFxyXG4gICAgICAjICAgICAgIHJzdW0gKz0gKGggKiAociArIDAuNSkgKiBtdWx0KVxyXG4gICAgICAjICAgICAgIGdzdW0gKz0gKGggKiAoZyArIDAuNSkgKiBtdWx0KVxyXG4gICAgICAjICAgICAgIGJzdW0gKz0gKGggKiAoYiArIDAuNSkgKiBtdWx0KVxyXG5cclxuICAgICAgaWYgbnRvdFxyXG4gICAgICAgIEBfYXZnID0gW1xyXG4gICAgICAgICAgfn4ocnN1bSAvIG50b3QpXHJcbiAgICAgICAgICB+fihnc3VtIC8gbnRvdClcclxuICAgICAgICAgIH5+KGJzdW0gLyBudG90KVxyXG4gICAgICAgIF1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBfYXZnID0gW1xyXG4gICAgICAgICAgfn4obXVsdCAqIChAcjEgKyBAcjIgKyAxKSAvIDIpXHJcbiAgICAgICAgICB+fihtdWx0ICogKEBnMSArIEBnMiArIDEpIC8gMilcclxuICAgICAgICAgIH5+KG11bHQgKiAoQGIxICsgQGIyICsgMSkgLyAyKVxyXG4gICAgICAgIF1cclxuICAgIEBfYXZnXHJcblxyXG4gIHNwbGl0OiAtPlxyXG4gICAgaGlzdCA9IEBoaXN0XHJcbiAgICBpZiAhQGNvdW50KClcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIGlmIEBjb3VudCgpID09IDFcclxuICAgICAgcmV0dXJuIFtAY2xvbmUoKV1cclxuXHJcbiAgICBydyA9IEByMiAtIEByMSArIDFcclxuICAgIGd3ID0gQGcyIC0gQGcxICsgMVxyXG4gICAgYncgPSBAYjIgLSBAYjEgKyAxXHJcblxyXG4gICAgbWF4dyA9IE1hdGgubWF4KHJ3LCBndywgYncpXHJcbiAgICBhY2NTdW0gPSBudWxsXHJcbiAgICBzdW0gPSB0b3RhbCA9IDBcclxuXHJcbiAgICBtYXhkID0gbnVsbFxyXG4gICAgc3dpdGNoIG1heHdcclxuICAgICAgd2hlbiByd1xyXG4gICAgICAgIG1heGQgPSAncidcclxuICAgICAgICBhY2NTdW0gPSBuZXcgVWludDMyQXJyYXkoQHIyICsgMSlcclxuICAgICAgICBgXHJcbiAgICAgICAgZm9yICh2YXIgciA9IHRoaXMucjE7IHIgPD0gdGhpcy5yMjsgcisrKSB7XHJcbiAgICAgICAgICBzdW0gPSAwXHJcbiAgICAgICAgICBmb3IgKHZhciBnID0gdGhpcy5nMTsgZyA8PSB0aGlzLmcyOyBnKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgYiA9IHRoaXMuYjE7IGIgPD0gdGhpcy5iMjsgYisrKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZ2V0Q29sb3JJbmRleChyLCBnLCBiKTtcclxuICAgICAgICAgICAgICBzdW0gKz0gaGlzdFtpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRvdGFsICs9IHN1bTtcclxuICAgICAgICAgIGFjY1N1bVtyXSA9IHRvdGFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBgXHJcbiAgICAgICAgIyBmb3IgciBpbiBbQHIxLi5AcjJdXHJcbiAgICAgICAgIyAgIHN1bSA9IDBcclxuICAgICAgICAjICAgZm9yIGcgaW4gW0BnMS4uQGcyXVxyXG4gICAgICAgICMgICAgIGZvciBiIGluIFtAYjEuLkBiMl1cclxuICAgICAgICAjICAgICAgIGluZGV4ID0gZ2V0Q29sb3JJbmRleChyLCBnLCBiKVxyXG4gICAgICAgICMgICAgICAgc3VtICs9IGhpc3RbaW5kZXhdXHJcbiAgICAgICAgIyAgIHRvdGFsICs9IHN1bVxyXG4gICAgICAgICMgICBhY2NTdW1bcl0gPSB0b3RhbFxyXG4gICAgICB3aGVuIGd3XHJcbiAgICAgICAgbWF4ZCA9ICdnJ1xyXG4gICAgICAgIGFjY1N1bSA9IG5ldyBVaW50MzJBcnJheShAZzIgKyAxKVxyXG4gICAgICAgIGBcclxuICAgICAgICBmb3IgKHZhciBnID0gdGhpcy5nMTsgZyA8PSB0aGlzLmcyOyBnKyspIHtcclxuICAgICAgICAgIHN1bSA9IDBcclxuICAgICAgICAgIGZvciAodmFyIHIgPSB0aGlzLnIxOyByIDw9IHRoaXMucjI7IHIrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBiID0gdGhpcy5iMTsgYiA8PSB0aGlzLmIyOyBiKyspIHtcclxuICAgICAgICAgICAgICB2YXIgaW5kZXggPSBnZXRDb2xvckluZGV4KHIsIGcsIGIpO1xyXG4gICAgICAgICAgICAgIHN1bSArPSBoaXN0W2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdG90YWwgKz0gc3VtO1xyXG4gICAgICAgICAgYWNjU3VtW2ddID0gdG90YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGBcclxuICAgICAgICAjIGZvciBnIGluIFtAZzEuLkBnMl1cclxuICAgICAgICAjICAgc3VtID0gMFxyXG4gICAgICAgICMgICBmb3IgciBpbiBbQHIxLi5AcjJdXHJcbiAgICAgICAgIyAgICAgZm9yIGIgaW4gW0BiMS4uQGIyXVxyXG4gICAgICAgICMgICAgICAgaW5kZXggPSBnZXRDb2xvckluZGV4KHIsIGcsIGIpXHJcbiAgICAgICAgIyAgICAgICBzdW0gKz0gaGlzdFtpbmRleF1cclxuICAgICAgICAjICAgdG90YWwgKz0gc3VtXHJcbiAgICAgICAgIyAgIGFjY1N1bVtnXSA9IHRvdGFsXHJcbiAgICAgIHdoZW4gYndcclxuICAgICAgICBtYXhkID0gJ2InXHJcbiAgICAgICAgYWNjU3VtID0gbmV3IFVpbnQzMkFycmF5KEBiMiArIDEpXHJcbiAgICAgICAgYFxyXG4gICAgICAgIGZvciAodmFyIGIgPSB0aGlzLmIxOyBiIDw9IHRoaXMuYjI7IGIrKykge1xyXG4gICAgICAgICAgc3VtID0gMFxyXG4gICAgICAgICAgZm9yICh2YXIgciA9IHRoaXMucjE7IHIgPD0gdGhpcy5yMjsgcisrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGcgPSB0aGlzLmcxOyBnIDw9IHRoaXMuZzI7IGcrKykge1xyXG4gICAgICAgICAgICAgIHZhciBpbmRleCA9IGdldENvbG9ySW5kZXgociwgZywgYik7XHJcbiAgICAgICAgICAgICAgc3VtICs9IGhpc3RbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0b3RhbCArPSBzdW07XHJcbiAgICAgICAgICBhY2NTdW1bYl0gPSB0b3RhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgYFxyXG4gICAgICAgICMgZm9yIGIgaW4gW0BiMS4uQGIyXVxyXG4gICAgICAgICMgICBzdW0gPSAwXHJcbiAgICAgICAgIyAgIGZvciByIGluIFtAcjEuLkByMl1cclxuICAgICAgICAjICAgICBmb3IgZyBpbiBbQGcxLi5AZzJdXHJcbiAgICAgICAgIyAgICAgICBpbmRleCA9IGdldENvbG9ySW5kZXgociwgZywgYilcclxuICAgICAgICAjICAgICAgIHN1bSArPSBoaXN0W2luZGV4XVxyXG4gICAgICAgICMgICB0b3RhbCArPSBzdW1cclxuICAgICAgICAjICAgYWNjU3VtW2JdID0gdG90YWxcclxuXHJcbiAgICBzcGxpdFBvaW50ID0gLTFcclxuICAgIHJldmVyc2VTdW0gPSBuZXcgVWludDMyQXJyYXkoYWNjU3VtLmxlbmd0aClcclxuICAgIGZvciBpIGluIFswLi5hY2NTdW0ubGVuZ3RoLTFdXHJcbiAgICAgIGQgPSBhY2NTdW1baV1cclxuICAgICAgaWYgc3BsaXRQb2ludCA8IDAgJiYgZCA+IHRvdGFsIC8gMlxyXG4gICAgICAgIHNwbGl0UG9pbnQgPSBpXHJcbiAgICAgIHJldmVyc2VTdW1baV0gPSB0b3RhbCAtIGRcclxuXHJcbiAgICB2Ym94ID0gdGhpc1xyXG4gICAgZG9DdXQgPSAoZCkgLT5cclxuICAgICAgZGltMSA9IGQgKyBcIjFcIlxyXG4gICAgICBkaW0yID0gZCArIFwiMlwiXHJcbiAgICAgIGQxID0gdmJveFtkaW0xXVxyXG4gICAgICBkMiA9IHZib3hbZGltMl1cclxuICAgICAgdmJveDEgPSB2Ym94LmNsb25lKClcclxuICAgICAgdmJveDIgPSB2Ym94LmNsb25lKClcclxuICAgICAgbGVmdCA9IHNwbGl0UG9pbnQgLSBkMVxyXG4gICAgICByaWdodCA9IGQyIC0gc3BsaXRQb2ludFxyXG4gICAgICBpZiBsZWZ0IDw9IHJpZ2h0XHJcbiAgICAgICAgZDIgPSBNYXRoLm1pbihkMiAtIDEsIH5+IChzcGxpdFBvaW50ICsgcmlnaHQgLyAyKSlcclxuICAgICAgICBkMiA9IE1hdGgubWF4KDAsIGQyKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZDIgPSBNYXRoLm1heChkMSwgfn4gKHNwbGl0UG9pbnQgLSAxIC0gbGVmdCAvIDIpKVxyXG4gICAgICAgIGQyID0gTWF0aC5taW4odmJveFtkaW0yXSwgZDIpXHJcblxyXG5cclxuICAgICAgd2hpbGUgIWFjY1N1bVtkMl1cclxuICAgICAgICBkMisrXHJcblxyXG5cclxuICAgICAgYzIgPSByZXZlcnNlU3VtW2QyXVxyXG4gICAgICB3aGlsZSAhYzIgYW5kIGFjY1N1bVtkMiAtIDFdXHJcbiAgICAgICAgYzIgPSByZXZlcnNlU3VtWy0tZDJdXHJcblxyXG4gICAgICB2Ym94MVtkaW0yXSA9IGQyXHJcbiAgICAgIHZib3gyW2RpbTFdID0gZDIgKyAxXHJcbiAgICAgICMgdmJveC5pbnZhbGlkYXRlKClcclxuXHJcbiAgICAgIHJldHVybiBbdmJveDEsIHZib3gyXVxyXG5cclxuICAgIGRvQ3V0IG1heGRcclxuXHJcbiAgY29udGFpbnM6IChwKSAtPlxyXG4gICAgciA9IHBbMF0+PlJTSElGVFxyXG4gICAgZyA9IHBbMV0+PlJTSElGVFxyXG4gICAgYiA9IHBbMl0+PlJTSElGVFxyXG5cclxuICAgIHIgPj0gQHIxIGFuZCByIDw9IEByMiBhbmQgZyA+PSBAZzEgYW5kIGcgPD0gQGcyIGFuZCBiID49IEBiMSBhbmQgYiA8PSBAYjJcclxuIiwibW9kdWxlLmV4cG9ydHMgPVxyXG5jbGFzcyBRdWFudGl6ZXJcclxuICBpbml0aWFsaXplOiAocGl4ZWxzLCBvcHRzKSAtPlxyXG5cclxuICBnZXRRdWFudGl6ZWRDb2xvcnM6IC0+XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5NTUNRID0gcmVxdWlyZSgnLi9tbWNxJylcclxuIiwiU3dhdGNoID0gcmVxdWlyZSgnLi4vc3dhdGNoJylcclxuUXVhbnRpemVyID0gcmVxdWlyZSgnLi9pbmRleCcpXHJcbk1NQ1FJbXBsID0gcmVxdWlyZSgnLi9pbXBsL21tY3EnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG5jbGFzcyBNTUNRIGV4dGVuZHMgUXVhbnRpemVyXHJcbiAgaW5pdGlhbGl6ZTogKHBpeGVscywgQG9wdHMpIC0+XHJcbiAgICBtbWNxID0gbmV3IE1NQ1FJbXBsKClcclxuICAgIEBzd2F0Y2hlcyA9IG1tY3EucXVhbnRpemUgcGl4ZWxzLCBAb3B0c1xyXG5cclxuICBnZXRRdWFudGl6ZWRDb2xvcnM6IC0+XHJcbiAgICBAc3dhdGNoZXNcclxuIiwidXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpXG4jIyNcbiAgRnJvbSBWaWJyYW50LmpzIGJ5IEphcmkgWndhcnRzXG4gIFBvcnRlZCB0byBub2RlLmpzIGJ5IEFLRmlzaFxuXG4gIFN3YXRjaCBjbGFzc1xuIyMjXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTd2F0Y2hcbiAgaHNsOiB1bmRlZmluZWRcbiAgcmdiOiB1bmRlZmluZWRcbiAgcG9wdWxhdGlvbjogMVxuICB5aXE6IDBcblxuICBjb25zdHJ1Y3RvcjogKHJnYiwgcG9wdWxhdGlvbikgLT5cbiAgICBAcmdiID0gcmdiXG4gICAgQHBvcHVsYXRpb24gPSBwb3B1bGF0aW9uXG5cbiAgZ2V0SHNsOiAtPlxuICAgIGlmIG5vdCBAaHNsXG4gICAgICBAaHNsID0gdXRpbC5yZ2JUb0hzbCBAcmdiWzBdLCBAcmdiWzFdLCBAcmdiWzJdXG4gICAgZWxzZSBAaHNsXG5cbiAgZ2V0UG9wdWxhdGlvbjogLT5cbiAgICBAcG9wdWxhdGlvblxuXG4gIGdldFJnYjogLT5cbiAgICBAcmdiXG5cbiAgZ2V0SGV4OiAtPlxuICAgIHV0aWwucmdiVG9IZXgoQHJnYlswXSwgQHJnYlsxXSwgQHJnYlsyXSlcblxuICBnZXRUaXRsZVRleHRDb2xvcjogLT5cbiAgICBAX2Vuc3VyZVRleHRDb2xvcnMoKVxuICAgIGlmIEB5aXEgPCAyMDAgdGhlbiBcIiNmZmZcIiBlbHNlIFwiIzAwMFwiXG5cbiAgZ2V0Qm9keVRleHRDb2xvcjogLT5cbiAgICBAX2Vuc3VyZVRleHRDb2xvcnMoKVxuICAgIGlmIEB5aXEgPCAxNTAgdGhlbiBcIiNmZmZcIiBlbHNlIFwiIzAwMFwiXG5cbiAgX2Vuc3VyZVRleHRDb2xvcnM6IC0+XG4gICAgaWYgbm90IEB5aXEgdGhlbiBAeWlxID0gKEByZ2JbMF0gKiAyOTkgKyBAcmdiWzFdICogNTg3ICsgQHJnYlsyXSAqIDExNCkgLyAxMDAwXG4iLCJERUxUQUU5NCA9XG4gIE5BOiAwXG4gIFBFUkZFQ1Q6IDFcbiAgQ0xPU0U6IDJcbiAgR09PRDogMTBcbiAgU0lNSUxBUjogNTBcblxuU0lHQklUUyA9IDVcblJTSElGVCA9IDggLSBTSUdCSVRTXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNsb25lOiAobykgLT5cbiAgICBpZiB0eXBlb2YgbyA9PSAnb2JqZWN0J1xuICAgICAgaWYgQXJyYXkuaXNBcnJheSBvXG4gICAgICAgIHJldHVybiBvLm1hcCAodikgPT4gdGhpcy5jbG9uZSB2XG4gICAgICBlbHNlXG4gICAgICAgIF9vID0ge31cbiAgICAgICAgZm9yIGtleSwgdmFsdWUgb2Ygb1xuICAgICAgICAgIF9vW2tleV0gPSB0aGlzLmNsb25lIHZhbHVlXG4gICAgICAgIHJldHVybiBfb1xuICAgIG9cblxuICBkZWZhdWx0czogKCkgLT5cbiAgICBvID0ge31cbiAgICBmb3IgX28gaW4gYXJndW1lbnRzXG4gICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBfb1xuICAgICAgICBpZiBub3Qgb1trZXldPyB0aGVuIG9ba2V5XSA9IHRoaXMuY2xvbmUgdmFsdWVcblxuICAgIG9cblxuICBoZXhUb1JnYjogKGhleCkgLT5cbiAgICBtID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleClcbiAgICBpZiBtP1xuICAgICAgcmV0dXJuIFttWzFdLCBtWzJdLCBtWzNdXS5tYXAgKHMpIC0+IHBhcnNlSW50KHMsIDE2KVxuICAgIHJldHVybiBudWxsXG5cbiAgcmdiVG9IZXg6IChyLCBnLCBiKSAtPlxuICAgIFwiI1wiICsgKCgxIDw8IDI0KSArIChyIDw8IDE2KSArIChnIDw8IDgpICsgYikudG9TdHJpbmcoMTYpLnNsaWNlKDEsIDcpXG5cbiAgcmdiVG9Ic2w6IChyLCBnLCBiKSAtPlxuICAgIHIgLz0gMjU1XG4gICAgZyAvPSAyNTVcbiAgICBiIC89IDI1NVxuICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpXG4gICAgbWluID0gTWF0aC5taW4ociwgZywgYilcbiAgICBoID0gdW5kZWZpbmVkXG4gICAgcyA9IHVuZGVmaW5lZFxuICAgIGwgPSAobWF4ICsgbWluKSAvIDJcbiAgICBpZiBtYXggPT0gbWluXG4gICAgICBoID0gcyA9IDBcbiAgICAgICMgYWNocm9tYXRpY1xuICAgIGVsc2VcbiAgICAgIGQgPSBtYXggLSBtaW5cbiAgICAgIHMgPSBpZiBsID4gMC41IHRoZW4gZCAvICgyIC0gbWF4IC0gbWluKSBlbHNlIGQgLyAobWF4ICsgbWluKVxuICAgICAgc3dpdGNoIG1heFxuICAgICAgICB3aGVuIHJcbiAgICAgICAgICBoID0gKGcgLSBiKSAvIGQgKyAoaWYgZyA8IGIgdGhlbiA2IGVsc2UgMClcbiAgICAgICAgd2hlbiBnXG4gICAgICAgICAgaCA9IChiIC0gcikgLyBkICsgMlxuICAgICAgICB3aGVuIGJcbiAgICAgICAgICBoID0gKHIgLSBnKSAvIGQgKyA0XG4gICAgICBoIC89IDZcbiAgICBbaCwgcywgbF1cblxuICBoc2xUb1JnYjogKGgsIHMsIGwpIC0+XG4gICAgciA9IHVuZGVmaW5lZFxuICAgIGcgPSB1bmRlZmluZWRcbiAgICBiID0gdW5kZWZpbmVkXG5cbiAgICBodWUycmdiID0gKHAsIHEsIHQpIC0+XG4gICAgICBpZiB0IDwgMFxuICAgICAgICB0ICs9IDFcbiAgICAgIGlmIHQgPiAxXG4gICAgICAgIHQgLT0gMVxuICAgICAgaWYgdCA8IDEgLyA2XG4gICAgICAgIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0XG4gICAgICBpZiB0IDwgMSAvIDJcbiAgICAgICAgcmV0dXJuIHFcbiAgICAgIGlmIHQgPCAyIC8gM1xuICAgICAgICByZXR1cm4gcCArIChxIC0gcCkgKiAoMiAvIDMgLSB0KSAqIDZcbiAgICAgIHBcblxuICAgIGlmIHMgPT0gMFxuICAgICAgciA9IGcgPSBiID0gbFxuICAgICAgIyBhY2hyb21hdGljXG4gICAgZWxzZVxuICAgICAgcSA9IGlmIGwgPCAwLjUgdGhlbiBsICogKDEgKyBzKSBlbHNlIGwgKyBzIC0gKGwgKiBzKVxuICAgICAgcCA9IDIgKiBsIC0gcVxuICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEgLyAzKVxuICAgICAgZyA9IGh1ZTJyZ2IocCwgcSwgaClcbiAgICAgIGIgPSBodWUycmdiKHAsIHEsIGggLSAoMSAvIDMpKVxuICAgIFtcbiAgICAgIHIgKiAyNTVcbiAgICAgIGcgKiAyNTVcbiAgICAgIGIgKiAyNTVcbiAgICBdXG5cbiAgcmdiVG9YeXo6IChyLCBnLCBiKSAtPlxuICAgIHIgLz0gMjU1XG4gICAgZyAvPSAyNTVcbiAgICBiIC89IDI1NVxuICAgIHIgPSBpZiByID4gMC4wNDA0NSB0aGVuIE1hdGgucG93KChyICsgMC4wMDUpIC8gMS4wNTUsIDIuNCkgZWxzZSByIC8gMTIuOTJcbiAgICBnID0gaWYgZyA+IDAuMDQwNDUgdGhlbiBNYXRoLnBvdygoZyArIDAuMDA1KSAvIDEuMDU1LCAyLjQpIGVsc2UgZyAvIDEyLjkyXG4gICAgYiA9IGlmIGIgPiAwLjA0MDQ1IHRoZW4gTWF0aC5wb3coKGIgKyAwLjAwNSkgLyAxLjA1NSwgMi40KSBlbHNlIGIgLyAxMi45MlxuXG4gICAgciAqPSAxMDBcbiAgICBnICo9IDEwMFxuICAgIGIgKj0gMTAwXG5cbiAgICB4ID0gciAqIDAuNDEyNCArIGcgKiAwLjM1NzYgKyBiICogMC4xODA1XG4gICAgeSA9IHIgKiAwLjIxMjYgKyBnICogMC43MTUyICsgYiAqIDAuMDcyMlxuICAgIHogPSByICogMC4wMTkzICsgZyAqIDAuMTE5MiArIGIgKiAwLjk1MDVcblxuICAgIFt4LCB5LCB6XVxuXG4gIHh5elRvQ0lFTGFiOiAoeCwgeSwgeikgLT5cbiAgICBSRUZfWCA9IDk1LjA0N1xuICAgIFJFRl9ZID0gMTAwXG4gICAgUkVGX1ogPSAxMDguODgzXG5cbiAgICB4IC89IFJFRl9YXG4gICAgeSAvPSBSRUZfWVxuICAgIHogLz0gUkVGX1pcblxuICAgIHggPSBpZiB4ID4gMC4wMDg4NTYgdGhlbiBNYXRoLnBvdyh4LCAxLzMpIGVsc2UgNy43ODcgKiB4ICsgMTYgLyAxMTZcbiAgICB5ID0gaWYgeSA+IDAuMDA4ODU2IHRoZW4gTWF0aC5wb3coeSwgMS8zKSBlbHNlIDcuNzg3ICogeSArIDE2IC8gMTE2XG4gICAgeiA9IGlmIHogPiAwLjAwODg1NiB0aGVuIE1hdGgucG93KHosIDEvMykgZWxzZSA3Ljc4NyAqIHogKyAxNiAvIDExNlxuXG4gICAgTCA9IDExNiAqIHkgLSAxNlxuICAgIGEgPSA1MDAgKiAoeCAtIHkpXG4gICAgYiA9IDIwMCAqICh5IC0geilcblxuICAgIFtMLCBhLCBiXVxuXG4gIHJnYlRvQ0lFTGFiOiAociwgZywgYikgLT5cbiAgICBbeCwgeSwgel0gPSB0aGlzLnJnYlRvWHl6IHIsIGcsIGJcbiAgICB0aGlzLnh5elRvQ0lFTGFiIHgsIHksIHpcblxuICBkZWx0YUU5NDogKGxhYjEsIGxhYjIpIC0+XG4gICAgIyBXZWlnaHRzXG4gICAgV0VJR0hUX0wgPSAxXG4gICAgV0VJR0hUX0MgPSAxXG4gICAgV0VJR0hUX0ggPSAxXG5cbiAgICBbTDEsIGExLCBiMV0gPSBsYWIxXG4gICAgW0wyLCBhMiwgYjJdID0gbGFiMlxuICAgIGRMID0gTDEgLSBMMlxuICAgIGRhID0gYTEgLSBhMlxuICAgIGRiID0gYjEgLSBiMlxuXG4gICAgeEMxID0gTWF0aC5zcXJ0IGExICogYTEgKyBiMSAqIGIxXG4gICAgeEMyID0gTWF0aC5zcXJ0IGEyICogYTIgKyBiMiAqIGIyXG5cbiAgICB4REwgPSBMMiAtIEwxXG4gICAgeERDID0geEMyIC0geEMxXG4gICAgeERFID0gTWF0aC5zcXJ0IGRMICogZEwgKyBkYSAqIGRhICsgZGIgKiBkYlxuXG4gICAgaWYgTWF0aC5zcXJ0KHhERSkgPiBNYXRoLnNxcnQoTWF0aC5hYnMoeERMKSkgKyBNYXRoLnNxcnQoTWF0aC5hYnMoeERDKSlcbiAgICAgIHhESCA9IE1hdGguc3FydCB4REUgKiB4REUgLSB4REwgKiB4REwgLSB4REMgKiB4RENcbiAgICBlbHNlXG4gICAgICB4REggPSAwXG5cbiAgICB4U0MgPSAxICsgMC4wNDUgKiB4QzFcbiAgICB4U0ggPSAxICsgMC4wMTUgKiB4QzFcblxuICAgIHhETCAvPSBXRUlHSFRfTFxuICAgIHhEQyAvPSBXRUlHSFRfQyAqIHhTQ1xuICAgIHhESCAvPSBXRUlHSFRfSCAqIHhTSFxuXG4gICAgTWF0aC5zcXJ0IHhETCAqIHhETCArIHhEQyAqIHhEQyArIHhESCAqIHhESFxuXG4gIHJnYkRpZmY6IChyZ2IxLCByZ2IyKSAtPlxuICAgIGxhYjEgPSBAcmdiVG9DSUVMYWIuYXBwbHkgQCwgcmdiMVxuICAgIGxhYjIgPSBAcmdiVG9DSUVMYWIuYXBwbHkgQCwgcmdiMlxuICAgIEBkZWx0YUU5NCBsYWIxLCBsYWIyXG5cbiAgaGV4RGlmZjogKGhleDEsIGhleDIpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcIkNvbXBhcmUgI3toZXgxfSAje2hleDJ9XCJcbiAgICByZ2IxID0gQGhleFRvUmdiIGhleDFcbiAgICByZ2IyID0gQGhleFRvUmdiIGhleDJcbiAgICAjIGNvbnNvbGUubG9nIHJnYjFcbiAgICAjIGNvbnNvbGUubG9nIHJnYjJcbiAgICBAcmdiRGlmZiByZ2IxLCByZ2IyXG5cbiAgREVMVEFFOTRfRElGRl9TVEFUVVM6IERFTFRBRTk0XG5cbiAgZ2V0Q29sb3JEaWZmU3RhdHVzOiAoZCkgLT5cbiAgICBpZiBkIDwgREVMVEFFOTQuTkFcbiAgICAgIHJldHVybiBcIk4vQVwiXG4gICAgIyBOb3QgcGVyY2VwdGlibGUgYnkgaHVtYW4gZXllc1xuICAgIGlmIGQgPD0gREVMVEFFOTQuUEVSRkVDVFxuICAgICAgcmV0dXJuIFwiUGVyZmVjdFwiXG4gICAgIyBQZXJjZXB0aWJsZSB0aHJvdWdoIGNsb3NlIG9ic2VydmF0aW9uXG4gICAgaWYgZCA8PSBERUxUQUU5NC5DTE9TRVxuICAgICAgcmV0dXJuIFwiQ2xvc2VcIlxuICAgICMgUGVyY2VwdGlibGUgYXQgYSBnbGFuY2VcbiAgICBpZiBkIDw9IERFTFRBRTk0LkdPT0RcbiAgICAgIHJldHVybiBcIkdvb2RcIlxuICAgICMgQ29sb3JzIGFyZSBtb3JlIHNpbWlsYXIgdGhhbiBvcHBvc2l0ZVxuICAgIGlmIGQgPCBERUxUQUU5NC5TSU1JTEFSXG4gICAgICByZXR1cm4gXCJTaW1pbGFyXCJcbiAgICByZXR1cm4gXCJXcm9uZ1wiXG5cbiAgU0lHQklUUzogU0lHQklUU1xuICBSU0hJRlQ6IFJTSElGVFxuICBnZXRDb2xvckluZGV4OiAociwgZywgYikgLT5cbiAgICAocjw8KDIqU0lHQklUUykpICsgKGcgPDwgU0lHQklUUykgKyBiXG4iLCIjIyNcbiAgRnJvbSBWaWJyYW50LmpzIGJ5IEphcmkgWndhcnRzXG4gIFBvcnRlZCB0byBub2RlLmpzIGJ5IEFLRmlzaFxuXG4gIENvbG9yIGFsZ29yaXRobSBjbGFzcyB0aGF0IGZpbmRzIHZhcmlhdGlvbnMgb24gY29sb3JzIGluIGFuIGltYWdlLlxuXG4gIENyZWRpdHNcbiAgLS0tLS0tLS1cbiAgTG9rZXNoIERoYWthciAoaHR0cDovL3d3dy5sb2tlc2hkaGFrYXIuY29tKSAtIENyZWF0ZWQgQ29sb3JUaGllZlxuICBHb29nbGUgLSBQYWxldHRlIHN1cHBvcnQgbGlicmFyeSBpbiBBbmRyb2lkXG4jIyNcblN3YXRjaCA9IHJlcXVpcmUoJy4vc3dhdGNoJylcbnV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKVxuRGVmYXVsdEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vZ2VuZXJhdG9yJykuRGVmYXVsdFxuRmlsdGVyID0gcmVxdWlyZSgnLi9maWx0ZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBWaWJyYW50XG4gIEBEZWZhdWx0T3B0czpcbiAgICBjb2xvckNvdW50OiA2NFxuICAgIHF1YWxpdHk6IDVcbiAgICBnZW5lcmF0b3I6IG5ldyBEZWZhdWx0R2VuZXJhdG9yKClcbiAgICBJbWFnZTogbnVsbFxuICAgIFF1YW50aXplcjogcmVxdWlyZSgnLi9xdWFudGl6ZXInKS5NTUNRXG4gICAgZmlsdGVyczogW11cblxuICBAZnJvbTogKHNyYykgLT5cbiAgICBuZXcgQnVpbGRlcihzcmMpXG5cbiAgcXVhbnRpemU6IHJlcXVpcmUoJ3F1YW50aXplJylcblxuICBfc3dhdGNoZXM6IFtdXG5cbiAgY29uc3RydWN0b3I6IChAc291cmNlSW1hZ2UsIG9wdHMgPSB7fSkgLT5cbiAgICBAb3B0cyA9IHV0aWwuZGVmYXVsdHMob3B0cywgQGNvbnN0cnVjdG9yLkRlZmF1bHRPcHRzKVxuICAgIEBnZW5lcmF0b3IgPSBAb3B0cy5nZW5lcmF0b3JcblxuICBnZXRQYWxldHRlOiAoY2IpIC0+XG4gICAgaW1hZ2UgPSBuZXcgQG9wdHMuSW1hZ2UgQHNvdXJjZUltYWdlLCAoZXJyLCBpbWFnZSkgPT5cbiAgICAgIGlmIGVycj8gdGhlbiByZXR1cm4gY2IoZXJyKVxuICAgICAgdHJ5XG4gICAgICAgIEBfcHJvY2VzcyBpbWFnZSwgQG9wdHNcbiAgICAgICAgY2IgbnVsbCwgQHN3YXRjaGVzKClcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIHJldHVybiBjYihlcnJvcilcblxuICBnZXRTd2F0Y2hlczogKGNiKSAtPlxuICAgIEBnZXRQYWxldHRlIGNiXG5cbiAgX3Byb2Nlc3M6IChpbWFnZSwgb3B0cykgLT5cbiAgICBpbWFnZS5zY2FsZURvd24oQG9wdHMpXG4gICAgaW1hZ2VEYXRhID0gaW1hZ2UuZ2V0SW1hZ2VEYXRhKClcblxuICAgIHF1YW50aXplciA9IG5ldyBAb3B0cy5RdWFudGl6ZXIoKVxuICAgIHF1YW50aXplci5pbml0aWFsaXplKGltYWdlRGF0YS5kYXRhLCBAb3B0cylcblxuICAgIHN3YXRjaGVzID0gcXVhbnRpemVyLmdldFF1YW50aXplZENvbG9ycygpXG5cbiAgICBAZ2VuZXJhdG9yLmdlbmVyYXRlKHN3YXRjaGVzKVxuICAgICMgQ2xlYW4gdXBcbiAgICBpbWFnZS5yZW1vdmVDYW52YXMoKVxuXG4gIHN3YXRjaGVzOiA9PlxuICAgIFZpYnJhbnQ6ICAgICAgQGdlbmVyYXRvci5nZXRWaWJyYW50U3dhdGNoKClcbiAgICBNdXRlZDogICAgICAgIEBnZW5lcmF0b3IuZ2V0TXV0ZWRTd2F0Y2goKVxuICAgIERhcmtWaWJyYW50OiAgQGdlbmVyYXRvci5nZXREYXJrVmlicmFudFN3YXRjaCgpXG4gICAgRGFya011dGVkOiAgICBAZ2VuZXJhdG9yLmdldERhcmtNdXRlZFN3YXRjaCgpXG4gICAgTGlnaHRWaWJyYW50OiBAZ2VuZXJhdG9yLmdldExpZ2h0VmlicmFudFN3YXRjaCgpXG4gICAgTGlnaHRNdXRlZDogICBAZ2VuZXJhdG9yLmdldExpZ2h0TXV0ZWRTd2F0Y2goKVxuXG5tb2R1bGUuZXhwb3J0cy5CdWlsZGVyID1cbmNsYXNzIEJ1aWxkZXJcbiAgY29uc3RydWN0b3I6IChAc3JjLCBAb3B0cyA9IHt9KSAtPlxuICAgIEBvcHRzLmZpbHRlcnMgPSB1dGlsLmNsb25lIFZpYnJhbnQuRGVmYXVsdE9wdHMuZmlsdGVyc1xuXG4gIG1heENvbG9yQ291bnQ6IChuKSAtPlxuICAgIEBvcHRzLmNvbG9yQ291bnQgPSBuXG4gICAgQFxuXG4gIG1heERpbWVuc2lvbjogKGQpIC0+XG4gICAgQG9wdHMubWF4RGltZW5zaW9uID0gZFxuICAgIEBcblxuICBhZGRGaWx0ZXI6IChmKSAtPlxuICAgIGlmIHR5cGVvZiBmID09ICdmdW5jdGlvbidcbiAgICAgIEBvcHRzLmZpbHRlcnMucHVzaCBmXG4gICAgQFxuXG4gIHJlbW92ZUZpbHRlcjogKGYpIC0+XG4gICAgaWYgKGkgPSBAb3B0cy5maWx0ZXJzLmluZGV4T2YoZikpID4gMFxuICAgICAgQG9wdHMuZmlsdGVycy5zcGxpY2UoaSlcbiAgICBAXG5cbiAgY2xlYXJGaWx0ZXJzOiAtPlxuICAgIEBvcHRzLmZpbHRlcnMgPSBbXVxuICAgIEBcblxuICBxdWFsaXR5OiAocSkgLT5cbiAgICBAb3B0cy5xdWFsaXR5ID0gcVxuICAgIEBcblxuICB1c2VJbWFnZTogKGltYWdlKSAtPlxuICAgIEBvcHRzLkltYWdlID0gaW1hZ2VcbiAgICBAXG5cbiAgdXNlR2VuZXJhdG9yOiAoZ2VuZXJhdG9yKSAtPlxuICAgIEBvcHRzLmdlbmVyYXRvciA9IGdlbmVyYXRvclxuICAgIEBcblxuICB1c2VRdWFudGl6ZXI6IChxdWFudGl6ZXIpIC0+XG4gICAgQG9wdHMuUXVhbnRpemVyID0gcXVhbnRpemVyXG4gICAgQFxuXG4gIGJ1aWxkOiAtPlxuICAgIGlmIG5vdCBAdj9cbiAgICAgIEB2ID0gbmV3IFZpYnJhbnQoQHNyYywgQG9wdHMpXG4gICAgQHZcblxuICBnZXRTd2F0Y2hlczogKGNiKSAtPlxuICAgIEBidWlsZCgpLmdldFBhbGV0dGUgY2JcblxuICBnZXRQYWxldHRlOiAoY2IpIC0+XG4gICAgQGJ1aWxkKCkuZ2V0UGFsZXR0ZSBjYlxuXG4gIGZyb206IChzcmMpIC0+XG4gICAgbmV3IFZpYnJhbnQoc3JjLCBAb3B0cylcblxubW9kdWxlLmV4cG9ydHMuVXRpbCA9IHV0aWxcbm1vZHVsZS5leHBvcnRzLlN3YXRjaCA9IFN3YXRjaFxubW9kdWxlLmV4cG9ydHMuUXVhbnRpemVyID0gcmVxdWlyZSgnLi9xdWFudGl6ZXIvJylcbm1vZHVsZS5leHBvcnRzLkdlbmVyYXRvciA9IHJlcXVpcmUoJy4vZ2VuZXJhdG9yLycpXG5tb2R1bGUuZXhwb3J0cy5GaWx0ZXIgPSByZXF1aXJlKCcuL2ZpbHRlci8nKVxuIl19
