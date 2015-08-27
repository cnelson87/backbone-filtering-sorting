
/**
 * concat
 * Concatenate files.
 */

module.exports = function (grunt) {

	// list all vendor libs
	var vendorLibs = [
		'<%= sourceVendor %>/modernizr.custom.min.js',
		'<%= sourceVendor %>/jquery.min.js',
		'<%= sourceVendor %>/jquery.touchSwipe.min.js',
		'<%= sourceVendor %>/picturefill.min.js',
		'<%= sourceVendor %>/underscore.min.js',
		'<%= sourceVendor %>/backbone.min.js',
		'<%= sourceVendor %>/backbone-super.min.js',
		'<%= sourceVendor %>/class.js',
		'<%= sourceScripts %>/shims/classList.js'
	];

	return {

		options: {
			separator: '\n\n'
		},

		devlibs: {
			src: vendorLibs,
			dest: '<%= localScripts %>/vendor.js'
		},

		distlibs: {
			src: vendorLibs,
			dest: '<%= publicScripts %>/vendor.js'
		}

	};

};