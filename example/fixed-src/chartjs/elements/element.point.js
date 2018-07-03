'use strict';

var defaults = require('../core/core.defaults');

var Element = require('../core/core.element');

var helpers = require('../helpers/index');

var defaultColor = defaults.global.defaultColor;

defaults._set('global', {
  elements: {
    point: {
      radius: 3,
      pointStyle: 'circle',
      backgroundColor: defaultColor,
      borderColor: defaultColor,
      borderWidth: 1,
      // Hover
      hitRadius: 1,
      hoverRadius: 4,
      hoverBorderWidth: 1
    }
  }
});

module.exports = Element.extend({
  inRange: function () {},
  getCenterPoint: function () {},
  getArea: function () {},
  tooltipPosition: function () {},
  draw: function (chartArea) {
    var vm = this._view;
    var model = this._model;
    var ctx = this._chart.ctx;
    var pointStyle = vm.pointStyle;
    var radius = vm.radius;
    var x = vm.x;
    var y = vm.y;
    var errMargin = 1.01; // 1.01 is margin for Accumulated error. (Especially Edge, IE.)

    if (vm.skip) {
      return;
    } // Clipping for Points.


    if (chartArea === undefined || model.x >= chartArea.left && chartArea.right * errMargin >= model.x && model.y >= chartArea.top && chartArea.bottom * errMargin >= model.y) {
      ctx.strokeStyle = vm.borderColor || defaultColor;
      ctx.lineWidth = helpers.valueOrDefault(vm.borderWidth, defaults.global.elements.point.borderWidth);
      ctx.fillStyle = vm.backgroundColor || defaultColor;
      helpers.canvas.drawPoint(ctx, pointStyle, radius, x, y);
    }
  }
});
