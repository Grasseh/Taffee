/* global describe, it */
const assert = require('assert');

const MarkdownParser = require('../../src/interpreter/MarkdownParser');

describe('MarkdownParser', function() {
    describe('parseFile', function() {
        it('returns testsuitedescriptor with correct invoker and # of tests', function() {
            let markdownParser = new MarkdownParser();
            let descriptor = markdownParser.parseFile(`${__dirname}/artifacts/markdown/test1.md`);
            assert.strictEqual(descriptor.getInvoker(), 'PhpInvoker');
            assert.strictEqual(descriptor.getTests().length, 2);
        });
    });
});
