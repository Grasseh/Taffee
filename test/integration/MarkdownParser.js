/* global describe, it */
const assert = require('assert');

const MarkdownParser = require('../../src/interpreter/MarkdownParser');

describe('MarkdownParser', function() {
    describe('parseFile', function() {
        it('lists 3 flags', function() {
            let markdownParser = new MarkdownParser();
            let tags = markdownParser.parseFile(`${__dirname}/artifacts/markdown/test1.md`);
            console.log(tags);
            assert.strictEqual(tags.length, 2);
        });
    });
});
