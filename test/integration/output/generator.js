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

class TestSuiteResultStub {
    constructor(testFileName, testResults) {
        this.testFileName = testFileName;
        this.testResults = testResults;
    }

    getTestFileName() {
        return this.testFileName;
    }

    getTestResults() {
        return this.testResults;
    }
}

describe('Output Integration', function() {
    describe('HTMLGenerator', function() {
        it('Should convert MD to HTML', function() {
            let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'OutputIntegrationTest.md');
            let outputDir = path.join(__dirname, '..', 'artifacts', 'output');
            let cssFile = path.join(__dirname, '..', 'artifacts', 'output', 'basic.css');
            let template = path.join(__dirname, '..', 'artifacts', 'output', 'template.html');
            let testResults = [];

            let t1 = new TestStub('pass', 'a', 'T1', {});
            let tr1 = new TestResultStub(true, 'T1', t1);
            testResults.push(tr1);

            let t2 = new TestStub('fail', 'a', 'T2', {});
            let tr2 = new TestResultStub(false, 'T2_ACTUAL', t2);
            testResults.push(tr2);

            let tp3 = {};
            tp3['var1'] = 'V2';
            let t3 = new TestStub('pass', 'a', 'T3', tp3);
            let tr3 = new TestResultStub(true, 'T3', t3);
            testResults.push(tr3);

            let tp4 = {};
            tp4['var1'] = 'V2';
            let t4 = new TestStub('fail', 'a', 'T4', tp4);
            let tr4 = new TestResultStub(false, 'T4_ACTUAL', t4);
            testResults.push(tr4);

            let tp5 = {};
            tp5['var1'] = 'V1';
            tp5['var2'] = 'V2';
            let t5 = new TestStub('pass', 'a', 'T5', tp5);
            let tr5 = new TestResultStub(true, 'T5', t5);
            testResults.push(tr5);

            let tp6 = {};
            tp6['var1'] = 'V1';
            tp6['var2'] = 'V2';
            let t6 = new TestStub('fail', 'a', 'T6', tp6);
            let tr6 = new TestResultStub(false, 'T6_ACTUAL', t6);
            testResults.push(tr6);

            let testSuiteResult = new TestSuiteResultStub(testFile, testResults);

            let htmlGenerator = new HTMLGenerator();
            htmlGenerator.setCssFiles(cssFile);
            htmlGenerator.setTemplate(template);
            let resultingHtml = htmlGenerator.generate(testSuiteResult, testFile, outputDir);

            let expectedFile = path.join(__dirname, '..', 'artifacts', 'output', 'ExpectedOut.html');
            let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8');

            assert.strictEqual(resultingHtml, expectedHtml.slice(0, -1));
        });
    });
});
