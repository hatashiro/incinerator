'use strict';

var Animation = require('./core.animation');

var animations = require('./core.animations');

var defaults = require('./core.defaults');

var helpers = require('../helpers/index');

var layouts = require('./core.layouts');

var platform = require('../platforms/platform');

var plugins = require('./core.plugins');

var scaleService = require('../core/core.scaleService');

var Tooltip = require('./core.tooltip');

module.exports = function (Chart) {
  // Create a dictionary of chart types, to allow for extension of existing types
  Chart.types = {}; // Store a reference to each instance - allowing us to globally resize chart instances on window resize.
  // Destroy method on the chart will remove the instance of the chart from this reference.

  Chart.instances = {}; // Controllers available for dataset visualization eg. bar, line, slice, etc.

  Chart.controllers = {};
  /**
   * Initializes the given config with global and chart default values.
   */

  function initConfig(config) {
    config = config || {}; // Do NOT use configMerge() for the data object because this method merges arrays
    // and so would change references to labels and datasets, preventing data updates.

    var data = config.data = config.data || {};
    data.datasets = data.datasets || [];
    data.labels = data.labels || [];
    config.options = helpers.configMerge(defaults.global, defaults[config.type], config.options || {});
    return config;
  }
  /**
   * Updates the config of the chart
   * @param chart {Chart} chart to update the options for
   */


  function updateConfig(chart) {
    var newOptions = chart.options;
    helpers.each(chart.scales, function (scale) {
      layouts.removeBox(chart, scale);
    });
    newOptions = helpers.configMerge(Chart.defaults.global, Chart.defaults[chart.config.type], newOptions);
    chart.options = chart.config.options = newOptions;
    chart.ensureScalesHaveIDs();
    chart.buildOrUpdateScales(); // Tooltip

    chart.tooltip._options = newOptions.tooltips;
    chart.tooltip.initialize();
  }

  function positionIsHorizontal(position) {
    return position === 'top' || position === 'bottom';
  }

  helpers.extend(Chart.prototype,
  /** @lends Chart */
  {
    /**
     * @private
     */
    construct: function (item, config) {
      var me = this;
      config = initConfig(config);
      var context = platform.acquireContext(item, config);
      var canvas = context && context.canvas;
      var height = canvas && canvas.height;
      var width = canvas && canvas.width;
      me.id = helpers.uid();
      me.ctx = context;
      me.canvas = canvas;
      me.config = config;
      me.width = width;
      me.height = height;
      me.aspectRatio = height ? width / height : null;
      me.options = config.options;
      me._bufferedRender = false;
      /**
       * Provided for backward compatibility, Chart and Chart.Controller have been merged,
       * the "instance" still need to be defined since it might be called from plugins.
       * @prop Chart#chart
       * @deprecated since version 2.6.0
       * @todo remove at version 3
       * @private
       */

      me.chart = me;
      me.controller = me; // chart.chart.controller #inception
      // Add the chart instance to the global namespace

      Chart.instances[me.id] = me; // Define alias to the config data: `chart.data === chart.config.data`

      Object.defineProperty(me, 'data', {
        get: function () {
          return me.config.data;
        },
        set: function () {}
      });

      if (!context || !canvas) {
        // The given item is not a compatible context2d element, let's return before finalizing
        // the chart initialization but after setting basic chart / controller properties that
        // can help to figure out that the chart is not valid (e.g chart.canvas !== null);
        // https://github.com/chartjs/Chart.js/issues/2807
        console.error("Failed to create chart: can't acquire context from the given item");
        return;
      }

      me.initialize();
      me.update();
    },

    /**
     * @private
     */
    initialize: function () {
      var me = this; // Before init plugin notification

      plugins.notify(me, 'beforeInit');
      helpers.retinaScale(me, me.options.devicePixelRatio);
      me.bindEvents();

      if (me.options.responsive) {
        // Initial resize before chart draws (must be silent to preserve initial animations).
        me.resize(true);
      } // Make sure scales have IDs and are built before we build any controllers.


      me.ensureScalesHaveIDs();
      me.buildOrUpdateScales();
      me.initToolTip(); // After init plugin notification

      plugins.notify(me, 'afterInit');
      return me;
    },
    clear: function () {
      helpers.canvas.clear(this);
      return this;
    },
    stop: function () {},
    resize: function (silent) {
      var me = this;
      var options = me.options;
      var canvas = me.canvas;
      var aspectRatio = options.maintainAspectRatio && me.aspectRatio || null; // the canvas render width and height will be casted to integers so make sure that
      // the canvas display style uses the same integer values to avoid blurring effect.
      // Set to 0 instead of canvas.size because the size defaults to 300x150 if the element is collapsed

      var newWidth = Math.max(0, Math.floor(helpers.getMaximumWidth(canvas)));
      var newHeight = Math.max(0, Math.floor(aspectRatio ? newWidth / aspectRatio : helpers.getMaximumHeight(canvas)));

      if (me.width === newWidth && me.height === newHeight) {
        return;
      }

      canvas.width = me.width = newWidth;
      canvas.height = me.height = newHeight;
      canvas.style.width = newWidth + 'px';
      canvas.style.height = newHeight + 'px';
      helpers.retinaScale(me, options.devicePixelRatio);

      if (!silent) {
        // Notify any plugins about the resize
        var newSize = {
          width: newWidth,
          height: newHeight
        };
        plugins.notify(me, 'resize', [newSize]); // Notify of resize

        if (me.options.onResize) {
          me.options.onResize(me, newSize);
        }

        me.stop();
        me.update({
          duration: me.options.responsiveAnimationDuration
        });
      }
    },
    ensureScalesHaveIDs: function () {
      var options = this.options;
      var scalesOptions = options.scales || {};
      var scaleOptions = options.scale;
      helpers.each(scalesOptions.xAxes, function () {});
      helpers.each(scalesOptions.yAxes, function () {});

      if (scaleOptions) {
        scaleOptions.id = scaleOptions.id || 'scale';
      }
    },

    /**
     * Builds a map of scale ID to scale object for future lookup.
     */
    buildOrUpdateScales: function () {
      var me = this;
      var options = me.options;
      var scales = me.scales || {};
      var items = [];
      var updated = Object.keys(scales).reduce(function (obj, id) {
        obj[id] = false;
        return obj;
      }, {});

      if (options.scales) {
        items = items.concat((options.scales.xAxes || []).map(function () {}), (options.scales.yAxes || []).map(function () {}));
      }

      if (options.scale) {
        items.push({
          options: options.scale,
          dtype: 'radialLinear',
          isDefault: true,
          dposition: 'chartArea'
        });
      }

      helpers.each(items, function (item) {
        var scaleOptions = item.options;
        var id = scaleOptions.id;
        var scaleType = helpers.valueOrDefault(scaleOptions.type, item.dtype);

        if (positionIsHorizontal(scaleOptions.position) !== positionIsHorizontal(item.dposition)) {
          scaleOptions.position = item.dposition;
        }

        updated[id] = true;
        var scale = null;

        if (id in scales && scales[id].type === scaleType) {
          scale = scales[id];
          scale.options = scaleOptions;
          scale.ctx = me.ctx;
          scale.chart = me;
        } else {
          var scaleClass = scaleService.getScaleConstructor(scaleType);

          if (!scaleClass) {
            return;
          }

          scale = new scaleClass({
            id: id,
            type: scaleType,
            options: scaleOptions,
            ctx: me.ctx,
            chart: me
          });
          scales[scale.id] = scale;
        }

        scale.mergeTicksOptions(); // TODO(SB): I think we should be able to remove this custom case (options.scale)
        // and consider it as a regular scale part of the "scales"" map only! This would
        // make the logic easier and remove some useless? custom code.

        if (item.isDefault) {
          me.scale = scale;
        }
      }); // clear up discarded scales

      helpers.each(updated, function (hasUpdated, id) {
        if (!hasUpdated) {
          delete scales[id];
        }
      });
      me.scales = scales;
      scaleService.addScalesToLayout(this);
    },
    buildOrUpdateControllers: function () {
      var me = this;
      var types = [];
      var newControllers = [];
      helpers.each(me.data.datasets, function (dataset, datasetIndex) {
        var meta = me.getDatasetMeta(datasetIndex);
        var type = dataset.type || me.config.type;

        if (meta.type && meta.type !== type) {
          me.destroyDatasetMeta(datasetIndex);
          meta = me.getDatasetMeta(datasetIndex);
        }

        meta.type = type;
        types.push(meta.type);

        if (meta.controller) {
          meta.controller.updateIndex(datasetIndex);
          meta.controller.linkScales();
        } else {
          var ControllerClass = Chart.controllers[meta.type];

          if (ControllerClass === undefined) {
            throw new Error('"' + meta.type + '" is not a chart type.');
          }

          meta.controller = new ControllerClass(me, datasetIndex);
          newControllers.push(meta.controller);
        }
      }, me);
      return newControllers;
    },

    /**
     * Reset the elements of all datasets
     * @private
     */
    resetElements: function () {},

    /**
    * Resets the chart back to it's state before the initial animation
    */
    reset: function () {},
    update: function (config) {
      var me = this;

      if (!config || typeof config !== 'object') {
        // backwards compatibility
        config = {
          duration: config,
          lazy: arguments[1]
        };
      }

      updateConfig(me); // plugins options references might have change, let's invalidate the cache
      // https://github.com/chartjs/Chart.js/issues/5111#issuecomment-355934167

      plugins._invalidate(me);

      if (plugins.notify(me, 'beforeUpdate') === false) {
        return;
      } // In case the entire data object changed


      me.tooltip._data = me.data; // Make sure dataset controllers are updated and new controllers are reset

      var newControllers = me.buildOrUpdateControllers(); // Make sure all dataset controllers have correct meta data counts

      helpers.each(me.data.datasets, function (dataset, datasetIndex) {
        me.getDatasetMeta(datasetIndex).controller.buildOrUpdateElements();
      }, me);
      me.updateLayout(); // Can only reset the new controllers after the scales have been updated

      if (me.options.animation && me.options.animation.duration) {
        helpers.each(newControllers, function () {});
      }

      me.updateDatasets(); // Need to reset tooltip in case it is displayed with elements that are removed
      // after update.

      me.tooltip.initialize(); // Last active contains items that were previously in the tooltip.
      // When we reset the tooltip, we need to clear it

      me.lastActive = []; // Do this before render so that any plugins that need final scale updates can use it

      plugins.notify(me, 'afterUpdate');

      if (me._bufferedRender) {
        me._bufferedRequest = {
          duration: config.duration,
          easing: config.easing,
          lazy: config.lazy
        };
      } else {
        me.render(config);
      }
    },

    /**
     * Updates the chart layout unless a plugin returns `false` to the `beforeLayout`
     * hook, in which case, plugins will not be called on `afterLayout`.
     * @private
     */
    updateLayout: function () {
      var me = this;

      if (plugins.notify(me, 'beforeLayout') === false) {
        return;
      }

      layouts.update(this, this.width, this.height);
      /**
       * Provided for backward compatibility, use `afterLayout` instead.
       * @method IPlugin#afterScaleUpdate
       * @deprecated since version 2.5.0
       * @todo remove at version 3
       * @private
       */

      plugins.notify(me, 'afterScaleUpdate');
      plugins.notify(me, 'afterLayout');
    },

    /**
     * Updates all datasets unless a plugin returns `false` to the `beforeDatasetsUpdate`
     * hook, in which case, plugins will not be called on `afterDatasetsUpdate`.
     * @private
     */
    updateDatasets: function () {
      var me = this;

      if (plugins.notify(me, 'beforeDatasetsUpdate') === false) {
        return;
      }

      for (var i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
        me.updateDataset(i);
      }

      plugins.notify(me, 'afterDatasetsUpdate');
    },

    /**
     * Updates dataset at index unless a plugin returns `false` to the `beforeDatasetUpdate`
     * hook, in which case, plugins will not be called on `afterDatasetUpdate`.
     * @private
     */
    updateDataset: function (index) {
      var me = this;
      var meta = me.getDatasetMeta(index);
      var args = {
        meta: meta,
        index: index
      };

      if (plugins.notify(me, 'beforeDatasetUpdate', [args]) === false) {
        return;
      }

      meta.controller.update();
      plugins.notify(me, 'afterDatasetUpdate', [args]);
    },
    render: function (config) {
      var me = this;

      if (!config || typeof config !== 'object') {
        // backwards compatibility
        config = {
          duration: config,
          lazy: arguments[1]
        };
      }

      var duration = config.duration;
      var lazy = config.lazy;

      if (plugins.notify(me, 'beforeRender') === false) {
        return;
      }

      var animationOptions = me.options.animation;

      var onComplete = function (animation) {
        plugins.notify(me, 'afterRender');
        helpers.callback(animationOptions && animationOptions.onComplete, [animation], me);
      };

      if (animationOptions && (typeof duration !== 'undefined' && duration !== 0 || typeof duration === 'undefined' && animationOptions.duration !== 0)) {
        var animation = new Animation({
          numSteps: (duration || animationOptions.duration) / 16.66,
          // 60 fps
          easing: config.easing || animationOptions.easing,
          render: function () {},
          onAnimationProgress: animationOptions.onProgress,
          onAnimationComplete: onComplete
        });
        animations.addAnimation(me, animation, duration, lazy);
      } else {
        me.draw(); // See https://github.com/chartjs/Chart.js/issues/3781

        onComplete(new Animation({
          numSteps: 0,
          chart: me
        }));
      }

      return me;
    },
    draw: function (easingValue) {
      var me = this;
      me.clear();

      if (helpers.isNullOrUndef(easingValue)) {
        easingValue = 1;
      }

      me.transition(easingValue);

      if (me.width <= 0 || me.height <= 0) {
        return;
      }

      if (plugins.notify(me, 'beforeDraw', [easingValue]) === false) {
        return;
      } // Draw all the scales


      helpers.each(me.boxes, function (box) {
        box.draw(me.chartArea);
      }, me);

      if (me.scale) {
        me.scale.draw();
      }

      me.drawDatasets(easingValue);

      me._drawTooltip(easingValue);

      plugins.notify(me, 'afterDraw', [easingValue]);
    },

    /**
     * @private
     */
    transition: function (easingValue) {
      var me = this;

      for (var i = 0, ilen = (me.data.datasets || []).length; i < ilen; ++i) {
        if (me.isDatasetVisible(i)) {
          me.getDatasetMeta(i).controller.transition(easingValue);
        }
      }

      me.tooltip.transition(easingValue);
    },

    /**
     * Draws all datasets unless a plugin returns `false` to the `beforeDatasetsDraw`
     * hook, in which case, plugins will not be called on `afterDatasetsDraw`.
     * @private
     */
    drawDatasets: function (easingValue) {
      var me = this;

      if (plugins.notify(me, 'beforeDatasetsDraw', [easingValue]) === false) {
        return;
      } // Draw datasets reversed to support proper line stacking


      for (var i = (me.data.datasets || []).length - 1; i >= 0; --i) {
        if (me.isDatasetVisible(i)) {
          me.drawDataset(i, easingValue);
        }
      }

      plugins.notify(me, 'afterDatasetsDraw', [easingValue]);
    },

    /**
     * Draws dataset at index unless a plugin returns `false` to the `beforeDatasetDraw`
     * hook, in which case, plugins will not be called on `afterDatasetDraw`.
     * @private
     */
    drawDataset: function (index, easingValue) {
      var me = this;
      var meta = me.getDatasetMeta(index);
      var args = {
        meta: meta,
        index: index,
        easingValue: easingValue
      };

      if (plugins.notify(me, 'beforeDatasetDraw', [args]) === false) {
        return;
      }

      meta.controller.draw(easingValue);
      plugins.notify(me, 'afterDatasetDraw', [args]);
    },

    /**
     * Draws tooltip unless a plugin returns `false` to the `beforeTooltipDraw`
     * hook, in which case, plugins will not be called on `afterTooltipDraw`.
     * @private
     */
    _drawTooltip: function (easingValue) {
      var me = this;
      var tooltip = me.tooltip;
      var args = {
        tooltip: tooltip,
        easingValue: easingValue
      };

      if (plugins.notify(me, 'beforeTooltipDraw', [args]) === false) {
        return;
      }

      tooltip.draw();
      plugins.notify(me, 'afterTooltipDraw', [args]);
    },
    // Get the single element that was clicked on
    // @return : An object containing the dataset index and element index of the matching element. Also contains the rectangle that was draw
    getElementAtEvent: function () {},
    getElementsAtEvent: function () {},
    getElementsAtXAxis: function () {},
    getElementsAtEventForMode: function () {},
    getDatasetAtEvent: function () {},
    getDatasetMeta: function (datasetIndex) {
      var me = this;
      var dataset = me.data.datasets[datasetIndex];

      if (!dataset._meta) {
        dataset._meta = {};
      }

      var meta = dataset._meta[me.id];

      if (!meta) {
        meta = dataset._meta[me.id] = {
          type: null,
          data: [],
          dataset: null,
          controller: null,
          hidden: null,
          // See isDatasetVisible() comment
          xAxisID: null,
          yAxisID: null
        };
      }

      return meta;
    },
    getVisibleDatasetCount: function () {},
    isDatasetVisible: function (datasetIndex) {
      var meta = this.getDatasetMeta(datasetIndex); // meta.hidden is a per chart dataset hidden flag override with 3 states: if true or false,
      // the dataset.hidden value is ignored, else if null, the dataset hidden state is returned.

      return typeof meta.hidden === 'boolean' ? !meta.hidden : !this.data.datasets[datasetIndex].hidden;
    },
    generateLegend: function () {},

    /**
     * @private
     */
    destroyDatasetMeta: function () {},
    destroy: function () {},
    toBase64Image: function () {},
    initToolTip: function () {
      var me = this;
      me.tooltip = new Tooltip({
        _chart: me,
        _chartInstance: me,
        // deprecated, backward compatibility
        _data: me.data,
        _options: me.options.tooltips
      }, me);
    },

    /**
     * @private
     */
    bindEvents: function () {
      var me = this;
      var listeners = me._listeners = {};

      var listener = function () {};

      helpers.each(me.options.events, function () {}); // Elements used to detect size change should not be injected for non responsive charts.
      // See https://github.com/chartjs/Chart.js/issues/2210

      if (me.options.responsive) {
        listener = function () {
          me.resize();
        };

        platform.addEventListener(me, 'resize', listener);
        listeners.resize = listener;
      }
    },

    /**
     * @private
     */
    unbindEvents: function () {},
    updateHoverStyle: function () {},

    /**
     * @private
     */
    eventHandler: function () {},

    /**
     * Handle an event
     * @private
     * @param {IEvent} event the event to handle
     * @return {Boolean} true if the chart needs to re-render
     */
    handleEvent: function () {}
  });
  /**
   * Provided for backward compatibility, use Chart instead.
   * @class Chart.Controller
   * @deprecated since version 2.6.0
   * @todo remove at version 3
   * @private
   */

  Chart.Controller = Chart;
};
