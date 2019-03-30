class NodeInvoker {
    invoke(testName, project, options){
        let testClass = new (this._loadModule(project))();
        let returnVal = testClass[testName](options.params);
        return returnVal;
    }

    _loadModule(path){
        return require(path);
    }
}

module.exports = NodeInvoker;
