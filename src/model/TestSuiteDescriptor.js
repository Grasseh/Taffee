class TestSuiteDescriptor {
    constructor(testFileName, invoker, markdown) {
        this._testFileName = testFileName;
        this._invoker = invoker;
        this._tests = [];
        this._markdown = markdown;
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

    getMarkdown(){
        return this._markdown;
    }
}

module.exports = TestSuiteDescriptor;
