'use strict';

var defaults = require('../core/core.defaults');

var elements = require('../elements/index');

var helpers = require('../helpers/index');

defaults._set('polarArea', {
  scale: {
    type: 'radialLinear',
    angleLines: {
      display: false
    },
    gridLines: {
      circular: true
    },
    pointLabels: {
      display: false
    },
    ticks: {
      beginAtZero: true
    }
  },
  // Boolean - Whether to animate the rotation of the chart
  animation: {
    animateRotate: true,
    animateScale: true
  },
  startAngle: -0.5 * Math.PI,
  legendCallback: function () {},
  legend: {
    labels: {
      generateLabels: function () {}
    },
    onClick: function () {}
  },
  // Need to override these to give a nice default
  tooltips: {
    callbacks: {
      title: function () {},
      label: function () {}
    }
  }
});

module.exports = function (Chart) {
  Chart.controllers.polarArea = Chart.DatasetController.extend({
    dataElementType: elements.Arc,
    linkScales: helpers.noop,
    update: function () {},

    /**
     * @private
     */
    _updateRadius: function () {},
    updateElement: function () {},
    countVisibleElements: function () {},

    /**
     * @private
     */
    _computeAngle: function () {}
  });
};