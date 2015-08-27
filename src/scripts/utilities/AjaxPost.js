/**
 *  AjaxPost
 *  @author Chris Nelson
 *	Returns an Ajax POST response using deferred, url & data are required,
 *  contentType, dataType, and crossDomain are optional.
 *  @return: json, html, text
 */

var AjaxPost = function(url, data, contentType, dataType, crossDomain) {
	return $.ajax({
		type: 'POST',
		url: url,
		data: data,
		contentType: 'application/json; charset=utf-8',
		dataType: dataType || 'json',
		crossDomain: crossDomain || false
	});
};

module.exports = AjaxPost;
