
var Item = Backbone.Model.extend({});

var Items = Backbone.Collection.extend({
	model: Item,
	//url: '/data/data.json',
	comparator: 'id',
	initialize: function() {
		var self = this;
		this.sort();
	}
});

module.exports = Items;
