/**
 *  ScrollEndEvent
 *  @author Chris Nelson
 *	Broadcasts a pseudo 'scrollEnd' event
 */

var AppConfig			= require('config/AppConfig');
var AppEvents			= require('config/AppEvents');
var PubSub				= require('utilities/PubSub');

var ScrollEndEvent = function() {
	var scrollTimer;
	$(window).on('scroll', function(event) {
		//PubSub.trigger(AppEvents.WINDOW_SCROLL);
		clearTimeout(scrollTimer);
		scrollTimer = setTimeout(function() {
			PubSub.trigger(AppEvents.WINDOW_SCROLL_END);
		}, 100);
	});
};

module.exports = ScrollEndEvent;
