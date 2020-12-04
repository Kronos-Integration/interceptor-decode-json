import { Interceptor } from './interceptor.mjs';

/**
 * Interceptor to collect processing time, number of
 * processed and failed requests.
 */
export class StatsCollectorInterceptor extends Interceptor {
  /**
   * @return {string} 'collect-request-stats'
   */
  static get name() {
    return 'collect-request-stats';
  }

  reset() {
    this._numberOfRequests = 0;
    this._numberOfFailedRequests = 0;
    this._minRequestProcessingTime = Number.MAX_VALUE;
    this._maxRequestProcessingTime = 0;
    this._totalRequestProcessingTime = 0;
  }

  get numberOfRequests() {
    return this._numberOfRequests;
  }

  get numberOfFailedRequests() {
    return this._numberOfFailedRequests;
  }

  get maxRequestProcessingTime() {
    return this._maxRequestProcessingTime;
  }

  get minRequestProcessingTime() {
    return this._minRequestProcessingTime;
  }

  get totalRequestProcessingTime() {
    return this._totalRequestProcessingTime;
  }

  /**
   * Logs the time the requests takes
   */
  async receive(endpoint,...args) {
    this._numberOfRequests += 1;

    const start = new Date();

    try {
      const response = await this.connected.receive(...args);
      const now = new Date();
      const pt = now - start;
      this._totalRequestProcessingTime += pt;

      if (pt > this._maxRequestProcessingTime) {
        this._maxRequestProcessingTime = pt;
      }

      if (pt < this._minRequestProcessingTime) {
        this._minRequestProcessingTime = pt;
      }

      endpoint.logger.debug(`took ${pt} ms for ${[...args]}`);
      return response;
    } catch (err) {
      this._numberOfFailedRequests += 1;
      throw err;
    }
  }
}
