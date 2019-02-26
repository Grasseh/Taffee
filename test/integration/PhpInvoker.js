/* global describe, it */
const assert = require('assert');
const path = require('path');
const PhpInvoker = require('../../src/invoker/PhpInvoker');

describe('PhpInvoker Integration', function() {
    describe('invoke', function() {
        it('Should load the test module and invoke its test function', function() {
            let phpInvoker = new PhpInvoker();
            let testName = 'myTestFn';
            let options = {
                className : 'Test'
            };
            let projectName = path.join(process.cwd(), 'test', 'integration', 'my artifacts', 'testModule.php');
            let testResult = phpInvoker.invoke(testName, projectName, options);
            assert.strictEqual(testResult, 'Hello World');
        });
    });
});

