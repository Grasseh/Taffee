class TestSuiteDescriptor {
    constructor(testFileName, invoker) {
        this._testFileName = testFileName;
        this._invoker = invoker;
        this._tests = [];
    }

    getTestFileName(){
        return this._testFileName;
    }

    setTests(tests){
        this._tests = tests;
    }

    addTest(test) {
        this._tests.push(test);
    }

    getTests(){
        return this._tests;
    }

    getInvoker(){
        return this._invoker;
    }
}

module.exports = TestSuiteDescriptor;
