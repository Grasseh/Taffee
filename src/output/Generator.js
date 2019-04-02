const eol = require('eol');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const showdown = require('showdown');

const RegexConstants = require('../util/RegexConstants');

const DEFAULT_CSS = path.join(__dirname, '..', 'resources', 'output', 'styles.css');
const DEFAULT_TEMPLATE = path.join(__dirname, '..', 'resources', 'output', 'templates', 'outputTemplate.html');

class HTMLGenerator {
    constructor() {
        this.elementFormattingFunctions = {
            'i': this._formatInvoker.bind(this),
            'inv': this._formatInvoker.bind(this),
            'invoker': this._formatInvoker.bind(this),
            'm': this._formatModule.bind(this),
            'mod': this._formatModule.bind(this),
            'module': this._formatModule.bind(this),
            'v': this._formatParameter.bind(this),
            'var': this._formatParameter.bind(this),
            'variable': this._formatParameter.bind(this),
            't': this._formatTest.bind(this),
            'test': this._formatTest.bind(this)
        };

        this.testFormattingFunctions = {
            true: this._formatSuccessfulTest.bind(this),
            false: this._formatFailedTest.bind(this)
        };

        this.cssFiles = [DEFAULT_CSS];
        this.template = DEFAULT_TEMPLATE;
    }

    setCssFiles(...cssFiles) {
        this.cssFiles = cssFiles;
    }

    setTemplate(template) {
        this.outputTemplate = template;
    }

    generate(testSuiteResults, inputPath, outputPath) {
        let outputDir = path.dirname(outputPath);
        let relativeCssFiles = this.cssFiles.map((css) => path.relative(outputDir, css));
        let body = this._generateHtmlBody(inputPath, testSuiteResults.getTestResults());

        let templateParameters = {};
        templateParameters['cssFiles'] = relativeCssFiles;
        templateParameters['content'] = body;

        let template = fs.readFileSync(this.template, 'UTF-8');
        let compiledTemplate = handlebars.compile(template.slice(0, -1));
        let htmlContent = compiledTemplate(templateParameters);

        return eol.auto(htmlContent);
    }

    _generateHtmlBody(inputPath, testResults) {
        let converter = new showdown.Converter();
        let mdContent = fs.readFileSync(inputPath, 'UTF-8');

        let regex = new RegExp(RegexConstants.ELEMENT_DETECTION_REGEX, 'g');
        let matches = mdContent.match(regex);
        if (null !== matches) {
            mdContent = this._formatMatches(mdContent, matches, testResults);
        }

        let body = `${converter.makeHtml(mdContent)}`;
        return body;
    }

    _getElementFormattingFunction(element) {
        let regex = new RegExp(RegexConstants.DISCRIMINANT_DETECTION_REGEX, 'g');
        let match = regex.exec(element);
        let discriminant = match[RegexConstants.DISCRIMINANT_VALUE_INDEX];
        let fn = this.elementFormattingFunctions[discriminant];

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
        let parameterElementsRegex = new RegExp(RegexConstants.PARAMETER_ELEMENTS_REGEX, 'g');
        let parameterElements = parameterElementsRegex.exec(match);
        let value = parameterElements[RegexConstants.PARAMETER_VALUE_INDEX];
        let name = parameterElements[RegexConstants.PARAMETER_NAME_INDEX];

        paramsMap[name] = value;
        mdContent = mdContent.replace(match, value);

        return [mdContent, paramsMap];
    }

    _formatTest(mdContent, match, paramsMap, testResults) {
        let testElementsRegex = new RegExp(RegexConstants.TEST_ELEMENTS_REGEX, 'g');
        let testElements = testElementsRegex.exec(match);

        let expectedResult = testElements[RegexConstants.TEST_EXPECTED_RESULT_INDEX];
        let testName = testElements[RegexConstants.TEST_NAME_INDEX];
        let testParameters = testElements[RegexConstants.TEST_PARAMETERS_INDEX];

        let parameterNamesRegex = new RegExp(RegexConstants.TEST_PARAMETER_NAME_REGEX, 'g');
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
