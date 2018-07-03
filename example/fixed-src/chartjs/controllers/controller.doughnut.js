'use strict';

var defaults = require('../core/core.defaults');

var elements = require('../elements/index');

var helpers = require('../helpers/index');

defaults._set('doughnut', {
  animation: {
    // Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,
    // Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: false
  },
  hover: {
    mode: 'single'
  },
  legendCallback: function () {},
  legend: {
    labels: {
      generateLabels: function () {}
    },
    onClick: function () {}
  },
  // The percentage of the chart that we cut out of the middle.
  cutoutPercentage: 50,
  // The rotation of the chart, where the first data arc begins.
  rotation: Math.PI * -0.5,
  // The total circumference of the chart.
  circumference: Math.PI * 2.0,
  // Need to override these to give a nice default
  tooltips: {
    callbacks: {
      title: function () {},
      label: function () {}
    }
  }
});

defaults._set('pie', helpers.clone(defaults.doughnut));

defaults._set('pie', {
  cutoutPercentage: 0
});

module.exports = function (Chart) {
  Chart.controllers.doughnut = Chart.controllers.pie = Chart.DatasetController.extend({
    dataElementType: elements.Arc,
    linkScales: helpers.noop,
    // Get index of the dataset in relation to the visible datasets. This allows determining the inner and outer radius correctly
    getRingIndex: function () {},
    update: function () {},
    updateElement: function () {},
    calculateTotal: function () {},
    calculateCircumference: function () {},
    // gets the max border or hover width to properly scale pie charts
    getMaxBorderWidth: function () {}
  });
};