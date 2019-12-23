
import { Interceptor } from '@kronos-integration/interceptor';

/**
 *
 */
export class DecodeJSONInterceptor extends Interceptor {
  static get name() {
    return 'decode-json';
  }

  async receive(endpoint, next, request) {
    return JSON.stringify(await next(JSON.parse(request)));
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
    return JSON.parse(await next(JSON.stringify(request)));
  }
}
