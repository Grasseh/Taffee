/* global describe, it */
const assert = require('assert');

const MarkdownParser = require('../../src/interpreter/MarkdownParser');

describe('MarkdownParser', function() {
    describe('parseFile', function() {
        it('returns testsuitedescriptor with correct invoker, # of tests and amount/value of parameters', function() {
            let markdownParser = new MarkdownParser();
            let descriptor = markdownParser.parseFile(`${__dirname}/artifacts/markdown-interpreter/test2.md`);
            assert.strictEqual(descriptor.getInvoker(), 'PhpInvoker');
            assert.strictEqual(descriptor.getTests().length, 2);
            assert.strictEqual(descriptor.getTests()[1].getParameters().length, 2);
            assert.strictEqual(descriptor.getTests()[1].getParameters()[0], '1');
            assert.strictEqual(descriptor.getTests()[1].getParameters()[1], '1');
        });
    });
});
