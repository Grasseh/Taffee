const { execSync } = require('child_process');
const GenericInvoker = require('./GenericInvoker');
const path = require('path');

/**
 * This invoker calls a php script to invoke a class and reads its output
 */

class PhpInvoker extends GenericInvoker{
    invoke(testName, project, options){
        let scriptPath = path.join(this._getCwd(), 'src', 'invoker', 'PhpInvoker.php');
        let command = `php ${scriptPath} ${testName} ${options.className} "${project}"`;
        let execOptions = {};
        let stdout = this._exec(command, execOptions);
        return stdout.toString();
    }

    _getCwd(){
        return process.cwd();
    }

    _exec(command, options){
        return execSync(command, options);
    }
}

module.exports = PhpInvoker;
