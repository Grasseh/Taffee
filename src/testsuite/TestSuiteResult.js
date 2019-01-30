class TestSuiteResult {
    constructor(testResults) {
        let self = this;

        self._successes = 0;
        self._failures = 0;
        self._testResults = testResults;

        testResults.forEach(function(testResult) {
            if(testResult.isSuccess()) {
                self._successes++;
            }
            else {
                self._failures++;
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
