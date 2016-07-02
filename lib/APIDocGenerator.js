"use strict";
const changelog_1 = require("./model/changelog");
const yamlParser_1 = require("./utils/yamlParser");
const apiDefinition_1 = require("./model/apiDefinition");
const definitionValidator_1 = require("./utils/definitionValidator");
const generatedFile_1 = require("./model/generatedFile");
class APIDocGenerator {
    load(definition, changelog) {
        this._defStr = definition;
        const def = yamlParser_1.default.parse(definition);
        definitionValidator_1.default.validate(def);
        console.log("Parsing changelog ...");
        this._changelog = new changelog_1.default();
        this._changelog.parse(changelog);
        console.log("Done");
        console.log("Parsing api definition ...");
        this._definition = new apiDefinition_1.default();
        this._definition.parse(def);
        console.log("Done");
    }
    preprocess() {
        console.log("Pre-processing api definition ...");
        this._definition.preprocess();
        console.log("Done");
    }
    generate(version) {
        this._generatedFile = [];
        this._generatedFile.push(new generatedFile_1.GeneratedFile(`/${version}/def.yaml`, this._defStr));
        this._generatedFile.push(this._changelog.generateVersionFile());
        this._generatedFile.push(this._definition.generateRootFile(this._changelog));
        this._generatedFile.push(this._definition.generateDefinitionFile(this._changelog, version));
        return this._generatedFile;
    }
    get publicDir() {
        return __dirname + "/../resources/public/";
    }
}
exports.APIDocGenerator = APIDocGenerator;
