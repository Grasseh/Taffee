/* global describe, it */
const assert = require('assert');
const sinon = require('sinon');
const ConfigParser = require('../../../src/util/configParser');

describe('ConfigParser', function() {
    describe('parsePaths', function() {
        it('Should return config paths', function() {
            let configParser = new ConfigParser();
            let paths = {
                basePath : 'bp',
                outputPath : 'op'
            };
            let explorerStub = sinon.stub().returns({
                searchSync : sinon.stub().returns({config : paths})
            });
            let cosmiconfigStub = sinon.stub(configParser, '_getCosmiconfig').returns(explorerStub);
            let configPath = null;
            let testResult = configParser.parsePaths(configPath);
            assert.strictEqual(testResult.basePath, paths.basePath);
            assert.strictEqual(testResult.outputPath, paths.outputPath)
            assert(cosmiconfigStub.called);
            assert(explorerStub.calledWith('pfe'));
        });
    });
});

