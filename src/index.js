'use strict';

//====================================================================

var fs = require('fs');

//--------------------------------------------------------------------

var bluebird = require('bluebird');

//--------------------------------------------------------------------

var webServer = require('./webserver');

//====================================================================

// Iterates sequentially through an array with an iterator which may
// returns promises.
var asyncEach = function (array, iterator) {
	var i = 0;
	var n = array.length;

	return bluebird.cast(function looper() {
		if (i >= n)
		{
			return;
		}

		var cur = i++;
		return bluebird.cast(iterator(array[cur], cur, array)).then(looper);
	});
};

// Extracted from https://github.com/substack/camelize/blob/e38b6aa03bdd586cd190544515e25d6f9d965a09/index.js#L16-L20
var camelize = function (str) {
	return str.replace(/[_.-](\w|$)/g, function (_, x) {
		return x.toUpperCase();
	});
};

var condMiddleware =

//====================================================================

var WebBox = function () {
	if (!(this instanceof WebBox))
	{
		return new WebBox();
	}

	this._server = webServer.create(function (req, res) {
		var ctx = {
			// Node objects.
			req: req,
			res: res,

			// High level message data.
			to: null,
			subject: null,
			body: null,
			data: null,
		};
		asyncEach(this._middlewares, function (middleware) {
			return middleware.call(ctx);
		});
	}.bind(this));
	this._middlewares = [];
};

var proto = WebBox.prototype;

// Creates loaders for available middlewares.
fs.readdirSync(__dirname +'/middlewares').forEach(function (file) {
	var name = file;

	// Removes extension.
	var index = name.lastIndexOf('.');
	if (index !== -1)
	{
		name = name.substring(0, index);
	}

	name = camelize(name);

	Object.defineProperty(proto, name, {
		configurable: true,
		enumerable: true,
		get: function () {
			var middleware = proto[name] = require('./middlewares/'+ file);
			return middleware;
		},
		set: function (value) {
			delete proto[name];
			proto[name] = value;
		},
	});
});

proto.listen = function (options) {
	this._server.listen(options);
};

// Registers a middleware.
proto.use = function (filter, middleware) {
	if (arguments.length === 1)
	{
		middleware = filter;
		filter = null;
	}

	if (!filter)
	{
		this._middlewares.push(middleware);
		return;
	}

	this._middlewares.push(); // #TODO
};

// Exposes a method to easily create promises.
proto.defer = bluebird.defer;

//====================================================================

module.exports = WebBox;
