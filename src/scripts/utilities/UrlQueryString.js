/**
 *  UrlQueryString
 *  @author Chris Nelson
 *	Reads query string and returns an object of name / value pairs.
 */

var UrlQueryString = function() {
	var qs = location.search;
	var pairs = qs.slice(1).split('&');
	var result = {};
	if (!qs) return false;
	pairs.forEach(function(pair) {
		pair = pair.split('=');
		// var name = pair[0];
		// var value = decodeURIComponent(pair[1] || '');
		// result[name] = value;
		result[pair[0]] = decodeURIComponent(pair[1] || '');
	});
	return result;
};

module.exports = UrlQueryString;
