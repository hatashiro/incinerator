'use strict';

var defaults = require('../core/core.defaults');

var Element = require('../core/core.element');

var helpers = require('../helpers/index');

var layouts = require('../core/core.layouts');

var noop = helpers.noop;

defaults._set('global', {
  legend: {
    display: true,
    position: 'top',
    fullWidth: true,
    reverse: false,
    weight: 1000,
    // a callback that will handle
    onClick: function () {},
    onHover: null,
    labels: {
      boxWidth: 40,
      padding: 10,
      // Generates labels shown in the legend
      // Valid properties to return:
      // text : text to display
      // fillStyle : fill of coloured box
      // strokeStyle: stroke of coloured box
      // hidden : if this legend item refers to a hidden item
      // lineCap : cap style for line
      // lineDash
      // lineDashOffset :
      // lineJoin :
      // lineWidth :
      generateLabels: function (chart) {
        var data = chart.data;
        return helpers.isArray(data.datasets) ? data.datasets.map(function (dataset, i) {
          return {
            text: dataset.label,
            fillStyle: !helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0],
            hidden: !chart.isDatasetVisible(i),
            lineCap: dataset.borderCapStyle,
            lineDash: dataset.borderDash,
            lineDashOffset: dataset.borderDashOffset,
            lineJoin: dataset.borderJoinStyle,
            lineWidth: dataset.borderWidth,
            strokeStyle: dataset.borderColor,
            pointStyle: dataset.pointStyle,
            // Below is extra data used for toggling the datasets
            datasetIndex: i
          };
        }, this) : [];
      }
    }
  },
  legendCallback: function () {}
});
/**
 * Helper function to get the box width based on the usePointStyle option
 * @param labelopts {Object} the label options on the legend
 * @param fontSize {Number} the label font size
 * @return {Number} width of the color box area
 */


/**
 * IMPORTANT: this class is exposed publicly as Chart.Legend, backward compatibility required!
 */
