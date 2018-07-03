/* global window: false */
'use strict';

var Scale = require('../core/core.scale');

var scaleService = require('../core/core.scaleService'); // Integer constants are from the ES6 spec.

module.exports = function () {
  var defaultConfig = {
    position: 'bottom',

    /**
     * Data distribution along the scale:
     * - 'linear': data are spread according to their time (distances can vary),
     * - 'series': data are spread at the same distance from each other.
     * @see https://github.com/chartjs/Chart.js/pull/4507
     * @since 2.7.0
     */
    distribution: 'linear',

    /**
     * Scale boundary strategy (bypassed by min/max time options)
     * - `data`: make sure data are fully visible, ticks outside are removed
     * - `ticks`: make sure ticks are fully visible, data outside are truncated
     * @see https://github.com/chartjs/Chart.js/pull/4556
     * @since 2.7.0
     */
    bounds: 'data',
    time: {
      parser: false,
      // false == a pattern string from http://momentjs.com/docs/#/parsing/string-format/ or a custom callback that converts its argument to a moment
      format: false,
      // DEPRECATED false == date objects, moment object, callback or a pattern string from http://momentjs.com/docs/#/parsing/string-format/
      unit: false,
      // false == automatic or override with week, month, year, etc.
      round: false,
      // none, or override with week, month, year, etc.
      displayFormat: false,
      // DEPRECATED
      isoWeekday: false,
      // override week start day - see http://momentjs.com/docs/#/get-set/iso-weekday/
      minUnit: 'millisecond',
      // defaults to unit's corresponding unitFormat below or override using pattern string from http://momentjs.com/docs/#/displaying/format/
      displayFormats: {
        millisecond: 'h:mm:ss.SSS a',
        // 11:20:01.123 AM,
        second: 'h:mm:ss a',
        // 11:20:01 AM
        minute: 'h:mm a',
        // 11:20 AM
        hour: 'hA',
        // 5PM
        day: 'MMM D',
        // Sep 4
        week: 'll',
        // Week 46, or maybe "[W]WW - YYYY" ?
        month: 'MMM YYYY',
        // Sept 2015
        quarter: '[Q]Q - YYYY',
        // Q3
        year: 'YYYY' // 2015

      }
    },
    ticks: {
      autoSkip: false,

      /**
       * Ticks generation input values:
       * - 'auto': generates "optimal" ticks based on scale size and time options.
       * - 'data': generates ticks from data (including labels from data {t|x|y} objects).
       * - 'labels': generates ticks from user given `data.labels` values ONLY.
       * @see https://github.com/chartjs/Chart.js/pull/4507
       * @since 2.7.0
       */
      source: 'auto',
      major: {
        enabled: false
      }
    }
  };
  var TimeScale = Scale.extend({
    initialize: function () {},
    update: function () {},

    /**
     * Allows data to be referenced via 't' attribute
     */
    getRightValue: function () {},
    determineDataLimits: function () {},
    buildTicks: function () {},
    getLabelForIndex: function () {},

    /**
     * Function to format an individual tick mark
     * @private
     */
    tickFormatFunction: function () {},
    convertTicksToLabels: function () {},

    /**
     * @private
     */
    getPixelForOffset: function () {},
    getPixelForValue: function () {},
    getPixelForTick: function () {},
    getValueForPixel: function () {},

    /**
     * Crude approximation of what the label width might be
     * @private
     */
    getLabelWidth: function () {},

    /**
     * @private
     */
    getLabelCapacity: function () {}
  });
  scaleService.registerScaleType('time', TimeScale, defaultConfig);
};
