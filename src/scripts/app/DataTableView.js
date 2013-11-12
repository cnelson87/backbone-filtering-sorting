
var templateDataTable = require('../../templates/data-table.hbs');
var templateDataTableTbody = require('../../templates/data-table-tbody.hbs');

var DataTableView = Backbone.View.extend({

	template: templateDataTable,

	templateTbody: templateDataTableTbody,

	collection: null,

	events: {
		'click th': 'sortColumns'
	},

	initialize: function() {
		this.$el = $('#data-target');
		this.$el.html(this.template());
		this.$tbody = this.$el.find('tbody');
	},

	sortColumns: function(e) {
		var $target = $(e.currentTarget);
		var key = $target.data('key');
		var $allTHs = this.$el.find('th');
		var $triggers = $allTHs.filter('[data-key=' + key + ']');
		var sortClass = $triggers.hasClass('sort-ascending') ? 'sort-descending' : 'sort-ascending';
		var direction = $triggers.hasClass('sort-ascending') ? 'desc' : 'asc';
		// if ($triggers.hasClass('sort-ascending')) {
		// 	var sortClass = 'sort-descending';
		// 	var direction = 'desc';
		// } else {
		// 	var sortClass = 'sort-ascending';
		// 	var direction = 'asc';
		// }

		$allTHs.removeClass('sort-ascending sort-descending');

		$triggers.addClass(sortClass);

		this.sortData(key, direction);

	},

	sortData: function(key, dir) {
		var sortKey = key || 'id';
		var sortDir = dir || 'asc';

		// console.log(sortDir);
		// console.log(sortKey);

		this.collection.comparator = function(model) {
			return model.get(key);
		}
		if (sortDir === 'desc') {
			//console.log('desc!');
			this.collection.set(this.collection.models.reverse());
		} else {
			//console.log('asc!');
			this.collection.sort();
		}

		this.render();
	},

	render: function() {
		//console.log(this.collection.models);
		this.$tbody.html(this.templateTbody(this.collection.models));
		//return this.$el;
	}

});

module.exports = DataTableView;
