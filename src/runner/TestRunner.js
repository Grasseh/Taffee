const TestResult = require('../testsuite/TestResult');
const TestSuiteResult = require('../testsuite/TestSuiteResult');

class TestRunner{
    constructor(descriptor){
        this.descriptor = descriptor;
        this.results = [];
        this.invoker = new (require(`../invoker/${descriptor.getInvoker()}`))();
    }

    run(){
        for(let test of this.descriptor.getTests()){
            let options = {
                className : test.getTestClass()
            };
            let actualResult = this.invoker.invoke(test.getTestName(), this.descriptor.getTestFileName(), options);
            let success = actualResult === test.getExpectedResult();
            this.results.push(new TestResult(test, success, actualResult));
        }
        return new TestSuiteResult(this.results, this.descriptor.getMarkdown());
    }
}

module.exports = TestRunner;
