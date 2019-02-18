class TestResult {
    constructor(test, success, actualResult, parameters = new Map()) {
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
        return this.parameters;
    }
}

module.exports = TestResult;
