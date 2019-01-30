class Test {
    constructor(testName, expectedResult, parameters) {
        this._testName = testName;
        this._expectedResult = expectedResult;
        this._parameters = parameters;
    }

    getTestName(){
        return this._testName;
    }

    getExpectedResult(){
        return this._expectedResult;
    }

    getParameters(){
        return this._parameters;
    }
}

module.exports = Test;
