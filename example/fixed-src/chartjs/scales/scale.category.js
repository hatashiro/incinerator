'use strict';

var Scale = require('../core/core.scale');

var scaleService = require('../core/core.scaleService');

module.exports = function () {
  // Default config for a category scale
  var defaultConfig = {
    position: 'bottom'
  };
  var DatasetScale = Scale.extend({
    /**
    * Internal function to get the correct labels. If data.xLabels or data.yLabels are defined, use those
    * else fall back to data.labels
    * @private
    */
    getLabels: function () {},
    determineDataLimits: function () {},
    buildTicks: function () {},
    getLabelForIndex: function () {},
    // Used to get data value locations.  Value can either be an index or a numerical value
    getPixelForValue: function () {},
    getPixelForTick: function () {},
    getValueForPixel: function () {},
    getBasePixel: function () {}
  });
  scaleService.registerScaleType('category', DatasetScale, defaultConfig);
};