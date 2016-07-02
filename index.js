const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
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

  fse.ensureDirSync(destinationDirectory);

  generatedFiles.forEach(function (generatedFile) {
    const containingDir = path.dirname(path.join(destinationDirectory, generatedFile.path));

    fse.ensureDirSync(containingDir);

    fs.writeFileSync(path.join(destinationDirectory, generatedFile.path), generatedFile.content);
  });

  fse.copy(docGen.publicDir, destinationDirectory, function (err) {
    callback(err);
  });
}

module.exports.generateDocumentation = generateDocumentation;