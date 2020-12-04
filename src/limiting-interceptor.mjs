import { mergeAttributes, createAttributes } from "model-attributes";
import { Interceptor } from "./interceptor.mjs";

/**
 * Limits the number of concurrent requests.
 * Requests can be delayed or rejected.
 * Sample config:
 * [
 *  { count: 20 },
 *  { count: 10, delay:  100 },
 *  { count:  5, delay:   10 }
 * ]
 *  1 -  4 : no delay
 *  5 -  9 : 10ms delay
 * 10 - 19 : 100ms delay
 * 20      : reject
 * default is to reject when more than 10 requests are on the way
 */
export class LimitingInterceptor extends Interceptor {
  /**
   * @return {string} 'request-limit'
   */
  static get name() {
    return "request-limit";
  }

  static get configurationAttributes() {
    return mergeAttributes(
      createAttributes({
        limits: {
          default: [
            {
              count: 10
            }
          ],
          count: {
            type: "unsigned-integer"
          },
          delay: {
            type: "duration"
          }
        }
      }),
      Interceptor.configurationAttributes
    );
  }

  constructor(config) {
    super(config);

    this.limits =
      config && config.limits
        ? config.limits
        : [
            {
              count: 10
            }
          ];
  }

  toJSON() {
    const json = super.toJSON();
    json.limits = this.limits;
    return json;
  }

  reset() {
    this.ongoingResponses = new Set();
    this.ongoingRequests = 0;
  }

  async receive(endpoint, next, ...args) {
    //console.log(`got #${this.ongoingRequests}`);

    for (const limit of this.limits) {
      if (this.ongoingRequests >= limit.count) {
        if (limit.delay === undefined) {
          throw new Error(`Limit of ongoing requests ${limit.count} reached`);
        }

        //console.log(`-> delay ${limit.delay}`);
        this.ongoingRequests += 1;

        return new Promise((resolve, reject) =>
          setTimeout(
            () => resolve(this._processRequest(next, ...args)),
            limit.delay
          )
        );
      }
    }

    this.ongoingRequests += 1;

    return this._processRequest(next, ...args);
  }

  _processRequest(next, ...args) {
    const currentResponse = next(...args).finally(() => {
      this.ongoingResponses.delete(currentResponse);
      this.ongoingRequests -= 1;
    });

    this.ongoingResponses.add(currentResponse);

    return currentResponse;
  }
}
