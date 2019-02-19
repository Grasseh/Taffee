class TestSuiteResult {
    constructor(testResults, markdown) {
        this._successes = 0;
        this._failures = 0;
        this._markdown = markdown;
        this._testResults = testResults;

        testResults.forEach(testResult => {
            if(testResult.isSuccess()) {
                this._successes++;
            }
            else {
                this._failures++;
            }
        });
    }

    getTestResults(){
        return this._testResults;
    }

    getMarkdown(){
        return this._markdown;
    }

    getSuccesses(){
        return this._successes;
    }

    getFailures(){
        return this._failures;
    }
}

module.exports = TestSuiteResult;
