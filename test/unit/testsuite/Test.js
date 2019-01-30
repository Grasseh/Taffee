/* global describe, it */
const assert = require('assert');

const Test = require('../../../src/testsuite/Test');

describe('Test', function() {
    let test = null;

    describe('constructor', function() {
        it('can be instanciated', function() {
            test = new Test('Test1', 'OK', {key1: 'value1'});
            assert.notStrictEqual(test, null);
        });
    });

    describe('getTestName', function() {
        it('return its name', function() {
            assert.strictEqual(test.getTestName(), 'Test1');
        });
    });

    describe('getExpectedResult', function() {
        it('return its expected results', function() {
            assert.strictEqual(test.getExpectedResult(), 'OK');
        });
    });

    describe('getParameters', function() {
        it('return its parameters', function() {
            assert.deepEqual(test.getParameters(), {key1: 'value1'});
        });
    });
});
