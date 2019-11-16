
import { Interceptor } from '@kronos-integration/interceptor';

/**
 *
 */
export class DecodeJSONInterceptor extends Interceptor {
  static get name() {
    return 'decode-json';
  }

  receive(request, args) {
    return JSON.parse(request);
  }
}
