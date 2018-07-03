/* global window: false */
'use strict';

var defaults = require('./core.defaults');

var helpers = require('../helpers/index');

defaults._set('global', {
  animation: {
    duration: 1000,
    easing: 'easeOutQuart',
    onProgress: helpers.noop,
    onComplete: helpers.noop
  }
});

module.exports = {
  frameDuration: 17,
  animations: [],
  dropFrames: 0,
  request: null,

  /**
   * @param {Chart} chart - The chart to animate.
   * @param {Chart.Animation} animation - The animation that we will animate.
   * @param {Number} duration - The animation duration in ms.
   * @param {Boolean} lazy - if true, the chart is not marked as animating to enable more responsive interactions
   */
  addAnimation: function () {},
  cancelAnimation: function () {},
  requestAnimationFrame: function () {},

  /**
   * @private
   */
  startDigest: function () {},

  /**
   * @private
   */
  advance: function () {}
};