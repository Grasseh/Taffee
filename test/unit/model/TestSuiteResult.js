/* global describe, it */
const assert = require('assert');

const TestSuiteResult = require('../../../src/model/TestSuiteResult');

describe('TestSuiteResult Unit', function() {
    let testSuiteResult = null;
    let testResults = [
        {isSuccess: function(){ return true; }},
        {isSuccess: function(){ return false; }}
    ];

    describe('constructor', function() {
        it('Should return an instance', function() {
            testSuiteResult = new TestSuiteResult(testResults);
            assert.notStrictEqual(testSuiteResult, null);
        });
    });

    describe('getSuccesses', function() {
        it('Should return the number of successes', function() {
            assert.strictEqual(testSuiteResult.getSuccesses(), 1);
        });
    });

    describe('getFailures', function() {
        it('Should return the number of failures', function() {
            assert.strictEqual(testSuiteResult.getFailures(), 1);
        });
    });
});
