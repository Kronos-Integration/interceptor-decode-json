/* jslint node: true, esnext: true */

'use strict';

const pcs = require('parse-concat-stream');

import {
	Interceptor
}
from 'kronos-interceptor';

/**
 *
 */
class DecodeJSONInterceptor extends Interceptor {
	static get name() {
		return 'decode-json';
	}

	receive(request, args) {
		return new Promise((fullfilled, rejected) =>
			request.payload.pipe(pcs((err, data) => {
				if (err) {
					rejected(err);
				} else {
					fullfilled({
						data: data
					});
				}
			})));
	}
}


function registerWithManager(manager) {
	manager.registerInterceptor(DecodeJSONInterceptor);
}

export {
	DecodeJSONInterceptor,
	registerWithManager
};
