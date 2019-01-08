/* global describe, it */
const assert = require('assert');
const sinon = require('sinon');
const EntryController = require('../src/index');

describe('EntryController', function() {
    describe('init', function() {
        it('Should output hello world', function() {
            let consoleStub = sinon.stub(console, 'info');
            let entryController = new EntryController();
            entryController.init();
            assert(consoleStub.calledWith('Hello World'));
        });
    });
});

