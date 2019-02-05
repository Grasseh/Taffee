class TestSuiteDescriptor {
    constructor(testFileName) {
        this._testFileName = testFileName;
        this._tests = [];
    }

    getTestFileName(){
        return this._testFileName;
    }

    addTest(test) {
        this._tests.push(test);
    }

    getTests(){
        return this._tests;
    }
}

module.exports = TestSuiteDescriptor;
