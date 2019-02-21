const { execSync } = require('child_process');
const GenericInvoker = require('./GenericInvoker');
const path = require('path');
const fs = require('fs');

/**
 * This invoker calls a php script to invoke a class and reads its output
 */

class PhpInvoker extends GenericInvoker{
    invoke(testName, project, options){
        let scriptPath = path.join(this._getCwd(), 'src', 'invoker', 'PhpInvoker.php');
        let paramsLocation = path.join(this._getCwd(), 'tmp');
        if(!this._getFs().existsSync(paramsLocation))
            this._getFs().mkdirSync(paramsLocation);
        let paramsFile = path.join(paramsLocation, 'params.json');
        this._getFs().writeFileSync(paramsFile, options.params);
        let command = `php "${scriptPath}" ${testName} ${options.className} "${project}" "${paramsFile}"`;
        let execOptions = {};
        let stdout = this._exec(command, execOptions);
        this._getFs().unlinkSync(paramsFile);
        return stdout.toString();
    }

    _getCwd(){
        return process.cwd();
    }

    _exec(command, options){
        return execSync(command, options);
    }

    _getFs(){
        return fs;
    }
}

module.exports = PhpInvoker;
