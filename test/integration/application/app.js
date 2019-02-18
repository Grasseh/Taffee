/* global describe, it */
const { execSync } = require('child_process');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Accept Application Test', function() {
    it('Should work from A to Z', function() {
        let command = 'npm start';
        let options = {
        };
        execSync(command, options);
        let expectedFile = path.join(__dirname, '..', 'artifacts', 'application', 'ExpectedOut.html');
        let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8');

        let resultedFile = path.join(__dirname, '..', 'artifacts', 'application', 'output.html');
        let resultingHtml = fs.readFileSync(resultedFile, 'UTF-8');

        assert.strictEqual(resultingHtml, expectedHtml.slice(0, -1));
    });
});
