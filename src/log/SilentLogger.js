const VerboseLogger = require('./VerboseLogger');

class SilentLogger extends VerboseLogger {
    constructor() { super(); }

    info() {}
}

module.exports = SilentLogger;
