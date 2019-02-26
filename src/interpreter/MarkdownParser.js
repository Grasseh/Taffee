const GenericParser = require('./GenericParser');
const Test = require('../testsuite/Test');
const TestSuiteDescriptor = require('../testsuite/TestSuiteDescriptor');
const path = require('path');

const fs = require('fs'); // eslint-disable-line no-unused-vars
const descriptorFlags_re = /\[\*(.*)\].*/ig;
const resultFlags_re = /\[&(.*)\].*/ig;
const inside_parenthesis_re = /\((.*)\)/;

class MarkdownParser extends GenericParser{
    parseFile(filePath, options){ // eslint-disable-line no-unused-vars
        let mdContent = fs.readFileSync(filePath, 'UTF-8');
        let descriptor_tags = this._getTags(mdContent, descriptorFlags_re);
        let descriptor = this._generateDescriptor(descriptor_tags, filePath);
        let result_tags = this._getTags(mdContent, resultFlags_re);
        let tests = this._generateTests(result_tags);

        descriptor.setTests(tests);
        return descriptor;
    }

    _getTags(mdContent, re) {
        let tags = [];
        let matches;
        while ((matches = re.exec(mdContent)) !== null) {
            tags[matches[1]] = inside_parenthesis_re.exec(matches[0])[1];
        }
        return tags;
    }

    _generateTests(result_tags){
        let tests = [];
        let classmethod, testClass, testName;
        for(let key in result_tags){
            classmethod = result_tags[key].split('=')[1];
            testClass = classmethod.split('.')[0];
            testName = classmethod.split('.')[1].replace('(', '').replace(')', ''); // will need to handle params at some point
            tests.push(new Test(testClass, testName, key, null));
        }
        return tests;
    }

    _generateDescriptor(descriptor_tags, filepath){
        let directory = path.dirname(filepath);
        let testFileName = path.join(directory, descriptor_tags['module']);
        let invoker = descriptor_tags['invoker'];
        let descriptor = new TestSuiteDescriptor(testFileName, invoker, filepath);
        return descriptor;
    }
}

module.exports = MarkdownParser;
