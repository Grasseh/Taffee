const fs = require('fs');
const path = require('path');

const SilentLogger = require('./log/SilentLogger');
const VerboseLogger = require('./log/VerboseLogger');
const ConfigParser = require('./util/ConfigParser');
const TestRunner = require('./runner/TestRunner');
const HTMLGenerator = require('./output/Generator');
const MarkdownParser = require('./parser/MarkdownParser');
const MarkdownFileLocator = require('./locator/MarkdownFileLocator');

class Main {
    constructor() {
        this._generator = new HTMLGenerator();
        this._locator = new MarkdownFileLocator();
        this._logger = new SilentLogger();
        this._parser = new MarkdownParser();
    }

    getGenerator() {
        return this._generator;
    }

    setLogger(logger) {
        this._logger = logger;
    }

    main(baseInputPath, baseOutputPath) {
        this._logger.info(`Loading files from ${baseInputPath}`);

        // Process all relevant files.
        let inputPaths = this._locator.locateFiles(baseInputPath, baseOutputPath);
        inputPaths.forEach((inputPath) => {
            let outputPath = this._convertPath(inputPath, baseInputPath, baseOutputPath);
            this._processFile(inputPath, outputPath, this._parser, this._generator, this._logger);
        });
    }

    _convertPath(inputPath, baseInputPath, baseOutputPath) {
        if('' !== path.extname(baseInputPath)) {
            baseInputPath = path.dirname(baseInputPath);
        }

        let ext = path.extname(inputPath);
        let outputPath = inputPath.replace(ext, '.html');
        outputPath = outputPath.replace(baseInputPath, baseOutputPath);

        return outputPath;
    }

    _processFile(inputPath, outputPath, parser, generator, logger) {
        logger.info(`Loading tests from ${inputPath}`);
        let descriptor = parser.parseFile(inputPath);

        logger.info(`Preparing tests from ${descriptor.getMarkdown()}`);
        let runner = new TestRunner(descriptor);

        logger.info(`Running tests from ${runner.descriptor.getMarkdown()}`);
        let result = runner.run();

        logger.info(`Generating HTML File at ${outputPath}`);
        let content = generator.generate(result, result.getMarkdown(), outputPath);

        let outputDir = path.dirname(outputPath);
        if(!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, content);
    }
}

function main(conf = new ConfigParser(), logger = new SilentLogger()) {
    let { paths: { baseInputPath, baseOutputPath, cssFiles, template }, args } = conf.parseConfig(logger);

    let main = new Main();
    if(undefined !== cssFiles) {
        main.getGenerator().setCssFiles(cssFiles);
    }

    if(undefined !== template) {
        main.getGenerator().setTemplate(template);
    }

    if(args.verbose) {
        main.setLogger(new VerboseLogger());
    }

    main.main(baseInputPath, baseOutputPath);
}

module.exports = { Main, main };
