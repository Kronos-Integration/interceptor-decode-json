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
    return new Promise((fullfilled, rejected) =>
      request.payload.pipe(
        pcs((err, data) => {
          if (err) {
            rejected(err);
          } else {
            fullfilled({
              data: data
            });
          }
        })
      )
    );
  }
}

export function registerWithManager(manager) {
  manager.registerInterceptor(DecodeJSONInterceptor);
}
