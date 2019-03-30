/* global describe, it */
const { execSync } = require('child_process');
const assert = require('assert');
const eol = require('eol');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

describe('Accept Application Test', function() {
    it('Should work for a single file', function() {
        this.timeout(5000);
        let configPath = path.join(__dirname, '.singlefilerc');
        let command = `node bin/taffee --config "${configPath}"`;
        let options = {};

        execSync(command, options);

        let expectedFile = path.join(__dirname, 'artifacts', 'ExpectedOutSingle.html');
        let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8');
        expectedHtml = eol.auto(expectedHtml.slice(0, -1));

        // Because DOS exists.
        expectedHtml = expectedHtml.replace('\\', '/');

        let resultedFile = path.join(__dirname, 'output', 'test1.html');
        let resultingHtml = fs.readFileSync(resultedFile, 'UTF-8');
        resultingHtml = eol.auto(resultingHtml);

        assert.strictEqual(resultingHtml, expectedHtml);
        rimraf.sync(path.join(__dirname, 'output'));
    });

    it('Should work recursively', function() {
        this.timeout(5000);
        let configPath = path.join(__dirname, '.recursiverc');
        let command = `node bin/taffee -e --config "${configPath}"`;
        let options = {};

        execSync(command, options);

        let expectedFile = path.join(__dirname, 'artifacts', 'ExpectedOutRecursive.html');
        let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8');
        expectedHtml = eol.auto(expectedHtml.slice(0, -1));

        // Because DOS exists.
        expectedHtml = expectedHtml.replace('\\', '/');

        let resultedFile = path.join(__dirname, 'artifacts', 'test1.html');
        let resultingHtml = fs.readFileSync(resultedFile, 'UTF-8');
        resultingHtml = eol.auto(resultingHtml);

        assert.strictEqual(resultingHtml, expectedHtml);
    });
});
