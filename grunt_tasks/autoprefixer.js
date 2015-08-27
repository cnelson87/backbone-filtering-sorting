
/**
 * autoprefixer
 * Add vendor-prefixed CSS properties
 */

module.exports = function (grunt) {

	return {

		dev: {
			options: {
				browsers: ['last 2 versions', 'ie 9'],
				map: true
			},
			files: [{
				src: '<%= localStyles %>/<%= assetName %>.css',
				dest: '<%= localStyles %>/<%= assetName %>.css'
			}]
		},

		dist: {
			options: {
				browsers: ['last 2 versions', 'ie 9'],
				map: false
			},
			files: [{
				src: '<%= publicStyles %>/<%= assetName %>.css',
				dest: '<%= publicStyles %>/<%= assetName %>.css'
			}]
		}

	};

};