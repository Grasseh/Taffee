const fs = require('fs');
const showdown = require('showdown');

class HTMLGenerator {
    generate(mdFilePath) {
        console.log(mdFilePath);
        let mdContent = fs.readFileSync(mdFilePath, 'UTF-8');
        let htmlContent = this._convertFile(mdContent);
        return htmlContent;
    }

    _convertFile(mdContent) {
        mdContent = this._convertMultiVariableMethods(mdContent);
        mdContent = this._removeVariables(mdContent);

        let converter = new showdown.Converter();
        return converter.makeHtml(mdContent);
    }

    _convertMultiVariableMethods(mdContent) {
        let multiVarTestRegex = /^(?:(?:(?:.*(\[(.*)\]\((\?=.*\((?:#.*, )+(?:#.*)\))\)))+(?:.*)))+$/gm;
        let match = multiVarTestRegex.exec(mdContent);

        while(match) {
            // console.log(match);
            match = multiVarTestRegex.exec(mdContent);
        }

        return mdContent;
    }

    _removeVariables(mdContent) {
        return mdContent;
    }

    _formatSuccessfulTests(htmlContent, successfulTests) {
        successfulTests.forEach((testResult) => {
            let testName = testResult.getTest().getTestName();
            let actualResult = testResult.getActualResult();

            let parameters = testResult.getTest().getParameters();
            let formattedParameters = this._formatTestParameters(parameters);

            let searchString = `<a href="?=${testName}(${formattedParameters})">${actualResult}</a>`;
            let replaceString = `<span class="successful-test">${actualResult}</span>`;
            htmlContent = htmlContent.replace(searchString, replaceString);
        });

        return htmlContent;
    }

    _formatFailedTests(htmlContent, failedTests) {
        console.log(failedTests.length);
        return htmlContent;
    }

    _formatTestParameters(parameters) {
        let parametersList = [...parameters.keys()];
        let formattedParameters = parametersList
            .map((p) => p = `#${p}`)
            .reduce((acc, v) => acc += `${v}, `, '');

        return formattedParameters.slice(0, -2);
    }
}

module.exports = HTMLGenerator;
