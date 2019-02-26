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

const PARAMETER_REGEX = '\\[.+?\\]\\(#[\\w\\d]+\\)';
const TEST_REGEX = '\\[&?.+?\\]\\(\\?=[\\w\\d]+\\.[\\w\\d]+\\(.*?\\)\\)';
const ELEMENT_DISCRIMINANT_REGEX = '\\?=';

class HTMLGenerator {
    constructor() {
        this.elementFormattingFunctions = new Map();
        this.elementFormattingFunctions.set('?=', this._formatTest);

        this.testFormattingFunctions = new Map();
        this.testFormattingFunctions.set(true, this._formatSuccessfulTest);
        this.testFormattingFunctions.set(false, this._formatFailedTest);

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

        let reg = `${PARAMETER_REGEX}|${TEST_REGEX}`;
        let regex = new RegExp(reg, 'g');

        let matches = mdContent.match(regex);
        if (null !== matches) {
            mdContent = this._formatMatches(mdContent, matches, testResults);
        }

        let body = `${converter.makeHtml(mdContent)}`;
        return body;
    }

    // Get or default since maps do not implement it.
    _getElementFormattingFunction(element, defaultFn = this._formatParameter) {
        let regex = new RegExp(ELEMENT_DISCRIMINANT_REGEX);
        let discriminant = element.match(regex);

        let fn = defaultFn.bind(this);
        if(null !== discriminant) {
            fn = this.elementFormattingFunctions.get(discriminant[0]).bind(this);
        }

        return fn;
    }

    _formatMatches(mdContent, matches, testResults) {
        let formatElement;
        let paramsMap = new Map();

        matches.forEach((match) => {
            formatElement = this._getElementFormattingFunction(match);
            [mdContent, paramsMap] = formatElement(mdContent, match, paramsMap, testResults);
        });

        return mdContent;
    }

    _formatParameter(mdContent, match, paramsMap) {
        let parameterElementsRegex = new RegExp(RegexConstants.PARAMETER_ELEMENTS_REGEX);
        let parameterElements = parameterElementsRegex.exec(match);
        let value = parameterElements[PARAMETER_VALUE_INDEX];
        let name = parameterElements[PARAMETER_NAME_INDEX];

        paramsMap.set(name, value);
        mdContent = mdContent.replace(match, value);

        return [mdContent, paramsMap];
    }

    _formatTest(mdContent, match, paramsMap, testResults) {
        let testElementsRegex = new RegExp(RegexConstants.TEST_ELEMENTS_REGEX);
        let testElements = testElementsRegex.exec(match);

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
            let formatTest = this.testFormattingFunctions.get(testResult.isSuccess());
            mdContent = formatTest(mdContent, match, testResult);
        }

        return [mdContent, paramsMap];
    }

    _formatSuccessfulTest(mdContent, match, successfulTest) {
        let actualResult = successfulTest.getActualResult();
        let replaceString = `<span class="successful-test">${actualResult}</span>`;
        return mdContent.replace(match, replaceString);
    }

    _formatFailedTest(mdContent, match, failedTest) {
        let expectedResult = failedTest.getTest().getExpectedResult();
        let actualResult = failedTest.getActualResult();

        let replaceString = '<span class="failed-test">'
            + `<span class="failed-test-expected-result">${expectedResult}</span> `
            + `<span class="failed-test-actual-result">${actualResult}</span>`
            + '</span>';

        return mdContent.replace(match, replaceString);
    }
}

module.exports = HTMLGenerator;
