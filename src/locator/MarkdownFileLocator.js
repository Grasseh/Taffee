const fs = require('fs');
const path = require('path');

const ACCEPTED_EXTENSIONS = ['.md', '.mdwn', '.mdown', '.mkd', '.mkdn', '.markdown', '.Rmd'];

class MarkdownFileLocator {
    locateFiles(basePath) {
        if (false === fs.existsSync(basePath)) {
            return [];
        }

        return this._scanPath(basePath);
    }

    _scanPath(basePath) {
        let ext = path.extname(basePath);
        if('' !== ext && !ACCEPTED_EXTENSIONS.includes(ext)) {
            return [];
        }

        if(ACCEPTED_EXTENSIONS.includes(ext)) {
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
