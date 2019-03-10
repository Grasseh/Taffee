/* global describe, it */
const assert = require('assert');

const MarkdownFileLocator = require('../../../../src/interpreter/MarkdownFileLocator');

describe('MarkdownFileLocator', function() {
    describe('locateFiles', function() {
        it('gives 1 file without recursive:true', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdown`);
            assert.strictEqual(files.length, 1);
        });

        it('gives 2 filse with recursive:true', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdown`, {recursive: true});
            assert.strictEqual(files.length, 2);
        });
    });
});
