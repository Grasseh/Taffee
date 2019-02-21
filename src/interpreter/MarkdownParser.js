const GenericParser = require('./GenericParser');
const Test = require('../testsuite/Test');
const TestSuiteDescriptor = require('../testsuite/TestSuiteDescriptor');
const path = require('path');

const fs = require('fs'); // eslint-disable-line no-unused-vars
const DESCRIPTOR_FLAGS_REGEX = /\[\*(.*)\].*/ig;
const resultFlags_re = /\[&(.*)\].*/ig;
const INSIDE_PARENTHESIS_REGEX = /\((.*)\)/;
const TEST_DETECTION_REGEX = /\[.*?\]\(\?=.*?\)\)/gm;
const TEST_ELEMENTS_REGEX = /(?:\[(.*?)\])\(\?=(?:(.*?)\.)?(.*?)\((.*)\)\)/gm;
const TEST_PARAMETER_NAME_REGEX = /[\w\d]+/gm;

const PARAMETER_DETECTION_REGEX = /\[.*?\]\(#.*?\)/gm;
const PARAMETER_ELEMENTS_REGEX = /(?:.*?)\[(.*)?\]\(#(.*)?\)/gm;

const TEST_EXPECTED_RESULT_INDEX = 1;
const TEST_CLASS_INDEX = 2;
const TEST_NAME_INDEX = 3;
const TEST_PARAMETERS_INDEX = 4;

const PARAMETER_VALUE_INDEX = 1;
const PARAMETER_NAME_INDEX = 2;


class MarkdownParser extends GenericParser{
    parseFile(filePath, options){ // eslint-disable-line no-unused-vars
        let mdContent = fs.readFileSync(filePath, 'UTF-8');

        let tests = this._generateTests(mdContent);

        return this._generateDescriptor(mdContent, filePath, tests);
    }

    _getDescriptorTags(mdContent) {
        let tags = [];
        let matches;
        while ((matches = DESCRIPTOR_FLAGS_REGEX.exec(mdContent)) !== null) {
            tags[matches[1]] = INSIDE_PARENTHESIS_REGEX.exec(matches[0])[1];
        }
        return tags;
    }


    _generateTests(mdContent){
        let tests = [];
        let params = {};

        let mdLines = mdContent.split('\n');
        mdLines.forEach((line) => {
            // parse for params
            this._parseParameters(line, params);
            // parse for a test
            this._parseTests(line, params, tests);
        });

        return tests;
    }

    _parseParameters(line, params){
        let matches;
        let match;
        if(null !== line){
            console.log(line);
            do {
                match = PARAMETER_DETECTION_REGEX.exec(line);
                if (match){
                    this._addParameter(match[0], params);
                }
            } while (match);
            // while ((matches = PARAMETER_DETECTION_REGEX.exec(line)) !== null) {
            //     this._addParameter(matches[0], params);
            // }
        }
    }

    _addParameter(line, params){
        console.log(`add parameter from line "${line}":`);
        let parameterElements = PARAMETER_ELEMENTS_REGEX.exec(line);
        console.log(parameterElements);
        if(null !== parameterElements){
            let value = parameterElements[PARAMETER_VALUE_INDEX];
            console.log(value);
            let name = parameterElements[PARAMETER_NAME_INDEX];
            console.log(name);
            params[name] = value;
        }
    }

    _parseTests(line, params, tests){
        let matches;
        if(null !== line){
            while ((matches = TEST_DETECTION_REGEX.exec(line)) !== null) {
                this._addTest(matches[0], params, tests);
            }
        }
    }

    _addTest(line, params, tests){
        console.log(`found test in line "${line}"`);
        let testElements = TEST_ELEMENTS_REGEX.exec(line);
        if(null !== testElements){
            8;
            let testName = testElements[TEST_NAME_INDEX];
            let testClass = testElements[TEST_CLASS_INDEX];
            let testExpectedResult = testElements[TEST_EXPECTED_RESULT_INDEX];
            let testParametersNames = testElements[TEST_PARAMETERS_INDEX];

            let testParameters = this._extractTestParameters(testParametersNames, params);

            tests.push(new Test(testClass, testName, testExpectedResult, testParameters));
        }
    }

    _extractTestParameters(testParametersNames, params){
        let parameters = [];
        let matches;
        while ((matches = TEST_PARAMETER_NAME_REGEX.exec(testParametersNames)) !== null) {
            console.log(`adding param ${matches[0]} with value ${params[matches[0]]}`);
            parameters.push(params[matches[0]]);
        }

        return parameters;
    }

    _generateDescriptor(mdContent, filepath, tests){
        let descriptor_tags = this._getDescriptorTags(mdContent);

        let directory = path.dirname(filepath);
        let testFileName = path.join(directory, descriptor_tags['module']);

        let invoker = descriptor_tags['invoker'];

        let descriptor = new TestSuiteDescriptor(testFileName, invoker, filepath);

        descriptor.setTests(tests);

        console.log(tests);

        return descriptor;
    }
}

module.exports = MarkdownParser;
