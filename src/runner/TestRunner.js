const TestResult = require('../model/TestResult');
const TestSuiteResult = require('../model/TestSuiteResult');

class TestRunner{
    constructor(descriptor){
        this.descriptor = descriptor;
        this.results = [];
        this.invoker = this._getInvoker(descriptor.getInvoker());
    }

    run(){
        for(let test of this.descriptor.getTests()){
            let options = {
                className : test.getTestClass(),
                params : test.getParameters()
            };
            let actualResult = this.invoker.invoke(test.getTestName(), this.descriptor.getTestFileName(), options);
            let success = actualResult.toString() === test.getExpectedResult();
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
