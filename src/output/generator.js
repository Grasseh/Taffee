const fs = require('fs');
const path = require('path');
const showdown = require('showdown');

const TEST_NAME_INDEX = 1;

class HTMLGenerator {
    constructor() {
        this.testFormatting = Object.freeze({
            true: this._formatSuccessfulTest,
            false: this._formatFailedTest
        });
    }

    generate(testSuiteResults, inputMdFilePath, outputDirectory, cssFilePath) {
        let htmlContent = '<!DOCTYPE html>\n';
        htmlContent += '<html>\n';
        htmlContent += this._generateHtmlHeader(outputDirectory, cssFilePath);
        htmlContent += this._generateHtmlBody(inputMdFilePath, testSuiteResults.getTestResults());
        htmlContent += '\n</html>';

        return htmlContent;
    }

    _generateHtmlHeader(outputDirectory, cssFilePath) {
        let relativeCssPath = path.relative(outputDirectory, cssFilePath);
        let htmlHeader = '<head>\n';
        htmlHeader += `<link rel="stylesheet" href="${relativeCssPath}">\n`;
        htmlHeader += '</head>\n';

        return htmlHeader;
    }

    _generateHtmlBody(inputMdFilePath, testResults) {
        let converter = new showdown.Converter();
        let mdContent = fs.readFileSync(inputMdFilePath, 'UTF-8');

        if (null !== testResults) {
            mdContent = this._formatContent(mdContent, testResults);
        }

        let htmlBody = '<body>\n';
        htmlBody += `${converter.makeHtml(mdContent)}\n`;
        htmlBody += '</body>';

        return htmlBody;
    }

    /**
     * Format on a per line basis to avoid multiple test conversions in a single replace operation.
     */
    _formatContent(mdContent, testResults) {
        let mdLines = mdContent.split('\n');
        mdLines.forEach((line, i, arr) => arr[i] = this._convertTests(line, testResults));
        return mdLines.join('\n');
    }

    _convertTests(mdLine, testResults) {
        let testDetectionRegex = /\[.*?\]\(\?=.*?\)\)/gm;
        let matchedTests = mdLine.match(testDetectionRegex);

        if(null !== matchedTests) {
            matchedTests.forEach((match) => mdLine = this._convertTest(mdLine, match, testResults));
        }

        return mdLine;
    }

    _convertTest(mdLine, searchString, testResults) {
        let testElementsRegex = /(?:\[(?:.*?)\])\(\?=(.*)\(\)\)/gm;
        let testElements = testElementsRegex.exec(searchString);

        let testName = testElements[TEST_NAME_INDEX];
        let testResult = testResults.find((tr) => testName === `${tr.getTest().getTestClass()}.${tr.getTest().getTestName()}`);

        return this.testFormatting[testResult.isSuccess()](mdLine, searchString, testResult);
    }

    _formatSuccessfulTest(mdLine, searchString, successfulTest) {
        let actualResult = successfulTest.getActualResult();
        let replaceString = `<span class="successful-test">${actualResult}</span>`;
        return mdLine.replace(searchString, replaceString);
    }

    _formatFailedTest(mdLine, searchString, failedTest) {
        let expectedResult = failedTest.getTest().getExpectedResult();
        let actualResult = failedTest.getActualResult();

        let replaceString = '<span class="failed-test">'
            + `<span class="failed-test-expected-result">${expectedResult}</span> `
            + `<span class="failed-test-actual-result">${actualResult}</span>`
            + '</span>';

        return mdLine.replace(searchString, replaceString);
    }
}

module.exports = HTMLGenerator;
