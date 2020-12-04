import { isEndpoint } from "./endpoint.mjs";
import { ReceivableEndpoint } from "./receivable-endpoint.mjs";

/**
 * Sending Endpoint.
 * Can only hold one connection.
 * Back connections to any further endpoints will not be established
 * @param {string} name endpoint name
 * @param {Object} owner of the endpoint (service)
 * @param {Object} options
 * @param {Endpoint} [options.connected] where te requests are delivered to
 * @param {Function} [options.didConnect] called after receiver is present
 */
export class SendEndpoint extends ReceivableEndpoint {
  constructor(name, owner, options = {}) {
    super(name, owner, options);
    if (isEndpoint(options.connected)) {
      this.addConnection(options.connected);
    }
  }

  /**
   * We are always _out_
   * @return {boolean} always true
   */
  get isOut() {
    return true;
  }

  get isOpen() {
    return this._connection !== undefined;
  }

  getConnectionState(other) {
    return other === this._connection ? this._state : undefined;
  }

  setConnectionState(other, state) {
    if (other === this._connection) {
      this._state = state;
    }
  }

  addConnection(other, backpointer) {
    if (this._connection === other) {
      return;
    }

    if (!this.connectable(other)) {
      throw new Error(
        `Can't connect ${this.direction} to ${other.direction}: ${this.identifier} = ${other.identifier}`
      );
    }

    if (this._connection !== undefined) {
      // do not break standing connection if only setting backpinter
      if (backpointer) {
        return;
      }

      throw new Error(`Already connected to: ${this._connection.identifier}`);
    }

    this.removeConnection(this._connection, backpointer);

    this._connection = other;

    if (!backpointer) {
      other.addConnection(this, true);
    }
  }

  removeConnection(other, backpointer) {
    this.closeConnection(other);

    if (!backpointer && other !== undefined) {
      other.removeConnection(this, true);
    }
    this._connection = undefined;
  }

  *connections() {
    if (this._connection) {
      yield this._connection;
    }
  }

  async send(...args) {
    if (this._connection === undefined) {
      throw new Error(`${this.identifier} is not connected`);
    }
    if (!this._connection.isOpen) {
      throw new Error(
        `${this.identifier}: ${this._connection.identifier} is not open`
      );
    }

    const interceptors = this.interceptors;
    let c = 0;

    const next = async (...args) =>
      c >= interceptors.length
        ? this._connection.receive(...args)
        : interceptors[c++].receive(this, next, ...args);

    return next(...args);
  }
}
