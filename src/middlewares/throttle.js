'use strict';

//====================================================================

// This plugin should be run after any query parsers to ensures the
// necessary fields are set.
module.exports = function () {
	var

	return function () {
		assert.string(this.to, 'to');
		assert.string(this.subject, 'subject');
		assert.string(this.body, 'body');
		assert.object(this.data, 'data');
	};
};
