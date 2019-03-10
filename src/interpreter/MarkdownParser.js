const GenericParser = require('./GenericParser');
const Test = require('../testsuite/Test');
const TestSuiteDescriptor = require('../testsuite/TestSuiteDescriptor');
const path = require('path');
const fs = require('fs'); // eslint-disable-line no-unused-vars

// const RegexConstants = require('../util/regex_constants');

const DISCRIMINANT_VALUE_INDEX = 1;

const TEST_EXPECTED_RESULT_INDEX = 1;
const TEST_CLASS_INDEX = 2;
const TEST_NAME_INDEX = 3;
const TEST_PARAMETERS_INDEX = 4;

const PARAMETER_VALUE_INDEX = 1;
const PARAMETER_NAME_INDEX = 2;

const INVOKER_VALUE_INDEX = 2;
const MODULE_VALUE_INDEX = 2;

const INVOKER_DISCRIMINANTS_REGEX = 'i|inv|invoker';
const INVOKER_ELEMENTS_REGEX = `\\[(.*)?\\]\\((?:${INVOKER_DISCRIMINANTS_REGEX})\\:?\\s?([\\w\\d]+)\\)`;

const MODULE_DISCRIMINANTS_REGEX = 'm|mod|module';
const MODULE_ELEMENTS_REGEX = `\\[(.*)?\\]\\((?:${MODULE_DISCRIMINANTS_REGEX})\\:?\\s?([\\w\\d\\.\\/]+)\\)`;

const TEST_DISCRIMINANTS_REGEX = '\\?=|test|t';
const TEST_ELEMENTS_REGEX = `(?:\\[[&]?(.*?)\\])\\((?:${TEST_DISCRIMINANTS_REGEX})\\:?\\s?(?:(.*?)\\.)?(.*?)\\((.*)\\)\\)`;
const TEST_PARAMETER_NAME_REGEX = '[\\w\\d]+';

const PARAMETER_DISCRIMINANTS_REGEX = '#|variable|var|v';
const PARAMETER_ELEMENTS_REGEX = `\\[(.*)?\\]\\((?:${PARAMETER_DISCRIMINANTS_REGEX})\\:?\\s?([\\w\\d]+)\\)`;

const ELEMENT_DISCRIMINANTS_REGEX = `${INVOKER_DISCRIMINANTS_REGEX}|${MODULE_DISCRIMINANTS_REGEX}|${PARAMETER_DISCRIMINANTS_REGEX}|${TEST_DISCRIMINANTS_REGEX}`;
const ELEMENT_DETECTION_REGEX = `\\[.*?\\]\\((?:${ELEMENT_DISCRIMINANTS_REGEX})\\:?\\s?.*?\\)+`;

const DISCRIMINANT_DETECTION_REGEX = `\\]\\((${ELEMENT_DISCRIMINANTS_REGEX})`;


class MarkdownParser extends GenericParser{
    constructor(){
        super()
        this.elementParsingFunctions={
            'i': this._parseInvoker.bind(this),
            'inv': this._parseInvoker.bind(this),
            'invoker': this._parseInvoker.bind(this),
            'm': this._parseModule.bind(this),
            'mod': this._parseModule.bind(this),
            'module': this._parseModule.bind(this),
            '#': this._parseParameter.bind(this),
            'v': this._parseParameter.bind(this),
            'var': this._parseParameter.bind(this),
            'variable': this._parseParameter.bind(this),
            '?=': this._parseTests.bind(this),
            't': this._parseTests.bind(this),
            'test': this._parseTests.bind(this)
        }

        this.module = '';
        this.invoker = '';
        this.tests = [];
        this.params = {};
    }

    parseFile(filePath, options){ // eslint-disable-line no-unused-vars
        let mdContent = fs.readFileSync(filePath, 'UTF-8');

        this._generateTests(mdContent);

        return this._generateDescriptor(filePath);
    }

    _getElementParsingFunction(element) {
        let regex = new RegExp(DISCRIMINANT_DETECTION_REGEX, 'g');
        let match = regex.exec(element);
        let discriminant = match[DISCRIMINANT_VALUE_INDEX];
        let fn = this.elementParsingFunctions[discriminant];

        return fn;
    }

    _generateTests(mdContent){
        let regex = new RegExp(ELEMENT_DETECTION_REGEX, 'g');
        let matches = mdContent.match(regex);
        if(null !== matches){
            this._parseMatches(matches);
        }
    }

    _parseMatches(matches){
        let parseElement;

        matches.forEach((match) => {
            parseElement = this._getElementParsingFunction(match);
            parseElement(match);
        });
    }

    _parseInvoker(match){
        let invokerElementsRegex = new RegExp(INVOKER_ELEMENTS_REGEX, 'g');
        let invokerElements = invokerElementsRegex.exec(match);
        let value = invokerElements[INVOKER_VALUE_INDEX];

        this.invoker = value;
    }
    
    _parseModule(match){
        let moduleElementsRegex = new RegExp(MODULE_ELEMENTS_REGEX, 'g');
        let moduleElements = moduleElementsRegex.exec(match);
        let value = moduleElements[MODULE_VALUE_INDEX];

        this.module = value;
    }

    _parseParameter(match){
        let parameterElementsRegex = new RegExp(PARAMETER_ELEMENTS_REGEX, 'g');
        let parameterElements = parameterElementsRegex.exec(match);
        let value = parameterElements[PARAMETER_VALUE_INDEX];
        let name = parameterElements[PARAMETER_NAME_INDEX];

        this.params[name] = value;
    }

    _parseTests(match){
        let testElementsRegex = new RegExp(TEST_ELEMENTS_REGEX, 'g');
        let testElements = testElementsRegex.exec(match);

        let expectedResult = testElements[TEST_EXPECTED_RESULT_INDEX];
        let testName = testElements[TEST_NAME_INDEX];
        let testClass = testElements[TEST_CLASS_INDEX];

        let testParameters = testElements[TEST_PARAMETERS_INDEX];

        let parameterNamesRegex = new RegExp(TEST_PARAMETER_NAME_REGEX, 'g');
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

    _getParameters(testParameters){
        let parameters = [];

        testParameters.forEach((param) => {
            parameters.push(this.params[param]);
        })

        return parameters;
    }

    _generateDescriptor(filepath){

        let directory = path.dirname(filepath);
        let testFileName = path.join(directory, this.module);

        let descriptor = new TestSuiteDescriptor(testFileName, this.invoker, filepath);

        descriptor.setTests(this.tests);

        return descriptor;
    }
}

module.exports = MarkdownParser;