/* global describe, it */
const assert = require('assert');
const path = require('path');
const PhpInvoker = require('../../../src/invoker/PhpInvoker');

describe('PhpInvoker Integration', function() {
    describe('invoke', function() {
        it('Should load the test module and invoke its test function', function() {
            let phpInvoker = new PhpInvoker();
            let testName = 'myTestFn';
            let options = {
                className : 'Test',
                params : {a : 1, b : 2}
            };
            let projectName = path.join(process.cwd(), 'test', 'integration', 'artifacts', 'invoker', 'testModule.php');
            let testResult = phpInvoker.invoke(testName, projectName, options);
            assert.strictEqual(testResult, 'Hello World');
        });

        it('Should work with a directory name containing spaces', function() {
            let phpInvoker = new PhpInvoker();
            let testName = 'myTestFn';
            let options = {
                className : 'Test',
                params : {a : 1, b : 2}
            };
            let projectName = path.join(process.cwd(), 'test', 'integration', 'artifacts', 'invoker', 'spaced directory', 'testModule.php');
            let testResult = phpInvoker.invoke(testName, projectName, options);
            assert.strictEqual(testResult, 'Hello World');
        });

        it('Should invoke a function with parameters', function() {
            let phpInvoker = new PhpInvoker();
            let testName = 'add';
            let options = {
                className : 'Test',
                params : {a : 1, b : 2}
            };
            let projectName = path.join(process.cwd(), 'test', 'integration', 'artifacts', 'invoker', 'testModule.php');
            let testResult = phpInvoker.invoke(testName, projectName, options);
            assert.strictEqual(testResult, '3');
        });
    });
});

