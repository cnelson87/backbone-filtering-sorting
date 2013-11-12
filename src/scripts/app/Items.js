
var Item = Backbone.Model.extend({});

var Items = Backbone.Collection.extend({
	model: Item,
	//url: '/data/data.json',
	comparator: 'id'
});

module.exports = Items;
