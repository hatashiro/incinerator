'use strict';

var helpers = require('../helpers/index');

var Element = function (configuration) {
  helpers.extend(this, configuration);
  this.initialize.apply(this, arguments);
};

helpers.extend(Element.prototype, {
  initialize: function () {
    this.hidden = false;
  },
  pivot: function () {
    var me = this;

    if (!me._view) {
      me._view = helpers.clone(me._model);
    }

    me._start = {};
    return me;
  },
  transition: function (ease) {
    var me = this;
    var model = me._model;
    var start = me._start;
    var view = me._view; // No animation -> No Transition

    if (!model || ease === 1) {
      me._view = model;
      me._start = null;
      return me;
    }

    if (!view) {
      view = me._view = {};
    }

    if (!start) {
      start = me._start = {};
    }

    return me;
  },
  tooltipPosition: function () {},
  hasValue: function () {}
});
Element.extend = helpers.inherits;
module.exports = Element;
