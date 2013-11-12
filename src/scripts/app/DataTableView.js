
var templateDataTable = require('../../templates/data-table.hbs');

var DataTableView = Backbone.View.extend({

	template: templateDataTable,

	collection: null,

	events: {
		'click th': 'sortColumns'
	},

	initialize: function() {
		var self = this;
		this.$el = $('#data-target');
	},

	render: function() {
		//console.log(this.collection.models);
		this.$el.html(this.template(this.collection.models));
		return this.$el;
	},

	sortColumns: function(e) {
		var $target = $(e.currentTarget);
		var key = $target.data('key');
		var $allTHs = this.$el.find('th');
		var $triggers = $allTHs.filter('[data-key=' + key + ']');
		var sortClass = $triggers.hasClass('sort-ascending') ? 'sort-descending' : 'sort-ascending';

		$allTHs.removeClass('sort-ascending sort-descending');

		$triggers.addClass(sortClass);

		this.sortData(key);

	},

	sortData: function(key) {
		var sortKey = key || 'Name';

		console.log(sortKey);

		// this.collection.comparator = key;
		// this.collection.sort();


		this.render();
	}

});

module.exports = DataTableView;
