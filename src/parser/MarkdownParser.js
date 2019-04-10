const Test = require('../model/Test');
const TestSuiteDescriptor = require('../model/TestSuiteDescriptor');
const path = require('path');
const fs = require('fs');

const RegexConstants = require('../util/RegexConstants');

class MarkdownParser {
    constructor() {
        this.elementParsingFunctions={
            'i': this._parseInvoker.bind(this),
            'inv': this._parseInvoker.bind(this),
            'invoker': this._parseInvoker.bind(this),
            'm': this._parseModule.bind(this),
            'mod': this._parseModule.bind(this),
            'module': this._parseModule.bind(this),
            'v': this._parseParameter.bind(this),
            'var': this._parseParameter.bind(this),
            'variable': this._parseParameter.bind(this),
            't': this._parseTests.bind(this),
            'test': this._parseTests.bind(this)
        };

        this.module = '';
        this.invoker = '';
        this.tests = [];
        this.params = {};
    }

    parseFile(filePath) {
        let mdContent = fs.readFileSync(filePath, 'UTF-8');

        this._generateTests(mdContent);
        return this._generateDescriptor(filePath);
    }

    _getElementParsingFunction(element) {
        let regex = new RegExp(RegexConstants.DISCRIMINANT_DETECTION_REGEX, 'g');
        let match = regex.exec(element);
        let discriminant = match[RegexConstants.DISCRIMINANT_VALUE_INDEX];
        let fn = this.elementParsingFunctions[discriminant];

        return fn;
    }

    _generateTests(mdContent) {
        let regex = new RegExp(RegexConstants.ELEMENT_DETECTION_REGEX, 'g');
        let matches = mdContent.match(regex);
        if(null !== matches) {
            this._parseMatches(matches);
        }
    }

    _parseMatches(matches) {
        let parseElement;

        matches.forEach((match) => {
            parseElement = this._getElementParsingFunction(match);
            parseElement(match);
        });
    }

    _parseInvoker(match) {
        let invokerElementsRegex = new RegExp(RegexConstants.INVOKER_ELEMENTS_REGEX, 'g');
        let invokerElements = invokerElementsRegex.exec(match);
        let value = invokerElements[RegexConstants.INVOKER_VALUE_INDEX];

        this.invoker = value;
    }

    _parseModule(match) {
        let moduleElementsRegex = new RegExp(RegexConstants.MODULE_ELEMENTS_REGEX, 'g');
        let moduleElements = moduleElementsRegex.exec(match);
        let value = moduleElements[RegexConstants.MODULE_VALUE_INDEX];

        this.module = value;
    }

    _parseParameter(match) {
        let parameterElementsRegex = new RegExp(RegexConstants.PARAMETER_ELEMENTS_REGEX, 'g');
        let parameterElements = parameterElementsRegex.exec(match);
        let value = parameterElements[RegexConstants.PARAMETER_VALUE_INDEX];
        let name = parameterElements[RegexConstants.PARAMETER_NAME_INDEX];

        this.params[name] = value;
    }

    _parseTests(match) {
        let testElementsRegex = new RegExp(RegexConstants.TEST_ELEMENTS_REGEX, 'g');
        let testElements = testElementsRegex.exec(match);

        let expectedResult = testElements[RegexConstants.TEST_EXPECTED_RESULT_INDEX];
        let testName = testElements[RegexConstants.TEST_NAME_INDEX];
        let testClass = testElements[RegexConstants.TEST_CLASS_INDEX];

        let testParameters = testElements[RegexConstants.TEST_PARAMETERS_INDEX];

        let parameterNamesRegex = new RegExp(RegexConstants.TEST_PARAMETER_NAME_REGEX, 'g');
        let parameterNames = testParameters.match(parameterNamesRegex);

        // Avoid null pointer exceptions. Regex returns null if there is no match.
        if(null === parameterNames) {
            parameterNames = [];
        }

        this._addTest(testClass, testName, expectedResult, parameterNames);
    }

    _addTest(testClass, testName, expectedResult, testParameterNames){
        let parameters = this._getParameters(testParameterNames);

        this.tests.push(new Test(testClass, testName, expectedResult, parameters));
    }

    _getParameters(testParameters) {
        let parameters = {};

        testParameters.forEach((param) => {
            parameters[param] = this.params[param];
        });

        return parameters;
    }

    _generateDescriptor(filepath) {

        let directory = path.dirname(filepath);
        let testFileName = path.join(directory, this.module);

        let descriptor = new TestSuiteDescriptor(testFileName, this.invoker, filepath);

        descriptor.setTests(this.tests);

        return descriptor;
    }
}

module.exports = MarkdownParser;
