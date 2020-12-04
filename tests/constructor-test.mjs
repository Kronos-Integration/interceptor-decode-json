import test from "ava";
import { nameIt, ept } from "./helpers/util.mjs";

import { LimitingInterceptor } from "@kronos-integration/interceptor";

import {
  Endpoint,
  SendEndpoint,
  SendEndpointDefault,
  MultiSendEndpoint,
  ReceiveEndpoint,
  DummyReceiveEndpoint,
  ReceiveEndpointDefault,
  ReceiveEndpointSelfConnectedDefault
} from "@kronos-integration/endpoint";

test(ept, Endpoint, undefined, {});

const SendEndpointExpectations = {
  direction: "out",
  toString: "service(o).e(out)",
  toJSON: { out: true },
  interceptors: []
};

test(ept, SendEndpoint, undefined, SendEndpointExpectations);
test(ept, SendEndpoint, {}, SendEndpointExpectations);

test(ept, MultiSendEndpoint, undefined, SendEndpointExpectations);
test(ept, MultiSendEndpoint, {}, SendEndpointExpectations);

test(
  ept,
  SendEndpoint,
  {
    interceptors: [
      LimitingInterceptor,
      { type: LimitingInterceptor, limits: [{ count: 5 }] },
      { type: "request-limit", limits: [{ count: 3 }] }
    ]
  },
  {
    ...SendEndpointExpectations,
    toJSON: {
      ...SendEndpointExpectations.toJSON,
      interceptors: [
        {
          type: "request-limit",
          limits: [
            {
              count: 10
            }
          ]
        },
        {
          type: "request-limit",
          limits: [
            {
              count: 5
            }
          ]
        },
        {
          type: "request-limit",
          limits: [
            {
              count: 3
            }
          ]
        }
      ]
    },
    hasInterceptors: true,
    interceptors: [{ type: "request-limit" }]
  }
);

test(
  ept,
  SendEndpoint,
  { connected: new SendEndpoint("c", nameIt("o")) },
  "Can't connect out to out: service(o).e = service(o).c"
);

const otherReceiver = new ReceiveEndpoint("c", nameIt("o"));
test(
  ept,
  SendEndpoint,
  { connected: otherReceiver },
  {
    ...SendEndpointExpectations,
    toJSON: {
      ...SendEndpointExpectations.toJSON,
      connected: "service(o).c",
      open: true
    },
    toString: "service(o).e(connected=service(o).c,out,open)"
  }
);

test(ept, SendEndpointDefault, undefined, {
  ...SendEndpointExpectations,
  isDefault: true
});

const ReceiveEndpointExpectations = {
  direction: "in",
  toJSON: { in: true },
  toString: "service(o).e(in)"
};

test(ept, ReceiveEndpoint, undefined, ReceiveEndpointExpectations);
test(ept, ReceiveEndpoint, {}, ReceiveEndpointExpectations);

test(ept, DummyReceiveEndpoint, {}, {...ReceiveEndpointExpectations,
  toJSON: { in: true, dummy: true, open: true },
  toString: "service(o).e(in,open,dummy)"});

test(
  ept,
  ReceiveEndpoint,
  { connected: new ReceiveEndpoint("c", nameIt("o")) },
  "Can't connect in to in: service(o).e = service(o).c"
);

test(
  "with receiver",
  ept,
  ReceiveEndpoint,
  { receive: async x => {} },
  {
    ...ReceiveEndpointExpectations,
    toString: "service(o).e(in,open)",
    toJSON: { ...ReceiveEndpointExpectations.toJSON, open: true }
  }
);

test(ept, ReceiveEndpointDefault, undefined, {
  ...ReceiveEndpointExpectations,
  isDefault: true,
  hasConnections: false
});

test(ept, ReceiveEndpointSelfConnectedDefault, undefined, {
  ...ReceiveEndpointExpectations,
  direction: "inout",
  toString: "service(o).e(connected=service(o).e,inout)",
  toJSON: {
    ...ReceiveEndpointExpectations.toJSON,
    out: true,
    connected: "service(o).e"
  },
  isDefault: true
});
