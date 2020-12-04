import { Endpoint } from "./endpoint.mjs";

/**
 * Dummy endpoints are used duiring construction of the endpoint mesh.
 *
 */
export class DummyReceiveEndpoint extends Endpoint {
  /**
   * dummy does nothing by intention
   */
  async receive() {}

  /**
   * @return {boolean} true
   */
  get isIn() {
    return true;
  }

  get isOpen() {
    return true;
  }

  /**
   * Indicate whatever we are a dummy endpoint.
   * Dummy endpoints are used duiring construction of the endpoint mesh.
   * @return {boolean} true
   */
  get isDummy() {
    return true;
  }
}
