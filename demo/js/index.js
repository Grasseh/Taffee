'use strict';

const Application = require('./application');
const Test = require('./test');

let runTest = false;
if (process.argv.length === 3){
    runTest = process.argv[2];
}

if (runTest === 'true' || runTest === '1'){
    let test = new Test();
    test.start();
}

let application = new Application();
application.start();
