import { Interceptor } from "./interceptor.mjs";
import { mergeAttributes, createAttributes } from "model-attributes";
import { expand } from "./util.mjs";

/**
 * Map params into requests.
 */
export class TemplateInterceptor extends Interceptor {
  /**
   * @return {string} 'template'
   */
  static get name() {
    return "template";
  }

  static get configurationAttributes() {
    return mergeAttributes(
      createAttributes({
        request: {
          description: "request template",
          default: {},
          type: "object"
        }/*,
        response: {
          description: "response template",
          default: {},
          type: "object"
        }*/
      }),
      Interceptor.configurationAttributes
    );
  }

  async receive(endpoint, next, params) {
    return next(expand(this.request, params));
  }
}
