'use strict';

var scaleService = require('../core/core.scaleService');

var Ticks = require('../core/core.ticks');

module.exports = function (Chart) {
  var defaultConfig = {
    position: 'left',
    ticks: {
      callback: Ticks.formatters.linear
    }
  };
  var LinearScale = Chart.LinearScaleBase.extend({
    determineDataLimits: function () {},
    getTickLimit: function () {},
    // Called after the ticks are built. We need
    handleDirectionalChanges: function () {},
    getLabelForIndex: function () {},
    // Utils
    getPixelForValue: function () {},
    getValueForPixel: function () {},
    getPixelForTick: function () {}
  });
  scaleService.registerScaleType('linear', LinearScale, defaultConfig);
};
