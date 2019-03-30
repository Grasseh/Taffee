/* global describe, it */
const assert = require('assert');
const eol = require('eol');
const fs = require('fs');
const path = require('path');
const HTMLGenerator = require('../../../src/output/Generator');

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
            it('Should format testless MD To HTML', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'NoTest.md');

                let gen = new HTMLGenerator();
                let body = gen._generateHtmlBody(testFile, null);

                assert(body.includes('<p>'));
                assert(body.includes('</p>'));
                assert(body.includes('<br />'));
            });

            it('Should format all passing tests in the html body', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'PassingTests.md');
                let expectedFile = path.join(__dirname, '..', 'artifacts', 'output', 'ExpectedPassingTests.html');
                let testResults = [];

                let testParameters = {};
                let test = new TestStub('pass', 'a', 'T1', testParameters);
                let testResult = new TestResultStub(true, 'T1', test);
                testResults.push(testResult);

                let secondTestParameters = {};
                let secondTest = new TestStub('pass', 'a', 'T2', secondTestParameters);
                let secondTestResult = new TestResultStub(true, 'T2', secondTest);
                testResults.push(secondTestResult);

                let thirdTestParameters = {};
                thirdTestParameters['v'] = 'A';
                let thirdTest = new TestStub('pass', 'a', 'T3', thirdTestParameters);
                let thirdTestResult = new TestResultStub(true, 'T3', thirdTest);
                testResults.push(thirdTestResult);

                let fourthTestParameters = {};
                fourthTestParameters['v'] = 'B';
                fourthTestParameters['v2'] = 'C';
                let fourthTest = new TestStub('pass', 'a', 'T4', fourthTestParameters);
                let fourthTestResult = new TestResultStub(true, 'T4', fourthTest);
                testResults.push(fourthTestResult);

                let gen = new HTMLGenerator();
                let res = gen._generateHtmlBody(testFile, testResults);

                let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8').slice(0, -1);
                expectedHtml = eol.auto(expectedHtml);
                assert.strictEqual(res, expectedHtml);
            });

            it('Should format all failing tests in the html body', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'FailingTests.md');
                let expectedFile = path.join(__dirname, '..', 'artifacts', 'output', 'ExpectedFailingTests.html');

                let testParameters = {};
                let test = new TestStub('failingTest', 'a', 'failing', testParameters);
                let testResult = new TestResultStub(false, 'actual1', test);

                let secondTestParameters = {};
                let secondTest = new TestStub('anotherFailingTest', 'a', 'failing', secondTestParameters);
                let secondTestResult = new TestResultStub(false, 'actual2', secondTest);
                let testResults = [testResult, secondTestResult];

                let gen = new HTMLGenerator();
                let res = gen._generateHtmlBody(testFile, testResults);

                let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8').slice(0, -1);
                assert.strictEqual(res, expectedHtml);
            });

            it('Should format all tests in the html body', function() {
                let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'MixedTests.md');
                let expectedFile = path.join(__dirname, '..', 'artifacts', 'output', 'ExpectedMixedTests.html');

                let testParameters = {};
                let test = new TestStub('passingTest', 'a', 'passing', testParameters);
                let testResult = new TestResultStub(true, 'passing', test);

                let secondTestParameters = {};
                let secondTest = new TestStub('failingTest', 'a', 'failing', secondTestParameters);
                let secondTestResult = new TestResultStub(false, 'actual', secondTest);
                let testResults = [testResult, secondTestResult];

                let gen = new HTMLGenerator();
                let res = gen._generateHtmlBody(testFile, testResults);

                let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8').slice(0, -1);
                expectedHtml = eol.auto(expectedHtml);
                assert.strictEqual(res, expectedHtml);
            });
        });

        describe('Invoker formatting', function() {
            it('Should delete an invoker declaration', function() {
                let mdLine = '[](invoker: PHPInvoker)';
                let expectedLine = '';

                let gen = new HTMLGenerator();
                let res = gen._formatInvoker(mdLine, '[](invoker: PHPInvoker)', {});
                let formatedLine = res[0];

                assert.strictEqual(formatedLine, expectedLine);
            });
        });

        describe('Module formatting', function() {
            it('Should delete a module declaration', function() {
                let mdLine = '[](module: MODULE)';
                let expectedLine = '';

                let gen = new HTMLGenerator();
                let res = gen._formatInvoker(mdLine, '[](module: MODULE)', {});
                let formatedLine = res[0];

                assert.strictEqual(formatedLine, expectedLine);
            });
        });

        describe('Parameter formatting', function() {
            it('Should format a line with a single parameter', function() {
                let mdLine = 'A line containing a [parameter](var: v).';
                let expectedLine = 'A line containing a parameter.';

                let gen = new HTMLGenerator();
                let res = gen._formatParameter(mdLine, '[parameter](var: v)', {});
                let formatedLine = res[0];

                assert.strictEqual(formatedLine, expectedLine);
            });

            it('Should format only the first parameter', function() {
                let mdLine = 'A line containing a [first](var: v) parameter and a [first](var: v) parameter.';
                let expectedLine = 'A line containing a first parameter and a [first](var: v) parameter.';

                let gen = new HTMLGenerator();
                let res = gen._formatParameter(mdLine, '[first](var: v)', {});
                let formatedLine = res[0];

                assert.strictEqual(formatedLine, expectedLine);
            });

            it('Should update the parameters map', function() {
                let mdLine = 'A line containing a [p](var: v).';
                let parametersMap = {};

                let gen = new HTMLGenerator();
                let res = gen._formatParameter(mdLine, '[p](var: v)', parametersMap);
                let updatedMap = res[1];

                assert.strictEqual(Object.keys(updatedMap).length, 1);
                assert.strictEqual(updatedMap['v'], 'p');
            });
        });

        describe('0 parameters test formatting', function() {
            it('Should format a passing test', function() {
                let mdLine = 'A [p](test: a.pass()) test.';

                let testParameters = {};
                let test = new TestStub('pass', 'a', 'p', testParameters);
                let testResult = new TestResultStub(true, 'p', test);
                let testResults = [testResult];

                let gen = new HTMLGenerator();
                let res = gen._formatTest(mdLine, '[p](test: a.pass())', {}, testResults);

                let expectedLine = 'A <span class="successful-test">p</span> test.';
                assert.strictEqual(res[0], expectedLine);
            });

            it('Should format a failed test', function() {
                let mdLine = 'A [f](test: a.fail()) test.';

                let testParameters = {};
                let test = new TestStub('fail', 'a', 'f', testParameters);
                let testResult = new TestResultStub(false, 'actual', test);
                let testResults = [testResult];

                let gen = new HTMLGenerator();
                let res = gen._formatTest(mdLine, '[f](test: a.fail())', {}, testResults);

                let expectedLine = 'A <span class="failed-test">'
                    + '<span class="failed-test-expected-result">f</span> '
                    + '<span class="failed-test-actual-result">actual</span>'
                    + '</span> test.';
                assert.strictEqual(res[0], expectedLine);
            });
        });

        describe('1 parameter test formatting', function() {
            it('Should format a passing test with a matching parameter', function() {
                let mdLine = 'A [p](test: a.pass(v)) test.';
                let parameters = {};
                parameters['v'] = 'A';

                let testParameters = {};
                testParameters['v'] = 'A';
                let test = new TestStub('pass', 'a', 'p', testParameters);
                let testResult = new TestResultStub(true, 'p', test);
                let testResults = [testResult];

                let gen = new HTMLGenerator();
                let res = gen._formatTest(mdLine, '[p](test: a.pass(v))', parameters, testResults);

                let expectedLine = 'A <span class="successful-test">p</span> test.';
                assert.strictEqual(res[0], expectedLine);
            });

            it('Should not format a passing test without a matching parameter', function() {
                let mdLine = 'A [p](test: a.pass(v)) test.';
                let parameters = {};
                parameters['v'] = 'B';

                let testParameters = {};
                testParameters['v'] = 'A';
                let test = new TestStub('pass', 'a', 'p', testParameters);
                let testResult = new TestResultStub(true, 'p', test);
                let testResults = [testResult];

                let gen = new HTMLGenerator();
                let res = gen._formatTest(mdLine, '[p](test: a.pass(v))', parameters, testResults);

                let expectedLine = 'A [p](test: a.pass(v)) test.';
                assert.strictEqual(res[0], expectedLine);
            });
        });

        describe('Multi parameter test formatting', function() {
            it('Should format a passing test with all matching parameters', function() {
                let mdLine = 'A [p](test: a.pass(v, v2, v3)) test.';
                let parameters = {};
                parameters['v'] = 'A';
                parameters['v2'] = 'B';
                parameters['v3'] = 'C';

                let testParameters = {};
                testParameters['v'] = 'A';
                testParameters['v2'] = 'B';
                testParameters['v3'] = 'C';
                let test = new TestStub('pass', 'a', 'p', testParameters);
                let testResult = new TestResultStub(true, 'p', test);
                let testResults = [testResult];

                let gen = new HTMLGenerator();
                let res = gen._formatTest(mdLine, '[p](test: a.pass(v, v2, v3))', parameters, testResults);

                let expectedLine = 'A <span class="successful-test">p</span> test.';
                assert.strictEqual(res[0], expectedLine);
            });

            it('Should not format a passing test without all matching parameters', function() {
                let mdLine = 'A [p](test: a.pass(v, v2, v3)) test.';
                let parameters = {};
                parameters['v'] = 'A';
                parameters['v2'] = 'B';
                parameters['v3'] = 'C';

                let testParameters = {};
                testParameters['v'] = 'A';
                testParameters['v2'] = 'C';
                testParameters['v3'] = 'C';
                let test = new TestStub('pass', 'a', 'p', testParameters);
                let testResult = new TestResultStub(true, 'p', test);
                let testResults = [testResult];

                let gen = new HTMLGenerator();
                let res = gen._formatTest(mdLine, '[p](test: a.pass(v, v2, v3))', parameters, testResults);

                let expectedLine = 'A [p](test: a.pass(v, v2, v3)) test.';
                assert.strictEqual(res[0], expectedLine);
            });
        });
    });
});
