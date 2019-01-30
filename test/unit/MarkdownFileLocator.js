/* global describe */
const assert = require('assert');

const MarkdownFileLocator = require('../../src/interpreter/MarkdownFileLocator');

describe('MarkdownFileLocator', function() {
    describe('locateFiles with recursive:false (default)', function() {
        let markdownFileLocator = new MarkdownFileLocator();
        let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdown`);
        assert.strictEqual(files.length, 1);
    });

    describe('locateFiles with recursive:true', function() {
        let markdownFileLocator = new MarkdownFileLocator();
        let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdown`, {recursive: true});
        assert.strictEqual(files.length, 2);
    });
});
