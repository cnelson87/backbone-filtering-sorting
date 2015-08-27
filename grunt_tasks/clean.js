
/**
 * clean
 * Clean files and folders.
 */

module.exports = function (grunt) {

	return {

		dev: '<%= localPath %>',

		dist: '<%= publicPath %>',

		temp: '<%= tempPath %>'

	};

};