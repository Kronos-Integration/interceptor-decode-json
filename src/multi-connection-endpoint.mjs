import { isEndpoint } from "./endpoint.mjs";
import { ReceivableEndpoint } from "./receivable-endpoint.mjs";

/**
 * Multiple connection endpoint.
 * Can hold several connections.
 */
export class MultiConnectionEndpoint extends ReceivableEndpoint {
 
  constructor(name, owner, options = {}) {
    super(name, owner, options);

    this._connections = new Map();

    if (isEndpoint(options.connected)) {
      this.addConnection(options.connected);
    }
  }

  /**
   * Deliver connection state
   * @param {Entpoint} other
   * @return {any} our state for the connection to other
   */
  getConnectionState(other) {
    return this._connections.get(other);
  }

  /**
   * Set connection state
   * @param {Entpoint} other
   * @param {any} state for the connection to other
   */
  setConnectionState(other, state) {
    this._connections.set(other, state);
  }

  addConnection(other, backpointer) {
    if (!this.connectable(other)) {
      throw new Error(
        `Can't connect ${this.direction} to ${other.direction}: ${this.identifier} = ${other.identifier}`
      );
    }

    if (!this._connections.get(other)) {
      if (!backpointer) {
        other.addConnection(this, true);
      }

      this._connections.set(other, undefined); // dummy
    }
  }

  removeConnection(other, backpointer) {
    this.closeConnection(other);
    this._connections.delete(other);

    if (!backpointer) {
      other.removeConnection(this, true);
    }
  }

  /**
   * Check connectivity
   * @param {Endpoint} other
   * @return {boolean} true if we are connected with other
   */
  isConnected(other) {
    return this._connections.has(other);
  }

  /**
   * All connections
   */
  *connections() {
    yield* this._connections.keys();
  }
}
