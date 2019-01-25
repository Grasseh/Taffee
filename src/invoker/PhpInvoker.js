const { execSync } = require('child_process');
const GenericInvoker = require('./GenericInvoker');
const path = require('path');

/**
 * This invoker calls a php script to invoke a class and reads its output
 */

class PhpInvoker extends GenericInvoker{
    invoke(testName, project, options){
        let scriptPath = path.join(process.cwd(), 'src', 'invoker', 'PhpInvoker.php');
        let command = `php ${scriptPath} ${testName} ${options.className} ${project}`;
        let execOptions = {};
        let stdout = execSync(command, execOptions);
        return stdout.toString();
    }
}

module.exports = PhpInvoker;
