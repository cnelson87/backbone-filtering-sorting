
 module.exports = function(grunt) {

	'use strict';

	var path		= require('path');
	var cwd			= process.cwd();
	var pkg			= grunt.file.readJSON('package.json');

	require('load-grunt-config')(grunt, {
		configPath: path.join(cwd,'grunt_tasks'),
		init: true,
		data: {

			// Pkg data
			pkg			: pkg,
			pkgName		: pkg.name,
			metaTitle	: pkg.title,
			pkgDesc		: pkg.description,
			assetName	: pkg.namespace,
			portNum		: pkg.portNumber,
			lrPortNum	: pkg.livereloadPortNum,

			// source file paths
			sourcePath			: './src',
			sourceAssets		: '<%= sourcePath %>/assets',
			sourceData			: '<%= sourcePath %>/data',
			sourceHTML			: '<%= sourcePath %>/html',
			sourceIncludes		: '<%= sourceHTML %>/_includes',
			sourceAudio			: '<%= sourceAssets %>/audio',
			sourceVideo			: '<%= sourceAssets %>/video',
			sourceFonts			: '<%= sourceAssets %>/fonts',
			sourceImages		: '<%= sourceAssets %>/images',
			sourceScripts		: '<%= sourcePath %>/scripts',
			sourceStyles		: '<%= sourcePath %>/styles',
			sourceTemplates		: '<%= sourcePath %>/templates',
			sourceVendor		: '<%= sourcePath %>/vendor',

			// local file paths
			localPath			: './_builds/local',
			localData			: '<%= localPath %>/_api',
			localAssets			: '<%= localPath %>/_assets',
			localAudio			: '<%= localAssets %>/audio',
			localVideo			: '<%= localAssets %>/video',
			localFonts			: '<%= localAssets %>/fonts',
			localImages			: '<%= localAssets %>/images',
			localScripts		: '<%= localAssets %>/scripts',
			localStyles			: '<%= localAssets %>/styles',

			// public file paths
			publicPath			: './_builds/public',
			publicData			: '<%= publicPath %>/_api',
			publicAssets		: '<%= publicPath %>/_assets',
			publicAudio			: '<%= publicAssets %>/audio',
			publicVideo			: '<%= publicAssets %>/video',
			publicFonts			: '<%= publicAssets %>/fonts',
			publicImages		: '<%= publicAssets %>/images',
			publicScripts		: '<%= publicAssets %>/scripts',
			publicStyles		: '<%= publicAssets %>/styles',

			// temp file paths (not currently used)
			tempPath			: './_builds/temp'

		},
		loadGruntTasks: {
			config: require('./package.json'),
			scope: 'devDependencies',
			pattern: 'grunt-*'
		}
	});


	// Register custom tasks
	grunt.registerTask('build', 'generate a build', function(target) {
		var target = (target === 'dev') ? 'dev' : 'dist';
		var tasks = [
			'clean:' + target,
			'includereplace:' + target,
			'copy:' + target,
			'sass:' + target,
			'autoprefixer:' + target,
			'jshint',
			'concat:' + target + 'libs',
			'browserify:' + target
		];
		// optimize for dist build only
		if (target === 'dist') {
			tasks.push('cssmin');
			tasks.push('uglify');
		}
		grunt.task.run(tasks);
	});
	grunt.registerTask('run', ['build:dev', 'connect', 'watch']);


};
