/* global describe, it */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const HTMLGenerator = require('../../../src/output/generator');

class TestStub {
    constructor(name, testClass, expectedResult, parameters) {
        this.testName = name;
        this.testClass = testClass;
        this.expectedResult = expectedResult;
        this.parameters = parameters;
    }

    getTestName() {
        return this.testName;
    }

    getTestClass() {
        return this.testClass;
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
        describe('HTML Body generation', function() {
            it('Should convert testless MD To HTML', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'NoTest.md');

                let htmlGenerator = new HTMLGenerator();
                let body = htmlGenerator._generateHtmlBody(testFile, null);

                assert(body.includes('<p>'));
                assert(body.includes('</p>'));
                assert(body.includes('<br />'));
            });

            it('Should convert all passing tests in the html body', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'PassingTests.md');
                let expectedFile = path.join(__dirname, '..', 'artifacts', 'output', 'ExpectedPassingTests.html');

                let testParameters = new Map();
                let test = new TestStub('anotherPassingTest', 'a', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);

                let secondTestParameters = new Map();
                let secondTest = new TestStub('passingTest', 'a', 'passing', secondTestParameters);
                let secondTestResult = new TestResultStub(true, 'passing', secondTest);
                let testResults = [testResult, secondTestResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._generateHtmlBody(testFile, testResults);

                let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8').slice(0, -1);

                assert.strictEqual(formattedLine, expectedHtml);
            });

            it('Should convert all failing tests in the html body', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'FailingTests.md');
                let expectedFile = path.join(__dirname, '..', 'artifacts', 'output', 'ExpectedFailingTests.html');

                let testParameters = new Map();
                let test = new TestStub('failingTest', 'a', 'failing', testParameters);
                let testResult = new TestResultStub(false, 'actual1', test);

