
var Item = Backbone.Model.extend({});

var Items = Backbone.Collection.extend({
	model: Item,
	//url: '/_api/data.json',
	comparator: 'id'
});

module.exports = Items;
