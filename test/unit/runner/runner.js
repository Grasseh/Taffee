/* global describe, it */
const assert = require('assert');
const sinon = require('sinon');
const TestRunner = require('../../../src/runner/TestRunner');

class TestDescriptorStub {
    constructor(invoker, tests, testFileName, markdown){
        this.invoker = invoker;
        this.tests = tests;
        this.testFileName = testFileName;
        this.mardown = markdown;
    }

    getInvoker(){
        return this.invoker;
    }

    getTests(){
        return this.tests;
    }

    getTestFileName(){
        return this.testFileName;
    }

    getMarkdown(){
        return this.markdown;
    }
}

class TestStub {
    constructor(name, testClass, expectedResult, parameters){
        this.name = name;
        this.testClass = testClass;
        this.expectedResult = expectedResult;
        this.parameters = parameters;
    }

    getTestName(){
        return this.name;
    }

    getTestClass(){
        return this.testClass;
    }

    getExpectedResult(){
        return this.expectedResult;
    }

    getParameters(){
        return this.parameters;
    }
}

class TestSuiteResultStub {
    constructor(tests, markdown) {
        this.tests = tests;
        this.markdown = markdown;
    }

    getTests() {
        return this.tests;
    }

    getMarkdown() {
        return this.markdown;
    }
}

class TestResultStub {
    constructor(test, success, actualResult) {
        this.success = success;
        this.actualResult = actualResult;
        this.test = test;
    }

    isSuccess() {
        return this.success;
    }

    getActualResult() {
        return this.actualResult;
    }

    getTest() {
        return this.test;
    }
}

describe('Runner Unit', function() {
    describe('run', function() {
        it('Can handle a passing and a failing test!', function() {
            let testA = new TestStub('test A', 'a', 'Hello World');
            let testB = new TestStub('test B', 'b', 'Hello Wool');
            let testParams = new TestStub('test params', 'c', '2', {a:'1', b:'1'});
            let tests = [testA, testB, testParams];
            let descriptor = new TestDescriptorStub('invoker', tests);
            let TestRunnerStub = TestRunner;
            let invokerStub = {
                invoke : sinon.stub().returns('Hello World')
            };
            TestRunnerStub.prototype._getInvoker = sinon.stub().returns(invokerStub);
            let runner = new TestRunnerStub(descriptor);
            sinon.stub(runner, '_getTestResult').returns(TestResultStub);
            sinon.stub(runner, '_getTestSuiteResult').returns(TestSuiteResultStub);
            let result = runner.run();
            assert.strictEqual(invokerStub.invoke.lastCall.args[2]['params']['a'], '1');
            assert.strictEqual(invokerStub.invoke.lastCall.args[2]['params']['b'], '1');
            assert(result.getTests()[0].isSuccess());
            assert(!result.getTests()[1].isSuccess());
        });
    });
});
