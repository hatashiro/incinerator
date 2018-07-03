'use strict';

var defaults = require('../core/core.defaults');

var Element = require('../core/core.element');

defaults._set('global', {
  elements: {
    arc: {
      backgroundColor: defaults.global.defaultColor,
      borderColor: '#fff',
      borderWidth: 2
    }
  }
});

module.exports = Element.extend({
  inLabelRange: function () {},
  inRange: function () {},
  getCenterPoint: function () {},
  getArea: function () {},
  tooltipPosition: function () {},
  draw: function () {}
});
