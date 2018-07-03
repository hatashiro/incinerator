'use strict';

var helpers = require('../helpers/index');

module.exports = function (Chart) {
  var arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];
  /**
   * Hooks the array methods that add or remove values ('push', pop', 'shift', 'splice',
   * 'unshift') and notify the listener AFTER the array has been altered. Listeners are
   * called on the 'onData*' callbacks (e.g. onDataPush, etc.) with same arguments.
   */

  function listenArrayEvents(array, listener) {
    if (array._chartjs) {
      array._chartjs.listeners.push(listener);

      return;
    }

    Object.defineProperty(array, '_chartjs', {
      configurable: true,
      enumerable: false,
      value: {
        listeners: [listener]
      }
    });
    arrayEvents.forEach(function (key) {
      Object.defineProperty(array, key, {
        configurable: true,
        enumerable: false,
        value: function () {}
      });
    });
  }
  /**
   * Removes the given array event listener and cleanup extra attached properties (such as
   * the _chartjs stub and overridden methods) if array doesn't have any more listeners.
   */


  // Base class for all dataset controllers (line, bar, etc)
  Chart.DatasetController = function (chart, datasetIndex) {
    this.initialize(chart, datasetIndex);
  };

  helpers.extend(Chart.DatasetController.prototype, {
    /**
     * Element type used to generate a meta dataset (e.g. Chart.element.Line).
     * @type {Chart.core.element}
     */
    datasetElementType: null,

    /**
     * Element type used to generate a meta data (e.g. Chart.element.Point).
     * @type {Chart.core.element}
     */
    dataElementType: null,
    initialize: function (chart, datasetIndex) {
      var me = this;
      me.chart = chart;
      me.index = datasetIndex;
      me.linkScales();
      me.addElements();
    },
    updateIndex: function () {},
    linkScales: function () {},
    getDataset: function () {
      return this.chart.data.datasets[this.index];
    },
    getMeta: function () {
      return this.chart.getDatasetMeta(this.index);
    },
    getScaleForId: function () {},
    reset: function () {},

    /**
     * @private
     */
    destroy: function () {},
    createMetaDataset: function () {
      var me = this;
      var type = me.datasetElementType;
      return type && new type({
        _chart: me.chart,
        _datasetIndex: me.index
      });
    },
    createMetaData: function (index) {
      var me = this;
      var type = me.dataElementType;
      return type && new type({
        _chart: me.chart,
        _datasetIndex: me.index,
        _index: index
      });
    },
    addElements: function () {
      var me = this;
      var meta = me.getMeta();
      var data = me.getDataset().data || [];
      var metaData = meta.data;
      var i, ilen;

      for (i = 0, ilen = data.length; i < ilen; ++i) {
        metaData[i] = metaData[i] || me.createMetaData(i);
      }

      meta.dataset = meta.dataset || me.createMetaDataset();
    },
    addElementAndReset: function () {},
    buildOrUpdateElements: function () {
      var me = this;
      var dataset = me.getDataset();
      var data = dataset.data || (dataset.data = []); // In order to correctly handle data addition/deletion animation (an thus simulate
      // real-time charts), we need to monitor these data modifications and synchronize
      // the internal meta data accordingly.

      if (me._data !== data) {

        listenArrayEvents(data, me);
        me._data = data;
      } // Re-sync meta data in case the user replaced the data array or if we missed
      // any updates and so make sure that we handle number of datapoints changing.


      me.resyncElements();
    },
    update: helpers.noop,
    transition: function (easingValue) {
      var meta = this.getMeta();
      var elements = meta.data || [];
      var ilen = elements.length;
      var i = 0;

      for (; i < ilen; ++i) {
        elements[i].transition(easingValue);
      }

      if (meta.dataset) {
        meta.dataset.transition(easingValue);
      }
    },
    draw: function () {
      var meta = this.getMeta();
      var elements = meta.data || [];
      var ilen = elements.length;
      var i = 0;

      if (meta.dataset) {
        meta.dataset.draw();
      }

      for (; i < ilen; ++i) {
        elements[i].draw();
      }
    },
    removeHoverStyle: function () {},
    setHoverStyle: function () {},

    /**
     * @private
     */
    resyncElements: function () {
      var me = this;
      var meta = me.getMeta();
      var data = me.getDataset().data;
      var numMeta = meta.data.length;
      var numData = data.length;

      if (numData < numMeta) {
        meta.data.splice(numData, numMeta - numData);
      } else if (numData > numMeta) {
        me.insertElements(numMeta, numData - numMeta);
      }
    },

    /**
     * @private
     */
    insertElements: function () {},

    /**
     * @private
     */
    onDataPush: function () {},

    /**
     * @private
     */
    onDataPop: function () {},

    /**
     * @private
     */
    onDataShift: function () {},

    /**
     * @private
     */
    onDataSplice: function () {},

    /**
     * @private
     */
    onDataUnshift: function () {}
  });
  Chart.DatasetController.extend = helpers.inherits;
};
