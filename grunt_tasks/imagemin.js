
/**
 * imagemin
 * Minify images
 */

module.exports = function (grunt) {

	return {

		options: {
			optimizationLevel: 5
		},

		dev: {
			files: [{
				cwd: '<%= sourceImages %>',
				src: '**/*.*',
				dest: '<%= localImages %>',
				expand: true
			}]
		},

		dist: {
			files: [{
				cwd: '<%= sourceImages %>',
				src: '**/*.*',
				dest: '<%= publicImages %>',
				expand: true
			}]
		}

	};

};