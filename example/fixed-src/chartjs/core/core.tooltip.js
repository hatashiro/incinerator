'use strict';

var defaults = require('./core.defaults');

var Element = require('./core.element');

var helpers = require('../helpers/index');

defaults._set('global', {
  tooltips: {
    enabled: true,
    custom: null,
    mode: 'nearest',
    position: 'average',
    intersect: true,
    backgroundColor: 'rgba(0,0,0,0.8)',
    titleFontStyle: 'bold',
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleFontColor: '#fff',
    titleAlign: 'left',
    bodySpacing: 2,
    bodyFontColor: '#fff',
    bodyAlign: 'left',
    footerFontStyle: 'bold',
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFontColor: '#fff',
    footerAlign: 'left',
    yPadding: 6,
    xPadding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    multiKeyBackground: '#fff',
    displayColors: true,
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    callbacks: {
      // Args are: (tooltipItems, data)
      beforeTitle: helpers.noop,
      title: function () {},
      afterTitle: helpers.noop,
      // Args are: (tooltipItems, data)
      beforeBody: helpers.noop,
      // Args are: (tooltipItem, data)
      beforeLabel: helpers.noop,
      label: function () {},
      labelColor: function () {},
      labelTextColor: function () {},
      afterLabel: helpers.noop,
      // Args are: (tooltipItems, data)
      afterBody: helpers.noop,
      // Args are: (tooltipItems, data)
      beforeFooter: helpers.noop,
      footer: helpers.noop,
      afterFooter: helpers.noop
    }
  }
});

var positioners = {
  /**
   * Average mode places the tooltip at the average position of the elements shown
   * @function Chart.Tooltip.positioners.average
   * @param elements {ChartElement[]} the elements being displayed in the tooltip
   * @returns {Point} tooltip position
   */
  average: function () {},

  /**
   * Gets the tooltip position nearest of the item nearest to the event position
   * @function Chart.Tooltip.positioners.nearest
   * @param elements {Chart.Element[]} the tooltip elements
   * @param eventPosition {Point} the position of the event in canvas coordinates
   * @returns {Point} the tooltip position
   */
  nearest: function () {}
};
/**
 * Helper method to merge the opacity into a color
 */

/**
 * Helper to get the reset model for the tooltip
 * @param tooltipOpts {Object} the tooltip options
 */
function getBaseModel(tooltipOpts) {
  var globalDefaults = defaults.global;
  var valueOrDefault = helpers.valueOrDefault;
  return {
    // Positioning
    xPadding: tooltipOpts.xPadding,
    yPadding: tooltipOpts.yPadding,
    xAlign: tooltipOpts.xAlign,
    yAlign: tooltipOpts.yAlign,
    // Body
    bodyFontColor: tooltipOpts.bodyFontColor,
    _bodyFontFamily: valueOrDefault(tooltipOpts.bodyFontFamily, globalDefaults.defaultFontFamily),
    _bodyFontStyle: valueOrDefault(tooltipOpts.bodyFontStyle, globalDefaults.defaultFontStyle),
    _bodyAlign: tooltipOpts.bodyAlign,
    bodyFontSize: valueOrDefault(tooltipOpts.bodyFontSize, globalDefaults.defaultFontSize),
    bodySpacing: tooltipOpts.bodySpacing,
    // Title
    titleFontColor: tooltipOpts.titleFontColor,
    _titleFontFamily: valueOrDefault(tooltipOpts.titleFontFamily, globalDefaults.defaultFontFamily),
    _titleFontStyle: valueOrDefault(tooltipOpts.titleFontStyle, globalDefaults.defaultFontStyle),
    titleFontSize: valueOrDefault(tooltipOpts.titleFontSize, globalDefaults.defaultFontSize),
    _titleAlign: tooltipOpts.titleAlign,
    titleSpacing: tooltipOpts.titleSpacing,
    titleMarginBottom: tooltipOpts.titleMarginBottom,
    // Footer
    footerFontColor: tooltipOpts.footerFontColor,
    _footerFontFamily: valueOrDefault(tooltipOpts.footerFontFamily, globalDefaults.defaultFontFamily),
    _footerFontStyle: valueOrDefault(tooltipOpts.footerFontStyle, globalDefaults.defaultFontStyle),
    footerFontSize: valueOrDefault(tooltipOpts.footerFontSize, globalDefaults.defaultFontSize),
    _footerAlign: tooltipOpts.footerAlign,
    footerSpacing: tooltipOpts.footerSpacing,
    footerMarginTop: tooltipOpts.footerMarginTop,
    // Appearance
    caretSize: tooltipOpts.caretSize,
    cornerRadius: tooltipOpts.cornerRadius,
    backgroundColor: tooltipOpts.backgroundColor,
    opacity: 0,
    legendColorBackground: tooltipOpts.multiKeyBackground,
    displayColors: tooltipOpts.displayColors,
    borderColor: tooltipOpts.borderColor,
    borderWidth: tooltipOpts.borderWidth
  };
}
/**
 * Get the size of the tooltip
 */


var exports = module.exports = Element.extend({
  initialize: function () {
    this._model = getBaseModel(this._options);
    this._lastActive = [];
  },
  // Get the title
  // Args are: (tooltipItem, data)
  getTitle: function () {},
  // Args are: (tooltipItem, data)
  getBeforeBody: function () {},
  // Args are: (tooltipItem, data)
  getBody: function () {},
  // Args are: (tooltipItem, data)
  getAfterBody: function () {},
  // Get the footer and beforeFooter and afterFooter lines
  // Args are: (tooltipItem, data)
  getFooter: function () {},
  update: function () {},
  drawCaret: function () {},
  getCaretPosition: function () {},
  drawTitle: function () {},
  drawBody: function () {},
  drawFooter: function () {},
  drawBackground: function () {},
  draw: function () {
    var ctx = this._chart.ctx;
    var vm = this._view;

    if (vm.opacity === 0) {
      return;
    }

    var tooltipSize = {
      width: vm.width,
      height: vm.height
    };
    var pt = {
      x: vm.x,
      y: vm.y
    }; // IE11/Edge does not like very small opacities, so snap to 0

    var opacity = Math.abs(vm.opacity < 1e-3) ? 0 : vm.opacity; // Truthy/falsey value for empty tooltip

    var hasTooltipContent = vm.title.length || vm.beforeBody.length || vm.body.length || vm.afterBody.length || vm.footer.length;

    if (this._options.enabled && hasTooltipContent) {
      // Draw Background
      this.drawBackground(pt, vm, ctx, tooltipSize, opacity); // Draw Title, Body, and Footer

      pt.x += vm.xPadding;
      pt.y += vm.yPadding; // Titles

      this.drawTitle(pt, vm, ctx, opacity); // Body

      this.drawBody(pt, vm, ctx, opacity); // Footer

      this.drawFooter(pt, vm, ctx, opacity);
    }
  },

  /**
   * Handle an event
   * @private
   * @param {IEvent} event - The event to handle
   * @returns {Boolean} true if the tooltip changed
   */
  handleEvent: function () {}
});
/**
 * @namespace Chart.Tooltip.positioners
 */

exports.positioners = positioners;