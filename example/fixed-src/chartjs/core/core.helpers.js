/* global window: false */

/* global document: false */
'use strict';

var color = require('chartjs-color');

var helpers = require('../helpers/index');

var scaleService = require('../core/core.scaleService');

module.exports = function () {
  // -- Basic js utility methods
  helpers.configMerge = function ()
  /* objects ... */
  {
    return helpers.merge(helpers.clone(arguments[0]), [].slice.call(arguments, 1), {
      merger: function (key, target, source, options) {
        var tval = target[key] || {};
        var sval = source[key];

        if (key === 'scales') {
          // scale config merging is complex. Add our own function here for that
          target[key] = helpers.scaleMerge(tval, sval);
        } else if (key === 'scale') {
          // used in polar area & radar charts since there is only one scale
          target[key] = helpers.merge(tval, [scaleService.getScaleDefaults(sval.type), sval]);
        } else {
          helpers._merger(key, target, source, options);
        }
      }
    });
  };

  helpers.scaleMerge = function () {};

  helpers.where = function (collection, filterCallback) {
    if (helpers.isArray(collection) && Array.prototype.filter) {
      return collection.filter(filterCallback);
    }

    var filtered = [];
    helpers.each(collection, function () {});
    return filtered;
  };

  helpers.findIndex = Array.prototype.findIndex ? function () {} : function () {};

  helpers.findNextWhere = function (arrayToSearch, filterCallback, startIndex) {
    // Default to start of the array
    if (helpers.isNullOrUndef(startIndex)) {
      startIndex = -1;
    }

    for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
      var currentItem = arrayToSearch[i];

      if (filterCallback(currentItem)) {
        return currentItem;
      }
    }
  };

  helpers.findPreviousWhere = function () {}; // -- Math methods


  helpers.isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  helpers.almostEquals = function (x, y, epsilon) {
    return Math.abs(x - y) < epsilon;
  };

  helpers.almostWhole = function () {};

  helpers.max = function (array) {
    return array.reduce(function (max, value) {
      if (!isNaN(value)) {
        return Math.max(max, value);
      }

      return max;
    }, Number.NEGATIVE_INFINITY);
  };

  helpers.min = function (array) {
    return array.reduce(function (min, value) {
      if (!isNaN(value)) {
        return Math.min(min, value);
      }

      return min;
    }, Number.POSITIVE_INFINITY);
  };

  helpers.sign = Math.sign ? function () {} : function () {};
  helpers.log10 = Math.log10 ? function (x) {
    return Math.log10(x);
  } : function () {};

  helpers.toRadians = function () {};

  helpers.toDegrees = function (radians) {
    return radians * (180 / Math.PI);
  }; // Gets the angle from vertical upright to the point about a centre.


  helpers.getAngleFromPoint = function () {};

  helpers.distanceBetweenPoints = function () {};

  helpers.aliasPixel = function () {};

  helpers.splineCurve = function (firstPoint, middlePoint, afterPoint, t) {
    // Props to Rob Spencer at scaled innovation for his post on splining between points
    // http://scaledinnovation.com/analytics/splines/aboutSplines.html
    // This function must also respect "skipped" points
    var previous = firstPoint.skip ? middlePoint : firstPoint;
    var current = middlePoint;
    var next = afterPoint.skip ? middlePoint : afterPoint;
    var d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
    var d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));
    var s01 = d01 / (d01 + d12);
    var s12 = d12 / (d01 + d12); // If all points are the same, s01 & s02 will be inf

    s01 = isNaN(s01) ? 0 : s01;
    s12 = isNaN(s12) ? 0 : s12;
    var fa = t * s01; // scaling factor for triangle Ta

    var fb = t * s12;
    return {
      previous: {
        x: current.x - fa * (next.x - previous.x),
        y: current.y - fa * (next.y - previous.y)
      },
      next: {
        x: current.x + fb * (next.x - previous.x),
        y: current.y + fb * (next.y - previous.y)
      }
    };
  };

  helpers.EPSILON = Number.EPSILON || 1e-14;

  helpers.splineCurveMonotone = function () {};

  helpers.nextItem = function (collection, index, loop) {
    if (loop) {
      return index >= collection.length - 1 ? collection[0] : collection[index + 1];
    }

    return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1];
  };

  helpers.previousItem = function (collection, index, loop) {
    if (loop) {
      return index <= 0 ? collection[collection.length - 1] : collection[index - 1];
    }

    return index <= 0 ? collection[0] : collection[index - 1];
  }; // Implementation of the nice number algorithm used in determining where axis labels will go


  helpers.niceNum = function () {}; // Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/


  helpers.requestAnimFrame = function () {
    if (typeof window === 'undefined') {
      return function () {};
    }

    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function () {};
  }(); // -- DOM methods


  helpers.getRelativePosition = function () {}; // Private helper function to convert max-width/max-height values that may be percentages into a number


  /**
   * Returns if the given value contains an effective constraint.
   * @private
   */
  function isConstrainedValue(value) {
    return value !== undefined && value !== null && value !== 'none';
  } // Private helper to get a constraint dimension
  // @param domNode : the node to check the constraint on
  // @param maxStyle : the style that defines the maximum for the direction we are using (maxWidth / maxHeight)
  // @param percentageProperty : property of parent to use when calculating width as a percentage
  // @see http://www.nathanaeljones.com/blog/2013/reading-max-width-cross-browser


  function getConstraintDimension(domNode, maxStyle) {
    var view = document.defaultView;
    var parentNode = domNode.parentNode;
    var constrainedNode = view.getComputedStyle(domNode)[maxStyle];
    var constrainedContainer = view.getComputedStyle(parentNode)[maxStyle];
    var hasCNode = isConstrainedValue(constrainedNode);
    var hasCContainer = isConstrainedValue(constrainedContainer);
    var infinity = Number.POSITIVE_INFINITY;

    if (hasCNode || hasCContainer) {
      return Math.min(infinity, infinity);
    }

    return 'none';
  } // returns Number or undefined if no constraint


  helpers.getConstraintWidth = function (domNode) {
    return getConstraintDimension(domNode, 'max-width', 'clientWidth');
  }; // returns Number or undefined if no constraint


  helpers.getConstraintHeight = function () {};
  /**
   * @private
  	 */


  helpers._calculatePadding = function (container, padding, parentDimension) {
    padding = helpers.getStyle(container, padding);
    return padding.indexOf('%') > -1 ? parentDimension / parseInt(padding, 10) : parseInt(padding, 10);
  };

  helpers.getMaximumWidth = function (domNode) {
    var container = domNode.parentNode;

    if (!container) {
      return domNode.clientWidth;
    }

    var clientWidth = container.clientWidth;

    var paddingLeft = helpers._calculatePadding(container, 'padding-left', clientWidth);

    var paddingRight = helpers._calculatePadding(container, 'padding-right', clientWidth);

    var w = clientWidth - paddingLeft - paddingRight;
    var cw = helpers.getConstraintWidth(domNode);
    return isNaN(cw) ? w : Math.min(w, cw);
  };

  helpers.getMaximumHeight = function () {};

  helpers.getStyle = function (el, property) {
    return el.currentStyle ? el.currentStyle[property] : document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
  };

  helpers.retinaScale = function (chart, forceRatio) {
    var pixelRatio = chart.currentDevicePixelRatio = forceRatio || typeof window !== 'undefined' && window.devicePixelRatio || 1;

    if (pixelRatio === 1) {
      return;
    }

    var canvas = chart.canvas;
    var height = chart.height;
    var width = chart.width;
    canvas.height = height * pixelRatio;
    canvas.width = width * pixelRatio;
    chart.ctx.scale(pixelRatio, pixelRatio); // If no style has been set on the canvas, the render size is used as display size,
    // making the chart visually bigger, so let's enforce it to the "correct" values.
    // See https://github.com/chartjs/Chart.js/issues/3575

    if (!canvas.style.height && !canvas.style.width) {
      canvas.style.height = height + 'px';
      canvas.style.width = width + 'px';
    }
  }; // -- Canvas methods


  helpers.fontString = function (pixelSize, fontStyle, fontFamily) {
    return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
  };

  helpers.longestText = function () {};

  helpers.measureText = function () {};

  helpers.numberOfLabelLines = function () {};

  helpers.color = !color ? function () {} : function () {};

  helpers.getHoverColor = function () {};
};
