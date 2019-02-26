/* global describe, it */
const assert = require('assert');
const path = require('path');
const NodeInvoker = require('../../src/invoker/NodeInvoker');

describe('NodeInvoker Integration', function() {
    describe('invoke', function() {
        it('Should load the test module and invoke its test function', function() {
            let nodeInvoker = new NodeInvoker();
            let testName = 'myTestFn';
            let params = [1, 2];
            let projectName = path.join(process.cwd(), 'test', 'integration', 'my artifacts', 'testModule');
            let testResult = nodeInvoker.invoke(testName, projectName, params);
            assert.strictEqual(testResult, 'Hello World');
        });
    });
});

