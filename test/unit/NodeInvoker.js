/* global describe, it */
const assert = require('assert');
const sinon = require('sinon');
const NodeInvoker = require('../../src/invoker/NodeInvoker');

describe('NodeInvoker', function() {
    describe('invoke', function() {
        it('Should return Hello world', function() {
            let nodeInvoker = new NodeInvoker();
            let loadModuleStub = sinon.stub(nodeInvoker, '_loadModule').returns(class {
                myTest() { return 'Hello world'; }
            });
            let testName = 'myTest';
            let projectName = '~/myProject/test.js';
            let params = [1, 2];
            let testResult = nodeInvoker.invoke(testName, projectName, params);
            assert(loadModuleStub.calledWith(projectName));
            assert.strictEqual(testResult, 'Hello world');
        });
    });
});

