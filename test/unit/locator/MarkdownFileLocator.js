/* global describe, it */
const assert = require('assert');
const path = require('path');
const MarkdownFileLocator = require('../../../src/locator/MarkdownFileLocator');

describe('MarkdownFileLocator Unit', function() {
    describe('locateFiles', function() {
        it('Should return an empty file list if the file is erroneous', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(path.join(__dirname, '..', 'artifacts', 'locator', 'markdown', 'NonExistantFile.md'));
            assert.strictEqual(files.length, 0);
        });

        it('Should give the specified file in the base path', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(path.join(__dirname, '..', 'artifacts', 'locator', 'markdown', 'test1.md'));
            assert.strictEqual(files.length, 1);
            assert(files[0].includes('test1.md'));
        });

        it('Should return an empty file list if the path is erroneous', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(path.join(__dirname, '..', 'artifacts', 'locator', 'markdow'));
            assert.strictEqual(files.length, 0);
        });

        it('Should give no files for a directory containing no md files', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(path.join(__dirname, '..', 'artifacts', 'locator', 'markdown', 'noMdDir'));
            assert.strictEqual(files.length, 0);
        });

        it('Should give one file for a directory containing one md file', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(path.join(__dirname, '..', 'artifacts', 'locator', 'markdown', 'sub'));
            assert.strictEqual(files.length, 1);
        });

        it('Should give two files through recursive search', function() {
            let markdownFileLocator = new MarkdownFileLocator();
            let files = markdownFileLocator.locateFiles(path.join(__dirname, '..', 'artifacts', 'locator', 'markdown'));
            assert.strictEqual(files.length, 2);
        });
    });
});
