import { LimitingInterceptor } from "@kronos-integration/interceptor";

export function nameIt(name) {
  return {
    warn(...args) { console.log(...args);},
    toString() {
      return name;
    },
    get name() {
      return name;
    },
    endpointIdentifier(e) {
      if (name === undefined) return undefined;
      return `${this.name}.${e.name}`;
    },
    instantiateInterceptor(interceptorDef)
    {
      return new LimitingInterceptor(interceptorDef); 
    } 
  };
}

export function checkEndpoint(t, endpoint, expected, checkOpposite = false) {
  expected = {
    direction: undefined,
    isDefault: false,
    hasInterceptors: false,
    ...expected
  };

  for (const [name, v] of Object.entries(expected)) {
    const rv =
      endpoint[name] instanceof Function ? endpoint[name]() : endpoint[name];
    const ev = expected[name];

    switch (name) {
      case "interceptors":
        for (let i = 0; i < ev.length; i++) {
          checkInterceptor(t, rv[i], ev[i], i);
        }
        break;

      default:
        if (Array.isArray(ev) || typeof ev === "object") {
          t.deepEqual(rv, ev, name);
        } else {
          t.is(rv, ev, name);
        }
    }
  }
}

export function checkInterceptor(t, interceptor, expected, i) {
  t.is(interceptor.type, expected.type, `interceptor type [${i}]`);
}

export async function wait(msecs = 1000) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), msecs));
}


export function ept(t, factory, options, expected) {
  let e;

  try {
    e = new factory("e", nameIt("o"), options);
  } catch (error) {
    t.is(error.message, expected);
    return;
  }

  checkEndpoint(
    t,
    e,
    {
      toString: "service(o).e",
      identifier: "service(o).e",
      ...expected
    },
    true
  );
}

ept.title = (providedTitle = "", factory, config) =>
  `endpoint ${providedTitle} ${factory.name} ${JSON.stringify(config)}`.trim();
