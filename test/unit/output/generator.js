/* global describe, it */
const assert = require('assert');
// const sinon = require('sinon');
const fs = require('fs');
const HTMLGenerator = require('../../../src/output/generator');

describe('Output Unit', function() {
    describe('HTMLGenerator', function() {
        describe('MD Conversion', function() {
            it('Should convert testless MD To HTML.', function() {
                let testFile = `${__dirname}/../artifacts/output/NoTest.md`;
                let mdContent = fs.readFileSync(testFile, 'UTF-8');

                let htmlGenerator = new HTMLGenerator();
                let resultingHtml = htmlGenerator._convertFile(mdContent);

                assert(resultingHtml.includes('<p>'));
                assert(resultingHtml.includes('</p>'));
                assert(resultingHtml.includes('<br />'));
            });

            it('Should convert tests without variables.', function() {
                let testFile = `${__dirname}/../artifacts/output/TestInvocation.md`;
                let mdContent = fs.readFileSync(testFile, 'UTF-8');

                let htmlGenerator = new HTMLGenerator();
                let resultingHtml = htmlGenerator._convertFile(mdContent);

                assert(resultingHtml.includes('<a href="?=NoVars()">test invocation</a>'));
            });

            it('Should convert tests with one variable.', function() {
                let testFile = `${__dirname}/../artifacts/output/TestInvocation.md`;
                let mdContent = fs.readFileSync(testFile, 'UTF-8');

                let htmlGenerator = new HTMLGenerator();
                let resultingHtml = htmlGenerator._convertFile(mdContent);

                assert(resultingHtml.includes('<a href="?=OneVar(#var1)">test invocation</a>'));
            });
        });
    });
});
