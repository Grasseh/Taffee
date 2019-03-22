const cosmiconfig = require('cosmiconfig');
const ArgumentParser = require('argparse').ArgumentParser;

class ConfigParser{
    parseConfig(){
        let configPath = this.parseArgs();
        return this.parsePaths(configPath);
    }

    parseArgs(){
        let parser = new (this._getArgParser())({
            version: '0.2',
            addHelp: true,
            description: 'Behavior Driven Development Test Framework'
        });
        parser.addArgument(
            ['-c', '--config'],
            {
                help: 'path to the config file'
            }
        );
        let args = parser.parseArgs();
        return args.config;
    }

    parsePaths(configPath){
        const explorer = this._getCosmiconfig()('pfe');
        let configs = explorer.searchSync();
        if(configPath){
            configs = explorer.loadSync(configPath);
        }
        if(!configs){
            console.error('No config file found!');
            return this._getProcess().exit(1);
        }
        let basePath = configs.config.basePath;
        let outputPath = configs.config.outputPath;
        let cssFiles = configs.config.cssFiles;
        let template = configs.config.template;
        return {basePath, outputPath};
    }

    _getArgParser(){
        return ArgumentParser;
    }

    _getCosmiconfig(){
        return cosmiconfig;
    }

    _getProcess(){
        return process;
    }
}

module.exports = ConfigParser;