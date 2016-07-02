const fs = require('fs');
const path = require('path');
const ncp = require('ncp');
const apiDocGenrerator = require('./lib/APIDocGenerator').APIDocGenerator;

function generateDocumentation (definitionPath,
                                changelogPath,
                                currentVersion,
                                destinationDirectory,
                                callback) {
  const defintionStr = fs.readFileSync(definitionPath, "utf8");
  const changelogStr = fs.readFileSync(changelogPath, "utf8");

  // Doc generator
  const docGen = new apiDocGenrerator();
  docGen.load(defintionStr, changelogStr);
  docGen.preprocess();

  const generatedFiles = docGen.generate(currentVersion);

  try {
    fs.accessSync(destinationDirectory);
  } catch (e) {
    fs.mkdirSync(destinationDirectory);
  }

  generatedFiles.forEach(function (generatedFile) {
    const containingDir = path.dirname(path.join(destinationDirectory, generatedFile.path));

    try {
      fs.accessSync(containingDir);
    } catch (e) {
      fs.mkdirSync(containingDir);
    }

    fs.writeFileSync(path.join(destinationDirectory, generatedFile.path), generatedFile.content);
  });

  ncp(docGen.publicDir, destinationDirectory, {clobber: false}, function (err) {
    callback(err);
  });
}

module.exports.generateDocumentation = generateDocumentation;