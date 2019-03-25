/* global describe, it */
const assert = require('assert');
const MarkdownFileLocator = require('../../../src/filesearch/MarkdownFileLocator');

describe('MarkdownFileLocator', function() {
    describe('locateFiles', function() {
        it('Should return an empty file list if the file is erroneous.', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdown/NonExistantFile.md`);
            assert.strictEqual(files.length, 0);
        });

        it('Should give the specified file in the base path.', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdown/test1.md`);
            assert.strictEqual(files.length, 1);
            assert(files[0].includes('test1.md'));
        });

        it('Should return an empty file list if the path is erroneous.', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdow/`);
            assert.strictEqual(files.length, 0);
        });

        it('Should give no files for a directory containing no md files.', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdown/noMdDir/`);
            assert.strictEqual(files.length, 0);
        });

        it('Should give one file for a directory containing one md file.', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdown/sub/`);
            assert.strictEqual(files.length, 1);
        });

        it('Should give two files through recursive search.', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(`${__dirname}/artifacts/markdown`);
            assert.strictEqual(files.length, 2);
        });
    });
});
