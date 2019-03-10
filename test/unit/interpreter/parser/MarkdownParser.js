/* global describe, it */
const assert = require('assert');

const MarkdownParser = require('../../../../src/interpreter/MarkdownParser');

describe('MarkdownParser', function() {
    describe('parseFile', function() {
        it('returns testsuitedescriptor with correct invoker and # of tests', function() {
            let markdownParser = new MarkdownParser();
            let descriptor = markdownParser.parseFile(`${__dirname}/artifacts/test.md`);
            assert.strictEqual(descriptor.getInvoker(), 'NiceInvoker');
            assert.strictEqual(descriptor.getTests().length, 4);
            assert.strictEqual(descriptor.getTests()[0].getTestClass(), 'a');
            assert.strictEqual(descriptor.getTests()[0].getTestName(), 'pass');
            assert.strictEqual(descriptor.getTests()[1].getTestClass(), 'a');
            assert.strictEqual(descriptor.getTests()[1].getTestName(), 'pass');
            assert.strictEqual(descriptor.getTests()[2].getTestClass(), 'a');
            assert.strictEqual(descriptor.getTests()[2].getTestName(), 'pass');
            assert.strictEqual(descriptor.getTests()[2].getParameters().length, 1);
            assert.strictEqual(descriptor.getTests()[2].getParameters()[0], 'A');
            assert.strictEqual(descriptor.getTests()[3].getTestClass(), 'a');
            assert.strictEqual(descriptor.getTests()[3].getTestName(), 'pass');
            assert.strictEqual(descriptor.getTests()[3].getParameters().length, 2);
            assert.strictEqual(descriptor.getTests()[3].getParameters()[0], 'B');
            assert.strictEqual(descriptor.getTests()[3].getParameters()[1], 'C');
        });
    });

    describe('empty markdown', function() {
        it('returns testsuitedescriptor with no tests', function() {
            let markdownParser = new MarkdownParser();
            let descriptor = markdownParser.parseFile(`${__dirname}/artifacts/noElements.md`);
            assert.strictEqual(descriptor.getTests().length, 0);
        });
    });
});
