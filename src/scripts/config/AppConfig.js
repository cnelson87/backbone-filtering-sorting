/**
 * Application Config
 * @author Chris Nelson
 */

if (!window.location.origin) {
	window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

var AppConfig = {

	siteUrl: window.location.origin,
	isIE9: navigator.userAgent.indexOf('MSIE 9') !== -1,
	hasFormValidation: typeof document.createElement('input').checkValidity === 'function',
	hasTouch: Modernizr.touch,

	isMobileView: null,
	isTabletView: null,
	isDesktopView: null,
	currentBreakpoint: null,
	breakpoints: {
		1: 'mobile',
		2: 'tablet',
		3: 'desktop'
	}

};

module.exports = AppConfig;
