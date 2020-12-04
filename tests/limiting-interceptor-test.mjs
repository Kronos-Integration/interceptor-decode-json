import test from "ava";
import {
  dummyEndpoint,
  interceptorTest,
  wait
} from "@kronos-integration/test-interceptor";
import { LimitingInterceptor } from "@kronos-integration/interceptor";

const REQUEST_LIMIT = 2;

test(
  interceptorTest,
  LimitingInterceptor,
  {
    limits: [
      {
        count: REQUEST_LIMIT * 2
      },
      {
        count: REQUEST_LIMIT,
        delay: 10
      }
    ]
  },
  {
    type: "request-limit",
    json: {
      type: "request-limit",
      limits: [
        {
          count: 4
        },
        {
          count: 2,
          delay: 10
        }
      ]
    }
  },
  dummyEndpoint("ep1"),
  [1, 2],
  async () => 77
);

test("sending lots of request", async t => {
  const interceptor = new LimitingInterceptor({
    limits: [
      {
        count: REQUEST_LIMIT * 2
      },
      {
        count: REQUEST_LIMIT,
        delay: 10
      }
    ]
  });
  let numberOfFullfilled = 0;
  let i;

  for (i = 0; i < REQUEST_LIMIT * 5 + 1; i++) {
    try {
      const r = await interceptor.receive(
        undefined,
        async options => {
          if (options.reject) throw new Error(options);
          wait(options.delay);
          return options.id;
        },
        {
          delay: 100,
          reject: i === 2,
          id: i
        }
      );
      numberOfFullfilled += 1;
    } catch (e) {
      t.true(i === 2);
    }
  }

  t.is(numberOfFullfilled, REQUEST_LIMIT * 5);
});

/*
                  if (i >= REQUEST_LIMIT * 2) {
                    // wait for the first normal request to go trough
                    setTimeout(() => {
                      assert.equal(numberOfFullfilled, REQUEST_LIMIT * 2);
                      done();
                    }, 190);
                  }
                }
              );
*/
