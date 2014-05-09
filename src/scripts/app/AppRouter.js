
var getAjaxContent = require('../utils/GetAjaxContent');
var DataTableView = require('./DataTableView');
var Items = require('./Items');

var AppRouter = Backbone.Router.extend({

	dataTableView: null,

	items: null,

	routes: {
		"": "defaultRoute",
		":genre": "processRoute",
		":genre/": "processRoute",
		":genre/:filter": "processRoute",
		"*_": "defaultRoute"
	},

	initialize: function() {

		//this.dataTableView = new DataTableView();

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
		console.log(data[0]);

		this.items = new Items(data);
		// this.items = new Items();
		// this.items.add(data);


		this.dataTableView = new DataTableView({
			collection: this.items
		});


		//this.dataTableView.collection = items;
		this.dataTableView.sortData();






		// Fetch some items from the url
		//this.items.fetch({reset: true});

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
