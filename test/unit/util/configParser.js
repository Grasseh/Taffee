/* global describe, it */
const assert = require('assert');
const sinon = require('sinon');
const ConfigParser = require('../../../src/util/configParser');

describe('ConfigParser', function() {
    describe('parsePaths', function() {
        it('Should return config paths on default', function() {
            let configParser = new ConfigParser();
            let paths = {
                basePath : 'bp',
                outputPath : 'op'
            };
            let explorersStub = {
                searchSync : sinon.stub().returns({config : paths}),
                loadSync : sinon.stub().returns({config : paths}),
            };
            let explorerStub = sinon.stub().returns(explorersStub);
            let cosmiconfigStub = sinon.stub(configParser, '_getCosmiconfig').returns(explorerStub);
            let configPath = null;
            let testResult = configParser.parsePaths(configPath);
            assert.strictEqual(testResult.basePath, paths.basePath);
            assert.strictEqual(testResult.outputPath, paths.outputPath)
            assert(cosmiconfigStub.called);
            assert(!explorersStub.loadSync.called);
            assert(explorerStub.calledWith('pfe'));
        });
        
        it('Should return config paths on provided path', function() {
            let configParser = new ConfigParser();
            let wrongpaths = {
                basePath : 'wbp',
                outputPath : 'wop'
            };
            let paths = {
                basePath : 'bp',
                outputPath : 'op'
            };
            let explorersStub = {
                searchSync : sinon.stub().returns({config : wrongpaths}),
                loadSync : sinon.stub().returns({config : paths}),
            };
            let explorerStub = sinon.stub().returns(explorersStub);
            let cosmiconfigStub = sinon.stub(configParser, '_getCosmiconfig').returns(explorerStub);
            let configPath = "abcd";
            let testResult = configParser.parsePaths(configPath);
            assert.strictEqual(testResult.basePath, paths.basePath);
            assert.strictEqual(testResult.outputPath, paths.outputPath)
            assert(cosmiconfigStub.called);
            assert(explorerStub.calledWith('pfe'));
            assert(explorersStub.loadSync.calledWith('abcd'));
        });

        it('Should exit on no paths found', function() {
            let configParser = new ConfigParser();
            let explorersStub = {
                searchSync : sinon.stub().returns(null),
            };
            let processStubFn = {
                exit : sinon.stub()
            };
            let explorerStub = sinon.stub().returns(explorersStub);
            let cosmiconfigStub = sinon.stub(configParser, '_getCosmiconfig').returns(explorerStub);
            let processStub = sinon.stub(configParser, '_getProcess').returns(processStubFn);
            let configPath = null;
            let testResult = configParser.parsePaths(configPath);
            assert(cosmiconfigStub.called);
            assert(explorerStub.calledWith('pfe'));
            assert(processStub.called);
            assert(processStubFn.exit.calledWith(1));
        });
        
    });
});

