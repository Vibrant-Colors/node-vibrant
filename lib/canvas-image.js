var CanvasImage, Image,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Image = require('./image');


/*
  From Vibrant.js by Jari Zwarts
  Ported to node.js by AKFish

  (Browser enviroment code. Not used. For reference)

  CanvasImage Class
  Class that wraps the html image element and canvas.
  It also simplifies some of the canvas context manipulation
  with a set of helper functions.
  Stolen from https://github.com/lokesh/color-thief
 */

module.exports = CanvasImage = (function(superClass) {
  extend(CanvasImage, superClass);

  function CanvasImage(image) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.width = this.canvas.width = image.width;
    this.height = this.canvas.height = image.height;
    this.context.drawImage(image, 0, 0, this.width, this.height);
  }

  CanvasImage.prototype.clear = function() {
    return this.context.clearRect(0, 0, this.width, this.height);
  };

  CanvasImage.prototype.update = function(imageData) {
    return this.context.putImageData(imageData, 0, 0);
  };

  CanvasImage.prototype.getPixelCount = function() {
    return this.width * this.height;
  };

  CanvasImage.prototype.getImageData = function() {
    return this.context.getImageData(0, 0, this.width, this.height);
  };

  CanvasImage.prototype.removeCanvas = function() {
    return this.canvas.parentNode.removeChild(this.canvas);
  };

  return CanvasImage;

})(Image);
