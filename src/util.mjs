
/**
 * Expands '{{exp}}' expressions.
 * @param {any} value 
 * @param {Object} params
 * @return {any} expanded value 
 */
export function expand(value, params) {

  if (Array.isArray(value)) {
    return value.map(e => expand(e, params));
  }

  if(value === undefined || value == null || typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return value.replace(/\{\{(\w+)\}\}/, (match, g1) =>
      params[g1] ? params[g1] : g1
    );
  }

  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [
      expand(k, params),
      expand(v, params)
    ])
  );
}
