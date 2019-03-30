/* global describe, it */
const assert = require('assert');

const TestSuiteDescriptor = require('../../../src/model/TestSuiteDescriptor');

describe('TestSuiteDescriptor Unit', function() {
    let testSuiteDescriptor = null;
    let blankTest = {name:'Blank test', expected:'', params:{}};

    describe('constructor', function() {
        it('Should return an instance', function() {
            testSuiteDescriptor = new TestSuiteDescriptor(`${__filename}`);
            assert.notStrictEqual(testSuiteDescriptor, null);
        });
    });

    describe('getTestFileName', function() {
        it('Should return the name of the test file', function() {
            assert.strictEqual(testSuiteDescriptor.getTestFileName(), `${__filename}`);
        });
    });

    describe('getTests', function() {
        it('Should return a list of tests', function() {
            assert.strictEqual(typeof testSuiteDescriptor.getTests(), 'object');
        });
    });

    describe('addTest', function() {
        it('Should add a test to the descriptor', function() {
            testSuiteDescriptor.addTest(blankTest);
            assert.strictEqual(testSuiteDescriptor.getTests().length, 1);
        });
    });
});
