class Test {
    constructor(testClass, testName, expectedResult, parameters) {
        this._testClass = testClass;
        this._testName = testName;
        this._expectedResult = expectedResult;
        this._parameters = parameters;
    }

    getTestClass(){
        return this._testClass;
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
