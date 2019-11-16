import { join } from "path";
import { createReadStream } from "fs";
import test from "ava";
import { interceptorTest, testResponseHandler } from "kronos-test-interceptor";
import { DecodeJSONInterceptor } from "../src/decode-json.mjs";

const logger = {
  debug(a) {
    console.log(a);
  }
};

function dummyEndpoint(name) {
  return {
    get name() {
      return name;
    },
    get path() {
      return "/get:id";
    },
    toString() {
      return this.name;
    },
    step: logger
  };
}

test(
  "basic",
  interceptorTest,
  DecodeJSONInterceptor,
  dummyEndpoint("ep1"),
  {},
  "decode-json",
  async (t, interceptor, withConfig) => {
    t.deepEqual(interceptor.toJSON(), {
      type: "decode-json"
    });

    if (!withConfig) return;

    interceptor.connected = dummyEndpoint("ep");
    interceptor.connected.receive = testResponseHandler;

    const response = await interceptor.receive(
      createReadStream(
        join(__dirname, "..", "tests", "fixtures", "simple.json")
      )
    );

    t.deepEqual(response, {
      a: 1
    });
  }
);
