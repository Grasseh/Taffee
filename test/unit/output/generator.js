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
                let testResults = [];

                let testParameters = new Map();
                let test = new TestStub('pass', 'a', 'T1', testParameters);
                let testResult = new TestResultStub(true, 'T1', test);
                testResults.push(testResult);

                let secondTestParameters = new Map();
                let secondTest = new TestStub('pass', 'a', 'T2', secondTestParameters);
                let secondTestResult = new TestResultStub(true, 'T2', secondTest);
                testResults.push(secondTestResult);

                let thirdTestParameters = new Map();
                thirdTestParameters.set('var', 'A');
                let thirdTest = new TestStub('pass', 'a', 'T3', thirdTestParameters);
                let thirdTestResult = new TestResultStub(true, 'T3', thirdTest);
                testResults.push(thirdTestResult);

                let fourthTestParameters = new Map();
                fourthTestParameters.set('var', 'B');
                fourthTestParameters.set('var2', 'C');
                let fourthTest = new TestStub('pass', 'a', 'T4', fourthTestParameters);
                let fourthTestResult = new TestResultStub(true, 'T4', fourthTest);
                testResults.push(fourthTestResult);

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

        describe('Parameter conversion', function() {
            it('Should not modify lines without parameters', function() {
                let mdLine = 'A parameter less line.';

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertParameters(mdLine, new Map());
                let convertedLine = output[0];

                assert.strictEqual(convertedLine, mdLine);
            });

            it('Should convert a line with a single parameter to plain text', function() {
                let mdLine = 'A line containing a [parameter](#var).';
                let expectedLine = 'A line containing a parameter.';

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertParameters(mdLine, new Map());
                let convertedLine = output[0];

                assert.strictEqual(convertedLine, expectedLine);
            });

            it('Should convert a line with multiple parameters to plain text', function() {
                let mdLine = 'A line containing a [first](#var) parameter and a [second](#var2) parameter.';
                let expectedLine = 'A line containing a first parameter and a second parameter.';

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertParameters(mdLine, new Map());
                let convertedLine = output[0];

                assert.strictEqual(convertedLine, expectedLine);
            });

            it('Should not update the parameters map for lines without parameters', function() {
                let mdLine = 'A parameter less line.';
                let parametersMap = new Map();

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertParameters(mdLine, parametersMap);
                let updatedMap = output[1];

                assert.strictEqual(updatedMap.size, 0);
            });

            it('Should update the parameters map for lines containing a single parameter', function() {
                let mdLine = 'A line containing a [parameter](#var).';
                let parametersMap = new Map();

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertParameters(mdLine, parametersMap);
                let updatedMap = output[1];

                assert.strictEqual(updatedMap.size, 1);
                assert(updatedMap.has('var'));
                assert.strictEqual(updatedMap.get('var'), 'parameter');
            });

            it('Should update the parameters map for lines containing multiple parameters', function() {
                let mdLine = '[A](#a) [B](#b) [C](#c).';
                let parametersMap = new Map();

                let htmlGenerator = new HTMLGenerator();
                let output = htmlGenerator._convertParameters(mdLine, parametersMap);
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

        describe('0 parameters test conversion', function() {
            it('Should not convert a testless line', function() {
                let mdLine = 'A testless line.';

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, null);

                let expectedLine = 'A testless line.';
                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should convert a passing test', function() {
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

            it('Should convert multiple passing tests', function() {
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

            it('Should convert a failed test', function() {
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

            it('Should convert multiple failed tests', function() {
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

            it('Should convert successful and failed tests', function() {
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

        describe('1 parameter test conversion', function() {
            it('Should convert a passing test with a matching parameter', function() {
                let mdLine = 'A [passing](?=a.passingTest(#var)) test.';
                let parameters = new Map();
                parameters.set('var', 'A');

                let testParameters = new Map();
                testParameters.set('var', 'A');
                let test = new TestStub('passingTest', 'a', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);
                let testResults = [testResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults, parameters);

                let expectedLine = 'A <span class="successful-test">passing</span> test.';
                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should not convert a passing test without a matching parameter', function() {
                let mdLine = 'A [passing](?=a.passingTest(#var)) test.';
                let parameters = new Map();
                parameters.set('var', 'B');

                let testParameters = new Map();
                testParameters.set('var', 'A');
                let test = new TestStub('passingTest', 'a', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);
                let testResults = [testResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults, parameters);

                let expectedLine = 'A [passing](?=a.passingTest(#var)) test.';
                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should convert only parameter matching tests', function() {
                let mdLine = '[T1](?=a.pass(#var)) [T2](?=a.pass(#var))';
                let parameters = new Map();
                parameters.set('var', 'B');

                let testParameters = new Map();
                testParameters.set('var', 'A');
                let test = new TestStub('pass', 'a', 'T1', testParameters);
                let testResult = new TestResultStub(true, 'T1', test);

                let secondTestParameters = new Map();
                secondTestParameters.set('var', 'B');
                let secondTest = new TestStub('pass', 'a', 'T2', secondTestParameters);
                let secondTestResult = new TestResultStub(true, 'T2', secondTest);
                let testResults = [testResult, secondTestResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults, parameters);

                let expectedLine = '[T1](?=a.pass(#var)) <span class="successful-test">T2</span>';
                assert.strictEqual(formattedLine, expectedLine);
            });
        });

        describe('Multi parameter test conversion', function() {
            it('Should convert a passing test with all matching parameters', function() {
                let mdLine = 'A [passing](?=a.passingTest(#var, #var2, #var3)) test.';
                let parameters = new Map();
                parameters.set('var', 'A');
                parameters.set('var2', 'B');
                parameters.set('var3', 'C');

                let testParameters = new Map();
                testParameters.set('var', 'A');
                testParameters.set('var2', 'B');
                testParameters.set('var3', 'C');
                let test = new TestStub('passingTest', 'a', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);
                let testResults = [testResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults, parameters);

                let expectedLine = 'A <span class="successful-test">passing</span> test.';
                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should not convert a passing test without all matching parameters', function() {
                let mdLine = 'A [passing](?=a.passingTest(#var, #var2)) test.';
                let parameters = new Map();
                parameters.set('var', 'A');
                parameters.set('var2', 'B');

                let testParameters = new Map();
                testParameters.set('var', 'A');
                testParameters.set('var2', 'C');
                let test = new TestStub('passingTest', 'a', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);
                let testResults = [testResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults, parameters);

                let expectedLine = 'A [passing](?=a.passingTest(#var, #var2)) test.';
                assert.strictEqual(formattedLine, expectedLine);
            });

            it('Should convert only parameter matching tests', function() {
                let mdLine = '[T1](?=a.pass(#var, #var2)) [T2](?=a.pass(#var, #var2))';
                let parameters = new Map();
                parameters.set('var', 'A');
                parameters.set('var2', 'B');

                let testParameters = new Map();
                testParameters.set('var', 'A');
                testParameters.set('var2', 'C');
                let test = new TestStub('pass', 'a', 'T1', testParameters);
                let testResult = new TestResultStub(true, 'T1', test);

                let secondTestParameters = new Map();
                secondTestParameters.set('var', 'A');
                secondTestParameters.set('var2', 'B');
                let secondTest = new TestStub('pass', 'a', 'T2', secondTestParameters);
                let secondTestResult = new TestResultStub(true, 'T2', secondTest);
                let testResults = [testResult, secondTestResult];

                let htmlGenerator = new HTMLGenerator();
                let formattedLine = htmlGenerator._convertTests(mdLine, testResults, parameters);

                let expectedLine = '[T1](?=a.pass(#var, #var2)) <span class="successful-test">T2</span>';
                assert.strictEqual(formattedLine, expectedLine);
            });
        });
    });
});
