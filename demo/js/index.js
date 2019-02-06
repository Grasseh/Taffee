const assert = require('assert');
const path = require('path');
const HelloWorld = require('./helloworld');

var value = 'Hello World';

describe('Hello World', function() {
    describe('get', function() {
        it('Should receive a string received in parameters (Hello World), ${value}', function() {
            let hello = new HelloWorld();
            let test = hello.getHelloWorld();
            assert.strictEqual(test, 'Hello World');
        });
    });
});
