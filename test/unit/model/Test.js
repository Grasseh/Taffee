/* global describe, it */
const assert = require('assert');

const Test = require('../../../src/model/Test');

describe('Test Unit', function() {
    let test = null;

    describe('constructor', function() {
        it('Should return an instance', function() {
            test = new Test('Class1', 'Test1', 'OK', {key1: 'value1'});
            assert.notStrictEqual(test, null);
        });
    });

    describe('getClassName', function() {
        it('Should return the test class name', function() {
            assert.strictEqual(test.getTestClass(), 'Class1');
        });
    });

    describe('getTestName', function() {
        it('Should return the test method name', function() {
            assert.strictEqual(test.getTestName(), 'Test1');
        });
    });

    describe('getExpectedResult', function() {
        it('Should return the expected result', function() {
            assert.strictEqual(test.getExpectedResult(), 'OK');
        });
    });

    describe('getParameters', function() {
        it('Should return the test parameters', function() {
            assert.deepEqual(test.getParameters(), {key1: 'value1'});
        });
    });
});
