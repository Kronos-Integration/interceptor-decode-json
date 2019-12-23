
import { Interceptor } from '@kronos-integration/interceptor';

/**
 *
 */
export class DecodeJSONInterceptor extends Interceptor {
  static get name() {
    return 'decode-json';
  }

  async receive(endpoint, next, request) {
    const response = await (request === undefined ? next(undefined): next(JSON.parse(request)));
    return response === undefined ? undefined : JSON.stringify(response);
  }
}

/**
 *
 */
export class EncodeJSONInterceptor extends Interceptor {
  static get name() {
    return 'encode-json';
  }

  async receive(endpoint, next, request) {
    const response = await (request === undefined ? next() : next(JSON.stringify(request)));
    return response === undefined ? undefined : JSON.parse(response); 
  }
}
