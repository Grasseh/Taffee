const fs = require('fs');
const path = require('path');
const showdown = require('showdown');

class HTMLGenerator {
    generate(testSuiteResult, cssFilePath) {
        let mdFilePath = testSuiteResult.getTestFileName();
        let mdContent = fs.readFileSync(mdFilePath, 'UTF-8');

        let relativeCssPath = path.relative(path.dirname(mdFilePath), cssFilePath);

        let htmlContent = '<!DOCTYPE html>\n<html>\n<head>\n';
        htmlContent += `<link rel="stylesheet" href="${relativeCssPath}">\n`;
        htmlContent += '</head>\n<body>\n';

        htmlContent += this._convertFile(mdContent);
        htmlContent += '\n</body>\n</html>';

        let successfulTests = testSuiteResult.getTestResults().filter((t) => t.isSuccess());
        htmlContent = this._formatSuccessfulTests(htmlContent, successfulTests);

        let failedTests = testSuiteResult.getTestResults().filter((t) => !t.isSuccess());
        htmlContent = this._formatFailedTests(htmlContent, failedTests);

        return htmlContent;
    }

    _convertFile(mdContent) {
        // mdContent = this._convertMultiVariableMethods(mdContent);
        mdContent = this._removeVariables(mdContent);

        let converter = new showdown.Converter();
        return converter.makeHtml(mdContent);
    }

    /*
    _convertMultiVariableMethods(mdContent) {
        let multiVarTestRegex = /^(?:(?:(?:.*(\[(.*)\]\((\?=.*\((?:#.*, )+(?:#.*)\))\)))+(?:.*)))+$/gm;
        let match = multiVarTestRegex.exec(mdContent);

        while(match) {
            // console.log(match);
            match = multiVarTestRegex.exec(mdContent);
        }

        return mdContent;
    }
    */

    _removeVariables(mdContent) {
        return mdContent;
    }

    _formatSuccessfulTests(htmlContent, successfulTests) {
        successfulTests.forEach((testResult) => {
            let testName = testResult.getTest().getTestName();
            let actualResult = testResult.getActualResult();

            // let parameters = testResult.getTest().getParameters();
            let formattedParameters = ''; // this._formatTestParameters(parameters);

            let searchString = `<a href="?=${testName}(${formattedParameters})">${actualResult}</a>`;
            let replaceString = `<span class="successful-test">${actualResult}</span>`;
            htmlContent = htmlContent.replace(searchString, replaceString);
        });

        return htmlContent;
    }

    _formatFailedTests(htmlContent, failedTests) {
        failedTests.forEach((testResult) => {
            let testName = testResult.getTest().getTestName();
            let expectedResult = testResult.getTest().getExpectedResult();
            let actualResult = testResult.getActualResult();

            // let parameters = testResult.getTest().getParameters();
            let formattedParameters = ''; // this._formatTestParameters(parameters);

            let searchString = `<a href="?=${testName}(${formattedParameters})">${expectedResult}</a>`;
            let replaceString = '<span class="failed-test">'
                + `<span class="failed-test-expected-result">${expectedResult}</span> `
                + `<span class="failed-test-actual-result">${actualResult}</span>`
                + '</span>';

            htmlContent = htmlContent.replace(searchString, replaceString);
        });

        return htmlContent;
    }

    /*
    _formatTestParameters(parameters) {
        let parametersList = [...parameters.keys()];
        let formattedParameters = parametersList
            .map((p) => p = `#${p}`)
            .reduce((acc, v) => acc += `${v}, `, '');

        return formattedParameters.slice(0, -2);
    }
    */
}

module.exports = HTMLGenerator;
