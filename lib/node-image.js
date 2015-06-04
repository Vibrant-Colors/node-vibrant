var Image, NodeImage,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Image = require('./image');

module["export"] = NodeImage = (function(superClass) {
  extend(NodeImage, superClass);

  function NodeImage() {
    return NodeImage.__super__.constructor.apply(this, arguments);
  }

  return NodeImage;

})(Image);
