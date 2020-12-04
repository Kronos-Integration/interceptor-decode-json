import { MultiConnectionEndpoint } from "./multi-connection-endpoint.mjs";

/**
 * Multiple Sending Endpoint.
 * Can hold several connections.
 * Back connections to any further endpoints will not be established
 * @param {string} name endpoint name
 * @param {Object} owner of the endpoint (service)
 * @param {Object} options
 * @param {Endpoint} [options.connected] where te requests are delivered to
 * @param {Function} [options.didConnect] called after receiver is present
 */
export class MultiSendEndpoint extends MultiConnectionEndpoint {

  /**
   * We are always _out_
   * @return {boolean} always true
   */
  get isOut() {
    return true;
  }

  send(...args) {
    const interceptors = this.interceptors;

    for (const connection of this.connections()) {
      if (connection.isOpen && connection.isIn) {
        let c = 0;

        const next = async (...args) =>
          c >= interceptors.length
            ? connection.receive(...args)
            : interceptors[c++].receive(this, next, ...args);

        next(...args);
      }
    }
  }

  async * sendAndReceive(...args) {
    const interceptors = this.interceptors;

    for (const connection of this.connections()) {
      if (connection.isOpen) {
        let c = 0;

        const next = async (...args) =>
          c >= interceptors.length
            ? connection.receive(...args)
            : interceptors[c++].receive(this, next, ...args);

        yield next(...args);
      }
    }
  }
}
