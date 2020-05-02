import test from "ava";
import {
  dummyEndpoint,
  interceptorTest
} from "@kronos-integration/test-interceptor";
import { EncodeJSONInterceptor, DecodeJSONInterceptor } from "@kronos-integration/interceptor-decode-json";

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

test("handle undefined",
  interceptorTest,
  DecodeJSONInterceptor,
  undefined,
  { type: "decode-json", json: { type: "decode-json" } },
  dummyEndpoint("ep"),
  undefined,
  (request) => undefined,
  async (t, interceptor, e, next, result) => {
    t.is(result, undefined);
  }
);

test(
  interceptorTest,
  EncodeJSONInterceptor,
  undefined,
  { type: "encode-json", json: { type: "encode-json" } },
  dummyEndpoint("ep"),
  [1, 2],
  (request) => "[1,4]", //request.replace(/2/, "4"),
  async (t, interceptor, e, next, result) => {
    t.deepEqual(result, [1, 4]);
  }
);


test("handle undefined",
  interceptorTest,
  EncodeJSONInterceptor,
  undefined,
  { type: "encode-json", json: { type: "encode-json" } },
  dummyEndpoint("ep"),
  undefined,
  (request) => undefined,
  async (t, interceptor, e, next, result) => {
    t.is(result, undefined);
  }
);
