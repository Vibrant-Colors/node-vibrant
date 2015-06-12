var Image, isBrowser,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

isBrowser = indexOf.call(this, 'window') >= 0 && indexOf.call(this, 'Window') >= 0 && window instanceof Window;

Image = isBrowser ? require('./browser-image') : require('./node-image');

module.exports = {
  Image: Image,
  isBrowser: isBrowser
};
