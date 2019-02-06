const assert = require('assert');
const path = require('path');
const HelloWorld = require('./helloWorld');
const Application = require('./application');

let application = new Application();

application.start();
