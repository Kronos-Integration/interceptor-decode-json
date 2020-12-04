import { Interceptor } from "./interceptor.mjs";

/**
 * logs args and result
 */
export class LoggingInterceptor extends Interceptor {
  /**
   * @return {string} 'logging'
   */
  static get name() {
    return "logging";
  }

  async receive(endpoint, next, ...args) {
    const logger = endpoint.logger;
    logger.info(`${endpoint.identifier}: request ${JSON.stringify([...args])}`);

    try {
      const result = await next(...args);
      logger.info(`${endpoint.identifier}: result ${result}`);
      return result;
    } catch (e) {
      logger.error(`${endpoint.identifier}: result ${e}`);
      throw e;
    }
  }
}
