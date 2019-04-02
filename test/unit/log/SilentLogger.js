/* global describe, it */
const assert = require('assert');
const stdout = require('test-console').stdout;

const SilentLogger = require('../../../src/log/SilentLogger');
const VerboseLogger = require('../../../src/log/VerboseLogger');

describe('Logger Unit', function() {
    describe('SilentLogger', function() {
        it('Should print nothing when info() is called', function() {
            let logger = new SilentLogger();
            let inspect = stdout.inspect();
            logger.info('Hello, World!');
            inspect.restore();

            assert.strictEqual(inspect.output.length, 0);
        });

        it('Should print an error when error() is called', function() {
            let logger = new SilentLogger();
            let inspect = stdout.inspect();
            logger.error('Hello, World!');
            inspect.restore();

            assert.strictEqual(inspect.output.length, 1);
            assert.deepEqual(inspect.output, ['[ERROR] Hello, World!\n']);
        });
    });

    describe('VerboseLogger', function() {
        it('Should print an info when info() is called', function() {
            let logger = new VerboseLogger();
            let inspect = stdout.inspect();
            logger.info('Hello, World!');
            inspect.restore();

            assert.strictEqual(inspect.output.length, 1);
            assert.deepEqual(inspect.output, ['[ INFO] Hello, World!\n']);
        });

        it('Should print an error when error() is called', function() {
            let logger = new SilentLogger();
            let inspect = stdout.inspect();
            logger.error('Hello, World!');
            inspect.restore();

            assert.strictEqual(inspect.output.length, 1);
            assert.deepEqual(inspect.output, ['[ERROR] Hello, World!\n']);
        });
    });
});
