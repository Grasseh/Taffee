const cosmiconfig = require('cosmiconfig');
const ArgumentParser = require('argparse').ArgumentParser;

class ConfigParser {
    parseConfig(logger) {
        let args = this.parseArgs();
        return { paths: this.parsePaths(args.config, logger), args };
    }

    parseArgs() {
        let parser = new (this._getArgParser())({
            version: '0.3',
            addHelp: true,
            description: 'Behavior Driven Development Test Framework'
        });

        parser.addArgument(
            ['-c', '--config'],
            {
                help: 'Path to the configuration file.'
            },
        );

        parser.addArgument(
            ['-e', '--verbose'],
            {
                help: 'Increase software verbosity.',
                nargs: 0,
                defaultValue : false
            }
        );

        let args = parser.parseArgs();
        return args;
    }

    parsePaths(configPath, logger) {
        const explorer = this._getCosmiconfig()('taffee');
        let configs = explorer.searchSync();

        if(configPath) {
            configs = explorer.loadSync(configPath);
        }

        if(!configs) {
            logger.error('No config file found!');
            return this._getProcess().exit(1);
        }

        let baseInputPath = configs.config.basePath;
        let baseOutputPath = configs.config.outputPath;
        let cssFiles = configs.config.cssFiles;
        let template = configs.config.template;
        return { baseInputPath, baseOutputPath, cssFiles, template };
    }

    _getArgParser() {
        return ArgumentParser;
    }

    _getCosmiconfig() {
        return cosmiconfig;
    }

    _getProcess() {
        return process;
    }
}

module.exports = ConfigParser;
