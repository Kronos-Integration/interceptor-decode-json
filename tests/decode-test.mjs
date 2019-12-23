import test from "ava";
import {
  dummyEndpoint,
  interceptorTest
} from "@kronos-integration/test-interceptor";
import { EncodeJSONInterceptor, DecodeJSONInterceptor } from "../src/decode-json.mjs";

test(
  interceptorTest,
  DecodeJSONInterceptor,
  undefined,
  { type: "decode-json", json: { type: "decode-json" } },
  dummyEndpoint("ep"),
  ["[1, 2, 3]"],
  (request) => request.map(x => x * x),
  async (t, interceptor, e, next, result) => {
    t.deepEqual(result, JSON.stringify([1, 4, 9]));
  }
);

test(
  interceptorTest,
  EncodeJSONInterceptor,
  undefined,
  { type: "encode-json", json: { type: "encode-json" } },
  dummyEndpoint("ep"),
  [1, 2],
  (request) => request.replace(/2/, "4"),
  async (t, interceptor, e, next, result) => {
    t.deepEqual(result, [1, 4]);
  }
);
