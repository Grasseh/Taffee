class TestSuiteResult {
    constructor(testResults) {
        this._successes = 0;
        this._failures = 0;
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

    getSuccesses(){
        return this._successes;
    }

    getFailures(){
        return this._failures;
    }
}

module.exports = TestSuiteResult;
