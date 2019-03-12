class TestResult {
    constructor(test, success, actualResult, parameters = {}) {
        this._test = test;
        this._success = success;
        this._actualResult = actualResult;
        this._parameters = parameters;
    }

    getTest(){
        return this._test;
    }

    isSuccess(){
        return this._success;
    }

    getActualResult(){
        return this._actualResult;
    }

    getParameters() {
        return this._parameters;
    }
}

module.exports = TestResult;
