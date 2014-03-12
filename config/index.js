'use strict';

//====================================================================

module.exports = function (webbox) {
	require('fs').readdirSync(__dirname).sort().forEach(function (file) {
		// Skips `index.js` and files with name starting with a `_`.
		if (/^(?:_|index.js$)/.test(file))
		{
			return;
		}

		require(__dirname +'/'+ file).call(webbox, webbox);
	});
};
