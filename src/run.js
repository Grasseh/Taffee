const App = require('./index');
const fs = require('fs');
const path = require('path');
const configParser = require('./util/configParser');
const testRunner = require('./runner/TestRunner');
const HTMLGenerator = require('./output/generator');

let parser = new App.interpreter.MarkdownParser();
let htmlGenerator = new HTMLGenerator();

function processFile(inputFile, outputFile) {
    if (args.verbose) {
        console.log(`Loading tests from ${inputFile}`);
    }

    let descriptor = parser.parseFile(inputFile);

    if (args.verbose) {
        console.log(`Preparing tests from ${descriptor.getMarkdown()}`);
    }

    let runner = new testRunner(descriptor);

    if (args.verbose) {
        console.log(`Running tests from ${runner.descriptor.getMarkdown()}`);
    }

    let result = runner.run();

    if (args.verbose) {
        console.log(`Generating HTML File at ${outputPath}/output.html`);
    }

    let resultingHtml = htmlGenerator.generate(result, result.getMarkdown(), outputPath);

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, resultingHtml);
}

// Load the user configs
const confParser = new configParser();
let {paths : {basePath, outputPath, cssFiles, template}, args} = confParser.parseConfig();

// We locate the files with the specified FileLocator from the config
if(args.verbose){
    console.log(`Loading files from ${basePath}`);
}

let fileLocator = new App.filesearch.MarkdownFileLocator();
let files = fileLocator.locateFiles(basePath);

if(cssFiles) {
    htmlGenerator.setCssFiles(cssFiles);
}

if(template) {
    htmlGenerator.setTemplate(template);
}

files.forEach((inFile) => {
    let outFile = inFile.replace(basePath, outputPath);
    outFile = outFile.replace('.md', '.html');
    processFile(inFile, outFile);
});
