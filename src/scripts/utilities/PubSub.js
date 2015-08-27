/**
 *  PubSub
 *  @author Chris Nelson
 *	Global PubSub object for dispatch and delegation
 */

var _					= require('underscore');
var Backbone			= require('backbone');

var PubSub = {};

_.extend( PubSub, Backbone.Events );

module.exports = PubSub;
