'use strict';

var defaults = require('../core/core.defaults');

var elements = require('../elements/index');

defaults._set('line', {
  showLines: true,
  spanGaps: false,
  hover: {
    mode: 'label'
  },
  scales: {
    xAxes: [{
      type: 'category',
      id: 'x-axis-0'
    }],
    yAxes: [{
      type: 'linear',
      id: 'y-axis-0'
    }]
  }
});

module.exports = function (Chart) {
  Chart.controllers.line = Chart.DatasetController.extend({
    datasetElementType: elements.Line,
    dataElementType: elements.Point,
    update: function () {},
    getPointBackgroundColor: function () {},
    getPointBorderColor: function () {},
    getPointBorderWidth: function () {},
    updateElement: function () {},
    calculatePointY: function () {},
    updateBezierControlPoints: function () {},
    draw: function () {},
    setHoverStyle: function () {}
  });
};
