const pcs = require('parse-concat-stream');

import { Interceptor } from 'kronos-interceptor';

/**
 *
 */
export class DecodeJSONInterceptor extends Interceptor {
  static get name() {
    return 'decode-json';
  }

  receive(request, args) {
    return new Promise((resolve, reject) =>
      request.payload.pipe(
        pcs((err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              data: data
            });
          }
        })
      )
    );
  }
}

export function registerWithManager(manager) {
  return manager.registerInterceptor(DecodeJSONInterceptor);
}
