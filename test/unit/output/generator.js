/* global describe, it */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const HTMLGenerator = require('../../../src/output/generator');

class TestStub {
    constructor(name, expectedResult, parameters) {
        this.testName = name;
        this.expectedResult = expectedResult;
        this.parameters = parameters;
    }

    getTestName() {
        return this.testName;
    }

    getExpectedResult() {
        return this.expectedResult;
    }

    getParameters() {
        return this.parameters;
    }
}

class TestResultStub {
    constructor(success, actualResult, test) {
        this.success = success;
        this.actualResult = actualResult;
        this.test = test;
    }

    isSuccess() {
        return this.success;
    }

    getActualResult() {
        return this.actualResult;
    }

    getTest() {
        return this.test;
    }
}

describe('Output Unit', function() {
    describe('HTMLGenerator', function() {
        describe('MD Conversion', function() {
            it('Should convert testless MD To HTML.', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'NoTest.md');
                let mdContent = fs.readFileSync(testFile, 'UTF-8');

                let htmlGenerator = new HTMLGenerator();
                let resultingMd = htmlGenerator._convertFile(mdContent);

                assert(resultingMd.includes('<p>'));
                assert(resultingMd.includes('</p>'));
                assert(resultingMd.includes('<br />'));
            });

            it('Should convert tests without variables.', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'TestInvocation.md');
                let mdContent = fs.readFileSync(testFile, 'UTF-8');

                let htmlGenerator = new HTMLGenerator();
                let resultingMd = htmlGenerator._convertFile(mdContent);

                assert(resultingMd.includes('<a href="?=NoVars()">test invocation</a>'));
            });

            /*
            it('Should convert tests with one variable.', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'TestInvocation.md');
                let mdContent = fs.readFileSync(testFile, 'UTF-8');

                let htmlGenerator = new HTMLGenerator();
                let resultingMd = htmlGenerator._convertFile(mdContent);

                assert(resultingMd.includes('<a href="?=OneVar(#var1)">test invocation</a>'));
            });
            */

            /*
            it('Should convert tests with multiple variables.', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'TestInvocation.md');
                let mdContent = fs.readFileSync(testFile, 'UTF-8');

                let htmlGenerator = new HTMLGenerator();
                let resultingMd = htmlGenerator._convertFile(mdContent);

                assert(resultingMd.includes('<a href="?=MultiVar(#var1, #var2)">test invocation</a>'));
                assert(resultingMd.includes('<a href="?=MultiVar(#var1, #var2, #var3)">test invocation</a>'));
            });
            */
        });

        describe('HTML Alterations', function() {
            it('Should convert passing tests to green spans.', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'PassingTests.html');
                let htmlContent = fs.readFileSync(testFile, 'UTF-8');

                let testParameters = new Map();
                let test = new TestStub('passingTest', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);

                let successfulTests = [testResult];

                let htmlGenerator = new HTMLGenerator();
                let resultingHtml = htmlGenerator._formatSuccessfulTests(htmlContent, successfulTests);

                assert(resultingHtml.includes('<span class="successful-test">passing</span>'));
            });

            it('Should convert passing tests to red spans with real values.', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'FailingTests.html');
                let htmlContent = fs.readFileSync(testFile, 'UTF-8');

                let testParameters = new Map();
                let test = new TestStub('failingTest', 'failing', testParameters);
                let testResult = new TestResultStub(false, 'actualValue', test);

                let failedTests = [testResult];

                let htmlGenerator = new HTMLGenerator();
                let resultingHtml = htmlGenerator._formatFailedTests(htmlContent, failedTests);

                let expected = '<span class="failed-test">'
                    + '<span class="failed-test-expected-result">failing</span> '
                    + '<span class="failed-test-actual-result">actualValue</span>'
                    + '</span>';

                assert(resultingHtml.includes(expected));
            });
        });
    });
});
