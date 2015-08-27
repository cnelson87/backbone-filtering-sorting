
/**
 * includereplace
 * Grunt task to include files and replace variables to build HTML pages.
 */

module.exports = function (grunt) {

	return {

		dev: {
			options: {
				globals: {
					"meta-title": "<%= metaTitle %>",
					"file-name": "<%= assetName %>"
				},
				includesDir: '<%= sourceIncludes %>'
			},
			files: [{
				cwd: '<%= sourceHTML %>/',
				src: ['**/*.html', '!_includes/*.html'],
				dest: '<%= localPath %>/',
				expand: true
			}]
		},

		dist: {
			options: {
				globals: {
					"meta-title": "<%= metaTitle %>",
					"file-name": "<%= assetName %>"
				},
				includesDir: '<%= sourceIncludes %>'
			},
			files: [{
				cwd: '<%= sourceHTML %>/',
				src: ['**/*.html', '!_includes/*.html'],
				dest: '<%= publicPath %>/',
				expand: true
			}]
		}

	};

};