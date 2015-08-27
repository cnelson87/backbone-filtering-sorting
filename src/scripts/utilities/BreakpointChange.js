/**
 *  BreakpointChange
 *  @author Chris Nelson
 *	Create pseudo 'breakpointChange' event
 */

var AppConfig				= require('config/AppConfig');
var AppEvents				= require('config/AppEvents');
var PubSub					= require('utilities/PubSub');

var BreakpointChange = function() {

	var $elIndicator = $('<div></div>',{
		'id': 'breakpoint-responder'
	}).appendTo($('body'));
	var zIndex = $elIndicator.css('z-index');

	var updateAppConfig = function() {
		AppConfig.currentBreakpoint = AppConfig.breakpoints[zIndex];
		AppConfig.isMobileView = AppConfig.currentBreakpoint === 'mobile' ? true : false;
		AppConfig.isTabletView = AppConfig.currentBreakpoint === 'tablet' ? true : false;
		AppConfig.isDesktopView = AppConfig.currentBreakpoint === 'desktop' ? true : false;
	};
	updateAppConfig();

	$(window).on('resize', function(event) {
		var newZI = $elIndicator.css('z-index');
		if (newZI !== zIndex) {
			zIndex = newZI;
			updateAppConfig();
			PubSub.trigger(AppEvents.BREAKPOINT_CHANGE, {
				breakpoint: AppConfig.currentBreakpoint,
				mobile: AppConfig.isMobileView, 
				tablet: AppConfig.isTabletView, 
				desktop: AppConfig.isDesktopView
			});
		}
	});

};

module.exports = BreakpointChange;
