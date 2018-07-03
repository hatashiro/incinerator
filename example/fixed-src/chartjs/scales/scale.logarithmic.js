'use strict';

var Scale = require('../core/core.scale');

var scaleService = require('../core/core.scaleService');

var Ticks = require('../core/core.ticks');
/**
 * Generate a set of logarithmic ticks
 * @param generationOptions the options used to generate the ticks
 * @param dataRange the range of the data
 * @returns {Array<Number>} array of tick values
 */


module.exports = function () {
  var defaultConfig = {
    position: 'left',
    // label settings
    ticks: {
      callback: Ticks.formatters.logarithmic
    }
  };
  var LogarithmicScale = Scale.extend({
    determineDataLimits: function () {},
    handleTickRangeOptions: function () {},
    buildTicks: function () {},
    convertTicksToLabels: function () {},
    // Get the correct tooltip label
    getLabelForIndex: function () {},
    getPixelForTick: function () {},

    /**
     * Returns the value of the first tick.
     * @param {Number} value - The minimum not zero value.
     * @return {Number} The first tick value.
     * @private
     */
    _getFirstTickValue: function () {},
    getPixelForValue: function () {},
    getValueForPixel: function () {}
  });
  scaleService.registerScaleType('logarithmic', LogarithmicScale, defaultConfig);
};
