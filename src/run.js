const fs = require('fs');
const path = require('path');
const configParser = require('./util/configParser');
const testRunner = require('./runner/TestRunner');
const HTMLGenerator = require('./output/generator');
const MarkdownParser = require('./parser/MarkdownParser');
const MarkdownFileLocator = require('./locator/MarkdownFileLocator');

let parser = new MarkdownParser();
let htmlGenerator = new HTMLGenerator();

function convertPath(inputPath, baseInputPath, baseOutputPath) {
    if('' !== path.extname(baseInputPath)) {
        baseInputPath = path.dirname(baseInputPath);
    }

    let ext = path.extname(inputPath);
    let outputPath = inputPath.replace(ext, '.html');
    outputPath = outputPath.replace(baseInputPath, baseOutputPath);

    return outputPath;
}

function processFile(inputPath, outputPath) {
    if (args.verbose) {
        console.log(`Loading tests from ${inputPath}`);
    }

    let descriptor = parser.parseFile(inputPath);

    if (args.verbose) {
        console.log(`Preparing tests from ${descriptor.getMarkdown()}`);
    }

    let runner = new testRunner(descriptor);

    if (args.verbose) {
        console.log(`Running tests from ${runner.descriptor.getMarkdown()}`);
    }

    let result = runner.run();

    if (args.verbose) {
        console.log(`Generating HTML File at ${outputPath}`);
    }

    let html = htmlGenerator.generate(result, inputPath, outputPath);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);
}

const confParser = new configParser();
let {paths : {baseInputPath, baseOutputPath, cssFiles, template}, args} = confParser.parseConfig();

if(args.verbose) {
    console.log(`Loading files from ${baseInputPath}\n`);
}

if(cssFiles) {
    htmlGenerator.setCssFiles(cssFiles);
}

if(template) {
    htmlGenerator.setTemplate(template);
}

let fileLocator = new MarkdownFileLocator();
let inputPaths = fileLocator.locateFiles(baseInputPath, baseOutputPath);

inputPaths.forEach((inputPath) => {
    let outputPath = convertPath(inputPath, baseInputPath, baseOutputPath);
    processFile(inputPath, outputPath);
});
