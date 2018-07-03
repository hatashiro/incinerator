'use strict';

/**
 * Helper function to get relative position for an event
 * @param {Event|IEvent} event - The event to get the position for
 * @param {Chart} chart - The chart
 * @returns {Point} the event position
 */


/**
 * @interface IInteractionOptions
 */

/**
 * If true, only consider items that intersect the point
 * @name IInterfaceOptions#boolean
 * @type Boolean
 */

/**
 * Contains interaction related functions
 * @namespace Chart.Interaction
 */
module.exports = {
  // Helper function for different modes
  modes: {
    single: function () {},

    /**
     * @function Chart.Interaction.modes.label
     * @deprecated since version 2.4.0
     * @todo remove at version 3
     * @private
     */

    /**
     * Returns items at the same index. If the options.intersect parameter is true, we only return items if we intersect something
     * If the options.intersect mode is false, we find the nearest item and return the items at the same index as that item
     * @function Chart.Interaction.modes.index
     * @since v2.4.0
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @param options {IInteractionOptions} options to use during interaction
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */

    /**
     * Returns items in the same dataset. If the options.intersect parameter is true, we only return items if we intersect something
     * If the options.intersect is false, we find the nearest item and return the items in that dataset
     * @function Chart.Interaction.modes.dataset
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @param options {IInteractionOptions} options to use during interaction
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    dataset: function () {},

    /**
     * @function Chart.Interaction.modes.x-axis
     * @deprecated since version 2.4.0. Use index mode and intersect == true
     * @todo remove at version 3
     * @private
     */
    'x-axis': function () {},

    /**
     * Point mode returns all elements that hit test based on the event position
     * of the event
     * @function Chart.Interaction.modes.intersect
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    point: function () {},

    /**
     * nearest mode returns the element closest to the point
     * @function Chart.Interaction.modes.intersect
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @param options {IInteractionOptions} options to use
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    nearest: function () {},

    /**
     * x mode returns the elements that hit-test at the current x coordinate
     * @function Chart.Interaction.modes.x
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @param options {IInteractionOptions} options to use
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    x: function () {},

    /**
     * y mode returns the elements that hit-test at the current y coordinate
     * @function Chart.Interaction.modes.y
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @param options {IInteractionOptions} options to use
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    y: function () {}
  }
};
