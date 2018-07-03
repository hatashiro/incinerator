'use strict';

var defaults = require('./core.defaults');

var Element = require('./core.element');

var helpers = require('../helpers/index');

var Ticks = require('./core.ticks');

defaults._set('scale', {
  display: true,
  position: 'left',
  offset: false,
  // grid line settings
  gridLines: {
    display: true,
    color: 'rgba(0, 0, 0, 0.1)',
    lineWidth: 1,
    drawBorder: true,
    drawOnChartArea: true,
    drawTicks: true,
    tickMarkLength: 10,
    zeroLineWidth: 1,
    zeroLineColor: 'rgba(0,0,0,0.25)',
    zeroLineBorderDash: [],
    zeroLineBorderDashOffset: 0.0,
    offsetGridLines: false,
    borderDash: [],
    borderDashOffset: 0.0
  },
  // scale label
  scaleLabel: {
    // display property
    display: false,
    // actual label
    labelString: '',
    // line height
    lineHeight: 1.2,
    // top/bottom padding
    padding: {
      top: 4,
      bottom: 4
    }
  },
  // label settings
  ticks: {
    beginAtZero: false,
    minRotation: 0,
    maxRotation: 50,
    mirror: false,
    padding: 0,
    reverse: false,
    display: true,
    autoSkip: true,
    autoSkipPadding: 0,
    labelOffset: 0,
    // We pass through arrays to be rendered as multiline labels, we convert Others to strings here.
    callback: Ticks.formatters.values,
    minor: {},
    major: {}
  }
});

function labelsFromTicks(ticks) {
  var labels = [];
  var i, ilen;

  for (i = 0, ilen = ticks.length; i < ilen; ++i) {
    labels.push(ticks[i].label);
  }

  return labels;
}

function parseFontOptions(options) {
  var valueOrDefault = helpers.valueOrDefault;
  var globalDefaults = defaults.global;
  var size = valueOrDefault(options.fontSize, globalDefaults.defaultFontSize);
  var style = valueOrDefault(options.fontStyle, globalDefaults.defaultFontStyle);
  var family = valueOrDefault(options.fontFamily, globalDefaults.defaultFontFamily);
  return {
    size: size,
    style: style,
    family: family,
    font: helpers.fontString(size, style, family)
  };
}

