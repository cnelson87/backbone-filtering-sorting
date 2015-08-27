/**
 *  ResizeEndEvent
 *  @author Chris Nelson
 *	Broadcasts a pseudo 'resizeEnd' event
 */

var AppConfig			= require('config/AppConfig');
var AppEvents			= require('config/AppEvents');
var PubSub				= require('utilities/PubSub');

var ResizeEndEvent = function() {
	var resizeTimer;
	$(window).on('resize', function(event) {
		//PubSub.trigger(AppEvents.WINDOW_RESIZE);
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			PubSub.trigger(AppEvents.WINDOW_RESIZE_END);
		}, 100);
	});
};

module.exports = ResizeEndEvent;
