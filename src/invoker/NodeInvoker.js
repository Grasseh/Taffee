const GenericInvoker = require('./GenericInvoker');

class NodeInvoker extends GenericInvoker{
    invoke(testName, project, _params){
        let testClass = new (this._loadModule(project))();
        let returnVal = testClass[testName](_params);
        return returnVal;
    }

    _loadModule(path){
        return require(path);
    }
}

module.exports = NodeInvoker;