module.exports = Element.extend({
  /**
   * Get the padding needed for the scale
   * @method getPadding
   * @private
   * @returns {Padding} the necessary padding
   */
  getPadding: function () {},

  /**
   * Returns the scale tick objects ({label, major})
   * @since 2.7
   */
  getTicks: function () {},
  // These methods are ordered by lifecyle. Utilities then follow.
  // Any function defined here is inherited by all scale types.
  // Any function can be extended by the scale type
  mergeTicksOptions: function () {
    var ticks = this.options.ticks;

    if (ticks.minor === false) {
      ticks.minor = {
        display: false
      };
    }

    if (ticks.major === false) {
      ticks.major = {
        display: false
      };
    }

    for (var key in ticks) {
      if (key !== 'major' && key !== 'minor') {
        if (typeof ticks.minor[key] === 'undefined') {
          ticks.minor[key] = ticks[key];
        }

        if (typeof ticks.major[key] === 'undefined') {
          ticks.major[key] = ticks[key];
        }
      }
    }
  },
  beforeUpdate: function () {
    helpers.callback(this.options.beforeUpdate, [this]);
  },
  update: function (maxWidth, maxHeight, margins) {
    var me = this;
    var i, ilen, labels, label, ticks, tick; // Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)

    me.beforeUpdate(); // Absorb the master measurements

    me.maxWidth = maxWidth;
    me.maxHeight = maxHeight;
    me.margins = helpers.extend({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, margins);
    me.longestTextCache = me.longestTextCache || {}; // Dimensions

    me.beforeSetDimensions();
    me.setDimensions();
    me.afterSetDimensions(); // Data min/max

    me.beforeDataLimits();
    me.determineDataLimits();
    me.afterDataLimits(); // Ticks - `this.ticks` is now DEPRECATED!
    // Internal ticks are now stored as objects in the PRIVATE `this._ticks` member
    // and must not be accessed directly from outside this class. `this.ticks` being
    // around for long time and not marked as private, we can't change its structure
    // without unexpected breaking changes. If you need to access the scale ticks,
    // use scale.getTicks() instead.

    me.beforeBuildTicks(); // New implementations should return an array of objects but for BACKWARD COMPAT,
    // we still support no return (`this.ticks` internally set by calling this method).

    ticks = me.buildTicks() || [];
    me.afterBuildTicks();
    me.beforeTickToLabelConversion(); // New implementations should return the formatted tick labels but for BACKWARD
    // COMPAT, we still support no return (`this.ticks` internally changed by calling
    // this method and supposed to contain only string values).

    labels = me.convertTicksToLabels(ticks) || me.ticks;
    me.afterTickToLabelConversion();
    me.ticks = labels; // BACKWARD COMPATIBILITY
    // IMPORTANT: from this point, we consider that `this.ticks` will NEVER change!
    // BACKWARD COMPAT: synchronize `_ticks` with labels (so potentially `this.ticks`)

    for (i = 0, ilen = labels.length; i < ilen; ++i) {
      label = labels[i];
      tick = ticks[i];

      if (!tick) {
        ticks.push(tick = {
          label: label,
          major: false
        });
      } else {
        tick.label = label;
      }
    }

    me._ticks = ticks; // Tick Rotation

    me.beforeCalculateTickRotation();
    me.calculateTickRotation();
    me.afterCalculateTickRotation(); // Fit

    me.beforeFit();
    me.fit();
    me.afterFit(); //

    me.afterUpdate();
    return me.minSize;
  },
  afterUpdate: function () {
    helpers.callback(this.options.afterUpdate, [this]);
  },
  //
  beforeSetDimensions: function () {
    helpers.callback(this.options.beforeSetDimensions, [this]);
  },
  setDimensions: function () {},
  afterSetDimensions: function () {
    helpers.callback(this.options.afterSetDimensions, [this]);
  },
  // Data limits
  beforeDataLimits: function () {
    helpers.callback(this.options.beforeDataLimits, [this]);
  },
  determineDataLimits: helpers.noop,
  afterDataLimits: function () {
    helpers.callback(this.options.afterDataLimits, [this]);
  },
  //
  beforeBuildTicks: function () {
    helpers.callback(this.options.beforeBuildTicks, [this]);
  },
  buildTicks: helpers.noop,
  afterBuildTicks: function () {
    helpers.callback(this.options.afterBuildTicks, [this]);
  },
  beforeTickToLabelConversion: function () {
    helpers.callback(this.options.beforeTickToLabelConversion, [this]);
  },
  convertTicksToLabels: function () {
    var me = this; // Convert ticks to strings

    var tickOpts = me.options.ticks;
    me.ticks = me.ticks.map(tickOpts.userCallback || tickOpts.callback, this);
  },
  afterTickToLabelConversion: function () {
    helpers.callback(this.options.afterTickToLabelConversion, [this]);
  },
  //
  beforeCalculateTickRotation: function () {
    helpers.callback(this.options.beforeCalculateTickRotation, [this]);
  },
  calculateTickRotation: function () {
    var me = this;
    var context = me.ctx;
    var tickOpts = me.options.ticks;
    var labels = labelsFromTicks(me._ticks); // Get the width of each grid by calculating the difference
    // between x offsets between 0 and 1.

    var tickFont = parseFontOptions(tickOpts);
    context.font = tickFont.font;
    var labelRotation = tickOpts.minRotation || 0;

    if (labels.length && me.options.display && me.isHorizontal()) {
      var originalLabelWidth = helpers.longestText(context, tickFont.font, labels, me.longestTextCache);
      var labelWidth = originalLabelWidth;
      var cosRotation, sinRotation; // Allow 3 pixels x2 padding either side for label readability

      var tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6; // Max label rotation can be set or default to 90 - also act as a loop counter

      while (labelWidth > tickWidth && labelRotation < tickOpts.maxRotation) {
        var angleRadians = helpers.toRadians(labelRotation);
        cosRotation = Math.cos(angleRadians);
        sinRotation = Math.sin(angleRadians);

        if (sinRotation * originalLabelWidth > me.maxHeight) {
          // go back one step
          labelRotation--;
          break;
        }

        labelRotation++;
        labelWidth = cosRotation * originalLabelWidth;
      }
    }

    me.labelRotation = labelRotation;
  },
  afterCalculateTickRotation: function () {
    helpers.callback(this.options.afterCalculateTickRotation, [this]);
  },
  //
  beforeFit: function () {
    helpers.callback(this.options.beforeFit, [this]);
  },
  fit: function () {},

  /**
   * Handle margins and padding interactions
   * @private
   */
  handleMargins: function () {},
  afterFit: function () {
    helpers.callback(this.options.afterFit, [this]);
  },
  // Shared Methods
  isHorizontal: function () {
    return this.options.position === 'top' || this.options.position === 'bottom';
  },
  isFullWidth: function () {},
  // Get the correct value. NaN bad inputs, If the value type is object get the x or y based on whether we are horizontal or not
  getRightValue: function (rawValue) {
    // Null and undefined values first
    if (helpers.isNullOrUndef(rawValue)) {
      return NaN;
    } // isNaN(object) returns true, so make sure NaN is checking for a number; Discard Infinite values


    if (typeof rawValue === 'number' && !isFinite(rawValue)) {
      return NaN;
    } // If it is in fact an object, dive in one more level


    if (rawValue) {
      if (this.isHorizontal()) {
        if (rawValue.x !== undefined) {
          return this.getRightValue(rawValue.x);
        }
      } else if (rawValue.y !== undefined) {
        return this.getRightValue(rawValue.y);
      }
    } // Value is good, return it


    return rawValue;
  },

  /**
   * Used to get the value to display in the tooltip for the data at the given index
   * @param index
   * @param datasetIndex
   */
  getLabelForIndex: helpers.noop,

  /**
   * Returns the location of the given data point. Value can either be an index or a numerical value
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   * @param value
   * @param index
   * @param datasetIndex
   */
  getPixelForValue: helpers.noop,

  /**
   * Used to get the data value from a given pixel. This is the inverse of getPixelForValue
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   * @param pixel
   */
  getValueForPixel: helpers.noop,

  /**
   * Returns the location of the tick at the given index
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   */
  getPixelForTick: function () {},

  /**
   * Utility for getting the pixel location of a percentage of scale
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   */
  getPixelForDecimal: function () {},

  /**
   * Returns the pixel for the minimum chart value
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   */
  getBasePixel: function () {},
  getBaseValue: function () {},

  /**
   * Returns a subset of ticks to be plotted to avoid overlapping labels.
   * @private
   */
  _autoSkip: function () {},
  // Actually draw the scale on the canvas
  // @param {rectangle} chartArea : the area of the chart to draw full grid lines on
  draw: function () {}
});