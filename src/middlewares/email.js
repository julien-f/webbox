'use strict';

//====================================================================

var nodemailer = require('nodemailer');

//====================================================================

// Extracts a member from an object.
var extract = function (object, key) {
	var value = object[key];
	delete object[key];
	return value;
};

//====================================================================

// Available options:
// - `transport`: required, https://github.com/andris9/Nodemailer/blob/master/README.md#setting-up-a-transport-method
// - `from`: optional, address the mails will be sent from;
// - `to`: address where the mail will be sent (default to current recipient);
module.exports = function (opts) {
	var transport = (function () {
		var transportOpts = extract(opts, 'transport');
		var transportType = extract(transportOpts, 'type');

		return nodemailer.createTransport(transportType, transportOpts);
	})();

	return function () {
		var message = {
			from: opts.from,
			to: opts.to || this.to,
			subject: this.subject,
			text: this.body,
		};

		var deferred = this.defer();

		transport.sendMail(message, function (error, response) {
			if (error)
			{
				return deferred.reject(error);
			}
			deferred.resolve(response);
		});

		return deferred.promise;
	};
};
