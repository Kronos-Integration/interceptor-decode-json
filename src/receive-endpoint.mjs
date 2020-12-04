import { MultiConnectionEndpoint } from "./multi-connection-endpoint.mjs";

/**
 * Receiving Endpoint.
 * Can receive from several endpoints.
 * By default a dummy rejecting receiver is assigned
 * @param {string} name endpoint name
 * @param {Object} owner of the endpoint (service)
 * @param {Object} options
 * @param {Function} [options.receive] reciever function
 * @param {Endpoint} [options.connected] sending side
 */
export class ReceiveEndpoint extends MultiConnectionEndpoint {

  /**
   * We are always _in_
   * @return {boolean} always true
   */
  get isIn() {
    return true;
  }
}
