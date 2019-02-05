/* global describe, it */
const assert = require('assert');

const TestSuiteResult = require('../../../src/testsuite/TestSuiteResult');

describe('TestSuiteResult', function() {
    let testSuiteResult = null;
    let testResults = [
        {isSuccess: function(){ return true; }},
        {isSuccess: function(){ return false; }}
    ];

    describe('constructor', function() {
        it('can be instanciated', function() {
            testSuiteResult = new TestSuiteResult(testResults);
            assert.notStrictEqual(testSuiteResult, null);
        });
    });

    describe('getSuccesses', function() {
        it('return the number of successes', function() {
            assert.strictEqual(testSuiteResult.getSuccesses(), 1);
        });
    });

    describe('getFailures', function() {
        it('return the number of failures', function() {
            assert.strictEqual(testSuiteResult.getFailures(), 1);
        });
    });
});
