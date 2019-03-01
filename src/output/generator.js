const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const showdown = require('showdown');

// const RegexConstants = require('../util/regex_constants');

const DISCRIMINANT_VALUE_INDEX = 1;

const TEST_EXPECTED_RESULT_INDEX = 1;
// const TEST_CLASS_INDEX = 2;
const TEST_NAME_INDEX = 3;
const TEST_PARAMETERS_INDEX = 4;

const PARAMETER_VALUE_INDEX = 1;
const PARAMETER_NAME_INDEX = 2;

const DEFAULT_CSS = path.join(__dirname, '..', 'resources', 'output', 'styles.css');
const DEFAULT_TEMPLATE = path.join(__dirname, '..', 'resources', 'output', 'templates', 'outputTemplate.html');

// t | test | v | var | variable | i | inv | invoker | m | mod | module
// [](invoker: PHPInvoker)
// [](module: LeModule)
// [valeur](variable: nomDeLaVariable)
// [valeurAttendue](test: Class.NomDuTest(parametre1, parametre2, parametre3))

const INVOKER_DISCRIMINANTS_REGEX = 'i|inv|invoker';

const MODULE_DISCRIMINANTS_REGEX = 'm|mod|module';

const TEST_DISCRIMINANTS_REGEX = '\\?=|t|test';
const TEST_ELEMENTS_REGEX = `(?:\\[[&]?(.*?)\\])\\((?:${TEST_DISCRIMINANTS_REGEX})\\:?\\s?(?:(.*?)\\.)?(.*?)\\((.*)\\)\\)`;
const TEST_PARAMETER_NAME_REGEX = '[\\w\\d]+';

const PARAMETER_DISCRIMINANTS_REGEX = '#|variable|var|v';
const PARAMETER_ELEMENTS_REGEX = `\\[(.*)?\\]\\((?:${PARAMETER_DISCRIMINANTS_REGEX})\\:?\\s?([\\w\\d]+)\\)`;

const ELEMENT_DISCRIMINANTS_REGEX = `${INVOKER_DISCRIMINANTS_REGEX}|${MODULE_DISCRIMINANTS_REGEX}|${PARAMETER_DISCRIMINANTS_REGEX}|${TEST_DISCRIMINANTS_REGEX}`;
const ELEMENT_DETECTION_REGEX = `\\[.*?\\]\\((?:${ELEMENT_DISCRIMINANTS_REGEX})\\:?\\s?.*?\\)+`;

const DISCRIMINANT_DETECTION_REGEX = `\\]\\((${ELEMENT_DISCRIMINANTS_REGEX})`;

class HTMLGenerator {
    constructor() {
        this.elementFormattingFunctions = {};
        this.elementFormattingFunctions['i'] = this._formatInvoker.bind(this);
        this.elementFormattingFunctions['inv'] = this._formatInvoker.bind(this);
        this.elementFormattingFunctions['invoker'] = this._formatInvoker.bind(this);
        this.elementFormattingFunctions['m'] = this._formatModule.bind(this);
        this.elementFormattingFunctions['mod'] = this._formatModule.bind(this);
        this.elementFormattingFunctions['module'] = this._formatModule.bind(this);
        this.elementFormattingFunctions['#'] = this._formatParameter.bind(this);
        this.elementFormattingFunctions['v'] = this._formatParameter.bind(this);
        this.elementFormattingFunctions['var'] = this._formatParameter.bind(this);
        this.elementFormattingFunctions['variable'] = this._formatParameter.bind(this);
        this.elementFormattingFunctions['?='] = this._formatTest.bind(this);
        this.elementFormattingFunctions['t'] = this._formatTest.bind(this);
        this.elementFormattingFunctions['test'] = this._formatTest.bind(this);

        this.testFormattingFunctions = {};
        this.testFormattingFunctions[true] = this._formatSuccessfulTest.bind(this);
        this.testFormattingFunctions[false] = this._formatFailedTest.bind(this);

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

        let regex = new RegExp(ELEMENT_DETECTION_REGEX, 'g');
        let matches = mdContent.match(regex);
        if (null !== matches) {
            mdContent = this._formatMatches(mdContent, matches, testResults);
        }

        let body = `${converter.makeHtml(mdContent)}`;
        return body;
    }

    // Get or default since maps do not implement it.
    _getElementFormattingFunction(element, defaultFn = this._formatParameter) {
        let regex = new RegExp(DISCRIMINANT_DETECTION_REGEX, 'g');
        let match = regex.exec(element);

        let fn = defaultFn.bind(this);
        if(null !== match) {
            let discriminant = match[DISCRIMINANT_VALUE_INDEX];
            fn = this.elementFormattingFunctions[discriminant].bind(this);
        }

        return fn;
    }

    _formatMatches(mdContent, matches, testResults) {
        let formatElement;
        let paramsMap = {};

        matches.forEach((match) => {
            formatElement = this._getElementFormattingFunction(match);
            [mdContent, paramsMap] = formatElement(mdContent, match, paramsMap, testResults);
        });

        return mdContent;
    }

    _formatInvoker(mdContent, match, paramsMap) {
        mdContent = mdContent.replace(match, '');
        return [mdContent, paramsMap];
    }

    _formatModule(mdContent, match, paramsMap) {
        mdContent = mdContent.replace(match, '');
        return [mdContent, paramsMap];
    }

    _formatParameter(mdContent, match, paramsMap) {
        let parameterElementsRegex = new RegExp(PARAMETER_ELEMENTS_REGEX, 'g');
        let parameterElements = parameterElementsRegex.exec(match);
        let value = parameterElements[PARAMETER_VALUE_INDEX];
        let name = parameterElements[PARAMETER_NAME_INDEX];

        paramsMap[name] = value;
        mdContent = mdContent.replace(match, value);

        return [mdContent, paramsMap];
    }

    _formatTest(mdContent, match, paramsMap, testResults) {
        let testElementsRegex = new RegExp(TEST_ELEMENTS_REGEX, 'g');
        let testElements = testElementsRegex.exec(match);

        let expectedResult = testElements[TEST_EXPECTED_RESULT_INDEX];
        let testName = testElements[TEST_NAME_INDEX];
        let testParameters = testElements[TEST_PARAMETERS_INDEX];

        let parameterNamesRegex = new RegExp(TEST_PARAMETER_NAME_REGEX, 'g');
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
                isTrue = isTrue && paramsMap[param] === tr.getTest().getParameters()[param];
            });

            return isTrue;
        });

        if(undefined !== testResult) {
            let formatTest = this.testFormattingFunctions[testResult.isSuccess()];
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
