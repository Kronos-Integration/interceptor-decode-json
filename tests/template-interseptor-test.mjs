import test from "ava";
import {
  interceptorTest,
  dummyEndpoint
} from "@kronos-integration/test-interceptor";
import { TemplateInterceptor } from "@kronos-integration/interceptor";

test(
  interceptorTest,
  TemplateInterceptor,
  undefined,
  { json: { type: "template", request: {} } },
  dummyEndpoint("e1"),
  [],
  query => 77,
  async (t, interceptor, endpoint, next, result, params) => {
    t.is(result, 77);
  }
);

test(
  interceptorTest,
  TemplateInterceptor,
  {
    request: {
      base: "ou=groups,dc=example,dc=de",
      scope: "sub",
      attributes: ["{{cn}}"],
      filter:
        "(&(objectclass=groupOfUniqueNames)(uniqueMember=uid={{user}},ou=accounts,dc=example,dc=de))"
    }
  },
  {
    json: {
      type: "template",
      request: {
        base: "ou=groups,dc=example,dc=de",
        scope: "sub",
        attributes: ["{{cn}}"],
        filter:
          "(&(objectclass=groupOfUniqueNames)(uniqueMember=uid={{user}},ou=accounts,dc=example,dc=de))"
      }
    }
  },
  dummyEndpoint("e1"),
  [{ user: "hugo", cn: "cn1" }],
  query => query,
  async (t, interceptor, endpoint, next, result, params) => {
    t.deepEqual(result, {
      base: "ou=groups,dc=example,dc=de",
      scope: "sub",
      attributes: ["cn1"],
      filter:
        "(&(objectclass=groupOfUniqueNames)(uniqueMember=uid=hugo,ou=accounts,dc=example,dc=de))"
    });
  }
);
