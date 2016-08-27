/* global describe, it, xit */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  fs = require('fs'),
  path = require('path'),
  kti = require('kronos-test-interceptor'),
  JSONDecodeInterceptor = require('../decode-json').decode;

const mochaInterceptorTest = kti.mochaInterceptorTest,
  testResponseHandler = kti.testResponseHandler;

const logger = {
  debug(a) {
    console.log(a);
  }
};

/* simple owner with name */
function dummyEndpoint(name) {
  return {
    get name() {
      return name;
    },
    get path() {
      return '/get:id';
    },
    toString() {
      return this.name;
    },
    step: logger
  };
}

describe('interceptors', () => {
  const ep = dummyEndpoint('ep');

  mochaInterceptorTest(JSONDecodeInterceptor, ep, {}, 'decode-json', (itc, withConfig) => {
    if (!withConfig) return;

    describe('json', () => {
      it('toJSON', () => {
        assert.deepEqual(itc.toJSON(), {
          type: 'decode-json'
        });
      });
    });

    itc.connected = dummyEndpoint('ep');
    itc.connected.receive = testResponseHandler;

    it('passing request', () => itc.receive({
      payload: fs.createReadStream(path.join(__dirname, 'fixtures/simple.json'))
    }).then((response) => {
      assert.deepEqual(response, {
        data: {
          a: 1
        }
      });
    }));
  });
});
