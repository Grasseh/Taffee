const GenericFileLocator = require('./GenericFileLocator');

const fs = require('fs');
const path = require('path');

class MarkdownFileLocator extends GenericFileLocator{
    locateFiles(basePath, options = {recursive: false}){
        return this._readdir(basePath, options);
    }

    _readdir(basePath, options){
        let files = fs.readdirSync(basePath, {withFileTypes: true});
        let foundFiles = [];

        files.forEach(file => {
            if(file.isFile()) {
                let ext = path.extname(path.join(basePath, file.name));

                if(ext === '.md')
                    foundFiles.push(path.join(basePath, file.name));

            }
            else if(file.isDirectory() && options.recursive) {
                let foundFilesInSubDir = this._readdir(path.join(basePath, file.name), options);
                foundFiles = foundFiles.concat(foundFilesInSubDir);
            }
        });

        return foundFiles;
    }
}

module.exports = MarkdownFileLocator;
