/* global describe, it */
const assert = require('assert');

const TestResult = require('../../../src/testsuite/TestResult');

describe('TestResult', function() {
    let testResult = null;
    let blankTest = {name:'Blank test', expected:'', params:{}};

    describe('constructor', function() {
        it('can be instanciated', function() {
            testResult = new TestResult(blankTest, true, 'OK');
            assert.notStrictEqual(testResult, null);
        });
    });

    describe('getTest', function() {
        it('return the Test', function() {
            assert.deepEqual(testResult.getTest(), blankTest);
        });
    });

    describe('isSuccess', function() {
        it('return if the test is a success', function() {
            assert.strictEqual(testResult.isSuccess(), true);
        });
    });

    describe('getActualResult', function() {
        it('return the actual result', function() {
            assert.equal(testResult.getActualResult(), 'OK');
        });
    });
});
