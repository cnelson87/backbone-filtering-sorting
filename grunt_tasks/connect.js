
/**
 * connect
 * Start a connect web server.
 */

module.exports = function (grunt) {

	return {

		localhost: {
			options: {
				base: '<%= localPath %>/',
				hostname: 'localhost',
				port: '<%= portNum %>',
				livereload: '<%= lrPortNum %>'
			}
		}

	};

};