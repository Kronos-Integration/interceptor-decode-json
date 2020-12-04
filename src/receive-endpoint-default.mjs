import { ReceiveEndpoint } from "./receive-endpoint.mjs";

/**
 * Receive Endpoint acting as a default endpoints
 */
export class ReceiveEndpointDefault extends ReceiveEndpoint {
  /**
   * We are a default endpoint
   * @return {boolean} always true
   */
  get isDefault() {
    return true;
  }
}
