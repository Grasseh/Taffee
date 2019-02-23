const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const showdown = require('showdown');

const RegexConstants = require('../util/regex_constants');

const TEST_EXPECTED_RESULT_INDEX = 1;
// const TEST_CLASS_INDEX = 2;
const TEST_NAME_INDEX = 3;
const TEST_PARAMETERS_INDEX = 4;

const PARAMETER_VALUE_INDEX = 1;
const PARAMETER_NAME_INDEX = 2;

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
        let paramsMap = new Map();

        mdLines.forEach((line, i, arr) => {
            [arr[i], paramsMap] = this._convertParameters(line, paramsMap);
            arr[i] = this._convertTests(arr[i], testResults, paramsMap);
        });

        return mdLines.join('\n');
    }

    _convertParameters(mdLine, paramsMap) {
        let parameterDetectionRegex = new RegExp(RegexConstants.PARAMETER_DETECTION_REGEX);
        let matchedParameters = mdLine.match(parameterDetectionRegex);

        if(null !== matchedParameters) {
            matchedParameters.forEach((match) => {
                [mdLine, paramsMap] = this._convertParameter(mdLine, match, paramsMap);
            });
        }

        return [mdLine, paramsMap];
    }

    _convertParameter(mdLine, searchString, paramsMap) {
        let parameterElementsRegex = new RegExp(RegexConstants.PARAMETER_ELEMENTS_REGEX);
        let parameterElements = parameterElementsRegex.exec(searchString);
        let value = parameterElements[PARAMETER_VALUE_INDEX];
        let name = parameterElements[PARAMETER_NAME_INDEX];

        paramsMap.set(name, value);
        mdLine = mdLine.replace(searchString, value);

        return [mdLine, paramsMap];
    }

    _convertTests(mdLine, testResults, paramsMap) {
        let testDetectionRegex = new RegExp(RegexConstants.TEST_DETECTION_REGEX);
        let matchedTests = mdLine.match(testDetectionRegex);

        if(null !== matchedTests) {
            matchedTests.forEach((match) => {
                mdLine = this._convertTest(mdLine, match, testResults, paramsMap);
            });
        }

        return mdLine;
    }

    _convertTest(mdLine, searchString, testResults, paramsMap) {
        let testElementsRegex = new RegExp(RegexConstants.TEST_ELEMENTS_REGEX);
        let testElements = testElementsRegex.exec(searchString);

        let expectedResult = testElements[TEST_EXPECTED_RESULT_INDEX];
        let testName = testElements[TEST_NAME_INDEX];
        let testParameters = testElements[TEST_PARAMETERS_INDEX];

        let parameterNamesRegex = new RegExp(RegexConstants.TEST_PARAMETER_NAME_REGEX);
        let parameterNames = testParameters.match(parameterNamesRegex);

        // Avoid null pointer exceptions. Regex returns null if there is no match.
        if(null === parameterNames) {
            parameterNames = [];
        }

        let testResult = testResults.find((tr) => {
            let isTrue = true;
            isTrue = isTrue && testName === tr.getTest().getTestName();
            isTrue = isTrue && expectedResult === tr.getTest().getExpectedResult();

            parameterNames.forEach((param) => {
                isTrue = isTrue && paramsMap.get(param) === tr.getTest().getParameters().get(param);
            });

            return isTrue;
        });

        if(undefined !== testResult) {
            mdLine = this.testFormatting[testResult.isSuccess()](mdLine, searchString, testResult);
        }

        return mdLine;
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
