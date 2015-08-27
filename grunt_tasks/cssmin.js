
/**
 * cssmin
 * Minify CSS
 */

module.exports = function (grunt) {

	return {

		dist: {
			files: [{
				src: '<%= publicStyles %>/<%= assetName %>.css',
				dest: '<%= publicStyles %>/<%= assetName %>.css'
			}]
		}

	};

};