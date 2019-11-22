
import { Interceptor } from '@kronos-integration/interceptor';

/**
 *
 */
export class DecodeJSONInterceptor extends Interceptor {
  static get name() {
    return 'decode-json';
  }

  receive(request) {
    return this.connected(JSON.parse(request));
  }
}
