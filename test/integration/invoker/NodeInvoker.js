/* global describe, it */
const assert = require('assert');
const path = require('path');
const NodeInvoker = require('../../../src/invoker/NodeInvoker');

describe('NodeInvoker Integration', function() {
    describe('invoke', function() {
        it('Should load the test module and invoke its test function', function() {
            let nodeInvoker = new NodeInvoker();
            let testName = 'myTestFn';
            let params = [1, 2];
            let projectName = path.join(process.cwd(), 'test', 'integration', 'artifacts', 'invoker', 'testModule');
            let testResult = nodeInvoker.invoke(testName, projectName, params);
            assert.strictEqual(testResult, 'Hello World');
        });

        it('Should load the test module and invoke its test function with two parameters', function() {
            let nodeInvoker = new NodeInvoker();
            let testName = 'otherFun';
            let options = {params : {a : 1, b : 2}};
            let projectName = path.join(process.cwd(), 'test', 'integration', 'artifacts', 'invoker', 'testModule');
            let testResult = nodeInvoker.invoke(testName, projectName, options);
            assert.strictEqual(testResult, 3);
        });

        it('Should work with folder names containing spaces', function() {
            let nodeInvoker = new NodeInvoker();
            let testName = 'otherFun';
            let options = {params : {a : 1, b : 2}};
            let projectName = path.join(process.cwd(), 'test', 'integration', 'artifacts', 'invoker', 'spaced directory', 'testModule');
            let testResult = nodeInvoker.invoke(testName, projectName, options);
            assert.strictEqual(testResult, 3);
        });
    });
});

