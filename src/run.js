const App = require('./index');
const fs = require('fs');
const configParser = require('./util/configParser');
const testRunner = require('./runner/TestRunner');
const HTMLGenerator = require('./output/generator');

// Load the user configs
// TODO : Search in arg for path
const confParser = new configParser();
let {paths : {basePath, outputPath, cssFiles, template}, args} = confParser.parseConfig();
// We locate the files with the specified FileLocator from the config
if(args.verbose){
    console.log(`Loading files from ${basePath}`);
}
let fileLocator = new App.interpreter.MarkdownFileLocator();
let files = fileLocator.locateFiles(basePath);

// We parse each files with the specified parser from the config
// and we generate the TestSuiteDescriptor then add it to the list
let parser = new App.interpreter.MarkdownParser();
let testSuiteDescriptors = [];

for(let file of files){
    if (args.verbose) {
        console.log(`Loading tests from ${file}`);
    }
    let testSuiteDescriptor = parser.parseFile(file);
    testSuiteDescriptors.push(testSuiteDescriptor);
}

// Create the TestRunner with each testSuiteDescriptors associated
// and bind the Invoker
let testRunners = [];
for(let descriptor of testSuiteDescriptors){
    if (args.verbose) {
        console.log(`Preparing tests from ${descriptor.getMarkdown()}`);
    }
    let runner = new testRunner(descriptor);
    testRunners.push(runner);
}

// Run each TestRunners, which generates the TestResult(s)
// contained in the TestSuiteResult
let testResults = [];
for(let runner of testRunners){
    if (args.verbose) {
        console.log(`Running tests from ${runner.descriptor.getMarkdown()}`);
    }
    let result = runner.run();
    testResults.push(result);
}

// Generate the outputs of the TestSuiteResult(s) in HTML
let htmlGenerator = new HTMLGenerator();
if(cssFiles){
    htmlGenerator.setCssFiles(cssFiles);
}
if(template){
    htmlGenerator.setTemplate(template);
}
for(let result of testResults){
    if (args.verbose) {
        console.log(`Generating HTML File at ${outputPath}/output.html`);
    }
    let resultingHtml = htmlGenerator.generate(result, result.getMarkdown(), outputPath);
    fs.writeFileSync(`${outputPath}/output.html`, resultingHtml);
}
