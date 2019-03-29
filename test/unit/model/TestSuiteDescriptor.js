/* global describe, it */
const assert = require('assert');

const TestSuiteDescriptor = require('../../../src/model/TestSuiteDescriptor');

describe('TestSuiteDescriptor', function() {
    let testSuiteDescriptor = null;
    let blankTest = {name:'Blank test', expected:'', params:{}};

    describe('constructor', function() {
        it('can be instanciated', function() {
            testSuiteDescriptor = new TestSuiteDescriptor(`${__filename}`);
            assert.notStrictEqual(testSuiteDescriptor, null);
        });
    });

    describe('getTestFileName', function() {
        it('return the test filename', function() {
            assert.strictEqual(testSuiteDescriptor.getTestFileName(), `${__filename}`);
        });
    });

    describe('getTests', function() {
        it('return the tests associated', function() {
            assert.strictEqual(typeof testSuiteDescriptor.getTests(), 'object');
        });
    });

    describe('addTest', function() {
        it('add a test to the list', function() {
            testSuiteDescriptor.addTest(blankTest);
            assert.strictEqual(testSuiteDescriptor.getTests().length, 1);
        });
    });
});
