import test from "ava";
import {
  isEndpoint,
  Endpoint,
  SendEndpoint,
  SendEndpointDefault,
  ReceiveEndpoint,
  ReceiveEndpointDefault
} from "@kronos-integration/endpoint";

function tis(t, object, expected) {
  t.is(isEndpoint(object), expected);
}

tis.title = (providedTitle = "isEndpoint", object) =>
  `${providedTitle} ${
    typeof object === "object" && object != null
      ? object.constructor.name
      : object
  }`.trim();

test(tis, undefined, false);
test(tis, null, false);
test(tis, 1, false);
test(tis, true, false);
test(tis, "endpoint", false);
test(tis, {}, false);
test(tis, new Date(), false);
test(tis, new Endpoint("X"), true);
test(tis, new SendEndpoint("X"), true);
test(tis, new SendEndpointDefault("X"), true);
test(tis, new ReceiveEndpoint("X"), true);
test(tis, new ReceiveEndpointDefault("X"), true);
