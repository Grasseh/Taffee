const fs = require('fs');
const path = require('path');

const DESIRED_EXT = '.md';

class MarkdownFileLocator {
    locateFiles(basePath) {
        if (false === fs.existsSync(basePath)) {
            console.log('Specified path not found.');
            return [];
        }

        if(DESIRED_EXT === path.extname(basePath)) {
            return [basePath];
        }

        return this._scanPath(basePath);
    }

    _scanPath(basePath) {
        let ext = path.extname(basePath);
        if('' !== ext && DESIRED_EXT !== ext) {
            return [];
        }

        if(DESIRED_EXT === path.extname(basePath)) {
            return [basePath];
        }

        let foundFiles = [];
        let files = fs.readdirSync(basePath);
        files.forEach((file) => {
            foundFiles = foundFiles.concat(this._scanPath(path.join(basePath, file)));
        });

        return foundFiles;
    }
}

module.exports = MarkdownFileLocator;
