/* global describe, it */
const assert = require('assert');

const TestResult = require('../../../src/model/TestResult');

describe('TestResult Unit', function() {
    let testResult = null;
    let blankTest = {name:'Blank test', expected:'', params:{}};

    describe('constructor', function() {
        it('Should return an instance', function() {
            testResult = new TestResult(blankTest, true, 'OK');
            assert.notStrictEqual(testResult, null);
        });
    });

    describe('getTest', function() {
        it('Should return the associated test', function() {
            assert.deepEqual(testResult.getTest(), blankTest);
        });
    });

    describe('isSuccess', function() {
        it('Should return the success of the test', function() {
            assert.strictEqual(testResult.isSuccess(), true);
        });
    });

    describe('getActualResult', function() {
        it('Should return the actual result', function() {
            assert.equal(testResult.getActualResult(), 'OK');
        });
    });
});
