/* global describe, it */
const assert = require('assert');
const path = require('path');
const sinon = require('sinon');
const PhpInvoker = require('../../../src/invoker/PhpInvoker');

describe('PhpInvoker Unit', function() {
    describe('invoke', function() {
        it('Should return Hello world', function() {
            let phpInvoker = new PhpInvoker();
            let endVal = 'Hello World';
            let fsStub = {
                existsSync : sinon.stub(),
                mkdirSync : sinon.stub(),
                writeFileSync : sinon.stub(),
                unlinkSync : sinon.stub()
            };
            sinon.stub(phpInvoker, '_getFs').returns(fsStub);
            let getCwdStub = sinon.stub(phpInvoker, '_getCwd').returns('myPath');
            let execStub = sinon.stub(phpInvoker, '_exec').returns({ toString : () => {
                return endVal;
            }});
            let testName = 'myTest';
            let projectName = '~/myProject/test.js';
            let paramsFile = path.join('myPath', 'tmp', 'params.json');
            let params = {className : 'abc', params : {}};
            let testResult = phpInvoker.invoke(testName, projectName, params);
            let invokerPathName = path.join('myPath', 'src', 'invoker', 'PhpInvoker.php');
            assert(getCwdStub.called);
            assert(execStub.calledWith(`php "${invokerPathName}" ${testName} ${params.className} "${projectName}" "${paramsFile}"`, {}));
            assert.strictEqual(testResult, endVal);
        });
    });
});

