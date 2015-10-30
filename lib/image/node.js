var Image, Jimp, JimpImage, ProtocolHandler, URL_REGEX,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Image = require('./index');

Jimp = require('jimp');

URL_REGEX = /^(\w+):\/\/.*/i;

ProtocolHandler = {
  http: require('http'),
  https: require('https')
};

JimpImage = (function(superClass) {
  extend(JimpImage, superClass);

  function JimpImage(path, cb) {
    var handler, m, protocol;
    m = URL_REGEX.exec(path);
    if (m) {
      protocol = m[1].toLowerCase();
      handler = ProtocolHandler[protocol];
      if (handler == null) {
        throw new Error("Unsupported protocol: '" + protocol + "'");
      }
      handler.get(path, (function(_this) {
        return function(r) {
          var buff;
          buff = new Buffer('');
          r.on('data', function(data) {
            return buff = Buffer.concat([buff, data]);
          });
          return r.on('end', function() {
            return new Jimp(buff, function(err, image) {
              if (err != null) {
                return typeof cb === "function" ? cb(err) : void 0;
              }
              _this.img = image;
              return typeof cb === "function" ? cb(null, _this) : void 0;
            });
          });
        };
      })(this));
    } else {
      new Jimp(path, (function(_this) {
        return function(err, image) {
          if (err != null) {
            return typeof cb === "function" ? cb(err) : void 0;
          }
          _this.img = image;
          return typeof cb === "function" ? cb(null, _this) : void 0;
        };
      })(this));
    }
  }

  JimpImage.prototype.clear = function() {};

  JimpImage.prototype.update = function(imageData) {};

  JimpImage.prototype.getWidth = function() {
    return this.img.bitmap.width;
  };

  JimpImage.prototype.getHeight = function() {
    return this.img.bitmap.height;
  };

  JimpImage.prototype.resize = function(w, h) {
    return this.img.resize(w, h);
  };

  JimpImage.prototype.getPixelCount = function() {
    return this.img.bitmap.width * this.img.bitmap.height;
  };

  JimpImage.prototype.getImageData = function() {
    return {
      data: this.img.bitmap.data
    };
  };

  JimpImage.prototype.removeCanvas = function() {};

  return JimpImage;

})(Image);

module.exports = JimpImage;
