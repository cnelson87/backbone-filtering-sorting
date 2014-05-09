(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jshint eqnull: true */

module.exports.create = function() {

var Handlebars = {};

// BEGIN(BROWSER)

Handlebars.VERSION = "1.0.0";
Handlebars.COMPILER_REVISION = 4;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

var toString = Object.prototype.toString,
    functionType = '[object Function]',
    objectType = '[object Object]';

Handlebars.registerHelper = function(name, fn, inverse) {
  if (toString.call(name) === objectType) {
    if (inverse || fn) { throw new Handlebars.Exception('Arg not supported with multiple helpers'); }
    Handlebars.Utils.extend(this.helpers, name);
  } else {
    if (inverse) { fn.not = inverse; }
    this.helpers[name] = fn;
  }
};

Handlebars.registerPartial = function(name, str) {
  if (toString.call(name) === objectType) {
    Handlebars.Utils.extend(this.partials,  name);
  } else {
    this.partials[name] = str;
  }
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Missing helper: '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;

  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(conditional, options) {
  var type = toString.call(conditional);
  if(type === functionType) { conditional = conditional.call(this); }

  if(!conditional || Handlebars.Utils.isEmpty(conditional)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(conditional, options) {
  return Handlebars.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn});
});

Handlebars.registerHelper('with', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});

// END(BROWSER)

return Handlebars;
};

},{}],2:[function(require,module,exports){
exports.attach = function(Handlebars) {

// BEGIN(BROWSER)

Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = Handlebars.VM.program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common) {
          ret = {};
          Handlebars.Utils.extend(ret, common);
          Handlebars.Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var program = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    program.program = i;
    program.depth = args.length;
    return program;
  },
  program: function(i, fn, data) {
    var program = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    program.program = i;
    program.depth = 0;
    return program;
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;

// END(BROWSER)

return Handlebars;

};

},{}],3:[function(require,module,exports){
exports.attach = function(Handlebars) {

var toString = Object.prototype.toString;

// BEGIN(BROWSER)

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

var escapeChar = function(chr) {
  return escape[chr] || "&amp;";
};

Handlebars.Utils = {
  extend: function(obj, value) {
    for(var key in value) {
      if(value.hasOwnProperty(key)) {
        obj[key] = value[key];
      }
    }
  },

  escapeExpression: function(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof Handlebars.SafeString) {
      return string.toString();
    } else if (string == null || string === false) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = string.toString();

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  },

  isEmpty: function(value) {
    if (!value && value !== 0) {
      return true;
    } else if(toString.call(value) === "[object Array]" && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};

// END(BROWSER)

return Handlebars;
};

},{}],4:[function(require,module,exports){
module.exports = exports = require('handlebars/lib/handlebars/base.js').create()
require('handlebars/lib/handlebars/utils.js').attach(exports)
require('handlebars/lib/handlebars/runtime.js').attach(exports)
},{"handlebars/lib/handlebars/base.js":1,"handlebars/lib/handlebars/runtime.js":2,"handlebars/lib/handlebars/utils.js":3}],5:[function(require,module,exports){

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

},{"../utils/GetAjaxContent":9,"./DataTableView":6,"./Items":7}],6:[function(require,module,exports){

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
/*
		if ($triggers.hasClass('sort-ascending')) {
			var sortClass = 'sort-descending';
			var direction = 'desc';
		} else {
			var sortClass = 'sort-ascending';
			var direction = 'asc';
		}
*/
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
		};
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

},{"../../templates/data-table-tbody.hbs":10,"../../templates/data-table.hbs":11}],7:[function(require,module,exports){

var Item = Backbone.Model.extend({});

var Items = Backbone.Collection.extend({
	model: Item,
	//url: '/data/data.json',
	comparator: 'id'
});

module.exports = Items;

},{}],8:[function(require,module,exports){

var appRouter = require('./app/AppRouter');

$(function() {
	new appRouter();
});

},{"./app/AppRouter":5}],9:[function(require,module,exports){
/**
 *	returns an Ajax GET request using deferred, url is required, dataType is optional
 */

var GetAjaxContent = function(url, dataType) {
	return $.ajax({
		type: 'GET',
		url: url,
		dataType: dataType || 'json'
	});
};

module.exports = GetAjaxContent;

},{}],10:[function(require,module,exports){
module.exports=require("handleify").template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<tr data-id=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n			<td><a href=\"/url?id="
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.Name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></td>\n			<td>"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.City)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td>\n			<td>"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.State)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td>\n			<td class=\"hidden\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.Country)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td>\n			<td>"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.Program)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td>\n			<td>"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.Year)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td>\n			<td class=\"number\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.Amount)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td>\n		</tr>\n		";
  return buffer;
  }

  buffer += "		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  })
},{"handleify":4}],11:[function(require,module,exports){
module.exports=require("handleify").template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n	<table>\n		<thead>\n			<tr>\n				<th data-key=\"Name\">Name</th>\n				<th data-key=\"City\">City</th>\n				<th data-key=\"State\">State</th>\n				<th data-key=\"Country\" class=\"hidden\">Country</th>\n				<th data-key=\"Program\">Program</th>\n				<th data-key=\"Year\">Year</th>\n				<th data-key=\"Amount\" class=\"number\">Amount</th>\n			</tr>\n		</thead>\n		<tfoot>\n			<tr>\n				<th data-key=\"Name\">Name</th>\n				<th data-key=\"City\">City</th>\n				<th data-key=\"State\">State</th>\n				<th data-key=\"Country\" class=\"hidden\">Country</th>\n				<th data-key=\"Program\">Program</th>\n				<th data-key=\"Year\">Year</th>\n				<th data-key=\"Amount\" class=\"number\">Amount</th>\n			</tr>\n		</tfoot>\n		<tbody>\n		</tbody>\n	</table>\n";
  })
},{"handleify":4}]},{},[8])