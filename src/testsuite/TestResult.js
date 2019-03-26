class TestResult {
    constructor(test, success, actualResult) {
        this._test = test;
        this._success = success;
        this._actualResult = actualResult;
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
}

module.exports = TestResult;
