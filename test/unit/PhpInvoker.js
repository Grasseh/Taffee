/* global describe, it */
const assert = require('assert');
const sinon = require('sinon');
const PhpInvoker = require('../../src/invoker/PhpInvoker');

describe('NodeInvoker', function() {
    describe('invoke', function() {
        it('Should return Hello world', function() {
            let phpInvoker = new PhpInvoker();
            let endVal = 'Hello World';
            let getCwdStub = sinon.stub(phpInvoker, '_getCwd').returns('myPath');
            let execStub = sinon.stub(phpInvoker, '_exec').returns({ toString : () => {
                return endVal;
            }});
            let testName = 'myTest';
            let projectName = '~/myProject/test.js';
            let params = {className : 'abc'};
            let testResult = phpInvoker.invoke(testName, projectName, params);
            assert(getCwdStub.called);
            assert(execStub.called);
            assert.strictEqual(testResult, endVal);
        });
    });
});

