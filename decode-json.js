/* jslint node: true, esnext: true */

'use strict';

const pcs = require('parse-concat-stream'),
	Interceptor = require('kronos-interceptor').Interceptor;

/**
 *
 */
class DecodeJSONInterceptor extends Interceptor {
	static get name() {
		return 'decode-json';
	}

	get type() {
		return DecodeJSONInterceptor.name;
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

exports.decode = DecodeJSONInterceptor;
exports.registerWithManager = manager => manager.registerInterceptor(DecodeJSONInterceptor);
