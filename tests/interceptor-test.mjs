import test from "ava";
import { dummyEndpoint, interceptorTest } from "@kronos-integration/test-interceptor";
import { Interceptor } from "@kronos-integration/interceptor";

test(
  interceptorTest,
  Interceptor,
  undefined,
  { type: "Interceptor", json: { type: 'Interceptor'} },
  dummyEndpoint("ep1"),
  [1,2,3],
  (...args) => args.map(x => x * x),
  async (t, interceptor, e, next, result) => {
    t.deepEqual(result,[1,4,9]);
  }
);

/*
test(
  interceptorTest,
  StatsCollectorInterceptor,
  dummyEndpoint("ep1"),
  {},
  "collect-request-stats",
  async (t, interceptor, withConfig) => {
    t.deepEqual(interceptor.toJSON(), {
      type: "collect-request-stats"
    });

    if (!withConfig) return;

    interceptor.connected = dummyEndpoint("ep");
    interceptor.connected.receive = testResponseHandler;

  
    await interceptor.receive({
      delay: 10
    });

    t.is(interceptor.numberOfRequests, 1);
    t.is(interceptor.numberOfFailedRequests, 0);
    t.is(interceptor.maxRequestProcessingTime, 10, 10);
    t.is(interceptor.minRequestProcessingTime, 10, 10);
    t.is(interceptor.totalRequestProcessingTime, 10, 10);

    try {
      await interceptor.receive({
        delay: 2,
        reject: true
      });

      throw new Error('expected to be not fullfilled');
    } catch (e) {
      t.is(interceptor.numberOfRequests, 2);
      t.is(interceptor.numberOfFailedRequests, 1);
    }
    
  }
);
*/
