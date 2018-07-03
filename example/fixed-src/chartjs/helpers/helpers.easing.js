'use strict';

var helpers = require('./helpers.core');
/**
 * Easing functions adapted from Robert Penner's easing equations.
 * @namespace Chart.helpers.easingEffects
 * @see http://www.robertpenner.com/easing/
 */


var effects = {
  linear: function () {},
  easeInQuad: function () {},
  easeOutQuad: function () {},
  easeInOutQuad: function () {},
  easeInCubic: function () {},
  easeOutCubic: function () {},
  easeInOutCubic: function () {},
  easeInQuart: function () {},
  easeOutQuart: function () {},
  easeInOutQuart: function () {},
  easeInQuint: function () {},
  easeOutQuint: function () {},
  easeInOutQuint: function () {},
  easeInSine: function () {},
  easeOutSine: function () {},
  easeInOutSine: function () {},
  easeInExpo: function () {},
  easeOutExpo: function () {},
  easeInOutExpo: function () {},
  easeInCirc: function () {},
  easeOutCirc: function () {},
  easeInOutCirc: function () {},
  easeInElastic: function () {},
  easeOutElastic: function () {},
  easeInOutElastic: function () {},
  easeInBack: function () {},
  easeOutBack: function () {},
  easeInOutBack: function () {},
  easeInBounce: function () {},
  easeOutBounce: function () {},
  easeInOutBounce: function () {}
};
module.exports = {
  effects: effects
}; // DEPRECATIONS

/**
 * Provided for backward compatibility, use Chart.helpers.easing.effects instead.
 * @function Chart.helpers.easingEffects
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */

helpers.easingEffects = effects;