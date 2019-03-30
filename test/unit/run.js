/* global describe, it */
const assert = require('assert');
const stdout = require('test-console').stdout;

const { Main } = require('../../src/run');
const SilentLogger = require('../../src/log/SilentLogger');
const VerboseLogger = require('../../src/log/VerboseLogger');

describe('Run', function() {
    describe('Main', function() {
        it('Should run with silent logs', function() {
            let logger = new SilentLogger();

            let main = new Main();
            main.setLogger(logger);

            let baseInputPath = 'invalidInputPath';
            let baseOutputPath = 'invalidOutputPath';

            let inspect = stdout.inspect();
            main.main(baseInputPath, baseOutputPath);
            inspect.restore();
            assert.strictEqual(inspect.output.length, 0);
        });

        it('Should run with verbose logs', function() {
            let logger = new VerboseLogger();

            let main = new Main();
            main.setLogger(logger);

            let baseInputPath = 'invalidInputPath';
            let baseOutputPath = 'invalidOutputPath';

            let inspect = stdout.inspect();
            main.main(baseInputPath, baseOutputPath);
            inspect.restore();
            assert.strictEqual(inspect.output.length, 1);
            assert.deepEqual(inspect.output, ['[ INFO] Loading files from invalidInputPath\n']);
        });
    });
});

