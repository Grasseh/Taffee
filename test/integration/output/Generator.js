/* global describe, it */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const HTMLGenerator = require('../../../src/output/Generator');

const Test = require('../../../src/model/Test');
const TestResult = require('../../../src/model/TestResult');
const TestSuiteResult = require('../../../src/model/TestSuiteResult');

describe('Output Integration', function() {
    describe('HTMLGenerator', function() {
        it('Should convert MD to HTML', function() {
            let testFile = path.join(__dirname, '..', 'artifacts', 'output', 'OutputIntegrationTest.md');
            let outputPath = path.join(__dirname, '..', 'artifacts', 'output', 'OutputIntegrationTest.html');
            let cssFile = path.join(__dirname, '..', 'artifacts', 'output', 'basic.css');
            let template = path.join(__dirname, '..', 'artifacts', 'output', 'template.html');
            let testResults = [];

            let t1 = new Test('a', 'pass', 'T1', {});
            let tr1 = new TestResult(t1, true, 'T1');
            testResults.push(tr1);

            let t2 = new Test('a', 'fail', 'T2', {});
            let tr2 = new TestResult(t2, false, 'T2_ACTUAL');
            testResults.push(tr2);

            let tp3 = {};
            tp3['var1'] = 'V2';
            let t3 = new Test('a', 'pass', 'T3', tp3);
            let tr3 = new TestResult(t3, true, 'T3');
            testResults.push(tr3);

            let tp4 = {};
            tp4['var1'] = 'V2';
            let t4 = new Test('a', 'fail', 'T4', tp4);
            let tr4 = new TestResult(t4, false, 'T4_ACTUAL');
            testResults.push(tr4);

            let tp5 = {};
            tp5['var1'] = 'V1';
            tp5['var2'] = 'V2';
            let t5 = new Test('a', 'pass', 'T5', tp5);
            let tr5 = new TestResult(t5, true, 'T5');
            testResults.push(tr5);

            let tp6 = {};
            tp6['var1'] = 'V1';
            tp6['var2'] = 'V2';
            let t6 = new Test('a', 'fail', 'T6', tp6);
            let tr6 = new TestResult(t6, false, 'T6_ACTUAL');
            testResults.push(tr6);

            let testSuiteResult = new TestSuiteResult(testResults, testFile);

            let htmlGenerator = new HTMLGenerator();
            htmlGenerator.setCssFiles(cssFile);
            htmlGenerator.setTemplate(template);
            let resultingHtml = htmlGenerator.generate(testSuiteResult, testFile, outputPath);

            let expectedFile = path.join(__dirname, '..', 'artifacts', 'output', 'ExpectedOut.html');
            let expectedHtml = fs.readFileSync(expectedFile, 'UTF-8');

            assert.strictEqual(resultingHtml, expectedHtml.slice(0, -1));
        });
    });
});
