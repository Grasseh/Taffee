/* global describe, it */
const { execSync } = require('child_process');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Accept Application Test', function() {
    it('Should work from A to Z', function() {
        this.timeout(5000);
        let configPath = path.join(__dirname, '.testrc');
        let command = `node src/run.js --config "${configPath}"`;
        let options = {};

        let output = execSync(command, options);
        console.log(output.toString());

        let expectedFile = path.join(__dirname, 'artifacts', 'ExpectedOut.html');
        let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8');

        let resultedFile = path.join(__dirname, 'artifacts', 'test1.html');
        let resultingHtml = fs.readFileSync(resultedFile, 'UTF-8');

        assert.strictEqual(resultingHtml, expectedHtml.slice(0, -1));
    });
});
