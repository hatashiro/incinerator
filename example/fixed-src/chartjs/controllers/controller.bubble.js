'use strict';

var defaults = require('../core/core.defaults');

var elements = require('../elements/index');

defaults._set('bubble', {
  hover: {
    mode: 'single'
  },
  scales: {
    xAxes: [{
      type: 'linear',
      // bubble should probably use a linear scale by default
      position: 'bottom',
      id: 'x-axis-0' // need an ID so datasets can reference the scale

    }],
    yAxes: [{
      type: 'linear',
      position: 'left',
      id: 'y-axis-0'
    }]
  },
  tooltips: {
    callbacks: {
      title: function () {},
      label: function () {}
    }
  }
});

module.exports = function (Chart) {
  Chart.controllers.bubble = Chart.DatasetController.extend({
    /**
     * @protected
     */
    dataElementType: elements.Point,

    /**
     * @protected
     */
    update: function () {},

    /**
     * @protected
     */
    updateElement: function () {},

    /**
     * @protected
     */
    setHoverStyle: function () {},

    /**
     * @private
     */
    _resolveElementOptions: function () {}
  });
};
