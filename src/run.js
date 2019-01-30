const App = require('./index');

// Regarder les argv passées au script et définir les variables suivante...
let basePath = `${__dirname}/../test/markdown`;

// Voir la config de l'utilisateur sur le projet spécifique:
// - Invokers custom à ajouter
// - Outputs
// - ???
let outputPath = `${__dirname}/../test/markdown/output`;
console.log(outputPath);

// Utilise le FileLocator défini dans la config
let fileLocator = new App.interpreter.MarkdownFileLocator();
let files = fileLocator.locateFiles(basePath);
console.log(files);
