const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const showdown = require('showdown');

// const TEST_CLASS_INDEX = 1;
const TEST_NAME_INDEX = 2;

const DEFAULT_CSS = path.join(__dirname, '..', 'resources', 'output', 'styles.css');
const DEFAULT_TEMPLATE = path.join(__dirname, '..', 'resources', 'output', 'templates', 'outputTemplate.html');

class HTMLGenerator {
    constructor() {
        this.testFormatting = Object.freeze({
            true: this._formatSuccessfulTest,
            false: this._formatFailedTest
        });

        this.cssFiles = [DEFAULT_CSS];
        this.template = DEFAULT_TEMPLATE;
    }

    setCssFiles(...cssFiles) {
        this.cssFiles = cssFiles;
    }

    setTemplate(template) {
        this.outputTemplate = template;
    }

    generate(testSuiteResults, inputMdFilePath, outputDirectory) {
        let relativeCssFiles = this.cssFiles.map((css) => path.relative(outputDirectory, css));
        let body = this._generateHtmlBody(inputMdFilePath, testSuiteResults.getTestResults());

        let templateParameters = {};
        templateParameters['cssFiles'] = relativeCssFiles;
        templateParameters['content'] = body;

        let template = fs.readFileSync(this.template, 'UTF-8');
        let compiledTemplate = handlebars.compile(template.slice(0, -1));
        let htmlContent = compiledTemplate(templateParameters);

        return htmlContent;
    }

    _generateHtmlBody(inputMdFilePath, testResults) {
        let converter = new showdown.Converter();
        let mdContent = fs.readFileSync(inputMdFilePath, 'UTF-8');

        if (null !== testResults) {
            mdContent = this._formatContent(mdContent, testResults);
        }

        let body = `${converter.makeHtml(mdContent)}`;
        return body;
    }

    // Format on a per line basis to avoid multiple test conversions in a single replace operation.
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
        let testElementsRegex = /(?:\[(?:.*?)\])\(\?=(?:(.*?)\.)?(.*)\(\)\)/gm;
        let testElements = testElementsRegex.exec(searchString);

        // let testClassName = testElements[TEST_CLASS_INDEX];
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
