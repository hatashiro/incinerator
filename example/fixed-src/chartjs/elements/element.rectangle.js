'use strict';

var defaults = require('../core/core.defaults');

var Element = require('../core/core.element');

defaults._set('global', {
  elements: {
    rectangle: {
      backgroundColor: defaults.global.defaultColor,
      borderColor: defaults.global.defaultColor,
      borderSkipped: 'bottom',
      borderWidth: 0
    }
  }
});

module.exports = Element.extend({
  draw: function () {},
  height: function () {},
  inRange: function () {},
  inLabelRange: function () {},
  inXRange: function () {},
  inYRange: function () {},
  getCenterPoint: function () {},
  getArea: function () {},
  tooltipPosition: function () {}
});