                let secondTestParameters = new Map();
                let secondTest = new TestStub('anotherFailingTest', 'a', 'failing', secondTestParameters);
                let secondTestResult = new TestResultStub(false, 'actual2', secondTest);
                let testResults = [testResult, secondTestResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._generateHtmlBody(testFile, testResults);

                let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8').slice(0, -1);

                assert.strictEqual(formattedLine, expectedHtml);
            });

            it('Should convert all tests in the html body', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'MixedTests.md');
                let expectedFile = path.join(__dirname, '..', 'artifacts', 'output', 'ExpectedMixedTests.html');

                let testParameters = new Map();
                let test = new TestStub('passingTest', 'a', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);

                let secondTestParameters = new Map();
                let secondTest = new TestStub('failingTest', 'a', 'failing', secondTestParameters);
                let secondTestResult = new TestResultStub(false, 'actual', secondTest);
                let testResults = [testResult, secondTestResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._generateHtmlBody(testFile, testResults);

                let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8').slice(0, -1);

                assert.strictEqual(formattedLine, expectedHtml);
            });
        });

        describe('Variable conversion', function() {
            it('Should not modify lines without variables', function() {
                let mdLine = 'A variable less line.';

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertVariables(mdLine, new Map());
                let convertedLine = output[0];

                assert.strictEqual(convertedLine, mdLine);
            });

            it('Should convert a line with a single variable to plain text', function() {
                let mdLine = 'A line containing a [variable](#var).';
                let expectedLine = 'A line containing a variable.';

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertVariables(mdLine, new Map());
                let convertedLine = output[0];

                assert.strictEqual(convertedLine, expectedLine);
            });

            it('Should convert a line with multiple variables to plain text', function() {
                let mdLine = 'A line containing a [first](#var) variable and a [second](#var2) variable.';
                let expectedLine = 'A line containing a first variable and a second variable.';

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertVariables(mdLine, new Map());
                let convertedLine = output[0];

                assert.strictEqual(convertedLine, expectedLine);
            });

            it('Should not update the variables map for lines without variables.', function() {
                let mdLine = 'A variable less line.';
                let variablesMap = new Map();

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertVariables(mdLine, variablesMap);
                let updatedMap = output[1];

                assert.strictEqual(updatedMap.size, 0);
            });

            it('Should update the variables map for lines containing a single variable.', function() {
                let mdLine = 'A line containing a [variable](#var).';
                let variablesMap = new Map();

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertVariables(mdLine, variablesMap);
                let updatedMap = output[1];

                assert.strictEqual(updatedMap.size, 1);
                assert(updatedMap.has('var'));
                assert.strictEqual(updatedMap.get('var'), 'variable');
            });

            it('Should update the variables map for lines containing multiple variables.', function() {
                let mdLine = '[A](#a) [B](#b) [C](#c).';
                let variablesMap = new Map();

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertVariables(mdLine, variablesMap);
                let updatedMap = output[1];

                assert.strictEqual(updatedMap.size, 3);

                assert(updatedMap.has('a'));
                assert.strictEqual(updatedMap.get('a'), 'A');

                assert(updatedMap.has('b'));
                assert.strictEqual(updatedMap.get('b'), 'B');

                assert(updatedMap.has('c'));
                assert.strictEqual(updatedMap.get('c'), 'C');
            });
        });

        describe('0 variables test conversion', function() {
            it('Should not convert a testless line', function() {
                let mdLine = 'A testless line.';

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, null);

                let expectedLine = 'A testless line.';
                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should convert a passing test to a span', function() {
                let mdLine = 'A [passing](?=a.passingTest()) test.';

                let testParameters = new Map();
                let test = new TestStub('passingTest', 'a', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);
                let testResults = [testResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults);

                let expectedLine = 'A <span class="successful-test">passing</span> test.';
                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should convert multiple passing tests to spans', function() {
                let mdLine = 'A [passing](?=a.passingTest()) test and [another](?=a.anotherTest()) one.';

                let testParameters = new Map();
                let test = new TestStub('passingTest', 'a', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);

                let secondTestParameters = new Map();
                let secondTest = new TestStub('anotherTest', 'a', 'another', secondTestParameters);
                let secondTestResult = new TestResultStub(true, 'another', secondTest);
                let testResults = [testResult, secondTestResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults);

                let expectedLine = 'A <span class="successful-test">passing</span> test' +
                    ' and <span class="successful-test">another</span> one.';

                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should convert a failed test to a span', function() {
                let mdLine = 'A [failed](?=a.failingTest()) test.';

                let testParameters = new Map();
                let test = new TestStub('failingTest', 'a', 'failed', testParameters);
                let testResult = new TestResultStub(false, 'actual', test);
                let testResults = [testResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults);

                let expectedLine = 'A <span class="failed-test">'
                    + '<span class="failed-test-expected-result">failed</span> '
                    + '<span class="failed-test-actual-result">actual</span>'
                    + '</span> test.';
                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should convert multiple failed tests to spans', function() {
                let mdLine = 'A [failed](?=a.failingTest()) test and [another](?=a.anotherTest()) one.';

                let testParameters = new Map();
                let test = new TestStub('failingTest', 'a', 'failed', testParameters);
                let testResult = new TestResultStub(false, 'actual', test);

                let secondTestParameters = new Map();
                let secondTest = new TestStub('anotherTest', 'a', 'another', secondTestParameters);
                let secondTestResult = new TestResultStub(false, 'real', secondTest);
                let testResults = [testResult, secondTestResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults);

                let expectedLine = 'A <span class="failed-test">'
                    + '<span class="failed-test-expected-result">failed</span> '
                    + '<span class="failed-test-actual-result">actual</span>'
                    + '</span> test and <span class="failed-test">'
                    + '<span class="failed-test-expected-result">another</span> '
                    + '<span class="failed-test-actual-result">real</span>'
                    + '</span> one.';
                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should convert successful and failed tests to spans', function() {
                let mdLine = 'A [failed](?=a.failingTest()) test and a [passed](?=a.passingTest()) one.';

                let testParameters = new Map();
                let test = new TestStub('failingTest', 'a', 'failed', testParameters);
                let testResult = new TestResultStub(false, 'actual', test);

                let secondTestParameters = new Map();
                let secondTest = new TestStub('passingTest', 'a', 'passed', secondTestParameters);
                let secondTestResult = new TestResultStub(true, 'passed', secondTest);
                let testResults = [testResult, secondTestResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults);

                let expectedLine = 'A <span class="failed-test">'
                    + '<span class="failed-test-expected-result">failed</span> '
                    + '<span class="failed-test-actual-result">actual</span>'
                    + '</span> test and a <span class="successful-test">passed</span> one.';
                assert.strictEqual(formattedLine, expectedLine);
            });
        });
    });
});
