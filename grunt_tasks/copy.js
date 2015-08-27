
/**
 * copy
 * Copy files and folders.
 */

module.exports = function (grunt) {

	return {

		data: {
			files: [{
				cwd: '<%= sourceData %>',
				src: '**/*.json',
				dest: '<%= localData %>',
				expand: true
			}]
		},

		images: {
			files: [{
				cwd: '<%= sourceImages %>',
				src: '**/*.*',
				dest: '<%= localImages %>',
				expand: true
			}]
		},

		dev: {
			files: [
				{
					cwd: '<%= sourceData %>',
					src: '**/*.json',
					dest: '<%= localData %>',
					expand: true
				},
				{
					cwd: '<%= sourceFonts %>',
					src: '**/*.*',
					dest: '<%= localFonts %>',
					expand: true
				},
				{
					cwd: '<%= sourceImages %>',
					src: '**/*.*',
					dest: '<%= localImages %>',
					expand: true
				}
			]
		},

		dist: {
			files: [
				{
					cwd: '<%= sourceData %>',
					src: '**/*.json',
					dest: '<%= publicData %>',
					expand: true
				},
				{
					cwd: '<%= sourceFonts %>',
					src: '**/*.*',
					dest: '<%= publicFonts %>',
					expand: true
				},
				{
					cwd: '<%= sourceImages %>',
					src: '**/*.*',
					dest: '<%= publicImages %>',
					expand: true
				}
			]
		}

	};

};