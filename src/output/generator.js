const fs = require('fs');
const showdown = require('showdown');

class HTMLGenerator {
    generate(mdFilePath) {
        console.log(mdFilePath);
        let mdContent = fs.readFileSync(mdFilePath, 'UTF-8');
        let htmlContent = this._convertFile(mdContent);
        return htmlContent;
    }

    _convertFile(mdContent) {
        let converter = new showdown.Converter();
        return converter.makeHtml(mdContent);
    }
}

module.exports = HTMLGenerator;
