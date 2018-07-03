'use strict';

var defaults = require('../core/core.defaults');

var elements = require('../elements/index');

defaults._set('bar', {
  hover: {
    mode: 'label'
  },
  scales: {
    xAxes: [{
      type: 'category',
      // Specific to Bar Controller
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      // offset settings
      offset: true,
      // grid line settings
      gridLines: {
        offsetGridLines: true
      }
    }],
    yAxes: [{
      type: 'linear'
    }]
  }
});

defaults._set('horizontalBar', {
  hover: {
    mode: 'index',
    axis: 'y'
  },
  scales: {
    xAxes: [{
      type: 'linear',
      position: 'bottom'
    }],
    yAxes: [{
      position: 'left',
      type: 'category',
      // Specific to Horizontal Bar Controller
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      // offset settings
      offset: true,
      // grid line settings
      gridLines: {
        offsetGridLines: true
      }
    }]
  },
  elements: {
    rectangle: {
      borderSkipped: 'left'
    }
  },
  tooltips: {
    callbacks: {
      title: function () {},
      label: function () {}
    },
    mode: 'index',
    axis: 'y'
  }
});
/**
 * Computes the "optimal" sample size to maintain bars equally sized while preventing overlap.
 * @private
 */


module.exports = function (Chart) {
  Chart.controllers.bar = Chart.DatasetController.extend({
    dataElementType: elements.Rectangle,
    initialize: function () {},
    update: function () {},
    updateElement: function () {},

    /**
     * @private
     */
    updateElementGeometry: function () {},

    /**
     * @private
     */
    getValueScaleId: function () {},

    /**
     * @private
     */
    getIndexScaleId: function () {},

    /**
     * @private
     */
    getValueScale: function () {},

    /**
     * @private
     */
    getIndexScale: function () {},

    /**
     * Returns the stacks based on groups and bar visibility.
     * @param {Number} [last] - The dataset index
     * @returns {Array} The stack list
     * @private
     */
    _getStacks: function () {},

    /**
     * Returns the effective number of stacks based on groups and bar visibility.
     * @private
     */
    getStackCount: function () {},

    /**
     * Returns the stack index for the given dataset based on groups and bar visibility.
     * @param {Number} [datasetIndex] - The dataset index
     * @param {String} [name] - The stack name to find
     * @returns {Number} The stack index
     * @private
     */
    getStackIndex: function () {},

    /**
     * @private
     */
    getRuler: function () {},

    /**
     * Note: pixel values are not clamped to the scale area.
     * @private
     */
    calculateBarValuePixels: function () {},

    /**
     * @private
     */
    calculateBarIndexPixels: function () {},
    draw: function () {}
  });
  Chart.controllers.horizontalBar = Chart.controllers.bar.extend({
    /**
     * @private
     */
    getValueScaleId: function () {},

    /**
     * @private
     */
    getIndexScaleId: function () {}
  });
};
