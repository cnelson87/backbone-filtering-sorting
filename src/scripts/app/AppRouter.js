
var getAjaxContent = require('../utilities/GetAjaxContent');
var templateDataTable = require('../../templates/data-table.hbs');
var DataTableView = require('./DataTableView');
var Items = require('./Items');

var AppRouter = Backbone.Router.extend({

	routes: {
		"": "defaultRoute",
		":genre": "processRoute",
		":genre/": "processRoute",
		":genre/:filter": "processRoute",
		"*_": "defaultRoute"
	},

	initialize: function() {

		this.dataTableView = new DataTableView();

		this.getData();

	},

	getData: function() {
		var self = this;

		$.when(getAjaxContent('/data/data.json')).done(function(response) {
			self.processData(response);
		}).fail(function(error) {
			console.log(error);
		});

	},

	processData: function(data) {
		var self = this;
		// var len = data.length;
		// var tmplDataTable = templateDataTable;
		// var $elTarget = $('#data-target');
		// var $elTable;



		// $elTarget.html(tmplDataTable(data));
		// $elTable = $elTarget.find('table');

		// var Item = Backbone.Model.extend({});

		// var Items = Backbone.Collection.extend({
		// 	model: Item,
		// 	url: '/data/data.json'
		// });

		var items = new Items();
		items.add(data);

		this.dataTableView.collection = items;
		this.dataTableView.sortData();






		// Fetch some items from the url
		//items.fetch({reset: true});

		Backbone.history.start();

	},

	processRoute: function(filter1) {

		switch(filter1) {
			case 'Kids':
				this.someRoute();
				break;
			case 'Teens':
				this.someRoute();
				break;
			case 'Adults':
				this.someRoute();
				break;
			case 'Family':
				this.someRoute();
				break;
			default:
				this.defaultRoute();
		}

	},

	someRoute: function() {



	},

	defaultRoute: function() {



	}

});

module.exports = AppRouter;