var Legend = Element.extend({
  initialize: function (config) {
    helpers.extend(this, config); // Contains hit boxes for each dataset (in dataset order)

    this.legendHitBoxes = []; // Are we in doughnut mode which has a different data type

    this.doughnutMode = false;
  },
  // These methods are ordered by lifecycle. Utilities then follow.
  // Any function defined here is inherited by all legend types.
  // Any function can be extended by the legend type
  beforeUpdate: noop,
  update: function (maxWidth, maxHeight, margins) {
    var me = this; // Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)

    me.beforeUpdate(); // Absorb the master measurements

    me.maxWidth = maxWidth;
    me.maxHeight = maxHeight;
    me.margins = margins; // Dimensions

    me.beforeSetDimensions();
    me.setDimensions();
    me.afterSetDimensions(); // Labels

    me.beforeBuildLabels();
    me.buildLabels();
    me.afterBuildLabels(); // Fit

    me.beforeFit();
    me.fit();
    me.afterFit(); //

    me.afterUpdate();
    return me.minSize;
  },
  afterUpdate: noop,
  //
  beforeSetDimensions: noop,
  setDimensions: function () {
    var me = this; // Set the unconstrained dimension before label rotation

    if (me.isHorizontal()) {
      // Reset position before calculating rotation
      me.width = me.maxWidth;
      me.left = 0;
      me.right = me.width;
    } else {
      me.height = me.maxHeight; // Reset position before calculating rotation

      me.top = 0;
      me.bottom = me.height;
    } // Reset padding


    me.paddingLeft = 0;
    me.paddingTop = 0;
    me.paddingRight = 0;
    me.paddingBottom = 0; // Reset minSize

    me.minSize = {
      width: 0,
      height: 0
    };
  },
  afterSetDimensions: noop,
  //
  beforeBuildLabels: noop,
  buildLabels: function () {
    var me = this;
    var labelOpts = me.options.labels || {};
    var legendItems = helpers.callback(labelOpts.generateLabels, [me.chart], me) || [];

    if (labelOpts.filter) {
      legendItems = legendItems.filter(function () {});
    }

    if (me.options.reverse) {
      legendItems.reverse();
    }

    me.legendItems = legendItems;
  },
  afterBuildLabels: noop,
  //
  beforeFit: noop,
  fit: function () {
    var me = this;
    var opts = me.options;
    var labelOpts = opts.labels;
    var display = opts.display;
    var ctx = me.ctx;
    var globalDefault = defaults.global;
    var valueOrDefault = helpers.valueOrDefault;
    var fontSize = valueOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize);
    var fontStyle = valueOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle);
    var fontFamily = valueOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily);
    var labelFont = helpers.fontString(fontSize, fontStyle, fontFamily); // Reset hit boxes

    var minSize = me.minSize;
    var isHorizontal = me.isHorizontal();

    if (isHorizontal) {
      minSize.width = me.maxWidth; // fill all the width

      minSize.height = display ? 10 : 0;
    } else {
      minSize.width = display ? 10 : 0;
      minSize.height = me.maxHeight; // fill all the height
    } // Increase sizes here


    if (display) {
      ctx.font = labelFont;

      if (isHorizontal) {
        // Labels
        // Width of each line of legend boxes. Labels wrap onto multiple lines when there are too many to fit on one
        var totalHeight = me.legendItems.length ? fontSize + labelOpts.padding : 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        helpers.each(me.legendItems, function () {});
        minSize.height += totalHeight;
      } else {
        var columnWidths = me.columnWidths = [];
        var totalWidth = labelOpts.padding;
        var currentColWidth = 0;
        helpers.each(me.legendItems, function () {});
        totalWidth += currentColWidth;
        columnWidths.push(currentColWidth);
        minSize.width += totalWidth;
      }
    }

    me.width = minSize.width;
    me.height = minSize.height;
  },
  afterFit: noop,
  // Shared Methods
  isHorizontal: function () {
    return this.options.position === 'top' || this.options.position === 'bottom';
  },
  // Actually draw the legend on the canvas
  draw: function () {
    var me = this;
    var opts = me.options;
    var labelOpts = opts.labels;
    var globalDefault = defaults.global;

    if (opts.display) {
      var ctx = me.ctx;
      var valueOrDefault = helpers.valueOrDefault;
      var fontColor = valueOrDefault(labelOpts.fontColor, globalDefault.defaultFontColor);
      var fontSize = valueOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize);
      var fontStyle = valueOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle);
      var fontFamily = valueOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily);
      var labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = fontColor; // for strikethrough effect

      ctx.fillStyle = fontColor; // render in correct colour

      ctx.font = labelFont;

      helpers.each(me.legendItems, function () {});
    }
  },

  /**
   * Handle an event
   * @private
   * @param {IEvent} event - The event to handle
   * @return {Boolean} true if a change occured
   */
  handleEvent: function () {}
});

function createNewLegendAndAttach(chart, legendOpts) {
  var legend = new Legend({
    ctx: chart.ctx,
    options: legendOpts,
    chart: chart
  });
  layouts.configure(chart, legend, legendOpts);
  layouts.addBox(chart, legend);
  chart.legend = legend;
}

module.exports = {
  id: 'legend',

  /**
   * Backward compatibility: since 2.1.5, the legend is registered as a plugin, making
   * Chart.Legend obsolete. To avoid a breaking change, we export the Legend as part of
   * the plugin, which one will be re-exposed in the chart.js file.
   * https://github.com/chartjs/Chart.js/pull/2640
   * @private
   */
  _element: Legend,
  beforeInit: function (chart) {
    var legendOpts = chart.options.legend;

    if (legendOpts) {
      createNewLegendAndAttach(chart, legendOpts);
    }
  },
  beforeUpdate: function (chart) {
    var legendOpts = chart.options.legend;
    var legend = chart.legend;

    if (legendOpts) {
      helpers.mergeIf(legendOpts, defaults.global.legend);

      if (legend) {
        layouts.configure(chart, legend, legendOpts);
        legend.options = legendOpts;
      } else {
        createNewLegendAndAttach(chart, legendOpts);
      }
    } else if (legend) {
      layouts.removeBox(chart, legend);
      delete chart.legend;
    }
  },
  afterEvent: function () {}
};
