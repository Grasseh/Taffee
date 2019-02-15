const TestResult = require('../testsuite/TestResult');
const TestSuiteResult = require('../testsuite/TestSuiteResult');

class TestRunner{
    constructor(descriptor){
        this.descriptor = descriptor;
        this.results = [];
        this.invoker = this._getInvoker(descriptor.getInvoker());
    }

    run(){
        for(let test of this.descriptor.getTests()){
            let options = {
                className : test.getTestClass()
            };
            let actualResult = this.invoker.invoke(test.getTestName(), this.descriptor.getTestFileName(), options);
            let success = actualResult === test.getExpectedResult();
            this.results.push(new (this._getTestResult())(test, success, actualResult));
        }
        return new (this._getTestSuiteResult())(this.results, this.descriptor.getMarkdown());
    }

    _getTestResult(){
        return TestResult;
    }

    _getTestSuiteResult(){
        return TestSuiteResult;
    }

    _getInvoker(invoker){
        return new (require(`../invoker/${invoker}`))();
    }
}

module.exports = TestRunner;
