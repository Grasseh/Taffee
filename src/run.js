const App = require('./index');

// Lookup the argv sent to the script for the run
// (possibly use https://www.npmjs.com/package/yargs)
let basePath = `${__dirname}/../test/markdown`;

// Check the config of the project from the end user
// (possibly use https://www.npmjs.com/package/cosmiconfig)
// - Custom invokers
// - Outputs
// - ???
let outputPath = `${__dirname}/../test/markdown/output`; // eslint-disable-line no-unused-vars

// We locate the files with the specified FileLocator from the config
let fileLocator = new App.interpreter.MarkdownFileLocator();
let files = fileLocator.locateFiles(basePath);

// We parse each files with the specified parser from the config
// and we generate the TestSuiteDescriptor then add it to the list
let parser = new App.interpreter.MarkdownParser();
let testSuiteDescriptors = [];

files.forEach(file => {
    let testSuiteDescriptor = parser.parseFile(file);
    testSuiteDescriptors.push(testSuiteDescriptor);
});

// Create the TestRunner with each testSuiteDescriptors associated
// and bind the Invoker

// Run each TestRunners, which generates the TestResult(s)
// contained in the TestSuiteResult

// Generate the outputs of the TestSuiteResult(s) in HTML
