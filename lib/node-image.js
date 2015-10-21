var Image, Jimp, JimpImage,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Image = require('./image');

Jimp = require('jimp');

JimpImage = (function(superClass) {
  extend(JimpImage, superClass);

  function JimpImage(path, cb) {
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

  JimpImage.prototype.clear = function() {};

  JimpImage.prototype.update = function(imageData) {};

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
